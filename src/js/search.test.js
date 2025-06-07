import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('./maps.js', () => ({
  default: {
    mapData: null,
    init: vi.fn(),
    setPosition: vi.fn(),
  },
}));

vi.mock('./log.js', () => ({
  log: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Mock the utils module to control formatCoordinates behavior
vi.mock('./utils.js', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    formatCoordinates: vi.fn(
      (lat, lng) => `(${lat.toFixed(5)}, ${lng.toFixed(5)})`
    ),
    buildGeocodingUrl: vi.fn((address, apiKey) => {
      const encodedAddress = address.replace(/\s+/g, '+');
      return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    }),
  };
});

describe('Search Controller Module', () => {
  let mockMaps;
  let mockLog;
  let searchInput;
  let searchController;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock('./config.js', () => ({
      CONFIG: {
        KEYBOARD_CODES: {
          ENTER: 13,
        },
        API: {
          GEOCODING_BASE_URL:
            'https://maps.googleapis.com/maps/api/geocode/json',
          GOOGLE_MAPS: {
            API_KEY: 'test-api-key',
          },
        },
      },
    }));

    // Get mocked modules
    const maps = await import('./maps.js');
    const { log } = await import('./log.js');
    mockMaps = maps.default;
    mockLog = log;

    // Set up DOM
    document.body.innerHTML = '<input id="search" type="text" />';
    searchInput = document.querySelector('#search');

    // Reset mocks
    vi.clearAllMocks();
    // Re-initialize searchController after mocks are set up
    const searchModule = await import('./search.js');
    searchController = searchModule.default;
    searchController.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('init', () => {
    it('should initialize successfully when search input exists', () => {
      const result = searchController.init();

      expect(result).toBe(true);
      expect(searchController.searchInput).toBe(searchInput);
      expect(mockLog).toHaveBeenCalledWith(
        '🔍 Search functionality initialized',
        'SEARCH'
      );
    });

    it('should fail gracefully when search input does not exist', () => {
      document.body.innerHTML = '';

      const result = searchController.init();

      expect(result).toBe(false);
      expect(mockLog).toHaveBeenCalledWith(
        '❌ Search input not found',
        'ERROR'
      );
    });

    it('should setup event listeners for Enter key', () => {
      searchController.init();

      // Mock the search method to test if it gets called
      const handleSearchSpy = vi.spyOn(searchController, '_handleSearch');

      searchInput.value = 'New York';
      const enterEvent = new KeyboardEvent('keyup', { keyCode: 13 });
      searchInput.dispatchEvent(enterEvent);

      expect(handleSearchSpy).toHaveBeenCalledWith('New York');
    });
  });

  describe('search functionality', () => {
    beforeEach(() => {
      searchController.init();
    });

    it('should not search for empty query', async () => {
      await searchController._handleSearch('');
      await searchController._handleSearch('   ');

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should log search query', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: [
              {
                geometry: {
                  location: { lat: 40.7128, lng: -74.006 },
                },
              },
            ],
          }),
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(mockLog).toHaveBeenCalledWith(
        '🔎 Searching for: "New York"',
        'SEARCH'
      );
    });

    it('should build correct geocoding URL and fetch data', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: [
              {
                geometry: {
                  location: { lat: 40.7128, lng: -74.006 },
                },
              },
            ],
          }),
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(fetch).toHaveBeenCalledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=test-api-key'
      );
    });
  });

  describe('geocoding API responses', () => {
    beforeEach(() => {
      searchController.init();
    });

    it('should handle successful geocoding response', async () => {
      mockMaps.mapData = null;
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: [
              {
                geometry: {
                  location: { lat: 40.7128, lng: -74.006 },
                },
              },
            ],
          }),
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(mockLog).toHaveBeenCalledWith(
        '✅ Found: (40.71280, -74.00600)',
        'SEARCH'
      );
      expect(mockMaps.init).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should use setPosition when mapData exists', async () => {
      mockMaps.mapData = { some: 'data' };

      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: [
              {
                geometry: {
                  location: { lat: 40.7128, lng: -74.006 },
                },
              },
            ],
          }),
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(mockMaps.setPosition).toHaveBeenCalledWith(40.7128, -74.006);
      expect(mockMaps.init).not.toHaveBeenCalled();
    });

    it('should handle rate limit error (429)', async () => {
      const mockResponse = {
        status: 429,
        ok: false,
        statusText: 'Too Many Requests',
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(mockLog).toHaveBeenCalledWith(
        'Geocoding API rate limit exceeded. Please try again later.',
        'ERROR'
      );
    });

    it('should handle API error responses', async () => {
      const mockResponse = {
        status: 500,
        ok: false,
        statusText: 'Internal Server Error',
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('New York');

      expect(mockLog).toHaveBeenCalledWith(
        'Geocoding API error: Internal Server Error',
        'ERROR'
      );
    });

    it('should handle zero results', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'ZERO_RESULTS',
            results: [],
          }),
      };

      fetch.mockResolvedValueOnce(mockResponse);

      await searchController._handleSearch('Invalid Location');

      expect(mockLog).toHaveBeenCalledWith(
        'Geocoding: ZERO_RESULTS',
        'SEARCH',
        'gray'
      );
    });

    it('should handle fetch network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await searchController._handleSearch('New York');

      expect(mockLog).toHaveBeenCalledWith(
        'Geocoding fetch error: Network error',
        'ERROR'
      );
    });
  });

  describe('geocoding result processing', () => {
    beforeEach(() => {
      searchController.init();
    });

    it('should process successful geocoding data', () => {
      mockMaps.mapData = null;
      const mockData = {
        status: 'OK',
        results: [
          {
            geometry: {
              location: { lat: 40.7128, lng: -74.006 },
            },
          },
        ],
      };

      searchController._processGeocodingResult(mockData);

      expect(mockLog).toHaveBeenCalledWith(
        '✅ Found: (40.71280, -74.00600)',
        'SEARCH'
      );
      expect(mockMaps.init).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should handle empty results array', () => {
      const mockData = {
        status: 'OK',
        results: [],
      };

      searchController._processGeocodingResult(mockData);

      expect(mockLog).toHaveBeenCalledWith('Geocoding: OK', 'SEARCH', 'gray');
      expect(mockMaps.init).not.toHaveBeenCalled();
    });

    it('should handle different API status codes', () => {
      const mockData = {
        status: 'REQUEST_DENIED',
        results: [],
      };

      searchController._processGeocodingResult(mockData);

      expect(mockLog).toHaveBeenCalledWith(
        'Geocoding: REQUEST_DENIED',
        'SEARCH',
        'gray'
      );
    });
  });
});
