import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Config Module', () => {
  let CONFIG;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock('./config.js', () => ({
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
          START_VOICE: 83,
          STOP_VOICE: 69,
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
          MAXIMUM_AGE: 300000,
          ENABLE_HIGH_ACCURACY: true,
        },
        API: {
          GEOCODING_BASE_URL:
            'https://maps.googleapis.com/maps/api/geocode/json',
          GOOGLE_MAPS: {
            API_KEY: 'test-api-key',
            VERSION: 'weekly',
            LIBRARIES: ['maps', 'streetView'],
          },
        },
      },
    }));
    CONFIG = (await import('./config.js')).CONFIG;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CONFIG object', () => {
    it('should have API configuration', () => {
      expect(CONFIG.API).toBeDefined();
      expect(CONFIG.API.GEOCODING_BASE_URL).toBeDefined();
    });

    it('should have Google Maps configuration', () => {
      expect(CONFIG.API.GOOGLE_MAPS).toBeDefined();
      expect(CONFIG.API.GOOGLE_MAPS.API_KEY).toBe('test-api-key');
      expect(CONFIG.API.GOOGLE_MAPS.VERSION).toBeDefined();
      expect(CONFIG.API.GOOGLE_MAPS.LIBRARIES).toEqual(['maps', 'streetView']);
    });

    it('should have voice configuration', () => {
      expect(CONFIG.VOICE_RECOGNITION).toBeDefined();
      expect(CONFIG.VOICE_RECOGNITION.CONFIDENCE_THRESHOLD).toBeTypeOf(
        'number'
      );
      expect(CONFIG.VOICE_RECOGNITION.LANGUAGE).toBeTypeOf('string');
    });

    it('should have UI configuration', () => {
      expect(CONFIG.MAPS).toBeDefined();
      expect(CONFIG.MAPS.DEFAULT_ZOOM).toBeTypeOf('number');
    });

    it('should have geolocation configuration', () => {
      expect(CONFIG.GEOLOCATION).toBeDefined();
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeTypeOf('number');
      expect(CONFIG.GEOLOCATION.MAXIMUM_AGE).toBeTypeOf('number');
      expect(CONFIG.GEOLOCATION.ENABLE_HIGH_ACCURACY).toBeTypeOf('boolean');
    });

    it('should parse numeric values correctly', () => {
      expect(CONFIG.VOICE_RECOGNITION.CONFIDENCE_THRESHOLD).toBeGreaterThan(0);
      expect(CONFIG.VOICE_RECOGNITION.CONFIDENCE_THRESHOLD).toBeLessThanOrEqual(
        1
      );
      expect(CONFIG.MAPS.DEFAULT_ZOOM).toBeGreaterThan(0);
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeGreaterThan(0);
    });

    it('should have sensible default values', () => {
      expect(
        CONFIG.VOICE_RECOGNITION.CONFIDENCE_THRESHOLD
      ).toBeGreaterThanOrEqual(0.5);
      expect(CONFIG.MAPS.DEFAULT_ZOOM).toBeGreaterThanOrEqual(1);
      expect(CONFIG.MAPS.DEFAULT_ZOOM).toBeLessThanOrEqual(100);
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeGreaterThanOrEqual(5000);
    });
  });
});
