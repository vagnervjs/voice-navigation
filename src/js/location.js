navigator.geolocation.getCurrentPosition(function(position) {
    locationReady(position.coords.latitude, position.coords.longitude);
    console.log('Location Ready: ' + position.coords.latitude + ' - ' + position.coords.longitude);
});

