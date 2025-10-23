-- =============================================
-- DATABASE CLEANUP SCRIPT
-- WARNING: This will DELETE ALL DATA!
-- Run this ONLY on the wrong Supabase project
-- =============================================

-- Drop all tables in reverse dependency order
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

-- Drop indexes (they'll be recreated if needed)
DROP INDEX IF EXISTS "influencers_id_idx";
DROP INDEX IF EXISTS "brands_id_idx";
DROP INDEX IF EXISTS "contracts_id_idx";
DROP INDEX IF EXISTS "campaigns_id_idx";
DROP INDEX IF EXISTS "tasks_id_idx";
DROP INDEX IF EXISTS "transactions_id_idx";
DROP INDEX IF EXISTS "events_id_idx";
DROP INDEX IF EXISTS "contentPieces_id_idx";
DROP INDEX IF EXISTS "notifications_id_idx";
DROP INDEX IF EXISTS "dashboardTabs_id_idx";
DROP INDEX IF EXISTS "userPreferences_userName_idx";
DROP INDEX IF EXISTS "chatForms_id_idx";
DROP INDEX IF EXISTS "displayChatMessages_id_idx";
DROP INDEX IF EXISTS "dashboardTemplates_id_idx";

-- =============================================
-- VERIFICATION QUERY
-- =============================================

-- Check if cleanup was successful
SELECT
    '✅ Database cleanup completed!' as status,
    'All InfluencerOS tables have been removed' as message;

-- Optional: List remaining tables to verify cleanup
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';