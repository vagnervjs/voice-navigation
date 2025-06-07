import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import voiceNavigation from './voice.js';

vi.mock('./maps.js', () => ({
  default: { executeVoiceCommand: vi.fn() },
}));

vi.mock('./log.js', () => ({
  log: vi.fn(),
}));

vi.mock('./config.js', () => ({
  CONFIG: {
    VOICE_RECOGNITION: {
      LANGUAGE: 'en-US',
      CONTINUOUS: true,
      INTERIM_RESULTS: true,
      MAX_ALTERNATIVES: 3,
      CONFIDENCE_THRESHOLD: 0.7,
    },
    KEYBOARD_CODES: {
      START_VOICE: 83,
      STOP_VOICE: 69,
    },
  },
  VOICE_COMMANDS: [
    { regex: /go forward|move forward/i, code: 'MOVE_FORWARD', label: 'Moving forward' },
    { regex: /stop/i, code: 'STOP', label: 'Stopping voice recognition' },
  ],
}));

describe('Voice Navigation Module', () => {
  let mockSpeechRecognition;
  let mockMaps;
  let mockLog;

  beforeEach(async () => {
    document.body.innerHTML = '';
    mockSpeechRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      lang: '',
      continuous: false,
      interimResults: false,
      maxAlternatives: 1,
    };
    global.SpeechRecognition = vi.fn(() => mockSpeechRecognition);
    global.webkitSpeechRecognition = global.SpeechRecognition;
    const maps = await import('./maps.js');
    const { log } = await import('./log.js');
    mockMaps = maps.default;
    mockLog = log;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('init', () => {
    it('should initialize successfully when SpeechRecognition is available', () => {
      const result = voiceNavigation.init();
      expect(result).toBe(true);
      expect(global.SpeechRecognition).toHaveBeenCalled();
      expect(mockSpeechRecognition.addEventListener).toHaveBeenCalledTimes(4);
      expect(mockLog).toHaveBeenCalledWith('🎤 Voice navigation initialized - Press S to start, E to stop', 'VOICE');
    });
    it('should fail gracefully when SpeechRecognition is not available', () => {
      global.SpeechRecognition = undefined;
      global.webkitSpeechRecognition = undefined;
      const result = voiceNavigation.init();
      expect(result).toBe(false);
      expect(mockLog).toHaveBeenCalledWith('❌ Web Speech API is not supported in this browser', 'ERROR');
    });
    it('should configure speech recognition with correct settings', () => {
      voiceNavigation.init();
      expect(mockSpeechRecognition.lang).toBe('en-US');
      expect(mockSpeechRecognition.continuous).toBe(true);
      expect(mockSpeechRecognition.interimResults).toBe(true);
      expect(mockSpeechRecognition.maxAlternatives).toBe(3);
    });
  });

  describe('start and stop', () => {
    beforeEach(() => { voiceNavigation.init(); });
    it('should start voice recognition when not currently listening', () => {
      voiceNavigation.isCurrentlyListening = false;
      voiceNavigation.start();
      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });
    it('should not start voice recognition when already listening', () => {
      voiceNavigation.isCurrentlyListening = true;
      voiceNavigation.start();
      expect(mockSpeechRecognition.start).not.toHaveBeenCalled();
    });
    it('should stop voice recognition when currently listening', () => {
      voiceNavigation.isCurrentlyListening = true;
      voiceNavigation.stop();
      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    });
    it('should not stop voice recognition when not listening', () => {
      voiceNavigation.isCurrentlyListening = false;
      voiceNavigation.stop();
      expect(mockSpeechRecognition.stop).not.toHaveBeenCalled();
    });
  });

  describe('speech event handling', () => {
    beforeEach(() => { voiceNavigation.init(); });
    it('should handle speech recognition start event', () => {
      const startListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'start')[1];
      startListener();
      expect(voiceNavigation.isCurrentlyListening).toBe(true);
      expect(mockLog).toHaveBeenCalledWith('🎤 Voice recognition started', 'VOICE');
    });
    it('should handle speech recognition end event', () => {
      voiceNavigation.isCurrentlyListening = true;
      const endListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'end')[1];
      endListener();
      expect(voiceNavigation.isCurrentlyListening).toBe(false);
      expect(mockLog).toHaveBeenCalledWith('🛑 Voice recognition stopped', 'VOICE');
    });
    it('should handle speech recognition error event', () => {
      voiceNavigation.isCurrentlyListening = true;
      const errorListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'error')[1];
      errorListener({ error: 'network' });
      expect(voiceNavigation.isCurrentlyListening).toBe(false);
      expect(mockLog).toHaveBeenCalledWith('❗ Voice recognition error: network', 'ERROR');
    });
  });

  describe('speech result processing', () => {
    beforeEach(() => { voiceNavigation.init(); });
    it('should process speech result with high confidence', () => {
      const resultListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'result')[1];
      const mockEvent = { results: [{ 0: { transcript: 'go forward', confidence: 0.95 } }] };
      mockEvent.results.length = 1;
      resultListener(mockEvent);
      expect(mockLog).toHaveBeenCalledWith('Heard: "go forward" (95%)', 'VOICE');
      expect(mockMaps.executeVoiceCommand).toHaveBeenCalled();
    });
    it('should ignore speech result with low confidence', () => {
      const resultListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'result')[1];
      const mockEvent = { results: [{ 0: { transcript: 'unclear speech', confidence: 0.3 } }] };
      mockEvent.results.length = 1;
      resultListener(mockEvent);
      expect(mockLog).toHaveBeenCalledWith('Low confidence, ignoring command', 'VOICE', 'gray');
      expect(mockMaps.executeVoiceCommand).not.toHaveBeenCalled();
    });
    it('should handle unrecognized voice commands', () => {
      const resultListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'result')[1];
      const mockEvent = { results: [{ 0: { transcript: 'unrecognized command', confidence: 0.95 } }] };
      mockEvent.results.length = 1;
      resultListener(mockEvent);
      expect(mockLog).toHaveBeenCalledWith('No recognized command. Try: "go forward", "turn left", "look up"', 'VOICE', 'gray');
    });
    it('should handle stop command specially', () => {
      const resultListener = mockSpeechRecognition.addEventListener.mock.calls.find(call => call[0] === 'result')[1];
      const mockEvent = { results: [{ 0: { transcript: 'stop', confidence: 0.95 } }] };
      mockEvent.results.length = 1;
      resultListener(mockEvent);
      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    });
  });

  describe('keyboard controls', () => {
    beforeEach(() => { voiceNavigation.init(); voiceNavigation.isCurrentlyListening = false; });
    it('should start voice recognition on S key press', () => {
      const keyEvent = new KeyboardEvent('keyup', { keyCode: 83 });
      document.body.dispatchEvent(keyEvent);
      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });
    it('should stop voice recognition on E key press when listening', () => {
      voiceNavigation.isCurrentlyListening = true;
      const keyEvent = new KeyboardEvent('keyup', { keyCode: 69 });
      document.body.dispatchEvent(keyEvent);
      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    });
    it('should not respond to keyboard when focused on form input', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      const keyEvent = new KeyboardEvent('keyup', { keyCode: 83 });
      Object.defineProperty(keyEvent, 'target', { value: input });
      document.body.dispatchEvent(keyEvent);
      expect(mockSpeechRecognition.start).not.toHaveBeenCalled();
    });
  });
});
