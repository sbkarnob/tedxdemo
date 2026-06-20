-- ============================================================
-- TEDxUAP 2026 — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- 1. SPEAKERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS speakers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  title         TEXT,
  bio           TEXT,
  image_url     TEXT,
  topic         TEXT,
  social_links  JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ORGANIZERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS organizers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT,
  department    TEXT,
  bio           TEXT,
  image_url     TEXT,
  social_links  JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. VOLUNTEERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS volunteers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT,
  department    TEXT,
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. SPONSORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sponsors (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  tier          TEXT DEFAULT 'bronze',  -- platinum, gold, silver, bronze, media, community
  logo_url      TEXT,
  website_url   TEXT,
  description   TEXT,
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. EVENT SCHEDULE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS event_schedule (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  start_time    TEXT,
  end_time      TEXT,
  speaker_name  TEXT,
  session_type  TEXT DEFAULT 'talk',  -- talk, break, workshop, performance, qa
  location      TEXT,
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. EVENT DETAILS (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_details (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key           TEXT UNIQUE NOT NULL,
  value         TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default event details
INSERT INTO event_details (key, value) VALUES
  ('event_name',    'TEDxUniversityofAsiaPacific 2026'),
  ('event_date',    'TBA 2026'),
  ('event_time',    '9:00 AM – 6:00 PM'),
  ('event_venue',   'University of Asia Pacific, Dhaka'),
  ('event_theme',   'Ideas Worth Spreading'),
  ('ticket_url',    ''),
  ('ticket_price',  'Free')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  subject       TEXT,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. ADMIN USERS TABLE (profile data)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE speakers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors         ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_schedule   ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_details    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- PUBLIC can READ active content (website visitors)
CREATE POLICY "Public read speakers"       ON speakers         FOR SELECT USING (true);
CREATE POLICY "Public read organizers"     ON organizers       FOR SELECT USING (true);
CREATE POLICY "Public read volunteers"     ON volunteers       FOR SELECT USING (true);
CREATE POLICY "Public read sponsors"       ON sponsors         FOR SELECT USING (true);
CREATE POLICY "Public read schedule"       ON event_schedule   FOR SELECT USING (true);
CREATE POLICY "Public read event_details"  ON event_details    FOR SELECT USING (true);

-- PUBLIC can INSERT contact messages
CREATE POLICY "Public insert messages"     ON contact_messages FOR INSERT WITH CHECK (true);

-- AUTHENTICATED (admin) can do everything
CREATE POLICY "Admin all speakers"         ON speakers         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all organizers"       ON organizers       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all volunteers"       ON volunteers       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all sponsors"         ON sponsors         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all schedule"         ON event_schedule   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all event_details"    ON event_details    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all messages"         ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin own profile"          ON admin_users      FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 10. STORAGE BUCKET FOR IMAGES
-- ============================================================
-- Run this in: Supabase Dashboard → Storage → New Bucket
-- Bucket name: images
-- Public bucket: YES (checked)
--
-- Or run via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================================
-- DONE!
-- Next step: Create your admin user in
-- Supabase Dashboard → Authentication → Users → Add User
-- Use email: tedx@uap-bd.edu (or any email you want)
-- ============================================================
