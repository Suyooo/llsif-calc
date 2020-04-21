/**
 * @file Token Event calculator.
 */

/**
 * An object used to store input values for the Token Event calculator.
 * @class TokenData
 * @property {boolean} tokenTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} tokenRegion - Which server to use for the Automatic Timer and event rewards.
 * @property {boolean} tokenTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} tokenManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficultyWithM} tokenEventLiveDifficulty - The difficulty event lives are played on.
 * @property {rank} tokenEventLiveScore - Which score rank the player clears event lives with.
 * @property {rank} tokenEventLiveCombo - Which combo rank the player clears event lives with.
 * @property {number} tokenEventLiveMultiplier - Which multiplier the player plays event lives on.
 * @property {difficulty} tokenNormalLiveDifficulty - The difficulty normal lives are played on.
 * @property {number} tokenNormalLiveMultiplier - Which multiplier the player plays normal lives on.
 * @property {number} tokenNormalLiveLPReduction - A percentage to multiply LP with.
 * @property {number} tokenYellBonus - The yell unit bonus in percent.
 * @property {number} tokenTargetEventPoints - The desired final amount of event points.
 * @property {number} tokenCurrentEventPoints - The current amount of event points.
 * @property {number} tokenCurrentEventToken - The current amount of event token.
 * @property {number} tokenCurrentRank - The player's current rank.
 * @property {number} tokenCurrentLP - The player's current LP.
 * @property {number} tokenCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function TokenData() {
    this.tokenTimerMethodAuto = false;
    this.tokenRegion = "en";
    this.tokenTimerMethodManual = false;
    this.tokenManualRestTimeInHours = 0;
    this.tokenEventLiveDifficulty = "EASY";
    this.tokenEventLiveScore = "N";
    this.tokenEventLiveCombo = "N";
    this.tokenEventLiveMultiplier = 0;
    this.tokenNormalLiveDifficulty = "EASY";
    this.tokenNormalLiveMultiplier = 0;
    this.tokenNormalLiveLPReduction = 1;
    this.tokenYellBonus = 100;
    this.tokenTargetEventPoints = 0;
    this.tokenCurrentEventPoints = 0;
    this.tokenCurrentEventToken = 0;
    this.tokenCurrentRank = 0;
    this.tokenCurrentLP = 0;
    this.tokenCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a single event live.
 * @class TokenEventLiveInfo
 * @property {number} token - Token cost for one event live.
 * @property {number} point - Event point reward for one event live.
 * @property {number} exp - EXP reward for one event live.
 * @constructor
 */
function TokenEventLiveInfo(token, point, exp) {
    this.token = token;
    this.point = point;
    this.exp = exp;
}

/**
 * An object used to store information about the cost and rewards of a single normal live.
 * @class TokenNormalLiveInfo
 * @property {number} lp - LP cost for one normal live.
 * @property {number} token - Token reward for one normal live.
 * @property {number} exp - EXP reward for one normal live.
 * @constructor
 */
function TokenNormalLiveInfo(lp, token, point, exp) {
    this.lp = lp;
    this.token = token;
    this.exp = exp;
}

/**
 * A class serving static calculation methods handling TokenData objects.
 * @class TokenEstimator
 * @constructor
 */
function TokenEstimator() {
}

/**
 * An object storing the total amount of live plays, rewards and cost.
 * @class TokenLiveCount
 * @property {number} eventLiveCount - How many event lives are played.
 * @property {number} token - Total token cost of event lives.
 * @property {number} normalLiveCount - How many normal lives are played.
 * @property {number} exp - Total EXP reward of both event and normal lives.
 * @property {number} lp - Total LP cost of normal lives.
 * @constructor
 */
function TokenLiveCount(eventLiveCount, token, normalLiveCount, exp, lp) {
    this.eventLiveCount = eventLiveCount;
    this.token = token;
    this.normalLiveCount = normalLiveCount;
    this.exp = exp;
    this.lp = lp;
}

