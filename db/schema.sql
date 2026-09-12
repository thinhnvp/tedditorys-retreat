CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE,
  listing_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'awaiting_payment', 'paid', 'closed')),
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status);
CREATE INDEX IF NOT EXISTS inquiries_listing_slug_idx ON inquiries (listing_slug);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);

-- One itinerary per inquiry, addressed by the same human-readable reference
-- code (e.g. /itineraries/FZQGZ9). guest_profile and days are stored as JSON
-- rather than normalized tables — the shape is still being designed (this is
-- the first demo), and nothing here needs relational queries across items.
CREATE TABLE IF NOT EXISTS itineraries (
  id BIGSERIAL PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE REFERENCES inquiries (reference_code),
  guest_profile JSONB NOT NULL,
  days JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
