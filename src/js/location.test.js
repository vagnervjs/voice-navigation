import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import locationController from './location.js';

vi.mock('./maps.js', () => ({
  default: { init: vi.fn() },
}));

vi.mock('./log.js', () => ({
  log: vi.fn(),
}));

describe('Location Controller Module', () => {
  let mockGeolocation;
  let mockMaps;
  let mockLog;

  beforeEach(async () => {
    const maps = await import('./maps.js');
    const { log } = await import('./log.js');
    mockMaps = maps.default;
    mockLog = log;
    mockGeolocation = { getCurrentPosition: vi.fn() };
    global.navigator = { geolocation: mockGeolocation };
    locationController.isLocationRequested = false;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('init', () => {
    it('should initialize successfully when geolocation is available', () => {
      const result = locationController.init();
      expect(result).toBe(true);
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      expect(mockLog).toHaveBeenCalledWith('📍 Detecting your location...', 'LOCATION');
    });
    it('should fail gracefully when geolocation is not available', () => {
      global.navigator.geolocation = undefined;
      const result = locationController.init();
      expect(result).toBe(false);
      expect(mockLog).toHaveBeenCalledWith('❌ Geolocation is not supported by this browser', 'ERROR');
    });
    it('should not request location multiple times', () => {
      locationController.init();
      locationController.init();
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
    it('should call getCurrentPosition with correct options', () => {
      locationController.init();
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  });

  describe('location success handling', () => {
    beforeEach(() => { locationController.init(); });
    it('should handle successful location detection', () => {
      const mockPosition = { coords: { latitude: 40.7128, longitude: -74.006 } };
      const successCallback = mockGeolocation.getCurrentPosition.mock.calls[0][0];
      successCallback(mockPosition);
      expect(mockMaps.init).toHaveBeenCalledWith(40.7128, -74.006);
      expect(mockLog).toHaveBeenCalledWith('✅ Location found: (40.71280, -74.00600)', 'LOCATION');
    });
    it('should handle maps initialization error', () => {
      const mockPosition = { coords: { latitude: 40.7128, longitude: -74.006 } };
      mockMaps.init.mockImplementation(() => { throw new Error('Maps initialization failed'); });
      const successCallback = mockGeolocation.getCurrentPosition.mock.calls[0][0];
      successCallback(mockPosition);
      expect(mockLog).toHaveBeenCalledWith('❌ Failed to initialize maps with location: Maps initialization failed', 'ERROR');
    });
  });

  describe('location error handling', () => {
    beforeEach(() => { locationController.init(); });
    it('should handle permission denied error', () => {
      const mockError = { code: 1, message: 'User denied geolocation' };
      const errorCallback = mockGeolocation.getCurrentPosition.mock.calls[0][1];
      errorCallback(mockError);
      expect(mockLog).toHaveBeenCalledWith('❌ Unable to determine your location: User denied the request for Geolocation', 'ERROR');
    });
    it('should handle position unavailable error', () => {
      const mockError = { code: 2, message: 'Position unavailable' };
      const errorCallback = mockGeolocation.getCurrentPosition.mock.calls[0][1];
      errorCallback(mockError);
      expect(mockLog).toHaveBeenCalledWith('❌ Unable to determine your location: Location information is unavailable', 'ERROR');
    });
    it('should handle timeout error', () => {
      const mockError = { code: 3, message: 'Request timeout' };
      const errorCallback = mockGeolocation.getCurrentPosition.mock.calls[0][1];
      errorCallback(mockError);
      expect(mockLog).toHaveBeenCalledWith('❌ Unable to determine your location: The request to get user location timed out', 'ERROR');
    });
    it('should handle unknown error', () => {
      const mockError = { code: 999, message: 'Unknown error occurred' };
      const errorCallback = mockGeolocation.getCurrentPosition.mock.calls[0][1];
      errorCallback(mockError);
      expect(mockLog).toHaveBeenCalledWith('❌ Unable to determine your location: Unknown error occurred', 'ERROR');
    });
  });
});
