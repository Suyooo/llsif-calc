/**
 * @file Score Match calculator.
 */

/**
 * An object used to store input values for the Score Match calculator.
 * @class ScoreMatchData
 * @property {boolean} scoremTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} scoremRegion - Which server to use for the Automatic Timer and event rewards.
 * @property {boolean} scoremTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} scoremManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} scoremLiveDifficulty - The difficulty lives are played on.
 * @property {rank} scoremLiveScore - Which score rank the player clears lives with.
 * @property {position} scoremLivePosition - Which position the player finishes lives in.
 * @property {number} scoremLiveMultiplier - Which multiplier the player plays lives on.
 * @property {number} scoremTargetEventPoints - The desired final amount of event points.
 * @property {number} scoremCurrentEventPoints - The current amount of event points.
 * @property {number} scoremCurrentRank - The player's current rank.
 * @property {number} scoremCurrentLP - The player's current LP.
 * @property {number} scoremCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function ScoreMatchData() {
    this.scoremTimerMethodAuto = false;
    this.scoremRegion = "en";
    this.scoremTimerMethodManual = false;
    this.scoremManualRestTimeInHours = 0;
    this.scoremLiveDifficulty = "EASY";
    this.scoremLiveScore = "N";
    this.scoremLivePosition = "AVERAGE";
    this.scoremLiveMultiplier = 1;
    this.scoremTargetEventPoints = 0;
    this.scoremCurrentEventPoints = 0;
    this.scoremCurrentRank = 0;
    this.scoremCurrentLP = 0;
    this.scoremCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a single live.
 * @class ScoreMatchLiveInfo
 * @property {number} lp - LP cost for one live.
 * @property {number} token - Event point reward for one live.
 * @property {number} exp - EXP reward for one live.
 * @constructor
 */
function ScoreMatchLiveInfo(lp, point, exp) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
}

/**
 * A class serving static calculation methods handling ScoreMatchData objects.
 * @class ScoreMatchEstimator
 * @constructor
 */
function ScoreMatchEstimator() {
}

/**
 * An object storing the result of the calculation for ScoreMatchData objects.
 * @class ScoreMatchEstimationInfo
 * @property {number} liveCount - Amount of lives to play.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function ScoreMatchEstimationInfo(liveCount, lpRecoveryInfo, restTime) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
ScoreMatchData.prototype.readFromUi = function () {
    this.scoremTimerMethodAuto = $("#scoremTimerMethodAuto").prop("checked");
    this.scoremRegion = $("input:radio[name=scoremRegion]:checked").val();
    this.scoremTimerMethodManual = $("#scoremTimerMethodManual").prop("checked");
    this.scoremManualRestTimeInHours = ReadHelpers.toNum($("#scoremManualRestTime").val());
    this.scoremLiveDifficulty = $("input:radio[name=scoremLiveDifficulty]:checked").val();
    this.scoremLiveScore = $("input:radio[name=scoremLiveScore]:checked").val();
    this.scoremLivePosition = $("input:radio[name=scoremLivePosition]:checked").val();
    this.scoremLiveMultiplier = $("input:radio[name=scoremLiveMultiplier]:checked").val();
    this.scoremTargetEventPoints = ReadHelpers.toNum($("#scoremTargetEventPoints").val());
    this.scoremCurrentEventPoints = ReadHelpers.toNum($("#scoremCurrentEventPoints").val());
    this.scoremCurrentRank = ReadHelpers.toNum($("#scoremCurrentRank").val());
    this.scoremCurrentLP = ReadHelpers.toNum($("#scoremCurrentLP").val(), 0);
    this.scoremCurrentEXP = ReadHelpers.toNum($("#scoremCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {ScoreMatchData} savedData The saved data to recall values from.
 */
