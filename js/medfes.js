/**
 * @file Medley Festival calculator.
 */

/**
 * An object used to store input values for the Medley Festival calculator.
 * @class MedFesData
 * @property {boolean} medfesTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} medfesRegion - Which server to use for the Automatic Timer and event rewards.
 * @property {boolean} medfesTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} medfesManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} medfesLiveDifficulty - The difficulty medleys are played on.
 * @property {number} medfesLiveSongs - The amount of songs the player plays per medley.
 * @property {rank} medfesLiveScore - Which score rank the player clears medleys with.
 * @property {rank} medfesLiveCombo - Which combo rank the player clears medleys with.
 * @property {number} medfesLiveMultiplier - Which multiplier the player plays lives on.
 * @property {boolean} medfesArrangeRewardsUp - Whether medleys are played with the Gold/Silver Reward Boost.
 * @property {boolean} medfesArrangePerfectSupport - Whether medleys are played with Perfect Support.
 * @property {boolean} medfesArrangeExpUp - Whether medleys are played with the EXP Boost.
 * @property {boolean} medfesArrangeScoreUp - Whether medleys are played with the Score Boost.
 * @property {boolean} medfesArrangeSkillRateUp - Whether medleys are played with the Skill Trigger Rate Boost.
 * @property {boolean} medfesArrangeEventPointUp - Whether medleys are played with the Event Point Boost.
 * @property {boolean} medfesArrangeRecovery - Whether medleys are played with Stamina Recovery.
 * @property {boolean} medfesArrangeAlwaysCheer - Whether medleys are played with guaranteed friend cheers.
 * @property {number} medfesTargetEventPoints - The desired final amount of event points.
 * @property {number} medfesCurrentEventPoints - The current amount of event points.
 * @property {number} medfesCurrentRank - The player's current rank.
 * @property {number} medfesCurrentLP - The player's current LP.
 * @property {number} medfesCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function MedFesData() {
    this.medfesTimerMethodAuto = false;
    this.medfesRegion = "en";
    this.medfesTimerMethodManual = false;
    this.medfesManualRestTimeInHours = 0;
    this.medfesLiveDifficulty = "EASY";
    this.medfesLiveSongs = 0;
    this.medfesLiveScore = "N";
    this.medfesLiveCombo = "N";
    this.medfesLiveMultiplier = 0;
    this.medfesArrangeRewardsUp = false;
    this.medfesArrangePerfectSupport = false;
    this.medfesArrangeExpUp = false;
    this.medfesArrangeScoreUp = false;
    this.medfesArrangeSkillRateUp = false;
    this.medfesArrangeEventPointUp = false;
    this.medfesArrangeRecovery = false;
    this.medfesArrangeAlwaysCheer = false;
    this.medfesTargetEventPoints = 0;
    this.medfesCurrentEventPoints = 0;
    this.medfesCurrentRank = 0;
    this.medfesCurrentLP = 0;
    this.medfesCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a medley.
 * @class MedFesLiveInfo
 * @property {number} lp - LP cost for one medley.
 * @property {number} point - Event point reward for one medley.
 * @property {number} exp - EXP reward for one medley.
 * @property {number} gold - G cost for one medley.
 * @constructor
 */
function MedFesLiveInfo(lp, point, exp, gold) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
    this.gold = gold;
}

/**
 * A class serving static calculation methods handling MedFesData objects.
 * @class MedFesEstimator
 * @constructor
 */
function MedFesEstimator() {
}

