var off = 0xFF,
    solid = 2,
    flash = 20;
var codes = {
    solid: {
        green: [solid, 0xFE, 0],
        red: [solid, 0xFD, 0],
        blue: [solid, 0xFB, 0],
        off: [solid, off, 0]
    },
    flash: {
        green: [flash, 0, 1],
        red: [flash, 0, 2],
        blue: [flash, 0, 4],
        off: [flash, off, 0]
    }
}

function getBuffer(status) {
    var bytes = new Uint8Array(8);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    var code = codes[status.solid ? "solid" : "flash"];
    var b = code[status.color]
    bytes[0] = b[0];
    bytes[1] = b[1];
    bytes[2] = b[2];
    console.log(bytes);
    return bytes.buffer;
}

function sendBuffer(buffer) {
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