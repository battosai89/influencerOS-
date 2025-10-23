-- =============================================
-- InfluencerOS Database Setup
-- Run this script in your Supabase SQL Editor
-- =============================================

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS "displayChatMessageConfirmations" CASCADE;
DROP TABLE IF EXISTS "displayChatMessagePlans" CASCADE;
DROP TABLE IF EXISTS "displayChatMessages" CASCADE;
DROP TABLE IF EXISTS "chatForms" CASCADE;
DROP TABLE IF EXISTS "formFieldOptions" CASCADE;
DROP TABLE IF EXISTS "formFields" CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS "pageVisits" CASCADE;
DROP TABLE IF EXISTS "userPreferences" CASCADE;
DROP TABLE IF EXISTS "dashboardLayoutItems" CASCADE;
DROP TABLE IF EXISTS "dashboardTabs" CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS "contentPieces" CASCADE;
DROP TABLE IF EXISTS "contentComments" CASCADE;
DROP TABLE IF EXISTS "campaignMilestones" CASCADE;
DROP TABLE IF EXISTS "campaignInfluencers" CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS "campaignContents" CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS "contractTemplates" CASCADE;
DROP TABLE IF EXISTS "contractClauses" CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS "communicationLogItems" CASCADE;
DROP TABLE IF EXISTS "audienceTopLocations" CASCADE;
DROP TABLE IF EXISTS influencers CASCADE;
DROP TABLE IF EXISTS "dashboardTemplateLayoutItems" CASCADE;
DROP TABLE IF EXISTS "dashboardTemplates" CASCADE;

-- =============================================
-- CORE TABLES
-- =============================================

-- Influencers table
CREATE TABLE influencers (
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

-- Brands table
CREATE TABLE brands (
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

-- Tasks table
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL,
    "relatedContractId" TEXT,
    "relatedCampaignId" TEXT,
    "parentId" TEXT
);

-- Contracts table
CREATE TABLE contracts (
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

-- Campaigns table
CREATE TABLE campaigns (
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

-- Transactions table
CREATE TABLE transactions (
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

-- Events table
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    start TIMESTAMP NOT NULL,
    "end" TIMESTAMP NOT NULL,
    "allDay" BOOLEAN,
    type TEXT NOT NULL,
    "brandId" TEXT,
    "campaignId" TEXT
);

-- Invoices table
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    amount REAL NOT NULL,
    "issueDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Contract Templates table
CREATE TABLE "contractTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- =============================================
-- JUNCTION TABLES
-- =============================================

-- Campaign-Influencer relationship (many-to-many)
CREATE TABLE "campaignInfluencers" (
    "campaignId" TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    PRIMARY KEY ("campaignId", "influencerId")
);

-- =============================================
-- USER PREFERENCES & DASHBOARD
-- =============================================

-- Dashboard Tabs
CREATE TABLE "dashboardTabs" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "isPinned" BOOLEAN
);

-- Dashboard Layout Items
CREATE TABLE "dashboardLayoutItems" (
    id TEXT PRIMARY KEY,
    "widgetId" TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    w INTEGER NOT NULL,
    h INTEGER NOT NULL,
    "dashboardTabId" TEXT NOT NULL
);

-- User Preferences
CREATE TABLE "userPreferences" (
    "userName" TEXT PRIMARY KEY,
    "userRole" TEXT,
    "userAvatarUrl" TEXT,
    "agencyName" TEXT,
    "agencyLogoUrl" TEXT,
    "lastVisit" TEXT,
    theme TEXT,
    "accentColor" TEXT,
    "dashboardNotes" TEXT,
    "activeDashboardTabId" TEXT
);

-- Page Visits tracking
CREATE TABLE "pageVisits" (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    count INTEGER NOT NULL,
    "userName" TEXT NOT NULL
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER,
    read BOOLEAN NOT NULL
);

-- =============================================
-- CONTENT MANAGEMENT
-- =============================================

-- Content Pieces
CREATE TABLE "contentPieces" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    status TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "submissionDate" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    platform TEXT NOT NULL,
    version INTEGER NOT NULL
);

-- Content Comments
CREATE TABLE "contentComments" (
    id TEXT PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "authorAvatarUrl" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    "contentPieceId" TEXT NOT NULL
);

-- =============================================
-- AI ASSISTANT TABLES
-- =============================================

-- Chat Forms
CREATE TABLE "chatForms" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

-- Chat Messages
CREATE TABLE "displayChatMessages" (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    "chatFormId" TEXT
);

-- Form Fields
CREATE TABLE "formFields" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    placeholder TEXT,
    "chatFormId" TEXT NOT NULL
);

