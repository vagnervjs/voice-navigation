import VoiceNavigationApp from './main.js';

const app = new VoiceNavigationApp();
app.init().catch(error => {
  console.error('Fatal error during app initialization:', error);
}); 