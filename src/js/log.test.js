import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { log, initializeLog, LOG_CATEGORIES } from './log.js';

describe('Logger Module', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="log">
        <h3>Log</h3>
      </div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LOG_CATEGORIES', () => {
    it('should have all required categories', () => {
      expect(LOG_CATEGORIES.SYSTEM).toBeDefined();
      expect(LOG_CATEGORIES.MAPS).toBeDefined();
      expect(LOG_CATEGORIES.VOICE).toBeDefined();
      expect(LOG_CATEGORIES.SEARCH).toBeDefined();
      expect(LOG_CATEGORIES.LOCATION).toBeDefined();
      expect(LOG_CATEGORIES.ERROR).toBeDefined();
    });

    it('should have required properties for each category', () => {
      Object.values(LOG_CATEGORIES).forEach(category => {
        expect(category.label).toBeDefined();
        expect(category.icon).toBeDefined();
        expect(category.color).toBeDefined();
      });
    });
  });

  describe('log function', () => {
    it('should add log entry to DOM with correct class', () => {
      log('Test message', 'SYSTEM');

      const logContainer = document.getElementById('log');
      const logEntries = logContainer.querySelectorAll('.log-entry');
      
      expect(logEntries).toHaveLength(1);
      expect(logEntries[0].classList.contains('log-system')).toBe(true);
      expect(logEntries[0].textContent).toBe('Test message');
    });

    it('should use SYSTEM category by default', () => {
      log('Default message');

      const logContainer = document.getElementById('log');
      const logEntries = logContainer.querySelectorAll('.log-entry');
      
      expect(logEntries[0].classList.contains('log-system')).toBe(true);
    });

    it('should handle invalid category gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      log('Invalid category message', 'INVALID');

      const logContainer = document.getElementById('log');
      const logEntries = logContainer.querySelectorAll('.log-entry');
      
      expect(logEntries[0].classList.contains('log-system')).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid log category: INVALID. Using SYSTEM instead.'
      );
      
      consoleSpy.mockRestore();
    });

    it('should apply category styling', () => {
      log('Test message', 'ERROR');

      const logContainer = document.getElementById('log');
      const logEntry = logContainer.querySelector('.log-entry');
      
      expect(logEntry.style.borderLeft).toContain('#dc2626');
      expect(logEntry.style.color).toBe('rgb(220, 38, 38)');
    });

    it('should apply custom text color when provided', () => {
      log('Custom color message', 'SYSTEM', '#ff0000');

      const logContainer = document.getElementById('log');
      const logEntry = logContainer.querySelector('.log-entry');
      
      expect(logEntry.style.color).toBe('rgb(255, 0, 0)');
    });
  });

  describe('initializeLog', () => {
    it('should create filter UI structure', () => {
      initializeLog();

      const logContainer = document.getElementById('log');
      const logHeader = logContainer.querySelector('.log-header');
      const logContent = logContainer.querySelector('.log-content');
      const filterButtons = logContainer.querySelectorAll('.filter-btn');

      expect(logHeader).toBeDefined();
      expect(logContent).toBeDefined();
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it('should call initializeLog without errors', () => {
      expect(() => initializeLog()).not.toThrow();
    });
  });
}); 