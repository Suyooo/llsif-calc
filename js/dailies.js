// Dailies -- The first entry is the Dailies available on June 1st 2022
var anchorDate = new Date(Date.parse("Wed Jun 1 2022 00:00:00"));
var dailies = {
    "&mu;'s A": [
        "Otome Shiki Ren'ai Juku",
        "soldier game",
        "Kokuhaku Biyori, desu!",
        "Mermaid festa vol.2 ~Passionate~"
    ],
    "&mu;'s B": [
        "Anemone heart",
        "Nawatobi",
        "Beat in Angel",
        "Niko puri♥Joshi dou",
        "Garasu no Hanazono",
        "Yume Naki Yume wa Yume ja nai",
    ],
    "Aqours A": [
        "Natsu e no Tobira Never end ver.",
        "Manatsu wa Dare no Mono?",
        "Jimo Ai ♡ Mantan ☆ Summer Life",
        "Natsu no Owari no Amaoto ga"
    ],
    "Aqours B": [
        "Misty Frosty Love",
        "Namida ga Yuki ni Naru Mae ni",
        "Kimochi mo Yume mo Issho da ne!",
        "Party! Party! PaPaPaParty!"
    ]
}

var pageSize = 99;
var searchBefore = 10;

var topEnd = null;
var bottomEnd = null;

function makePage(start, end, pos, hl) {
    console.log(start,end);
    var current = new Date(start);
    var dayOff = Math.floor((start.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
    var finalDayOff = Math.floor((end.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(dayOff,finalDayOff);
    var e = $("<tbody></tbody>");
    while (dayOff <= finalDayOff) {
        var r = $("<tr></tr>");
        if (hl !== undefined && current.getTime() == hl.getTime()) {
            r.addClass("highlight");
        }

        r.append($("<th></th>").text(current.toDateString()));
        for (var rot of Object.keys(dailies)) {
            if (dayOff < 0) {
                r.append($("<td></td>").text(dailies[rot][(dailies[rot].length + dayOff % dailies[rot].length) % dailies[rot].length]));
            } else {
                r.append($("<td></td>").text(dailies[rot][dayOff % dailies[rot].length]));
            }
        }
        e.append(r);
        current.setDate(current.getDate() + 1);
        dayOff++;
    }

    if (pos === "t") {
        $("#calendar").prepend(e);
        topEnd = start;
    } else if (pos === "b") {
        $("#calendar").append(e);
        bottomEnd = end;
    } else if (pos === "r") {
        $("#calendar").html("").append(e);
        topEnd = start;
        bottomEnd = end;
    }
    return e.height();
}

function addPreviousPage() {
    var end = new Date(topEnd);
    end.setDate(end.getDate() - 1);
    var start = new Date(end);
    start.setDate(start.getDate() - pageSize);
    console.log(topEnd,end,start);
    return makePage(start, end, "t");
}

function addNextPage() {
    var start = new Date(bottomEnd);
    start.setDate(start.getDate() + 1);
    var end = new Date(start);
    end.setDate(end.getDate() + pageSize);
    return makePage(start, end, "b");
}

function search(date) {
    var start = new Date(date);
    start.setDate(start.getDate() - searchBefore);
    var end = new Date(start);
    end.setDate(end.getDate() + pageSize);
    var r = makePage(start, end, "r", date);
    $(window).scrollTop(10);
    return r;
}

$("#date").on("change", function() {
    var target = new Date($("#date").val());
    target.setHours(0,0,0,0);
    search(target);
});

$(window).on("scroll",function() {
    if($(window).scrollTop() + $(window).height() >= $(document).height()) {
        addNextPage();
        $(window).scrollTop($(window).scrollTop() + 10);
    }
    if($(window).scrollTop() <= 0) {
        $(window).scrollTop($(window).scrollTop() + addPreviousPage() - 10);
    }
});

var today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
today.setHours(0,0,0,0);
search(today);