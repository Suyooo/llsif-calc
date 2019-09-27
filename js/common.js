/**
 * @file Functions and types used across all calculators, such as event timers, display functions and LP recovery.
 */

/**
 * A class serving static methods used across all calculators, such as event timers, display functions and LP recovery.
 * @class Common
 * @constructor
 */
function Common() {

}

/**
 * An object used to store information about rank ups and loveca use during calculation.
 * @class LpRecoveryInfo
 * @property {number} totalRankUpLpRecovery - Total LP gained through rank ups.
 * @property {number} lpToRecover - LP required to recover in order to reach the target.
 * @property {number} rankUpCount - How often the player will rank up before they reach the target.
 * @property {number} lovecaLpRecovery - Average LP gained when using a loveca.
 * @property {number} lovecaUses - Total amount of loveca used.
 * @property {number} finalRank - The player's final rank after reaching the target.
 * @param {number} initialRank The player's initial rank.
 * @constructor
 */
function LpRecoveryInfo(initialRank) {
    this.totalRankUpLpRecovery = 0;
    this.lpToRecover = 0;
    this.rankUpCount = 0;
    this.lovecaLpRecovery = 0;
    this.lovecaUses = 0;
    this.finalRank = initialRank;
}

/**
 * Attempt to automatically generate event time.
 * EN Events begin at 9:00 UTC and end at 8:00 UTC, JP Events begin at 7:00 UTC and end at 6:00 UTC.
 * JP Events always run each month from the 5th to the 15th, and from the 20th to the last day of the month.
 * EN Events used to have a similar schedule before Klab EN decided that was boring.
 * Instead, we can define a date override in networkinfo.js.
 * @param  {region} timerRegion The event region, either "en" or "jp".
 * @returns {Date[]} An array containing start and end date of the current event, index 0 and 1 respectively
 */
Common.getEventBeginEndTime = function (timerRegion) {
    // Handle overrides define in networkinfo.js
    if (timerRegion == "en" && enDateOverride !== null) return enDateOverride;
    if (timerRegion == "jp" && jpDateOverride !== null) return jpDateOverride;

    var currentTime = new Date();

    // Dates when the automatic timer will switch to the next event
    // Set to one day before start, so it matches with the new announcement
    var switchDateFirst = new Date(Date.UTC(currentTime.getUTCFullYear(),
        currentTime.getUTCMonth(), 4, (timerRegion == "jp") ? 6 : 8));
    var switchDateSecond = new Date(Date.UTC(currentTime.getUTCFullYear(),
        currentTime.getUTCMonth(), 19, (timerRegion == "jp") ? 6 : 8));

    // Fun little hack: Settting a date to the 0th day of a month makes it the last day of the previous month
    if (currentTime < switchDateFirst) {
        // 1st to 4th of a month - show last months second event
        return [new Date(Date.UTC(currentTime.getUTCFullYear(),
            currentTime.getUTCMonth() - 1, 20, (timerRegion == "jp") ? 7 : 9)),
            new Date(Date.UTC(currentTime.getUTCFullYear(),
                currentTime.getUTCMonth(), 0, (timerRegion == "jp") ? 6 : 8))];
    } else if (currentTime < switchDateSecond) {
        // 4th to 19th of a month - show this months first event
        return [new Date(Date.UTC(currentTime.getUTCFullYear(),
            currentTime.getUTCMonth(), 5, (timerRegion == "jp") ? 7 : 9)),
            new Date(Date.UTC(currentTime.getUTCFullYear(),
                currentTime.getUTCMonth(), 15, (timerRegion == "jp") ? 6 : 8))];
    } else {
        // 19th to end of month - show this months second event
        return [new Date(Date.UTC(currentTime.getUTCFullYear(),
            currentTime.getUTCMonth(), 20, (timerRegion == "jp") ? 7 : 9)),
            new Date(Date.UTC(currentTime.getUTCFullYear(),
                currentTime.getUTCMonth() + 1, 0, (timerRegion == "jp") ? 6 : 8))];
    }
};

