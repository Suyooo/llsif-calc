/**
 * @file Osampo Rally calculator.
 */

/**
 * An object used to store input values for the Token Event calculator.
 * @class RallyData
 * @property {boolean} rallyTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} rallyRegion - Which server to use for the Automatic Timer and event rewards.
 * @property {boolean} rallyTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} rallyManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} rallyLiveDifficulty - The difficulty lives are played on.
 * @property {rank} rallyLiveScore - Which score rank the player clears lives with.
 * @property {rank} rallyLiveCombo - Which combo rank the player clears lives with.
 * @property {number} rallyLiveMultiplier - Which multiplier the player plays lives on.
 * @property {number} rallyTargetEventPoints - The desired final amount of event points.
 * @property {number} rallyCurrentEventPoints - The current amount of event points.
 * @property {number} rallyCurrentRank - The player's current rank.
 * @property {number} rallyCurrentLP - The player's current LP.
 * @property {number} rallyCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function RallyData() {
    this.rallyTimerMethodAuto = false;
    this.rallyRegion = "en";
    this.rallyTimerMethodManual = false;
    this.rallyManualRestTimeInHours = 0;
    this.rallyLiveDifficulty = "EASY";
    this.rallyLiveScore = "N";
    this.rallyLiveCombo = "N";
    this.rallyLiveMultiplier = 1;
    this.rallyTargetEventPoints = 0;
    this.rallyCurrentEventPoints = 0;
    this.rallyCurrentRank = 0;
    this.rallyCurrentLP = 0;
    this.rallyCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a single live.
 * @class RallyLiveInfo
 * @property {number} lp - LP cost for one live.
 * @property {number} point - Event point reward for one live.
 * @property {number} exp - EXP reward for one live.
 * @constructor
 */
function RallyLiveInfo(lp, point, exp) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
}

/**
 * A class serving static calculation methods handling RallyData objects.
 * @class RallyEstimator
 * @constructor
 */
function RallyEstimator() {
}

/**
 * An object storing the result of the calculation for RallyData objects.
 * @class RallyEstimationInfo
 * @property {number} liveCount - Amount of lives to play.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function RallyEstimationInfo(liveCount, lpRecoveryInfo, restTime) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
RallyData.prototype.readFromUi = function () {
    this.rallyTimerMethodAuto = $("#rallyTimerMethodAuto").prop("checked");
    this.rallyRegion = $("input:radio[name=rallyRegion]:checked").val();
    this.rallyTimerMethodManual = $("#rallyTimerMethodManual").prop("checked");
    this.rallyManualRestTimeInHours = ReadHelpers.toNum($("#rallyManualRestTime").val());
    this.rallyLiveDifficulty = $("input:radio[name=rallyLiveDifficulty]:checked").val();
    this.rallyLiveScore = $("input:radio[name=rallyLiveScore]:checked").val();
    this.rallyLiveCombo = $("input:radio[name=rallyLiveCombo]:checked").val();
    this.rallyLiveMultiplier = ReadHelpers.toNum($("input:radio[name=rallyLiveMultiplier]:checked").val());
    this.rallyTargetEventPoints = ReadHelpers.toNum($("#rallyTargetEventPoints").val());
    this.rallyCurrentEventPoints = ReadHelpers.toNum($("#rallyCurrentEventPoints").val());
    this.rallyCurrentRank = ReadHelpers.toNum($("#rallyCurrentRank").val());
    this.rallyCurrentLP = ReadHelpers.toNum($("#rallyCurrentLP").val(), 0);
    this.rallyCurrentEXP = ReadHelpers.toNum($("#rallyCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {RallyData} savedData The saved data to recall values from.
 */
