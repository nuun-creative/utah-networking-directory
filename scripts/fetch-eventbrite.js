/**
 * Eventbrite Event Fetcher
 * 
 * Run: npm run fetch-events
 * 
 * Pulls Utah business/networking events from Eventbrite API
 * and upserts them into Supabase.
 * 
 * Requires environment variables:
 *   EVENTBRITE_TOKEN — Your Eventbrite private OAuth token
 *   SUPABASE_URL — Your Supabase project URL
 *   SUPABASE_SERVICE_KEY — Supabase service_role key (NOT the anon key)
 */

import { createClient } from '@supabase/supabase-js';

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!EVENTBRITE_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables. Set EVENTBRITE_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const EVENTBRITE_BASE = 'https://www.eventbriteapi.com/v3';

// Search parameters for Utah business networking events
const SEARCH_QUERIES = [
  { q: 'business networking', 'location.address': 'Utah, US', 'location.within': '100mi' },
  { q: 'entrepreneur networking', 'location.address': 'Utah, US', 'location.within': '100mi' },
  { q: 'startup networking', 'location.address': 'Salt Lake City, UT', 'location.within': '60mi' },
  { q: 'chamber commerce', 'location.address': 'Utah, US', 'location.within': '100mi' },
  { q: 'professional networking', 'location.address': 'Salt Lake City, UT', 'location.within': '60mi' },
];

// Map Eventbrite categories/formats to our schema
const CATEGORY_MAP = {
  '101': 'Conference',        // Business & Professional
  '102': 'Conference',        // Science & Technology
  '199': 'Networking Mixer',  // Other
};

const REGION_MAP = {
  'salt lake': 'Salt Lake County',
  'west valley': 'Salt Lake County',
  'west jordan': 'Salt Lake County',
  'sandy': 'Salt Lake County',
  'draper': 'Salt Lake County',
  'murray': 'Salt Lake County',
  'south jordan': 'Salt Lake County',
  'taylorsville': 'Salt Lake County',
  'provo': 'Utah County',
  'orem': 'Utah County',
  'lehi': 'Utah County',
  'american fork': 'Utah County',
  'pleasant grove': 'Utah County',
  'ogden': 'Weber County',
  'layton': 'Davis County',
  'kaysville': 'Davis County',
  'farmington': 'Davis County',
  'bountiful': 'Davis County',
  'logan': 'Cache County',
  'park city': 'Summit County',
  'heber': 'Wasatch County',
  'st. george': 'Southern Utah',
  'st george': 'Southern Utah',
  'cedar city': 'Southern Utah',
  'hurricane': 'Southern Utah',
  'tooele': 'Tooele County',
};

function guessRegion(city) {
  if (!city) return 'Utah';
  const lower = city.toLowerCase();
  for (const [key, region] of Object.entries(REGION_MAP)) {
    if (lower.includes(key)) return region;
  }
  return 'Utah';
}

function guessCost(event) {
  if (event.is_free) return 'Free';
  return 'Paid';
}

function guessCategory(event) {
  if (event.name?.text?.toLowerCase().includes('workshop')) return 'Workshop';
  if (event.name?.text?.toLowerCase().includes('conference')) return 'Conference';
  if (event.name?.text?.toLowerCase().includes('summit')) return 'Conference';
  if (event.name?.text?.toLowerCase().includes('mixer')) return 'Networking Mixer';
  if (event.name?.text?.toLowerCase().includes('networking')) return 'Networking Mixer';
  if (event.name?.text?.toLowerCase().includes('lunch')) return 'Networking Mixer';
  if (event.name?.text?.toLowerCase().includes('speaker')) return 'Speaker Event';
  return 'Networking Mixer';
}

