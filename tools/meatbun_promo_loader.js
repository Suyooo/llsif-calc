var request = require("request");

var skillNames = [];
var cardIds = [];

request({
    url: "https://designedfor.sakura.ne.jp/nikuma-n/school-idol-festival/members.json",
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        for (var idol in body) {
            if (!body.hasOwnProperty(idol)) continue;
            for (var attribute in body[idol]) {
                if (!body[idol].hasOwnProperty(attribute)) continue;
                for (var rarity in body[idol][attribute]) {
                    if (!body[idol][attribute].hasOwnProperty(rarity)) continue;
                    for (var skillName in body[idol][attribute][rarity]) {
                        if (!body[idol][attribute][rarity].hasOwnProperty(skillName)) continue;
                        var card = body[idol][attribute][rarity][skillName];
                        if (card["promotion"] === true) {
                            skillNames.push(skillName);
                            cardIds.push(card["id"]);
                        }
                    }
                }
            }
        }
        console.log(JSON.stringify(skillNames));
        console.log(JSON.stringify(cardIds));
    } else {
        console.log("download error");
    }
});