// Utility functions used across the application
import { CONFIG } from './config.js';

/**
 * Check if fast mode is enabled
 * @returns {boolean}
 */
export const isFastModeEnabled = () => document.getElementById('fast-mode-checkbox')?.checked || false;

/**
 * Check if an element is a form input
 * @param {Element} element
 * @returns {boolean}
 */
export const isFormInput = (element) => {
  const tagName = element?.nodeType === 1 ? element.nodeName.toLowerCase() : '';
  return /input|select|textarea/.test(tagName);
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
export const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Format coordinates to 5 decimal places
 * @param {number} lat
 * @param {number} lng
 * @returns {string}
 */
export const formatCoordinates = (lat, lng) => `(${lat.toFixed(5)}, ${lng.toFixed(5)})`;

/**
 * Get the multiplier for movement based on fast mode and custom multiplier
 * @param {number} baseMultiplier
 * @returns {number}
 */
export const getMovementMultiplier = (baseMultiplier = 1) => {
  return isFastModeEnabled() ? baseMultiplier * 5 : baseMultiplier;
};

/**
 * Build Google Maps Geocoding API URL
 * @param {string} address
 * @param {string} apiKey
 * @returns {string}
 */
export const buildGeocodingUrl = (address, apiKey) => {
  const encodedAddress = address.replace(/\s+/g, '+');
  return `${CONFIG.API.GEOCODING_BASE_URL}?address=${encodedAddress}&key=${apiKey}`;
}; 