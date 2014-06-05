function initMaps(lat, lng, pov) {
    var mapContainer = document.querySelector('#map'),
        streetViewContainer = document.querySelector('#street-view'),

        position = new google.maps.LatLng(lat, lng),
        mapOptions = {
            zoom: 100,
            center: position
        },
        streetViewOptions = {
            position: position,
            pov: pov
        },

        map = new google.maps.Map(mapContainer, mapOptions),
        streetView = new google.maps.StreetViewPanorama(streetViewContainer, streetViewOptions),
        maps = {
            map: map,
            streetView: streetView
        };

    return maps;
}

function updatePosition(googleMaps, lat, lng) {
    var newMapPosition = new google.maps.LatLng(lat, lng);

    googleMaps.map.panTo(newMapPosition);
    googleMaps.streetView.setPosition(newMapPosition);
}

function updatePov(googleMaps, pov) {
    var newStreetViewPov = googleMaps.streetView.getPov();

    newStreetViewPov.heading = pov.heading;
    newStreetViewPov.pitch = pov.pitch;
    googleMaps.streetView.setPov(newStreetViewPov);
}

function setPositionByCommand(cmd, mapData) {
    switch(cmd) {
        case 40: // FORWARD
            mapData.lat -= mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 38: // BACKWARD
            mapData.lat += mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 72: // LEFT (H)
            mapData.lng -= mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 74: // RIGHT (J)
            mapData.lng += mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 37: // Heading++ (<)
            mapData.pov.heading += mapData.povRate;
            updatePov(mapData.maps, mapData.pov);
            break;
        case 39: // Heading-- (>)
            mapData.pov.heading -= mapData.povRate;
            updatePov(mapData.maps, mapData.pov);
            break;
        case 78: // Pitch++ (N)
            mapData.pov.pitch += mapData.povRate;
            updatePov(mapData.maps, mapData.pov);
            break;
        case 77: // Pitch-- (M)
            mapData.pov.pitch -= mapData.povRate;
            updatePov(mapData.maps, mapData.pov);
            break;

        case 'baixo': // FORWARD
            mapData.lat -= mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 'cima': // BACKWARD
            mapData.lat += mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 'esquerda': // LEFT
            mapData.lng -= mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        case 'direita': // RIGHT
            mapData.lng += mapData.positionRate;
            updatePosition(mapData.maps, mapData.lat, mapData.lng);
            break;
        default:
            break;
    }
}

function locationReady(lat, lng) {
    var pov = {
            heading: 0,
            pitch: 0
        },
        maps = initMaps(lat, lng, pov),
        mapData = {
            maps: maps,
            lat: lat,
            lng: lng,
            pov: pov,
            positionRate: 0.000100,
            povRate: 5
        };

    document.body.addEventListener('keydown', function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            targetTagName = (target.nodeType === 1) ? target.nodeName.toLowerCase() : '';
        if ( !/input|select|textarea/.test(targetTagName) ) {
            setPositionByCommand(e.keyCode, mapData);
        }
    });

    voiceElement.addEventListener('result', function(e) {
        var cmd = e.detail[e.detail.length - 1].trim();

        setPositionByCommand(cmd, mapData);
        console.log(cmd);
    });
}
