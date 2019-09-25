// Otasuke power of a card is (skill level x rarity rate)
var rarity_rates = {"R": 25, "SR": 55, "SSR": 120, "UR": 200};

// Promo SSR exclusions
var meatbun_exclude_skills = new Set(["アニメ一期BD1巻初回限定版特典", "スマートフォングッズセット特典", "アニメ一期BD7巻初回限定版特典", "アニメ二期BD1巻特装限定版特典", "アニメ二期BD7巻特装限定版特典", "劇場版BD特装限定版特典", "電撃G'sマガジン2016年4月号", "電撃G'sマガジン2016年5月号", "あなたが決める♪リクエストUR決定戦！", "憧れの花束", "みんなでお揃い", "アニメ一期BD6巻初回限定版特典", "official illustration book特典", "二人っきりの海水浴", "アニメ二期BD4巻特装限定版特典", "快適スマホセット特典", "あなたが決める♪リクエストUR決定戦！", "仲間達への感謝", "μ'sだから出来ること", "アニメ一期BD2巻初回限定版特典", "スクフェス公式ガイドブック特典", "ことり式雪だるま", "シザーバック＆スマホ手袋特典", "アニメ二期BD6巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "あなたのためのドレス", "ことりは巫女さん", "アニメ一期BD2巻初回限定版特典", "ラブライブ！グッズセット特典", "アニメ二期BD4巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "幼い頃の絆の想い出", "気分一新", "アニメ一期BD4巻初回限定版特典", "アニメ二期BD3巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "お手本になるにゃ♪", "お姫様day", "凛の魔法", "アニメ一期BD4巻初回限定版特典", "official fan book特典", "アニメ二期BD2巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "ポーカータイム", "大事なこと", "クリスマスの夜", "アニメ一期BD6巻初回限定版特典", "アニメ二期BD5巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "幸せに導かれて", "幸運のおみくじ", "すごくドキドキしてる", "アニメ一期BD3巻初回限定版特典", "アニメ二期BD6巻特装限定版特典", "あなたが決める♪リクエストUR決定戦！", "伝わる手のぬくもり", "気配り上手", "μ'sのさくらんぼ！", "アニメ一期BD5巻初回限定版特典", "アニメ二期BD2巻特装限定版特典", "モバイルポーチ付き前売券特典", "official illustration book2特典", "あなたが決める♪リクエストUR決定戦！", "食い倒れツアー！？", "内緒で逆サプライズ", "応援するにこっ☆", "射止めちゃうぞ♡", "みんなのファン", "お揃いにしよう♪", "水の歌姫", "水族館を巡って", "FUJIYAMA・TOP！", "ハッピーサンデー", "全力ライブ", "花言葉は常に前進！", "台湾の魅力", "大好きがいっぱい", "一緒に歌おう！", "脱出を目指せ！", "飛び込め夏の輪！", "チカッチワールド", "まっすぐ一直線", "気分はイタリア♪", "大人の階段", "お揃いの花", "ガラス越しの眼差し", "美しい景色を一緒に", "みんなのティータイム", "音を繋いで", "あなたとの相性占い", "ドイツに学ぶ", "歌いたい気持ち", "行ってみたい場所", "コンビニに愛を込めて", "みんなで輪になって", "最後の鍵", "踊らにゃそんそん", "彩りのメロディ", "夢の舞台", "最高のライブを", "マリンパワー", "コツメカワウソと握手", "クール・ダイブ", "Aqoursのこれから", "広がる景色", "嬉しいサプライズ", "スタートダッシュ", "あなたとランチ♪", "私の十八番", "難問に挑戦！", "百発百中ガンガール", "みんなを支える力", "お揃いを見つけて", "お楽しみは最後に", "イルカのジャンプ", "高飛車への挑戦", "バーニングクイズ", "マーライオンへの道", "ガーネット色のドレス", "気力と体力", "ささやかな気遣い", "柔軟な思考", "迷子にならないように", "サンシャインを感じて", "個人的なこと", "カラオケ奉行", "日常キラキラ", "アクアリウム・ロマン", "イルカでハッピーに", "どどーんと行くよ！", "波に乗って", "スノーステージ", "ニーハオヨーソロー！", "ちょっぴり背伸び", "笑顔をみんなに", "私とゴンドリエーレ", "函館港ロマンス", "カラオケ盛り上げ隊", "山勘最強？", "ラムネでカンパイ！", "レッツ・ゴー！", "空への出航", "空飛ぶ漆黒の翼", "ヨハネの暗躍", "海と堕天使", "セイウチのタッチ", "真・極上堕天使の応援", "堕天使ええじゃないか", "占い師ヨハネの福音", "店長スラッシュ", "堕天使が愛する店", "イギリス魔法の歴史", "今日はなんの日？", "共鳴する魂", "悪魔の解答", "水ヨーヨー、意気揚々", "純血と漆黒の契約", "召喚の儀", "究極堕天", "堕天使と想像の旅", "新しい世界", "ハングリーライブ", "ペンギンに囲まれて", "未来への飛行", "お揃いのハナマル", "ゲームに囲まれて", "微笑みの国へ", "甘さを半分こ", "文明の利器", "ひらめきの鍛錬", "屋台巡りは幸せ巡り", "あなたと冒険", "夜景をあなたと", "マルらしく", "吊り橋効果ずら♪", "シューティングスター", "Lucky Fish", "気持ちをひとつに", "シャイニーメリー", "パーフェクトプラン", "鞠莉inU.S.A", "パーティーへようこそ", "ハッピーツアー", "マリーとティータイム", "ギルティなのは誰？", "2人でシャウト", "実力行使", "夏の夜はイチゴ味", "マリーのアンブレラ", "大好きって気持ち", "完璧な衣装", "ツンツンペンギン", "青空サイクリング", "ルビィのクイズ", "次までがんばルビィ♪", "韓国を知りたくて", "笑顔を運んで", "心の中を見せて", "遥かなるゴール", "わたしの金魚さん", "ルビィのお気に入り", "太陽さんへの祈り", "秘密の差し入れ", "あなたとデュエット", "燃える心", "11人の雪の結晶", "進化するために", "ライバルとして", "私たちの本気", "私達だけが出来ること"]);
var schoolidolu_exclude_ids = new Set([1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1568, 1588, 1589, 1603, 1606, 1607, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1625, 1626, 1627, 1628, 1636, 1639, 1640, 1650, 1651, 1664, 1665, 1666, 1667, 1668, 1669, 1670, 1671, 1672, 1673, 1674, 1685, 1686, 1694, 1695, 1696, 1697, 1698, 1699, 1700, 1701, 1702, 1706, 1707, 1720, 1721, 1722, 1730, 1733, 1734, 1735, 1736, 1737, 1738, 1739, 1740, 1741, 1742, 1743, 1744, 1748, 1755, 1758, 1759, 1760, 1763, 1769, 1772, 1773, 1782, 1783, 1784, 1785, 1786, 1787, 1788, 1789, 1790, 1791, 1792, 1811, 1812, 1834, 1835, 1855, 1858, 1859, 1879, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1902, 1903, 1904, 1923, 1924, 1932, 1935, 1936, 1940, 1949, 1950, 1954, 1985, 1986, 1998, 2000, 2003, 2004, 2019, 2020, 2032, 2033, 2049, 2050, 2055, 2060, 2067, 2068, 2082, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2101, 2165, 2166, 2167, 2168, 2169, 2170, 2171, 2172, 2173, 2174]);

// Dictionaries for easy conversions from Minaraishis JSON output
var meatbun_display_name = {
    "1.穂乃果": "Honoka",
    "2.絵里": "Eli",
    "3.ことり": "Kotori",
    "4.海未": "Umi",
    "5.凛": "Rin",
    "6.真姫": "Maki",
    "7.希": "Nozomi",
    "8.花陽": "Hanayo",
    "9.にこ": "Nico",
    "11.千歌": "Chika",
    "12.梨子": "Riko",
    "13.果南": "Kanan",
    "14.ダイヤ": "Dia",
    "15.曜": "You",
    "16.善子": "Yoshiko",
    "17.花丸": "Hanamaru",
    "18.鞠莉": "Mari",
    "19.ルビィ": "Ruby"
};
var meatbun_display_attr = {
    "1.スマイル": "Smile",
    "2.ピュア": "Pure",
    "3.クール": "Cool"
};

// Keep schoolido.lu cards saved until account is changed, so we don't have to query the API every time
var schoolidolu_unit_cache = undefined;

/**
 * Get mic count for a given otasuke power. Numbers from https://darsein.github.io/lovelive/sif/tools/otasuke_power/
 * @param ota Otasuke power
 * @returns {number} Mic count
 */
function getMicCountFromOtasuke(ota) {
    if (ota < 450) return 1;
    if (ota < 900) return 2;
    if (ota < 1350) return 3;
    if (ota < 2250) return 4;
    if (ota < 3150) return 5;
    if (ota < 4650) return 6;
    if (ota < 6900) return 7;
    if (ota < 10050) return 8;
    if (ota < 14250) return 9;
    return 10;
}

/**
 * Get otasuke power required for a mic count. Numbers from https://darsein.github.io/lovelive/sif/tools/otasuke_power/
 * @param mics Mic count
 * @returns {number} Otasuke power
 */
function getOtasukeFromMic(mics) {
    if (mics <= 1) return 0;
    if (mics == 2) return 450;
    if (mics == 3) return 900;
    if (mics == 4) return 1350;
    if (mics == 5) return 2250;
    if (mics == 6) return 3150;
    if (mics == 7) return 4650;
    if (mics == 8) return 6900;
    if (mics == 9) return 10050;
    return 14250;
}

/**
 * Minaraishi Loader. Takes the JSON data available when exporting data from the tool. However, it lacks card IDs, so
 * there are no icons.
 * @param jsonString Exported JSON data from Minaraishi (aka. Meat Bun) team builder
 * @returns {*} A list of objects representing cards and their otasuke power.
 */
function loadMeatBun(jsonString) {
    try {
        var units = JSON.parse(jsonString);
        var otasuke = [];
        units["members"].forEach(function (unit) {
            // Handle empty rows
            if (unit[0] === null) return true;
            // unit[2]: Rarity, saved with a unique number which is cut off here. Meatbun only supports SR/SSR/UR.
            var rarity = unit[2].substring(2);
            // unit[16]: Primary Leader Skill. If it's a "X Power" skill, this member is a promo card.
            var isPromo = unit[16] === "1.スマイルパワー" || unit[16] === "1.クールパワー" || unit[16] === "1.ピュアパワー";

            if (meatbun_exclude_skills.has(unit[3])) isPromo = true;

            otasuke.push({
                "name": meatbun_display_name[unit[0]],
                "image": null,
                "attribute": meatbun_display_attr[unit[1]],
                "rarity": (isPromo ? "P" : "") + rarity,
                "skill": unit[3],
                "skilllvl": unit[6],
                "otasuke": rarity_rates[isPromo ? "R" : rarity] * unit[6]
            });
        });

        return otasuke;
    } catch (error) {
        // Usually means JSON couldn't be parsed
        $("#error-messages").html("There was a syntax error: " + error.message);
        $("#error").show();
        $("#result").hide();

        return undefined;
    }
}

/**
 * School Idol Tomodachi Loader, Step 1. Load the list of accounts defined on the site for the given username, and add
 * them to the account list DOM element.
 * @param userName The schoolido.lu username to load accounts for.
 */
function loadSchoolIdoluAccounts(userName) {
    schoolidolu_unit_cache = undefined;
    var target = $("#schoolidolu-accounts");
    var error = $("#error");
    var errors = $("#error-messages");

    if (userName === "") {
        errors.html("Please enter a School Idol Tomodachi user name.");
        error.show();
        target.html("");
        return;
    }

    target.html("<img class='loading' src='image/loading.gif'>");
    error.hide();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://schoolido.lu/api/users/" + encodeURI(userName) + "/?expand_accounts=true",
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            if (msg["accounts"] === null) {
                target.html("No accounts found.");
                return;
            }

            var str = "Please choose an account. Only SRs, SSRs and URs from your Deck will be loaded.";
            var i = 0;
            msg["accounts"].forEach(function (account) {
                str += "<label><input type='radio' name='schoolidolu-account' id='schoolidolu-account-" +
                    i + "' value='" + account["id"] + "'><span><div " +
                    "class='schoolidolu-account'>" + (account["center"] !== null ? "<img src='" +
                        account["center"]["round_image"] + "'>" : "<span class='nocenter'>No<br>Center</span>") + "<span>" +
                    account["nickname"] + " " + account["language"] + "</span><br>Rank "
                    + (account["rank"] === null ? "unknown" : account["rank"]) + "</div></span></label>";
                i++;
            });
            target.html(str);
            $("input:radio[name=schoolidolu-account]").change(function () {
                schoolidolu_unit_cache = undefined;
            });
        },
        error: function () {
            errors.html("Couldn't retrieve info about user.");
            error.show();
            target.html("");
        }
    });
}

