import { useState, useMemo, useEffect } from "react";

const EVENTS = [
  {
    id: 1,
    title: "Friday Connections: Multi-Chamber Networking",
    organizer: "ChamberWest / SSL Chamber / Murray Chamber",
    date: "2026-04-17",
    time: "8:00 AM – 9:30 AM",
    location: "West Valley City",
    venue: "Rotating venues across SL County",
    region: "Salt Lake County",
    category: "Chamber",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "3rd Friday of every month",
    url: "https://www.chamberwest.com/friday-connections-networking-event/",
    description: "Speed networking across multiple chambers. Meet professionals from ChamberWest, South Salt Lake, Murray Area, and Utah Pacific Islander chambers."
  },
  {
    id: 2,
    title: "Business Women's Forum — Spring Mixer",
    organizer: "Salt Lake Chamber",
    date: "2026-04-14",
    time: "11:30 AM – 1:00 PM",
    location: "Salt Lake City",
    venue: "Salt Lake Chamber, 175 E 400 S",
    region: "Salt Lake County",
    category: "Professional Development",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://business.slchamber.com/events/details/business-women-s-forum-2026-spring-mixer-15862",
    description: "Monthly forum empowering women in business through leadership panels, networking, and skill-building workshops hosted by the Salt Lake Chamber."
  },
  {
    id: 3,
    title: "CONNECT Utah STG Weekly Networking",
    organizer: "CONNECT Utah",
    date: "2026-03-26",
    time: "11:30 AM – 1:00 PM",
    location: "St. George",
    venue: "600 S Medical Center Dr, St. George",
    region: "Southern Utah",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Every Wednesday",
    url: "https://435locals.com/event/connect-utah-stg-4/",
    description: "Drop-in weekly networking in Southern Utah. No RSVP needed — just bring business cards and connect with local professionals and entrepreneurs."
  },
  {
    id: 4,
    title: "ACG Utah: Intermountain DealSource Summit",
    organizer: "ACG Utah",
    date: "2026-03-11",
    time: "All Day (Mar 11–13)",
    location: "Park City",
    venue: "Grand Hyatt at Deer Valley, 1702 Glencoe Mountain Way",
    region: "Summit County",
    category: "Conference",
    industry: "Finance & Investment",
    cost: "Paid",
    recurring: false,
    url: "https://www.acg.org/utah/events",
    description: "Multi-day dealmaking summit bringing together M&A professionals, private equity firms, and investment bankers for curated meetings and networking."
  },
  {
    id: 5,
    title: "Utah Business Founder Series",
    organizer: "Utah Business Magazine",
    date: "2026-09-18",
    time: "9:00 AM",
    location: "Lehi",
    venue: "Kiln Coworking",
    region: "Utah County",
    category: "Speaker Event",
    industry: "Startups & Entrepreneurship",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.utahbusiness.com/events/",
    description: "Intimate fireside chat with a Utah founder who built a nationally recognized brand. Networking with fellow entrepreneurs and business leaders."
  },
  {
    id: 6,
    title: "Utah Business Healthcare Heroes",
    organizer: "Utah Business Magazine",
    date: "2026-10-15",
    time: "TBA",
    location: "Salt Lake City",
    venue: "TBA",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Healthcare",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/events/",
    description: "Award ceremony and networking event recognizing outstanding contributions to healthcare across Utah. Connect with top healthcare professionals and executives."
  },
  {
    id: 7,
    title: "Start School with Adam Edmunds",
    organizer: "Silicon Slopes",
    date: "2026-04-03",
    time: "12:00 PM – 1:00 PM",
    location: "Lehi",
    venue: "Silicon Slopes HQ, 2600 W Executive Pkwy",
    region: "Utah County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Ongoing program",
    url: "https://www.siliconslopes.com/events",
    description: "Start School speaker series at Silicon Slopes HQ. Hear from founders building real businesses. Free, in-person, recurring weekly/biweekly. Check siliconslopes.com/events for upcoming speakers."
  },
  {
    id: 8,
    title: "UVU Small Business Expo",
    organizer: "Utah Valley University Business Resource Center",
    date: "2026-10-16",
    time: "7:30 AM – 1:00 PM",
    location: "Sandy",
    venue: "SLCC Miller Campus, 9750 S 300 W",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Small Business",
    cost: "Free",
    recurring: false,
    url: "https://www.uvu.edu/uvbrc/events/",
    description: "Expo featuring booth exhibitors, breakout sessions, guest speakers, and networking for small business owners and aspiring entrepreneurs."
  },
  {
    id: 9,
    title: "Salt Lake Chamber Member Orientation",
    organizer: "Salt Lake Chamber",
    date: "2026-04-16",
    time: "12:00 PM – 1:00 PM",
    location: "Salt Lake City",
    venue: "Salt Lake Chamber, 175 E 400 S",
    region: "Salt Lake County",
    category: "Chamber",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://slchamber.com/events-programs/",
    description: "Learn about Salt Lake Chamber membership benefits. Great entry point for new members looking to maximize their networking and business resources."
  },
  // ── UTAH BUSINESS MAGAZINE (new) ──
  {
    id: 10,
    title: "CEO of the Year Awards",
    organizer: "Utah Business Magazine",
    date: "2026-03-31",
    time: "11:00 AM",
    location: "Salt Lake City",
    venue: "The Grand America Hotel",
    region: "Salt Lake County",
    category: "Speaker Event",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/ceo-of-the-year/",
    description: "Annual awards honoring Utah CEOs who have led their organizations with strength, courage, and endurance. Premier networking with top executives."
  },
  {
    id: 11,
    title: "Founder Friday: Gavin Christensen (Kickstart)",
    organizer: "Utah Business Magazine",
    date: "2026-04-24",
    time: "9:00 AM",
    location: "Lehi",
    venue: "Kiln Coworking, Lehi",
    region: "Utah County",
    category: "Speaker Event",
    industry: "Startups & Entrepreneurship",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.utahbusiness.com/founder-friday/",
    description: "Intimate fireside chat with Gavin Christensen, founder of Kickstart, on building a nationally recognized brand. Networking with fellow entrepreneurs."
  },
  {
    id: 12,
    title: "Women to Watch Awards",
    organizer: "Utah Business Magazine",
    date: "2026-05-20",
    time: "TBA",
    location: "Salt Lake City",
    venue: "The Grand America Hotel",
    region: "Salt Lake County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/30-women-to-watch/",
    description: "Spotlight on women carving out legacies, shattering norms, and paving the way for the next generation of female leaders in Utah business."
  },
  {
    id: 13,
    title: "Founder Friday: Ryan Anderson (Filevine)",
    organizer: "Utah Business Magazine",
    date: "2026-05-22",
    time: "9:00 AM",
    location: "Lehi",
    venue: "Kiln Coworking, Lehi",
    region: "Utah County",
    category: "Speaker Event",
    industry: "Startups & Entrepreneurship",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.utahbusiness.com/founder-friday/",
    description: "Fireside chat with Ryan Anderson, founder of Filevine, on building a nationally recognized legal-tech brand from Utah."
  },
  {
    id: 14,
    title: "Executive Excellence Awards",
    organizer: "Utah Business Magazine",
    date: "2026-06-23",
    time: "TBA",
    location: "Salt Lake City",
    venue: "David Eccles School of Business",
    region: "Salt Lake County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/executive-excellence/",
    description: "Honoring executive team members whose vision and expertise are vital to company growth. Networking with Utah's top C-suite leaders."
  },
  {
    id: 15,
    title: "Innovation Awards Summit",
    organizer: "Utah Business Magazine",
    date: "2026-09-02",
    time: "8:30 AM – 1:00 PM",
    location: "West Valley City",
    venue: "Utah Cultural Celebration Center",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/innovation-awards/",
    description: "Statewide celebration of problem-solving, creativity, and technology. Connect with Utah's most innovative companies and leaders."
  },
  {
    id: 16,
    title: "Best Companies to Work For Awards",
    organizer: "Utah Business Magazine",
    date: "2026-12-10",
    time: "TBA",
    location: "Salt Lake City",
    venue: "The Grand America Hotel",
    region: "Salt Lake County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://www.utahbusiness.com/best-companies-to-work-for/",
    description: "Recognizing Utah's premier employers as rated by their own workforce. Network with HR leaders and top-rated companies."
  },
  // ── CACHE VALLEY CHAMBER ──
  {
    id: 17,
    title: "Cache Valley Women in Business Luncheon",
    organizer: "Cache Valley Chamber of Commerce",
    date: "2026-04-08",
    time: "11:30 AM – 1:00 PM",
    location: "Logan",
    venue: "TBA, Logan",
    region: "Cache County",
    category: "Chamber",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://business.cachechamber.com/events/details/women-in-business-luncheon-04-08-2026-37022",
    description: "Cache Valley Chamber monthly networking event. Tools, networking opportunities, and services for the Logan-area business community."
  },
  // ── WOMEN TECH COUNCIL ──
  {
    id: 18,
    title: "Women Tech Awards Luncheon",
    organizer: "Women Tech Council",
    date: "2026-10-02",
    time: "11:00 AM – 1:30 PM",
    location: "Salt Lake City",
    venue: "The Grand America Hotel",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.womentechcouncil.com/awards/",
    description: "Annual awards recognizing women driving innovation in tech. 150+ women honored over the years. Premier networking with 10,000+ member community."
  },
  {
    id: 19,
    title: "SCORE Start SMART Workshop",
    organizer: "SCORE Utah",
    date: "2026-03-23",
    time: "10:00 AM – 12:00 PM",
    location: "Salt Lake City",
    venue: "Innovation Center, SLC",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Small Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.score.org/utah/event/start-smart-workshop-own-your-own-business",
    description: "Free workshop answering basic business start-up questions. Learn how to begin planning your dream business with SCORE certified mentors."
  },
  // ── TOURISM WORKSHOP ──
  {
    id: 20,
    title: "Tourism Business Development Workshop",
    organizer: "Utah Office of Tourism",
    date: "2026-04-22",
    time: "All Day (Apr 22-23)",
    location: "Kanab",
    venue: "Kanab Center",
    region: "Southern Utah",
    category: "Workshop",
    industry: "Hospitality & Tourism",
    cost: "Free",
    recurring: false,
    url: "https://travel.utah.gov/workshop/",
    description: "Two-day state-sponsored workshop on tourism business development. Agritourism, astrotourism, and destination development. Free registration."
  },
  // ── OPEN EDX CONFERENCE ──
  {
    id: 21,
    title: "Open edX Conference 2026",
    organizer: "Open edX / Western Governors University",
    date: "2026-05-19",
    time: "All Day (May 19-22)",
    location: "Salt Lake City",
    venue: "Little America Hotel, 500 S Main St",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Education & Training",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/e/open-edx-conference-2026-tickets-1967626286189",
    description: "Global conference for educators, developers, and innovators. Keynotes, demos, networking, and collaboration roundtables. Hosted by WGU."
  },
  {
    id: 22,
    title: "Impactful™ Business Networking",
    organizer: "Impactful Networking",
    date: "2026-04-02",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/e/impactfultm-business-networking-tickets-1984733256598",
    description: "Monthly business networking event in Salt Lake City. Build meaningful connections with professionals across industries."
  },
  {
    id: 23,
    title: "Business Networking 1-Day Workshop",
    organizer: "LearneRRing",
    date: "2026-04-10",
    time: "9:00 AM – 5:00 PM",
    location: "Multiple Utah locations",
    venue: "SLC, West Valley, St. George, Provo, West Jordan",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Professional Development",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Apr 10, May 8, Jun 12, Jul 10",
    url: "https://www.eventbrite.com/e/business-networking-1-day-workshop-salt-lake-city-ut-tickets-1931673008969",
    description: "Full-day workshop on strategic networking skills at locations across Utah. Covers personal branding, elevator pitches, LinkedIn optimization, and follow-up strategies. Certificate included. Dates: Apr 10, May 8, Jun 12, Jul 10."
  },
  {
    id: 24,
    title: "Salt Lake City Career Fair",
    organizer: "Various Organizers",
    date: "2026-04-15",
    time: "10:00 AM – 2:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "General Business",
    cost: "Free",
    recurring: false,
    url: "https://www.eventbrite.com/e/salt-lake-city-career-fair-tickets-909388333987",
    description: "Career fair connecting job seekers with employers across multiple industries in Salt Lake City. Networking and interview opportunities."
  },
  {
    id: 25,
    title: "NIAX March Social — Midvale",
    organizer: "NIAX",
    date: "2026-03-27",
    time: "5:30 PM – 7:30 PM",
    location: "Midvale",
    venue: "TBA, Midvale",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://allevents.in/midvale/niax-march-social-midvale/100001984012703404",
    description: "NIAX monthly social networking event in Midvale. Relaxed format for building trusted business relationships."
  },
  {
    id: 26,
    title: "NIAX Next Level Networking — Sandy",
    organizer: "NIAX",
    date: "2026-04-10",
    time: "3:30 PM – 5:00 PM",
    location: "Sandy",
    venue: "TBA, Sandy",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://allevents.in/sandy/niax-next-level-networking/100001985631988730",
    description: "Structured, relationship-driven networking in Sandy. Build trusted referral partnerships with growth-minded professionals."
  },
  {
    id: 27,
    title: "NIAX Next Level Networking — Farmington",
    organizer: "NIAX",
    date: "2026-04-17",
    time: "3:30 PM – 5:00 PM",
    location: "Farmington",
    venue: "TBA, Farmington",
    region: "Davis County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://allevents.in/farmington/niax-next-level-networking/100001985595836598",
    description: "Structured networking in Davis County. NIAX's relationship-driven model focused on generating real business referrals."
  },
  {
    id: 28,
    title: "2026 Pillar of the Valley",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-04-14",
    time: "7:00 PM – 9:00 PM",
    location: "Provo",
    venue: "Utah Valley Convention Center, 220 W Center St, Provo",
    region: "Utah County",
    category: "Speaker Event",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Utah Valley Chamber's annual Pillar of the Valley awards event at the Convention Center. Networking with business leaders across Utah County."
  },
  {
    id: 29,
    title: "Utah Valley Job Fair",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-08-25",
    time: "2:00 PM – 5:00 PM",
    location: "Provo",
    venue: "Utah Valley Convention Center, 220 W Center St, Provo",
    region: "Utah County",
    category: "Conference",
    industry: "General Business",
    cost: "Free",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Utah Valley job fair connecting employers with job seekers. Networking opportunities for businesses and professionals."
  },
  {
    id: 30,
    title: "2026 Executive Summits",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-10-23",
    time: "7:00 AM – 3:00 PM",
    location: "Sundance",
    venue: "Sundance Mountain Resort, 8841 Alpine Loop Scenic Byway",
    region: "Utah County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Full-day executive summit at Sundance Mountain Resort. Keynotes, breakout sessions, and mountain-setting networking."
  },
  {
    id: 31,
    title: "2026 Growth & Prosperity Summit",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-11-12",
    time: "8:00 AM – 2:00 PM",
    location: "Orem",
    venue: "Utah Valley University, Sorensen Center Ballroom, 800 W University Pkwy",
    region: "Utah County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Annual growth and prosperity summit at UVU. Business development, economic outlook, and networking."
  },
  {
    id: 32,
    title: "SBDC: Cash Flow is King Workshop (with AI) — MCPC 101",
    organizer: "Utah Small Business Development Center",
    date: "2026-04-14",
    time: "9:00 AM – 12:00 PM",
    location: "Salt Lake City",
    venue: "Salt Lake SBDC, Salt Lake Community College",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Small Business",
    cost: "Paid",
    recurring: false,
    url: "https://clients.utahsbdc.org/events.aspx",
    description: "SBDC workshop on cash flow management with AI tools. Fee: $99. At Salt Lake Community College."
  },
  {
    id: 33,
    title: "Founders Space: Quick Connects & Beers",
    organizer: "Silicon Slopes",
    date: "2026-03-25",
    time: "8:00 AM – 8:30 AM",
    location: "Virtual",
    venue: "Virtual (Silicon Slopes)",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Every Tuesday",
    url: "https://www.siliconslopes.com/events",
    description: "Quick 30-minute virtual networking every Tuesday morning. Speed-connect with other founders and entrepreneurs in the Silicon Slopes community."
  },
  {
    id: 34,
    title: "BSidesSLC Security Conference",
    organizer: "BSidesSLC",
    date: "2026-04-09",
    time: "8:00 AM – 5:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.siliconslopes.com/events",
    description: "Two-day information security conference in Salt Lake City (Apr 9-10). Talks, workshops, and networking for cybersecurity professionals."
  },
  {
    id: 35,
    title: "Vibe Code Club for Entrepreneurs",
    organizer: "Silicon Slopes",
    date: "2026-04-07",
    time: "11:30 AM – 1:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Technology",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Biweekly",
    url: "https://www.siliconslopes.com/events",
    description: "Hands-on coding club for entrepreneurs at Silicon Slopes. Learn to build and ship products. In-person, biweekly."
  },
  {
    id: 36,
    title: "Silicon Slopes Military Chapter Mixer",
    organizer: "Silicon Slopes Military Chapter",
    date: "2026-04-21",
    time: "6:00 PM – 7:30 PM",
    location: "Lehi",
    venue: "TBA, Lehi",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: false,
    url: "https://www.siliconslopes.com/events",
    description: "Networking mixer for military-connected professionals in the Silicon Slopes tech community. Open to veterans, active duty, and military spouses."
  },
  {
    id: 37,
    title: "Utah HIMSS Annual Conference",
    organizer: "HIMSS Utah Chapter",
    date: "2026-04-24",
    time: "8:00 AM – 5:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Healthcare",
    cost: "Paid",
    recurring: false,
    url: "https://www.siliconslopes.com/events",
    description: "Annual healthcare IT conference with local Utah HealthTech companies. Networking with healthcare technology professionals."
  },
  {
    id: 38,
    title: "Red Rock Data Science Conference 2026",
    organizer: "Red Rock Data Science",
    date: "2026-05-18",
    time: "9:00 AM – 3:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.siliconslopes.com/events",
    description: "Multi-day data science conference (May 18-21). Talks, workshops, and networking for data scientists and AI/ML professionals."
  },
  {
    id: 39,
    title: "STACKED IT & Security Summit",
    organizer: "STACKED",
    date: "2026-09-10",
    time: "8:00 AM – 5:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.siliconslopes.com/events",
    description: "Full-day IT and security summit. In-person conference for IT leaders and cybersecurity professionals in Utah."
  }
];

