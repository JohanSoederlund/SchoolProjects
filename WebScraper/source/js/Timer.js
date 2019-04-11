/**
 * Sets up a Timer.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

let counter = 20;
let intervalTimer;
const view = require("./view.js");
const controller = require("./quizController.js");

/**
 * Countdown method called every second to update the timer and make sure it wont go below zero
 */
function countdown() {
    counter -= 1;
    view.updateTimer(counter);

    if ((counter === 0) || (counter < 0)) {   // less than 0 just for security
        clearInterval(intervalTimer);
        view.hideTimer();
        controller.countdownEnded();
    }
}

/**
 * Setup a new timer with a countdown intervall of one second
 */
module.exports.startQTimer = function() {
    counter = 20;
    intervalTimer = setInterval(countdown, 1000);
    view.showTimer(counter);
    view.updateTimer(counter);
}

/**
 * Returns total time consumed after initiation,
 * stops and clears the timer
 */
module.exports.stopQTimer = function() {
    let timeConsumed = 20 - counter;
    clearInterval(intervalTimer);
    counter = 0;
    view.hideTimer();
    return timeConsumed;
}
