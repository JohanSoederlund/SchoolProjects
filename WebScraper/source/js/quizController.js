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



