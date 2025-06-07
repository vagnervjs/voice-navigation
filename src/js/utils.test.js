import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  formatCoordinates, 
  isFastModeEnabled, 
  isFormInput, 
  degreesToRadians, 
  getMovementMultiplier, 
  buildGeocodingUrl 
} from './utils.js';

describe('Utils Module', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('formatCoordinates', () => {
    it('should format coordinates with 5 decimal places', () => {
      const result = formatCoordinates(40.712776, -74.005974);
      expect(result).toBe('(40.71278, -74.00597)');
    });

    it('should handle zero coordinates', () => {
      const result = formatCoordinates(0, 0);
      expect(result).toBe('(0.00000, 0.00000)');
    });

    it('should handle negative coordinates', () => {
      const result = formatCoordinates(-40.712776, 74.005974);
      expect(result).toBe('(-40.71278, 74.00597)');
    });
  });

  describe('isFastModeEnabled', () => {
    it('should return false when checkbox does not exist', () => {
      const result = isFastModeEnabled();
      expect(result).toBe(false);
    });

    it('should return true when checkbox is checked', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox" checked>';
      const result = isFastModeEnabled();
      expect(result).toBe(true);
    });

    it('should return false when checkbox is unchecked', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox">';
      const result = isFastModeEnabled();
      expect(result).toBe(false);
    });
  });

  describe('isFormInput', () => {
    it('should return true for input elements', () => {
      const input = document.createElement('input');
      const result = isFormInput(input);
      expect(result).toBe(true);
    });

    it('should return true for textarea elements', () => {
      const textarea = document.createElement('textarea');
      const result = isFormInput(textarea);
      expect(result).toBe(true);
    });

    it('should return true for select elements', () => {
      const select = document.createElement('select');
      const result = isFormInput(select);
      expect(result).toBe(true);
    });

    it('should return false for div elements', () => {
      const div = document.createElement('div');
      const result = isFormInput(div);
      expect(result).toBe(false);
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
      const result = getMovementMultiplier(2);
      expect(result).toBe(2);
    });

    it('should return 5x multiplier when fast mode is enabled', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox" checked>';
      const result = getMovementMultiplier(2);
      expect(result).toBe(10);
    });

    it('should use default base multiplier of 1', () => {
      document.body.innerHTML = '<input type="checkbox" id="fast-mode-checkbox">';
      const result = getMovementMultiplier();
      expect(result).toBe(1);
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