/**
 * Calculate the amount of minutes left in an event.
 * @param {region} timerRegion The event region, either "en" or "jp".
 * @returns {number} The amount of minutes left in the event, using the dates from getEventBeginEndTime
 * @see getEventBeginEndTime
 */
Common.getAutoRestTimeInMinutes = function (timerRegion) {
    var eventDates = this.getEventBeginEndTime(timerRegion);
    var currentTime = new Date();
    if (currentTime < eventDates[0]) {
        return this.minsBetween(eventDates[1], eventDates[0]);
    } else {
        return this.minsBetween(eventDates[1], currentTime);
    }
};

/**
 * Calculates the player's current maximum LP given their rank.
 * @param {number} playerRank The player's current rank.
 * @returns {number} Maximum LP at the given rank.
 */
Common.getMaxLp = function (playerRank) {
    if (300 > playerRank) {
        return Math.floor(playerRank / 2) + 25;
    } else {
        return Math.floor(playerRank / 3) + 75;
    }
};

/**
 * Calculates the experience points needed to rank up to the next rank, given a player's rank. Slightly inaccurate, but
 * usually the error is less than ten EXP. Taken from https://w.atwiki.jp/lovelive-sif/pages/23.html (comments too)
 * @param {number} playerRank The player's current rank.
 * @returns {number} EXP needed to rank up at the given rank.
 */
Common.getNextRankUpExp = function (playerRank) {
    if (playerRank < COMMON_RANK_UP_EXP.length) {
        return COMMON_RANK_UP_EXP[playerRank];
    } else if (playerRank < 1002) {
        return Math.round(34.45 * playerRank - 551);
    } else {
        return 34435 + (playerRank - 1001) * (35 + 3100 * (playerRank - 1000) / 2);
    }
};

/**
 * Calculate total LP gain through rank ups, assuming the player earns totalExpGained XP through lives.
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @returns {?LpRecoveryInfo} A new LpRecoveryInfo object containing only rank up information, or null if reaching the
 *      target would require more than COMMON_RANKUP_LIMITATION rankups.
 */
Common.calculateTotalRankUpLpRecovery = function (playerRank, totalExpGained, playerExp) {
    var recoveryInfo = new LpRecoveryInfo(playerRank);
    totalExpGained += playerExp;
    while (COMMON_RANKUP_LIMITATION > recoveryInfo.rankUpCount) {
        var expForNextRank = this.getNextRankUpExp(recoveryInfo.finalRank);
        if (expForNextRank > totalExpGained) {
            return recoveryInfo;
        }
        totalExpGained -= expForNextRank;
        recoveryInfo.totalRankUpLpRecovery += this.getMaxLp(recoveryInfo.finalRank);
        recoveryInfo.finalRank++;
        recoveryInfo.rankUpCount++;
    }
    return null;
};

/**
 * Calculates average max LP throughout the event, taking into account rankups and the resulting higher rate.
 * This is weighted - later ranks will be weighted more as you stay in them longer.
 * Used for loveca calculation, as this is the average amout of LP recovered with one loveca.
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @returns {number} Weighted average max LP of the player, given their initial rank and EXP they will collect, or -1
 *      if reaching the target would require more than COMMON_RANKUP_LIMITATION rankups.
 */
Common.calculateAverageLovecaLpRecovery = function (playerRank, totalExpGained) {
    if (0 === totalExpGained) {
        return this.getMaxLp(playerRank);
    }
    var weightedExpSum = 0;
    var expSum = 0;
    var rankUps = 0;
    while (COMMON_RANKUP_LIMITATION > rankUps) {
        var lpAtRank = this.getMaxLp(playerRank);
        var expForNextRank = this.getNextRankUpExp(playerRank);
        if (expForNextRank >= totalExpGained) {
            weightedExpSum += totalExpGained * lpAtRank;
            expSum += totalExpGained;
            return weightedExpSum / expSum;
        }
        weightedExpSum += expForNextRank * lpAtRank;
        expSum += expForNextRank;
        totalExpGained -= expForNextRank;
        playerRank++;
        rankUps++;
    }
    return -1;
};