/**
 * School Idol Tomodachi Loader, Step 2. Load all cards for the given account ID, put them into the account cache and
 * immediately sort them.
 * @param accountId The schoolido.lu account ID to load cards from.
 */
function loadSchoolIdoluCards(accountId) {
    var target = $("#result");
    var loader = $("#result-loader");
    var error = $("#error");
    var errors = $("#error-messages");

    target.hide();

    if (typeof accountId !== 'number' || isNaN(accountId)) {
        errors.html("No account chosen.");
        error.show();
        loader.html("");
        return;
    }

    loader.html("<img class='loading' src='image/loading.gif'><br>Getting cards from School Idol Tomodachi..." +
        "<span id='schoolidolu-load-count'>0</span> of <span id='schoolidolu-load-max'>?</span> loaded.");
    error.hide();

    var units = [];

    var success_handler = function (msg) {
        if (msg["results"] === null) {
            schoolidolu_unit_cache = units;
            loader.html("");
            doOtasukeSort(units);
        }

        $("#schoolidolu-load-max").text(msg["count"]);

        msg["results"].forEach(function (unit) {
            // Schoolidolu classifies limited URs as promos for some reason. This is a shitty fix and I hope it
            // doesn't break any other cards: if SIT says this promo came from a non-existant item, it's probably
            // a limited UR as it was available by scouting, not buying merch
            // Update: since February 2019, they don't use the item field for login bonuses anymore, so now we
            // have to manually filter them using the schoolidolu_exclude_ids set as well...
            if (unit["card"]["is_promo"] && unit["card"]["promo_item"] === null) unit["card"]["is_promo"] = false;

            if (schoolidolu_exclude_ids.has(unit["card"]["id"])) unit["card"]["is_promo"] = true;

            units.push({
                "name": unit["card"]["idol"]["name"].split(" ")[1],
                "image": unit["idolized"] ? unit["card"]["round_card_idolized_image"] : unit["card"]["round_card_image"],
                "attribute": unit["card"]["attribute"],
                "rarity": (unit["card"]["is_promo"] ? "P" : "") + unit["card"]["rarity"],
                "skill": unit["card"]["japanese_skill"],
                "skilllvl": unit["skill"],
                "otasuke": rarity_rates[unit["card"]["is_promo"] ? "R" : unit["card"]["rarity"]] * unit["skill"]
            });
        });

        $("#schoolidolu-load-count").text(units.length);

        if (msg["next"] !== null) {
            $.ajax({
                type: "GET",
                dataType: "json",
                // "next" url is always in http protocol even though we need https
                url: "https://" + msg["next"].split("://")[1],
                contentType: "application/json; charset=utf-8",
                success: success_handler,
                error: function () {
                    errors.html("Couldn't retrieve cards from account.");
                    error.show();
                    loader.html("");
                }
            });
        } else {
            schoolidolu_unit_cache = units;
            loader.html("");
            doOtasukeSort(units);
        }
    };

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://schoolido.lu/api/ownedcards/?owner_account=" + accountId + "&page_size=30&card__rarity=SR,SSR,UR&stored=Deck&expand_card=true",
        contentType: "application/json; charset=utf-8",
        success: success_handler,
        error: function () {
            $("#error-messages").html("Couldn't retrieve cards from account.");
            $("#error").show();
        }
    });
}

