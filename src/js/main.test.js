import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock external dependencies
vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(() => ({
    load: vi.fn(),
  })),
}));

vi.mock('./log.js', () => ({
  log: vi.fn(),
  initializeLog: vi.fn(),
}));

vi.mock('./voice.js', () => ({
  default: { init: vi.fn(() => true) },
}));

vi.mock('./location.js', () => ({
  default: { init: vi.fn(() => true) },
}));

vi.mock('./search.js', () => ({
  default: { init: vi.fn(() => true) },
}));

describe('Voice Navigation App (Main)', () => {
  let mockLoader;
  let mockLog;
  let VoiceNavigationApp;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock('./config.js', () => ({
      CONFIG: {
        API: {
          GOOGLE_MAPS: {
            API_KEY: 'test-api-key',
            VERSION: 'weekly',
            LIBRARIES: ['maps', 'streetView'],
          },
        },
      },
    }));

    const { Loader } = await import('@googlemaps/js-api-loader');
    const { log } = await import('./log.js');
    const mainModule = await import('./main.js');
    VoiceNavigationApp = mainModule.default;

    mockLoader = { load: vi.fn() };
    Loader.mockImplementation(config => {
      mockLoader.config = config;
      return mockLoader;
    });
    mockLog = log;

    global.google = { maps: { ...global.google.maps } };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('VoiceNavigationApp class', () => {
    it('should create app instance with correct configuration', async () => {
      const { Loader } = await import('@googlemaps/js-api-loader');
      const app = new VoiceNavigationApp();
      expect(Loader).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        version: 'weekly',
        libraries: [],
      });
    });

    it('should handle app initialization correctly', async () => {
      mockLoader.load.mockResolvedValue();
      global.google.maps.importLibrary.mockResolvedValue();
      const app = new VoiceNavigationApp();
      await app.init();
      expect(mockLog).toHaveBeenCalledWith(
        '🚀 Starting Voice Navigation App...',
        'SYSTEM'
      );
      expect(mockLog).toHaveBeenCalledWith(
        '📦 Loading Google Maps API...',
        'SYSTEM'
      );
      expect(mockLog).toHaveBeenCalledWith(
        '✅ Google Maps API loaded successfully',
        'SYSTEM'
      );
      expect(mockLog).toHaveBeenCalledWith(
        '🔧 Initializing modules...',
        'SYSTEM'
      );
      expect(mockLog).toHaveBeenCalledWith(
        '🎉 Voice Navigation App ready!',
        'SYSTEM'
      );
      expect(app.isInitialized).toBe(true);
    });

    it('should prevent double initialization', async () => {
      mockLoader.load.mockResolvedValue();
      global.google.maps.importLibrary.mockResolvedValue();
      const app = new VoiceNavigationApp();
      await app.init();
      await app.init();
      expect(mockLog).toHaveBeenCalledWith(
        '⚠️ App already initialized',
        'SYSTEM',
        'gray'
      );
    });

    it('should handle Google Maps API loading errors', async () => {
      const apiError = new Error('API key invalid');
      mockLoader.load.mockRejectedValue(apiError);
      const app = new VoiceNavigationApp();
      await expect(app.init()).rejects.toThrow('API key invalid');
      expect(mockLog).toHaveBeenCalledWith(
        '❌ Failed to initialize app: API key invalid',
        'ERROR'
      );
    });

    it('should initialize modules in correct order', async () => {
      mockLoader.load.mockResolvedValue();
      global.google.maps.importLibrary.mockResolvedValue();
      const app = new VoiceNavigationApp();
      await app.init();
      const { initializeLog } = await import('./log.js');
      const { default: locationController } = await import('./location.js');
      const { default: searchController } = await import('./search.js');
      const { default: voiceNavigation } = await import('./voice.js');
      expect(initializeLog).toHaveBeenCalled();
      expect(locationController.init).toHaveBeenCalled();
      expect(searchController.init).toHaveBeenCalled();
      expect(voiceNavigation.init).toHaveBeenCalled();
    });

    it('should log warnings for failed module initialization', async () => {
      mockLoader.load.mockResolvedValue();
      global.google.maps.importLibrary.mockResolvedValue();
      const { default: voiceNavigation } = await import('./voice.js');
      voiceNavigation.init.mockReturnValue(false);
      const app = new VoiceNavigationApp();
      await app.init();
      expect(mockLog).toHaveBeenCalledWith(
        '⚠️ voice module failed to initialize',
        'SYSTEM',
        'gray'
      );
    });

    it('should load required Google Maps libraries', async () => {
      mockLoader.load.mockResolvedValue();
      global.google.maps.importLibrary.mockResolvedValue();
      const app = new VoiceNavigationApp();
      await app.init();
      expect(global.google.maps.importLibrary).toHaveBeenCalledWith('maps');
      expect(global.google.maps.importLibrary).toHaveBeenCalledWith('streetView');
    });
  });
});
