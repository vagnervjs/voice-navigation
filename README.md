# 🎙️ Voice Navigation

> **Navigate Google Maps Street View using voice commands and keyboard controls**

A modern, feature-rich voice navigation application that combines the power of the **Web Speech API** with **Google Maps Street View** for an intuitive navigation experience. Built with modern JavaScript ES6+ modules and a clean, responsive UI.

![Voice Navigation Demo](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)
![Vite](https://img.shields.io/badge/Build-Vite-blue?style=flat-square)
![Maps](https://img.shields.io/badge/Maps-Google_Maps_API-red?style=flat-square)

## ✨ Features

### 🎤 **Voice Recognition**
- **Natural language commands** - "Go forward", "Turn left", "Look up"
- **Compass directions** - "North", "South", "East", "West"
- **Confidence threshold** - 60% accuracy for reliable recognition
- **Real-time feedback** - Live confidence percentages displayed

### 🗺️ **Map Controls**
- **Street View integration** - Navigate through Google Street View
- **Search functionality** - Find any location by address
- **Fast mode toggle** - 5x movement speed multiplier
- **Smooth movement** - Fluid position and view transitions

### 🎯 **User Interface**
- **Modern dark theme** - Clean, professional design
- **Responsive layout** - Optimized for all screen sizes
- **Categorized logging** - Filter by system, maps, voice, search, location, errors
- **Real-time feedback** - Live activity monitoring with icons

### ⌨️ **Keyboard Controls**
- **Voice shortcuts** - `S` to start, `E` to end recognition
- **Movement keys** - Arrow keys for navigation
- **Advanced controls** - `H/J` for left/right, `N/M` for look up/down

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+ recommended)
- **Google Maps API Key** with Maps JavaScript API and Geocoding API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vagnervjs/voice-navigation.git
   cd voice-navigation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Maps API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone and location access when prompted
   - Start navigating with voice commands!

## 🔐 Browser Permissions

This application requires **two critical permissions** to function properly:

### 🎤 **Microphone Access**
- **Required for**: Voice recognition commands
- **When prompted**: Click "Allow" when browser asks for microphone access
- **Troubleshooting**: 
  - Check browser address bar for microphone icon
  - Go to browser settings → Privacy & Security → Microphone
  - Ensure `localhost:3000` is allowed

### 📍 **Location Access**
- **Required for**: Getting your current position as starting point
- **When prompted**: Click "Allow" when browser asks for location access
- **What it does**: Centers the map on your current location for better navigation
- **Troubleshooting**:
  - Check browser address bar for location icon
  - Go to browser settings → Privacy & Security → Location
  - Ensure `localhost:3000` is allowed
  - **Note**: App will still work without location access, but you'll need to search for a starting location

### 🔧 **Permission Management**

**Chrome/Edge:**
1. Click the lock icon in the address bar
2. Set Microphone and Location to "Allow"
3. Refresh the page

**Firefox:**
1. Click the shield icon in the address bar
2. Enable microphone and location permissions
3. Refresh the page

**Safari:**
1. Go to Safari → Settings → Websites
2. Select Camera/Microphone and Location Services
3. Set permissions for `localhost`

**⚠️ Important Notes:**
- Permissions are required each time you visit the site (until you grant permanent access)
- Voice recognition requires HTTPS or localhost (security requirement)
- Location access improves user experience but is not mandatory
- All permissions can be revoked at any time through browser settings

## 🎮 Usage

### Voice Commands

| Command | Action | Example |
|---------|--------|---------|
| 🚶 **Movement** | Move forward/backward | *"Go forward"*, *"Move back"* |
| ↰ **Rotation** | Turn left/right | *"Turn left"*, *"Rotate right"* |
| ⬆️ **Looking** | Look up/down | *"Look up"*, *"Tilt down"* |
| 🧭 **Compass** | Cardinal directions | *"Go north"*, *"Face south"* |
| 🛑 **Control** | Stop recognition | *"Stop"*, *"Halt"* |

### Keyboard Shortcuts

| Key | Action | Key | Action |
|-----|--------|-----|--------|
| `S` | Start voice recognition | `E` | End voice recognition |
| `↑` | Move forward | `↓` | Move backward |
| `←` | Rotate left | `→` | Rotate right |
| `H` | Move left | `J` | Move right |
| `N` | Look up | `M` | Look down |

### Search & Navigation
- **Search any location** using the search box
- **Toggle fast mode** for 5x movement speed
- **Monitor activity** in the categorized log panel
- **Filter logs** by type: System, Maps, Voice, Search, Location, Errors

## 🛠️ Development

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **Build Tool**: Vite
- **APIs**: Google Maps JavaScript API, Web Speech API
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Linting**: ESLint with modern configuration

### Project Structure
```
voice-navigation/
├── src/
│   ├── js/
│   │   ├── main.js          # Application entry point
│   │   ├── config.js        # Configuration constants
│   │   ├── utils.js         # Utility functions
│   │   ├── voice.js         # Voice recognition logic
│   │   ├── maps.js          # Google Maps integration
│   │   ├── search.js        # Location search functionality
│   │   ├── location.js      # Geolocation handling
│   │   └── log.js           # Logging system
│   └── css/
│       └── main.css         # Application styles
├── index.html               # Main HTML file
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

### Environment Variables
```bash
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_GEOCODING_BASE_URL=https://maps.googleapis.com/maps/api/geocode/json
VITE_GOOGLE_MAPS_VERSION=weekly

# Voice Recognition Settings
VITE_VOICE_CONFIDENCE_THRESHOLD=0.6
VITE_VOICE_LANGUAGE=en-US

# UI Configuration
VITE_MAPS_DEFAULT_ZOOM=100
VITE_GEOLOCATION_TIMEOUT=10000
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Architecture

Built with modern JavaScript following clean architecture principles:

- **ES6 Classes** - Object-oriented design with singleton patterns
- **Module System** - Clean separation of concerns
- **Error Handling** - Comprehensive try-catch blocks and graceful degradation
- **Configuration Management** - Centralized constants and environment variables
- **Utility Functions** - Reusable helper functions for common operations

## 🎨 Design Features

- **Dark Theme** - Professional, eye-friendly interface
- **Responsive Layout** - Optimized sidebar and main content areas
- **Icon System** - Visual indicators throughout the interface
- **Grid Layout** - Efficient space utilization in help sections
- **Smooth Animations** - Subtle transitions and hover effects

## 🔧 Browser Support

- **Chrome** ✅ (Recommended - full Web Speech API support)
- **Firefox** ✅ (Limited voice recognition)
- **Safari** ⚠️ (Limited voice recognition)
- **Edge** ✅ (Full support)

**Note**: Voice recognition requires a secure context (HTTPS or localhost).

## 📝 License

MIT License © [Vagner Santana](https://github.com/vagnervjs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/vagnervjs/voice-navigation/issues)
- **Author**: [Vagner Santana](https://github.com/vagnervjs)

---

**Built with ❤️ using modern web technologies**