/**
 * An object storing the result of the calculation for MedFesData objects.
 * @class MedFesEstimationInfo
 * @property {number} fesCount - Amount of medleys to play.
 * @property {number} songs - Total amount of songs played.
 * @property {number} gold - Total G cost.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function MedFesEstimationInfo(fesCount, songs, gold, lpRecoveryInfo, restTime) {
    this.fesCount = fesCount;
    this.songs = songs;
    this.gold = gold;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
MedFesData.prototype.readFromUi = function () {
    this.medfesTimerMethodAuto = $("#medfesTimerMethodAuto").prop("checked");
    this.medfesRegion = $("input:radio[name=medfesRegion]:checked").val();
    this.medfesTimerMethodManual = $("#medfesTimerMethodManual").prop("checked");
    this.medfesManualRestTimeInHours = ReadHelpers.toNum($("#medfesManualRestTime").val());
    this.medfesLiveDifficulty = $("input:radio[name=medfesLiveDifficulty]:checked").val();
    this.medfesLiveSongs = ReadHelpers.toNum($("input:radio[name=medfesLiveSongs]:checked").val());
    this.medfesLiveScore = $("input:radio[name=medfesLiveScore]:checked").val();
    this.medfesLiveCombo = $("input:radio[name=medfesLiveCombo]:checked").val();
    this.medfesLiveMultiplier = $("input:radio[name=medfesLiveMultiplier]:checked").val();
    this.medfesArrangeRewardsUp = $("#medfesArrangeRewardsUp").prop("checked");
    this.medfesArrangePerfectSupport = $("#medfesArrangePerfectSupport").prop("checked");
    this.medfesArrangeExpUp = $("#medfesArrangeExpUp").prop("checked");
    this.medfesArrangeScoreUp = $("#medfesArrangeScoreUp").prop("checked");
    this.medfesArrangeSkillRateUp = $("#medfesArrangeSkillRateUp").prop("checked");
    this.medfesArrangeEventPointUp = $("#medfesArrangeEventPointUp").prop("checked");
    this.medfesArrangeRecovery = $("#medfesArrangeRecovery").prop("checked");
    this.medfesArrangeAlwaysCheer = $("#medfesArrangeAlwaysCheer").prop("checked");
    this.medfesTargetEventPoints = ReadHelpers.toNum($("#medfesTargetEventPoints").val());
    this.medfesCurrentEventPoints = ReadHelpers.toNum($("#medfesCurrentEventPoints").val());
    this.medfesCurrentRank = ReadHelpers.toNum($("#medfesCurrentRank").val());
    this.medfesCurrentLP = ReadHelpers.toNum($("#medfesCurrentLP").val(), 0);
    this.medfesCurrentEXP = ReadHelpers.toNum($("#medfesCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {MedFesData} savedData The saved data to recall values from.
 */
