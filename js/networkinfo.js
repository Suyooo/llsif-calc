var enDateOverride = [new Date(Date.UTC(2019, 8, 6, 9)),
    new Date(Date.UTC(2019, 8, 16, 8))];
var jpDateOverride = null;

var notificationInfo = {
    message: "<b>September 22 Update:</b> I changed some things on the stylesheet and in the Otasuke Sorter. Some colors might be messed up? Some cards might be miscategorized as promos? More details in the changelog. Please report any oddities you see (Discord tag is in the menu)! Thank you!<br><b>September 23 Update:</b> You know what, while I'm at it: here's the current LP/EXP inputs back, for your \"oh no, there's only a few hours left and I still need to meet my target\"-type calculations. Implemented in a different way than last time so calculations shouldn't break spectacularly, but if you notice anything odd, you can still report it!",
    id: 10,
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