-- Form Field Options
CREATE TABLE "formFieldOptions" (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL
);

-- Chat Message Plans
CREATE TABLE "displayChatMessagePlans" (
    id TEXT PRIMARY KEY,
    step TEXT NOT NULL,
    "displayChatMessageId" INTEGER NOT NULL
);

-- Chat Message Confirmations
CREATE TABLE "displayChatMessageConfirmations" (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    "toolCallFunction" TEXT NOT NULL,
    "toolCallArguments" TEXT NOT NULL,
    "displayChatMessageId" INTEGER NOT NULL
);

-- =============================================
-- DASHBOARD TEMPLATES
-- =============================================

-- Dashboard Templates
CREATE TABLE "dashboardTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT
);

-- Dashboard Template Layout Items
CREATE TABLE "dashboardTemplateLayoutItems" (
    id TEXT PRIMARY KEY,
    "widgetId" TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    w INTEGER NOT NULL,
    h INTEGER NOT NULL,
    "dashboardTemplateId" TEXT NOT NULL
);

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

-- Add foreign key constraints
ALTER TABLE contracts ADD CONSTRAINT "contracts_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES influencers(id) ON DELETE CASCADE;
ALTER TABLE contracts ADD CONSTRAINT "contracts_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE;
ALTER TABLE contracts ADD CONSTRAINT "contracts_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "contractTemplates"(id) ON DELETE SET NULL;

ALTER TABLE campaigns ADD CONSTRAINT "campaigns_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE;

ALTER TABLE "campaignInfluencers" ADD CONSTRAINT "campaignInfluencers_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE CASCADE;
ALTER TABLE "campaignInfluencers" ADD CONSTRAINT "campaignInfluencers_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES influencers(id) ON DELETE CASCADE;

