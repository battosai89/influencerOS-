import { supabase } from '../lib/supabase';
import { Influencer, Brand, Contract, Campaign, Task, Event, ContentPiece, Invoice, ContractTemplate, Notification } from '../types';

// Generic fetch function
export async function fetchData<T>(tableName: string): Promise<T[] | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return null;
  }
  return data as T[];
}

// Generic add function
export async function addData<T>(tableName: string, item: Partial<T>): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .insert(item)
    .select();

  if (error) {
    console.error(`Error adding to ${tableName}:`, error);
    return null;
  }
  return data ? (data[0] as T) : null;
}

// Generic update function
export async function updateData<T>(tableName: string, id: string, updates: Partial<T>): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating ${tableName} with id ${id}:`, error);
    return null;
  }
  return data ? (data[0] as T) : null;
}

// Generic delete function
export async function deleteData(tableName: string, id: string): Promise<boolean> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting from ${tableName} with id ${id}:`, error);
    return false;
  }
  return true;
}

// Specific CRUD operations for each entity
export const supabaseCrudService = {
  // Influencers
  fetchInfluencers: () => fetchData<Influencer>('influencers'),
  addInfluencer: (influencer: Partial<Influencer>) => addData<Influencer>('influencers', influencer),
  updateInfluencer: (id: string, updates: Partial<Influencer>) => updateData<Influencer>('influencers', id, updates),
  deleteInfluencer: (id: string) => deleteData('influencers', id),

  // Brands
  fetchBrands: () => fetchData<Brand>('brands'),
  addBrand: (brand: Partial<Brand>) => addData<Brand>('brands', brand),
  updateBrand: (id: string, updates: Partial<Brand>) => updateData<Brand>('brands', id, updates),
  deleteBrand: (id: string) => deleteData('brands', id),

  // Contracts
  fetchContracts: () => fetchData<Contract>('contracts'),
  addContract: (contract: Partial<Contract>) => addData<Contract>('contracts', contract),
  updateContract: (id: string, updates: Partial<Contract>) => updateData<Contract>('contracts', id, updates),
  deleteContract: (id: string) => deleteData('contracts', id),

  // Campaigns
  fetchCampaigns: () => fetchData<Campaign>('campaigns'),
  addCampaign: (campaign: Partial<Campaign>) => addData<Campaign>('campaigns', campaign),
  updateCampaign: (id: string, updates: Partial<Campaign>) => updateData<Campaign>('campaigns', id, updates),
  deleteCampaign: (id: string) => deleteData('campaigns', id),

  // Tasks
  fetchTasks: () => fetchData<Task>('tasks'),
  addTask: (task: Partial<Task>) => addData<Task>('tasks', task),
  updateTask: (id: string, updates: Partial<Task>) => updateData<Task>('tasks', id, updates),
  deleteTask: (id: string) => deleteData('tasks', id),

  // Events
  fetchEvents: () => fetchData<Event>('events'),
  addEvent: (event: Partial<Event>) => addData<Event>('events', event),
  updateEvent: (id: string, updates: Partial<Event>) => updateData<Event>('events', id, updates),
  deleteEvent: (id: string) => deleteData('events', id),

  // Content Pieces
  fetchContentPieces: () => fetchData<ContentPiece>('content_pieces'),
  addContentPiece: (contentPiece: Partial<ContentPiece>) => addData<ContentPiece>('content_pieces', contentPiece),
  updateContentPiece: (id: string, updates: Partial<ContentPiece>) => updateData<ContentPiece>('content_pieces', id, updates),
  deleteContentPiece: (id: string) => deleteData('content_pieces', id),

  // Invoices
  fetchInvoices: () => fetchData<Invoice>('invoices'),
  addInvoice: (invoice: Partial<Invoice>) => addData<Invoice>('invoices', invoice),
  updateInvoice: (id: string, updates: Partial<Invoice>) => updateData<Invoice>('invoices', id, updates),
  deleteInvoice: (id: string) => deleteData('invoices', id),

  // Contract Templates
  fetchContractTemplates: () => fetchData<ContractTemplate>('contract_templates'),
  addContractTemplate: (template: Partial<ContractTemplate>) => addData<ContractTemplate>('contract_templates', template),
  updateContractTemplate: (id: string, updates: Partial<ContractTemplate>) => updateData<ContractTemplate>('contract_templates', id, updates),
  deleteContractTemplate: (id: string) => deleteData('contract_templates', id),

  // Notifications
  fetchNotifications: () => fetchData<Notification>('notifications'),
  addNotification: (notification: Partial<Notification>) => addData<Notification>('notifications', notification),
  updateNotification: (id: string, updates: Partial<Notification>) => updateData<Notification>('notifications', id, updates),
  deleteNotification: (id: string) => deleteData('notifications', id),
};