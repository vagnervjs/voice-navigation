// Global test setup
import { vi } from 'vitest';

// Mock config.js to ensure consistent environment variables
vi.mock('./config.js', () => ({ 
  CONFIG: {
    VOICE_RECOGNITION: {
      LANGUAGE: 'en-US',
      CONFIDENCE_THRESHOLD: 0.6,
      MAX_ALTERNATIVES: 3,
      CONTINUOUS: true,
      INTERIM_RESULTS: false,
    },
    MAPS: {
      DEFAULT_ZOOM: 100,
      POSITION_RATE: 0.0001,
      POV_RATE: 5,
      FAST_MODE_MULTIPLIER: 5,
    },
    KEYBOARD_CODES: {
      START_VOICE: 83, // S
      STOP_VOICE: 69, // E
      ENTER: 13,
      ARROW_UP: 38,
      ARROW_DOWN: 40,
      ARROW_LEFT: 37,
      ARROW_RIGHT: 39,
      H: 72,
      J: 74,
      N: 78,
      M: 77,
    },
    GEOLOCATION: {
      TIMEOUT: 10000,
      MAXIMUM_AGE: 300000, // 5 minutes
      ENABLE_HIGH_ACCURACY: true,
    },
    API: {
      GEOCODING_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
      GOOGLE_MAPS: {
        VERSION: 'weekly',
        LIBRARIES: ['maps', 'streetView'],
        API_KEY: 'test-api-key', // Explicitly set API_KEY here
      },
    },
  },
  VOICE_COMMANDS: []
}));

// Mock Web Speech API
global.SpeechRecognition = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  continuous: false,
  interimResults: false,
  lang: 'en-US',
}));

global.webkitSpeechRecognition = global.SpeechRecognition;

// Mock Geolocation API
global.navigator.geolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

// Mock Google Maps API
global.google = {
  maps: {
    StreetViewPanorama: vi.fn(),
    StreetViewService: vi.fn(),
    Geocoder: vi.fn(),
    Map: vi.fn(),
    event: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    StreetViewStatus: {
      OK: 'OK',
    },
    GeocoderStatus: {
      OK: 'OK',
    },
    importLibrary: vi.fn(async (library) => {
      // Simulate loading of libraries
      if (!['maps', 'streetView'].includes(library)) {
        throw new Error(`Unknown library: ${library}`);
      }
      return {}; // Return an empty object to simulate successful import
    }),
  },
};

// Global stub for import.meta.env to be available before any modules are loaded
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_GOOGLE_MAPS_API_KEY: 'test-api-key',
      VITE_GEOCODING_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
      VITE_GOOGLE_MAPS_VERSION: 'weekly',
      VITE_VOICE_CONFIDENCE_THRESHOLD: '0.6',
      VITE_VOICE_LANGUAGE: 'en-US',
      VITE_MAPS_DEFAULT_ZOOM: '100',
      VITE_GEOLOCATION_TIMEOUT: '10000',
    },
  },
}); 