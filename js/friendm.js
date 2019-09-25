/**
 * @file Friendly Match calculator.
 */

/**
 * An object used to store input values for the Score Match calculator.
 * @class FriendlyMatchData
 * @property {boolean} friendmTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} friendmTimerRegion - Which server to use for the Automatic Timer.
 * @property {boolean} friendmTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} friendmManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} friendmLiveDifficulty - The difficulty lives are played on.
 * @property {rank} friendmLiveOwnScore - Which score rank the player clears lives with.
 * @property {rank} friendmLiveOwnCombo - Which combo rank the player clears lives with.
 * @property {position} friendmLiveOwnPosition - Which position the player finishes lives in.
 * @property {rank_ext} friendmLiveGroupMission - Which mission rank the group clears lives with.
 * @property {number} friendmLiveMultiplier - Which multiplier the player plays lives on.
 * @property {number} friendmTargetEventPoints - The desired final amount of event points.
 * @property {number} friendmCurrentEventPoints - The current amount of event points.
 * @property {number} friendmCurrentRank - The player's current rank.
 * @property {number} friendmCurrentLP - The player's current LP.
 * @property {number} friendmCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function FriendlyMatchData() {
    this.friendmTimerMethodAuto = false;
    this.friendmTimerRegion = "en";
    this.friendmTimerMethodManual = false;
    this.friendmManualRestTimeInHours = 0;
    this.friendmLiveDifficulty = "EASY";
    this.friendmLiveOwnScore = "N";
    this.friendmLiveOwnCombo = "N";
    this.friendmLiveOwnPosition = "AVERAGE";
    this.friendmLiveGroupMission = "N";
    this.friendmLiveMultiplier = 1;
    this.friendmTargetEventPoints = 0;
    this.friendmCurrentEventPoints = 0;
    this.friendmCurrentRank = 0;
    this.friendmCurrentLP = 0;
    this.friendmCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a single live.
 * @class FriendlyMatchLiveInfo
 * @property {number} lp - LP cost for one live.
 * @property {number} point - Event point reward for one live.
 * @property {number} exp - EXP reward for one live.
 * @constructor
 */
function FriendlyMatchLiveInfo(lp, point, exp) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
}

/**
 * A class serving static calculation methods handling FriendlyMatchData objects.
 * @class FriendlyMatchEstimator
 * @constructor
 */
function FriendlyMatchEstimator() {
}

/**
 * An object storing the result of the calculation for FriendlyMatchData objects.
 * @class FriendlyMatchEstimationInfo
 * @property {number} liveCount - Amount of lives to play.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function FriendlyMatchEstimationInfo(liveCount, lpRecoveryInfo, restTime) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
FriendlyMatchData.prototype.readFromUi = function () {
    this.friendmTimerMethodAuto = $("#friendmTimerMethodAuto").prop("checked");
    this.friendmTimerRegion = $("input:radio[name=friendmTimerRegion]:checked").val();
    this.friendmTimerMethodManual = $("#friendmTimerMethodManual").prop("checked");
    this.friendmManualRestTimeInHours = ReadHelpers.toNum($("#friendmManualRestTime").val());
    this.friendmLiveDifficulty = $("input:radio[name=friendmLiveDifficulty]:checked").val();
    this.friendmLiveOwnScore = $("input:radio[name=friendmLiveScore]:checked").val();
    this.friendmLiveOwnCombo = $("input:radio[name=friendmLiveCombo]:checked").val();
    this.friendmLiveOwnPosition = $("input:radio[name=friendmLivePosition]:checked").val();
    this.friendmLiveGroupMission = $("input:radio[name=friendmLiveGroup]:checked").val();
    this.friendmLiveMultiplier = $("input:radio[name=friendmLiveMultiplier]:checked").val();
    this.friendmTargetEventPoints = ReadHelpers.toNum($("#friendmTargetEventPoints").val());
    this.friendmCurrentEventPoints = ReadHelpers.toNum($("#friendmCurrentEventPoints").val());
    this.friendmCurrentRank = ReadHelpers.toNum($("#friendmCurrentRank").val());
    this.friendmCurrentLP = ReadHelpers.toNum($("#friendmCurrentLP").val(), 0);
    this.friendmCurrentEXP = ReadHelpers.toNum($("#friendmCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {FriendlyMatchData} savedData The saved data to recall values from.
 */
