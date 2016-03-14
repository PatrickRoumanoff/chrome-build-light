chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        innerBounds: {
            width: 1100,
            height: 450,
            minWidth: 1100,
            minHeight: 450
        },
        id: "DelcomLight"
    });
});