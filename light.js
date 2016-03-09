var codes = {
    solid: {
        green: [2, 0xFE, 0],
        red: [2, 0xFD, 0],
        blue: [2, 0xFB, 0],
        off: [2, 0xFF, 0]
    },
    flash: {
        green: [20, 0, 1],
        red: [20, 0, 2],
        blue: [20, 0, 4],
        off: [20, 0xFF, 0]
    }
}

function getBuffer(color, solid) {
    var bytes = new Uint8Array(8);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    var code = codes[solid ? "solid" : "flash"];
    bytes[0] = code[color][0];
    bytes[1] = code[color][1];
    bytes[2] = code[color][2];
    return bytes.buffer;
}

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