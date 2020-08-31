var enDateOverride = [new Date(Date.UTC(2020, 7, 31, 9)),
    new Date(Date.UTC(2020, 8, 9, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "<b>Warning for Global Players:</b> The Master rewards are messed up on the Global version. Your score and combo ranks are not counted, instead you will always receive the reward for a no rank run. Keep this in mind if you want to play Master - set both \"Score Rank\" and \"Combo Rank\" to \"None\", and compare your result to what you could get on Expert (an A rank/A rank Expert run gives the same amount of points as a bugged Master run).",
    id: 19,
    allowDismiss: false
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
