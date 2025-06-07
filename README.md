# 🎙️ Voice Navigation

![Voice Navigation App Screenshot](src/assets/screenshot.png)
<p align="center"><em>Modern, hands-free Google Maps navigation app</em></p>

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