const REGIONS = [...new Set(EVENTS.map(e => e.region))].sort();
const CATEGORIES = [...new Set(EVENTS.map(e => e.category))].sort();
const INDUSTRIES = [...new Set(EVENTS.map(e => e.industry))].sort();
const COSTS = ["Free", "Paid", "Members Only"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

const categoryColors = {
  "Chamber": { bg: "#1a3a2a", text: "#6ee7a0", border: "#2d5a3f" },
  "Conference": { bg: "#2a1a3a", text: "#c084fc", border: "#3f2d5a" },
  "Networking Mixer": { bg: "#1a2a3a", text: "#7dd3fc", border: "#2d3f5a" },
  "Professional Development": { bg: "#3a2a1a", text: "#fbbf24", border: "#5a3f2d" },
  "Speaker Event": { bg: "#3a1a2a", text: "#f9a8d4", border: "#5a2d3f" },
  "Workshop": { bg: "#2a3a1a", text: "#a3e635", border: "#3f5a2d" },
};

function Badge({ label, type }) {
  const colors = type === "category"
    ? (categoryColors[label] || { bg: "#2a2a2a", text: "#aaa", border: "#3a3a3a" })
    : type === "cost"
      ? label === "Free" ? { bg: "#0a2e1a", text: "#34d399", border: "#166534" }
        : label === "Members Only" ? { bg: "#2e1a0a", text: "#fb923c", border: "#653416" }
        : { bg: "#1a1a2e", text: "#a5b4fc", border: "#16165a" }
      : { bg: "#1e1e1e", text: "#999", border: "#333" };

  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.03em",
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 500,
      background: active ? "#e2e8f0" : "transparent",
      color: active ? "#0f172a" : "#94a3b8",
      border: active ? "1px solid #cbd5e1" : "1px solid #334155",
      cursor: "pointer",
      transition: "all 0.15s ease",
      whiteSpace: "nowrap",
    }}>
      {label} {active && "✕"}
    </button>
  );
}

