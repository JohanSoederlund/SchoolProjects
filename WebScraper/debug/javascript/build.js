(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./quizController.js":4,"./view.js":5}],2:[function(require,module,exports){
/**
 * ajax makes Http requests.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

/**
 * Promise function responsible for Http request,
 * calls the resolve method with the response object if the request was successful
 */
module.exports.request = function(config) {
    return new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        //Event listener triggerd when the server is ready with a response
        req.addEventListener("load", function() {
            if (req.status >= 400) {
                reject(req.status);
            } else {
                resolve(req.responseText);
            }
        });
        //Modifies the request and sends it to the server for process
        req.open(config.method, config.url);
        if (config.method === "POST"){
            req.setRequestHeader("content-type", config.contentType)
            req.send(config.query);
        }
        else {
            req.send();
        }
    });
};

},{}],3:[function(require,module,exports){
/**
 * Starting  point of the application.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

let quizController = require("./quizController.js");

quizController.startGame();

},{"./quizController.js":4}],4:[function(require,module,exports){
/**
 * quizController controlls to flow of the game.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";
const ajax = require("./ajax.js");
const view = require("./view.js");
const webStorage = require("./webbStorage.js");
const timer = require("./Timer.js");

let startButton = document.getElementById("user").getElementsByTagName("button")[0];
let userNameField = document.getElementById("user").getElementsByTagName("input")[0];

/**
 * A user object
 */
let user = {
    nickName: "",
    totalTime: 0
};

/**
 * A config object used in Http request
 */
let ajaxConfig = {
    method: "GET",
    contentType: "application/JSON",
    url: "http://vhost3.lnu.se:20080/question/1",
    query: ""
}

function endGame(result) {
    if (result === "success") {
        //store tot to localStorage if good enough
        webStorage.checkIfHighscore(user, webStorage.getHighscore());
        view.showHighscore(webStorage.getHighscore());
        view.endGame(user);
    } else if (result === "failed") {
        view.showHighscore(webStorage.getHighscore());
        view.endGame(null);
    }
    startButton.disabled = false;
}

module.exports.countdownEnded = function() {
    endGame("failed");
}

/**
 * Calls the promise function in ajax for a Http request,
 * then handeling the response object from the server
 */
function sendGetToServer(config) {
    ajaxConfig.method = "GET";
    ajax.request(config)
        .then(data => {
            let responseObj = JSON.parse(data);
            view.updateQuestion(responseObj);
            if (responseObj.nextURL !== undefined) {
                ajaxConfig.url = responseObj.nextURL;
            }
        })
        .catch(error => {
            let errorMessage = "Network error " + error;
            endGame("failed");
            webStorage.logError(errorMessage);
        });
}

/**
 * Calls the promise function in ajax for a Http request,
 * then handeling the response object from the server
 */
function sendPostToServer(ajaxConfig) {
    ajaxConfig.method = "POST";
    ajax.request(ajaxConfig)
        .then(data => {
            //obs under utveckling
            let responseObj = JSON.parse(data);
            if (responseObj.nextURL !== undefined) {
                ajaxConfig.url = responseObj.nextURL;
                sendGetToServer(ajaxConfig);
                if (responseObj.message !== undefined) {
                    view.showResponse(responseObj.message);
                }
            }else {
                endGame("success");
            }
        })
        .catch(error => {
            let errorMessage = "Network error " + error;
            endGame("failed");
            webStorage.logError(errorMessage);
        });
}

/**
 * Eventhandler for Enter key in the answer filed
 */
let input = document.getElementById("answerField").getElementsByTagName("input")[0];
input.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        let obj = {
            answer: input.value
        };
        ajaxConfig.query = JSON.stringify(obj);
        sendPostToServer(ajaxConfig);
        user.totalTime += timer.stopQTimer();
    }
});

/**
 * Eventhandler mouse click on answer button
 */
let sendButtonField = document.getElementById("answerField").getElementsByTagName("button")[0];
sendButtonField.addEventListener("click", function(event) {
    if (event.buttons === 0) {
        let obj = {
            answer: input.value
        };
        ajaxConfig.query = JSON.stringify(obj);
        sendPostToServer(ajaxConfig);
        user.totalTime += timer.stopQTimer();
    }
});

/**
 * Eventhandler mouse click on answer button
 */
let sendButtonRadio = document.getElementById("answerButton").getElementsByTagName("button")[0];
sendButtonRadio.addEventListener("click", function(event) {
    if (event.buttons === 0) {
        let sendButtonRadioElements = document.getElementById("answerAlternatives").elements;

        let selectedElement = sendButtonRadioElements["radio"].value;
        let obj = {
            answer: selectedElement
        };
        ajaxConfig.query = JSON.stringify(obj);
        sendPostToServer(ajaxConfig);
        view.removeNodes(document.getElementById("answerAlternatives"), document.getElementById("answerAlternatives").getElementsByTagName("input"));
        view.removeNodes(document.getElementById("answerAlternatives"), document.getElementById("answerAlternatives").getElementsByTagName("label"));
        user.totalTime += timer.stopQTimer();
    }
});

