import { Loader } from '@googlemaps/js-api-loader';
import { log, initializeLog } from './log.js';
import { CONFIG } from './config.js';
import voiceNavigation from './voice.js';
import locationController from './location.js';
import searchController from './search.js';

class VoiceNavigationApp {
  constructor() {
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: CONFIG.API.GOOGLE_MAPS.VERSION,
      libraries: [],
    });
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) {
      log('⚠️ App already initialized', 'SYSTEM', 'gray');
      return;
    }

    try {
      log('🚀 Starting Voice Navigation App...', 'SYSTEM');
      
      await this._loadGoogleMapsAPI();
      this._initializeModules();
      
      this.isInitialized = true;
      log('🎉 Voice Navigation App ready!', 'SYSTEM');
    } catch (error) {
      log(`❌ Failed to initialize app: ${error.message}`, 'ERROR');
      console.error('App initialization error:', error);
      throw error;
    }
  }

  async _loadGoogleMapsAPI() {
    log('📦 Loading Google Maps API...', 'SYSTEM');
    
    await this.loader.load();
    
    // Load required libraries
    const libraries = CONFIG.API.GOOGLE_MAPS.LIBRARIES;
    await Promise.all(
      libraries.map(library => google.maps.importLibrary(library))
    );
    
    log('✅ Google Maps API loaded successfully', 'SYSTEM');
  }

  _initializeModules() {
    log('🔧 Initializing modules...', 'SYSTEM');
    
    // Initialize log system first (to set up filters)
    initializeLog();
    
    // Initialize modules in dependency order
    const results = {
      location: locationController.init(),
      search: searchController.init(),
      voice: voiceNavigation.init()
    };

    // Log any module initialization failures
    Object.entries(results).forEach(([module, success]) => {
      if (!success) {
        log(`⚠️ ${module} module failed to initialize`, 'SYSTEM', 'gray');
      }
    });
  }
}

// Initialize and start the application
const app = new VoiceNavigationApp();
app.init().catch(error => {
  console.error('Fatal error during app initialization:', error);
});
