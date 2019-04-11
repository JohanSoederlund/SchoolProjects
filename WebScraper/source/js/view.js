/**
 * View functions.
 *
 * @author Johan Söderlund
 * @version 1.0
 */
"use strict";

const timer = require("./Timer.js");

let questionNo = 0;

/**
 * Vivibility for sections depending on the question type
 */
function displayAnswerSection(type) {
    if (type === "text"){
        document.getElementById("answerAlternatives").classList.add("hide");
        document.getElementById("answerAlternatives").classList.remove("show");
        document.getElementById("answerField").classList.add("show");
        document.getElementById("answerField").classList.remove("hide");
    }else if (type === "alternatives") {
        document.getElementById("answerField").classList.add("hide");
        document.getElementById("answerField").classList.remove("show");
        document.getElementById("answerAlternatives").classList.remove("hide");
        document.getElementById("answerAlternatives").classList.add("show");
    }else{
        document.getElementById("answerField").classList.add("hide");
        document.getElementById("answerField").classList.remove("show");
        document.getElementById("answerAlternatives").classList.add("hide");
        document.getElementById("answerAlternatives").classList.remove("show");
    }
}

/**
 * updates the question
 */
module.exports.updateQuestion = function(obj) {
    document.getElementById("question").getElementsByTagName("P")[0].innerHTML = obj.question;

    if (obj.alternatives !== undefined) {
        displayAnswerSection("alternatives");
        let alternatives = obj.alternatives;
        let radioDiv = document.getElementById("answerAlternatives");
        let size = Object.keys(alternatives).length;
        for (let i = size - 1; i >= 0; i -= 1) {
            let linebreak = document.createElement("label");
            linebreak.innerHTML = "</br>  ";
            radioDiv.insertBefore(linebreak, radioDiv.firstChild);
            let label = document.createElement("label");
            label.innerHTML = "  " + Object.values(alternatives)[i];
            radioDiv.insertBefore(label, radioDiv.firstChild);
            let radioButton = document.createElement("input");
            radioButton.setAttribute("type", "radio");
            radioButton.setAttribute("name", "radio");
            radioButton.value = Object.keys(alternatives)[i];
            radioDiv.insertBefore(radioButton, radioDiv.firstChild);
        }
    } else {
        displayAnswerSection("text");
        document.getElementById("answerField").getElementsByTagName("input")[0].value = "";
    }
    timer.startQTimer();
}

/**
 * Shows the server response to the user,
 * right or wrong answer
 */
let showResponse = function(text) {
    let response = document.querySelector("#response");
    if (text === "Failed") {
        response.classList.remove("hide");
        response.classList.remove("green");
        response.classList.add("red");
        response.innerHTML = "Sorry, you failed" + "<br>" ;
    } else if (text !== undefined) {
        response.classList.add("green");
        response.classList.remove("red");
        response.classList.remove("hide");
        questionNo = questionNo + 1;
        response.innerHTML += "Question " + questionNo + "  " + text + "<br>" ;
    }else {
        response.classList.add("hide");
        response.innerHTML = "";
    }
}

/**
 * exported showResponse method
 */
module.exports.showResponse = function(text){
    showResponse(text);
}

/**
 * Shows the countdown timer when a question appears
 */
module.exports.showTimer = function() {
    document.querySelector("#timer").classList.remove("hide");
}

/**
 * Hides the countdown timer
 */
module.exports.hideTimer = function() {
    document.querySelector("#timer").classList.add("hide");
}

/**
 * Red style for the timer
 */
module.exports.updateTimer = function(counter) {
    let secondsRemaining = document.getElementById("timer").querySelector(".seconds");
    if (counter === 5) {
        secondsRemaining.classList.add("red");
    }else if (counter > 5) {
        if (secondsRemaining.classList.contains("red")) {
            secondsRemaining.classList.remove("red");
        }
    }
    secondsRemaining.textContent = counter;
}

/**
 * Removes DOM elements,
 * (radiobuttons for old questions)
 */
module.exports.removeNodes = function(node, nodeList) {
    let nodes = Array.prototype.slice.call(nodeList);
    for (let i = 0; i < nodes.length; i += 1){
        node.removeChild(nodes[i]);
    }
}

/**
 * Display result after the game is finished
 */
module.exports.endGame = function(user) {
    showResponse();
    displayAnswerSection("none");
    if (user !== undefined && user !== null){
        showResponse("Congratulation " + user.nickName + ", you finished on " + user.totalTime + " seconds");
    }else {
        showResponse("Failed");
    }
    document.getElementById("question").getElementsByTagName("P")[0].innerHTML = "Try again and get a better result";
    timer.stopQTimer();
    let sendButtonRadio = document.getElementById("answerButton").getElementsByTagName("button")[0];
    let sendButtonField = document.getElementById("answerField").getElementsByTagName("button")[0];
    sendButtonRadio.disabled = true;
    sendButtonField.disabled = true;
}

/**
 * Resets the view after game is finished
 */
module.exports.resetGame = function() {
    showResponse();
    displayAnswerSection("none");
    document.getElementById("question").getElementsByTagName("P")[0].innerHTML = "";
    timer.stopQTimer();
    let sendButtonRadio = document.getElementById("answerButton").getElementsByTagName("button")[0];
    let sendButtonField = document.getElementById("answerField").getElementsByTagName("button")[0];
    sendButtonRadio.disabled = false;
    sendButtonField.disabled = false;
    questionNo = 0;
}

/**
 * Displayes the highscore table from web storage
 */
module.exports.showHighscore = function(highscore) {
    let tmp = "";
    for (let i = 0; i < highscore.length; i += 1) {
        tmp += "Name: " + highscore[i].nickName + ".   Total time: " + highscore[i].totalTime + " seconds.<br>";
    }
    document.getElementById("highscore").getElementsByTagName("p")[0].innerHTML = tmp;
    let highScore = document.getElementById("highscore");
    highScore.classList.toggle("hide");
}

/**
 * Displayes the errorlog from web storage
 */
module.exports.showErrorLogs = function(div, logs) {
    if (div.getAttribute("id") === "logs") {
        div.getElementsByTagName("p")[0].innerHTML = logs;
    }
}
