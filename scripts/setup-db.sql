-- ============================================
-- Utah Networking Events — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organizer TEXT,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  location TEXT,
  venue TEXT,
  region TEXT,
  category TEXT,
  industry TEXT,
  cost TEXT DEFAULT 'Free',
  cost_amount TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_note TEXT,
  url TEXT NOT NULL,
  description TEXT,
  source TEXT DEFAULT 'manual',
  eventbrite_id TEXT UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers table (founder list)
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'founder-list',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date-range queries
CREATE INDEX idx_events_date ON events (date);
CREATE INDEX idx_events_active ON events (is_active, date);
CREATE INDEX idx_events_eventbrite ON events (eventbrite_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can READ active events
CREATE POLICY "Public can view active events"
  ON events FOR SELECT
  USING (is_active = true);

-- Authenticated users (admin) can do everything with events
CREATE POLICY "Admin full access to events"
  ON events FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can INSERT subscribers (signup form)
CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Admin can view/manage subscribers
CREATE POLICY "Admin full access to subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