function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const days = daysUntil(event.date);
  const isPast = days < 0;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: isPast ? "#0d0d10" : "#111118",
        border: "1px solid #1e1e2a",
        borderRadius: "12px",
        padding: "20px 24px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        opacity: isPast ? 0.5 : 1,
        animation: `fadeSlideIn 0.4s ease ${index * 0.03}s both`,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { if (!isPast) { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e2a"; e.currentTarget.style.transform = "translateY(0)"; }}
    >


      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            {event.organizer}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 500 }}>{formatDate(event.date)}</div>
          <div style={{ fontSize: "12px", color: days <= 7 && days >= 0 ? "#fbbf24" : "#64748b", marginTop: 2 }}>
            {isPast ? "Past" : days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `${days} days away`}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Badge label={event.category} type="category" />
        <Badge label={event.cost} type="cost" />
        <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: "11px" }}>📍</span> {event.location}
        </span>
        {event.recurring && (
          <span style={{
            fontSize: "11px", color: "#4ade80", fontStyle: "italic",
            display: "inline-flex", alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: "13px", fontStyle: "normal" }}>↻</span> {event.recurrenceNote}
          </span>
        )}
      </div>

      {expanded && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: "1px solid #1e1e2a",
          animation: "fadeIn 0.2s ease",
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>
            {event.description}
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 14,
          }}>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue</span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.venue}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.time}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry</span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.industry}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Region</span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.region}</p>
            </div>
          </div>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "8px 20px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Visit Event Page →
          </a>
        </div>
      )}
    </div>
  );
}

