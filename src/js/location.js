/*
 * Voice Navigation
 * Location
 * @author: Vagner Santana;
 * @repository: https://github.com/vagnervjs/voice-navigation;
 */

;(function(){
    navigator.geolocation.getCurrentPosition(function(position) {
        maps.init(position.coords.latitude, position.coords.longitude);
        console.log('Location Ready: ' + position.coords.latitude + ' - ' + position.coords.longitude);
    });
})();
