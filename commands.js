// commands.js - Additional Spotify control functions

// Playback control functions
async function pausePlayback() {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus('Playback paused', 'success');
    } catch (error) {
        console.error('Pause error:', error);
        updateStatus(`Error pausing playback: ${error.message}`, 'error');
    }
}

async function resumePlayback() {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus('Playback resumed', 'success');
        setTimeout(getCurrentPlayback, 1000);
    } catch (error) {
        console.error('Resume error:', error);
        updateStatus(`Error resuming playback: ${error.message}`, 'error');
    }
}

async function skipToNext() {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus('Skipped to next track', 'success');
        setTimeout(getCurrentPlayback, 1000);
    } catch (error) {
        console.error('Skip next error:', error);
        updateStatus(`Error skipping to next track: ${error.message}`, 'error');
    }
}

async function skipToPrevious() {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus('Skipped to previous track', 'success');
        setTimeout(getCurrentPlayback, 1000);
    } catch (error) {
        console.error('Skip previous error:', error);
        updateStatus(`Error skipping to previous track: ${error.message}`, 'error');
    }
}

async function setVolume(level) {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    // Ensure level is between 0 and 100
    level = Math.max(0, Math.min(100, level));
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${level}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus(`Volume set to ${level}%`, 'success');
    } catch (error) {
        console.error('Set volume error:', error);
        updateStatus(`Error setting volume: ${error.message}`, 'error');
    }
}

// Toggle shuffle mode
async function toggleShuffle(state) {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        updateStatus(`Shuffle mode ${state ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
        console.error('Toggle shuffle error:', error);
        updateStatus(`Error toggling shuffle mode: ${error.message}`, 'error');
    }
}

// Set repeat mode (track, context, or off)
async function setRepeatMode(mode) {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return;
    }
    
    // Validate mode
    if (!['track', 'context', 'off'].includes(mode)) {
        updateStatus(`Invalid repeat mode: ${mode}`, 'error');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${mode}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 404) {
            throw new Error('No active device found');
        }
        
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Unknown error');
        }
        
        let modeText = mode;
        if (mode === 'context') modeText = 'playlist repeat';
        if (mode === 'track') modeText = 'track repeat';
        
        updateStatus(`Repeat mode set to ${modeText}`, 'success');
    } catch (error) {
        console.error('Set repeat mode error:', error);
        updateStatus(`Error setting repeat mode: ${error.message}`, 'error');
    }
}

// Get user's top tracks
async function getUserTopTracks() {
    if (!await ensureValidToken()) {
        updateStatus('Please log in to Spotify', 'error');
        return null;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to get top tracks');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Get top tracks error:', error);
        updateStatus(`Error getting top tracks: ${error.message}`, 'error');
        return null;
    }
}

// Enhanced command handler extension
function extendCommandHandler() {
    // Add this to the existing handleCommand function to support more commands
    
    // Volume control
    if (lowerCommand.includes('volume')) {
        const volumeMatch = lowerCommand.match(/(?:set\s+)?volume\s+(?:to\s+)?(\d+)(?:\s+percent)?/i);
        if (volumeMatch && volumeMatch[1]) {
            const volumeLevel = parseInt(volumeMatch[1], 10);
            setVolume(volumeLevel);
            return;
        }
        
        // Handle relative volume
        if (lowerCommand.includes('up') || lowerCommand.includes('increase')) {
            // Get current volume first
            getCurrentPlayback().then(data => {
                if (data && data.device && typeof data.device.volume_percent === 'number') {
                    const newVolume = Math.min(100, data.device.volume_percent + 10);
                    setVolume(newVolume);
                } else {
                    setVolume(50); // Default if can't get current volume
                }
            });
            return;
        }
        
        if (lowerCommand.includes('down') || lowerCommand.includes('decrease')) {
            // Get current volume first
            getCurrentPlayback().then(data => {
                if (data && data.device && typeof data.device.volume_percent === 'number') {
                    const newVolume = Math.max(0, data.device.volume_percent - 10);
                    setVolume(newVolume);
                } else {
                    setVolume(30); // Default if can't get current volume
                }
            });
            return;
        }
    }
    
    // Play/pause controls
    if (lowerCommand === 'pause' || lowerCommand === 'stop') {
        pausePlayback();
        return;
    }
    
    if (lowerCommand === 'play' || lowerCommand === 'resume') {
        resumePlayback();
        return;
    }
    
    // Skip controls
    if (lowerCommand === 'next' || lowerCommand === 'skip' || lowerCommand.includes('next track')) {
        skipToNext();
        return;
    }
    
    if (lowerCommand === 'previous' || lowerCommand === 'back' || lowerCommand.includes('previous track')) {
        skipToPrevious();
        return;
    }
    
    // Shuffle control
    if (lowerCommand.includes('shuffle')) {
        const shuffleState = !lowerCommand.includes('off') && !lowerCommand.includes('disable');
        toggleShuffle(shuffleState);
        return;
    }
    
    // Repeat control
    if (lowerCommand.includes('repeat')) {
        let mode = 'context'; // Default to playlist repeat
        
        if (lowerCommand.includes('track') || lowerCommand.includes('song')) {
            mode = 'track';
        } else if (lowerCommand.includes('off') || lowerCommand.includes('disable') || lowerCommand.includes('none')) {
            mode = 'off';
        }
        
        setRepeatMode(mode);
        return;
    }
    
    // Play top tracks
    if (lowerCommand.includes('top') && (lowerCommand.includes('track') || lowerCommand.includes('song'))) {
        getUserTopTracks().then(data => {
            if (data && data.items && data.items.length > 0) {
                // Create a playlist of URIs
                const trackUris = data.items.map(track => track.uri);
                
                // Play the first track
                playTrack(trackUris[0]);
                
                updateStatus('Playing your top tracks', 'success');
            } else {
                updateStatus('Unable to retrieve top tracks', 'error');
            }
        });
        return;
    }
}