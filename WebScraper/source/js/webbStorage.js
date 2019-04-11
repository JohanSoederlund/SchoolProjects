/**
 * Stores data in Webstorages.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

/**
 * Get highscore list from webstorage and returns it
 */
module.exports.getHighscore = function() {
    let highscore = JSON.parse(localStorage.getItem("highscore"));
    if (highscore === null) {
        highscore = [];
    }
    return highscore;
}

/**
 * Controls the result to previous highscore and pushes the result into the new list if good enough
 */
module.exports.checkIfHighscore = function(user, highscore) {
    if (highscore.length < 5) {
        highscore.push(user);
        highscore = highscore.sort(function(a, b) {return a.totalTime - b.totalTime;});
        localStorage.setItem("highscore", JSON.stringify(highscore));
    } else {
        if (highscore[4].totalTime > user.totalTime) {
            highscore.pop();
            highscore.push(user);
            highscore = highscore.sort(function(a, b) {return a.totalTime - b.totalTime;});
            localStorage.setItem("highscore", JSON.stringify(highscore));
        }
    }
}

/**
 * Logs the error to the list in webstorage
 */
module.exports.logError = function(error) {
    let errorLog = JSON.parse(localStorage.getItem("errorLog"));
    if (errorLog === null) {
        errorLog = [];
    }
    let date = new Date();
    errorLog.push(error + " - " + date);
    localStorage.setItem("errorLog", JSON.stringify(errorLog));
}

/**
 * returns the whole list of logges errors
 */
module.exports.getErrorLogs = function() {
    let errorLog = JSON.parse(localStorage.getItem("errorLog"));
    if (errorLog === null) {
        errorLog = [];
    }
    return errorLog;
}
