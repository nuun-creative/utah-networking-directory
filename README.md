# Utah Business Networking Events Directory — v2

Database-backed event directory with Eventbrite API integration and admin panel.

## Architecture

- **Frontend:** React + Vite on Cloudflare Pages
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (admin panel)
- **Events:** Eventbrite API + manual curation via admin panel
- **Signups:** Supabase table + Formspree backup

## Setup

### 1. Create a Supabase project (free)

Go to [supabase.com](https://supabase.com), create a new project, then:

**Run the database schema:**
- Go to SQL Editor in your Supabase dashboard
- Paste and run the contents of `scripts/setup-db.sql`

**Create your admin user:**
- Go to Authentication > Users > Add User
- Add your email and a password — this is your admin login

**Get your API keys:**
- Go to Settings > API
- Copy your **Project URL** and **anon public** key

### 2. Get an Eventbrite API token

- Go to [eventbrite.com/platform](https://www.eventbrite.com/platform)
- Create an app, then find your **Private Token**

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
EVENTBRITE_TOKEN=your-private-token
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  (service_role key, NOT anon)
```

### 4. Install and run locally

```bash
npm install
npm run dev
```

- Public directory: http://localhost:5173
- Admin panel: http://localhost:5173/admin
- Admin login: http://localhost:5173/login

### 5. Fetch Eventbrite events

```bash
npm run fetch-events
```

This pulls Utah business/networking events from Eventbrite and upserts them into your database. Run this weekly (manually or via cron).

### 6. Deploy to Cloudflare Pages

Push to GitHub, then connect to Cloudflare Pages:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Weekly Workflow

1. **Run `npm run fetch-events`** to pull latest from Eventbrite
2. **Log into /admin** to review, add manual events, deactivate stale ones
3. **Share the weekly digest** with your Founder List subscribers

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public event directory |
| `/admin` | Admin panel (requires login) |
| `/login` | Admin login page |

## Database Tables

| Table | Purpose |
|-------|---------|
| `events` | All events (Eventbrite + manual) |
| `subscribers` | Founder List email signups |
