-- ============================================================================
--  VETRI KALAM Sports & Events
--  PostgreSQL schema for the event registration system
--
--  Target: Neon PostgreSQL (any standard PostgreSQL 13+)
--  Apply with:  npm run db:setup     (schema + seed, idempotent)
--  Or manually: psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
--  events
--  Each row is one VETRI KALAM event the organiser is accepting entries for.
--  `event_id` is the stable key referenced by every registration.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id                   BIGSERIAL      PRIMARY KEY,
    event_id             TEXT           NOT NULL,
    event_name           TEXT           NOT NULL,
    description          TEXT,
    event_date           DATE,
    event_time           TIME,
    location             TEXT,
    category             TEXT,
    registration_fee     NUMERIC(10,2)  NOT NULL DEFAULT 0,
    max_participants     INTEGER,
    registration_open    BOOLEAN        NOT NULL DEFAULT TRUE,
    event_image          TEXT,
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT uq_events_event_id     UNIQUE (event_id),
    CONSTRAINT chk_events_fee         CHECK (registration_fee >= 0),
    CONSTRAINT chk_events_max         CHECK (max_participants IS NULL OR max_participants > 0)
);

CREATE INDEX IF NOT EXISTS idx_events_date   ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_open   ON events (registration_open);

-- ---------------------------------------------------------------------------
--  registrations
--  One row per participant entry. `registration_id` is the human-facing code
--  shown to the participant and used by the organiser for search/export.
--
--  NOTE ON REFERENTIAL INTEGRITY
--  A registration is a historical record: it snapshots `event_name` so the
--  organiser can still report on it even if the event row is edited later.
--  `event_id` is validated in application code against the events table and
--  indexed here, but intentionally has no ON DELETE CASCADE - a participant's
--  record must never disappear because an event row was removed.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id                      BIGSERIAL      PRIMARY KEY,
    registration_id         TEXT           NOT NULL,
    event_id                TEXT           NOT NULL,
    event_name              TEXT           NOT NULL,
    participant_name        TEXT           NOT NULL,
    date_of_birth           DATE           NOT NULL,
    age                     SMALLINT       NOT NULL,
    gender                  TEXT           NOT NULL,
    phone                   TEXT           NOT NULL,
    email                   TEXT           NOT NULL,
    address                 TEXT,
    city                    TEXT           NOT NULL,
    state                   TEXT           NOT NULL,
    emergency_contact_name  TEXT           NOT NULL,
    emergency_contact_phone TEXT           NOT NULL,
    category                TEXT           NOT NULL,
    race_category           TEXT           NOT NULL,
    tshirt_size             TEXT,
    registration_date       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    payment_status          TEXT           NOT NULL DEFAULT 'Pending',
    payment_utr             TEXT,
    registration_status     TEXT           NOT NULL DEFAULT 'Pending',
    created_at              TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ    NOT NULL DEFAULT now(),

    CONSTRAINT uq_reg_registration_id  UNIQUE (registration_id),

    -- One entry per person per event - blocks accidental double submits.
    CONSTRAINT uq_reg_event_email      UNIQUE (event_id, email),

    CONSTRAINT chk_reg_age             CHECK (age >= 5 AND age <= 100),
    CONSTRAINT chk_reg_payment_status  CHECK (payment_status  IN ('Pending','Paid','Failed','Refunded')),
    CONSTRAINT chk_reg_reg_status      CHECK (registration_status IN ('Pending','Confirmed','Waitlist','Cancelled')),
    CONSTRAINT chk_reg_gender          CHECK (gender IN ('Male','Female','Other','Prefer not to say')),
    CONSTRAINT chk_reg_tshirt          CHECK (tshirt_size IS NULL OR tshirt_size IN ('XS','S','M','L','XL','XXL','XXXL'))
);

-- ---------------------------------------------------------------------------
--  Indexes - tuned for the dashboard's search / filter / sort combinations
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reg_event        ON registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_reg_email_lower  ON registrations (lower(email));
CREATE INDEX IF NOT EXISTS idx_reg_phone        ON registrations (phone);
CREATE INDEX IF NOT EXISTS idx_reg_name_lower   ON registrations (lower(participant_name));
CREATE INDEX IF NOT EXISTS idx_reg_category     ON registrations (category);
CREATE INDEX IF NOT EXISTS idx_reg_race         ON registrations (race_category);
CREATE INDEX IF NOT EXISTS idx_reg_payment      ON registrations (payment_status);
CREATE INDEX IF NOT EXISTS idx_reg_status       ON registrations (registration_status);
CREATE INDEX IF NOT EXISTS idx_reg_created      ON registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_regdate      ON registrations (registration_date DESC);

-- Composite index covering the common "filter by event + payment" dashboard query.
CREATE INDEX IF NOT EXISTS idx_reg_event_payment ON registrations (event_id, payment_status);

-- ---------------------------------------------------------------------------
--  updated_at maintenance
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $fn$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$fn$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_events_updated      ON events;
CREATE TRIGGER trg_events_updated      BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_registrations_updated ON registrations;
CREATE TRIGGER trg_registrations_updated BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
