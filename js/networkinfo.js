var enDateOverride = [new Date(Date.UTC(2020, 11, 18, 9)),
    new Date(Date.UTC(2020, 11, 28, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "Dates for the resumed WW event are now set for the Automatic timer. Good luck, and let's hope it's not broken again.",
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