FriendlyMatchData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#friendmTimerMethodAuto"), savedData.friendmTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmTimerRegion]"), savedData.friendmTimerRegion);
    if (savedData.friendmTimerRegion !== undefined) {
        updateAutoTimerSection("friendm");
    }
    var manualButton = $("#friendmTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.friendmTimerMethodManual);
    if (savedData.friendmTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#friendmManualRestTime"), savedData.friendmManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLiveDifficulty]"), savedData.friendmLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLiveScore]"), savedData.friendmLiveOwnScore);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLiveCombo]"), savedData.friendmLiveOwnCombo);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLivePosition]"), savedData.friendmLiveOwnPosition);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLiveGroup]"), savedData.friendmLiveGroupMission);
    SetHelpers.radioButtonHelper($("input:radio[name=friendmLiveMultiplier]"), savedData.friendmLiveMultiplier);
    SetHelpers.inputHelper($("#friendmTargetEventPoints"), savedData.friendmTargetEventPoints);
    SetHelpers.inputHelper($("#friendmCurrentEventPoints"), savedData.friendmCurrentEventPoints);
    SetHelpers.inputHelper($("#friendmCurrentRank"), savedData.friendmCurrentRank);
    SetHelpers.inputHelper($("#friendmCurrentLP"), savedData.friendmCurrentLP);
    SetHelpers.inputHelper($("#friendmCurrentEXP"), savedData.friendmCurrentEXP);
    if (savedData.friendmCurrentLP > 0 || savedData.friendmCurrentEXP > 0) {
        $("#friendmCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
FriendlyMatchData.prototype.alert = function () {
    alert("friendmTimerMethodAuto: " + this.friendmTimerMethodAuto + "\n" +
        "friendmTimerRegion: " + this.friendmTimerRegion + "\n" +
        "friendmTimerMethodManual: " + this.friendmTimerMethodManual + "\n" +
        "friendmManualRestTimeInHours: " + this.friendmManualRestTimeInHours + "\n" +
        "friendmLiveDifficulty: " + this.friendmLiveDifficulty + "\n" +
        "friendmLiveOwnScore: " + this.friendmLiveOwnScore + "\n" +
        "friendmLiveOwnCombo: " + this.friendmLiveOwnCombo + "\n" +
        "friendmLiveOwnPosition: " + this.friendmLiveOwnPosition + "\n" +
        "friendmLiveGroupMission: " + this.friendmLiveGroupMission + "\n" +
        "friendmLiveMultiplier: " + this.friendmLiveMultiplier + "\n" +
        "friendmTargetEventPoints: " + this.friendmTargetEventPoints + "\n" +
        "friendmCurrentEventPoints: " + this.friendmCurrentEventPoints + "\n" +
        "friendmCurrentRank: " + this.friendmCurrentRank + "\n" +
        "friendmCurrentLP: " + this.friendmCurrentLP + "\n" +
        "friendmCurrentEXP: " + this.friendmCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
FriendlyMatchData.prototype.getRestTimeInMinutes = function () {
    if (this.friendmTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.friendmTimerRegion);
    }
    if (this.friendmTimerMethodManual) {
        return 60 * this.friendmManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
FriendlyMatchData.prototype.getEventPointsLeft = function () {
    return this.friendmTargetEventPoints - this.friendmCurrentEventPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.friendmLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted individual score rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link FRIENDLY_MATCH_OWN_SCORE_RATE}.ERROR if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveOwnScoreRate = function () {
    var scoreRate = FRIENDLY_MATCH_OWN_SCORE_RATE[this.friendmLiveOwnScore];
    if (undefined !== scoreRate) return scoreRate;
    return FRIENDLY_MATCH_OWN_SCORE_RATE.ERROR;
};

/**
 * Get an index associated with the inputted individual combo rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link FRIENDLY_MATCH_OWN_COMBO_RATE}.ERROR if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveOwnComboRate = function () {
    var comboRate = FRIENDLY_MATCH_OWN_COMBO_RATE[this.friendmLiveOwnCombo];
    if (undefined !== comboRate) return comboRate;
    return FRIENDLY_MATCH_OWN_COMBO_RATE.ERROR;
};

/**
 * Get an index associated with the inputted individual contribution position for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link FRIENDLY_MATCH_OWN_POSITION_RATE}.ERROR if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveOwnPositionRate = function () {
    var posRate = FRIENDLY_MATCH_OWN_POSITION_RATE[this.friendmLiveOwnPosition];
    if (undefined !== posRate) return posRate;
    return FRIENDLY_MATCH_OWN_POSITION_RATE.ERROR;
};

/**
 * Get an index associated with the inputted group mission rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link FRIENDLY_MATCH_GROUP_MISSION_RATE}.ERROR if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveGroupMissionRate = function () {
    var missionRate = FRIENDLY_MATCH_GROUP_MISSION_RATE[this.friendmLiveGroupMission];
    if (undefined !== missionRate) return missionRate;
    return FRIENDLY_MATCH_GROUP_MISSION_RATE.ERROR;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
FriendlyMatchData.prototype.getLiveMultiplier = function () {
    var multiplier = this.friendmLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Creates a {@link FriendlyMatchLiveInfo} object using the live input values, representing one play.
 * @returns {?FriendlyMatchLiveInfo} A new object with all properties set, or null if the live inputs are invalid.
 */
FriendlyMatchData.prototype.createLiveInfo = function () {
    var diffId = this.getLiveDifficulty(),
        scoreRate = this.getLiveOwnScoreRate(),
        comboRate = this.getLiveOwnComboRate(),
        posRate = this.getLiveOwnPositionRate(),
        missionRate = this.getLiveGroupMissionRate(),
        multiplier = this.getLiveMultiplier();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || scoreRate == FRIENDLY_MATCH_OWN_SCORE_RATE.ERROR
        || comboRate == FRIENDLY_MATCH_OWN_COMBO_RATE.ERROR || posRate == FRIENDLY_MATCH_OWN_POSITION_RATE.ERROR
        || missionRate == FRIENDLY_MATCH_GROUP_MISSION_RATE.ERROR || multiplier === 0) {
        return null;
    }
    return new FriendlyMatchLiveInfo(COMMON_LP_COST[diffId] * multiplier,
        Math.round(FRIENDLY_MATCH_BASE_EVENT_POINTS[diffId] * scoreRate * comboRate * missionRate * posRate) * multiplier,
        COMMON_EXP_REWARD[diffId] * multiplier);
};

/**
 * Call {@link FriendlyMatchEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link FriendlyMatchData.validate}.
 * @returns {FriendlyMatchEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null
 *      if reaching the target is impossible.
 */
FriendlyMatchData.prototype.estimate = function () {
    return FriendlyMatchEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(),
        this.getRestTimeInMinutes(), this.friendmCurrentRank, this.friendmCurrentEXP, this.friendmCurrentLP);
};

/**
 * Start calculation for a Friendly Match. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of matches to play to reach the point goal.</li>
 * <li>2) Calculate total amount of LP needed to play all of these.</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {FriendlyMatchLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @returns {FriendlyMatchEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null
 *      if reaching the target is impossible.
 */
FriendlyMatchEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, playerLp) {
    var liveCount = Math.ceil(eventPointsLeft / liveInfo.point);
    if (liveCount * COMMON_LIVE_TIME_IN_MINUTES > timeLeft)
        return new FriendlyMatchEstimationInfo(liveCount, null, timeLeft);
    var lpRecoveryInfo =
        Common.calculateLpRecoveryInfo(playerRank, liveInfo.exp * liveCount, playerExp, liveInfo.lp * liveCount, playerLp, timeLeft);
    return new FriendlyMatchEstimationInfo(liveCount, lpRecoveryInfo, timeLeft)
};

/**
 * Returns the total time spent playing matches required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
FriendlyMatchEstimationInfo.prototype.getPlayTime = function () {
    return this.liveCount * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing matches.
 * @returns {number} The required play time divided by the event time left.
 */
FriendlyMatchEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
FriendlyMatchEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#friendmResultLiveCount"), this.liveCount);
    $("#friendmResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#friendmResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");

    if (this.lpRecoveryInfo) {
        Results.setBigResult($("#friendmResultLoveca"), this.lpRecoveryInfo.lovecaUses);
        $("#friendmResultFinalRank").text(this.lpRecoveryInfo.finalRank);
        $("#friendmResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
        $("#friendmResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#friendmResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
    } else {
        Results.setBigResult($("#friendmResultLoveca"), "---");
        $("#friendmResultFinalRank").text("---");
        $("#friendmResultSugarCubes").text("---");
        $("#friendmResultSugarPots50").text("---");
        $("#friendmResultSugarPots100").text("---");
    }

    Results.show($("#friendmResult"));
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
FriendlyMatchData.prototype.validate = function () {
    var errors = [];

    if (null === this.createLiveInfo()) {
        errors.push("Live parameters have not been set");
    }

    if (0 >= this.friendmTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
            "Please change the event point target in order to calculate again");
    }

    if (0 > this.friendmCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.friendmCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.friendmCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.friendmCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.friendmTimerMethodAuto && this.friendmTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.friendmTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
        if (this.friendmTimerRegion != "en" && this.friendmTimerRegion != "jp") {
            errors.push("Choose a region for the Automatic Timer");
        }
    } else if (this.friendmTimerMethodManual) {
        if (isNaN(this.getRestTimeInMinutes())) {
            errors.push("Manual Input only accepts integers");
        } else if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Enter a valid remaining time");
        }
    } else {
        errors.push("Select Automatic Timer or Manual Input");
    }

    return errors;
};

/**
 * Event point reward multiplier for each possible individual score rank in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var FRIENDLY_MATCH_OWN_SCORE_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.2,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible individual combo rank in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var FRIENDLY_MATCH_OWN_COMBO_RATE = {
    "N": 1,
    "C": 1.02,
    "B": 1.04,
    "A": 1.06,
    "S": 1.08,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible individual contribution position in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var FRIENDLY_MATCH_OWN_POSITION_RATE = {
    "P1": 1.08,
    "P2": 1.05,
    "P3": 1.02,
    "P4": 1,
    "AVERAGE": 1.0375,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible group mission rank in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var FRIENDLY_MATCH_GROUP_MISSION_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.25,
    "SS": 1.35,
    "SSS": 1.45,
    "ERROR": 0
};

/**
 * Amount of base event point rewards for clearing each difficulty.
 * @constant
 * @type {number[]}
 */
var FRIENDLY_MATCH_BASE_EVENT_POINTS = [];
FRIENDLY_MATCH_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EASY] = 39;
FRIENDLY_MATCH_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.NORMAL] = 89;
FRIENDLY_MATCH_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD] = 153;
FRIENDLY_MATCH_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EX] = 301;