import { useState, useMemo, useEffect } from "react";

const EVENTS = [
  // ── UTAH VALLEY CHAMBER ──
  {
    id: 1,
    title: "UV Chamber Luncheon",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-04-14",
    time: "7:00 PM – 9:00 PM",
    location: "Provo",
    venue: "Utah Valley Convention Center, 220 W Center St",
    region: "Utah County",
    category: "Chamber",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Utah Valley Chamber signature networking luncheon bringing together business leaders across industries for connection, keynotes, and collaboration."
  },
  {
    id: 2,
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
    id: 3,
    title: "Business Women's Forum",
    organizer: "Salt Lake Chamber",
    date: "2026-04-09",
    time: "11:30 AM – 1:00 PM",
    location: "Salt Lake City",
    venue: "Salt Lake Chamber, 175 E 400 S",
    region: "Salt Lake County",
    category: "Professional Development",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://business.slchamber.com/events",
    description: "Monthly forum empowering women in business through leadership panels, networking, and skill-building workshops hosted by the Salt Lake Chamber."
  },
  {
    id: 4,
    title: "Tech & Business Networking — Elevating Your Potential",
    organizer: "Elevating Your Potential",
    date: "2026-03-27",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA – Salt Lake City",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Technology",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/b/united-states--utah/business/",
    description: "Casual monthly meetup for tech professionals, founders, and business owners in the SLC area. Open networking format with drink specials."
  },
  {
    id: 5,
    title: "General Business Networking — Elevating Your Potential",
    organizer: "Elevating Your Potential",
    date: "2026-04-03",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA – Salt Lake City",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/b/united-states--utah/business/",
    description: "Open-format networking for professionals across all industries. A relaxed space to exchange ideas, find partners, and grow your network."
  },
  {
    id: 6,
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
    url: "https://435locals.com/event/connect-utah-stg-2-2/",
    description: "Drop-in weekly networking in Southern Utah. No RSVP needed — just bring business cards and connect with local professionals and entrepreneurs."
  },
  {
    id: 7,
    title: "Utah SBDC: Cash Flow Management Workshop",
    organizer: "Utah Small Business Development Center",
    date: "2026-04-14",
    time: "9:00 AM – 12:00 PM",
    location: "Salt Lake City",
    venue: "Salt Lake Community College",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Small Business",
    cost: "Paid",
    recurring: false,
    url: "https://clients.utahsbdc.org/events.aspx",
    description: "Hands-on workshop covering cash flow forecasting, budgeting, and financial planning for small business owners. Includes networking with SBDC advisors."
  },
  {
    id: 8,
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
    id: 9,
    title: "UV Chamber Golf Classic",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-09-14",
    time: "7:00 AM – 2:00 PM",
    location: "Provo",
    venue: "Riverside Country Club, 2701 N University Ave",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Annual golf tournament and networking day for Utah Valley business leaders. Includes lunch, prizes, and ample time for relationship building on the green."
  },
  {
    id: 10,
    title: "Silicon Slopes Startup Networking",
    organizer: "Silicon Slopes",
    date: "2026-04-08",
    time: "5:30 PM – 7:30 PM",
    location: "Lehi",
    venue: "Silicon Slopes HQ, 2600 W Executive Pkwy Ste 140",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "Technology",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.siliconslopes.com/events",
    description: "Monthly networking at Silicon Slopes HQ for founders, developers, and tech professionals. Learn, connect, and grow Utah's startup ecosystem."
  },
  {
    id: 11,
    title: "Utah Entrepreneur Community Meetup",
    organizer: "Utah's Entrepreneur Community",
    date: "2026-04-02",
    time: "6:00 PM – 8:00 PM",
    location: "Draper",
    venue: "Rotating venues — Draper/Lehi/SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Biweekly",
    url: "https://www.meetup.com/utah-tech-startups/",
    description: "Relaxed meetup for founders and small business owners covering product-market fit, MVPs, fundraising, and finding co-founders."
  },
  {
    id: 12,
    title: "Connect Share Networking",
    organizer: "Connect Share",
    date: "2026-04-01",
    time: "11:30 AM – 1:00 PM",
    location: "South Jordan",
    venue: "10808 River Front Pkwy, Ste 300",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://connectshare.com/one-page/salt-lake/",
    description: "Structured weekly networking with curated teams. Educational trainings and relationship-focused approach to business referrals."
  },
  {
    id: 13,
    title: "Connect Share Orem Networking",
    organizer: "Connect Share",
    date: "2026-04-01",
    time: "11:30 AM – 1:00 PM",
    location: "Orem",
    venue: "1155 S 800 E, Ste 156",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://connectshare.com/one-page/salt-lake/",
    description: "Structured weekly networking with curated teams in Utah County. Build lasting referral relationships with dedicated business professionals."
  },
  {
    id: 14,
    title: "UV Chamber Summit at Sundance",
    organizer: "Utah Valley Chamber of Commerce",
    date: "2026-10-23",
    time: "7:00 AM – 3:00 PM",
    location: "Sundance",
    venue: "Sundance Mountain Resort, 8841 Alpine Loop",
    region: "Utah County",
    category: "Conference",
    industry: "General Business",
    cost: "Paid",
    recurring: false,
    url: "https://thechamber.org/resources/events/",
    description: "Full-day business summit at Sundance Mountain Resort featuring keynotes, breakout sessions, and mountain-setting networking."
  },
  {
    id: 15,
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
    id: 16,
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
    id: 17,
    title: "Texas Hold'em Business Networking",
    organizer: "Various Organizers",
    date: "2026-04-10",
    time: "6:30 PM – 9:00 PM",
    location: "Salt Lake City",
    venue: "TBA – Salt Lake City",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/chamber-of-commerce/",
    description: "Unique twist on networking — play poker while building business relationships. Casual atmosphere encourages authentic conversations."
  },
  {
    id: 18,
    title: "Business Connect with The Gather Community",
    organizer: "The Gather Community",
    date: "2026-04-05",
    time: "9:00 AM – 11:00 AM",
    location: "Salt Lake City",
    venue: "TBA – Salt Lake City",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Community-driven business networking with a focus on genuine connection, collaboration, and supporting local entrepreneurs."
  },
  {
    id: 19,
    title: "Bench to Bedside Networking – Medical Innovation",
    organizer: "University of Utah Health",
    date: "2026-04-01",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "Center for Medical Innovation, The Shop SLC",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Healthcare",
    cost: "Free",
    recurring: false,
    url: "https://uofuhealth.utah.edu/center-for-medical-innovation/programs/bench-to-bedside/events",
    description: "Networking with medical device innovators, clinicians, and students. Presentations by industry professionals followed by open networking."
  },
  {
    id: 20,
    title: "Cedar City Business Networking Lunch",
    organizer: "Cedar City Chamber of Commerce",
    date: "2026-04-08",
    time: "11:30 AM – 1:00 PM",
    location: "Cedar City",
    venue: "Chef Alfredo's, Cedar City",
    region: "Southern Utah",
    category: "Chamber",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://435locals.com/business-networking-in-southern-utah/",
    description: "Monthly networking luncheon for Iron County business owners and professionals. Casual format at a local restaurant."
  },
  {
    id: 21,
    title: "Hurricane Business Networking Evening",
    organizer: "Southern Utah Business Associations",
    date: "2026-04-08",
    time: "5:00 PM – 7:00 PM",
    location: "Hurricane",
    venue: "4295 W Canterbury Rd, Hurricane",
    region: "Southern Utah",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://435locals.com/business-networking-in-southern-utah/",
    description: "Evening networking event for Southern Utah business professionals in the Hurricane/Washington County area."
  },
  {
    id: 22,
    title: "2026 Lace Up & Lead – Women in Manufacturing",
    organizer: "Various Organizers",
    date: "2026-05-15",
    time: "8:00 AM – 4:00 PM",
    location: "Salt Lake City",
    venue: "TBA",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Manufacturing",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/d/united-states--utah/conferences/",
    description: "Full-day conference celebrating and empowering women in Utah's manufacturing sector. Keynotes, panels, and networking."
  },
  {
    id: 23,
    title: "Utah Land Use Institute Spring Conference",
    organizer: "Utah Land Use Institute",
    date: "2026-04-22",
    time: "8:00 AM – 5:00 PM",
    location: "St. George",
    venue: "1199 S Bluff St, St. George",
    region: "Southern Utah",
    category: "Conference",
    industry: "Real Estate & Development",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/d/united-states--utah/conferences/",
    description: "Spring conference on land use policy, zoning, and development in Utah. Connect with real estate developers, planners, and policymakers."
  },
  {
    id: 24,
    title: "Growth Elevated Ski + Tech Summit",
    organizer: "Growth Elevated",
    date: "2026-03-25",
    time: "All Day",
    location: "Park City",
    venue: "TBA – Park City Resort",
    region: "Summit County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/b/united-states--utah/business/",
    description: "Combining world-class skiing with high-level tech networking. Brings together SaaS founders, VCs, and tech executives for a unique mountain experience."
  },
  {
    id: 25,
    title: "Silicon Slopes Start School",
    organizer: "Silicon Slopes",
    date: "2026-04-15",
    time: "6:00 PM – 8:00 PM",
    location: "Lehi",
    venue: "Silicon Slopes HQ, 2600 W Executive Pkwy",
    region: "Utah County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Ongoing program",
    url: "https://www.siliconslopes.com/events",
    description: "Free entrepreneur program focused on building sustainable, profitable businesses. No equity, no pitch competitions — just practical skill-building and community."
  },
  {
    id: 26,
    title: "San Juan County Business Basecamp Conference",
    organizer: "San Juan County",
    date: "2026-06-12",
    time: "8:00 AM – 5:00 PM",
    location: "Blanding",
    venue: "TBA – Blanding/Monticello",
    region: "Southern Utah",
    category: "Conference",
    industry: "Small Business",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/d/united-states--utah/conferences/",
    description: "Rural business conference and expo for San Juan County entrepreneurs. Workshops on growth strategies and networking with regional business leaders."
  },
  {
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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
    id: 34,
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
    id: 35,
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
  // ── 1 MILLION CUPS ──
  {
    id: 36,
    title: "1 Million Cups Salt Lake City",
    organizer: "1 Million Cups / Kauffman Foundation",
    date: "2026-03-25",
    time: "9:00 AM – 10:00 AM",
    location: "Salt Lake City",
    venue: "Cucina Toscano's, Downtown SLC",
    region: "Salt Lake County",
    category: "Speaker Event",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Every Wednesday",
    url: "https://www.meetup.com/1-million-cups-salt-lake-city/",
    description: "Free weekly startup presentations — two entrepreneurs give 6-minute pitches followed by 20 minutes of Q&A. Open to all. Supportive, educational community."
  },
  {
    id: 37,
    title: "1 Million Cups Orem",
    organizer: "1 Million Cups",
    date: "2026-03-25",
    time: "9:00 AM – 10:00 AM",
    location: "Orem",
    venue: "Rotating venues, Orem",
    region: "Utah County",
    category: "Speaker Event",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://networkr.app/find/usa/ut/provo/",
    description: "Utah County chapter of 1 Million Cups. Weekly startup presentations and community feedback in a supportive environment."
  },
  // ── OGDEN-WEBER CHAMBER ──
  {
    id: 38,
    title: "Business After Hours",
    organizer: "Ogden-Weber Chamber of Commerce",
    date: "2026-04-10",
    time: "5:00 PM – 7:00 PM",
    location: "Ogden",
    venue: "Rotating member venues, Ogden",
    region: "Weber County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.ogdenweberchamber.com/chamber-events/business-after-hours-2/",
    description: "Monthly after-hours mixer hosted by a different Ogden-Weber Chamber member each month. Drinks, food, and plenty of networking."
  },
  {
    id: 39,
    title: "Women in Business Luncheon",
    organizer: "Ogden-Weber Chamber of Commerce",
    date: "2026-04-28",
    time: "11:30 AM – 1:00 PM",
    location: "Ogden",
    venue: "TBA, Ogden",
    region: "Weber County",
    category: "Professional Development",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Quarterly",
    url: "https://members.ogdenweberchamber.com/events/searchscroll",
    description: "Ogden-Weber Chamber's dedicated networking and professional development luncheon for women in business across Weber County."
  },
  {
    id: 40,
    title: "Ogden-Weber Business Forum",
    organizer: "Ogden-Weber Chamber of Commerce",
    date: "2026-04-15",
    time: "7:30 AM – 9:00 AM",
    location: "Ogden",
    venue: "TBA, Ogden",
    region: "Weber County",
    category: "Professional Development",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.ogdenweberchamber.com/chamber-events/",
    description: "Monthly forum covering personal and employee development topics. Part of the Ogden-Weber Chamber's 100+ annual events program."
  },
  // ── DAVIS CHAMBER ──
  {
    id: 41,
    title: "Davis Chamber Networking Breakfast",
    organizer: "Davis Chamber of Commerce",
    date: "2026-04-09",
    time: "7:30 AM – 9:00 AM",
    location: "Layton",
    venue: "TBA, Davis County",
    region: "Davis County",
    category: "Chamber",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://davischamberofcommerce.com/",
    description: "Davis County Chamber monthly networking breakfast. Business advocacy, community events, and economic development networking."
  },
  // ── CACHE VALLEY CHAMBER ──
  {
    id: 42,
    title: "Cache Valley Chamber Networking",
    organizer: "Cache Valley Chamber of Commerce",
    date: "2026-04-08",
    time: "12:00 PM – 1:00 PM",
    location: "Logan",
    venue: "TBA, Logan",
    region: "Cache County",
    category: "Chamber",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://cachechamber.com/",
    description: "Cache Valley Chamber monthly networking event. Tools, networking opportunities, and services for the Logan-area business community."
  },
  // ── TOOELE CHAMBER ──
  {
    id: 43,
    title: "Tooele Chamber Monthly Meeting",
    organizer: "Tooele County Chamber of Commerce",
    date: "2026-04-15",
    time: "12:00 PM – 1:00 PM",
    location: "Tooele",
    venue: "Tooele Chamber Building",
    region: "Tooele County",
    category: "Chamber",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.tooelechamber.com/",
    description: "Free monthly meeting with guest speakers and networking. Open to the Tooele County business community. RSVP recommended — limited seating."
  },
  // ── BNI UTAH ──
  {
    id: 44,
    title: "BNI Utah North — Weekly Chapter Meetings",
    organizer: "BNI Utah North",
    date: "2026-03-26",
    time: "7:00 AM – 8:30 AM",
    location: "Multiple (Sandy, South Jordan, SLC, Smithfield)",
    venue: "Various chapter locations across Northern Utah",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Weekly (all chapters)",
    url: "https://bniutahnorth.com/en-US/findachapter",
    description: "Structured referral networking with dozens of chapters. Visitors can attend twice before joining. Chapters in Sandy, South Jordan, Smithfield, and more."
  },
  {
    id: 45,
    title: "BNI Utah South — Weekly Chapter Meetings",
    organizer: "BNI Utah South",
    date: "2026-03-26",
    time: "7:00 AM – 8:30 AM",
    location: "Multiple (Orem, Heber City, St. George)",
    venue: "Various chapter locations across Southern Utah",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Weekly (all chapters)",
    url: "https://bniutahsouth.com/en-US/findachapter",
    description: "BNI's structured referral networking in Utah County and Southern Utah. Impact chapter in Heber City and more. Visitor-friendly."
  },
  // ── WOMEN TECH COUNCIL ──
  {
    id: 46,
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
    id: 47,
    title: "WTC Talent Innovation Summit",
    organizer: "Women Tech Council",
    date: "2026-05-14",
    time: "8:00 AM – 1:00 PM",
    location: "Salt Lake City",
    venue: "TBA, Salt Lake City",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.womentechcouncil.com/events/talent-innovation-summit/",
    description: "Full morning of sessions on building teams, breaking glass ceilings, and tech talent strategy. Includes Shatter List Awards and structured networking."
  },
  {
    id: 48,
    title: "WTC Tech Talk",
    organizer: "Women Tech Council",
    date: "2026-04-17",
    time: "12:00 PM – 1:30 PM",
    location: "Salt Lake City",
    venue: "TBA",
    region: "Salt Lake County",
    category: "Speaker Event",
    industry: "Technology",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Quarterly",
    url: "https://www.womentechcouncil.com/events/",
    description: "Quarterly speaker event for women in tech. Networking lunch with industry presentations and mentoring opportunities."
  },
  // ── STRIVE NETWORKING (Eventbrite) ──
  {
    id: 49,
    title: "Blockchain & Business Networking — Elevating Your Potential",
    organizer: "Strive Networking",
    date: "2026-04-08",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "Zest Kitchen & Bar, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Technology",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Monthly mixer for blockchain, crypto, and tech professionals. Meet investors, engineers, entrepreneurs. Industry-specific networking at Zest Kitchen."
  },
  {
    id: 50,
    title: "Music & Business Networking — Elevating Your Potential",
    organizer: "Strive Networking",
    date: "2026-04-15",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Entertainment & Media",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Monthly networking for music industry professionals, artists, producers, and business owners. Part of Strive's industry-specific mixer series."
  },
  {
    id: 51,
    title: "Engineering & Business Networking — Elevating Your Potential",
    organizer: "Strive Networking",
    date: "2026-04-22",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Technology",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Monthly networking for engineers and technical professionals. Connect with fellow engineers, CTOs, and tech entrepreneurs."
  },
  {
    id: 52,
    title: "Hospitality & Business Networking — Elevating Your Potential",
    organizer: "Strive Networking",
    date: "2026-04-29",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Hospitality & Tourism",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Networking for hospitality, food service, and tourism professionals. Part of Strive's rotating industry-specific mixer series in SLC."
  },
  // ── NIAX NETWORKING ──
  {
    id: 53,
    title: "NIAX Next Level Networking — Salt Lake",
    organizer: "NIAX",
    date: "2026-04-02",
    time: "5:30 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "Tucanos Brazilian Grill, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/e/niax-next-level-networking-salt-lake-tickets-1981617440107",
    description: "Structured, relationship-driven networking for growth-minded professionals. Learn how to build referral income through trusted connections."
  },
  {
    id: 54,
    title: "NIAX Women of Influence — Sandy",
    organizer: "NIAX",
    date: "2026-04-10",
    time: "11:30 AM – 1:30 PM",
    location: "Sandy",
    venue: "TBA, Sandy",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Women-focused networking and leadership event in Sandy. Build relationships and create real business results."
  },
  // ── SCORE UTAH ──
  {
    id: 55,
    title: "SCORE Speed Networking — St. George",
    organizer: "SCORE Utah",
    date: "2026-04-17",
    time: "11:30 AM – 1:00 PM",
    location: "St. George",
    venue: "Forge St. George",
    region: "Southern Utah",
    category: "Networking Mixer",
    industry: "Small Business",
    cost: "Free",
    recurring: false,
    url: "https://www.score.org/utah/local-workshops",
    description: "Speed networking at the newly reopened SCORE St. George chapter at Forge. Fast-paced connections for small business owners and entrepreneurs."
  },
  {
    id: 56,
    title: "SCORE Start SMART Workshop",
    organizer: "SCORE Utah",
    date: "2026-04-05",
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
  {
    id: 57,
    title: "SCORE: AI in the Workplace Series",
    organizer: "SCORE Utah & WBC Utah",
    date: "2026-04-22",
    time: "12:00 PM – 1:30 PM",
    location: "Salt Lake City",
    venue: "Online / Salt Lake City",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Technology",
    cost: "Free",
    recurring: false,
    url: "https://www.score.org/utah/local-workshops",
    description: "Hands-on workshop on leveraging AI ethically for small businesses. Covers data privacy, bias, transparency, and emerging AI trends."
  },
  // ── ENTREPRENEUR LAUNCH PAD ──
  {
    id: 58,
    title: "Entrepreneur Launch Pad — Sandy",
    organizer: "Entrepreneur Launch Pad",
    date: "2026-03-27",
    time: "8:00 AM – 9:30 AM",
    location: "Sandy",
    venue: "TBA, Sandy",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://growutah.com/connectory",
    description: "Free weekly meetings for entrepreneurs. Collaborate on ideas, give feedback, discuss business topics, and make networking contacts. Non-profit."
  },
  {
    id: 59,
    title: "Entrepreneur Launch Pad — Ogden",
    organizer: "Entrepreneur Launch Pad",
    date: "2026-03-27",
    time: "8:00 AM – 9:30 AM",
    location: "Ogden",
    venue: "TBA, Ogden",
    region: "Weber County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://growutah.com/connectory",
    description: "Ogden chapter of Entrepreneur Launch Pad. Free weekly entrepreneurial collaboration, presentations, and networking contacts."
  },
  {
    id: 60,
    title: "Entrepreneur Launch Pad — Park City",
    organizer: "Entrepreneur Launch Pad",
    date: "2026-03-27",
    time: "8:00 AM – 9:30 AM",
    location: "Park City",
    venue: "TBA, Park City",
    region: "Summit County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://growutah.com/connectory",
    description: "Park City chapter of Entrepreneur Launch Pad. Free weekly meetup for Summit County entrepreneurs of all stages."
  },
  {
    id: 61,
    title: "Entrepreneur Launch Pad — Kaysville",
    organizer: "Entrepreneur Launch Pad",
    date: "2026-03-27",
    time: "8:00 AM – 9:30 AM",
    location: "Kaysville",
    venue: "TBA, Kaysville",
    region: "Davis County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://growutah.com/connectory",
    description: "Davis County chapter of Entrepreneur Launch Pad. Free weekly entrepreneurial collaboration and networking."
  },
  // ── EVENTBRITE / MEETUP DISCOVERIES ──
  {
    id: 62,
    title: "CEO Summit / Power Lunch — Fogo de Chao",
    organizer: "Various Organizers",
    date: "2026-04-09",
    time: "11:30 AM – 1:30 PM",
    location: "Salt Lake City",
    venue: "Fogo de Chao, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Executive-level networking lunch at Fogo de Chao. Connect with CEOs, founders, and senior leaders over Brazilian steakhouse dining."
  },
  {
    id: 63,
    title: "Business & Boba Networking — Taylorsville",
    organizer: "Various Organizers",
    date: "2026-04-05",
    time: "11:00 AM – 1:00 PM",
    location: "Taylorsville",
    venue: "TBA, Taylorsville",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/professional-networking/",
    description: "Casual networking over boba tea. Open to all business professionals in the Taylorsville area. Low-key, relationship-focused format."
  },
  {
    id: 64,
    title: "WomenHack SLC — Employer & Job Seeker Mixer",
    organizer: "WomenHack",
    date: "2026-05-14",
    time: "5:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Technology",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/networking/",
    description: "Speed-networking hiring event connecting women in tech with employers. Reverse recruiting format where companies pitch to candidates."
  },
  {
    id: 65,
    title: "SheConnect — Career Growth & Networking for Women",
    organizer: "WorkingWomen",
    date: "2026-04-12",
    time: "10:00 AM – 12:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Professional Development",
    industry: "General Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/professional-networking/",
    description: "Monthly networking and career growth event specifically for working women. Professional development, mentoring, and community building."
  },
  {
    id: 66,
    title: "Utah Real Estate Investors Association Meeting",
    organizer: "Utah REIA",
    date: "2026-04-09",
    time: "6:00 PM – 9:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Real Estate & Development",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.meetup.com/find/us--ut--salt-lake-city/business-networking-events/",
    description: "Monthly meeting for real estate investors and professionals. Market updates, guest speakers, and networking with active investors."
  },
  {
    id: 67,
    title: "SLC Startup Founder 101 Meetup",
    organizer: "Salt Lake City Startup Founder 101",
    date: "2026-04-07",
    time: "9:00 AM – 10:30 AM",
    location: "Salt Lake City",
    venue: "Online / SLC",
    region: "Salt Lake County",
    category: "Workshop",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://www.meetup.com/find/us--ut--salt-lake-city/networking/",
    description: "2,100+ member Meetup group. Weekly sessions for aspiring and early-stage founders covering business fundamentals and startup methodology."
  },
  {
    id: 68,
    title: "Utah County Business Networking Weekly",
    organizer: "Utah County Business Networking",
    date: "2026-03-25",
    time: "8:00 AM – 9:30 AM",
    location: "Orem",
    venue: "TBA, Orem area",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Every Wednesday",
    url: "https://www.meetup.com/find/us--ut--salt-lake-city/small-business-networking/",
    description: "Weekly open networking for Utah County business professionals. Highly rated (4.8 stars) Meetup group focused on building local connections."
  },
  // ── CORPORATE ALLIANCE ──
  {
    id: 69,
    title: "Corporate Alliance Utah Networking",
    organizer: "Corporate Alliance",
    date: "2026-04-02",
    time: "5:30 PM – 7:30 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://growutah.com/connectory",
    description: "Members-only relationship networking. Building real relationships that weather any storm. One of Utah's most established professional networks."
  },
  // ── NORTHFRONT ENTREPRENEUR ALLIANCE ──
  {
    id: 70,
    title: "NorthFront Entrepreneur Alliance Meetup",
    organizer: "NorthFront Entrepreneur Alliance",
    date: "2026-04-10",
    time: "6:00 PM – 8:00 PM",
    location: "Ogden",
    venue: "TBA, Northern Wasatch Front",
    region: "Weber County",
    category: "Networking Mixer",
    industry: "Startups & Entrepreneurship",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://growutah.com/connectory",
    description: "Northern Wasatch Front startup community. Learn, network, share ideas, find resources, and recognize accomplishments among entrepreneurs."
  },
  // ── TOURISM WORKSHOP ──
  {
    id: 71,
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
  // ── KILN COWORKING ──
  {
    id: 72,
    title: "Kiln Member Networking Events",
    organizer: "Kiln Coworking",
    date: "2026-04-01",
    time: "Varies",
    location: "Multiple (SLC, Lehi, Provo, Park City, St. George, Holladay)",
    venue: "6 Utah Kiln locations",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Members Only",
    recurring: true,
    recurrenceNote: "Weekly across locations",
    url: "https://kiln.com/member-events/",
    description: "Member-exclusive events across six Utah Kiln coworking locations. Filter by state in the Kiln member app. Community-building focus."
  },
  // ── NETWORKR DISCOVERIES ──
  {
    id: 73,
    title: "Alignable Alliance of Utah County",
    organizer: "Alignable Alliance",
    date: "2026-04-03",
    time: "9:00 AM – 10:30 AM",
    location: "American Fork",
    venue: "TBA, Utah County",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "Small Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://networkr.app/find/usa/ut/provo/",
    description: "Small business networking community on the Alignable platform. Weekly meet-ups for Utah County entrepreneurs to share referrals and resources."
  },
  {
    id: 74,
    title: "Coffee and Business (CAB) Jumpstart",
    organizer: "CAB Jumpstart",
    date: "2026-04-01",
    time: "7:30 AM – 8:30 AM",
    location: "Lehi",
    venue: "TBA, Lehi",
    region: "Utah County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Weekly",
    url: "https://networkr.app/find/usa/ut/provo/",
    description: "Early morning coffee and business networking in Lehi. Quick, casual connections to jumpstart your week."
  },
  // ── UTAH SBDC (additional) ──
  {
    id: 75,
    title: "SBDC Networking & Workshop — Davis Tech",
    organizer: "Utah Small Business Development Center",
    date: "2026-04-10",
    time: "11:30 AM – 1:00 PM",
    location: "Kaysville",
    venue: "Davis Technical College",
    region: "Davis County",
    category: "Workshop",
    industry: "Small Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://clients.utahsbdc.org/events.aspx",
    description: "Free SBDC workshop and networking at Davis Technical College. Practical small business training with advisor Q&A."
  },
  // ── WASATCH FRONT MATERIALS EXPO ──
  {
    id: 76,
    title: "2026 Wasatch Front Materials Expo",
    organizer: "Various Organizers",
    date: "2026-05-07",
    time: "8:00 AM – 4:00 PM",
    location: "Salt Lake City",
    venue: "TBA, SLC",
    region: "Salt Lake County",
    category: "Conference",
    industry: "Manufacturing",
    cost: "Paid",
    recurring: false,
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/convention/",
    description: "Trade expo for materials, manufacturing, and industrial professionals along the Wasatch Front. Exhibitors, networking, and industry presentations."
  },
  // ── CONTACTOS ──
  {
    id: 77,
    title: "CONTACTOS — Connect with Latino Leaders & Entrepreneurs",
    organizer: "America First / CONTACTOS",
    date: "2026-04-18",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "America First venue, SLC",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/convention/",
    description: "Bilingual networking event connecting Latino business leaders and entrepreneurs in the SLC area. Community building and collaboration."
  },
  // ── DINNER WITH ENTREPRENEURS ──
  {
    id: 78,
    title: "Dinner with Entrepreneurs — Small Business Owners Edition",
    organizer: "Various Organizers",
    date: "2026-04-11",
    time: "7:00 PM – 9:00 PM",
    location: "West Jordan",
    venue: "TBA, West Jordan",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "Small Business",
    cost: "Paid",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.eventbrite.com/d/ut--salt-lake-city/convention/",
    description: "Intimate dinner format for small business owners. Share challenges, swap advice, and make genuine connections over a shared meal."
  },
  // ── SUGARHOUSE SOUP KITCHEN ──
  {
    id: 79,
    title: "Sugarhouse Soup Kitchen Weds Night Networking",
    organizer: "Sugarhouse Soup Kitchen Restaurant",
    date: "2026-04-01",
    time: "6:00 PM – 8:00 PM",
    location: "Salt Lake City",
    venue: "Sugarhouse Soup Kitchen Restaurant",
    region: "Salt Lake County",
    category: "Networking Mixer",
    industry: "General Business",
    cost: "Free",
    recurring: true,
    recurrenceNote: "Monthly",
    url: "https://www.meetup.com/find/us--ut--salt-lake-city/small-business-networking/",
    description: "Monthly networking at a Sugarhouse restaurant. Casual, community-driven format for small business owners and professionals."
  },
  // ── OPEN EDX CONFERENCE ──
  {
    id: 80,
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

  // Load subscriber count on mount
  useEffect(() => {
    (async () => {
      try {
        const result = (() => { const v = localStorage.getItem("founder-list-meta"); return v ? { value: v } : null; })();
        if (result) {
          const meta = JSON.parse(result.value);
          setSubscriberCount(meta.count || 0);
        }
      } catch { setSubscriberCount(0); }
      // Check if current user already signed up
      try {
        const existing = (() => { const v = localStorage.getItem("my-founder-signup"); return v ? { value: v } : null; })();
        if (existing) setAlreadySignedUp(true);
      } catch {}
    })();
  }, []);

  const handleSignup = async () => {
    if (!signupEmail || !signupEmail.includes("@")) return;
    setSignupStatus("saving");
    try {
      const entry = { email: signupEmail, name: signupName, signedUpAt: new Date().toISOString() };
      localStorage.setItem("my-founder-signup", JSON.stringify(entry));
      // Update shared subscriber count
      let currentCount = 0;
      try {
        const meta = (() => { const v = localStorage.getItem("founder-list-meta"); return v ? { value: v } : null; })();
        if (meta) currentCount = JSON.parse(meta.value).count || 0;
      } catch {}
      localStorage.setItem("founder-list-meta", JSON.stringify({ count: currentCount + 1 }));
      setSubscriberCount(currentCount + 1);
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
          {EVENTS.length} events from 40+ sources — chambers, meetups, conferences & more across the Beehive State.
          Updated weekly from Eventbrite, Meetup, chambers, Silicon Slopes, SCORE, BNI, Networkr & community calendars.
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
