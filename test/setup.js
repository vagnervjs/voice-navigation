// Global test setup
import { vi } from 'vitest';

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
  },
};

// Mock environment variables
vi.mock('../src/js/config.js', () => ({
  CONFIG: {
    API: {
      GEOCODING_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    },
    GOOGLE_MAPS: {
      API_KEY: 'test-api-key',
      VERSION: 'weekly',
      LIBRARIES: ['maps', 'streetView'],
    },
    VOICE: {
      CONFIDENCE_THRESHOLD: 0.6,
      LANGUAGE: 'en-US',
    },
    UI: {
      DEFAULT_ZOOM: 100,
    },
    GEOLOCATION: {
      TIMEOUT: 10000,
      MAXIMUM_AGE: 600000,
      ENABLE_HIGH_ACCURACY: true,
    },
  },
})); 