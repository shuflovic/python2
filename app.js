const commandInput = document.getElementById('commandInput');
const status = document.getElementById('status');

function processCommand() {
    const command = commandInput.value;
    handleCommand(command);
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        status.textContent = 'Voice recognition not supported in this browser.';
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = function() {
        status.textContent = 'Voice recognition started. Speak now.';
    };

    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript;
        status.textContent = `You said: ${command}`;
        handleCommand(command);
    };

    recognition.onerror = function(event) {
        status.textContent = `Error occurred in recognition: ${event.error}`;
    };

    recognition.onend = function() {
        status.textContent = 'Voice recognition ended.';
    };

    recognition.start();
}

function handleCommand(command) {
    // Placeholder for processing commands
    status.textContent = `Processing command: ${command}`;
}
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const redirectUri = 'YOUR_REDIRECT_URI'; // E.g., http://localhost:3000/callback

// Function to redirect user to Spotify's authorization page
function authorize() {
    const scopes = 'user-read-private user-read-email user-modify-playback-state'; // Add more scopes as needed
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
}

// Function to handle the callback and exchange the authorization code for an access token
async function handleCallback() {
    const code = new URLSearchParams(window.location.search).get('code');
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    });

    const data = await response.json();
    const accessToken = data.access_token;
    // Store the access token and use it to make Spotify API requests
    localStorage.setItem('spotifyAccessToken', accessToken);
    status.textContent = 'Authorization successful!';
}

// Call authorize() when the user needs to log in and handleCallback() when the user is redirected back to your app
if (window.location.search.includes('code=')) {
    handleCallback();
}

async function playTrack(trackUri) {
    const accessToken = localStorage.getItem('spotifyAccessToken');

    if (!accessToken) {
        status.textContent = 'Please authorize with Spotify first.';
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [trackUri] })
    });

    if (response.ok) {
        status.textContent = 'Playing track!';
    } else {
        const errorData = await response.json();
        status.textContent = `Error: ${errorData.error.message}`;
    }
}

async function playPlaylist(playlistUri) {
    const accessToken = localStorage.getItem('spotifyAccessToken');

    if (!accessToken) {
        status.textContent = 'Please authorize with Spotify first.';
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ context_uri: playlistUri })
    });

    if (response.ok) {
        status.textContent = 'Playing playlist!';
    } else {
        const errorData = await response.json();
        status.textContent = `Error: ${errorData.error.message}`;
    }
}

function handleCommand(command) {
    status.textContent = `Processing command: ${command}`;
    // Example: "play track spotify:track:4iV5W9uYEdYUVa79Axb7Rh"
    if (command.startsWith('play track ')) {
        const trackUri = command.replace('play track ', '');
        playTrack(trackUri);
    } else if (command.startsWith('play playlist ')) {
        const playlistUri = command.replace('play playlist ', '');
        playPlaylist(playlistUri);
    } else {
        status.textContent = `Unknown command: ${command}`;
    }
}
