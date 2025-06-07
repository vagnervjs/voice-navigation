const LOG_CATEGORIES = {
  SYSTEM: { label: 'System', icon: '🚀', color: '#4f46e5' },
  MAPS: { label: 'Maps', icon: '🗺️', color: '#16a34a' },
  VOICE: { label: 'Voice', icon: '🎤', color: '#7c3aed' },
  SEARCH: { label: 'Search', icon: '🔍', color: '#ca8a04' },
  LOCATION: { label: 'Location', icon: '📍', color: '#0891b2' },
  ERROR: { label: 'Error', icon: '❌', color: '#dc2626' },
};

let allLogs = [];
let activeFilter = 'ALL'; // Single active filter
let filterUICreated = false;

function createFilterUI() {
  const logContainer = document.querySelector('#log');
  if (!logContainer || filterUICreated) return;

  const logTitle = logContainer.querySelector('h3');
  if (!logTitle) return;

  // Create the structure with header and content areas
  const logHeader = document.createElement('div');
  logHeader.className = 'log-header';

  const logContent = document.createElement('div');
  logContent.className = 'log-content';

  // Move title to header
  logHeader.appendChild(logTitle);

  // Create filter container
  const filterContainer = document.createElement('div');
  filterContainer.className = 'log-filters';
  filterContainer.innerHTML = `
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter="ALL" title="Show all log entries">All</button>
      ${Object.entries(LOG_CATEGORIES)
        .map(
          ([key, cat]) =>
            `<button class="filter-btn" data-filter="${key}" title="Show ${cat.label} logs only">${cat.icon}</button>`
        )
        .join('')}
    </div>
  `;

  logHeader.appendChild(filterContainer);

  // Move existing log entries to content area
  const existingLogs = Array.from(logContainer.querySelectorAll('p'));
  existingLogs.forEach(log => logContent.appendChild(log));

  // Clear container and add new structure
  logContainer.innerHTML = '';
  logContainer.appendChild(logHeader);
  logContainer.appendChild(logContent);

  filterUICreated = true;

  // Add click handlers for filter buttons
  filterContainer.addEventListener('click', e => {
    if (e.target.classList.contains('filter-btn')) {
      handleFilterClick(e.target);
    }
  });
}

function handleFilterClick(button) {
  const filter = button.dataset.filter;

  // Update active filter
  activeFilter = filter;

  // Update button states (radio-style)
  const allButtons = document.querySelectorAll('.filter-btn');
  allButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  button.classList.add('active');

  // Apply filter
  applyCurrentFilter();
}

function applyCurrentFilter() {
  const logContentContainer = document.querySelector('.log-content');
  if (!logContentContainer) return;

  const logEntries = logContentContainer.querySelectorAll('.log-entry');

  logEntries.forEach(entry => {
    if (activeFilter === 'ALL') {
      // Show all entries
      entry.style.display = 'block';
    } else {
      // Show only entries matching the active filter
      const categoryClass = `log-${activeFilter.toLowerCase()}`;
      if (entry.classList.contains(categoryClass)) {
        entry.style.display = 'block';
      } else {
        entry.style.display = 'none';
      }
    }
  });
}

export function log(message, category = 'SYSTEM', textColor = null) {
  // Validate category
  if (!LOG_CATEGORIES[category]) {
    console.warn(`Invalid log category: ${category}. Using SYSTEM instead.`);
    category = 'SYSTEM';
  }

  // Store log entry
  const logEntry = {
    message,
    category,
    timestamp: new Date(),
  };
  allLogs.push(logEntry);

  // Add the log entry immediately to the DOM
  let logContentContainer = document.querySelector('.log-content');

  // If log content container doesn't exist, fall back to main log container
  if (!logContentContainer) {
    logContentContainer = document.querySelector('#log');
  }

  if (logContentContainer) {
    const p = document.createElement('p');
    p.textContent = message;

    // Add category styling using category color
    const categoryColor = LOG_CATEGORIES[category].color;
    p.style.borderLeft = `3px solid ${categoryColor}`;
    p.style.paddingLeft = '8px';
    p.style.marginLeft = '0';
    p.style.marginBottom = '4px';

    // Set text color - priority: textColor > ERROR category > default
    if (textColor) {
      p.style.color = textColor;
    } else if (category === 'ERROR') {
      p.style.color = '#dc2626';
    }

    // Add category class for filtering
    p.className = `log-entry log-${category.toLowerCase()}`;

    // Apply current filter to this new entry
    if (activeFilter !== 'ALL' && activeFilter !== category) {
      p.style.display = 'none';
    }

    logContentContainer.appendChild(p);
    logContentContainer.scrollTop = logContentContainer.scrollHeight;
  }

  // Try to create filter UI if it doesn't exist
  if (!filterUICreated) {
    setTimeout(() => {
      createFilterUI();
    }, 50);
  }
}

// Initialize the log system (to be called when DOM is ready)
export function initializeLog() {
  createFilterUI();
  if (filterUICreated) {
    applyCurrentFilter();
  }
}

export { LOG_CATEGORIES };
