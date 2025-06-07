import maps from './maps.js';
import { log } from './log.js';
import { CONFIG } from './config.js';
import { formatCoordinates } from './utils.js';

class LocationController {
  constructor() {
    this.isLocationRequested = false;
  }

  init() {
    if (!navigator.geolocation) {
      log('❌ Geolocation is not supported by this browser', 'ERROR');
      return false;
    }

    this._requestLocation();
    return true;
  }

  _requestLocation() {
    if (this.isLocationRequested) return;
    
    this.isLocationRequested = true;
    log('📍 Detecting your location...', 'LOCATION');
    
    const options = {
      enableHighAccuracy: CONFIG.GEOLOCATION.ENABLE_HIGH_ACCURACY,
      timeout: CONFIG.GEOLOCATION.TIMEOUT,
      maximumAge: CONFIG.GEOLOCATION.MAXIMUM_AGE
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => this._handleLocationSuccess(position),
      (error) => this._handleLocationError(error),
      options
    );
  }

  _handleLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    
    try {
      maps.init(latitude, longitude);
      log(`✅ Location found: ${formatCoordinates(latitude, longitude)}`, 'LOCATION');
    } catch (error) {
      log(`❌ Failed to initialize maps with location: ${error.message}`, 'ERROR');
    }
  }

  _handleLocationError(error) {
    const errorMessages = {
      1: 'User denied the request for Geolocation',
      2: 'Location information is unavailable',
      3: 'The request to get user location timed out'
    };

    const message = errorMessages[error.code] || error.message;
    log(`❌ Unable to determine your location: ${message}`, 'ERROR');
    console.error('Geolocation error:', error);
  }
}

// Export singleton instance
const locationController = new LocationController();
export default locationController;
