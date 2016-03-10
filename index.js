var green = document.getElementById('green');
var blue = document.getElementById('blue');
var red = document.getElementById('red');
var off = document.getElementById('off');
var solid = document.getElementById('solid');


function getSolid() {
    return solid.checked;
}

function set(color) {
    return function() {
        sendBuffer(getBuffer({color:color, solid: getSolid()}));
    }
}

function setOff() {
    sendBuffer(getBuffer({color:"off", solid: true}));
    sendBuffer(getBuffer({color:"off", solid: false}));
}

blue.addEventListener('click', set("blue"));
red.addEventListener('click', set("red"));
green.addEventListener('click', set("green"));
off.addEventListener('click', setOff);