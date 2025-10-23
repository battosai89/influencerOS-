import { createClient } from '@supabase/supabase-js';

// Use the same credentials from .env.local
const supabaseUrl = 'https://pcklimtlipsyckovfmmj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBja2xpbXRsaXBzeWNrb3ZmbW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODI4MzcsImV4cCI6MjA3NTk1ODgzN30.mcOqfSZleYQOjVC4UPZY8cP8eGPqoLwdwml3KChOJ40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEventCreation() {
  console.log('Testing event creation...');

  try {
    // First, check if events table exists and what's in it
    const { data: existingEvents, error: fetchError } = await supabase
      .from('events')
      .select('*');

    if (fetchError) {
      console.error('Error fetching events:', fetchError);
    } else {
      console.log('Existing events:', existingEvents?.length || 0);
    }

    // Try to create a test event
    const testEvent = {
      id: 'test_event_' + Date.now(),
      title: 'Test Event ' + new Date().toISOString(),
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
      type: 'Meeting',
      allDay: false
    };

    console.log('Creating test event:', testEvent);

    const { data: newEvent, error: createError } = await supabase
      .from('events')
      .insert(testEvent)
      .select();

    if (createError) {
      console.error('Error creating event:', createError);
    } else {
      console.log('Successfully created event:', newEvent);
    }

    // Fetch events again to confirm
    const { data: updatedEvents, error: refetchError } = await supabase
      .from('events')
      .select('*');

    if (refetchError) {
      console.error('Error refetching events:', refetchError);
    } else {
      console.log('Total events after creation:', updatedEvents?.length || 0);
    }

    console.log('Event creation test completed!');
    process.exit(0);

  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

testEventCreation();