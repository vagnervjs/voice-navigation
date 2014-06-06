/*
 * Voice Navigation
 * Maps Module
 * @author: Vagner Santana;
 * @repository: https://github.com/vagnervjs/voice-navigation;
 */

var maps = (function() {
    'use strict';

    var maps = {
        init: function(lat, lng){
            this.pov = {
                heading: 0,
                pitch: 0
            },
            this.maps = this.initMaps(lat, lng),
            this.mapData = {
                lat: lat,
                lng: lng,
                pov: this.pov,
                positionRate: 0.000100,
                povRate: 5
            };

            this.setupListeners();
        },

        initMaps: function(lat, lng) {
            var _self = this,
                mapContainer = document.querySelector('#map'),
                streetViewContainer = document.querySelector('#street-view'),

                position = new google.maps.LatLng(lat, lng),
                mapOptions = {
                    zoom: 100,
                    center: position
                },
                streetViewOptions = {
                    position: position,
                    pov: _self.pov
                },

                map = new google.maps.Map(mapContainer, mapOptions),
                streetView = new google.maps.StreetViewPanorama(streetViewContainer, streetViewOptions),
                maps = {
                    map: map,
                    streetView: streetView
                };

            return maps;
        },

        updatePosition: function() {
            var _self = this,
                newMapPosition = new google.maps.LatLng(_self.mapData.lat, _self.mapData.lng);

            _self.maps.map.panTo(newMapPosition);
            _self.maps.streetView.setPosition(newMapPosition);
        },

        updatePov: function() {
            var _self = this,
                newStreetViewPov = _self.maps.streetView.getPov();

            newStreetViewPov.heading = _self.pov.heading;
            newStreetViewPov.pitch = _self.pov.pitch;
            _self.maps.streetView.setPov(newStreetViewPov);
        },

        setPositionByCommand: function(cmd) {
            var _self = this;
            switch(cmd) {
                case 40: // FORWARD
                    _self.mapData.lat -= _self.mapData.positionRate;
                    break;
                case 38: // BACKWARD
                    _self.mapData.lat += _self.mapData.positionRate;
                    break;
                case 72: // LEFT (H)
                    _self.mapData.lng -= _self.mapData.positionRate;
                    break;
                case 74: // RIGHT (J)
                    _self.mapData.lng += _self.mapData.positionRate;
                    break;
                case 37: // Heading++ (<)
                    _self.mapData.pov.heading += _self.mapData.povRate;
                    break;
                case 39: // Heading-- (>)
                    _self.mapData.pov.heading -= _self.mapData.povRate;
                    break;
                case 78: // Pitch++ (N)
                    _self.mapData.pov.pitch += _self.mapData.povRate;
                    break;
                case 77: // Pitch-- (M)
                    _self.mapData.pov.pitch -= _self.mapData.povRate;
                    break;
            }

            _self.updatePosition();
            _self.updatePov();
        },

        setupListeners: function() {
            var _self = this;
            document.body.addEventListener('keydown', function(e) {
                e = e || window.event;
                var target = e.target || e.srcElement,
                    targetTagName = (target.nodeType === 1) ? target.nodeName.toLowerCase() : '';
                if ( !/input|select|textarea/.test(targetTagName) ) {
                    _self.setPositionByCommand(e.keyCode);
                }
            });
        },
    };

    return maps;

}());
