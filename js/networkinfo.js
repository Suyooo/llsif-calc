var enDateOverride = [new Date(Date.UTC(2020, 9, 30, 9)),
    new Date(Date.UTC(2020, 10, 9, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "<b>Warning</b>: The song pool for the current WW event is extremely messed up. If you play on Ultimate, you'll randomly get a different song than announced, and it uses Easy note speeds while still having the Master map, and some reports saying it's not even the right note map??? Ramp up the Easy speed in your settings if you're planning to play that course.",
    id: 21,
    allowDismiss: true
};

// Little prompt for appcache -> service worker migration, will be removed at some point
// But this file is the only way for me to get scripts in there
setTimeout(function () {
    if (window.applicationCache.status == 5) { // appcache obsolete (as in, it was correctly recognized that it's gone)
        showUpdatePrompt();
    } else if (window.applicationCache.status == 1) { // appcache noupdate (didn't recognize removal of the appcache)
        notificationInfo = {
            message: "<b>WARNING:</b> You are running an outdated version of the calculator, but for some reason, your browser is refusing to update. Please try purging your cache and refreshing. If this message still appears, please contact me (links in the menu). Sorry for the inconvenience!",
            id: 999,
            allowDismiss: false
        };
        notificationLoad();
    }
}, 2000);
