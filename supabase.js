/*import { createClient } from '@supabase/supabase-js';

// supabase-config.js
const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);*/

export const supabaseUrl = 'https://rigsljqkzlnemypqjlbk.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';

export { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


// Export the client if using modules
// export { supabaseClient };

// Save a favorite to Supabase
async function saveFavorite(name, type, spotifyUri) {
  try {
    // For simplicity, we're not using user authentication here
    // In a real app, you'd get the user ID from the authenticated session
    const { data, error } = await supabaseClient
      .from('favorites')
      .insert([
        { 
          name: name, 
          type: type, // 'track', 'playlist', or 'album'
          spotify_uri: spotifyUri,
          // user_id would be included in an authenticated app
        }
      ]);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving favorite:', error);
    return { success: false, error: error.message };
  }
}

// Get all favorites from Supabase
async function getFavorites() {
  try {
    const { data, error } = await supabaseClient
      .from('favorites')
      .select('*')
      // .eq('user_id', userId) // Would be used in authenticated app
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, favorites: data };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { success: false, error: error.message };
  }
}

// Find a favorite by name
async function findFavoriteByName(name) {
  try {
    // Case-insensitive search with pattern matching
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .ilike('name', `%${name}%`)
      // .eq('user_id', userId) // Would be used in authenticated app
      .limit(1);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return { success: true, favorite: data[0] };
    } else {
      return { success: false, error: 'Favorite not found' };
    }
  } catch (error) {
    console.error('Error finding favorite:', error);
    return { success: false, error: error.message };
  }
}

// Save command to history
async function saveCommandHistory(command) {
  try {
    const { data, error } = await supabaseClient
      .from('command_history')
      .insert([
        { 
          command: command,
          // user_id would be included in an authenticated app
        }
      ]);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving command history:', error);
    return { success: false, error: error.message };
  }
}

// Get command history
async function getCommandHistory(limit = 10) {
  try {
    const { data, error } = await supabaseClient
      .from('command_history')
      .select('*')
      // .eq('user_id', userId) // Would be used in authenticated app
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return { success: true, history: data };
  } catch (error) {
    console.error('Error fetching command history:', error);
    return { success: false, error: error.message };
  }
}
