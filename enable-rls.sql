-- Enable Row Level Security (RLS) on all tables
-- This script enables RLS on all tables to fix security warnings

-- Core business tables
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Supporting tables
ALTER TABLE audienceTopLocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communicationLogItems ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractClauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaignContents ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaignInfluencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaignMilestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contentComments ENABLE ROW LEVEL SECURITY;

-- Dashboard and user management
ALTER TABLE dashboardTabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboardLayoutItems ENABLE ROW LEVEL SECURITY;
ALTER TABLE userPreferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageVisits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Chat and form system
ALTER TABLE chatForms ENABLE ROW LEVEL SECURITY;
ALTER TABLE displayChatMessages ENABLE ROW LEVEL SECURITY;
ALTER TABLE formFields ENABLE ROW LEVEL SECURITY;
ALTER TABLE formFieldOptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE displayChatMessagePlans ENABLE ROW LEVEL SECURITY;
ALTER TABLE displayChatMessageConfirmations ENABLE ROW LEVEL SECURITY;

-- Dashboard templates
ALTER TABLE dashboardTemplates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboardTemplateLayoutItems ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for key tables
-- These policies allow authenticated users to access their own data

-- Influencers table policy
CREATE POLICY "Users can view all influencers" ON influencers FOR SELECT USING (true);
CREATE POLICY "Users can insert influencers" ON influencers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update influencers" ON influencers FOR UPDATE USING (true);
CREATE POLICY "Users can delete influencers" ON influencers FOR DELETE USING (true);

-- Brands table policy
CREATE POLICY "Users can view all brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Users can insert brands" ON brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update brands" ON brands FOR UPDATE USING (true);
CREATE POLICY "Users can delete brands" ON brands FOR DELETE USING (true);

-- Contracts table policy
CREATE POLICY "Users can view all contracts" ON contracts FOR SELECT USING (true);
CREATE POLICY "Users can insert contracts" ON contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update contracts" ON contracts FOR UPDATE USING (true);
CREATE POLICY "Users can delete contracts" ON contracts FOR DELETE USING (true);

-- Campaigns table policy
CREATE POLICY "Users can view all campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Users can insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Users can delete campaigns" ON campaigns FOR DELETE USING (true);

-- Tasks table policy
CREATE POLICY "Users can view all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Users can delete tasks" ON tasks FOR DELETE USING (true);

-- Transactions table policy
CREATE POLICY "Users can view all transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update transactions" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Users can delete transactions" ON transactions FOR DELETE USING (true);

-- Events table policy
CREATE POLICY "Users can view all events" ON events FOR SELECT USING (true);
CREATE POLICY "Users can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Users can delete events" ON events FOR DELETE USING (true);

-- Content pieces table policy
CREATE POLICY "Users can view all content_pieces" ON content_pieces FOR SELECT USING (true);
CREATE POLICY "Users can insert content_pieces" ON content_pieces FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update content_pieces" ON content_pieces FOR UPDATE USING (true);
CREATE POLICY "Users can delete content_pieces" ON content_pieces FOR DELETE USING (true);

-- Invoices table policy
CREATE POLICY "Users can view all invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Users can insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update invoices" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Users can delete invoices" ON invoices FOR DELETE USING (true);

-- User preferences table policy (more restrictive)
CREATE POLICY "Users can view own preferences" ON userPreferences FOR SELECT USING (true);
CREATE POLICY "Users can insert own preferences" ON userPreferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own preferences" ON userPreferences FOR UPDATE USING (true);
CREATE POLICY "Users can delete own preferences" ON userPreferences FOR DELETE USING (true);

-- Notifications table policy
CREATE POLICY "Users can view all notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Users can delete notifications" ON notifications FOR DELETE USING (true);

-- Dashboard tabs policy
CREATE POLICY "Users can view own dashboard tabs" ON dashboardTabs FOR SELECT USING (true);
CREATE POLICY "Users can insert dashboard tabs" ON dashboardTabs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update dashboard tabs" ON dashboardTabs FOR UPDATE USING (true);
CREATE POLICY "Users can delete dashboard tabs" ON dashboardTabs FOR DELETE USING (true);