module.exports.startGame = function() {
    view.showHighscore(webStorage.getHighscore());
}

/**
 * Resets all necessary parameters after the game is over
 */
let resetGame = function() {
    view.resetGame();
    view.showHighscore(webStorage.getHighscore());

    ajaxConfig = {
        method: "GET",
        contentType: "application/JSON",
        url: "http://vhost3.lnu.se:20080/question/1",
        query: ""
    }
    user = {
        nickName: "",
        totalTime: 0
    };
}

/**
 * Eventhandler for mouse click on button connected to nameInputField
 */
startButton.addEventListener("click", function(event) {
    if (event.type === "click")
    {
        startButton.disabled = true;
        resetGame();
        let input = document.getElementById("user").getElementsByTagName("input")[0];
        user.nickName = input.value;
        sendGetToServer(ajaxConfig);
    }
});

/**
 * Eventhandler for enter key on the name input filed
 */
userNameField.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        startButton.disabled = true;
        resetGame();
        let input = document.getElementById("user").getElementsByTagName("input")[0];
        user.nickName = input.value;
        sendGetToServer(ajaxConfig);
    }
});

/**
 * Eventhandler for navigation,
 * toggles visibility for links and scrolls down to the clicked link
 */
let globalnav = document.querySelector("#globalnav");
globalnav.addEventListener("click", function(event) {
    let div = document.getElementById(event.target.textContent);
    div.classList.toggle("hide");
    if (div.getAttribute("id") === "logs") {
        let div = document.getElementById(event.target.textContent);
        let logs = webStorage.getErrorLogs();
        let tmp = "";
        for (let i = 0; i < logs.length; i += 1) {
            tmp += logs[i] + "<br>";
        }
        view.showErrorLogs(div, tmp);
    }
})




},{"./Timer.js":1,"./ajax.js":2,"./view.js":5,"./webbStorage.js":6}],5:[function(require,module,exports){
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

},{"./Timer.js":1}],6:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvVGltZXIuanMiLCJjbGllbnQvc291cmNlL2pzL2FqYXguanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvcXVpekNvbnRyb2xsZXIuanMiLCJjbGllbnQvc291cmNlL2pzL3ZpZXcuanMiLCJjbGllbnQvc291cmNlL2pzL3dlYmJTdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogU2V0cyB1cCBhIFRpbWVyLlxuICpcbiAqIEBhdXRob3IgSm9oYW4gU8O2ZGVybHVuZFxuICogQHZlcnNpb24gMS4wXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBjb3VudGVyID0gMjA7XG5sZXQgaW50ZXJ2YWxUaW1lcjtcbmNvbnN0IHZpZXcgPSByZXF1aXJlKFwiLi92aWV3LmpzXCIpO1xuY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoXCIuL3F1aXpDb250cm9sbGVyLmpzXCIpO1xuXG4vKipcbiAqIENvdW50ZG93biBtZXRob2QgY2FsbGVkIGV2ZXJ5IHNlY29uZCB0byB1cGRhdGUgdGhlIHRpbWVyIGFuZCBtYWtlIHN1cmUgaXQgd29udCBnbyBiZWxvdyB6ZXJvXG4gKi9cbmZ1bmN0aW9uIGNvdW50ZG93bigpIHtcbiAgICBjb3VudGVyIC09IDE7XG4gICAgdmlldy51cGRhdGVUaW1lcihjb3VudGVyKTtcblxuICAgIGlmICgoY291bnRlciA9PT0gMCkgfHwgKGNvdW50ZXIgPCAwKSkgeyAgIC8vIGxlc3MgdGhhbiAwIGp1c3QgZm9yIHNlY3VyaXR5XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUaW1lcik7XG4gICAgICAgIHZpZXcuaGlkZVRpbWVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXIuY291bnRkb3duRW5kZWQoKTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0dXAgYSBuZXcgdGltZXIgd2l0aCBhIGNvdW50ZG93biBpbnRlcnZhbGwgb2Ygb25lIHNlY29uZFxuICovXG5tb2R1bGUuZXhwb3J0cy5zdGFydFFUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNvdW50ZXIgPSAyMDtcbiAgICBpbnRlcnZhbFRpbWVyID0gc2V0SW50ZXJ2YWwoY291bnRkb3duLCAxMDAwKTtcbiAgICB2aWV3LnNob3dUaW1lcihjb3VudGVyKTtcbiAgICB2aWV3LnVwZGF0ZVRpbWVyKGNvdW50ZXIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdG90YWwgdGltZSBjb25zdW1lZCBhZnRlciBpbml0aWF0aW9uLFxuICogc3RvcHMgYW5kIGNsZWFycyB0aGUgdGltZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMuc3RvcFFUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0aW1lQ29uc3VtZWQgPSAyMCAtIGNvdW50ZXI7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbFRpbWVyKTtcbiAgICBjb3VudGVyID0gMDtcbiAgICB2aWV3LmhpZGVUaW1lcigpO1xuICAgIHJldHVybiB0aW1lQ29uc3VtZWQ7XG59XG4iLCIvKipcbiAqIGFqYXggbWFrZXMgSHR0cCByZXF1ZXN0cy5cbiAqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFByb21pc2UgZnVuY3Rpb24gcmVzcG9uc2libGUgZm9yIEh0dHAgcmVxdWVzdCxcbiAqIGNhbGxzIHRoZSByZXNvbHZlIG1ldGhvZCB3aXRoIHRoZSByZXNwb25zZSBvYmplY3QgaWYgdGhlIHJlcXVlc3Qgd2FzIHN1Y2Nlc3NmdWxcbiAqL1xubW9kdWxlLmV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAvL0V2ZW50IGxpc3RlbmVyIHRyaWdnZXJkIHdoZW4gdGhlIHNlcnZlciBpcyByZWFkeSB3aXRoIGEgcmVzcG9uc2VcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcS5zdGF0dXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9Nb2RpZmllcyB0aGUgcmVxdWVzdCBhbmQgc2VuZHMgaXQgdG8gdGhlIHNlcnZlciBmb3IgcHJvY2Vzc1xuICAgICAgICByZXEub3Blbihjb25maWcubWV0aG9kLCBjb25maWcudXJsKTtcbiAgICAgICAgaWYgKGNvbmZpZy5tZXRob2QgPT09IFwiUE9TVFwiKXtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIGNvbmZpZy5jb250ZW50VHlwZSlcbiAgICAgICAgICAgIHJlcS5zZW5kKGNvbmZpZy5xdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXEuc2VuZCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiLyoqXG4gKiBTdGFydGluZyAgcG9pbnQgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBhdXRob3IgSm9oYW4gU8O2ZGVybHVuZFxuICogQHZlcnNpb24gMS4wXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBxdWl6Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL3F1aXpDb250cm9sbGVyLmpzXCIpO1xuXG5xdWl6Q29udHJvbGxlci5zdGFydEdhbWUoKTtcbiIsIi8qKlxuICogcXVpekNvbnRyb2xsZXIgY29udHJvbGxzIHRvIGZsb3cgb2YgdGhlIGdhbWUuXG4gKlxuICogQGF1dGhvciBKb2hhbiBTw7ZkZXJsdW5kXG4gKiBAdmVyc2lvbiAxLjBcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbmNvbnN0IGFqYXggPSByZXF1aXJlKFwiLi9hamF4LmpzXCIpO1xuY29uc3QgdmlldyA9IHJlcXVpcmUoXCIuL3ZpZXcuanNcIik7XG5jb25zdCB3ZWJTdG9yYWdlID0gcmVxdWlyZShcIi4vd2ViYlN0b3JhZ2UuanNcIik7XG5jb25zdCB0aW1lciA9IHJlcXVpcmUoXCIuL1RpbWVyLmpzXCIpO1xuXG5sZXQgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XG5sZXQgdXNlck5hbWVGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdO1xuXG4vKipcbiAqIEEgdXNlciBvYmplY3RcbiAqL1xubGV0IHVzZXIgPSB7XG4gICAgbmlja05hbWU6IFwiXCIsXG4gICAgdG90YWxUaW1lOiAwXG59O1xuXG4vKipcbiAqIEEgY29uZmlnIG9iamVjdCB1c2VkIGluIEh0dHAgcmVxdWVzdFxuICovXG5sZXQgYWpheENvbmZpZyA9IHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vSlNPTlwiLFxuICAgIHVybDogXCJodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xXCIsXG4gICAgcXVlcnk6IFwiXCJcbn1cblxuZnVuY3Rpb24gZW5kR2FtZShyZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSBcInN1Y2Nlc3NcIikge1xuICAgICAgICAvL3N0b3JlIHRvdCB0byBsb2NhbFN0b3JhZ2UgaWYgZ29vZCBlbm91Z2hcbiAgICAgICAgd2ViU3RvcmFnZS5jaGVja0lmSGlnaHNjb3JlKHVzZXIsIHdlYlN0b3JhZ2UuZ2V0SGlnaHNjb3JlKCkpO1xuICAgICAgICB2aWV3LnNob3dIaWdoc2NvcmUod2ViU3RvcmFnZS5nZXRIaWdoc2NvcmUoKSk7XG4gICAgICAgIHZpZXcuZW5kR2FtZSh1c2VyKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJmYWlsZWRcIikge1xuICAgICAgICB2aWV3LnNob3dIaWdoc2NvcmUod2ViU3RvcmFnZS5nZXRIaWdoc2NvcmUoKSk7XG4gICAgICAgIHZpZXcuZW5kR2FtZShudWxsKTtcbiAgICB9XG4gICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMuY291bnRkb3duRW5kZWQgPSBmdW5jdGlvbigpIHtcbiAgICBlbmRHYW1lKFwiZmFpbGVkXCIpO1xufVxuXG4vKipcbiAqIENhbGxzIHRoZSBwcm9taXNlIGZ1bmN0aW9uIGluIGFqYXggZm9yIGEgSHR0cCByZXF1ZXN0LFxuICogdGhlbiBoYW5kZWxpbmcgdGhlIHJlc3BvbnNlIG9iamVjdCBmcm9tIHRoZSBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gc2VuZEdldFRvU2VydmVyKGNvbmZpZykge1xuICAgIGFqYXhDb25maWcubWV0aG9kID0gXCJHRVRcIjtcbiAgICBhamF4LnJlcXVlc3QoY29uZmlnKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZU9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVF1ZXN0aW9uKHJlc3BvbnNlT2JqKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZU9iai5uZXh0VVJMICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLnVybCA9IHJlc3BvbnNlT2JqLm5leHRVUkw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gXCJOZXR3b3JrIGVycm9yIFwiICsgZXJyb3I7XG4gICAgICAgICAgICBlbmRHYW1lKFwiZmFpbGVkXCIpO1xuICAgICAgICAgICAgd2ViU3RvcmFnZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9KTtcbn1cblxuLyoqXG4gKiBDYWxscyB0aGUgcHJvbWlzZSBmdW5jdGlvbiBpbiBhamF4IGZvciBhIEh0dHAgcmVxdWVzdCxcbiAqIHRoZW4gaGFuZGVsaW5nIHRoZSByZXNwb25zZSBvYmplY3QgZnJvbSB0aGUgc2VydmVyXG4gKi9cbmZ1bmN0aW9uIHNlbmRQb3N0VG9TZXJ2ZXIoYWpheENvbmZpZykge1xuICAgIGFqYXhDb25maWcubWV0aG9kID0gXCJQT1NUXCI7XG4gICAgYWpheC5yZXF1ZXN0KGFqYXhDb25maWcpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgLy9vYnMgdW5kZXIgdXR2ZWNrbGluZ1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlT2JqID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZU9iai5uZXh0VVJMICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLnVybCA9IHJlc3BvbnNlT2JqLm5leHRVUkw7XG4gICAgICAgICAgICAgICAgc2VuZEdldFRvU2VydmVyKGFqYXhDb25maWcpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZU9iai5tZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zaG93UmVzcG9uc2UocmVzcG9uc2VPYmoubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZEdhbWUoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9IFwiTmV0d29yayBlcnJvciBcIiArIGVycm9yO1xuICAgICAgICAgICAgZW5kR2FtZShcImZhaWxlZFwiKTtcbiAgICAgICAgICAgIHdlYlN0b3JhZ2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfSk7XG59XG5cbi8qKlxuICogRXZlbnRoYW5kbGVyIGZvciBFbnRlciBrZXkgaW4gdGhlIGFuc3dlciBmaWxlZFxuICovXG5sZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckZpZWxkXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF07XG5pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogaW5wdXQudmFsdWVcbiAgICAgICAgfTtcbiAgICAgICAgYWpheENvbmZpZy5xdWVyeSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgIHNlbmRQb3N0VG9TZXJ2ZXIoYWpheENvbmZpZyk7XG4gICAgICAgIHVzZXIudG90YWxUaW1lICs9IHRpbWVyLnN0b3BRVGltZXIoKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBFdmVudGhhbmRsZXIgbW91c2UgY2xpY2sgb24gYW5zd2VyIGJ1dHRvblxuICovXG5sZXQgc2VuZEJ1dHRvbkZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbnNlbmRCdXR0b25GaWVsZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBpbnB1dC52YWx1ZVxuICAgICAgICB9O1xuICAgICAgICBhamF4Q29uZmlnLnF1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgc2VuZFBvc3RUb1NlcnZlcihhamF4Q29uZmlnKTtcbiAgICAgICAgdXNlci50b3RhbFRpbWUgKz0gdGltZXIuc3RvcFFUaW1lcigpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEV2ZW50aGFuZGxlciBtb3VzZSBjbGljayBvbiBhbnN3ZXIgYnV0dG9uXG4gKi9cbmxldCBzZW5kQnV0dG9uUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckJ1dHRvblwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbnNlbmRCdXR0b25SYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICBsZXQgc2VuZEJ1dHRvblJhZGlvRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckFsdGVybmF0aXZlc1wiKS5lbGVtZW50cztcblxuICAgICAgICBsZXQgc2VsZWN0ZWRFbGVtZW50ID0gc2VuZEJ1dHRvblJhZGlvRWxlbWVudHNbXCJyYWRpb1wiXS52YWx1ZTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogc2VsZWN0ZWRFbGVtZW50XG4gICAgICAgIH07XG4gICAgICAgIGFqYXhDb25maWcucXVlcnkgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICBzZW5kUG9zdFRvU2VydmVyKGFqYXhDb25maWcpO1xuICAgICAgICB2aWV3LnJlbW92ZU5vZGVzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zd2VyQWx0ZXJuYXRpdmVzXCIpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckFsdGVybmF0aXZlc1wiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpKTtcbiAgICAgICAgdmlldy5yZW1vdmVOb2Rlcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckFsdGVybmF0aXZlc1wiKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJBbHRlcm5hdGl2ZXNcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsYWJlbFwiKSk7XG4gICAgICAgIHVzZXIudG90YWxUaW1lICs9IHRpbWVyLnN0b3BRVGltZXIoKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMuc3RhcnRHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmlldy5zaG93SGlnaHNjb3JlKHdlYlN0b3JhZ2UuZ2V0SGlnaHNjb3JlKCkpO1xufVxuXG4vKipcbiAqIFJlc2V0cyBhbGwgbmVjZXNzYXJ5IHBhcmFtZXRlcnMgYWZ0ZXIgdGhlIGdhbWUgaXMgb3ZlclxuICovXG5sZXQgcmVzZXRHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmlldy5yZXNldEdhbWUoKTtcbiAgICB2aWV3LnNob3dIaWdoc2NvcmUod2ViU3RvcmFnZS5nZXRIaWdoc2NvcmUoKSk7XG5cbiAgICBhamF4Q29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL0pTT05cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzFcIixcbiAgICAgICAgcXVlcnk6IFwiXCJcbiAgICB9XG4gICAgdXNlciA9IHtcbiAgICAgICAgbmlja05hbWU6IFwiXCIsXG4gICAgICAgIHRvdGFsVGltZTogMFxuICAgIH07XG59XG5cbi8qKlxuICogRXZlbnRoYW5kbGVyIGZvciBtb3VzZSBjbGljayBvbiBidXR0b24gY29ubmVjdGVkIHRvIG5hbWVJbnB1dEZpZWxkXG4gKi9cbnN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC50eXBlID09PSBcImNsaWNrXCIpXG4gICAge1xuICAgICAgICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHJlc2V0R2FtZSgpO1xuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXTtcbiAgICAgICAgdXNlci5uaWNrTmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICBzZW5kR2V0VG9TZXJ2ZXIoYWpheENvbmZpZyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogRXZlbnRoYW5kbGVyIGZvciBlbnRlciBrZXkgb24gdGhlIG5hbWUgaW5wdXQgZmlsZWRcbiAqL1xudXNlck5hbWVGaWVsZC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZXNldEdhbWUoKTtcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF07XG4gICAgICAgIHVzZXIubmlja05hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgc2VuZEdldFRvU2VydmVyKGFqYXhDb25maWcpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEV2ZW50aGFuZGxlciBmb3IgbmF2aWdhdGlvbixcbiAqIHRvZ2dsZXMgdmlzaWJpbGl0eSBmb3IgbGlua3MgYW5kIHNjcm9sbHMgZG93biB0byB0aGUgY2xpY2tlZCBsaW5rXG4gKi9cbmxldCBnbG9iYWxuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsb2JhbG5hdlwiKTtcbmdsb2JhbG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcbiAgICBkaXYuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgaWYgKGRpdi5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gXCJsb2dzXCIpIHtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCk7XG4gICAgICAgIGxldCBsb2dzID0gd2ViU3RvcmFnZS5nZXRFcnJvckxvZ3MoKTtcbiAgICAgICAgbGV0IHRtcCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9ncy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdG1wICs9IGxvZ3NbaV0gKyBcIjxicj5cIjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3LnNob3dFcnJvckxvZ3MoZGl2LCB0bXApO1xuICAgIH1cbn0pXG5cblxuXG4iLCIvKipcbiAqIFZpZXcgZnVuY3Rpb25zLlxuICpcbiAqIEBhdXRob3IgSm9oYW4gU8O2ZGVybHVuZFxuICogQHZlcnNpb24gMS4wXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCB0aW1lciA9IHJlcXVpcmUoXCIuL1RpbWVyLmpzXCIpO1xuXG5sZXQgcXVlc3Rpb25ObyA9IDA7XG5cbi8qKlxuICogVml2aWJpbGl0eSBmb3Igc2VjdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBxdWVzdGlvbiB0eXBlXG4gKi9cbmZ1bmN0aW9uIGRpc3BsYXlBbnN3ZXJTZWN0aW9uKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJ0ZXh0XCIpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckFsdGVybmF0aXZlc1wiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJBbHRlcm5hdGl2ZXNcIikuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zd2VyRmllbGRcIikuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zd2VyRmllbGRcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgfWVsc2UgaWYgKHR5cGUgPT09IFwiYWx0ZXJuYXRpdmVzXCIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJBbHRlcm5hdGl2ZXNcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zd2VyQWx0ZXJuYXRpdmVzXCIpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICAgIH1lbHNle1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckZpZWxkXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckZpZWxkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckFsdGVybmF0aXZlc1wiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJBbHRlcm5hdGl2ZXNcIikuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIHVwZGF0ZXMgdGhlIHF1ZXN0aW9uXG4gKi9cbm1vZHVsZS5leHBvcnRzLnVwZGF0ZVF1ZXN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWVzdGlvblwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlBcIilbMF0uaW5uZXJIVE1MID0gb2JqLnF1ZXN0aW9uO1xuXG4gICAgaWYgKG9iai5hbHRlcm5hdGl2ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkaXNwbGF5QW5zd2VyU2VjdGlvbihcImFsdGVybmF0aXZlc1wiKTtcbiAgICAgICAgbGV0IGFsdGVybmF0aXZlcyA9IG9iai5hbHRlcm5hdGl2ZXM7XG4gICAgICAgIGxldCByYWRpb0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zd2VyQWx0ZXJuYXRpdmVzXCIpO1xuICAgICAgICBsZXQgc2l6ZSA9IE9iamVjdC5rZXlzKGFsdGVybmF0aXZlcykubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gc2l6ZSAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgICBsZXQgbGluZWJyZWFrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgICAgbGluZWJyZWFrLmlubmVySFRNTCA9IFwiPC9icj4gIFwiO1xuICAgICAgICAgICAgcmFkaW9EaXYuaW5zZXJ0QmVmb3JlKGxpbmVicmVhaywgcmFkaW9EaXYuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSBcIiAgXCIgKyBPYmplY3QudmFsdWVzKGFsdGVybmF0aXZlcylbaV07XG4gICAgICAgICAgICByYWRpb0Rpdi5pbnNlcnRCZWZvcmUobGFiZWwsIHJhZGlvRGl2LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgbGV0IHJhZGlvQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgcmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xuICAgICAgICAgICAgcmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInJhZGlvXCIpO1xuICAgICAgICAgICAgcmFkaW9CdXR0b24udmFsdWUgPSBPYmplY3Qua2V5cyhhbHRlcm5hdGl2ZXMpW2ldO1xuICAgICAgICAgICAgcmFkaW9EaXYuaW5zZXJ0QmVmb3JlKHJhZGlvQnV0dG9uLCByYWRpb0Rpdi5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXlBbnN3ZXJTZWN0aW9uKFwidGV4dFwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnZhbHVlID0gXCJcIjtcbiAgICB9XG4gICAgdGltZXIuc3RhcnRRVGltZXIoKTtcbn1cblxuLyoqXG4gKiBTaG93cyB0aGUgc2VydmVyIHJlc3BvbnNlIHRvIHRoZSB1c2VyLFxuICogcmlnaHQgb3Igd3JvbmcgYW5zd2VyXG4gKi9cbmxldCBzaG93UmVzcG9uc2UgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgbGV0IHJlc3BvbnNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXNwb25zZVwiKTtcbiAgICBpZiAodGV4dCA9PT0gXCJGYWlsZWRcIikge1xuICAgICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LnJlbW92ZShcImdyZWVuXCIpO1xuICAgICAgICByZXNwb25zZS5jbGFzc0xpc3QuYWRkKFwicmVkXCIpO1xuICAgICAgICByZXNwb25zZS5pbm5lckhUTUwgPSBcIlNvcnJ5LCB5b3UgZmFpbGVkXCIgKyBcIjxicj5cIiA7XG4gICAgfSBlbHNlIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LmFkZChcImdyZWVuXCIpO1xuICAgICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwicmVkXCIpO1xuICAgICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgcXVlc3Rpb25ObyA9IHF1ZXN0aW9uTm8gKyAxO1xuICAgICAgICByZXNwb25zZS5pbm5lckhUTUwgKz0gXCJRdWVzdGlvbiBcIiArIHF1ZXN0aW9uTm8gKyBcIiAgXCIgKyB0ZXh0ICsgXCI8YnI+XCIgO1xuICAgIH1lbHNlIHtcbiAgICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIHJlc3BvbnNlLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxufVxuXG4vKipcbiAqIGV4cG9ydGVkIHNob3dSZXNwb25zZSBtZXRob2RcbiAqL1xubW9kdWxlLmV4cG9ydHMuc2hvd1Jlc3BvbnNlID0gZnVuY3Rpb24odGV4dCl7XG4gICAgc2hvd1Jlc3BvbnNlKHRleHQpO1xufVxuXG4vKipcbiAqIFNob3dzIHRoZSBjb3VudGRvd24gdGltZXIgd2hlbiBhIHF1ZXN0aW9uIGFwcGVhcnNcbiAqL1xubW9kdWxlLmV4cG9ydHMuc2hvd1RpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aW1lclwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbn1cblxuLyoqXG4gKiBIaWRlcyB0aGUgY291bnRkb3duIHRpbWVyXG4gKi9cbm1vZHVsZS5leHBvcnRzLmhpZGVUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGltZXJcIikuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG59XG5cbi8qKlxuICogUmVkIHN0eWxlIGZvciB0aGUgdGltZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMudXBkYXRlVGltZXIgPSBmdW5jdGlvbihjb3VudGVyKSB7XG4gICAgbGV0IHNlY29uZHNSZW1haW5pbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpLnF1ZXJ5U2VsZWN0b3IoXCIuc2Vjb25kc1wiKTtcbiAgICBpZiAoY291bnRlciA9PT0gNSkge1xuICAgICAgICBzZWNvbmRzUmVtYWluaW5nLmNsYXNzTGlzdC5hZGQoXCJyZWRcIik7XG4gICAgfWVsc2UgaWYgKGNvdW50ZXIgPiA1KSB7XG4gICAgICAgIGlmIChzZWNvbmRzUmVtYWluaW5nLmNsYXNzTGlzdC5jb250YWlucyhcInJlZFwiKSkge1xuICAgICAgICAgICAgc2Vjb25kc1JlbWFpbmluZy5jbGFzc0xpc3QucmVtb3ZlKFwicmVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNlY29uZHNSZW1haW5pbmcudGV4dENvbnRlbnQgPSBjb3VudGVyO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgRE9NIGVsZW1lbnRzLFxuICogKHJhZGlvYnV0dG9ucyBmb3Igb2xkIHF1ZXN0aW9ucylcbiAqL1xubW9kdWxlLmV4cG9ydHMucmVtb3ZlTm9kZXMgPSBmdW5jdGlvbihub2RlLCBub2RlTGlzdCkge1xuICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVMaXN0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKXtcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSk7XG4gICAgfVxufVxuXG4vKipcbiAqIERpc3BsYXkgcmVzdWx0IGFmdGVyIHRoZSBnYW1lIGlzIGZpbmlzaGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzLmVuZEdhbWUgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgc2hvd1Jlc3BvbnNlKCk7XG4gICAgZGlzcGxheUFuc3dlclNlY3Rpb24oXCJub25lXCIpO1xuICAgIGlmICh1c2VyICE9PSB1bmRlZmluZWQgJiYgdXNlciAhPT0gbnVsbCl7XG4gICAgICAgIHNob3dSZXNwb25zZShcIkNvbmdyYXR1bGF0aW9uIFwiICsgdXNlci5uaWNrTmFtZSArIFwiLCB5b3UgZmluaXNoZWQgb24gXCIgKyB1c2VyLnRvdGFsVGltZSArIFwiIHNlY29uZHNcIik7XG4gICAgfWVsc2Uge1xuICAgICAgICBzaG93UmVzcG9uc2UoXCJGYWlsZWRcIik7XG4gICAgfVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVlc3Rpb25cIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJQXCIpWzBdLmlubmVySFRNTCA9IFwiVHJ5IGFnYWluIGFuZCBnZXQgYSBiZXR0ZXIgcmVzdWx0XCI7XG4gICAgdGltZXIuc3RvcFFUaW1lcigpO1xuICAgIGxldCBzZW5kQnV0dG9uUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckJ1dHRvblwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbiAgICBsZXQgc2VuZEJ1dHRvbkZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbiAgICBzZW5kQnV0dG9uUmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHNlbmRCdXR0b25GaWVsZC5kaXNhYmxlZCA9IHRydWU7XG59XG5cbi8qKlxuICogUmVzZXRzIHRoZSB2aWV3IGFmdGVyIGdhbWUgaXMgZmluaXNoZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMucmVzZXRHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgc2hvd1Jlc3BvbnNlKCk7XG4gICAgZGlzcGxheUFuc3dlclNlY3Rpb24oXCJub25lXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVlc3Rpb25cIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJQXCIpWzBdLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGltZXIuc3RvcFFUaW1lcigpO1xuICAgIGxldCBzZW5kQnV0dG9uUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc3dlckJ1dHRvblwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbiAgICBsZXQgc2VuZEJ1dHRvbkZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnN3ZXJGaWVsZFwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcbiAgICBzZW5kQnV0dG9uUmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBzZW5kQnV0dG9uRmllbGQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBxdWVzdGlvbk5vID0gMDtcbn1cblxuLyoqXG4gKiBEaXNwbGF5ZXMgdGhlIGhpZ2hzY29yZSB0YWJsZSBmcm9tIHdlYiBzdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNob3dIaWdoc2NvcmUgPSBmdW5jdGlvbihoaWdoc2NvcmUpIHtcbiAgICBsZXQgdG1wID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhpZ2hzY29yZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0bXAgKz0gXCJOYW1lOiBcIiArIGhpZ2hzY29yZVtpXS5uaWNrTmFtZSArIFwiLiAgIFRvdGFsIHRpbWU6IFwiICsgaGlnaHNjb3JlW2ldLnRvdGFsVGltZSArIFwiIHNlY29uZHMuPGJyPlwiO1xuICAgIH1cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBcIilbMF0uaW5uZXJIVE1MID0gdG1wO1xuICAgIGxldCBoaWdoU2NvcmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZVwiKTtcbiAgICBoaWdoU2NvcmUuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG59XG5cbi8qKlxuICogRGlzcGxheWVzIHRoZSBlcnJvcmxvZyBmcm9tIHdlYiBzdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNob3dFcnJvckxvZ3MgPSBmdW5jdGlvbihkaXYsIGxvZ3MpIHtcbiAgICBpZiAoZGl2LmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBcImxvZ3NcIikge1xuICAgICAgICBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwXCIpWzBdLmlubmVySFRNTCA9IGxvZ3M7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBTdG9yZXMgZGF0YSBpbiBXZWJzdG9yYWdlcy5cbiAqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEdldCBoaWdoc2NvcmUgbGlzdCBmcm9tIHdlYnN0b3JhZ2UgYW5kIHJldHVybnMgaXRcbiAqL1xubW9kdWxlLmV4cG9ydHMuZ2V0SGlnaHNjb3JlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGhpZ2hzY29yZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJoaWdoc2NvcmVcIikpO1xuICAgIGlmIChoaWdoc2NvcmUgPT09IG51bGwpIHtcbiAgICAgICAgaGlnaHNjb3JlID0gW107XG4gICAgfVxuICAgIHJldHVybiBoaWdoc2NvcmU7XG59XG5cbi8qKlxuICogQ29udHJvbHMgdGhlIHJlc3VsdCB0byBwcmV2aW91cyBoaWdoc2NvcmUgYW5kIHB1c2hlcyB0aGUgcmVzdWx0IGludG8gdGhlIG5ldyBsaXN0IGlmIGdvb2QgZW5vdWdoXG4gKi9cbm1vZHVsZS5leHBvcnRzLmNoZWNrSWZIaWdoc2NvcmUgPSBmdW5jdGlvbih1c2VyLCBoaWdoc2NvcmUpIHtcbiAgICBpZiAoaGlnaHNjb3JlLmxlbmd0aCA8IDUpIHtcbiAgICAgICAgaGlnaHNjb3JlLnB1c2godXNlcik7XG4gICAgICAgIGhpZ2hzY29yZSA9IGhpZ2hzY29yZS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtyZXR1cm4gYS50b3RhbFRpbWUgLSBiLnRvdGFsVGltZTt9KTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJoaWdoc2NvcmVcIiwgSlNPTi5zdHJpbmdpZnkoaGlnaHNjb3JlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhpZ2hzY29yZVs0XS50b3RhbFRpbWUgPiB1c2VyLnRvdGFsVGltZSkge1xuICAgICAgICAgICAgaGlnaHNjb3JlLnBvcCgpO1xuICAgICAgICAgICAgaGlnaHNjb3JlLnB1c2godXNlcik7XG4gICAgICAgICAgICBoaWdoc2NvcmUgPSBoaWdoc2NvcmUuc29ydChmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEudG90YWxUaW1lIC0gYi50b3RhbFRpbWU7fSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImhpZ2hzY29yZVwiLCBKU09OLnN0cmluZ2lmeShoaWdoc2NvcmUpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBMb2dzIHRoZSBlcnJvciB0byB0aGUgbGlzdCBpbiB3ZWJzdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLmxvZ0Vycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBsZXQgZXJyb3JMb2cgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZXJyb3JMb2dcIikpO1xuICAgIGlmIChlcnJvckxvZyA9PT0gbnVsbCkge1xuICAgICAgICBlcnJvckxvZyA9IFtdO1xuICAgIH1cbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZXJyb3JMb2cucHVzaChlcnJvciArIFwiIC0gXCIgKyBkYXRlKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVycm9yTG9nXCIsIEpTT04uc3RyaW5naWZ5KGVycm9yTG9nKSk7XG59XG5cbi8qKlxuICogcmV0dXJucyB0aGUgd2hvbGUgbGlzdCBvZiBsb2dnZXMgZXJyb3JzXG4gKi9cbm1vZHVsZS5leHBvcnRzLmdldEVycm9yTG9ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBlcnJvckxvZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJlcnJvckxvZ1wiKSk7XG4gICAgaWYgKGVycm9yTG9nID09PSBudWxsKSB7XG4gICAgICAgIGVycm9yTG9nID0gW107XG4gICAgfVxuICAgIHJldHVybiBlcnJvckxvZztcbn1cbiJdfQ==