/**
 * Calculate required loveca in order to reach the event point target.
 * Using the two other recovery calculation functions, we can subtract the LP gained through rank ups from the required
 * total, then subtract the natural LP regen, and finally divide the leftover LP by the average max LP to find the
 * amount of loveca required. It does not take into account *when* the loveca are used, to make the calculation
 * simpler.
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} lpRequired Sum of the LP cost of all lives required to reach the target.
 * @param {number} playerLp The player's initial LP.
 * @param {number} eventTimeLeftInMinutes Minutes left until the event ends.
 * @returns {?LpRecoveryInfo} A completed LpRecoveryInfo object, or null if reaching the target is impossible.
 * @see calculateTotalRankUpLpRecovery
 * @see calculateAverageLovecaLpRecovery
 */
Common.calculateLpRecoveryInfo = function (playerRank, totalExpGained, playerExp, lpRequired, playerLp, eventTimeLeftInMinutes) {
    var recoveryInfo = this.calculateTotalRankUpLpRecovery(playerRank, totalExpGained, playerExp);
    recoveryInfo.lovecaLpRecovery = this.calculateAverageLovecaLpRecovery(playerRank, totalExpGained);

    lpRequired -= recoveryInfo.totalRankUpLpRecovery;
    lpRequired -= playerLp;
    if (0 >= lpRequired) {
        return recoveryInfo;
    }

    // Subtract a single live from the time left - after all, it doesn't help if enough LP recover just in time for the
    // event ending, the live must be completed before the event end or it will not count
    eventTimeLeftInMinutes -= COMMON_LIVE_TIME_IN_MINUTES;

    // Small correction: partially regenerated LP are lost on refills because of overflow. Assuming you'll lose "half
    // an LP" per rank up, consider that LP recovery time lost by subtracting it from the time left
    eventTimeLeftInMinutes -= (recoveryInfo.rankUpCount) * (COMMON_LP_RECOVERY_TIME_IN_MINUTES / 2);
    if (0 > eventTimeLeftInMinutes) {
        return null;
    }

    recoveryInfo.lpToRecover = Math.max(0, (lpRequired - eventTimeLeftInMinutes / COMMON_LP_RECOVERY_TIME_IN_MINUTES));
    if (0 >= recoveryInfo.lpToRecover) {
        return recoveryInfo;
    }

    // Similar small correction here: on average, lose "half an LP" per refill
    recoveryInfo.lovecaUses = Math.ceil(recoveryInfo.lpToRecover / (recoveryInfo.lovecaLpRecovery - 0.5));
    if (recoveryInfo.lovecaUses < 0) {
        recoveryInfo.lovecaUses = 0;
    }

    return recoveryInfo;
};

/**
 * @param {number} g Amount of gold to be converted in a readable string.
 * @returns {string} String representing the gold, adding a suffix and digit grouping
 */
Common.goldToString = function (g) {
    return g.toLocaleString() + " G";
};

/**
 * @param {number} m Amount of minutes to be converted in a readable string.
 * @returns {string} String representing the time, split into hours and minutes
 */
Common.minutesToString = function (m) {
    m = Math.floor(m);
    if (m <= 0) {
        return "Less than a minute";
    }

    var hours = Math.floor(m / 60);
    var minutes = m % 60;
    var hoursPlural = (hours == 1) ? "" : "s";
    var minutesPlural = (minutes == 1) ? "" : "s";

    return ((hours > 0) ? hours + " hour" + hoursPlural + ", " : "") + minutes + " minute" + minutesPlural;
};

/**
 * @param {number} h Amount of hours to be converted in a readable string.
 * @returns {string} String representing the time, split into days and hours
 */
Common.hoursToString = function (h) {
    h = Math.floor(h);
    if (h <= 0) {
        return "Less than an hour";
    }

    var days = Math.floor(h / 24);
    var hours = h % 24;
    var daysPlural = (days == 1) ? "" : "s";
    var hoursPlural = (hours == 1) ? "" : "s";

    return ((days > 0) ? days + " day" + daysPlural + ", " : "") + hours + " hour" + hoursPlural;
};

