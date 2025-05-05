# Spotify Voice Control App

A web-based application that lets you control your Spotify playback with voice commands and text input. Save your favorite tracks and playlists, and control your music with natural language.

## Features

- **Voice Control**: Use your voice to control Spotify
- **Text Commands**: Type commands to control playback
- **Favorites Management**: Save and quickly access your favorite tracks and playlists
- **Natural Language Processing**: Use natural commands like "play my workout playlist"
- **Supabase Backend**: Store your favorites and command history in a Supabase database

## Setup Instructions

### Prerequisites

1. A Spotify account (Premium required for playback control)
2. Supabase account for backend storage
3. Modern web browser (Chrome recommended for voice recognition)

### Step 1: Set up Spotify Developer App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Create a new application
3. Note your Client ID and Client Secret
4. Add `http://localhost:3000` (or your hosting URL) to the Redirect URIs in app settings

### Step 2: Set up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Create the database tables as defined in the schema below
3. Note your Supabase URL and anon public key

### Step 3: Configure the Application

1. Update the credentials in `app.js`:
   ```javascript
   const clientId = 'YOUR_CLIENT_ID';
   const clientSecret = 'YOUR_CLIENT_SECRET';
   ```

2. Update the Supabase configuration in `supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### Step 4: Set up Project Structure

Create these files in your project directory:
- `index.html` - The main HTML file
- `styles.css` - CSS styles for the application
- `js/app.js` - Main application logic
- `js/supabase.js` - Supabase integration
- `js/commands.js` - Additional command handling

### Step 5: Run the Application

Open `index.html` in your web browser, or host it on a web server.

## Database Schema

Here's the schema for your Supabase database:

```sql
-- Favorites table
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null, -- 'track', 'playlist', 'album'
  spotify_uri text not null,
  created_at timestamp with time zone default now()
);

-- Command history
create table command_history (
  id uuid primary key default uuid_generate_v4(),
  command text not null,
  created_at timestamp with time zone default now()
);
```

## Usage

### Voice Commands

Here are some examples of voice commands you can use:

- "Play songs by Queen"
- "Play my workout playlist"
- "Play Discover Weekly"
- "Pause"
- "Skip to next track"
- "Set volume to 50 percent"
- "Save as favorite"
- "Play my favorite rock playlist"

### Text Commands

The same commands work when typed into the text input box.

## Extending the App

Some ideas for future enhancements:

1. Multi-user support with authentication
2. Continuous listening mode with a wake word
3. Statistics dashboard for listening habits
4. Support for more complex commands
5. Visualization for currently playing tracks

## Troubleshooting

- **Authentication Issues**: Make sure your Spotify Client ID and Redirect URI are correctly configured
- **Playback Issues**: Ensure you have an active device playing Spotify (the Web API needs an active device to control)
- **Voice Recognition Issues**: Make sure you're using a supported browser (Chrome recommended)

## License

MIT License - Feel free to modify and use this code for your own projects.