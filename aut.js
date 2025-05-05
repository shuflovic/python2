let clientId;
let clientSecret;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Supabase client
  const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function getSpotifyCredentials() {
    const { data, error } = await supabaseClient
      .from('config')
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
  }

  // Example usage
  const credentials = await getSpotifyCredentials();
  clientId = credentials?.SPOTIFY_CLIENT_ID;
  clientSecret = credentials?.SPOTIFY_CLIENT_SECRET;


});

function authorize() {
  const redirectUri = 'https://shuflovic.github.io/spotify/'; // Make sure you define this!
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ');

  if (!clientId) {
    console.error('clientId not loaded yet');
    return;
  }

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = authUrl;
}
