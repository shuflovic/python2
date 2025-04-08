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
