var green = document.getElementById('green');
var blue = document.getElementById('blue');
var red = document.getElementById('red');
var off = document.getElementById('off');
var solid = document.getElementById('solid');

var solidCode = {
  green: 0xFE,
  red: 0xFD,
  blue: 0xFB,
  off: 0xFF
};

var flashCode = {
  green: 1,
  red: 2,
  blue: 4,
  off: 0xFF
}

var code = {
  solid: 2,
  flash: 20
};

function send(buffer) {
  chrome.hid.getDevices({}, function(devices) {
    console.log('getDevices callback', devices);
    if (chrome.runtime.lastError) {
      console.error("Unable to enumerate devices: " +
        chrome.runtime.lastError.message);
      return;
    }
    var device = devices[0];
    chrome.hid.connect(device.deviceId, function(connectInfo) {
      console.log('connect callback', connectInfo);
      if (!connectInfo) {
        console.error("Unable to connect to device.");
        return;
      }
      chrome.hid.sendFeatureReport(connectInfo.connectionId, 101, buffer, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log("sendFeatureReport success");
        }
        chrome.hid.disconnect(connectInfo.connectionId, function() {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log("disconnect success");
          }
        });
      });
    });
  });
}

function getBuffer(color, solid) {
  console.log("set", color, solid);
  var id = 101;
  var bytes = new Uint8Array(8);
  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = 0;
  }
  if (solid) {
    bytes[0] = code.solid;
    bytes[1] = solidCode[color];
  } else {
  	if(color !== "off") {
	    bytes[0] = code.flash;
	    bytes[1] = 0;
	    bytes[2] = flashCode[color];
	} else {
	    bytes[0] = code.flash;
	    bytes[1] = flashCode.off;		
	}
  }
  console.log(bytes);
  return bytes.buffer;
}

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
