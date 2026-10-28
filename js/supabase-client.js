/* Supabase Client - Browser-compatible ES module for static site
   Uses Supabase JS SDK v2
   Exports a reusable client instance with authentication and database access */

const SUPABASE_URL = 'https://saldnwrujqcjfbgrraxd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbGRud3J1anFjamZiZ3JyYXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNDg4MjQsImV4cCI6MjEwODcyNDgyNH0.1dSLYVDAVBFLeXIJBcZ3CnkJQmgxgN4d591RoLvsibE';

// Load Supabase library from CDN
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4';
supabaseScript.onload = function() {
  // Supabase is now available as window.supabase
};
document.head.appendChild(supabaseScript);

// Wait for Supabase library to load
async function getSupabaseClient() {
  if (typeof window.supabase === 'undefined') {
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
      setTimeout(() => clearInterval(checkInterval), 5000);
    });
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Export async function to get client instance
window.getSupabaseClient = getSupabaseClient;

// Helper to check if user is authenticated
async function isAuthenticated() {
  const client = await getSupabaseClient();
  const { data: { session } } = await client.auth.getSession();
  return session !== null;
}

// Helper to get current user
async function getCurrentUser() {
  const client = await getSupabaseClient();
  const { data: { session } } = await client.auth.getSession();
  return session?.user || null;
}

// Helper to check if user is admin
async function isAdmin(userId) {
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  return data && data.user_id === userId;
}

// Export helpers
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
