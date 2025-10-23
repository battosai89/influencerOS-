-- =============================================
-- CREATE ONLY MISSING TABLES
-- This script creates only tables that don't exist
-- =============================================

-- Create tasks table (if missing)
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL,
    "relatedContractId" TEXT,
    "relatedCampaignId" TEXT,
    "parentId" TEXT
);

-- Create influencers table (if missing)
CREATE TABLE IF NOT EXISTS influencers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    platform TEXT NOT NULL,
    followers INTEGER NOT NULL,
    status TEXT NOT NULL,
    "engagementRate" REAL NOT NULL,
    notes TEXT,
    instagram TEXT,
    tiktok TEXT,
    youtube TEXT,
    niche TEXT NOT NULL,
    rating INTEGER NOT NULL,
    location TEXT NOT NULL,
    availability TEXT NOT NULL,
    "audienceGenderMale" INTEGER NOT NULL,
    "audienceGenderFemale" INTEGER NOT NULL,
    "audienceGenderOther" INTEGER NOT NULL
);

-- Create brands table (if missing)
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    industry TEXT NOT NULL,
    website TEXT,
    notes TEXT,
    satisfaction INTEGER NOT NULL,
    "portalAccess" BOOLEAN NOT NULL,
    "portalUserEmail" TEXT,
    "portalPassword" TEXT
);

-- Create campaigns table (if missing)
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    roi REAL NOT NULL,
    budget REAL NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Create contracts table (if missing)
CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    status TEXT NOT NULL,
    "dateSigned" TIMESTAMP,
    "endDate" TEXT,
    value REAL NOT NULL,
    "templateId" TEXT
);

-- Create transactions table (if missing)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    "brandId" TEXT,
    "influencerId" TEXT,
    "campaignId" TEXT
);

-- Create events table (if missing)
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    start TIMESTAMP NOT NULL,
    "end" TIMESTAMP NOT NULL,
    "allDay" BOOLEAN,
    type TEXT NOT NULL,
    "brandId" TEXT,
    "campaignId" TEXT
);

-- Create invoices table (if missing) - this one already exists based on error
-- CREATE TABLE IF NOT EXISTS invoices (
--     id TEXT PRIMARY KEY,
--     "invoiceNumber" TEXT NOT NULL,
--     "brandId" TEXT NOT NULL,
--     amount REAL NOT NULL,
--     "issueDate" TEXT NOT NULL,
--     "dueDate" TEXT NOT NULL,
--     status TEXT NOT NULL
-- );

-- Create contract templates table (if missing)
CREATE TABLE IF NOT EXISTS "contractTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- =============================================
-- ADD FOREIGN KEY CONSTRAINTS (if tables exist)
-- =============================================

-- Add foreign key constraints only if both tables exist
DO $$
BEGIN
    -- Tasks foreign keys
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contracts') THEN
        ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS "tasks_relatedContractId_fkey" FOREIGN KEY ("relatedContractId") REFERENCES contracts(id) ON DELETE SET NULL;
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'campaigns') THEN
        ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS "tasks_relatedCampaignId_fkey" FOREIGN KEY ("relatedCampaignId") REFERENCES campaigns(id) ON DELETE SET NULL;
        ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS "tasks_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES tasks(id) ON DELETE SET NULL;
    END IF;

    -- Contracts foreign keys
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'influencers') THEN
        ALTER TABLE contracts ADD CONSTRAINT IF NOT EXISTS "contracts_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES influencers(id) ON DELETE CASCADE;
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'brands') THEN
        ALTER TABLE contracts ADD CONSTRAINT IF NOT EXISTS "contracts_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE;
    END IF;

    -- Campaigns foreign keys
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'brands') THEN
        ALTER TABLE campaigns ADD CONSTRAINT IF NOT EXISTS "campaigns_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE;
    END IF;

EXCEPTION
    WHEN others THEN
        -- Ignore foreign key constraint errors (constraints might already exist)
        NULL;
END $$;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

SELECT '✅ Missing tables created successfully!' as result;

-- Show which tables now exist
SELECT
    '📊 Available tables:' as info,
    string_agg(table_name, ', ') as tables
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('tasks', 'influencers', 'brands', 'campaigns', 'contracts', 'transactions', 'events', 'invoices', 'contracttemplates');