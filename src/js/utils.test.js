import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatCoordinates,
  isFastModeEnabled,
  isFormInput,
  degreesToRadians,
  getMovementMultiplier,
  buildGeocodingUrl,
} from './utils.js';

describe('Utils Module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('formatCoordinates', () => {
    it('should format coordinates with 5 decimal places', () => {
      expect(formatCoordinates(40.712776, -74.005974)).toBe('(40.71278, -74.00597)');
    });
    it('should handle zero coordinates', () => {
      expect(formatCoordinates(0, 0)).toBe('(0.00000, 0.00000)');
    });
    it('should handle negative coordinates', () => {
      expect(formatCoordinates(-40.712776, 74.005974)).toBe('(-40.71278, 74.00597)');
    });
  });

  describe('isFastModeEnabled', () => {
    it('should return false when checkbox does not exist', () => {
      expect(isFastModeEnabled()).toBe(false);
    });
    it('should return true when checkbox is checked', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox" checked>';
      expect(isFastModeEnabled()).toBe(true);
    });
    it('should return false when checkbox is unchecked', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox">';
      expect(isFastModeEnabled()).toBe(false);
    });
  });

  describe('isFormInput', () => {
    it('should return true for input elements', () => {
      expect(isFormInput(document.createElement('input'))).toBe(true);
    });
    it('should return true for textarea elements', () => {
      expect(isFormInput(document.createElement('textarea'))).toBe(true);
    });
    it('should return true for select elements', () => {
      expect(isFormInput(document.createElement('select'))).toBe(true);
    });
    it('should return false for div elements', () => {
      expect(isFormInput(document.createElement('div'))).toBe(false);
    });
    it('should return false for null/undefined', () => {
      expect(isFormInput(null)).toBe(false);
      expect(isFormInput(undefined)).toBe(false);
    });
  });

  describe('degreesToRadians', () => {
    it('should convert degrees to radians correctly', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('getMovementMultiplier', () => {
    it('should return base multiplier when fast mode is disabled', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox">';
      expect(getMovementMultiplier(2)).toBe(2);
    });
    it('should return 5x multiplier when fast mode is enabled', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox" checked>';
      expect(getMovementMultiplier(2)).toBe(10);
    });
    it('should use default base multiplier of 1', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox">';
      expect(getMovementMultiplier()).toBe(1);
    });
  });

  describe('buildGeocodingUrl', () => {
    it('should build correct geocoding URL', () => {
      const url = buildGeocodingUrl('New York City', 'test-api-key');
      expect(url).toContain('New+York+City');
      expect(url).toContain('test-api-key');
      expect(url).toContain('https://maps.googleapis.com/maps/api/geocode/json');
    });
    it('should handle spaces in address', () => {
      const url = buildGeocodingUrl('San Francisco California', 'test-key');
      expect(url).toContain('San+Francisco+California');
    });
  });
});
