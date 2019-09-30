/**
 * @file Challenge Festival calculator.
 */

/**
 * An object used to store input values for the Challenge Festival calculator.
 * @class ChaFesData
 * @property {boolean} chafesTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} chafesTimerRegion - Which server to use for the Automatic Timer.
 * @property {boolean} chafesTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} chafesManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} chafesLiveDifficulty - The difficulty challenges are played on.
 * @property {number} chafesLiveSongs - The amount of songs the player plays per challenge.
 * @property {rank} chafesLiveScore - Which score rank the player clears challenges with.
 * @property {rank} chafesLiveCombo - Which combo rank the player clears challenges with.
 * @property {number} chafesLiveMultiplier - Which multiplier the player plays lives on.
 * @property {chafes_mult_use} chafesLiveMultiplierUse - Which songs the player actually uses the multiplier on.
 * @property {boolean} chafesArrangeRewardsUp - Whether challenges are played with the Gold/Silver Reward Boost.
 * @property {boolean} chafesArrangePerfectSupport - Whether challenges are played with Perfect Support.
 * @property {boolean} chafesArrangeExpUp - Whether challenges are played with the EXP Boost.
 * @property {boolean} chafesArrangeScoreUp - Whether challenges are played with the Score Boost.
 * @property {boolean} chafesArrangeSkillRateUp - Whether challenges are played with the Skill Trigger Rate Boost.
 * @property {boolean} chafesArrangeEventPointUp - Whether challenges are played with the Event Point Boost.
 * @property {number} chafesTargetEventPoints - The desired final amount of event points.
 * @property {number} chafesCurrentEventPoints - The current amount of event points.
 * @property {number} chafesCurrentRank - The player's current rank.
 * @property {number} chafesCurrentLP - The player's current LP.
 * @property {number} chafesCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function ChaFesData() {
    this.chafesTimerMethodAuto = false;
    this.chafesTimerRegion = "en";
    this.chafesTimerMethodManual = false;
    this.chafesManualRestTimeInHours = 0;
    this.chafesLiveDifficulty = "EASY";
    this.chafesLiveSongs = 0;
    this.chafesLiveScore = "N";
    this.chafesLiveCombo = "N";
    this.chafesLiveMultiplier = 1;
    this.chafesLiveMultiplierUse = "ALL";
    this.chafesArrangeRewardsUp = false;
    this.chafesArrangePerfectSupport = false;
    this.chafesArrangeExpUp = false;
    this.chafesArrangeScoreUp = false;
    this.chafesArrangeSkillRateUp = false;
    this.chafesArrangeEventPointUp = false;
    this.chafesTargetEventPoints = 0;
    this.chafesCurrentEventPoints = 0;
    this.chafesCurrentRank = 0;
    this.chafesCurrentLP = 0;
    this.chafesCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a challenge.
 * @class ChaFesLiveInfo
 * @property {number} lp - Total LP cost for all songs in one challenge.
 * @property {number} point - Event point reward for one challenge.
 * @property {number} exp - EXP reward for one challenge.
 * @property {number} gold - Total G cost for all songs in one challenge.
 * @constructor
 */
function ChaFesLiveInfo(lp, point, exp, gold) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
    this.gold = gold;
}

/**
 * A class serving static calculation methods handling ChaFesData objects.
 * @class ChaFesEstimator
 * @constructor
 */
function ChaFesEstimator() {
}

