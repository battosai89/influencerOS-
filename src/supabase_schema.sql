-- Drop existing tables to prevent 'relation already exists' errors
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

-- CreateTable: Influencer
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

-- CreateTable: AudienceTopLocation
CREATE TABLE "audienceTopLocations" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    "influencerId" TEXT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE
);

-- CreateTable: CommunicationLogItem
CREATE TABLE "communicationLogItems" (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    summary TEXT NOT NULL,
    "influencerId" TEXT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE
);

-- CreateTable: Brand
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

-- CreateTable: ContractClause
CREATE TABLE "contractClauses" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "contractId" TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    "contractTemplateId" TEXT REFERENCES "contractTemplates"(id) ON DELETE CASCADE
);

-- CreateTable: ContractTemplate
CREATE TABLE "contractTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- CreateTable: Contract
CREATE TABLE contracts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "influencerId" TEXT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    "brandId" TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    "dateSigned" TIMESTAMP,
    "endDate" TEXT,
    value REAL NOT NULL,
    "templateId" TEXT REFERENCES "contractTemplates"(id) ON DELETE SET NULL
);

-- CreateTable: CampaignContent
CREATE TABLE "campaignContents" (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    views INTEGER,
    likes INTEGER,
    comments INTEGER,
    "campaignId" TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE
);

-- CreateTable: Campaign
CREATE TABLE campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "brandId" TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    roi REAL NOT NULL,
    budget REAL NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL
);

-- CreateTable: CampaignInfluencer
CREATE TABLE "campaignInfluencers" (
    "campaignId" TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    "influencerId" TEXT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    PRIMARY KEY ("campaignId", "influencerId")
);

-- CreateTable: CampaignMilestone
CREATE TABLE "campaignMilestones" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    "campaignId" TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE
);

-- CreateTable: ContentComment
CREATE TABLE "contentComments" (
    id TEXT PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "authorAvatarUrl" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    "contentPieceId" TEXT NOT NULL REFERENCES "contentPieces"(id) ON DELETE CASCADE
);

-- CreateTable: ContentPiece
CREATE TABLE "contentPieces" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "campaignId" TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    "influencerId" TEXT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "submissionDate" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    platform TEXT NOT NULL,
    version INTEGER NOT NULL
);

-- CreateTable: Task
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    status TEXT NOT NULL,
    "relatedContractId" TEXT REFERENCES contracts(id) ON DELETE SET NULL,
    "relatedCampaignId" TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
    "parentId" TEXT REFERENCES tasks(id) ON DELETE SET NULL
);

-- CreateTable: Transaction
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    "brandId" TEXT REFERENCES brands(id) ON DELETE SET NULL,
    "influencerId" TEXT REFERENCES influencers(id) ON DELETE SET NULL,
    "campaignId" TEXT REFERENCES campaigns(id) ON DELETE SET NULL
);

-- CreateTable: Event
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    start TIMESTAMP NOT NULL,
    "end" TIMESTAMP NOT NULL,
    "allDay" BOOLEAN,
    type TEXT NOT NULL,
    "brandId" TEXT REFERENCES brands(id) ON DELETE SET NULL,
    "campaignId" TEXT REFERENCES campaigns(id) ON DELETE SET NULL
);

-- CreateTable: DashboardTab
CREATE TABLE "dashboardTabs" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "isPinned" BOOLEAN
);

-- CreateTable: DashboardLayoutItem
CREATE TABLE "dashboardLayoutItems" (
    id TEXT PRIMARY KEY,
    "widgetId" TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    w INTEGER NOT NULL,
    h INTEGER NOT NULL,
    "dashboardTabId" TEXT NOT NULL REFERENCES "dashboardTabs"(id) ON DELETE CASCADE
);

-- CreateTable: UserPreferences
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
    "activeDashboardTabId" TEXT REFERENCES "dashboardTabs"(id) ON DELETE SET NULL
);

-- CreateTable: PageVisit
CREATE TABLE "pageVisits" (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    count INTEGER NOT NULL,
    "userName" TEXT NOT NULL REFERENCES "userPreferences"("userName") ON DELETE CASCADE
);

-- CreateTable: Notification
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER,
    read BOOLEAN NOT NULL
);

-- CreateTable: FormField
CREATE TABLE "formFields" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    placeholder TEXT,
    "chatFormId" TEXT NOT NULL REFERENCES "chatForms"(id) ON DELETE CASCADE
);

-- CreateTable: FormFieldOption
CREATE TABLE "formFieldOptions" (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL REFERENCES "formFields"(id) ON DELETE CASCADE
);

-- CreateTable: ChatForm
CREATE TABLE "chatForms" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

-- CreateTable: DisplayChatMessage
CREATE TABLE "displayChatMessages" (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    "chatFormId" TEXT REFERENCES "chatForms"(id) ON DELETE SET NULL
);

-- CreateTable: DisplayChatMessagePlan
CREATE TABLE "displayChatMessagePlans" (
    id TEXT PRIMARY KEY,
    step TEXT NOT NULL,
    "displayChatMessageId" INTEGER NOT NULL REFERENCES "displayChatMessages"(id) ON DELETE CASCADE
);

-- CreateTable: DisplayChatMessageConfirmation
CREATE TABLE "displayChatMessageConfirmations" (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    "toolCallFunction" TEXT NOT NULL,
    "toolCallArguments" TEXT NOT NULL,
    "displayChatMessageId" INTEGER NOT NULL REFERENCES "displayChatMessages"(id) ON DELETE CASCADE
);

-- CreateTable: DashboardTemplate
CREATE TABLE "dashboardTemplates" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT -- Storing icon as text (e.g., SVG string or icon name)
);

-- CreateTable: DashboardTemplateLayoutItem
CREATE TABLE "dashboardTemplateLayoutItems" (
    id TEXT PRIMARY KEY,
    "widgetId" TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    w INTEGER NOT NULL,
    h INTEGER NOT NULL,
    "dashboardTemplateId" TEXT NOT NULL REFERENCES "dashboardTemplates"(id) ON DELETE CASCADE
);

-- Add indexes for foreign keys
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