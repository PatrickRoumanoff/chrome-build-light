var run = document.getElementById('run');
var bambooScript = document.getElementById('bambooScript');

var scripts = {
    bamboo: [{
        url: 'http://onetech-di-bamboo/rest/api/latest/plan/COPPEROBI-DI.json',
        path: 'isBuilding',
        test: 'eq',
        value: 'true',
        status: 'blue'
    }, {
        url: 'http://onetech-di-bamboo/rest/api/latest/result/COPPEROBI-DI-latest.json',
        path: 'successful',
        test: 'eq',
        value: 'true',
        status: 'green'
    }, {
        url: 'http://onetech-di-bamboo/rest/api/latest/result/COPPEROBI-DI-latest.json',
        path: 'successful',
        test: 'neq',
        value: 'true',
        status: 'red'
    }]
};

function setScript(script) {
    return function() {
        script.forEach(function(data, i) {
            document.getElementById("url[" + i + "]").value = data.url;
            document.getElementById("path[" + i + "]").value = data.path;
            document.getElementById("test[" + i + "]-" + data.test).selected = "selected";
            document.getElementById("value[" + i + "]").value = data.value;
            document.getElementById("status[" + i + "]-" + data.status).selected = "selected";
        });
    }
}

function buildOptions(select, options) {
    options.forEach(function(o) {
        var opt = document.createElement("option");
        opt.id = select.id + "-" + o.value;
        opt.value = o.value;
        if (o.selected) {
            opt.selected = "selected";
        }
        opt.appendChild(document.createTextNode(o.label));
        select.appendChild(opt);
    })
}

function buildElement(tag, row, name) {
    var element = document.createElement(tag);
    element.id = element.name = name;
    row.insertCell().appendChild(element);
    return element;
}

function build() {
    var table = document.querySelector("table");
    var i, row, test, status;
    for (i = 0; i < 7; i++) {
        row = table.insertRow();
        buildElement("input", row, "url[" + i + "]");
        buildElement("input", row, "path[" + i + "]");
        test = buildElement("select", row, "test[" + i + "]");
        buildOptions(test, [{
            selected: true,
            value: "eq",
            label: "=="
        }, {
            value: "neq",
            label: "!="
        }, {
            value: "gt",
            label: ">"
        }, {
            value: "gte",
            label: ">="
        }, {
            value: "lt",
            label: "<"
        }, {
            value: "lte",
            label: "<"
        }]);
        buildElement("input", row, "value[" + i + "]");
        status = buildElement("select", row, "status[" + i + "]");
        buildOptions(status, [{
            value: "off",
            label: "Off",
            selected: true
        }, {
            value: "green",
            label: "Green"
        }, {
            value: "blue",
            label: "Blue"
        }, {
            value: "red",
            label: "Red"
        }, {
            value: "green-flashing",
            label: "Green Flashing"
        }, {
            value: "blue-flashing",
            label: "Blue Flashing"
        }, {
            value: "red-flashing",
            label: "Red Flashing"
        }, ]);
    }
}

function setup() {
    var result = [],
        row, el;
    var fields = ['url', 'path', 'test', 'value', 'status'];
    for (var i = 0; i < 3; i++) {
        row = {};
        fields.forEach(function(f) {
            row[f] = document.getElementById(f + "[" + i + "]").value;
        });
        result.push(row);
    }
    return result;
}

function test(value, test, target) {
    switch (test) {
        case "eq":
            return ("" + value) == target;
        case "neq":
            return ("" + value) != target;
        case "gt":
            return value > target;
        case "lt":
            return value < target;
        case "gte":
            return value >= target;
        case "lte":
            return value <= target;
        default:
            return false;
    }
}

function statusToColor(status) {
    if (status.indexOf("-flash") >= 0) {
        return {
            color: status.substring(0, status.indexOf("-flash")),
            solid: false
        };
    } else {
        return {
            color: status,
            solid: true
        };
    }
}

function request(input) {
    if (!input || !input.length) {
        return;
    }
    var row = input.shift();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', row.url, true);
    xhr.setRequestHeader('Accept', 'text/json');
    xhr.onload = function() {
        var value = JSON.parse(xhr.responseText)[row.path];
        if (test(value, row.test, row.value)) {
            sendBuffer(getBuffer(statusToColor(row.status)));
        } else {
            request(input);
        }
    };
    xhr.send();
}

function loop() {
    request(setup());
}

var interval = null;

function startLoop() {
    run.innerText = "Stop";
    try {
        loop();
    } catch (e) {}
    interval = setInterval(loop, 60 * 1000);
}

function stopLoop() {
    clearInterval(interval);
    interval = null;
    run.innerText = "Start";
}

function clickRun() {
    if (interval) {
        stopLoop();
    } else {
        startLoop();
    }
}

run.addEventListener('click', clickRun);
bambooScript.addEventListener('click', setScript(scripts['bamboo']));
build();