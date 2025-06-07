import maps from './maps.js';
import { log } from './log.js';
import { CONFIG, VOICE_COMMANDS } from './config.js';
import { isFormInput, getMovementMultiplier } from './utils.js';

class VoiceNavigation {
  constructor() {
    this.speechRecognition = null;
    this.isCurrentlyListening = false;
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      log('❌ Web Speech API is not supported in this browser', 'ERROR');
      return false;
    }

    this.speechRecognition = this._createSpeechRecognition(SpeechRecognition);
    this._setupEventListeners();
    this._setupKeyboardControls();
    
    log('🎤 Voice navigation initialized - Press S to start, E to stop', 'VOICE');
    return true;
  }

  _createSpeechRecognition(SpeechRecognition) {
    const recognition = new SpeechRecognition();
    const config = CONFIG.VOICE_RECOGNITION;
    
    recognition.lang = config.LANGUAGE;
    recognition.continuous = config.CONTINUOUS;
    recognition.interimResults = config.INTERIM_RESULTS;
    recognition.maxAlternatives = config.MAX_ALTERNATIVES;
    
    return recognition;
  }

  _setupEventListeners() {
    this.speechRecognition.addEventListener('start', () => {
      this.isCurrentlyListening = true;
      log('🎤 Voice recognition started', 'VOICE');
    });

    this.speechRecognition.addEventListener('end', () => {
      this.isCurrentlyListening = false;
      log('🛑 Voice recognition stopped', 'VOICE');
    });

    this.speechRecognition.addEventListener('error', (e) => {
      this.isCurrentlyListening = false;
      log(`❗ Voice recognition error: ${e.error}`, 'ERROR');
    });

    this.speechRecognition.addEventListener('result', (e) => {
      this._handleSpeechResult(e);
    });
  }

  _handleSpeechResult(event) {
    const latestResult = event.results[event.results.length - 1];
    const spokenText = latestResult[0].transcript.trim().toLowerCase();
    const confidence = latestResult[0].confidence;
    const confidencePercent = Math.round(confidence * 100);

    log(`Heard: "${spokenText}" (${confidencePercent}%)`, 'VOICE');

    if (confidence < CONFIG.VOICE_RECOGNITION.CONFIDENCE_THRESHOLD) {
      log('Low confidence, ignoring command', 'VOICE', 'gray');
      return;
    }

    this._processVoiceCommand(spokenText);
  }

  _processVoiceCommand(spokenText) {
    const matchingCommands = VOICE_COMMANDS.filter(cmd => cmd.regex.test(spokenText));
    
    if (matchingCommands.length === 0) {
      log('No recognized command. Try: "go forward", "turn left", "look up"', 'VOICE', 'gray');
      return;
    }

    const multiplier = getMovementMultiplier();
    
    matchingCommands.forEach(command => {
      log(`✅ ${command.label}`, 'VOICE');
      
      if (command.code === 'STOP') {
        this.speechRecognition.stop();
      } else {
        maps.executeVoiceCommand(command.code, multiplier);
      }
    });
  }

  _setupKeyboardControls() {
    document.body.addEventListener('keyup', (e) => {
      if (isFormInput(e.target)) return;

      const { START_VOICE, STOP_VOICE } = CONFIG.KEYBOARD_CODES;

      if (e.keyCode === START_VOICE && !this.isCurrentlyListening) {
        this.speechRecognition.start();
      } else if (e.keyCode === STOP_VOICE && this.isCurrentlyListening) {
        this.speechRecognition.stop();
      }
    });
  }

  start() {
    if (this.speechRecognition && !this.isCurrentlyListening) {
      this.speechRecognition.start();
    }
  }

  stop() {
    if (this.speechRecognition && this.isCurrentlyListening) {
      this.speechRecognition.stop();
    }
  }
}

// Export singleton instance
const voiceNavigation = new VoiceNavigation();
export default voiceNavigation;