RallyData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#rallyTimerMethodAuto"), savedData.rallyTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=rallyRegion]"), savedData.rallyRegion);
    if (savedData.rallyRegion !== undefined) {
        updateTimerSection("rally");
    }
    var manualButton = $("#rallyTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.rallyTimerMethodManual);
    if (savedData.rallyTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#rallyManualRestTime"), savedData.rallyManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=rallyLiveDifficulty]"), savedData.rallyLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=rallyLiveScore]"), savedData.rallyLiveScore);
    SetHelpers.radioButtonHelper($("input:radio[name=rallyLiveCombo]"), savedData.rallyLiveCombo);
    SetHelpers.radioButtonHelper($("input:radio[name=rallyLiveMultiplier]"), savedData.rallyLiveMultiplier);
    SetHelpers.inputHelper($("#rallyTargetEventPoints"), savedData.rallyTargetEventPoints);
    SetHelpers.inputHelper($("#rallyCurrentEventPoints"), savedData.rallyCurrentEventPoints);
    SetHelpers.inputHelper($("#rallyCurrentRank"), savedData.rallyCurrentRank);
    SetHelpers.inputHelper($("#rallyCurrentLP"), savedData.rallyCurrentLP);
    SetHelpers.inputHelper($("#rallyCurrentEXP"), savedData.rallyCurrentEXP);
    if (savedData.rallyCurrentLP > 0 || savedData.rallyCurrentEXP > 0) {
        $("#rallyCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
RallyData.prototype.alert = function () {
    alert("rallyTimerMethodAuto: " + this.rallyTimerMethodAuto + "\n" +
          "rallyTimerRegion: " + this.rallyRegion + "\n" +
          "rallyTimerMethodManual: " + this.rallyTimerMethodManual + "\n" +
          "rallyManualRestTimeInHours: " + this.rallyManualRestTimeInHours + "\n" +
          "rallyLiveDifficulty: " + this.rallyLiveDifficulty + "\n" +
          "rallyLiveScore: " + this.rallyLiveScore + "\n" +
          "rallyLiveCombo: " + this.rallyLiveCombo + "\n" +
          "rallyLiveMultiplier: " + this.rallyLiveMultiplier + "\n" +
          "rallyTargetEventPoints: " + this.rallyTargetEventPoints + "\n" +
          "rallyCurrentEventPoints: " + this.rallyCurrentEventPoints + "\n" +
          "rallyCurrentRank: " + this.rallyCurrentRank + "\n" +
          "rallyCurrentLP: " + this.rallyCurrentLP + "\n" +
          "rallyCurrentEXP: " + this.rallyCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
RallyData.prototype.getRestTimeInMinutes = function () {
    if (this.rallyTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.rallyRegion);
    }
    if (this.rallyTimerMethodManual) {
        return 60 * this.rallyManualRestTimeInHours;
    }
    return 0;
};

/**
 * Calculates how many event points rewarded by reading stories can be earned by the player.
 * @returns {number} The total amount of story points that can be aquired before meeting the target.
 */
RallyData.prototype.getStoryPoints = function () {
    var storyPoints = 0;
    if (this.rallyCurrentEventPoints < 1000 && this.rallyTargetEventPoints >= 1200) storyPoints += 200;
    if (this.rallyCurrentEventPoints < 4500 && this.rallyTargetEventPoints >= 4700) storyPoints += 200;
    if (this.rallyCurrentEventPoints < 8000 && this.rallyTargetEventPoints >= 8200) storyPoints += 200;
    if (this.rallyCurrentEventPoints < 15000 && this.rallyTargetEventPoints >= 15200) storyPoints += 200;
    return storyPoints;
};

/**
 * Returns the amount of event points left to meet the target.
 * @param enableStoryPointCalculation Flag used to differentiate in cases where the event point target is reached,
 * but it might be that that is only because of the addition story points. Used in @link{RallyData.validate}.
 * @returns {number} Event points required from live plays in order to reach the given target.
 */
RallyData.prototype.getEventPointsLeft = function (enableStoryPointCalculation) {
    var restPoints = this.rallyTargetEventPoints;
    restPoints -= this.rallyCurrentEventPoints;
    if (enableStoryPointCalculation) {
        restPoints -= this.getStoryPoints();
    }
    return restPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
RallyData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.rallyLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted live score rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link RALLY_SCORE_RATE}.ERROR if the input is invalid.
 */
RallyData.prototype.getLiveScoreRate = function () {
    var scoreRate = RALLY_SCORE_RATE[this.rallyLiveScore];
    if (undefined !== scoreRate) return scoreRate;
    return RALLY_SCORE_RATE.ERROR;
};

/**
 * Get an index associated with the inputted live combo rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link RALLY_COMBO_RATE}.ERROR if the input is invalid.
 */
RallyData.prototype.getLiveComboRate = function () {
    var comboRate = RALLY_COMBO_RATE[this.rallyLiveCombo];
    if (undefined !== comboRate) return comboRate;
    return RALLY_COMBO_RATE.ERROR;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
RallyData.prototype.getLiveMultiplier = function () {
    var multiplier = this.rallyLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Creates a {@link RallyLiveInfo} object using the live input values, representing one play.
 * @returns {?RallyLiveInfo} A new object with all properties set, or null if the live inputs are invalid.
 */
RallyData.prototype.createLiveInfo = function () {
    var diffId = this.getLiveDifficulty(),
        scoreRate = this.getLiveScoreRate(),
        comboRate = this.getLiveComboRate(),
        multiplier = this.getLiveMultiplier();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || scoreRate == RALLY_SCORE_RATE.ERROR
        || comboRate == RALLY_COMBO_RATE.ERROR || multiplier === 0) {
        return null;
    }

    return new RallyLiveInfo(COMMON_LP_COST[diffId] * multiplier,
        Math.round(RALLY_BASE_EVENT_POINTS[diffId] * scoreRate * comboRate) * multiplier,
        COMMON_EXP_REWARD[diffId] * multiplier);
};

/**
 * Call {@link RallyEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link RallyData.validate}.
 * @returns {RallyEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
RallyData.prototype.estimate = function () {
    return RallyEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(true),
        this.getRestTimeInMinutes(), this.rallyCurrentRank, this.rallyCurrentEXP, this.rallyCurrentLP);
};

/**
 * Start calculation for an Osampo Rally. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of lives to play to reach the point goal.</li>
 * <li>2) Calculate total amount of LP needed to play all of these.</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {RallyLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @returns {RallyEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
RallyEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, playerLp) {
    var liveCount = Math.ceil(eventPointsLeft / liveInfo.point);
    if (liveCount * COMMON_LIVE_TIME_IN_MINUTES > timeLeft) return new RallyEstimationInfo(liveCount, null, timeLeft);
    var recoveryInfo =
        Common.calculateLpRecoveryInfo(playerRank, liveInfo.exp * liveCount, playerExp, liveInfo.lp * liveCount,
            playerLp, timeLeft);
    return new RallyEstimationInfo(liveCount, recoveryInfo, timeLeft);
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
RallyEstimationInfo.prototype.getPlayTime = function () {
    return this.liveCount * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
RallyEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
RallyEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#rallyResultLiveCount"), this.liveCount);
    $("#rallyResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#rallyResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var showSleepWarning = false;

    if (this.lpRecoveryInfo) {
        Results.setBigResult($("#rallyResultRefills"), this.lpRecoveryInfo.lovecaUses);
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#rallyResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" + this.lpRecoveryInfo.finalRankExp + "/" +
                                        Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank) + " EXP)");
        $("#rallyResultLoveca").text(this.lpRecoveryInfo.lovecaUses);
        $("#rallyResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#rallyResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
        $("#rallyResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
    } else {
        Results.setBigResult($("#rallyResultRefills"), "---");
        $("#rallyResultFinalRank").text("---");
        $("#rallyResultLoveca").text("---");
        $("#rallyResultSugarPots50").text("---");
        $("#rallyResultSugarPots100").text("---");
        $("#rallyResultSugarCubes").text("---");
    }

    Results.show($("#rallyResult"), showSleepWarning);
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
RallyData.prototype.validate = function () {
    var errors = [];

    if (this.rallyRegion != "en" && this.rallyRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    var liveInfo = this.createLiveInfo();
    if (null === liveInfo) {
        errors.push("Live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.rallyCurrentRank)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
                    ") that's higher than your max LP (" + Common.getMaxLp(this.rallyCurrentRank) + ")");
    }

    if (0 >= this.rallyTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft(true) <= 0) {
        if (this.getEventPointsLeft(false) <= 0) {
            errors.push("The given event point target has been reached! " +
                        "Please change the event point target in order to calculate again");
        } else {
            errors.push("In order to reach the given event point target, " +
                        "you only need to clear the rest of the stories. No lives need to be played");
        }
    }

    if (0 > this.rallyCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.rallyCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.rallyCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.rallyCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.rallyTimerMethodAuto && this.rallyTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.rallyTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.rallyTimerMethodManual) {
        if (isNaN(this.getRestTimeInMinutes())) {
            errors.push("Manual Input only accepts integers")
        } else if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Enter a valid remaining time");
        }
    } else {
        errors.push("Select Automatic Timer or Manual Input");
    }

    return errors;
};

/**
 * Event point reward multiplier for each possible score rank in a live.
 * @constant
 * @type {Object.<string, number>}
 */
var RALLY_SCORE_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.2,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible combo rank in a live.
 * @constant
 * @type {Object.<string, number>}
 */
var RALLY_COMBO_RATE = {
    "N": 1,
    "C": 1.02,
    "B": 1.04,
    "A": 1.06,
    "S": 1.08,
    "ERROR": 0
};

/**
 * Amount of base event point rewards for clearing each difficulty.
 * @constant
 * @type {number[]}
 */
var RALLY_BASE_EVENT_POINTS = [];
RALLY_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EASY] = 42;
RALLY_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.NORMAL] = 99;
RALLY_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD] = 173;
RALLY_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EX] = 343;