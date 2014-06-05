var voiceElement = document.querySelector('#recognition-element');

// Element Event Listeners
voiceElement.addEventListener('start', function(e) {
    console.log('Starting recognation...');
});
voiceElement.addEventListener('end', function(e) {
    console.log('Stoping recognation...');
});
voiceElement.addEventListener('error', function(e) {
    console.log('Error on recognation...');
});

document.body.addEventListener('keyup', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        targetTagName = (target.nodeType === 1) ? target.nodeName.toLowerCase() : '';
    if ( !/input|select|textarea/.test(targetTagName) ) {
        switch(e.keyCode) {
            case 83: // Starting recognation when user press S
                voiceElement.start();
                break;
            case 69: // Stoping recognation when user press E
                voiceElement.stop();
                break;
        }
    }
});