async function fetchEventbritePage(query, page = 1) {
  const params = new URLSearchParams({
    ...query,
    page: String(page),
    'start_date.keyword': 'this_month',
    expand: 'venue',
    token: EVENTBRITE_TOKEN,
  });

  const url = `${EVENTBRITE_BASE}/events/search/?${params}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error(`Eventbrite API error (${res.status}): ${text}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Fetch error: ${err.message}`);
    return null;
  }
}

function transformEvent(ebEvent) {
  const venue = ebEvent.venue || {};
  const address = venue.address || {};
  const city = address.city || '';
  
  const startDate = ebEvent.start?.local?.split('T')[0] || '';
  const endDate = ebEvent.end?.local?.split('T')[0] || '';
  
  const startTime = ebEvent.start?.local?.split('T')[1]?.substring(0, 5) || '';
  const endTime = ebEvent.end?.local?.split('T')[1]?.substring(0, 5) || '';
  
  // Format time display
  let timeDisplay = '';
  if (startTime && endTime) {
    const fmt = (t) => {
      const [h, m] = t.split(':');
      const hr = parseInt(h);
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const hr12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
      return `${hr12}:${m} ${ampm}`;
    };
    timeDisplay = `${fmt(startTime)} – ${fmt(endTime)}`;
  }

  return {
    title: ebEvent.name?.text || 'Untitled Event',
    organizer: ebEvent.organizer?.name || 'Unknown Organizer',
    date: startDate,
    end_date: startDate !== endDate ? endDate : null,
    time: timeDisplay,
    location: city || 'Utah',
    venue: venue.name ? `${venue.name}, ${address.localized_address_display || city}` : city,
    region: guessRegion(city),
    category: guessCategory(ebEvent),
    industry: 'General Business',
    cost: guessCost(ebEvent),
    cost_amount: null,
    recurring: false,
    recurrence_note: null,
    url: ebEvent.url || '',
    description: (ebEvent.description?.text || '').substring(0, 500),
    source: 'eventbrite',
    eventbrite_id: ebEvent.id,
    image_url: ebEvent.logo?.original?.url || null,
    is_active: true,
  };
}

async function fetchAllEvents() {
  const allEvents = new Map(); // keyed by eventbrite_id for dedup

  for (const query of SEARCH_QUERIES) {
    console.log(`\nSearching: "${query.q}" in ${query['location.address']}...`);
    
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 3) { // Max 3 pages per query
      const data = await fetchEventbritePage(query, page);
      if (!data || !data.events) {
        hasMore = false;
        break;
      }

      for (const event of data.events) {
        if (!allEvents.has(event.id)) {
          allEvents.set(event.id, transformEvent(event));
        }
      }

      console.log(`  Page ${page}: ${data.events.length} events (${allEvents.size} total unique)`);
      hasMore = data.pagination?.has_more_items || false;
      page++;

      // Rate limiting — be nice to the API
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return Array.from(allEvents.values());
}

async function upsertToSupabase(events) {
  console.log(`\nUpserting ${events.length} events to Supabase...`);
  
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const event of events) {
    const { data, error } = await supabase
      .from('events')
      .upsert(event, { onConflict: 'eventbrite_id' })
      .select();

    if (error) {
      console.error(`  Error upserting "${event.title}": ${error.message}`);
      errors++;
    } else {
      // Check if it was insert or update by checking created_at vs updated_at
      inserted++;
    }
  }

  console.log(`  Done: ${inserted} upserted, ${errors} errors`);
}

async function deactivateOldEvents() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .update({ is_active: false })
    .lt('date', today)
    .eq('recurring', false)
    .eq('is_active', true);

  if (error) {
    console.error(`Error deactivating old events: ${error.message}`);
  } else {
    console.log(`Deactivated past non-recurring events`);
  }
}

async function main() {
  console.log('=== Utah Networking Events — Eventbrite Fetch ===');
  console.log(`Date: ${new Date().toISOString()}`);
  
  const events = await fetchAllEvents();
  console.log(`\nTotal unique events found: ${events.length}`);
  
  if (events.length > 0) {
    await upsertToSupabase(events);
  }
  
  await deactivateOldEvents();
  
  console.log('\nDone!');
}

main().catch(console.error);