/**
 * An object storing the result of the calculation for TokenData objects.
 * @class TokenEstimationInfo
 * @property {TokenLiveCount} liveCount - Amount of lives to play and total rewards.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @constructor
 */
function TokenEstimationInfo(liveCount, lpRecoveryInfo, restTime) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = lpRecoveryInfo;
    this.restTime = restTime;
}

/**
 * Read input values from the UI.
 */
TokenData.prototype.readFromUi = function () {
    this.tokenTimerMethodAuto = $("#tokenTimerMethodAuto").prop("checked");
    this.tokenRegion = $("input:radio[name=tokenRegion]:checked").val();
    this.tokenTimerMethodManual = $("#tokenTimerMethodManual").prop("checked");
    this.tokenManualRestTimeInHours = ReadHelpers.toNum($("#tokenManualRestTime").val());
    this.tokenEventLiveDifficulty = $("input:radio[name=tokenEventLiveDifficulty]:checked").val();
    this.tokenEventLiveScore = $("input:radio[name=tokenEventLiveScore]:checked").val();
    this.tokenEventLiveCombo = $("input:radio[name=tokenEventLiveCombo]:checked").val();
    this.tokenEventLiveMultiplier = ReadHelpers.toNum($("input:radio[name=tokenEventLiveMultiplier]:checked").val());
    this.tokenNormalLiveDifficulty = $("input:radio[name=tokenNormalLiveDifficulty]:checked").val();
    this.tokenNormalLiveMultiplier = ReadHelpers.toNum($("input:radio[name=tokenNormalLiveMultiplier]:checked").val());
    this.tokenNormalLiveLPReduction =
        ReadHelpers.toNum($("input:radio[name=tokenNormalLiveLPReduction]:checked").val());
    this.tokenYellBonus = ReadHelpers.toNum($("#tokenYellBonus").val(), 100);
    this.tokenTargetEventPoints = ReadHelpers.toNum($("#tokenTargetEventPoints").val());
    this.tokenCurrentEventPoints = ReadHelpers.toNum($("#tokenCurrentEventPoints").val());
    this.tokenCurrentEventToken = ReadHelpers.toNum($("#tokenCurrentEventToken").val());
    this.tokenCurrentRank = ReadHelpers.toNum($("#tokenCurrentRank").val());
    this.tokenCurrentLP = ReadHelpers.toNum($("#tokenCurrentLP").val(), 0);
    this.tokenCurrentEXP = ReadHelpers.toNum($("#tokenCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {TokenData} savedData The saved data to recall values from.
 */
TokenData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#tokenTimerMethodAuto"), savedData.tokenTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenRegion]"), savedData.tokenRegion);
    if (savedData.tokenRegion !== undefined) {
        updateTimerSection("token");
    }
    var manualButton = $("#tokenTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.tokenTimerMethodManual);
    if (savedData.tokenTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#tokenManualRestTime"), savedData.tokenManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenEventLiveDifficulty]"), savedData.tokenEventLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenEventLiveScore]"), savedData.tokenEventLiveScore);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenEventLiveCombo]"), savedData.tokenEventLiveCombo);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenEventLiveMultiplier]"), savedData.tokenEventLiveMultiplier);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenNormalLiveDifficulty]"), savedData.tokenNormalLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenNormalLiveMultiplier]"), savedData.tokenNormalLiveMultiplier);
    SetHelpers.radioButtonHelper($("input:radio[name=tokenNormalLiveLPReduction]"),
        savedData.tokenNormalLiveLPReduction);
    SetHelpers.inputHelper($("#tokenYellBonus"), savedData.tokenYellBonus);
    SetHelpers.inputHelper($("#tokenTargetEventPoints"), savedData.tokenTargetEventPoints);
    SetHelpers.inputHelper($("#tokenCurrentEventPoints"), savedData.tokenCurrentEventPoints);
    SetHelpers.inputHelper($("#tokenCurrentEventToken"), savedData.tokenCurrentEventToken);
    SetHelpers.inputHelper($("#tokenCurrentRank"), savedData.tokenCurrentRank);
    SetHelpers.inputHelper($("#tokenCurrentLP"), savedData.tokenCurrentLP);
    SetHelpers.inputHelper($("#tokenCurrentEXP"), savedData.tokenCurrentEXP);
    if (savedData.tokenCurrentLP > 0 || savedData.tokenCurrentEXP > 0) {
        $("#tokenCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
TokenData.prototype.alert = function () {
    alert("tokenTimerMethodAuto: " + this.tokenTimerMethodAuto + "\n" +
        "tokenRegion: " + this.tokenRegion + "\n" +
        "tokenTimerMethodManual: " + this.tokenTimerMethodManual + "\n" +
        "tokenManualRestTimeInHours: " + this.tokenManualRestTimeInHours + "\n" +
        "tokenEventLiveDifficulty: " + this.tokenEventLiveDifficulty + "\n" +
        "tokenEventLiveScore: " + this.tokenEventLiveScore + "\n" +
        "tokenEventLiveCombo: " + this.tokenEventLiveCombo + "\n" +
        "tokenEventLiveMultiplier: " + this.tokenEventLiveMultiplier + "\n" +
        "tokenNormalLiveDifficulty: " + this.tokenNormalLiveDifficulty + "\n" +
        "tokenNormalLiveMultiplier: " + this.tokenNormalLiveMultiplier + "\n" +
        "tokenNormalLPReduction: " + this.tokenNormalLiveLPReduction + "\n" +
        "tokenYellBonus: " + this.tokenYellBonus + "\n" +
        "tokenTargetEventPoints: " + this.tokenTargetEventPoints + "\n" +
        "tokenCurrentRank: " + this.tokenCurrentRank + "\n" +
        "tokenCurrentEventToken: " + this.tokenCurrentEventToken + "\n" +
        "tokenCurrentEventPoints: " + this.tokenCurrentEventPoints + "\n" +
        "tokenCurrentLP: " + this.tokenCurrentLP + "\n" +
        "tokenCurrentEXP: " + this.tokenCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
TokenData.prototype.getRestTimeInMinutes = function () {
    if (this.tokenTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes(this.tokenRegion);
    }
    if (this.tokenTimerMethodManual) {
        return 60 * this.tokenManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
TokenData.prototype.getEventPointsLeft = function () {
    return this.tokenTargetEventPoints - this.tokenCurrentEventPoints;
};

/**
 * Get an index associated with the inputted event live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
TokenData.prototype.getEventLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.tokenEventLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted event live score rank for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link TOKEN_RANK}.ERROR if the input is invalid.
 */
TokenData.prototype.getEventLiveScore = function () {
    var rankId = TOKEN_RANK[this.tokenEventLiveScore];
    if (undefined !== rankId) return rankId;
    return TOKEN_RANK.ERROR;
};

/**
 * Get an index associated with the inputted event live combo rank for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link TOKEN_RANK}.ERROR if the input is invalid.
 */
TokenData.prototype.getEventLiveCombo = function () {
    var comboId = TOKEN_RANK[this.tokenEventLiveCombo];
    if (undefined !== comboId) return comboId;
    return TOKEN_RANK.ERROR;
};

/**
 * Gets the inputted event live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
TokenData.prototype.getEventLiveMultiplier = function () {
    var multiplier = this.tokenEventLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Gets the inputted yell bonus multiplier
 * @returns {number} A reward multiplier, or 0 if the input is invalid.
 */
TokenData.prototype.getYellBonus = function () {
    var yellBonus = this.tokenYellBonus;
    if (yellBonus >= 100) return yellBonus / 100;
    return 0;
};

/**
 * Creates a {@link TokenEventLiveInfo} object using the event live input values, representing one play.
 * @returns {?TokenEventLiveInfo} A new object with all properties set, or null if the event live inputs are invalid.
 */
TokenData.prototype.createEventLiveInfo = function () {
    var diffId = this.getEventLiveDifficulty(),
        rankId = this.getEventLiveScore(),
        comboId = this.getEventLiveCombo(),
        multiplier = this.getEventLiveMultiplier(),
        yellBonus = this.getYellBonus();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == TOKEN_RANK.ERROR
        || comboId == TOKEN_RANK.ERROR || multiplier === 0 || yellBonus === 0) {
        return null;
    }

    var tokenCost = TOKEN_EVENT_TOKEN[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        pointReward = this.tokenRegion == "en" ? TOKEN_EVENT_POINTS_WW[diffId][rankId][comboId] :
            TOKEN_EVENT_POINTS_BASE[diffId] * TOKEN_EVENT_POINTS_SCORE_MULTI[diffId][rankId] * TOKEN_EVENT_POINTS_COMBO_MULTI[diffId][comboId];
    if (undefined === pointReward) return null;
    return new TokenEventLiveInfo(tokenCost * multiplier, Math.round(pointReward * multiplier * yellBonus), expReward * multiplier);
};

/**
 * Get an index associated with the inputted normal live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
TokenData.prototype.getNormalLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.tokenNormalLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Gets the inputted normal live multiplier
 * @returns {number} A reward/cost multiplier, or 0 if the input is invalid.
 */
TokenData.prototype.getNormalLiveMultiplier = function () {
    var multiplier = this.tokenNormalLiveMultiplier;
    if (multiplier >= 1) return multiplier;
    return 0;
};

/**
 * Gets the inputted normal live LP reduction
 * @returns {number} A cost multiplier, or 0 if the input is invalid.
 */
TokenData.prototype.getNormalLiveLPReduction = function () {
    var reduction = this.tokenNormalLiveLPReduction;
    if (reduction <= 1) return reduction;
    return 0;
};

/**
 * Creates a {@link TokenNormalLiveInfo} object using the normal live input values, representing one play.
 * @returns {?TokenNormalLiveInfo} A new object with all properties set, or null if the normal live inputs are invalid.
 */
TokenData.prototype.createNormalLiveInfo = function () {
    var diffId = this.getNormalLiveDifficulty(),
        multiplier = this.getNormalLiveMultiplier(),
        reduction = this.getNormalLiveLPReduction(),
        yellBonus = this.getYellBonus();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || multiplier === 0 || reduction === 0 || yellBonus === 0) {
        return null;
    }
    var lpCost = COMMON_LP_COST[diffId] * reduction,
        tokenReward = TOKEN_NORMAL_TOKEN[diffId],
        expReward = COMMON_EXP_REWARD[diffId];
    return new TokenNormalLiveInfo(lpCost * multiplier, tokenReward * multiplier, Math.round(tokenReward * multiplier * yellBonus), expReward * multiplier);
};

/**
 * Returns the total amount of live plays.
 * @returns {number} The sum of event live and normal live plays.
 */
TokenLiveCount.prototype.totalLiveCount = function () {
    return this.eventLiveCount + this.normalLiveCount;
};

/**
 * Calculates the amount of event lives required to meet the point target.
 * @param {TokenEventLiveInfo} eventLiveInfo Cost and reward info about one event live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} currentEventToken The current amount of event token.
 * @param {number} yellBonus The reward multiplier from the player's Yell unit.
 * @returns {TokenLiveCount} A new object with only event live properties set.
 */
TokenEstimator.calculateEventLiveCount = function (eventLiveInfo, eventPointsLeft, currentEventToken, yellBonus) {
    var eventLiveCount = Math.ceil(eventPointsLeft / (eventLiveInfo.point));
    var tokenRequired = 0;
    if (eventLiveCount * eventLiveInfo.token > currentEventToken) {
        eventLiveCount = Math.ceil((eventPointsLeft + currentEventToken * yellBonus) / (eventLiveInfo.token * yellBonus + eventLiveInfo.point));
        tokenRequired = eventLiveCount * eventLiveInfo.token - currentEventToken;
    }
    return new TokenLiveCount(eventLiveCount, tokenRequired, 0, eventLiveCount * eventLiveInfo.exp, 0);
};

/**
 * Calculates the amount of normal live required to collect enough tokens to play the specified amount of event lives.
 * Adds the new information to the given {@link TokenLiveCount} object.
 * @param {TokenLiveCount} liveCount An object with the event live properties set, representing the required plays.
 * @param {TokenNormalLiveInfo} normalLiveInfo Cost and reward info about one normal live play.
 */
TokenEstimator.calculateNormalLiveCount = function (liveCount, normalLiveInfo) {
    if (liveCount.token > 0) {
        liveCount.normalLiveCount = Math.ceil(liveCount.token / normalLiveInfo.token);
        liveCount.exp += liveCount.normalLiveCount * normalLiveInfo.exp;
        liveCount.lp += liveCount.normalLiveCount * normalLiveInfo.lp;
    }
};

/**
 * Calculates the amount of both event and normal lives required to meet the point target.
 * @param {TokenEventLiveInfo} eventLiveInfo Cost and reward info about one event live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} currentEventToken The current amount of event token.
 * @param {TokenNormalLiveInfo} normalLiveInfo Cost and reward info about one normal live play.
 * @param {number} yellBonus The reward multiplier from the player's Yell unit.
 * @returns {TokenLiveCount} A new object with all properties set.
 */
TokenEstimator.calculateLiveCount = function (eventLiveInfo, eventPointsLeft, currentEventToken, normalLiveInfo, yellBonus) {
    var liveCount = this.calculateEventLiveCount(eventLiveInfo, eventPointsLeft, currentEventToken, yellBonus);
    this.calculateNormalLiveCount(liveCount, normalLiveInfo);
    return liveCount;
};

/**
 * Call {@link TokenEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link TokenData.validate}.
 * @returns {TokenEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
TokenData.prototype.estimate = function () {
    return TokenEstimator.estimate(this.createEventLiveInfo(), this.createNormalLiveInfo(), this.getEventPointsLeft(),
        this.tokenCurrentEventToken, this.getYellBonus(), this.getRestTimeInMinutes(), this.tokenCurrentRank,
        this.tokenCurrentEXP, this.tokenCurrentLP);
};

/**
 * Start calculation for a Token Event. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of event lives to play to reach the point goal.
 *      See {@link TokenEstimator.calculateEventLiveCount}</li>
 * <li>2) Calculate total amount of LP needed to play the Normal lives required to collect the tokens. See
 *      {@link TokenEstimator.calculateLiveCount}</li>
 * <li>3) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {TokenEventLiveInfo} eventLiveInfo Cost and reward info about one event live play.
 * @param {TokenNormalLiveInfo} normalLiveInfo Cost and reward info about one normal live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} currentEventToken The initial amount of event token.
 * @param {number} yellBonus The reward multiplier from the player's Yell unit.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @returns {TokenEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
TokenEstimator.estimate = function (eventLiveInfo, normalLiveInfo, eventPointsLeft, currentEventToken, yellBonus, timeLeft,
                                    playerRank, playerExp, playerLp) {
    var liveCount = this.calculateLiveCount(eventLiveInfo, eventPointsLeft, currentEventToken, normalLiveInfo, yellBonus);
    if (liveCount.totalLiveCount() * COMMON_LIVE_TIME_IN_MINUTES > timeLeft) {
        return new TokenEstimationInfo(liveCount, null, timeLeft);
    }
    var recoveryInfo = Common.calculateLpRecoveryInfo(playerRank, liveCount.exp, playerExp, liveCount.lp, playerLp,
        timeLeft);
    return new TokenEstimationInfo(liveCount, recoveryInfo, timeLeft);
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
TokenEstimationInfo.prototype.getPlayTime = function () {
    return (this.liveCount.eventLiveCount + this.liveCount.normalLiveCount) * COMMON_LIVE_TIME_IN_MINUTES;
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
TokenEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
TokenEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#tokenResultEventLiveCount"), this.liveCount.eventLiveCount);
    Results.setBigResult($("#tokenResultNormalLiveCount"), this.liveCount.normalLiveCount);
    $("#tokenResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#tokenResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var showSleepWarning = false;

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#tokenResultRefills"), this.lpRecoveryInfo.lovecaUses);
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#tokenResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" + this.lpRecoveryInfo.finalRankExp + "/" +
            Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank) + " EXP)");
        $("#tokenResultLoveca").text(this.lpRecoveryInfo.lovecaUses);
        $("#tokenResultSugarPots50").text(this.lpRecoveryInfo.lovecaUses * 2);
        $("#tokenResultSugarPots100").text(this.lpRecoveryInfo.lovecaUses);
        $("#tokenResultSugarCubes").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
    } else {
        Results.setBigResult($("#tokenResultRefills"), "---");
        $("#tokenResultFinalRank").text("---");
        $("#tokenResultLoveca").text("---");
        $("#tokenResultSugarPots50").text("---");
        $("#tokenResultSugarPots100").text("---");
        $("#tokenResultSugarCubes").text("---");
    }

    Results.show($("#tokenResult"), showSleepWarning);
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
TokenData.prototype.validate = function () {
    var errors = [];

    if (this.tokenRegion != "en" && this.tokenRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    if (null === this.createEventLiveInfo()) {
        errors.push("Event live parameters have not been set");
    }

    var liveInfo = this.createNormalLiveInfo();
    if (null === liveInfo) {
        errors.push("Normal live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.tokenCurrentRank)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
            ") that's higher than your max LP (" + Common.getMaxLp(this.tokenCurrentRank) + ")");
    } else if (this.tokenRegion == "en" && this.tokenEventLiveDifficulty == "MASTER") { // TODO: remove when WW changes
        errors.push("Master difficulty for event lives is not available in the Worldwide server.");
    }

    if (0 >= this.tokenTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
            "Please change the event point target in order to calculate again");
    }

    if (0 > this.tokenCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 > this.tokenCurrentEventToken) {
        errors.push("Enter current amount of tokens");
    }

    if (0 >= this.tokenCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.tokenCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.tokenCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.tokenTimerMethodAuto && this.tokenTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.tokenTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.tokenTimerMethodManual) {
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
 * IDs for the score and combo rank inputs on the UI.
 * @constant
 * @type {Object.<string, number>}
 */
var TOKEN_RANK = {
    "N": 0,
    "C": 1,
    "B": 2,
    "A": 3,
    "S": 4,
    "MASTER": 5,
    "ERROR": 6
};

/**
 * Base event point rewards for event lives for each difficulty.
 * @constant
 * @type {number[]}
 */
var TOKEN_EVENT_POINTS_BASE = [58, 117, 198, 410, 533];

/**
 * Score rank multipliers for the event point rewards for event lives - first dimension is difficulty, second is rank.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINTS_SCORE_MULTI = [
    [1.00, 1.05, 1.10, 1.12, 1.14],
    [1.00, 1.05, 1.10, 1.14, 1.18],
    [1.00, 1.05, 1.10, 1.15, 1.20],
    [1.00, 1.05, 1.10, 1.16, 1.22],
    [1.00, 1.05, 1.10, 1.18, 1.26]
];

/**
 * Combo rank multipliers for the event point rewards for event lives - first dimension is difficulty, second is rank.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINTS_COMBO_MULTI = [
    [1.00, 1.02, 1.04, 1.06, 1.10],
    [1.00, 1.02, 1.04, 1.08, 1.12],
    [1.00, 1.02, 1.04, 1.10, 1.14],
    [1.00, 1.02, 1.04, 1.12, 1.16],
    [1.00, 1.02, 1.04, 1.14, 1.18]
];

/**
 * Event point rewards tables for WW event lives on Easy difficulty - first dimension is rank, second is combo.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINT_TABLE_WW_EASY = [
    [57, 58, 59, 60, 61],
    [60, 61, 62, 63, 64],
    [63, 64, 65, 66, 68],
    [64, 65, 66, 68, 70],
    [66, 67, 69, 70, 71]
];

/**
 * Event point rewards tables for WW event lives on Normal difficulty - first dimension is rank, second is combo.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINT_TABLE_WW_NORMAL = [
    [114, 117, 120, 122, 124],
    [121, 123, 126, 128, 131],
    [125, 129, 132, 135, 137],
    [133, 135, 137, 140, 143],
    [137, 140, 143, 145, 148]
];

/**
 * Event point rewards tables for WW event lives on Hard difficulty - first dimension is rank, second is combo.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINT_TABLE_WW_HARD = [
    [194, 197, 202, 207, 214],
    [204, 209, 213, 219, 226],
    [215, 220, 224, 231, 237],
    [226, 230, 235, 242, 249],
    [237, 241, 246, 254, 261]
];

/**
 * Event point rewards tables for WW event lives on Expert difficulty - first dimension is rank, second is combo.
 * @constant
 * @type {number[][]}
 */
var TOKEN_EVENT_POINT_TABLE_WW_EX = [
    [403, 413, 421, 446, 459],
    [426, 435, 444, 470, 484],
    [448, 458, 467, 495, 509],
    [475, 485, 495, 525, 540],
    [498, 508, 518, 549, 565]
];

/**
 * Array saving references to all WW point tables, for access using the difficulty ID from COMMON_DIFFICULTY_IDS.
 * @constant
 * @type {number[][][]}
 */
var TOKEN_EVENT_POINTS_WW = [];
TOKEN_EVENT_POINTS_WW[COMMON_DIFFICULTY_IDS.EASY] = TOKEN_EVENT_POINT_TABLE_WW_EASY;
TOKEN_EVENT_POINTS_WW[COMMON_DIFFICULTY_IDS.NORMAL] = TOKEN_EVENT_POINT_TABLE_WW_NORMAL;
TOKEN_EVENT_POINTS_WW[COMMON_DIFFICULTY_IDS.HARD] = TOKEN_EVENT_POINT_TABLE_WW_HARD;
TOKEN_EVENT_POINTS_WW[COMMON_DIFFICULTY_IDS.EX] = TOKEN_EVENT_POINT_TABLE_WW_EX;

/**
 * Token cost for an event live of each difficulty.
 * @constant
 * @type {number[]}
 */
var TOKEN_EVENT_TOKEN = [];
TOKEN_EVENT_TOKEN[COMMON_DIFFICULTY_IDS.EASY] = 15;
TOKEN_EVENT_TOKEN[COMMON_DIFFICULTY_IDS.NORMAL] = 30;
TOKEN_EVENT_TOKEN[COMMON_DIFFICULTY_IDS.HARD] = 45;
TOKEN_EVENT_TOKEN[COMMON_DIFFICULTY_IDS.EX] = 75;

/**
 * Amount of tokens available in a normal live of each difficulty.
 * @constant
 * @type {number[]}
 */
var TOKEN_NORMAL_TOKEN = [];
TOKEN_NORMAL_TOKEN[COMMON_DIFFICULTY_IDS.EASY] = 5;
TOKEN_NORMAL_TOKEN[COMMON_DIFFICULTY_IDS.NORMAL] = 10;
TOKEN_NORMAL_TOKEN[COMMON_DIFFICULTY_IDS.HARD] = 16;
TOKEN_NORMAL_TOKEN[COMMON_DIFFICULTY_IDS.EX] = 27;