import { log } from './log.js';
import { CONFIG } from './config.js';
import { isFormInput, degreesToRadians, formatCoordinates } from './utils.js';

class MapsController {
  constructor() {
    this.viewDirection = { heading: 0, pitch: 0 };
    this.googleMapsInstances = null;
    this.mapData = null;
  }

  init(lat, lng) {
    try {
      this.viewDirection = { heading: 0, pitch: 0 };
      this.googleMapsInstances = this._createMapInstances(lat, lng);
      this.mapData = {
        lat,
        lng,
        pov: this.viewDirection,
        positionRate: CONFIG.MAPS.POSITION_RATE,
        povRate: CONFIG.MAPS.POV_RATE,
      };
      this._setupKeyboardListeners();
      log(`🗺️ Maps initialized at ${formatCoordinates(lat, lng)}`, 'MAPS');
    } catch (error) {
      log(`❌ Failed to initialize maps: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  _createMapInstances(lat, lng) {
    const mapContainer = document.querySelector('#map');
    const streetViewContainer = document.querySelector('#street-view');

    if (!mapContainer || !streetViewContainer) {
      throw new Error('Map containers not found');
    }

    const position = new google.maps.LatLng(lat, lng);

    const map = new google.maps.Map(mapContainer, {
      zoom: CONFIG.MAPS.DEFAULT_ZOOM,
      center: position,
    });

    const streetView = new google.maps.StreetViewPanorama(streetViewContainer, {
      position,
      pov: this.viewDirection,
    });

    return { map, streetView };
  }

  updatePosition() {
    if (!this.googleMapsInstances || !this.mapData) return;

    const newPosition = new google.maps.LatLng(
      this.mapData.lat,
      this.mapData.lng
    );

    this.googleMapsInstances.map.panTo(newPosition);
    this.googleMapsInstances.streetView.setPosition(newPosition);
  }

  updateViewDirection() {
    if (!this.googleMapsInstances) return;

    const currentPov = this.googleMapsInstances.streetView.getPov();
    currentPov.heading = this.viewDirection.heading;
    currentPov.pitch = this.viewDirection.pitch;
    this.googleMapsInstances.streetView.setPov(currentPov);
  }

  executeVoiceCommand(command, multiplier = 1) {
    if (!this.mapData) return;

    const moveDistance = this.mapData.positionRate * multiplier;
    const turnAngle = this.mapData.povRate * multiplier;

    switch (command) {
      case 'MOVE_FORWARD':
        this._moveInDirection(this.viewDirection.heading, moveDistance);
        break;
      case 'MOVE_BACKWARD':
        this._moveInDirection(this.viewDirection.heading + 180, moveDistance);
        break;
      case 'MOVE_LEFT':
        this._moveInDirection(this.viewDirection.heading - 90, moveDistance);
        break;
      case 'MOVE_RIGHT':
        this._moveInDirection(this.viewDirection.heading + 90, moveDistance);
        break;
      case 'TURN_LEFT':
        this._adjustHeading(-turnAngle);
        break;
      case 'TURN_RIGHT':
        this._adjustHeading(turnAngle);
        break;
      case 'LOOK_UP':
        this._adjustPitch(turnAngle);
        break;
      case 'LOOK_DOWN':
        this._adjustPitch(-turnAngle);
        break;
      case 'GO_NORTH':
        this.mapData.lat += moveDistance;
        break;
      case 'GO_SOUTH':
        this.mapData.lat -= moveDistance;
        break;
      case 'GO_EAST':
        this.mapData.lng += moveDistance;
        break;
      case 'GO_WEST':
        this.mapData.lng -= moveDistance;
        break;
    }

    this.updatePosition();
    this.updateViewDirection();
  }

  _moveInDirection(heading, distance) {
    const headingRad = degreesToRadians(heading);
    this.mapData.lat += Math.cos(headingRad) * distance;
    this.mapData.lng += Math.sin(headingRad) * distance;
  }

  _adjustHeading(angle) {
    this.viewDirection.heading += angle;
    this.mapData.pov.heading = this.viewDirection.heading;
  }

  _adjustPitch(angle) {
    this.viewDirection.pitch = Math.max(
      -90,
      Math.min(90, this.viewDirection.pitch + angle)
    );
    this.mapData.pov.pitch = this.viewDirection.pitch;
  }

  handleKeyboardInput(keyCode, multiplier = 1) {
    if (!this.mapData) return;

    const { ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, H, J, N, M } =
      CONFIG.KEYBOARD_CODES;
    const positionRate = this.mapData.positionRate * multiplier;
    const povRate = this.mapData.povRate * multiplier;

    switch (keyCode) {
      case ARROW_DOWN: // FORWARD
        this.mapData.lat -= positionRate;
        break;
      case ARROW_UP: // BACKWARD
        this.mapData.lat += positionRate;
        break;
      case H: // LEFT
        this.mapData.lng -= positionRate;
        break;
      case J: // RIGHT
        this.mapData.lng += positionRate;
        break;
      case ARROW_LEFT: // Heading++
        this.mapData.pov.heading += povRate;
        break;
      case ARROW_RIGHT: // Heading--
        this.mapData.pov.heading -= povRate;
        break;
      case N: // Pitch++
        this.mapData.pov.pitch += povRate;
        break;
      case M: // Pitch--
        this.mapData.pov.pitch -= povRate;
        break;
    }

    this.updatePosition();
    this.updateViewDirection();
  }

  _setupKeyboardListeners() {
    document.body.addEventListener('keydown', e => {
      if (isFormInput(e.target)) return;
      this.handleKeyboardInput(e.keyCode);
    });
  }

  setPosition(lat, lng) {
    if (this.mapData) {
      this.mapData.lat = lat;
      this.mapData.lng = lng;
      this.updatePosition();
    }
  }
}

// Export singleton instance
const maps = new MapsController();
export default maps;