/**
 * Sort and filter a given unit list.
 * @param units A list of objects representing cards and their otasuke power.
 */
function doOtasukeSort(units) {
    // Filter by attribute and sort by otasuke
    var result;
    var attr = $("input:radio[name=attribute]:checked").val();
    if (attr === "All") {
        result = units;
    } else {
        result = units.filter(function (u) {
            return u.attribute == attr;
        });

    }
    result.sort(function (a, b) {
        return b.otasuke - a.otasuke;
    });

    var s = "";
    var otasum = 0;
    var otaleft = 9;
    var hasIcons = false;
    // Create table, also sum top 9 otasuke powers to get the optimal team
    result.forEach(function (unit) {
        if (otaleft-- > 0) otasum += unit.otasuke;
        if (unit.image !== null) hasIcons = true;
        s += "<tr><td><img src='" + unit.image + "'></td><td>" + unit.name + "</td><td>" + unit.attribute + "</td><td>" + unit.rarity +
            "</td><td>" + unit.skill + "</td><td>" + unit.skilllvl + "</td><td>" + otasukeFormat(unit.otasuke) + "</td></tr>";
    });

    var mics = getMicCountFromOtasuke(otasum);
    var overMic = otasum - getOtasukeFromMic(mics);
    var leftToNextMic = getOtasukeFromMic(mics + 1) - otasum;

    $("#error").hide();
    $("#otasum").text(otasukeFormat(otasum));
    $("#otamics").html(mics);
    $("#otaover").html(otasukeFormat(overMic));
    $("#otaleft").html(otasukeFormat(leftToNextMic));
    $("#resulttable").html(s);
    $("#result").toggleClass("noicons", !hasIcons).show();
}

