 document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase client
    const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(supabaseClient);

    
async function getSpotifyCredentials() {
  const { data, error } = await supabaseClient
    .from('config') // Replace 'config' with your actual Supabase table name
    .select('*')
    .in('key', ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET']);

  if (error) {
    console.error('Error fetching credentials:', error);
    return null;
  }

  const credentials = {};
  data.forEach((row) => {
    credentials[row.key] = row.value;
  });

  return credentials;
};
  });
});
 

// Example usage
getSpotifyCredentials().then((credentials) => {
  const clientId = credentials.SPOTIFY_CLIENT_ID;
  const clientSecret = credentials.SPOTIFY_CLIENT_SECRET;

  console.log(clientId);
  console.log(clientSecret);

  // Use the clientId and clientSecret in your Spotify API calls
});

function authorize() {
    // Define scopes needed for the app
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-read-collaborative'
    ].join(' ');
    
    // Create authorization URL
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code`+
        `&client_id=${encodeURIComponent(clientId)}`+
        `&scope=${encodeURIComponent(scopes)}`+
        `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect to Spotify authorization page
    window.location.href = authUrl;
}