ScoreMatchData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#scoremTimerMethodAuto"), savedData.scoremTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=scoremRegion]"), savedData.scoremRegion);
    if (savedData.scoremRegion !== undefined) {
        updateTimerSection("scorem");
    }
    var manualButton = $("#scoremTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.scoremTimerMethodManual);
    if (savedData.scoremTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#scoremManualRestTime"), savedData.scoremManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=scoremLiveDifficulty]"), savedData.scoremLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=scoremLiveScore]"), savedData.scoremLiveScore);
    SetHelpers.radioButtonHelper($("input:radio[name=scoremLivePosition]"), savedData.scoremLivePosition);
    SetHelpers.radioButtonHelper($("input:radio[name=scoremLiveMultiplier]"), savedData.scoremLiveMultiplier);
    SetHelpers.inputHelper($("#scoremTargetEventPoints"), savedData.scoremTargetEventPoints);
    SetHelpers.inputHelper($("#scoremCurrentEventPoints"), savedData.scoremCurrentEventPoints);
    SetHelpers.inputHelper($("#scoremCurrentRank"), savedData.scoremCurrentRank);
    SetHelpers.inputHelper($("#scoremCurrentLP"), savedData.scoremCurrentLP);
    SetHelpers.inputHelper($("#scoremCurrentEXP"), savedData.scoremCurrentEXP);
    if (savedData.scoremCurrentLP > 0 || savedData.scoremCurrentEXP > 0) {
        $("#scoremCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
ScoreMatchData.prototype.alert = function () {
    alert("scoremTimerMethodAuto: " + this.scoremTimerMethodAuto + "\n" +
          "scoremRegion: " + this.scoremRegion + "\n" +
          "scoremTimerMethodManual: " + this.scoremTimerMethodManual + "\n" +
          "scoremManualRestTimeInHours: " + this.scoremManualRestTimeInHours + "\n" +
          "scoremLiveDifficulty: " + this.scoremLiveDifficulty + "\n" +
          "scoremLiveScore: " + this.scoremLiveScore + "\n" +
          "scoremLivePosition: " + this.scoremLivePosition + "\n" +
          "scoremLiveMultiplier: " + this.scoremLiveMultiplier + "\n" +
          "scoremTargetEventPoints: " + this.scoremTargetEventPoints + "\n" +
          "scoremCurrentEventPoints: " + this.scoremCurrentEventPoints + "\n" +
          "scoremCurrentRank: " + this.scoremCurrentRank + "\n" +
          "scoremCurrentLP: " + this.scoremCurrentLP + "\n" +
          "scoremCurrentEXP: " + this.scoremCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
ScoreMatchData.prototype.getRestTimeInMinutes = function () {
    if (this.scoremTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.scoremRegion);
    }
    if (this.scoremTimerMethodManual) {
        return 60 * this.scoremManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
ScoreMatchData.prototype.getEventPointsLeft = function () {
    return this.scoremTargetEventPoints - this.scoremCurrentEventPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
ScoreMatchData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.scoremLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted live score rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link SCOREM_SCORE_RATE}.ERROR if the input is invalid.
 */
ScoreMatchData.prototype.getLiveScoreRate = function () {
    var scoreRate = SCOREM_SCORE_RATE[this.scoremLiveScore];
    if (undefined !== scoreRate) return scoreRate;
    return SCOREM_SCORE_RATE.ERROR;
};

/**
 * Get an index associated with the inputted live position for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link SCOREM_POSITION_RATE}.ERROR if the input is invalid.
 */
ScoreMatchData.prototype.getLivePositionRate = function () {
    var posRate = SCOREM_POSITION_RATE[this.scoremLivePosition];
    if (undefined !== posRate) return posRate;
    return SCOREM_POSITION_RATE.ERROR;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
ScoreMatchData.prototype.getLiveMultiplier = function () {
    var multiplier = this.scoremLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Creates a {@link ScoreMatchLiveInfo} object using the live input values, representing one play.
 * @returns {?ScoreMatchLiveInfo} A new object with all properties set, or null if the live inputs are invalid.
 */
ScoreMatchData.prototype.createLiveInfo = function () {
    var diffId = this.getLiveDifficulty(),
        scoreRate = this.getLiveScoreRate(),
        posRate = this.getLivePositionRate(),
        multiplier = this.getLiveMultiplier();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || scoreRate == SCOREM_SCORE_RATE.ERROR
        || posRate == SCOREM_POSITION_RATE.ERROR || multiplier === 0) {
        return null;
    }

    return new ScoreMatchLiveInfo(COMMON_LP_COST[diffId] * multiplier,
        Math.round(SCOREM_BASE_EVENT_POINTS[diffId] * scoreRate * posRate) * multiplier,
        COMMON_EXP_REWARD[diffId] * multiplier);
};

/**
 * Call {@link ScoreMatchEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link ScoreMatchData.validate}.
 * @returns {ScoreMatchEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ScoreMatchData.prototype.estimate = function () {
    return ScoreMatchEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(),
        this.getRestTimeInMinutes(), this.scoremCurrentRank, this.scoremCurrentEXP, this.scoremCurrentLP);
};

/**
 * Start calculation for a Score Match. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of matches to play to reach the point goal.</li>
 * <li>2) Calculate total amount of LP needed to play all of these.</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {ScoreMatchLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @returns {ScoreMatchEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ScoreMatchEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, playerLp) {
    var liveCount = Math.ceil(eventPointsLeft / liveInfo.point);
    if (liveCount * COMMON_LIVE_TIME_IN_MINUTES > timeLeft) {
        return new ScoreMatchEstimationInfo(liveCount, null, timeLeft);
    }
    var recoveryInfo =
        Common.calculateLpRecoveryInfo(playerRank, liveInfo.exp * liveCount, playerExp, liveInfo.lp * liveCount,
            playerLp, timeLeft);
    return new ScoreMatchEstimationInfo(liveCount, recoveryInfo, timeLeft)
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
ScoreMatchEstimationInfo.prototype.getPlayTime = function () {
    return this.liveCount * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
ScoreMatchEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
ScoreMatchEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#scoremResultLiveCount"), this.liveCount);
    $("#scoremResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#scoremResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var showSleepWarning = false;

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#scoremResultRefills"), this.lpRecoveryInfo.lovecaUses);
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#scoremResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" + this.lpRecoveryInfo.finalRankExp + "/" +
                                         Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank) + " EXP)");
        $("#scoremResultLoveca").text(this.lpRecoveryInfo.lovecaUses);
        $("#scoremResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#scoremResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
        $("#scoremResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
    } else {
        Results.setBigResult($("#scoremResultRefills"), "---");
        $("#scoremResultFinalRank").text("---");
        $("#scoremResultLoveca").text("---");
        $("#scoremResultSugarPots50").text("---");
        $("#scoremResultSugarPots100").text("---");
        $("#scoremResultSugarCubes").text("---");
    }

    Results.show($("#scoremResult"), showSleepWarning);
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
ScoreMatchData.prototype.validate = function () {
    var errors = [];

    if (this.scoremRegion != "en" && this.scoremRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    var liveInfo = this.createLiveInfo();
    if (null === liveInfo) {
        errors.push("Live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.scoremCurrentRank)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
                    ") that's higher than your max LP (" + Common.getMaxLp(this.scoremCurrentRank) + ")");
    }

    if (0 >= this.scoremTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
                    "Please change the event point target in order to calculate again");
    }

    if (0 > this.scoremCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.scoremCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.scoremCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.scoremCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.scoremTimerMethodAuto && this.scoremTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.scoremTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.scoremTimerMethodManual) {
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
 * Event point reward multiplier for each possible score rank in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var SCOREM_SCORE_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.2,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible position in a match.
 * @constant
 * @type {Object.<string, number>}
 */
var SCOREM_POSITION_RATE = {
    "P1": 1.25,
    "P2": 1.15,
    "P3": 1.05,
    "P4": 1,
    "AVERAGE": 1.1125,
    "ERROR": 0
};

/**
 * Amount of base event point rewards for clearing each difficulty.
 * @constant
 * @type {number[]}
 */
var SCOREM_BASE_EVENT_POINTS = [];
SCOREM_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EASY] = 42;
SCOREM_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.NORMAL] = 100;
SCOREM_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD] = 177;
SCOREM_BASE_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EX] = 357;