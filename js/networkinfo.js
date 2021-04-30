var enDateOverride = [new Date(Date.UTC(2021, 3, 30, 9)),
    new Date(Date.UTC(2021, 4, 10, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "<b>HEADS UP:</b> WW didn't add Master difficulty to MedFes. Watch out for that when using estimations - and also watch out for the Cheer Bonus <b>RESETTING EVERY TIME YOU PLAY A MEDLEY OR LEAVE THE EVENT SCREEN SO YOU HAVE TO SET IT AGAIN BEFORE EVERY LIVE</b>. Have fun!",
    id: 22,
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