/**
 * In most communities, otasuke power of a rarity is measured as a decimal up to 1 (= UR), while the calculator uses
 * integers up to 200 (= UR) for accuracy. This method converts the integer power to the decimal power.
 * @param ota Integer otasuke power.
 * @return {number} Decimal otasuke power.
 */
function otasukeFormat(ota) {
    return (ota / 200).toFixed(3);
}

$(function () {
    M.AutoInit();

    $("#sort").click(function () {
        var source = $("input:radio[name=source]:checked").val();
        if (source === "meatbun") {
            var units = loadMeatBun($("#meatbun_input").val());
            if (units !== undefined) doOtasukeSort(units);
        } else if (source === "schoolidolu") {
            var accNum = Number($("input:radio[name=schoolidolu-account]:checked").val());
            if (schoolidolu_unit_cache === undefined) loadSchoolIdoluCards(accNum);
            else doOtasukeSort(schoolidolu_unit_cache);
        }
    });

    $("#schoolidolu-load-accounts").click(function () {
        loadSchoolIdoluAccounts($("#schoolidolu-username").val());
    });

    // Collapse all non-selected inputs and show desired input. Execute immediately to handle pre-selected radios
    $("input:radio[name=source]").change(function () {
        if (!this.checked) return;
        if (this.value === "meatbun") $("#input-meatbun").slideDown();
        else $("#input-meatbun").slideUp();
        if (this.value === "schoolidolu") $("#input-schoolidolu").slideDown();
        else $("#input-schoolidolu").slideUp();
    }).change();
});