/**
 * An object storing the result of the calculation for ChaFesData objects.
 * @class ChaFesEstimationInfo
 * @property {number} fesCount - Amount of challenges to play.
 * @property {number} songs - Total amount of songs played.
 * @property {number} gold - Total G cost for all songs in all challenges.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function ChaFesEstimationInfo(fesCount, songs, gold, lpRecoveryInfo, restTime) {
    this.fesCount = fesCount;
    this.songs = songs;
    this.gold = gold;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
ChaFesData.prototype.readFromUi = function () {
    this.chafesTimerMethodAuto = $("#chafesTimerMethodAuto").prop("checked");
    this.chafesTimerRegion = $("input:radio[name=chafesTimerRegion]:checked").val();
    this.chafesTimerMethodManual = $("#chafesTimerMethodManual").prop("checked");
    this.chafesManualRestTimeInHours = ReadHelpers.toNum($("#chafesManualRestTime").val());
    this.chafesLiveDifficulty = $("input:radio[name=chafesLiveDifficulty]:checked").val();
    this.chafesLiveSongs = ReadHelpers.toNum($("input:radio[name=chafesLiveSongs]:checked").val());
    this.chafesLiveScore = $("input:radio[name=chafesLiveScore]:checked").val();
    this.chafesLiveCombo = $("input:radio[name=chafesLiveCombo]:checked").val();
    this.chafesLiveMultiplier = $("input:radio[name=chafesLiveMultiplier]:checked").val();
    this.chafesLiveMultiplierUse = $("input:radio[name=chafesLiveMultiplierUse]:checked").val();
    this.chafesArrangeRewardsUp = $("#chafesArrangeRewardsUp").prop("checked");
    this.chafesArrangePerfectSupport = $("#chafesArrangePerfectSupport").prop("checked");
    this.chafesArrangeExpUp = $("#chafesArrangeExpUp").prop("checked");
    this.chafesArrangeScoreUp = $("#chafesArrangeScoreUp").prop("checked");
    this.chafesArrangeSkillRateUp = $("#chafesArrangeSkillRateUp").prop("checked");
    this.chafesArrangeEventPointUp = $("#chafesArrangeEventPointUp").prop("checked");
    this.chafesTargetEventPoints = ReadHelpers.toNum($("#chafesTargetEventPoints").val());
    this.chafesCurrentEventPoints = ReadHelpers.toNum($("#chafesCurrentEventPoints").val());
    this.chafesCurrentRank = ReadHelpers.toNum($("#chafesCurrentRank").val());
    this.chafesCurrentLP = ReadHelpers.toNum($("#chafesCurrentLP").val(), 0);
    this.chafesCurrentEXP = ReadHelpers.toNum($("#chafesCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {ChaFesData} savedData The saved data to recall values from.
 */