/**
 * @param {Date} datea The later date.
 * @param {Date} dateb The earlier date.
 * @returns {number} Amount of minutes between datea and dateb.
 */
Common.minsBetween = function (datea, dateb) {
    return Math.floor((datea.getTime() - dateb.getTime()) / 60 / 1000);
};

/**
 * @param {Date} datea The later date.
 * @param {Date} dateb The earlier date.
 * @returns {number} Amount of hours between datea and dateb.
 */
Common.hoursBetween = function (datea, dateb) {
    return Math.floor(this.minsBetween(datea, dateb) / 60);
};

/**
 * A string, representing which server a method should assume.
 * Allowed values are 'en' for the Worldwide server, and 'jp' for the Japanese server.
 * @typedef {('en'|'jp')} region
 */

/**
 * A string, representing a live difficulty. Technical and Master are handled as EX.
 * @typedef {('EASY'|'NORMAL'|'HARD'|'EX')} difficulty
 */

/**
 * A string, representing a score or combo rank. Not achieving any rank is represented as 'N' ('None').
 * @typedef {('N'|'C'|'B'|'A'|'S')} rank
 */

/**
 * A string, representing an extended ranking scale - similar to rank, but includes SS and SSS for Friendly Matches.
 * @typedef {('N'|'C'|'B'|'A'|'S'|'SS'|'SSS')} rank_ext
 */

/**
 * A string, representing a position in a Score or Friendly Match. Includes an 'average' rank.
 * @typedef {('P1'|'P2'|'P3'|'P4'|'AVERAGE')} position
 */

/**
 * Difficulty names used across all events. Technical and Master are handled as EX.
 * @constant
 * @type {Object.<difficulty, number>}
 */
var COMMON_DIFFICULTY_IDS = {
    "EASY": 0,
    "NORMAL": 1,
    "HARD": 2,
    "EX": 3,
    "ERROR": 4
};

/**
 * Experience point rewards used across all events. Technical and Master are handled as Expert.
 * @constant
 * @type {number[]}
 */
var COMMON_EXP_REWARD = [];
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.EASY] = 12;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.NORMAL] = 26;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.HARD] = 46;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.EX] = 83;

/**
 * LP cost used across all events. Technical and Master are handled as Expert.
 * @constant
 * @type {number[]}
 */
var COMMON_LP_COST = [];
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.EASY] = 5;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.NORMAL] = 10;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.HARD] = 15;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.EX] = 25;

/**
 * Length of one live (including things like team/guest selection), used as a rough estimate for calculation.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_LIVE_TIME_IN_MINUTES = 3;

/**
 * Time in minutes it takes to regenerate one LP in LLSIF, used for natural LP regen calculation.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_LP_RECOVERY_TIME_IN_MINUTES = 6;

/**
 * Upper limit of simulated rank ups during recovery calculation functions to avoid endless loops.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_RANKUP_LIMITATION = 500000;

/**
 * Array of EXP rank up requirements for the first 100 ranks, used by getNextRankUpExp, as these are calculated
 * differently than the requirements for ranks past 100.
 * @constant
 * @type {number[]}
 * @default
 * @see getNextRankUpExp
 */
var COMMON_RANK_UP_EXP = [0, 6, 6, 8, 10, 13, 16, 20, 24, 28, 34, 39, 46, 52, 60, 68, 76, 85, 94, 104, 115, 125, 137,
    149, 162, 174, 188, 203, 217, 232, 247, 264, 281, 298, 310, 327, 345, 362, 379, 396, 413, 431, 448, 465, 483, 500,
    517, 534, 551, 569, 585, 603, 620, 638, 654, 672, 689, 707, 723, 741, 758, 775, 793, 810, 827, 844, 861, 878, 896,
    913, 930, 947, 965, 982, 999, 1016, 1033, 1051, 1068, 1085, 1102, 1120, 1137, 1154, 1171, 1189, 1206, 1223, 1240,
    1257, 1275, 1292, 1309, 1326, 1343, 1361, 1378, 1395, 1413, 1430];