ALTER TABLE tasks ADD CONSTRAINT "tasks_relatedContractId_fkey" FOREIGN KEY ("relatedContractId") REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT "tasks_relatedCampaignId_fkey" FOREIGN KEY ("relatedCampaignId") REFERENCES campaigns(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT "tasks_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES tasks(id) ON DELETE SET NULL;

ALTER TABLE transactions ADD CONSTRAINT "transactions_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT "transactions_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES influencers(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT "transactions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE SET NULL;

ALTER TABLE events ADD CONSTRAINT "events_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE events ADD CONSTRAINT "events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE SET NULL;

ALTER TABLE invoices ADD CONSTRAINT "invoices_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE;

ALTER TABLE "contentPieces" ADD CONSTRAINT "contentPieces_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE CASCADE;
ALTER TABLE "contentPieces" ADD CONSTRAINT "contentPieces_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES influencers(id) ON DELETE CASCADE;

ALTER TABLE "contentComments" ADD CONSTRAINT "contentComments_contentPieceId_fkey" FOREIGN KEY ("contentPieceId") REFERENCES "contentPieces"(id) ON DELETE CASCADE;

ALTER TABLE "dashboardLayoutItems" ADD CONSTRAINT "dashboardLayoutItems_dashboardTabId_fkey" FOREIGN KEY ("dashboardTabId") REFERENCES "dashboardTabs"(id) ON DELETE CASCADE;

ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_activeDashboardTabId_fkey" FOREIGN KEY ("activeDashboardTabId") REFERENCES "dashboardTabs"(id) ON DELETE SET NULL;

ALTER TABLE "pageVisits" ADD CONSTRAINT "pageVisits_userName_fkey" FOREIGN KEY ("userName") REFERENCES "userPreferences"("userName") ON DELETE CASCADE;

ALTER TABLE "displayChatMessages" ADD CONSTRAINT "displayChatMessages_chatFormId_fkey" FOREIGN KEY ("chatFormId") REFERENCES "chatForms"(id) ON DELETE SET NULL;

ALTER TABLE "formFields" ADD CONSTRAINT "formFields_chatFormId_fkey" FOREIGN KEY ("chatFormId") REFERENCES "chatForms"(id) ON DELETE CASCADE;

ALTER TABLE "formFieldOptions" ADD CONSTRAINT "formFieldOptions_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "formFields"(id) ON DELETE CASCADE;

ALTER TABLE "displayChatMessagePlans" ADD CONSTRAINT "displayChatMessagePlans_displayChatMessageId_fkey" FOREIGN KEY ("displayChatMessageId") REFERENCES "displayChatMessages"(id) ON DELETE CASCADE;

ALTER TABLE "displayChatMessageConfirmations" ADD CONSTRAINT "displayChatMessageConfirmations_displayChatMessageId_fkey" FOREIGN KEY ("displayChatMessageId") REFERENCES "displayChatMessages"(id) ON DELETE CASCADE;

ALTER TABLE "dashboardTemplateLayoutItems" ADD CONSTRAINT "dashboardTemplateLayoutItems_dashboardTemplateId_fkey" FOREIGN KEY ("dashboardTemplateId") REFERENCES "dashboardTemplates"(id) ON DELETE CASCADE;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX "influencers_id_idx" ON influencers(id);
CREATE INDEX "brands_id_idx" ON brands(id);
CREATE INDEX "contracts_id_idx" ON contracts(id);
CREATE INDEX "campaigns_id_idx" ON campaigns(id);
CREATE INDEX "tasks_id_idx" ON tasks(id);
CREATE INDEX "transactions_id_idx" ON transactions(id);
CREATE INDEX "events_id_idx" ON events(id);
CREATE INDEX "contentPieces_id_idx" ON "contentPieces"(id);
CREATE INDEX "notifications_id_idx" ON notifications(id);
CREATE INDEX "dashboardTabs_id_idx" ON "dashboardTabs"(id);
CREATE INDEX "userPreferences_userName_idx" ON "userPreferences"("userName");
CREATE INDEX "chatForms_id_idx" ON "chatForms"(id);
CREATE INDEX "displayChatMessages_id_idx" ON "displayChatMessages"(id);
CREATE INDEX "dashboardTemplates_id_idx" ON "dashboardTemplates"(id);

-- =============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contractTemplates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contentPieces" ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample data for testing
INSERT INTO influencers (id, name, "avatarUrl", platform, followers, status, "engagementRate", niche, rating, location, availability, "audienceGenderMale", "audienceGenderFemale", "audienceGenderOther")
VALUES
('inf_001', 'Emma Wilson', '/avatars/emma.jpg', 'Instagram', 250000, 'active', 4.5, 'Lifestyle', 5, 'Los Angeles, USA', 'available', 35, 60, 5),
('inf_002', 'Marcus Chen', '/avatars/marcus.jpg', 'TikTok', 1800000, 'active', 8.2, 'Tech', 4, 'San Francisco, USA', 'booked', 55, 40, 5);

INSERT INTO brands (id, name, "logoUrl", industry, website, satisfaction, "portalAccess")
VALUES
('brand_001', 'TechCorp', '/logos/techcorp.jpg', 'Technology', 'https://techcorp.com', 85, false),
('brand_002', 'Fashion Forward', '/logos/fashion.jpg', 'Fashion', 'https://fashionforward.com', 92, false);

INSERT INTO tasks (id, title, "dueDate", status)
VALUES
('task_001', 'Review Q4 Campaign Strategy', '2024-10-25', 'pending'),
('task_002', 'Update Social Media Calendar', '2024-10-20', 'pending');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

SELECT 'Database setup completed successfully! 🎉' as result;