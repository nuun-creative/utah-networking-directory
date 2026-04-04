import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch active events, sorted by date
export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Subscribe to founder list
export async function subscribe(email, name) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert({ email, name, source: 'founder-list' });

  if (error) {
    if (error.code === '23505') return { alreadyExists: true };
    throw error;
  }
  return { success: true };
}

// Get subscriber count
export async function getSubscriberCount() {
  const { count, error } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true });

  if (error) return 0;
  return count || 0;
}

// Admin: fetch ALL events (including inactive)
export async function fetchAllEventsAdmin() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Admin: create event
export async function createEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: update event
export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: delete event
export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Auth
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
