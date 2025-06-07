import maps from './maps.js';
import { log } from './log.js';
import { CONFIG } from './config.js';
import { buildGeocodingUrl, formatCoordinates } from './utils.js';

class SearchController {
  constructor() {
    this.searchInput = null;
  }

  init() {
    this.searchInput = document.querySelector('#search');
    if (!this.searchInput) {
      log('❌ Search input not found', 'ERROR');
      return false;
    }

    this._setupEventListeners();
    log('🔍 Search functionality initialized', 'SEARCH');
    return true;
  }

  _setupEventListeners() {
    this.searchInput.addEventListener('keyup', event => {
      if (event.keyCode === CONFIG.KEYBOARD_CODES.ENTER) {
        this._handleSearch(event.target.value.trim());
      }
    });
  }

  async _handleSearch(searchQuery) {
    searchQuery = searchQuery.trim();
    if (!searchQuery) return;

    log(`🔎 Searching for: "${searchQuery}"`, 'SEARCH');

    try {
      const apiUrl = buildGeocodingUrl(
        searchQuery,
        CONFIG.API.GOOGLE_MAPS.API_KEY
      );
      const data = await this._fetchGeocodingData(apiUrl);

      if (data) {
        this._processGeocodingResult(data);
      }
    } catch (error) {
      log(`Geocoding fetch error: ${error.message}`, 'ERROR');
    }
  }

  async _fetchGeocodingData(url) {
    const response = await fetch(url);

    if (response.status === 429) {
      log(
        'Geocoding API rate limit exceeded. Please try again later.',
        'ERROR'
      );
      return null;
    }

    if (!response.ok) {
      log(`Geocoding API error: ${response.statusText}`, 'ERROR');
      return null;
    }

    return response.json();
  }

  _processGeocodingResult(data) {
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      log(
        `✅ Found: ${formatCoordinates(location.lat, location.lng)}`,
        'SEARCH'
      );

      if (maps.mapData) {
        maps.setPosition(location.lat, location.lng);
      } else {
        maps.init(location.lat, location.lng);
      }
    } else {
      log(`Geocoding: ${data.status}`, 'SEARCH', 'gray');
    }
  }
}

// Export singleton instance
const searchController = new SearchController();
export default searchController;
