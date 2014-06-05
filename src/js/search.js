function getJSON(url, fn) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (fn) {
                    fn(data);
                }
            }
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

document.querySelector('#search').addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        var location,
            address = this.value.split(' ').join('+'),
            API_URL = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true_or_false&address=' + address;

        getJSON(API_URL, function(data){
            if (data.status === 'OK') {
                location = data.results[0].geometry.location;
                locationReady(location.lat, location.lng);

                console.log(location);
            }
            else {
                console.log('Zero Results');
            }
        });
    }
});
