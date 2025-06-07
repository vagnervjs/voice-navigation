import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CONFIG } from './config.js';

describe('Config Module', () => {
  beforeEach(() => {
    // Mock import.meta.env
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_GOOGLE_MAPS_API_KEY: 'test-api-key',
          VITE_GEOCODING_BASE_URL: 'https://test-geocoding.com',
          VITE_GOOGLE_MAPS_VERSION: 'beta',
          VITE_VOICE_CONFIDENCE_THRESHOLD: '0.8',
          VITE_VOICE_LANGUAGE: 'en-GB',
          VITE_MAPS_DEFAULT_ZOOM: '50',
          VITE_GEOLOCATION_TIMEOUT: '5000',
        },
      },
    });
  });

  describe('CONFIG object', () => {
    it('should have API configuration', () => {
      expect(CONFIG.API).toBeDefined();
      expect(CONFIG.API.GEOCODING_BASE_URL).toBeDefined();
    });

    it('should have Google Maps configuration', () => {
      expect(CONFIG.GOOGLE_MAPS).toBeDefined();
      expect(CONFIG.GOOGLE_MAPS.API_KEY).toBeDefined();
      expect(CONFIG.GOOGLE_MAPS.VERSION).toBeDefined();
      expect(CONFIG.GOOGLE_MAPS.LIBRARIES).toEqual(['maps', 'streetView']);
    });

    it('should have voice configuration', () => {
      expect(CONFIG.VOICE).toBeDefined();
      expect(CONFIG.VOICE.CONFIDENCE_THRESHOLD).toBeTypeOf('number');
      expect(CONFIG.VOICE.LANGUAGE).toBeTypeOf('string');
    });

    it('should have UI configuration', () => {
      expect(CONFIG.UI).toBeDefined();
      expect(CONFIG.UI.DEFAULT_ZOOM).toBeTypeOf('number');
    });

    it('should have geolocation configuration', () => {
      expect(CONFIG.GEOLOCATION).toBeDefined();
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeTypeOf('number');
      expect(CONFIG.GEOLOCATION.MAXIMUM_AGE).toBeTypeOf('number');
      expect(CONFIG.GEOLOCATION.ENABLE_HIGH_ACCURACY).toBeTypeOf('boolean');
    });

    it('should parse numeric values correctly', () => {
      expect(CONFIG.VOICE.CONFIDENCE_THRESHOLD).toBeGreaterThan(0);
      expect(CONFIG.VOICE.CONFIDENCE_THRESHOLD).toBeLessThanOrEqual(1);
      expect(CONFIG.UI.DEFAULT_ZOOM).toBeGreaterThan(0);
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeGreaterThan(0);
    });

    it('should have sensible default values', () => {
      // Test some reasonable defaults
      expect(CONFIG.VOICE.CONFIDENCE_THRESHOLD).toBeGreaterThanOrEqual(0.5);
      expect(CONFIG.UI.DEFAULT_ZOOM).toBeGreaterThanOrEqual(1);
      expect(CONFIG.UI.DEFAULT_ZOOM).toBeLessThanOrEqual(100);
      expect(CONFIG.GEOLOCATION.TIMEOUT).toBeGreaterThanOrEqual(5000);
    });
  });
}); 