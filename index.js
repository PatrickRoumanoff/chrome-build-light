var green = document.getElementById('green');
var blue = document.getElementById('blue');
var red = document.getElementById('red');
var off = document.getElementById('off');
var solid = document.getElementById('solid');


function getSolid() {
  return solid.checked;
}

function set(color) {
	return function () {
		if(!getSolid()) {
	  		send(getBuffer("off", false));
		}
		send(getBuffer(color, getSolid()));
	}
}

function setOff() {
  send(getBuffer("off", true));
  send(getBuffer("off", false));
}

blue.addEventListener('click', set("blue"));
red.addEventListener('click', set("red"));
green.addEventListener('click', set("green"));
off.addEventListener('click', setOff);

