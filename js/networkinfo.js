var enDateOverride = [new Date(Date.UTC(2019, 8, 27, 9)),
    new Date(Date.UTC(2019, 9, 6, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "<b>September Updates:</b> Several backend updates (in preparation for a SIFAS calc, maybe?). If you notice any oddities in regards to weird colors on elements, or the event info failing to update, please contact me (Discord tag is in the menu). Thank you!<br>This notification is dedicated to ZeroChew, who gave me a Nozomi and Kanan account for SIFAS. What a legend",
    id: 11,
    allowDismiss: true
};

// Little prompt for appcache -> service worker migration, will be removed at some point
// But this file is the only way for me to get scripts in there
setTimeout(function () {
    if (window.applicationCache.status == 5) { // appcache obsolete (as in, it was correctly recognized that it's gone)
        showUpdatePrompt();
    } else if (window.applicationCache.status == 1) { // appcache noupdate (didn't recognize removal of the appcache)
        notificationInfo = {
            message: "<b>WARNING:</b> You are running an outdated version of the calculator, but for some reason, your browser is refusing to update. Please try refreshing and purging your cache. If this message still appears, please contact me (links in the menu). Sorry for the inconvenience!",
            id: 999,
            allowDismiss: false
        };
        notificationLoad();
    }
}, 2000);
