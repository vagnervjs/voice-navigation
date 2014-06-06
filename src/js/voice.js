/*
 * Voice Navigation
 * Voice Module
 * @author: Vagner Santana;
 * @repository: https://github.com/vagnervjs/voice-navigation;
 */

var voice = (function() {
    'use strict';

    var voice = {
        init: function(element) {
            this.el = element;
            this.setupElementListeners();
            this.setupUIListeners();
        },

        setupElementListeners: function() {
            // Element Event Listeners
            this.el.addEventListener('start', function(e) {
                console.log('Starting recognation...');
            });
            this.el.addEventListener('end', function(e) {
                console.log('Stoping recognation...');
            });
            this.el.addEventListener('error', function(e) {
                console.log('Error on recognation...');
            });

            this.el.addEventListener('result', function(e) {
                var cmd = e.detail[e.detail.length - 1].trim().toLowerCase(),
                    code = null,
                    wd = null,
                    pLog = document.createElement('p');

                    if (cmd.indexOf('go') !== -1) {
                        code = 40;
                        wd = 'go';
                    } else if (cmd.indexOf('be') !== -1 || cmd.indexOf('ck') !== -1) {
                        code = 38;
                        wd = 'back';
                    } else if (cmd.indexOf('right') !== -1) {
                        code = 72;
                        wd = 'right';
                    } else if (cmd.indexOf('lef') !== -1) {
                        code = 74;
                        wd = 'left';
                    } else if (cmd.indexOf('ro') !== -1 || cmd.indexOf('ate') !== -1) {
                        code = 37;
                        wd = 'rotate';
                    } else if (cmd.indexOf('up') !== -1) {
                        code = 78;
                        wd = 'up';
                    } else if (cmd.indexOf('down') !== -1) {
                        code = 77;
                        wd = 'down';
                    }

                // Add on Log
                pLog.innerHTML = wd;
                document.querySelector('#log').appendChild(pLog);

                // Run
                maps.setPositionByCommand(code);
            });
        },

        setupUIListeners: function() {
            var _self = this;
            document.body.addEventListener('keyup', function(e) {
                e = e || window.event;
                var target = e.target || e.srcElement,
                    targetTagName = (target.nodeType === 1) ? target.nodeName.toLowerCase() : '';
                if ( !/input|select|textarea/.test(targetTagName) ) {
                    switch(e.keyCode) {
                        case 83: // Starting recognation when user press S
                            _self.el.start();
                            document.querySelector('#log').style.display = 'block';
                            break;
                        case 69: // Stoping recognation when user press E
                            _self.el.stop();
                            document.querySelector('#log').style.display = 'none';
                            break;
                    }
                }
            });
        },
    };

    return voice;
}());
