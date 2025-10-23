import https from 'https';

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  const supabaseUrl = 'https://pcklimtlipsyckovfmmj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBja2xpbXRsaXBzeWNrb3ZmbW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODI4MzcsImV4cCI6MjA3NTk1ODgzN30.mcOqfSZleYQOjVC4UPZY8cP8eGPqoLwdwml3KChOJ40';

  // Test basic connection to Supabase
  const testConnection = () => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'pcklimtlipsyckovfmmj.supabase.co',
        port: 443,
        path: '/rest/v1/',
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey
        }
      };

      const req = https.request(options, (res) => {
        console.log('🔗 Basic connection test:');
        console.log('Status:', res.statusCode);

        if (res.statusCode === 200) {
          console.log('✅ Supabase server is reachable\n');
          resolve(true);
        } else {
          console.log('❌ Supabase server returned:', res.statusCode);
          reject(new Error('Server not reachable'));
        }
      });

      req.on('error', (e) => {
        console.error('❌ Connection failed:', e.message);
        reject(e);
      });

      req.end();
    });
  };

  // Test if tasks table exists
  const testTasksTable = () => {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({});

      const options = {
        hostname: 'pcklimtlipsyckovfmmj.supabase.co',
        port: 443,
        path: '/rest/v1/tasks?select=id&limit=1',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      };

      console.log('📡 Testing tasks table access...');

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          console.log('Response status:', res.statusCode);

          if (res.statusCode === 200) {
            console.log('✅ Tasks table exists and is accessible');
            resolve(true);
          } else if (res.statusCode === 404 || body.includes('relation') || body.includes('does not exist')) {
            console.log('❌ Tasks table does not exist');
            console.log('🚨 SOLUTION: Run setup_database.sql in Supabase SQL Editor');
            resolve(false);
          } else {
            console.log('⚠️ Unexpected response:', body);
            resolve(false);
          }
        });
      });

      req.on('error', (e) => {
        console.error('❌ Request failed:', e.message);
        reject(e);
      });

      req.end();
    });
  };

  try {
    // Test basic connection first
    await testConnection();

    // Then test table access
    await testTasksTable();

    console.log('\n🎉 Database test completed!');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  }
}

testSupabaseConnection();