ChaFesData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#chafesTimerMethodAuto"), savedData.chafesTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesTimerRegion]"), savedData.chafesTimerRegion);
    if (savedData.chafesTimerRegion !== undefined) {
        updateAutoTimerSection("chafes");
    }
    var manualButton = $("#chafesTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.chafesTimerMethodManual);
    if (savedData.chafesTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#chafesManualRestTime"), savedData.chafesManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveDifficulty]"), savedData.chafesLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveSongs]"), savedData.chafesLiveSongs);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveScore]"), savedData.chafesLiveScore);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveCombo]"), savedData.chafesLiveCombo);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveMultiplier]"), savedData.chafesLiveMultiplier);
    SetHelpers.radioButtonHelper($("input:radio[name=chafesLiveMultiplierUse]"), savedData.chafesLiveMultiplierUse);
    SetHelpers.checkBoxHelper($("#chafesArrangeRewardsUp"), savedData.chafesArrangeRewardsUp);
    SetHelpers.checkBoxHelper($("#chafesArrangePerfectSupport"), savedData.chafesArrangePerfectSupport);
    SetHelpers.checkBoxHelper($("#chafesArrangeExpUp"), savedData.chafesArrangeExpUp);
    SetHelpers.checkBoxHelper($("#chafesArrangeScoreUp"), savedData.chafesArrangeScoreUp);
    SetHelpers.checkBoxHelper($("#chafesArrangeSkillRateUp"), savedData.chafesArrangeSkillRateUp);
    SetHelpers.checkBoxHelper($("#chafesArrangeEventPointUp"), savedData.chafesArrangeEventPointUp);
    updateArrangeCount("chafes");
    SetHelpers.inputHelper($("#chafesTargetEventPoints"), savedData.chafesTargetEventPoints);
    SetHelpers.inputHelper($("#chafesCurrentEventPoints"), savedData.chafesCurrentEventPoints);
    SetHelpers.inputHelper($("#chafesCurrentRank"), savedData.chafesCurrentRank);
    SetHelpers.inputHelper($("#chafesCurrentLP"), savedData.chafesCurrentLP);
    SetHelpers.inputHelper($("#chafesCurrentEXP"), savedData.chafesCurrentEXP);
    if (savedData.chafesCurrentLP > 0 || savedData.chafesCurrentEXP > 0) {
        $("#chafesCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
ChaFesData.prototype.alert = function () {
    alert("chafesTimerMethodAuto: " + this.chafesTimerMethodAuto + "\n" +
          "chafesTimerMethodManual: " + this.chafesTimerMethodManual + "\n" +
          "chafesManualRestTimeInHours: " + this.chafesManualRestTimeInHours + "\n" +
          "chafesLiveDifficulty: " + this.chafesLiveDifficulty + "\n" +
          "chafesLiveSongs: " + this.chafesLiveSongs + "\n" +
          "chafesLiveScore: " + this.chafesLiveScore + "\n" +
          "chafesLiveCombo: " + this.chafesLiveCombo + "\n" +
          "chafesLiveMultiplier: " + this.chafesLiveMultiplier + "\n" +
          "chafesLiveMultiplierUse: " + this.chafesLiveMultiplierUse + "\n" +
          "chafesArrangeRewardsUp: " + this.chafesArrangeRewardsUp + "\n" +
          "chafesArrangePerfectSupport: " + this.chafesArrangePerfectSupport + "\n" +
          "chafesArrangeExpUp: " + this.chafesArrangeExpUp + "\n" +
          "chafesArrangeScoreUp: " + this.chafesArrangeScoreUp + "\n" +
          "chafesArrangeSkillRateUp: " + this.chafesArrangeSkillRateUp + "\n" +
          "chafesArrangeEventPointUp: " + this.chafesArrangeEventPointUp + "\n" +
          "chafesTargetEventPoints: " + this.chafesTargetEventPoints + "\n" +
          "chafesCurrentEventPoints: " + this.chafesCurrentEventPoints + "\n" +
          "chafesCurrentRank: " + this.chafesCurrentRank + "\n" +
          "chafesCurrentLP: " + this.chafesCurrentLP + "\n" +
          "chafesCurrentEXP: " + this.chafesCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
ChaFesData.prototype.getRestTimeInMinutes = function () {
    if (this.chafesTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.chafesTimerRegion);
    }
    if (this.chafesTimerMethodManual) {
        return 60 * this.chafesManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
ChaFesData.prototype.getEventPointsLeft = function () {
    return this.chafesTargetEventPoints - this.chafesCurrentEventPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
ChaFesData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.chafesLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted live score rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link CHAFES_SCORE_RATE}.ERROR if the input is invalid.
 */
ChaFesData.prototype.getLiveScoreRate = function () {
    var scoreRate = CHAFES_SCORE_RATE[this.chafesLiveScore];
    if (undefined !== scoreRate) return scoreRate;
    return CHAFES_SCORE_RATE.ERROR;
};

/**
 * Get an index associated with the inputted live combo rank for lookup in the point multiplier arrays.
 * @returns {number} An index for array lookup, or {@link CHAFES_COMBO_RATE}.ERROR if the input is invalid.
 */
ChaFesData.prototype.getLiveComboRate = function () {
    var comboRate = CHAFES_COMBO_RATE[this.chafesLiveCombo];
    if (undefined !== comboRate) return comboRate;
    return CHAFES_COMBO_RATE.ERROR;
};

/**
 * Get the number of songs per challenge for lookup in the base points array and as a multiplier.
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveSongAmount = function () {
    var songCount = this.chafesLiveSongs;
    if (songCount >= 1) return songCount;
    return 0;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveMultiplier = function () {
    var multiplier = this.chafesLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Get the base points for the inputted live difficulty and the given song number.
 * @param {number} songNum Which song to get base points for.
 * @returns {number} The base points for the given difficulty and the song in position songNum, or 0 if the input is
 *     invalid.
 */
ChaFesData.prototype.getSingleLiveBasePoints = function (songNum) {
    var diffId = this.getLiveDifficulty();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songNum === 0) {
        return 0;
    }
    return CHAFES_BASE_EVENT_POINTS[diffId][songNum];
};

/**
 * Get the event point reward for one song, combining base points with arrangement, score and combo bonuses.
 * @param {number} songNum Which song to calculate EXP reward for.
 * @returns {number} The event points gained from the song in position songNum, or 0 if the input is invalid.
 */
ChaFesData.prototype.getSingleLiveTotalPoints = function (songNum) {
    var scoreRate = this.getLiveScoreRate(),
        comboRate = this.getLiveComboRate(),
        arrangeBoost = this.chafesArrangeEventPointUp ? CHAFES_ARRANGE_EVENT_POINT_UP_RATE : 1;
    if (scoreRate == CHAFES_SCORE_RATE.ERROR || comboRate == CHAFES_COMBO_RATE.ERROR || songNum === 0) {
        return 0;
    }
    return Math.round(this.getSingleLiveBasePoints(songNum) * scoreRate * comboRate * arrangeBoost);
};

/**
 * Get the total event point reward per challenge, combining all base points with arrangement, score and combo bonuses.
 * @returns {number} The event points gained from one challenge, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveTotalPoints = function () {
    var songCount = this.getLiveSongAmount();
    if (songCount === 0) {
        return 0;
    }

    var epSum = 0;
    for (var songNum = 1; songNum <= songCount; songNum++) {
        epSum += this.getSingleLiveTotalPoints(songNum);
    }
    return epSum;
};

/**
 * Get the EXP reward for a single song, by looking up the difference in the table and adding the arrangement bonus.
 * @param {number} songNum Which song to calculate EXP reward for.
 * @returns {number} The EXP gained from the song in position songNum, or 0 if the input is invalid.
 */
ChaFesData.prototype.getSingleLiveExpReward = function (songNum) {
    var diffId = this.getLiveDifficulty();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songNum === 0) {
        return 0;
    }
    var arrangeBoost = this.chafesArrangeExpUp ? CHAFES_ARRANGE_EXP_UP_RATE : 1;
    return Math.round(CHAFES_BASE_EXP[diffId][songNum] * arrangeBoost);
};

/**
 * Get the total EXP reward per challenge, looking it up in the table and adding the arrangement bonus.
 * @returns {number} The total EXP gained from one challenge, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveExpReward = function () {
    var songCount = this.getLiveSongAmount();
    if (songCount === 0) {
        return 0;
    }
    var expSum = 0;
    for (var songNum = 1; songNum <= songCount; songNum++) {
        expSum += this.getSingleLiveExpReward(songNum);
    }
    return expSum;
};

/**
 * Get the total LP cost per challenge, combining the regular LP cost with the song count.
 * @returns {number} The LP used for one challenge, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveLpCost = function () {
    var diffId = this.getLiveDifficulty(),
        songCount = this.getLiveSongAmount();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || songCount === 0) {
        return 0;
    }
    return COMMON_LP_COST[diffId] * songCount;
};

/**
 * Get the LP cost for a single song.
 * @returns {number} The LP used for one song, or 0 if the input is invalid.
 */
ChaFesData.prototype.getSingleLiveLpCost = function () {
    var diffId = this.getLiveDifficulty();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR) {
        return 0;
    }
    return COMMON_LP_COST[diffId];
};

/**
 * Get the total G cost per challenge, adding up the G cost for all chosen arrangement bonuses
 * @returns {number} The G used for one challenge, or 0 if the input is invalid.
 */
ChaFesData.prototype.getLiveGoldCost = function () {
    var goldTotal = 0;
    if (this.chafesArrangeRewardsUp) goldTotal += 50000;
    if (this.chafesArrangePerfectSupport) goldTotal += 25000;
    if (this.chafesArrangeExpUp) goldTotal += 15000;
    if (this.chafesArrangeScoreUp) goldTotal += 12500;
    if (this.chafesArrangeSkillRateUp) goldTotal += 12500;
    if (this.chafesArrangeEventPointUp) goldTotal += 5000;
    return goldTotal * this.getLiveSongAmount();
};

/**
 * Creates a {@link ChaFesLiveInfo} object using the live input values, representing one play.
 * @returns {?ChaFesLiveInfo} A new object with all properties set, or null if the live inputs are invalid.
 */
ChaFesData.prototype.createLiveInfo = function () {
    var lpCost = this.getLiveLpCost(),
        eventPoints = this.getLiveTotalPoints(),
        expReward = this.getLiveExpReward(),
        goldCost = this.getLiveGoldCost(),
        multiplier = this.getLiveMultiplier(),
        multUse = this.chafesLiveMultiplierUse,
        songCount = this.getLiveSongAmount();
    if (0 === lpCost || 0 === eventPoints || 0 === expReward || 0 === multiplier || undefined === multUse) {
        return null;
    }
    if (multiplier > 1) {
        if (multUse === "ALL") {
            lpCost *= multiplier;
            eventPoints *= multiplier;
            expReward *= multiplier;
        } else if (multUse === "LAST") {
            var multBonus = multiplier - 1;
            lpCost += multBonus * this.getSingleLiveLpCost();
            eventPoints += multBonus * this.getSingleLiveTotalPoints(songCount);
            expReward += multBonus * this.getSingleLiveExpReward(songCount);
        }
    }
    return new ChaFesLiveInfo(lpCost, eventPoints, expReward, goldCost);
};

/**
 * Call {@link ChaFesEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link ChaFesData.validate}.
 * @returns {ChaFesEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ChaFesData.prototype.estimate = function () {
    return ChaFesEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(), this.getRestTimeInMinutes(),
        this.chafesCurrentRank, this.chafesCurrentEXP, this.getLiveSongAmount(), this.chafesCurrentLP);
};

/**
 * Start calculation for a Challenge Festival. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of challenges to play to reach the point goal.</li>
 * <li>2) Calculate total amount of LP needed to play all of these.</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {ChaFesLiveInfo} liveInfo Cost and reward info about one challenge play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} songAmount The amount of songs per medley.
 * @param {number} playerLp The player's initial LP.
 * @returns {ChaFesEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ChaFesEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, songAmount, playerLp) {
    var liveCount = Math.ceil(eventPointsLeft / liveInfo.point),
        totalGoldCost = liveInfo.gold * liveCount;
    if (liveCount * COMMON_LIVE_TIME_IN_MINUTES * songAmount > timeLeft) {
        return new ChaFesEstimationInfo(liveCount, songAmount, totalGoldCost, null, timeLeft);
    }
    var recoveryInfo = Common.calculateLpRecoveryInfo(playerRank, liveInfo.exp * liveCount, playerExp, liveInfo.lp *
                                                                                                       liveCount,
        playerLp, timeLeft);
    return new ChaFesEstimationInfo(liveCount, songAmount, totalGoldCost, recoveryInfo, timeLeft);
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
ChaFesEstimationInfo.prototype.getPlayTime = function () {
    return this.fesCount * this.songs * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
ChaFesEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
ChaFesEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#chafesResultLiveCount"), this.fesCount);
    $("#chafesResultGoldUsed").text(Common.goldToString(this.gold));
    $("#chafesResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#chafesResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#chafesResultLoveca"), this.lpRecoveryInfo.lovecaUses);
        $("#chafesResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" + this.lpRecoveryInfo.finalRankExp + "/" +
                                         Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank) + " EXP)");
        $("#chafesResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
        $("#chafesResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#chafesResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
    } else {
        Results.setBigResult($("#chafesResultLoveca"), "---");
        $("#chafesResultFinalRank").text("---");
        $("#chafesResultSugarCubes").text("---");
        $("#chafesResultSugarPots50").text("---");
        $("#chafesResultSugarPots100").text("---");
    }

    Results.show($("#chafesResult"));
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
ChaFesData.prototype.validate = function () {
    var errors = [];

    if (null === this.createLiveInfo()) {
        errors.push("Live parameters have not been set");
    }

    if (0 === this.chafesTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
                    "Please change the event point target in order to calculate again");
    }

    if (0 > this.chafesCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.chafesCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.chafesCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.chafesCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.chafesTimerMethodAuto && this.chafesTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.chafesTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
        if (this.chafesTimerRegion != "en" && this.chafesTimerRegion != "jp") {
            errors.push("Choose a region for the Automatic Timer");
        }
    } else if (this.chafesTimerMethodManual) {
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
 * A string, representing a type of multiplier usage.
 * @typedef {('ALL'|'LAST')} chafes_mult_use
 */

/**
 * Event point reward multiplier for each possible score rank in a song.
 * @constant
 * @type {Object.<string, number>}
 */
var CHAFES_SCORE_RATE = {
    "N": 1,
    "C": 1.05,
    "B": 1.1,
    "A": 1.15,
    "S": 1.2,
    "ERROR": 0
};

/**
 * Event point reward multiplier for each possible combo rank in a song.
 * @constant
 * @type {Object.<string, number>}
 */
var CHAFES_COMBO_RATE = {
    "N": 1,
    "C": 1.02,
    "B": 1.04,
    "A": 1.06,
    "S": 1.08,
    "ERROR": 0
};

/**
 * Base point tables for challenges - first dimension is difficulty, second is amount of songs.
 * @constant
 * @type {number[][]}
 */
var CHAFES_BASE_EVENT_POINTS = [
    [0, 39, 40, 41, 42, 43],
    [0, 91, 94, 97, 100, 103],
    [0, 158, 164, 170, 176, 182],
    [0, 301, 320, 339, 358, 377]
];

/**
 * EXP reward table for challenges - first dimension is difficulty, second is amount of songs.
 * @constant
 * @type {number[][]}
 */
var CHAFES_BASE_EXP = [
    [0, 12, 13, 14, 15, 16],
    [0, 26, 29, 32, 35, 38],
    [0, 46, 51, 56, 61, 66],
    [0, 83, 93, 103, 113, 123]
];

/**
 * The multiplier by which event point rewards are increased when using the respective arrangement bonus.
 * @constant
 * @type {number}
 * @default
 */
var CHAFES_ARRANGE_EVENT_POINT_UP_RATE = 1.1;

/**
 * The multiplier by which EXP rewards are increased when using the respective arrangement bonus.
 * @constant
 * @type {number}
 * @default
 */
var CHAFES_ARRANGE_EXP_UP_RATE = 1.1;