export default function UtahNetworkingDirectory() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [industryFilter, setIndustryFilter] = useState(null);
  const [costFilter, setCostFilter] = useState(null);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [hidePast, setHidePast] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupStatus, setSignupStatus] = useState("idle"); // idle | saving | success | error
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);

  // Load signup state on mount
  useEffect(() => {
    try {
      const existing = localStorage.getItem("founder-signup-done");
      if (existing) setAlreadySignedUp(true);
      const count = localStorage.getItem("founder-signup-count");
      if (count) setSubscriberCount(parseInt(count, 10));
    } catch {}
  }, []);

  const handleSignup = async () => {
    if (!signupEmail || !signupEmail.includes("@")) return;
    setSignupStatus("saving");
    try {
      const res = await fetch("https://formspree.io/f/xreynbkq", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          source: "founder-list",
          signedUpAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Formspree error");
      // Track locally so UI stays collapsed on return visits
      localStorage.setItem("founder-signup-done", "true");
      const prevCount = parseInt(localStorage.getItem("founder-signup-count") || "0", 10);
      localStorage.setItem("founder-signup-count", String(prevCount + 1));
      setSubscriberCount(prevCount + 1);
      setSignupStatus("success");
      setAlreadySignedUp(true);
    } catch {
      setSignupStatus("error");
    }
  };

  const filtered = useMemo(() => {
    let results = EVENTS.filter(e => {
      const q = search.toLowerCase();
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q)
        || e.location.toLowerCase().includes(q) || e.industry.toLowerCase().includes(q)
        || e.description.toLowerCase().includes(q);
      const matchesRegion = !regionFilter || e.region === regionFilter;
      const matchesCategory = !categoryFilter || e.category === categoryFilter;
      const matchesIndustry = !industryFilter || e.industry === industryFilter;
      const matchesCost = !costFilter || e.cost === costFilter;
      const matchesRecurring = !showRecurringOnly || e.recurring;
      const matchesPast = !hidePast || daysUntil(e.date) >= 0;
      return matchesSearch && matchesRegion && matchesCategory && matchesIndustry && matchesCost && matchesRecurring && matchesPast;
    });
    if (sortBy === "date") results.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "name") results.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "location") results.sort((a, b) => a.location.localeCompare(b.location));
    return results;
  }, [search, regionFilter, categoryFilter, industryFilter, costFilter, showRecurringOnly, hidePast, sortBy]);

  const activeFilterCount = [regionFilter, categoryFilter, industryFilter, costFilter, showRecurringOnly].filter(Boolean).length;

  const clearAll = () => {
    setRegionFilter(null); setCategoryFilter(null); setIndustryFilter(null);
    setCostFilter(null); setShowRecurringOnly(false); setSearch("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090f",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        ::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Hero */}
      <div style={{
        padding: "48px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          background: "radial-gradient(ellipse at 50% 0%, #6366f1, transparent 70%)",
        }} />
        <p style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#6366f1", margin: "0 0 12px",
        }}>
          Weekly Curated Directory
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 800,
          margin: 0,
          lineHeight: 1.1,
          background: "linear-gradient(135deg, #f1f5f9, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Utah Business
          <br />
          Networking Events
        </h1>
        <p style={{
          fontSize: "14px", color: "#64748b", marginTop: 12,
          maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5,
        }}>
          {EVENTS.length} verified events from chambers, meetups, conferences & more across the Beehive State.
          Every link checked. Updated weekly.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Founder List Signup */}
        {!alreadySignedUp ? (
          <div style={{
            background: "linear-gradient(135deg, #0f1729 0%, #1a1040 100%)",
            border: "1px solid #2a2560",
            borderRadius: "16px",
            padding: "28px 24px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40, width: 120, height: 120,
              background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
              borderRadius: "50%",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: -30, width: 100, height: 100,
              background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)",
              borderRadius: "50%",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{
                  display: "inline-block", padding: "3px 10px", borderRadius: "20px",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  color: "#fff", textTransform: "uppercase",
                }}>
                  Founder Access
                </span>
                {subscriberCount > 0 && (
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {subscriberCount} early adopter{subscriberCount !== 1 ? "s" : ""} joined
                  </span>
                )}
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px", fontWeight: 700, margin: "0 0 6px",
                color: "#f1f5f9",
              }}>
                Join the Founder List
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 18px", lineHeight: 1.5, maxWidth: 520 }}>
                Get curated Utah networking events delivered to your inbox every Monday.
                Founder List members get <span style={{ color: "#a78bfa", fontWeight: 600 }}>free lifetime access</span> when
                we launch our subscription service next month.
              </p>

              {signupStatus === "success" ? (
                <div style={{
                  background: "#0a2e1a", border: "1px solid #166534", borderRadius: "10px",
                  padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: "20px" }}>✓</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#4ade80", fontWeight: 600 }}>You're on the Founder List!</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6ee7a0" }}>
                      Check your inbox Monday for your first weekly digest. Lifetime access secured.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="First name"
                    style={{
                      flex: "0 1 140px", padding: "11px 14px", borderRadius: "8px",
                      border: "1px solid #2a2560", background: "#0d0d1a",
                      color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit",
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#2a2560"}
                  />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="you@email.com"
                    onKeyDown={e => e.key === "Enter" && handleSignup()}
                    style={{
                      flex: "1 1 200px", padding: "11px 14px", borderRadius: "8px",
                      border: "1px solid #2a2560", background: "#0d0d1a",
                      color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit",
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#2a2560"}
                  />
                  <button
                    onClick={handleSignup}
                    disabled={signupStatus === "saving" || !signupEmail}
                    style={{
                      flex: "0 0 auto",
                      padding: "11px 22px", borderRadius: "8px", border: "none",
                      background: signupStatus === "saving"
                        ? "#334155"
                        : "linear-gradient(135deg, #6366f1, #a855f7)",
                      color: "#fff", fontSize: "13px", fontWeight: 600,
                      cursor: signupStatus === "saving" ? "wait" : "pointer",
                      fontFamily: "inherit", letterSpacing: "0.02em",
                      opacity: !signupEmail ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {signupStatus === "saving" ? "Joining..." : "Join Free →"}
                  </button>
                </div>
              )}
              {signupStatus === "error" && (
                <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#f87171" }}>
                  Something went wrong — please try again.
                </p>
              )}
              <p style={{ margin: "12px 0 0", fontSize: "11px", color: "#475569" }}>
                No spam, ever. Unsubscribe anytime. Your data stays private.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#0d1117", border: "1px solid #1e2a3a", borderRadius: "12px",
            padding: "14px 20px", marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "16px" }}>✓</span>
              <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 500 }}>
                You're a Founder List member — lifetime access secured
              </span>
            </div>
            {subscriberCount > 0 && (
              <span style={{ fontSize: "11px", color: "#475569" }}>
                {subscriberCount} founder{subscriberCount !== 1 ? "s" : ""} & counting
              </span>
            )}
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: "16px", color: "#475569", pointerEvents: "none",
          }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events, organizers, locations..."
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              borderRadius: "12px",
              border: "1px solid #1e1e2a",
              background: "#111118",
              color: "#e2e8f0",
              fontSize: "14px",
              outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={e => e.target.style.borderColor = "#334155"}
            onBlur={e => e.target.style.borderColor = "#1e1e2a"}
          />
        </div>

        {/* Filters */}
        <div style={{
          background: "#0d0d14",
          border: "1px solid #1e1e2a",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </span>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} style={{
                background: "none", border: "none", color: "#6366f1",
                fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
              }}>Clear all</button>
            )}
          </div>

          {/* Region */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Region:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {REGIONS.map(r => (
                <FilterPill key={r} label={r} active={regionFilter === r}
                  onClick={() => setRegionFilter(regionFilter === r ? null : r)} />
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Type:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <FilterPill key={c} label={c} active={categoryFilter === c}
                  onClick={() => setCategoryFilter(categoryFilter === c ? null : c)} />
              ))}
            </div>
          </div>

          {/* Industry */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Industry:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {INDUSTRIES.map(i => (
                <FilterPill key={i} label={i} active={industryFilter === i}
                  onClick={() => setIndustryFilter(industryFilter === i ? null : i)} />
              ))}
            </div>
          </div>

          {/* Cost + Recurring */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Cost:</span>
              <span style={{ display: "inline-flex", gap: 4 }}>
                {COSTS.map(c => (
                  <FilterPill key={c} label={c} active={costFilter === c}
                    onClick={() => setCostFilter(costFilter === c ? null : c)} />
                ))}
              </span>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "12px", color: "#94a3b8" }}>
              <input type="checkbox" checked={showRecurringOnly} onChange={e => setShowRecurringOnly(e.target.checked)}
                style={{ accentColor: "#6366f1" }} />
              Recurring only
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "12px", color: "#94a3b8" }}>
              <input type="checkbox" checked={hidePast} onChange={e => setHidePast(e.target.checked)}
                style={{ accentColor: "#6366f1" }} />
              Hide past events
            </label>
          </div>
        </div>

        {/* Sort + Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 4 }}>Sort:</span>
            {["date", "name", "location"].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: "4px 10px", borderRadius: "6px", fontSize: "11px",
                background: sortBy === s ? "#1e293b" : "transparent",
                color: sortBy === s ? "#e2e8f0" : "#64748b",
                border: "none", cursor: "pointer", textTransform: "capitalize",
                fontFamily: "inherit",
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length > 0 ? filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          )) : (
            <div style={{
              textAlign: "center", padding: 48, color: "#475569",
              border: "1px dashed #1e1e2a", borderRadius: "12px",
            }}>
              <p style={{ fontSize: "20px", margin: "0 0 8px" }}>¯\_(ツ)_/¯</p>
              <p style={{ fontSize: "14px", margin: 0 }}>No events match your filters.</p>
              <button onClick={clearAll} style={{
                marginTop: 12, padding: "8px 20px", borderRadius: "8px",
                background: "#1e293b", color: "#e2e8f0", border: "none",
                cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
              }}>Clear filters</button>
            </div>
          )}
        </div>

        {/* Bottom Signup Reminder */}
        {!alreadySignedUp && signupStatus !== "success" && (
          <div style={{
            background: "#0f1729", border: "1px solid #1e2a3a", borderRadius: "12px",
            padding: "18px 20px", marginTop: 32, textAlign: "center",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>
              Never miss an event — join the Founder List
            </p>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>
              Weekly digest every Monday + free lifetime access when we launch subscriptions.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", maxWidth: 440, margin: "0 auto" }}>
              <input
                type="email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                placeholder="you@email.com"
                onKeyDown={e => e.key === "Enter" && handleSignup()}
                style={{
                  flex: "1 1 200px", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #2a2560", background: "#0d0d1a",
                  color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit",
                }}
              />
              <button
                onClick={handleSignup}
                disabled={!signupEmail}
                style={{
                  padding: "10px 20px", borderRadius: "8px", border: "none",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  color: "#fff", fontSize: "13px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  opacity: !signupEmail ? 0.5 : 1,
                }}
              >
                Join Free →
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 40, padding: "20px 0", borderTop: "1px solid #1e1e2a",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Data sourced from Eventbrite, Meetup, Salt Lake Chamber, Utah Valley Chamber, Ogden-Weber Chamber,
            Davis Chamber, Cache Valley Chamber, Tooele Chamber, ChamberWest, Silicon Slopes, Utah Business Magazine,
            Women Tech Council, BNI Utah, NIAX, Strive Networking, SCORE Utah, SBDC, Entrepreneur Launch Pad,
            Corporate Alliance, 1 Million Cups, Kiln, Networkr, 435 Locals, Grow Utah Connectory & more.
            <br />
            Events may change — always verify on the organizer's website before attending.
          </p>
          <div style={{
            marginTop: 12,
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            background: "#111118",
            border: "1px solid #1e1e2a",
            fontSize: "11px",
            color: "#64748b",
          }}>
            Last refreshed: Week of March 23, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