MedFesData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#medfesTimerMethodAuto"), savedData.medfesTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesRegion]"), savedData.medfesRegion);
    if (savedData.medfesRegion !== undefined) {
        updateTimerSection("medfes");
    }
    var manualButton = $("#medfesTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.medfesTimerMethodManual);
    if (savedData.medfesTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#medfesManualRestTime"), savedData.medfesManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesLiveDifficulty]"), savedData.medfesLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesLiveSongs]"), savedData.medfesLiveSongs);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesLiveScore]"), savedData.medfesLiveScore);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesLiveCombo]"), savedData.medfesLiveCombo);
    SetHelpers.radioButtonHelper($("input:radio[name=medfesLiveMultiplier]"), savedData.medfesLiveMultiplier);
    SetHelpers.checkBoxHelper($("#medfesArrangeRewardsUp"), savedData.medfesArrangeRewardsUp);
    SetHelpers.checkBoxHelper($("#medfesArrangePerfectSupport"), savedData.medfesArrangePerfectSupport);
    SetHelpers.checkBoxHelper($("#medfesArrangeExpUp"), savedData.medfesArrangeExpUp);
    SetHelpers.checkBoxHelper($("#medfesArrangeScoreUp"), savedData.medfesArrangeScoreUp);
    SetHelpers.checkBoxHelper($("#medfesArrangeSkillRateUp"), savedData.medfesArrangeSkillRateUp);
    SetHelpers.checkBoxHelper($("#medfesArrangeEventPointUp"), savedData.medfesArrangeEventPointUp);
    SetHelpers.checkBoxHelper($("#medfesArrangeRecovery"), savedData.medfesArrangeRecovery);
    SetHelpers.checkBoxHelper($("#medfesArrangeAlwaysCheer"), savedData.medfesArrangeAlwaysCheer);
    updateArrangeCount("medfes");
    SetHelpers.inputHelper($("#medfesTargetEventPoints"), savedData.medfesTargetEventPoints);
    SetHelpers.inputHelper($("#medfesCurrentEventPoints"), savedData.medfesCurrentEventPoints);
    SetHelpers.inputHelper($("#medfesCurrentRank"), savedData.medfesCurrentRank);
    SetHelpers.inputHelper($("#medfesCurrentLP"), savedData.medfesCurrentLP);
    SetHelpers.inputHelper($("#medfesCurrentEXP"), savedData.medfesCurrentEXP);
    if (savedData.medfesCurrentLP > 0 || savedData.medfesCurrentEXP > 0) {
        $("#medfesCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
MedFesData.prototype.alert = function () {
    alert("medfesTimerMethodAuto: " + this.medfesTimerMethodAuto + "\n" +
          "medfesTimerMethodManual: " + this.medfesTimerMethodManual + "\n" +
          "medfesManualRestTimeInHours: " + this.medfesManualRestTimeInHours + "\n" +
          "medfesLiveDifficulty: " + this.medfesLiveDifficulty + "\n" +
          "medfesLiveSongs: " + this.medfesLiveSongs + "\n" +
          "medfesLiveScore: " + this.medfesLiveScore + "\n" +
          "medfesLiveCombo: " + this.medfesLiveCombo + "\n" +
          "medfesLiveMultiplier: " + this.medfesLiveMultiplier + "\n" +
          "medfesArrangeRewardsUp: " + this.medfesArrangeRewardsUp + "\n" +
          "medfesArrangePerfectSupport: " + this.medfesArrangePerfectSupport + "\n" +
          "medfesArrangeExpUp: " + this.medfesArrangeExpUp + "\n" +
          "medfesArrangeScoreUp: " + this.medfesArrangeScoreUp + "\n" +
          "medfesArrangeSkillRateUp: " + this.medfesArrangeSkillRateUp + "\n" +
          "medfesArrangeEventPointUp: " + this.medfesArrangeEventPointUp + "\n" +
          "medfesArrangeRecovery: " + this.medfesArrangeRecovery + "\n" +
          "medfesArrangeAlwaysCheer: " + this.medfesArrangeAlwaysCheer + "\n" +
          "medfesTargetEventPoints: " + this.medfesTargetEventPoints + "\n" +
          "medfesCurrentEventPoints: " + this.medfesCurrentEventPoints + "\n" +
          "medfesCurrentRank: " + this.medfesCurrentRank + "\n" +
          "medfesCurrentLP: " + this.medfesCurrentLP + "\n" +
          "medfesCurrentEXP: " + this.medfesCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
MedFesData.prototype.getRestTimeInMinutes = function () {
    if (this.medfesTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.medfesRegion);
    }
    if (this.medfesTimerMethodManual) {
        return 60 * this.medfesManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
MedFesData.prototype.getEventPointsLeft = function () {
    return this.medfesTargetEventPoints - this.medfesCurrentEventPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
MedFesData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.medfesLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted live score rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link MEDFES_SCORE_RATE}.ERROR if the input is invalid.
 */
MedFesData.prototype.getLiveScoreRate = function () {
    var scoreRate = MEDFES_SCORE_RATE[this.medfesLiveScore];
    if (undefined !== scoreRate) return scoreRate;
    return MEDFES_SCORE_RATE.ERROR;
};

/**
 * Get an index associated with the inputted live combo rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link MEDFES_COMBO_RATE}.ERROR if the input is invalid.
 */
MedFesData.prototype.getLiveComboRate = function () {
    var comboRate = MEDFES_COMBO_RATE[this.medfesLiveCombo];
    if (undefined !== comboRate) return comboRate;
    return MEDFES_COMBO_RATE.ERROR;
};

/**
 * Get the number of songs per medley for lookup in the base points array and as a multiplier.
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveSongAmount = function () {
    var songCount = this.medfesLiveSongs;
    if (songCount >= 1) return songCount;
    return 0;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveMultiplier = function () {
    var multiplier = this.medfesLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Get the base points for the inputted live difficulty and amount of songs.
 * @returns {number} The base points for the given difficulty and song count, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveBasePoints = function () {
    var diffId = this.getLiveDifficulty(),
        songCount = this.getLiveSongAmount();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songCount === 0) {
        return 0;
    }
    return MEDFES_BASE_EVENT_POINTS[diffId][songCount];
};

/**
 * Get the total event point reward per medley, combining base points with arrangement, score and combo bonuses.
 * @returns {number} The event points gained from one medley, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveTotalPoints = function () {
    var basePoints = this.getLiveBasePoints(),
        scoreRate = this.getLiveScoreRate(),
        comboRate = this.getLiveComboRate(),
        arrangeBoost = this.medfesArrangeEventPointUp ? MEDFES_ARRANGE_EVENT_POINT_UP_RATE : 1;
    return Math.round(basePoints * scoreRate * comboRate * arrangeBoost);
};

/**
 * Get the total EXP reward per medley, combining the regular EXP reward with the song count and arrangement bonus.
 * @returns {number} The EXP gained from one medley, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveExpReward = function () {
    var diffId = this.getLiveDifficulty(),
        songCount = this.getLiveSongAmount();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songCount === 0) {
        return 0;
    }
    var arrangeBoost = this.medfesArrangeExpUp ? MEDFES_ARRANGE_EXP_UP_RATE : 1;
    return Math.round(COMMON_EXP_REWARD[diffId] * arrangeBoost * songCount);
};

/**
 * Get the total LP cost per medley, combining the regular LP cost with the song count.
 * @returns {number} The LP used for one medley, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveLpCost = function () {
    var diffId = this.getLiveDifficulty(),
        songCount = this.getLiveSongAmount();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songCount === 0) {
        return 0;
    }
    return COMMON_LP_COST[diffId] * MEDFES_LP_REDUCTION * songCount;
};

/**
 * Get the total G cost per medley, adding up the G cost for all chosen arrangement bonuses
 * @returns {number} The G used for one medley, or 0 if the input is invalid.
 */
MedFesData.prototype.getLiveGoldCost = function () {
    var goldTotal = 0;
    if (this.medfesArrangeRewardsUp) goldTotal += 100000;
    if (this.medfesArrangePerfectSupport) goldTotal += 50000;
    if (this.medfesArrangeExpUp) goldTotal += 30000;
    if (this.medfesArrangeScoreUp) goldTotal += 25000;
    if (this.medfesArrangeSkillRateUp) goldTotal += 25000;
    if (this.medfesArrangeEventPointUp) goldTotal += 10000;
    if (this.medfesArrangeRecovery) goldTotal += 5000;
    if (this.medfesArrangeAlwaysCheer) goldTotal += 50000;
    return goldTotal;
};

/**
 * Creates a {@link MedFesLiveInfo} object using the live input values, representing one play.
 * @returns {?MedFesLiveInfo} A new object with all properties set, or null if the live inputs are invalid.
 */
MedFesData.prototype.createLiveInfo = function () {
    var lpCost = this.getLiveLpCost(),
        eventPoints = this.getLiveTotalPoints(),
        expReward = this.getLiveExpReward(),
        goldCost = this.getLiveGoldCost(),
        multiplier = this.getLiveMultiplier();
    if (0 === lpCost || 0 === eventPoints || 0 === expReward || 0 === multiplier) {
        return null;
    }
    return new MedFesLiveInfo(lpCost * multiplier, eventPoints * multiplier, expReward * multiplier, goldCost);
};

/**
 * Call {@link MedFesEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link MedFesData.validate}.
 * @returns {MedFesEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
MedFesData.prototype.estimate = function () {
    return MedFesEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(), this.getRestTimeInMinutes(),
        this.medfesCurrentRank, this.medfesCurrentEXP, this.getLiveSongAmount(), this.medfesCurrentLP);
};

/**
 * Start calculation for a Medley Festival. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of medleys to play to reach the point goal.</li>
 * <li>2) Calculate total amount of LP needed to play all of these.</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {MedFesLiveInfo} liveInfo Cost and reward info about one medley play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} songAmount The amount of songs per medley.
 * @param {number} playerLp The player's initial LP.
 * @returns {MedFesEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
MedFesEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, songAmount, playerLp) {
    var liveCount = Math.ceil(eventPointsLeft / liveInfo.point),
        totalGoldCost = liveInfo.gold * liveCount;
    if (liveCount * COMMON_LIVE_TIME_IN_MINUTES * songAmount > timeLeft) {
        return new MedFesEstimationInfo(liveCount, songAmount, totalGoldCost, null, timeLeft);
    }
    var recoveryInfo = Common.calculateLpRecoveryInfo(playerRank, liveInfo.exp * liveCount, playerExp, liveInfo.lp *
                                                                                                       liveCount,
        playerLp, timeLeft);
    return new MedFesEstimationInfo(liveCount, songAmount, totalGoldCost, recoveryInfo, timeLeft);
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
MedFesEstimationInfo.prototype.getPlayTime = function () {
    return this.fesCount * this.songs * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
MedFesEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
MedFesEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#medfesResultLiveCount"), this.fesCount);
    $("#medfesResultGoldUsed").text(Common.goldToString(this.gold));
    $("#medfesResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#medfesResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var showSleepWarning = false;

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#medfesResultRefills"), this.lpRecoveryInfo.lovecaUses);
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#medfesResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" + this.lpRecoveryInfo.finalRankExp + "/" +
                                         Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank) + " EXP)");
        $("#medfesResultLoveca").text(this.lpRecoveryInfo.lovecaUses);
        $("#medfesResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#medfesResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
        $("#medfesResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
    } else {
        Results.setBigResult($("#medfesResultRefills"), "---");
        $("#medfesResultFinalRank").text("---");
        $("#medfesResultLoveca").text("---");
        $("#medfesResultSugarPots50").text("---");
        $("#medfesResultSugarPots100").text("---");
        $("#medfesResultSugarCubes").text("---");
    }

    Results.show($("#medfesResult"), showSleepWarning);
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
MedFesData.prototype.validate = function () {
    var errors = [];

    if (this.medfesRegion != "en" && this.medfesRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    var liveInfo = this.createLiveInfo();
    if (null === liveInfo) {
        errors.push("Live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.medfesCurrentRank)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
                    ") that's higher than your max LP (" + Common.getMaxLp(this.medfesCurrentRank) + ")");
    }

    if (0 === this.medfesTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
                    "Please change the event point target in order to calculate again");
    }

    if (0 > this.medfesCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.medfesCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.medfesCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.medfesCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.medfesTimerMethodAuto && this.medfesTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.medfesTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.medfesTimerMethodManual) {
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
 * Event point reward multiplier for each possible score rank in a medley.
 * @constant
 * @type {Object.<string, number>}
 */
var MEDFES_SCORE_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.2,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible combo rank in a medley.
 * @constant
 * @type {Object.<string, number>}
 */
var MEDFES_COMBO_RATE = {
    "N": 1,
    "C": 1.02,
    "B": 1.04,
    "A": 1.06,
    "S": 1.08,
    "ERROR": 0
};

/**
 * Base point tables for medleys - first dimension is difficulty, second is amount of songs.
 * @constant
 * @type {number[][]}
 */
var MEDFES_BASE_EVENT_POINTS = [
    [0, 31, 64, 99],
    [0, 72, 150, 234],
    [0, 126, 262, 408],
    [0, 241, 500, 777]
];

/**
 * The multiplier by which LP cost is reduced for medleys.
 * @constant
 * @type {number}
 * @default
 */
var MEDFES_LP_REDUCTION = 0.8;

/**
 * The multiplier by which event point rewards are increased when using the respective arrangement bonus.
 * @constant
 * @type {number}
 * @default
 */
var MEDFES_ARRANGE_EVENT_POINT_UP_RATE = 1.1;

/**
 * The multiplier by which EXP rewards are increased when using the respective arrangement bonus.
 * @constant
 * @type {number}
 * @default
 */
var MEDFES_ARRANGE_EXP_UP_RATE = 1.1;