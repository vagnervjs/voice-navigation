// Application configuration constants
export const CONFIG = {
  VOICE_RECOGNITION: {
    LANGUAGE: import.meta.env.VITE_VOICE_LANGUAGE || 'en-US',
    CONFIDENCE_THRESHOLD:
      parseFloat(import.meta.env.VITE_VOICE_CONFIDENCE_THRESHOLD) || 0.6,
    MAX_ALTERNATIVES: 3,
    CONTINUOUS: true,
    INTERIM_RESULTS: false,
  },

  MAPS: {
    DEFAULT_ZOOM: parseInt(import.meta.env.VITE_MAPS_DEFAULT_ZOOM) || 100,
    POSITION_RATE: 0.0001,
    POV_RATE: 5,
    FAST_MODE_MULTIPLIER: 5,
  },

  KEYBOARD_CODES: {
    START_VOICE: 83, // S
    STOP_VOICE: 69, // E
    ENTER: 13,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    H: 72,
    J: 74,
    N: 78,
    M: 77,
  },

  GEOLOCATION: {
    TIMEOUT: parseInt(import.meta.env.VITE_GEOLOCATION_TIMEOUT) || 10000,
    MAXIMUM_AGE: 300000, // 5 minutes
    ENABLE_HIGH_ACCURACY: true,
  },

  API: {
    GEOCODING_BASE_URL:
      import.meta.env.VITE_GEOCODING_BASE_URL ||
      'https://maps.googleapis.com/maps/api/geocode/json',
    GOOGLE_MAPS: {
      API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      VERSION: import.meta.env.VITE_GOOGLE_MAPS_VERSION || 'weekly',
      LIBRARIES: ['maps', 'streetView'],
    },
  },
};

// Voice command definitions
export const VOICE_COMMANDS = [
  // Movement commands
  {
    regex: /\b(go|forward|move forward|ahead)\b/,
    code: 'MOVE_FORWARD',
    label: 'move forward',
  },
  {
    regex: /\b(back|backward|move back|retreat)\b/,
    code: 'MOVE_BACKWARD',
    label: 'move backward',
  },
  { regex: /\b(left|move left)\b/, code: 'MOVE_LEFT', label: 'move left' },
  { regex: /\b(right|move right)\b/, code: 'MOVE_RIGHT', label: 'move right' },

  // Turning/rotation commands
  {
    regex: /\b(turn left|rotate left|spin left)\b/,
    code: 'TURN_LEFT',
    label: 'turn left',
  },
  {
    regex: /\b(turn right|rotate right|spin right)\b/,
    code: 'TURN_RIGHT',
    label: 'turn right',
  },
  { regex: /\b(rotate|spin around)\b/, code: 'TURN_LEFT', label: 'rotate' },

  // Look up/down commands
  { regex: /\b(look up|up|tilt up)\b/, code: 'LOOK_UP', label: 'look up' },
  {
    regex: /\b(look down|down|tilt down)\b/,
    code: 'LOOK_DOWN',
    label: 'look down',
  },

  // Compass directions
  { regex: /\b(north|go north)\b/, code: 'GO_NORTH', label: 'go north' },
  { regex: /\b(south|go south)\b/, code: 'GO_SOUTH', label: 'go south' },
  { regex: /\b(east|go east)\b/, code: 'GO_EAST', label: 'go east' },
  { regex: /\b(west|go west)\b/, code: 'GO_WEST', label: 'go west' },

  // Control commands
  { regex: /\b(stop|halt|pause)\b/, code: 'STOP', label: 'stop' },
];
