var dateOverride = null;

$(".event-banner-container").remove();
$(".event-info-note").html("<b class='red-text'>You are currently offline.</b> Unless the event schedule has changed, the Automatic Timer should still be correct - please double-check though. If it is incorrect, either use Manual Input, or reconnect to the internet and refresh the page.");

var notificationInfo = {
    message: "",
    id: 0,
    allowDismiss: true
};