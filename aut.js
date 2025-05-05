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
