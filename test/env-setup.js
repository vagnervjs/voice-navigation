import { vi } from 'vitest';

vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_GOOGLE_MAPS_API_KEY: 'test-api-key',
      VITE_GEOCODING_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
      VITE_GOOGLE_MAPS_VERSION: 'weekly',
      VITE_VOICE_CONFIDENCE_THRESHOLD: '0.6',
      VITE_VOICE_LANGUAGE: 'en-US',
      VITE_MAPS_DEFAULT_ZOOM: '100',
      VITE_GEOLOCATION_TIMEOUT: '10000',
    },
  },
}); 