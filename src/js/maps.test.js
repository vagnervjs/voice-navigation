import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import maps from './maps.js';

// Mock dependencies
vi.mock('./log.js', () => ({
  log: vi.fn(),
}));

vi.mock('./config.js', () => ({
  CONFIG: {
    MAPS: {
      DEFAULT_ZOOM: 10,
      POSITION_RATE: 0.001,
      POV_RATE: 10,
    },
    KEYBOARD_CODES: {
      ARROW_UP: 38,
      ARROW_DOWN: 40,
      ARROW_LEFT: 37,
      ARROW_RIGHT: 39,
      H: 72,
      J: 74,
      N: 78,
      M: 77,
    },
  },
}));

// Mock the utils module to control formatCoordinates behavior
vi.mock('./utils.js', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    formatCoordinates: vi.fn(
      (lat, lng) => `(${lat.toFixed(5)}, ${lng.toFixed(5)})`
    ),
    isFormInput: vi.fn(actual.isFormInput),
  };
});

describe('Maps Controller Module', () => {
  let mockLog;
  let mockGoogleMaps;
  let mockMap;
  let mockStreetView;
  let mockFormatCoordinates;

  beforeEach(async () => {
    // Get mocked modules
    const { log } = await import('./log.js');
    const utils = await import('./utils.js');
    mockLog = log;
    mockFormatCoordinates = utils.formatCoordinates;

    // Mock DOM elements
    document.body.innerHTML = `
      <div id="map"></div>
      <div id="street-view"></div>
    `;

    // Mock Google Maps classes
    mockMap = {
      zoom: 10,
      center: null,
      panTo: vi.fn(),
    };

    mockStreetView = {
      position: null,
      pov: { heading: 0, pitch: 0 },
      setPosition: vi.fn(),
      setPov: vi.fn(),
      getPov: vi.fn(() => ({ heading: 0, pitch: 0 })),
    };

    mockGoogleMaps = {
      Map: vi.fn(() => mockMap),
      StreetViewPanorama: vi.fn(() => mockStreetView),
      LatLng: vi.fn((lat, lng) => ({ lat, lng })),
    };

    // Mock global Google Maps API
    global.google = {
      maps: mockGoogleMaps,
    };

    // Reset maps controller state
    maps.viewDirection = { heading: 0, pitch: 0 };
    maps.googleMapsInstances = null;
    maps.mapData = null;

    // Reset mocks
    vi.clearAllMocks();

    // Ensure formatCoordinates mock is called for the initial log
    mockFormatCoordinates.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('init', () => {
    it('should initialize successfully with valid coordinates', () => {
      maps.init(40.7128, -74.006);

      expect(mockGoogleMaps.LatLng).toHaveBeenCalledWith(40.7128, -74.006);
      expect(mockGoogleMaps.Map).toHaveBeenCalled();
      expect(mockGoogleMaps.StreetViewPanorama).toHaveBeenCalled();
      expect(maps.mapData).toEqual({
        lat: 40.7128,
        lng: -74.006,
        pov: { heading: 0, pitch: 0 },
        positionRate: 0.001,
        povRate: 10,
      });
      expect(mockLog).toHaveBeenCalledWith(
        '🗺️ Maps initialized at (40.71280, -74.00600)',
        'MAPS'
      );
    });

    it('should fail when map containers are missing', () => {
      document.body.innerHTML = '';

      expect(() => {
        maps.init(40.7128, -74.006);
      }).toThrow('Map containers not found');
    });

    it('should reset view direction on initialization', () => {
      maps.viewDirection = { heading: 45, pitch: 30 };

      maps.init(40.7128, -74.006);

      expect(maps.viewDirection).toEqual({ heading: 0, pitch: 0 });
    });
  });

  describe('position updates', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should update position when mapData exists', () => {
      maps.mapData.lat = 40.7589;
      maps.mapData.lng = -73.9851;

      maps.updatePosition();

      expect(mockGoogleMaps.LatLng).toHaveBeenCalledWith(40.7589, -73.9851);
      expect(mockMap.panTo).toHaveBeenCalled();
      expect(mockStreetView.setPosition).toHaveBeenCalled();
    });

    it('should not update when mapData is null', () => {
      maps.mapData = null;

      maps.updatePosition();

      expect(mockMap.panTo).not.toHaveBeenCalled();
      expect(mockStreetView.setPosition).not.toHaveBeenCalled();
    });

    it('should update view direction', () => {
      maps.viewDirection.heading = 90;
      maps.viewDirection.pitch = 15;

      maps.updateViewDirection();

      expect(mockStreetView.getPov).toHaveBeenCalled();
      expect(mockStreetView.setPov).toHaveBeenCalledWith({
        heading: 90,
        pitch: 15,
      });
    });
  });

  describe('voice command execution', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should handle MOVE_FORWARD command', () => {
      const originalLat = maps.mapData.lat;

      maps.executeVoiceCommand('MOVE_FORWARD');

      expect(maps.mapData.lat).toBeGreaterThan(originalLat);
    });

    it('should handle MOVE_BACKWARD command', () => {
      const originalLat = maps.mapData.lat;

      maps.executeVoiceCommand('MOVE_BACKWARD');

      expect(maps.mapData.lat).toBeLessThan(originalLat);
    });

    it('should handle TURN_LEFT command', () => {
      maps.executeVoiceCommand('TURN_LEFT');

      expect(maps.viewDirection.heading).toBe(-10);
      expect(maps.mapData.pov.heading).toBe(-10);
    });

    it('should handle TURN_RIGHT command', () => {
      maps.executeVoiceCommand('TURN_RIGHT');

      expect(maps.viewDirection.heading).toBe(10);
      expect(maps.mapData.pov.heading).toBe(10);
    });

    it('should handle LOOK_UP command', () => {
      maps.executeVoiceCommand('LOOK_UP');

      expect(maps.viewDirection.pitch).toBe(10);
      expect(maps.mapData.pov.pitch).toBe(10);
    });

    it('should handle LOOK_DOWN command', () => {
      maps.executeVoiceCommand('LOOK_DOWN');

      expect(maps.viewDirection.pitch).toBe(-10);
      expect(maps.mapData.pov.pitch).toBe(-10);
    });

    it('should handle directional commands', () => {
      const originalLat = maps.mapData.lat;
      const originalLng = maps.mapData.lng;

      maps.executeVoiceCommand('GO_NORTH');
      expect(maps.mapData.lat).toBeGreaterThan(originalLat);

      maps.mapData.lat = originalLat;
      maps.executeVoiceCommand('GO_SOUTH');
      expect(maps.mapData.lat).toBeLessThan(originalLat);

      maps.executeVoiceCommand('GO_EAST');
      expect(maps.mapData.lng).toBeGreaterThan(originalLng);

      maps.mapData.lng = originalLng;
      maps.executeVoiceCommand('GO_WEST');
      expect(maps.mapData.lng).toBeLessThan(originalLng);
    });

    it('should apply multiplier to movement', () => {
      const originalLat = maps.mapData.lat;

      maps.executeVoiceCommand('GO_NORTH', 2);

      expect(maps.mapData.lat).toBe(originalLat + 0.002); // 0.001 * 2
    });

    it('should not execute commands when mapData is null', () => {
      maps.mapData = null;

      maps.executeVoiceCommand('MOVE_FORWARD');

      // Should not throw or crash
      expect(mockMap.panTo).not.toHaveBeenCalled();
    });
  });

  describe('keyboard input handling', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should handle arrow key navigation', () => {
      const originalLat = maps.mapData.lat;
      const originalHeading = maps.mapData.pov.heading;

      maps.handleKeyboardInput(38); // UP - backward
      expect(maps.mapData.lat).toBeGreaterThan(originalLat);

      maps.mapData.lat = originalLat;
      maps.handleKeyboardInput(40); // DOWN - forward
      expect(maps.mapData.lat).toBeLessThan(originalLat);

      maps.handleKeyboardInput(37); // LEFT - heading++
      expect(maps.mapData.pov.heading).toBeGreaterThan(originalHeading);

      maps.mapData.pov.heading = originalHeading;
      maps.handleKeyboardInput(39); // RIGHT - heading--
      expect(maps.mapData.pov.heading).toBeLessThan(originalHeading);
    });

    it('should handle directional keys', () => {
      const originalLng = maps.mapData.lng;
      const originalPitch = maps.mapData.pov.pitch;

      maps.handleKeyboardInput(72); // H - left
      expect(maps.mapData.lng).toBeLessThan(originalLng);

      maps.mapData.lng = originalLng;
      maps.handleKeyboardInput(74); // J - right
      expect(maps.mapData.lng).toBeGreaterThan(originalLng);

      maps.handleKeyboardInput(78); // N - pitch++
      expect(maps.mapData.pov.pitch).toBeGreaterThan(originalPitch);

      maps.mapData.pov.pitch = originalPitch;
      maps.handleKeyboardInput(77); // M - pitch--
      expect(maps.mapData.pov.pitch).toBeLessThan(originalPitch);
    });

    it('should apply multiplier to keyboard input', () => {
      const originalLat = maps.mapData.lat;

      maps.handleKeyboardInput(40, 3); // DOWN with multiplier 3

      expect(maps.mapData.lat).toBe(originalLat - 0.003); // -0.001 * 3
    });

    it('should not handle input when mapData is null', () => {
      maps.mapData = null;

      maps.handleKeyboardInput(40);

      expect(mockMap.panTo).not.toHaveBeenCalled();
    });
  });

  describe('pitch constraints', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should constrain pitch to -90 to 90 degrees', () => {
      maps.viewDirection.pitch = 85;
      maps._adjustPitch(10);
      expect(maps.viewDirection.pitch).toBe(90);

      maps.viewDirection.pitch = -85;
      maps._adjustPitch(-10);
      expect(maps.viewDirection.pitch).toBe(-90);
    });
  });

  describe('setPosition', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should update position when mapData exists', () => {
      maps.setPosition(41.8781, -87.6298);

      expect(maps.mapData.lat).toBe(41.8781);
      expect(maps.mapData.lng).toBe(-87.6298);
      expect(mockMap.panTo).toHaveBeenCalled();
    });

    it('should not update when mapData is null', () => {
      maps.mapData = null;

      maps.setPosition(41.8781, -87.6298);

      expect(mockMap.panTo).not.toHaveBeenCalled();
    });
  });

  describe('keyboard event listeners', () => {
    beforeEach(() => {
      maps.init(40.7128, -74.006);
    });

    it('should respond to keyboard events', () => {
      const originalLat = maps.mapData.lat;

      const keyEvent = new KeyboardEvent('keydown', { keyCode: 40 }); // DOWN
      document.body.dispatchEvent(keyEvent);

      expect(maps.mapData.lat).toBeLessThan(originalLat);
    });

    it('should not respond when focused on form input', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      const originalLat = maps.mapData.lat;

      const keyEvent = new KeyboardEvent('keydown', { keyCode: 40 });
      Object.defineProperty(keyEvent, 'target', { value: input });
      document.body.dispatchEvent(keyEvent);

      expect(maps.mapData.lat).toBe(originalLat);
    });
  });
});