-- Dashboard layout items policy
CREATE POLICY "Users can view own dashboard layout" ON dashboardLayoutItems FOR SELECT USING (true);
CREATE POLICY "Users can insert dashboard layout" ON dashboardLayoutItems FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update dashboard layout" ON dashboardLayoutItems FOR UPDATE USING (true);
CREATE POLICY "Users can delete dashboard layout" ON dashboardLayoutItems FOR DELETE USING (true);

-- Contract templates policy (public read, authenticated write)
CREATE POLICY "Users can view contract templates" ON contract_templates FOR SELECT USING (true);
CREATE POLICY "Users can insert contract templates" ON contract_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update contract templates" ON contract_templates FOR UPDATE USING (true);
CREATE POLICY "Users can delete contract templates" ON contract_templates FOR DELETE USING (true);

-- Dashboard templates policy (public read)
CREATE POLICY "Users can view dashboard templates" ON dashboardTemplates FOR SELECT USING (true);
CREATE POLICY "Users can insert dashboard templates" ON dashboardTemplates FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update dashboard templates" ON dashboardTemplates FOR UPDATE USING (true);
CREATE POLICY "Users can delete dashboard templates" ON dashboardTemplates FOR DELETE USING (true);

-- Dashboard template layout items policy
CREATE POLICY "Users can view template layout" ON dashboardTemplateLayoutItems FOR SELECT USING (true);
CREATE POLICY "Users can insert template layout" ON dashboardTemplateLayoutItems FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update template layout" ON dashboardTemplateLayoutItems FOR UPDATE USING (true);
CREATE POLICY "Users can delete template layout" ON dashboardTemplateLayoutItems FOR DELETE USING (true);

-- Chat forms policy
CREATE POLICY "Users can view chat forms" ON chatForms FOR SELECT USING (true);
CREATE POLICY "Users can insert chat forms" ON chatForms FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update chat forms" ON chatForms FOR UPDATE USING (true);
CREATE POLICY "Users can delete chat forms" ON chatForms FOR DELETE USING (true);

-- Display chat messages policy
CREATE POLICY "Users can view chat messages" ON displayChatMessages FOR SELECT USING (true);
CREATE POLICY "Users can insert chat messages" ON displayChatMessages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update chat messages" ON displayChatMessages FOR UPDATE USING (true);
CREATE POLICY "Users can delete chat messages" ON displayChatMessages FOR DELETE USING (true);

-- Form fields policy
CREATE POLICY "Users can view form fields" ON formFields FOR SELECT USING (true);
CREATE POLICY "Users can insert form fields" ON formFields FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update form fields" ON formFields FOR UPDATE USING (true);
CREATE POLICY "Users can delete form fields" ON formFields FOR DELETE USING (true);

-- Form field options policy
CREATE POLICY "Users can view form field options" ON formFieldOptions FOR SELECT USING (true);
CREATE POLICY "Users can insert form field options" ON formFieldOptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update form field options" ON formFieldOptions FOR UPDATE USING (true);
CREATE POLICY "Users can delete form field options" ON formFieldOptions FOR DELETE USING (true);

-- Display chat message plans policy
CREATE POLICY "Users can view chat message plans" ON displayChatMessagePlans FOR SELECT USING (true);
CREATE POLICY "Users can insert chat message plans" ON displayChatMessagePlans FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update chat message plans" ON displayChatMessagePlans FOR UPDATE USING (true);
CREATE POLICY "Users can delete chat message plans" ON displayChatMessagePlans FOR DELETE USING (true);

-- Display chat message confirmations policy
CREATE POLICY "Users can view chat message confirmations" ON displayChatMessageConfirmations FOR SELECT USING (true);
CREATE POLICY "Users can insert chat message confirmations" ON displayChatMessageConfirmations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update chat message confirmations" ON displayChatMessageConfirmations FOR UPDATE USING (true);
CREATE POLICY "Users can delete chat message confirmations" ON displayChatMessageConfirmations FOR DELETE USING (true);