var PREVIEW_LENGTH = 17;
var TOTAL_LINE_INDEX = 7;
var MAX_WRITABLE_INDEX = 6;
var LINEBREAK_WIDTH = 2;
var WIDTH_LIMIT = 40;
var TOTAL_LENGTH_LIMIT = 100;

/**
 * Returns the character width, depending on whether it is a full width character or not.
 * @param {number} c The character code of the character to be tested.
 * @returns {number} 2 if the character is full width, 1 otherwise.
 */
function getCharWidth(c) {
    if (c < 256 || (c >= 0xff61 && c <= 0xff9f)) {
        return 1;
    }
    return 2;
}

/**
 * Tests whether a character is disallowed by the game.
 * @param {number} c The character code of the character to be tested.
 * @returns {boolean} Whether the given character is forbidden or not.
 */
function isForbiddenChar(c) {
    return FORBIDDEN_CHARS[c] === true;
}

/**
 * Analyzes input text, adds line breaks as needed, and updates the error list, character count table and text output.
 */
function updateOutput() {
    var input = $("#input").val();
    var lines = input.split("\n");
    var input_len = [0, 0, 0, 0, 0, 0, 0, 0];
    var input_width = [0, 0, 0, 0, 0, 0, 0, 0];
    var adjust_len = [0, 0, 0, 0, 0, 0, 0, 0];
    var adjust_width = [0, 0, 0, 0, 0, 0, 0, 0];
    var total_len = [0, 0, 0, 0, 0, 0, 0, 0];
    var error_messages = [];

    if (lines.length - 1 > MAX_WRITABLE_INDEX) {
        error_messages.push("Too many lines! The profile text can only display 8 lines.");
    }
    var output = "";
    for (var li = 0; li <= Math.min(lines.length - 1, MAX_WRITABLE_INDEX); li++) {
        input_len[li] = lines[li].length;
        input_len[TOTAL_LINE_INDEX] += input_len[li];
        input_width[li] = 0;
        for (var j = 0; j < input_len[li]; j++) {
            var char_code = lines[li].charCodeAt(j);
            input_width[li] += getCharWidth(char_code);
            if (isForbiddenChar(char_code)) {
                error_messages.push("Character number " + (j + 1) + " on line " + (li + 1) + " [" + lines[li].substr(j, 1) + "] is a character not allowed in profile text.");
            }
        }
        if (lines[li].match(/[\uD83C-\uDBFF\uDC00-\uDFFF][\uD83C-\uDBFF\uDC00-\uDFFF]/g) !== null) {
            error_messages.push("Line " + (li + 1) + " contains extended unicode characters, which are not allowed in a profile text.");
        }
        if (input_len[li] > WIDTH_LIMIT) {
            error_messages.push("Line " + (li + 1) + " is too long - lines can only be 40 characters wide.");
        } else if (input_width[li] > WIDTH_LIMIT) {
            error_messages.push("Line " + (li + 1) + " is too long - please note that full width characters are two characters wide.");
        }
        input_width[TOTAL_LINE_INDEX] += input_width[li];
    }

    var prev_width = 0;
    for (var i = 0; i <= Math.min(lines.length - 1, MAX_WRITABLE_INDEX); i++) {
        output += lines[i];
        if (i < Math.min(lines.length - 1, MAX_WRITABLE_INDEX)) {
            // LLSIF inserts a line break every 40 character widths. In order to match the input line
            // breaks, we can add a newline character if we still have enough space left until the next
            // break inserted by the game, or add enough spaces to "round up" to the next 40
            if (prev_width + input_width[i] + LINEBREAK_WIDTH + input_width[i + 1] > 40) {
                var filled_space_width = 40 - prev_width - input_width[i];
                // We can use full width spaces to fill two character spaces with just one character
                var num_fullwidth_space = filled_space_width / 2;
                var num_halfwidth_space = filled_space_width % 2;
                for (var fj = 0; fj < num_fullwidth_space; fj++) {
                    // Full width space
                    output += "　";
                }
                for (var hj = 0; hj < num_halfwidth_space; hj++) {
                    // Half width space
                    output += " ";
                }
                adjust_len[i] = num_fullwidth_space + num_halfwidth_space;
                adjust_width[i] = 2 * num_fullwidth_space + num_halfwidth_space;
                prev_width = 0;
            } else {
                // Add newline, carry over current length to make sure we don't overrun the 40 char limit
                output += "\\n";
                adjust_len[i] = 2;
                adjust_width[i] = 2;
                prev_width += input_width[i] + adjust_width[i];
            }
        }
        adjust_len[TOTAL_LINE_INDEX] += adjust_len[i];
        total_len[i] = input_len[i] + adjust_len[i];
        total_len[TOTAL_LINE_INDEX] += total_len[i];
    }
    if (total_len[TOTAL_LINE_INDEX] > TOTAL_LENGTH_LIMIT) {
        error_messages.push("The character limit was reached. Please shorten or rearrange the text.");
    }

    for (var ti = 0; ti <= TOTAL_LINE_INDEX; ti++) {
        $("#td_" + ti + "_input_len").html(input_len[ti]);
        $("#td_" + ti + "_adjust_len").html(adjust_len[ti]);
        $("#td_" + ti + "_total_len").html(total_len[ti]);
        $("#td_" + ti + "_input_width").html(input_width[ti]);
    }

    $("#output").val(output);
    $("#total_count").text(total_len[TOTAL_LINE_INDEX]);
    updateErrorMessage(error_messages);
}

/**
 * Update the preview of the friends list line.
 */
function updateLinePreview() {
    var input = $("#input").val();
    var lines = input.split("\n");
    var preview_one_line = lines[0].substr(0, PREVIEW_LENGTH);
    $("#preview_one_line").text(preview_one_line);
}

/**
 * Updates the URL output.
 */
function updateUrl() {
    var input = $("#input").val();
    var encoded_input = encodeURIComponent(input);
    var url = window.location.origin + window.location.pathname + "?q=" + encoded_input;
    $("#urlinput").val(url);
}

/**
 * Get value of a single GET parameter.
 * @returns {string} If there is only one GET parameter, the value of it, otherwise, an odd mess
 */
function getParameterText() {
    // We assume that q is the only GET parameter... so just look for the = character
    var value = location.search.split("=")[1];
    if (value !== undefined) {
        return decodeURIComponent(value);
    }
    return "";
}

/**
 * Called when the input is changed, updates all outputs.
 */
function handleTextAreaUpdate() {
    updateLinePreview();
    updateOutput();
    updateUrl();
}

/**
 * Updates the error message list.
 * @param {string[]} error_messages A list of error messages.
 */
function updateErrorMessage(error_messages) {
    var err = $("#error");
    if (error_messages.length === 0) {
        err.hide();
        return;
    }

    var error_str = "<ul>";
    for (var i = 0; i < error_messages.length; i++) {
        error_str += "<li>";
        error_str += error_messages[i];
        error_str += "</li>";
    }
    error_str += "</ul>";
    $("#error_messages").html(error_str);
    err.show();
}

$(function () {
    M.AutoInit();

    $("#error").hide();
    var inp = $("#input");
    inp.val(getParameterText());
    handleTextAreaUpdate();

    inp.bind('keyup change', function () {
        handleTextAreaUpdate();
    });
});

/**
 * Characters not allowed in profile text.
 * @constant
 * @type {Object.<number, boolean>}
 * @default
 * @see isForbiddenChar
 */
var FORBIDDEN_CHARS = {
    60: true,    // 0x3C <
    62: true,    // 0x3E >
    65308: true, // 0xFF1E ＜
    65310: true // 0xFF1E ＞
};