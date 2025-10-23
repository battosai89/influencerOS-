-- =============================================
-- SIMPLE TABLES CREATION
-- Creates only the essential tables without complex constraints
-- =============================================

-- Create tasks table (the main one you need)
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL,
    "relatedContractId" TEXT,
    "relatedCampaignId" TEXT,
    "parentId" TEXT
);

-- Create influencers table
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

-- Create brands table
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

-- Create campaigns table
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

-- Create contracts table
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

-- Create transactions table
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

-- Create events table
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

-- Create invoices table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    amount REAL NOT NULL,
    "issueDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Create contract templates table
CREATE TABLE IF NOT EXISTS "contractTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

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
-- SUCCESS CONFIRMATION
-- =============================================

SELECT '✅ All essential tables created successfully!' as result;

-- Show available tables
SELECT
    '📊 Available tables:' as info,
    array_agg(table_name) as tables
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('tasks', 'influencers', 'brands', 'campaigns', 'contracts', 'transactions', 'events', 'invoices', 'contracttemplates');