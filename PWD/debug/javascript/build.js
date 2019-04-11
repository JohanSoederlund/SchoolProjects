(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Chat window
 *
 * @author Johan Söderlund
 * @version 1.0
 */

const genericAppWindow = require('./genericAppWindow.js');
const webStorage = require("./webStorage");
class Chat {

    /**
     * Constructs an object of Chat.
     *
     * @param {string} userName - The nickname of the user.
     */
    constructor(userName) {
        this._incomingMessage = document.querySelector('#incoming-message');
        this._socketConfig = {
            type: "message",
            data: "",
            username: userName,
            channel: "Channel1",
            key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }
        this._myInstance = genericAppWindow.appWindow("Chat");
        this.setupChat();
        this.setupSelect();
        this._socket = this.createSocket("ws://vhost3.lnu.se:20080/socket/");
    }

    /**
     * Instantiates the appboard.
     */
    setupChat(){
        let chatApplication = document.getElementById("app-chat");
        let appBoard = this._myInstance.querySelector(".app-board");
        let clone = document.importNode(chatApplication.content, true);
        appBoard.appendChild(clone);
        appBoard.addEventListener("click", this.LMB.bind(this));
        appBoard.addEventListener("keyup", this.keyUp.bind(this));
    }

    /**
     * Triggered when LFM is pressed.
     *
     * @param {event} event - the left mouse button down event
     */
    LMB(event) {
        if (event.which === 1 && event.target.nodeName === "INPUT") {
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            event.target.value = "";
        }
    }
    /**
     * Triggered when a key is released.
     * Sends the typed message, username and other config information to server
     *
     * @param {event} event - key event, (enter)
     */
    keyUp(event){
        if (event.keyCode === 13 && event.target.nodeName === "TEXTAREA") {
            let inputText = event.target.value;
            this._socketConfig.data = inputText;
            this._socket.send(JSON.stringify(this._socketConfig));
            event.target.value = "";
        }
    }
    /**
     * Creates a websocket to handle chat traffic, smoother protocol
     *
     * @param {String} url - the url to pass on data traffic
     */
    createSocket(url) {
        let socket = new WebSocket(url, 'charcords');
        socket.addEventListener('open', function (event) {
        });
        socket.addEventListener('message', this.recieve.bind(this));
        return socket;
    }
    /**
     * Recieves the server message, sent, recieved and pulses
     *
     * @param {event} event - server message
     */
    recieve(event) {
        let message = JSON.parse(event.data);
        if (message.type === 'message') {
            let messageFeed = this._myInstance.querySelector(".message-feed");
            let clone = document.importNode(this._incomingMessage.content, true);
            messageFeed.appendChild(clone);

            let date = new Date();
            let headLine = message.username + "   " + date.getFullYear() + "-" + (date.getMonth() + 1)
                + "-" + date.getDate() + "   " + date.getHours() + ":" + date.getMinutes();
            let storeMessage = {
                headLine: headLine,
                date: new Date(),
                username: message.username,
                data: message.data
            }
            messageFeed.getElementsByTagName("p")[(messageFeed.getElementsByTagName("p").length - 1)].textContent = headLine;
            messageFeed.getElementsByTagName("textarea")[(messageFeed.getElementsByTagName("textarea").length - 1)].textContent = message.data;
            messageFeed.scrollTop = messageFeed.scrollHeight;
            webStorage.addMessage(storeMessage, webStorage.getLog());
        }
    }
    //close
    closeSocket(){
        this._socket.close();
    }
    /**
     * Handles selected item in drop down menu
     *
     * @param {event} event - drop down menu item choosen
     */
    chatReconfig(event){
        let messageFeed = this._myInstance.querySelectorAll(".message-feed")[0];
        if (event.target.options[event.target.selectedIndex].value === "clear") {
            messageFeed.innerHTML = "";
        } else if (event.target.options[event.target.selectedIndex].value === "get last messages") {
            messageFeed.innerHTML = "";
            let messageLog = webStorage.getLog();
            for (let i = 0; i < messageLog.length; i += 1) {
                let clone = document.importNode(this._incomingMessage.content, true);
                messageFeed.appendChild(clone);
                messageFeed.getElementsByTagName("p")[(messageFeed.getElementsByTagName("p").length - 1)].textContent = messageLog[i].headLine;
                messageFeed.getElementsByTagName("textarea")[(messageFeed.getElementsByTagName("textarea").length - 1)].textContent = messageLog[i].data;
                messageFeed.scrollTop = messageFeed.scrollHeight;
            }
        } else if (event.target.options[event.target.selectedIndex].value === "select new nick") {
            document.querySelector("#login-container").classList.add("show");
        }
    }
    /**
     * Setup drop down menu
     */
    setupSelect() {
        let select = this._myInstance.getElementsByTagName("select")[0];
        let template = document.querySelector('#options');
        let clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option1 = select.getElementsByTagName("option")[0];
        option1.value = option1.textContent = "clear";

        clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option2 = select.getElementsByTagName("option")[1];
        option2.value = option2.textContent = "get last messages";

        clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option3 = select.getElementsByTagName("option")[2];
        option3.value = option3.textContent = "select new nick";

        select.options[0].selected = true;
        select.addEventListener("change", this.chatReconfig.bind(this));
    }
}

/**
 *  Exports.
 */
module.exports = Chat;

},{"./genericAppWindow.js":7,"./webStorage":8}],2:[function(require,module,exports){
/**
 * Game 15
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

const genericAppWindow = require("./genericAppWindow.js");

class Game15 {

    /**
     * Constructs an object of Game15.
     */
    constructor() {
        this._rows = 4;
        this._columns = 4;
        this._pawns = this._rows * this._columns;
        this._numberOfTrials = 0;
        this._pawnPositions = this.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], this._pawns);
        this._myInstance = genericAppWindow.appWindow("Game15");
        this.setupSelect();
        this.setupGame15();
    }
    /**
     * Generic shuffle method
     *
     * @param {array} arrayToShuffle - the array to be manipulated
     * @param {number} max - length
     */
    shuffle(arrayToShuffle, max) {
        for (let i = max; i; i = i - 1) {
            let j = Math.floor(Math.random() * i);
            [arrayToShuffle[i - 1], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i - 1]];
        }
        return arrayToShuffle;
    }
    /**
     * Setup appboard
     */
    setupGame15(){
        let memoryCard = document.getElementById("memory-card");
        let appBoard = this._myInstance.querySelector(".app-board");
        for (let i = 0; i < this._rows * this._columns; i += 1) {
            let clone = document.importNode(memoryCard.content, true);
            appBoard.appendChild(clone);
            appBoard.querySelectorAll(".img-card")[i].setAttribute("data-bord-position", i);
            appBoard.querySelectorAll(".img-card")[i].setAttribute("src", "./image/game15/" + this._pawnPositions[i] + ".gif");
        }
        appBoard.addEventListener("click", this.LMB.bind(this));
        appBoard.addEventListener("keyup", this.keyUp.bind(this));
    }
    /**
     * swaps positions in array
     *
     * @param {number} index - to be swaped
     * @param {number} pawn - swap
     */
    setNumberPawn(index, pawn) {
        if ((index >= 0 && index < this._pawnPositions.length))
            this._pawnPositions[index] = pawn;
    }
    /**
     * returns number from array
     *
     * @param {number} index
     * @return {number} this._pawnPositions[index] - pawn on specific pos
     */
    getNumberPawn(index) {
        if ((index >= 0 && index < this._pawnPositions.length))
            return this._pawnPositions[index];
    }
    /**
     * Checks empty pawn and returns index
     *
     * @param {number} i - index
     * @return {number} this._pawnPositions[index] - pawn on specific pos
     */
    getEmptyPawn(){
        for (let i = 0; i < this._pawns; i = i + 1) {
            if (this._pawnPositions[i] === 0)
                return i;
        }
        return 0;
    }
    /**
     * Checks board pos of selected pawn
     *
     * @param {number} i - index
     */
    pawnSelected(image) {
        let tablePos = image.getAttribute("data-bord-position");
        // is pawn neighbour to blank
        let idxPawnToMove = parseInt(tablePos);
        let idxEmptyPawn = this.getEmptyPawn();
        let appBoard = this._myInstance.querySelector(".app-board");
        // check if directly beside
        if (Math.floor(idxPawnToMove / 4) == Math.floor(idxEmptyPawn / 4)){
            if ((idxPawnToMove + 1 === idxEmptyPawn) ||
                (idxEmptyPawn + 1 === idxPawnToMove)) {
                appBoard.querySelectorAll(".img-card")[idxEmptyPawn].setAttribute("src", "image/game15/" + this.getNumberPawn(idxPawnToMove) + ".gif");
                appBoard.querySelectorAll(".img-card")[idxPawnToMove].setAttribute("src", "image/game15/" + this.getNumberPawn(idxEmptyPawn) + ".gif");
                let pawnTemp = this.getNumberPawn(idxPawnToMove);
                this.setNumberPawn(idxPawnToMove, this.getNumberPawn(idxEmptyPawn));
                this.setNumberPawn(idxEmptyPawn, pawnTemp);
                this._numberOfTrials += 1;
            }
        }
        // check if directly above or below
        if (((idxPawnToMove + 4) === idxEmptyPawn) ||
            ((idxEmptyPawn + 4) === idxPawnToMove)) {
            appBoard.querySelectorAll(".img-card")[idxEmptyPawn].setAttribute("src", "image/game15/" + this.getNumberPawn(idxPawnToMove) + ".gif");
            appBoard.querySelectorAll(".img-card")[idxPawnToMove].setAttribute("src", "image/game15/" + this.getNumberPawn(idxEmptyPawn) + ".gif");
            let pawnTemp = this.getNumberPawn(idxPawnToMove);
            this.setNumberPawn(idxPawnToMove, this.getNumberPawn(idxEmptyPawn));
            this.setNumberPawn(idxEmptyPawn, pawnTemp);
            this._numberOfTrials += 1;
        }
        this.checkDone();
    }

    /**
     * Triggered when a key is released.
     *
     * @param {event} event - key event, (enter)
     */
    keyUp(event) {
        if (event.keyCode === 13 && event.target.nodeName === "A"){
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            this.pawnSelected(event.target.getElementsByTagName("img")[0]);
        }
    }
    /**
     * Triggered when LMB is pressed
     *
     * @param {event} event - LMB
     */
    LMB(event) {
        if (event.which === 1 && event.target.nodeName === "IMG"){
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            this.pawnSelected(event.target);
        }
    }
    /**
     * Check if game is finnished
     */
    checkDone() {
        for (let i = 1; i < this._pawns; i += 1) {
            if (this.getNumberPawn(i - 1) !== i) {
                return false;
            }
        }
        let clone = document.importNode(document.getElementById("result").content, true);
        this._myInstance.appendChild(clone);
        this._myInstance.querySelectorAll(".result p")[0].textContent = "You made it in " + this._numberOfTrials + " trials";
        return true;
    }
    /**
     * reconfig game 15
     *
     * @param {event} event - drop down item restart option
     */
    game15Reconfig(event){
        if (event.target.options[event.target.selectedIndex].value === "restart") {
            let appBoard = this._myInstance.querySelector(".app-board");
            while (appBoard.hasChildNodes()) {
                appBoard.removeChild(appBoard.lastChild);
            }
            this._pawnPositions = this.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], this._pawns);
            this._numberOfTrials = 0;
            this.setupGame15();
            let select = this._myInstance.getElementsByTagName("select")[0];
            select.options[0].selected = true;
        }
    }
    /**
     * Setup selection drop down menu
     */
    setupSelect() {
        let select = this._myInstance.getElementsByTagName("select")[0];
        let template = document.querySelector("#options");
        let clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option1 = select.getElementsByTagName("option")[0];
        option1.value = option1.textContent = "run";

        clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option2 = select.getElementsByTagName("option")[1];
        option2.value = option2.textContent = "restart";

        select.options[0].selected = true;
        select.addEventListener("change", this.game15Reconfig.bind(this));
    }
}

/**
 *  Exports.
 */
module.exports = Game15;

},{"./genericAppWindow.js":7}],3:[function(require,module,exports){
/**
 * About window
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";
const genericAppWindow = require('./genericAppWindow.js');
class Info {

    /**
     * Constructs an object of Memory.
     */
    constructor() {
        this._myInstance = genericAppWindow.appWindow("Info");
        this._myInstance.querySelector(".app-minimize").classList.add("hide");
        this._myInstance.querySelector(".drop-down").classList.add("hide");
        this.setup();
    }

    /**
     * Setup for info window
     */
    setup() {
        let template = document.querySelector('#app-info');
        let clone = document.importNode(template.content, true);
        this._myInstance.appendChild(clone);
        this._myInstance.classList.add("info-size");
    }

}

/**
 *  Exports.
 */
module.exports = Info;


},{"./genericAppWindow.js":7}],4:[function(require,module,exports){
/**
 * Memory app
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";
const genericAppWindow = require('./genericAppWindow.js');
class Memory {

    /**
     * Constructs an object of Memory.
     */
    constructor() {
        this._rows = 4;
        this._columns = 4;
        this._numberOfTrials = 0;
        this._cardPositions = this.shuffle([0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7], 16);
        this._turnedCards = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
        this._myInstance = genericAppWindow.appWindow("Memory");
        this.setupSelect();
        this.setupMemoryGrid();
        this._turnedCardOne = undefined;
        this._turnedCardTwo = undefined;
        this._t1 = undefined;
        this._t2 = undefined;
    }
    /**
     * Generic shuffle method
     *
     * @param {array} arrayToShuffle - the array to be manipulated
     * @param {number} max - length
     */
    shuffle(arrayToShuffel, max) {
        for (let i = max; i; i = i - 1) {
            let j = Math.floor(Math.random() * i);
            [arrayToShuffel[i - 1], arrayToShuffel[j]] = [arrayToShuffel[j], arrayToShuffel[i - 1]];
        }
        return arrayToShuffel;
    }
    /**
     * Image to turn face up
     *
     * @param {element} image - clicked image
     */
    cardSelected(image) {
        let tablePos = image.getAttribute("data-bord-position");
        let imageID = this._cardPositions[tablePos];
        if (this._turnedCards[tablePos] === false) {
            if (this._turnedCardOne === undefined) {
                this._t1 = image;
                this._turnedCardOne = tablePos;
                let imageSrc = "./image/memory/" + imageID + ".png";
                image.setAttribute("src", imageSrc);
                this._turnedCards[tablePos] = true;
            } else if (this._turnedCardTwo === undefined) {
                this._t2 = image;
                this._turnedCardTwo = tablePos;
                let imageSrc = "./image/memory/" + imageID + ".png";
                image.setAttribute("src", imageSrc);
                this._turnedCards[tablePos] = true;
                this._numberOfTrials += 1;
                if (this._cardPositions[this._turnedCardOne] === this._cardPositions[this._turnedCardTwo]) {
                    setTimeout(this.removeMatchedCards.bind(this), 500);
                    this.checkDone();
                } else {
                    setTimeout(this.closeTurnedCards.bind(this), 1000);
                }
            }
        }
    }
    /**
     * Triggered when a key is released.
     *
     * @param {event} event - key event, (enter)
     */
    keyUp(event) {
        if (event.keyCode === 13 && event.target.nodeName === "A"){
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            this.cardSelected(event.target.getElementsByTagName("img")[0]);
        }
    }
    /**
     * Triggered when LMB is pressed
     *
     * @param {event} event - LMB
     */
    LMB(event) {
        if (event.which === 1 && event.target.nodeName === "IMG"){
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            this.cardSelected(event.target);
        }
    }
    /**
     * Check if game is finnished
     */
    checkDone() {
        for (let i = 0; i < this._rows * this._columns; i = i + 1) {
            if (this._turnedCards[i] === false) {
                return false;
            }
        }
        let clone = document.importNode(document.getElementById("result").content, true);
        this._myInstance.appendChild(clone);
        this._myInstance.querySelectorAll(".result p")[0].textContent = "You made it in " + this._numberOfTrials + " trials";
        this._myInstance.querySelector(".app-board").classList.add("hide");
        return true;
    }
    /**
     * Turns card face down
     */
    closeTurnedCards() {
        this._t1.setAttribute("src", "./image/memory/blank.png");
        this._t2.setAttribute("src", "./image/memory/blank.png");
        this._turnedCards[this._turnedCardOne] = false;
        this._turnedCards[this._turnedCardTwo] = false;
        this._turnedCardOne = undefined;
        this._turnedCardTwo = undefined;
    }
    /**
     * Removes matching cards
     */
    removeMatchedCards() {
        this._t1.setAttribute("src", "");
        this._t2.setAttribute("src", "");
        this._turnedCardOne = undefined;
        this._turnedCardTwo = undefined;
    }
    /**
     * Setup pawns on memory grid
     */
    setupMemoryGrid(){
        let memoryCard = document.getElementById("memory-card");
        let appBoard = this._myInstance.querySelector(".app-board");
        for (let i = 0; i < this._rows * this._columns; i += 1) {
            let clone = document.importNode(memoryCard.content, true);
            appBoard.appendChild(clone);
            appBoard.querySelectorAll(".img-card")[i].setAttribute("data-bord-position", i);
        }
        window.location.hash = "#" + this._myInstance.getAttribute("id");
        this._myInstance.focus();
        appBoard.addEventListener("click", this.LMB.bind(this));
        appBoard.addEventListener("keyup", this.keyUp.bind(this));
    }
    /**
     * reconfigurates the setup of pawns on memory grid
     */
    memoryGridReconfig(event) {
        let appBoard = this._myInstance.querySelector(".app-board");
        while (appBoard.hasChildNodes()) {
            appBoard.removeChild(appBoard.lastChild);
        }

        if (event.target.options[event.target.selectedIndex].value === " 4 * 2") {
            this._rows = 4;
            this._columns = 2;
        }
        else if (event.target.options[event.target.selectedIndex].value === " 4 * 3") {
            this._rows = 4;
            this._columns = 3;
        }
        else if (event.target.options[event.target.selectedIndex].value === " 4 * 4") {
            this._rows = 4;
            this._columns = 4;
        }
        this._cardPositions = this.shuffle([0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7], this._rows * this._columns);
        this._turnedCards = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
        this.setupMemoryGrid();
    }
    /**
     * Setup for drop down menu
     */
    setupSelect() {
        let select = this._myInstance.getElementsByTagName("select")[0];
        let template = document.querySelector("#options");
        for (let i = 0; i < 3; i += 1) {
            let clone = document.importNode(template.content, true);
            select.appendChild(clone);
            let option = select.getElementsByTagName("option")[i];
            let val = i + 2;
            option.value = option.textContent = " 4 * " + val;
        }
        select.options[2].selected = true;
        select.addEventListener("change", this.memoryGridReconfig.bind(this));
    }
}

/**
 *  Exports.
 */
module.exports = Memory;

},{"./genericAppWindow.js":7}],5:[function(require,module,exports){
/**
 * Controller
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

const Memory = require("./Memory.js");
const Chat = require("./Chat.js");
const Game15 = require("./Game15.js");
const Info = require("./Info.js");
const genericAppWindow = require("./genericAppWindow.js");
const webStorage = require("./webStorage");

class PWD {

    /**
     * Constructs an object of PWD.
     */
    constructor() {
        this._chatArr = [];
        this._userName = undefined;
        this._signIn = true;
        this._movingWindow = undefined;
        this._cursorRelPosX = undefined;
        this._cursorRelPosY = undefined;
        this._mouseMoveEventListener = undefined;
        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this), false);
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        document.addEventListener("keyup", this.keyUp.bind(this));
    }
    /**
     * repositions the window to mouse position
     *
     * @param {event} event - the mouse move event
     */
    reposition(event){
        let innerWidth = window.innerWidth;
        let innerHeight = window.innerHeight;
        let newX = event.clientX;
        let newY = event.clientY;
        if ((newX < innerWidth) && (newY < innerHeight) && (newY > 60)) {
            this._movingWindow.style.top = newY + 'px';
            this._movingWindow.style.left = newX - this._cursorRelPosX + 'px';
            this._movingWindow.style.top = newY - this._cursorRelPosY + 'px';
        }
    }

    /**
     * Triggered when LFM on a application top bar and calls reposition.
     *
     * @param {event} event - the mouse move event
     */
    mouseMove(event) {
        if (this._movingWindow !== undefined) {
            event.preventDefault();
            this.reposition(event);
        }
    }
    /**
     * Triggered when LFM is pressed.
     * check target and creates instances or triggers functionality.
     *
     * @param {event} event - the left mouse button down event
     */
    mouseDown(event) {
        if (event.target.id === "chat-icon" && event.which === 1) {
            // Select a nick first time a chat is opened
            if (this._signIn) {
                let loginContainer = document.querySelector("#login-container");
                loginContainer.classList.add("show");
                loginContainer.querySelector("#username-field").value = webStorage.getUsername();
            } else {
                let chat = new Chat(this._userName);
                this._chatArr.push(chat);
            }
        } else if (event.target.id === "memory-icon" && event.which === 1) {
            let memory = new Memory();
        } else if (event.target.id === "game15-icon" && event.which === 1) {
            let game15 = new Game15();
        } else if (event.target.id === "info-icon" && event.which === 1) {
            let info = new Info();
        } else if (event.target.id === "login-button" && event.which === 1) {
            //Save new nick in all open chat apps and web storage
            this._userName = event.target.parentNode.querySelector("#username-field").value;
            webStorage.storeUsername(this._userName);
            if (this._signIn) {
                let chat = new Chat(this._userName);
                this._chatArr.push(chat);
            }
            for (let i = 0; i < this._chatArr.length; i += 1) {
                this._chatArr[i]._socketConfig.username = this._userName;
            }
            this._signIn = false;
            document.querySelector("#login-container").classList.remove("show");
        } else if (event.which === 1 && event.target.parentNode !== undefined) {
            // Place selected/clicked app on top
            if (event.target.parentNode.classList.contains("app-toolbar") && event.target.nodeName === "P") {
                this._movingWindow = event.target.parentNode.parentNode;
                this._movingWindow.style.zIndex = genericAppWindow.getNextZ();
                this._cursorRelPosX = event.clientX - parseInt(this._movingWindow.style.left.replace("px", ""));
                this._cursorRelPosY = event.clientY - parseInt(this._movingWindow.style.top.replace("px", ""));
            } else if (event.target.classList.contains("app-toolbar")) {
                this._movingWindow = event.target.parentNode;
                this._movingWindow.style.zIndex = genericAppWindow.getNextZ();
                this._cursorRelPosX = event.clientX - parseInt(this._movingWindow.style.left.replace("px", ""));
                this._cursorRelPosY = event.clientY - parseInt(this._movingWindow.style.top.replace("px", ""));
            }
        }
    }
    /**
     * Triggered when LFM is released.
     * check target and minimizes or restores minimized app.
     *
     * @param {event} event - the left mouse button up event
     */
    mouseUp(event) {
        if (event.which === 1 && event.target.classList.contains("app-close")) {
            this.closeApp(event.target.parentNode.parentNode);
        } else if (event.which === 1 && event.target.classList.contains("app-minimize")) {
            this.minimze(event.target.parentNode.parentNode);
            this._movingWindow = undefined;
        } else if (event.which === 1 && event.target.classList.contains("app-icon-minimized")) {
            this.restoreAppWindow(event.target.parentNode.parentNode);
            this._movingWindow = undefined;
        } else if (this._movingWindow !== undefined) {
            this._movingWindow = undefined;
        }
    }
    /**
     * Triggered when a key is released.
     * check target and minimizes or restores minimized app if the key is enter key.
     *
     * @param {event} event - key event, (enter)
     */
    keyUp(event) {
        if (event.keyCode === 13 && event.target.classList.contains("app-close")) {
            this.closeApp(event.target.parentNode.parentNode);
        } else if (event.which === 13 && event.target.classList.contains("app-minimize")) {
            this.minimze(event.target.parentNode.parentNode);
        } else if (event.which === 13 && event.target.classList.contains("app-icon-minimized")) {
            this.restoreAppWindow(event.target.parentNode.parentNode);
        } else if (event.keyCode === 13 && event.target.id === "memory-icon-link") {
            let memory = new Memory();
        } else if (event.keyCode === 13 && event.target.parentNode !== undefined && event.target.parentNode !== null) {
            if (event.target.parentNode.classList.contains("app-toolbar")) {
                this._movingWindow = event.target.parentNode.parentNode;
                this._movingWindow.style.zIndex = genericAppWindow.getNextZ();
                this._cursorRelPosX = event.clientX - parseInt(this._movingWindow.style.left.replace("px", ""));
                this._cursorRelPosY = event.clientY - parseInt(this._movingWindow.style.top.replace("px", ""));
            }
        }
    }
    /**
     * closes the app when close image is pressed
     *
     * @param {element} appInstance - specific app as DOM element
     */
    closeApp(appInstance) {
        document.querySelector("main").removeChild(appInstance);
        this._movingWindow = undefined;
        if (appInstance.title === "Chat") {
            for (let i = 0; i < this._chatArr.length; i += 1) {
                if (this._chatArr[i]._myInstance.getAttribute("id") === appInstance.getAttribute("id")) {
                    this._chatArr.splice(i, 1);
                }
            }
        }
    }

    /**
     * Minimizes the app when minimize image is pressed
     *
     * @param {element} appInstance - specific app as DOM element
     */
    minimze(appInstance) {
        appInstance.classList.add("hide");
        if (appInstance.getAttribute("name") === "Memory") {
            this.minimizeApp("memory", appInstance);
        } else if (appInstance.getAttribute("name") === "Chat") {
            this.minimizeApp("chat", appInstance);
        } else if (appInstance.getAttribute("name") === "Game15") {
            this.minimizeApp("game15", appInstance);
        }
    }

    /**
     * Minimizes the app, help function to minimize()
     *
     * @param {app} appInstance.getAttribute("name")
     * @param {element} appInstance - specific app as DOM element
     */
    minimizeApp(app, appInstance) {
        let template = document.querySelector("#" + app + "-icon-minimized");
        let clone = document.importNode(template.content, true);
        let minimizedList = document.querySelector("#minimized-" + app);
        minimizedList.getElementsByTagName("IMG")[0].setAttribute("src", "./image/" + app + ".png");
        minimizedList.appendChild(clone);
        minimizedList.lastElementChild.setAttribute("name", appInstance.getAttribute("id"));
    }


    /**
     * restores the app
     *
     * @param {element} appIcon - specific app as DOM element
     */
    restoreAppWindow(appIcon){
        this._movingWindow = document.getElementById(appIcon.getAttribute("name"));
        this._movingWindow.classList.remove("hide");
        appIcon.parentNode.removeChild(appIcon);
        this._movingWindow.style.zIndex = genericAppWindow.getNextZ();
        //this._movingWindow.focus();
        window.location.hash = "#" + this._movingWindow.getAttribute("id");
    }
}

/**
 *  Exports.
 */
module.exports = PWD;

},{"./Chat.js":1,"./Game15.js":2,"./Info.js":3,"./Memory.js":4,"./genericAppWindow.js":7,"./webStorage":8}],6:[function(require,module,exports){
/**
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";
const PWD = require("./PWD.js");

/*
 *Applications entrypoint
 */
try {
    let pWD = new PWD();
} catch (e) {
    console.error('ERROR: ', e.message);
}

},{"./PWD.js":5}],7:[function(require,module,exports){
/**
 * Generic window
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

let template = document.querySelector('#app-window');
let main = document.querySelector('main');
let IDcounter = 0;

let x = 0;
let y = 25;
let z = 1;

/**
 * Sets position of newly created window
 *
 * @param {element} appInstance - the window to be placed
 */
function setPosition(appInstance){
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    z += 1;
    if (y < innerHeight - 100) {
        y += 50;
    } else if (x < innerWidth) {
        x += 240;
        y = 55;
    } else {
        let x = 0;
        let y = 25;
    }
    appInstance.style.left = x + "px";
    appInstance.style.top = y + "px";
    appInstance.style.zIndex = z;
}

/**
 * Adds a generic window to the main div
 *
 * @param {String} name - name of the application
 */
const appWindow = function(name) {
    IDcounter++;
    let clone = document.importNode(template.content, true);
    main.appendChild(clone);
    let appInstance = document.getElementById("tempVar");
    setPosition(appInstance);
    appInstance.setAttribute("id", IDcounter);
    appInstance.getElementsByTagName("p")[0].textContent = name;
    appInstance.setAttribute("name", name);
    appInstance.title = name;
    return appInstance;
}

/**
 * returns the most outer zIndex value on the creen and increaces it by 1
 *
 * @param {String} name - name of the application
 */
const getNextZ = function() {
    z = z + 1;
    return z;
}

/**
 *  Exports.
 */
module.exports.appWindow = appWindow;
module.exports.getNextZ = getNextZ;


},{}],8:[function(require,module,exports){
/**
 * Stores data in Webstorages.
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

module.exports = {
    getLog: getLog,
    addMessage: addMessage,
    storeUsername: storeUsername,
    getUsername: getUsername
}

/**
 * Get chat log from webstorage and returns it
 */
function getLog() {
    let messageLog = JSON.parse(localStorage.getItem("messageLog"));
    if (messageLog === null) {
        messageLog = [];
    }
    return messageLog;
}

/**
 *  Logs the message array to local storage
 */
function addMessage(message, messageLog) {
    if (messageLog.length < 20) {
        messageLog.push(message);
        localStorage.setItem("messageLog", JSON.stringify(messageLog));
    } else {
        messageLog.shift();
        messageLog.push(message);
        localStorage.setItem("messageLog", JSON.stringify(messageLog));
    }
}

function storeUsername(username) {
    localStorage.setItem("username", JSON.stringify(username));
}

function getUsername() {
    let username = JSON.parse(localStorage.getItem("username"));
    if (username === null) {
        username = "Zlatan";
    }
    return username;
}

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZTE1LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JbmZvLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL1BXRC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9nZW5lcmljQXBwV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy93ZWJTdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENoYXQgd2luZG93XG4gKlxuICogQGF1dGhvciBKb2hhbiBTw7ZkZXJsdW5kXG4gKiBAdmVyc2lvbiAxLjBcbiAqL1xuXG5jb25zdCBnZW5lcmljQXBwV2luZG93ID0gcmVxdWlyZSgnLi9nZW5lcmljQXBwV2luZG93LmpzJyk7XG5jb25zdCB3ZWJTdG9yYWdlID0gcmVxdWlyZShcIi4vd2ViU3RvcmFnZVwiKTtcbmNsYXNzIENoYXQge1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhbiBvYmplY3Qgb2YgQ2hhdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyTmFtZSAtIFRoZSBuaWNrbmFtZSBvZiB0aGUgdXNlci5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih1c2VyTmFtZSkge1xuICAgICAgICB0aGlzLl9pbmNvbWluZ01lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5jb21pbmctbWVzc2FnZScpO1xuICAgICAgICB0aGlzLl9zb2NrZXRDb25maWcgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIGRhdGE6IFwiXCIsXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgICAgICBjaGFubmVsOiBcIkNoYW5uZWwxXCIsXG4gICAgICAgICAgICBrZXk6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UgPSBnZW5lcmljQXBwV2luZG93LmFwcFdpbmRvdyhcIkNoYXRcIik7XG4gICAgICAgIHRoaXMuc2V0dXBDaGF0KCk7XG4gICAgICAgIHRoaXMuc2V0dXBTZWxlY3QoKTtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gdGhpcy5jcmVhdGVTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZXMgdGhlIGFwcGJvYXJkLlxuICAgICAqL1xuICAgIHNldHVwQ2hhdCgpe1xuICAgICAgICBsZXQgY2hhdEFwcGxpY2F0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHAtY2hhdFwiKTtcbiAgICAgICAgbGV0IGFwcEJvYXJkID0gdGhpcy5fbXlJbnN0YW5jZS5xdWVyeVNlbGVjdG9yKFwiLmFwcC1ib2FyZFwiKTtcbiAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjaGF0QXBwbGljYXRpb24uY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIGFwcEJvYXJkLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgYXBwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuTE1CLmJpbmQodGhpcykpO1xuICAgICAgICBhcHBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXlVcC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBMRk0gaXMgcHJlc3NlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0gdGhlIGxlZnQgbW91c2UgYnV0dG9uIGRvd24gZXZlbnRcbiAgICAgKi9cbiAgICBMTUIoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTlBVVFwiKSB7XG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gZ2VuZXJpY0FwcFdpbmRvdy5nZXROZXh0WigpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBhIGtleSBpcyByZWxlYXNlZC5cbiAgICAgKiBTZW5kcyB0aGUgdHlwZWQgbWVzc2FnZSwgdXNlcm5hbWUgYW5kIG90aGVyIGNvbmZpZyBpbmZvcm1hdGlvbiB0byBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0ga2V5IGV2ZW50LCAoZW50ZXIpXG4gICAgICovXG4gICAga2V5VXAoZXZlbnQpe1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMgJiYgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIlRFWFRBUkVBXCIpIHtcbiAgICAgICAgICAgIGxldCBpbnB1dFRleHQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRDb25maWcuZGF0YSA9IGlucHV0VGV4dDtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuX3NvY2tldENvbmZpZykpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgd2Vic29ja2V0IHRvIGhhbmRsZSBjaGF0IHRyYWZmaWMsIHNtb290aGVyIHByb3RvY29sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gdGhlIHVybCB0byBwYXNzIG9uIGRhdGEgdHJhZmZpY1xuICAgICAqL1xuICAgIGNyZWF0ZVNvY2tldCh1cmwpIHtcbiAgICAgICAgbGV0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsLCAnY2hhcmNvcmRzJyk7XG4gICAgICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdvcGVuJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMucmVjaWV2ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHNvY2tldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVjaWV2ZXMgdGhlIHNlcnZlciBtZXNzYWdlLCBzZW50LCByZWNpZXZlZCBhbmQgcHVsc2VzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudCAtIHNlcnZlciBtZXNzYWdlXG4gICAgICovXG4gICAgcmVjaWV2ZShldmVudCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdtZXNzYWdlJykge1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2VGZWVkID0gdGhpcy5fbXlJbnN0YW5jZS5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2UtZmVlZFwiKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy5faW5jb21pbmdNZXNzYWdlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgbWVzc2FnZUZlZWQuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBsZXQgaGVhZExpbmUgPSBtZXNzYWdlLnVzZXJuYW1lICsgXCIgICBcIiArIGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiLVwiICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpXG4gICAgICAgICAgICAgICAgKyBcIi1cIiArIGRhdGUuZ2V0RGF0ZSgpICsgXCIgICBcIiArIGRhdGUuZ2V0SG91cnMoKSArIFwiOlwiICsgZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgICAgICBsZXQgc3RvcmVNZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgIGhlYWRMaW5lOiBoZWFkTGluZSxcbiAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBtZXNzYWdlLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIGRhdGE6IG1lc3NhZ2UuZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZUZlZWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwXCIpWyhtZXNzYWdlRmVlZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBcIikubGVuZ3RoIC0gMSldLnRleHRDb250ZW50ID0gaGVhZExpbmU7XG4gICAgICAgICAgICBtZXNzYWdlRmVlZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpWyhtZXNzYWdlRmVlZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpLmxlbmd0aCAtIDEpXS50ZXh0Q29udGVudCA9IG1lc3NhZ2UuZGF0YTtcbiAgICAgICAgICAgIG1lc3NhZ2VGZWVkLnNjcm9sbFRvcCA9IG1lc3NhZ2VGZWVkLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIHdlYlN0b3JhZ2UuYWRkTWVzc2FnZShzdG9yZU1lc3NhZ2UsIHdlYlN0b3JhZ2UuZ2V0TG9nKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vY2xvc2VcbiAgICBjbG9zZVNvY2tldCgpe1xuICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBzZWxlY3RlZCBpdGVtIGluIGRyb3AgZG93biBtZW51XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudCAtIGRyb3AgZG93biBtZW51IGl0ZW0gY2hvb3NlblxuICAgICAqL1xuICAgIGNoYXRSZWNvbmZpZyhldmVudCl7XG4gICAgICAgIGxldCBtZXNzYWdlRmVlZCA9IHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvckFsbChcIi5tZXNzYWdlLWZlZWRcIilbMF07XG4gICAgICAgIGlmIChldmVudC50YXJnZXQub3B0aW9uc1tldmVudC50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgPT09IFwiY2xlYXJcIikge1xuICAgICAgICAgICAgbWVzc2FnZUZlZWQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQub3B0aW9uc1tldmVudC50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgPT09IFwiZ2V0IGxhc3QgbWVzc2FnZXNcIikge1xuICAgICAgICAgICAgbWVzc2FnZUZlZWQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlTG9nID0gd2ViU3RvcmFnZS5nZXRMb2coKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZUxvZy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy5faW5jb21pbmdNZXNzYWdlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VGZWVkLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlRmVlZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBcIilbKG1lc3NhZ2VGZWVkLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicFwiKS5sZW5ndGggLSAxKV0udGV4dENvbnRlbnQgPSBtZXNzYWdlTG9nW2ldLmhlYWRMaW5lO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VGZWVkLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIilbKG1lc3NhZ2VGZWVkLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIikubGVuZ3RoIC0gMSldLnRleHRDb250ZW50ID0gbWVzc2FnZUxvZ1tpXS5kYXRhO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VGZWVkLnNjcm9sbFRvcCA9IG1lc3NhZ2VGZWVkLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQub3B0aW9uc1tldmVudC50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgPT09IFwic2VsZWN0IG5ldyBuaWNrXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbG9naW4tY29udGFpbmVyXCIpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHVwIGRyb3AgZG93biBtZW51XG4gICAgICovXG4gICAgc2V0dXBTZWxlY3QoKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSB0aGlzLl9teUluc3RhbmNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2VsZWN0XCIpWzBdO1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3B0aW9ucycpO1xuICAgICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICBsZXQgb3B0aW9uMSA9IHNlbGVjdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKVswXTtcbiAgICAgICAgb3B0aW9uMS52YWx1ZSA9IG9wdGlvbjEudGV4dENvbnRlbnQgPSBcImNsZWFyXCI7XG5cbiAgICAgICAgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICBsZXQgb3B0aW9uMiA9IHNlbGVjdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKVsxXTtcbiAgICAgICAgb3B0aW9uMi52YWx1ZSA9IG9wdGlvbjIudGV4dENvbnRlbnQgPSBcImdldCBsYXN0IG1lc3NhZ2VzXCI7XG5cbiAgICAgICAgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICBsZXQgb3B0aW9uMyA9IHNlbGVjdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKVsyXTtcbiAgICAgICAgb3B0aW9uMy52YWx1ZSA9IG9wdGlvbjMudGV4dENvbnRlbnQgPSBcInNlbGVjdCBuZXcgbmlja1wiO1xuXG4gICAgICAgIHNlbGVjdC5vcHRpb25zWzBdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5jaGF0UmVjb25maWcuYmluZCh0aGlzKSk7XG4gICAgfVxufVxuXG4vKipcbiAqICBFeHBvcnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIEdhbWUgMTVcbiAqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBnZW5lcmljQXBwV2luZG93ID0gcmVxdWlyZShcIi4vZ2VuZXJpY0FwcFdpbmRvdy5qc1wiKTtcblxuY2xhc3MgR2FtZTE1IHtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYW4gb2JqZWN0IG9mIEdhbWUxNS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcm93cyA9IDQ7XG4gICAgICAgIHRoaXMuX2NvbHVtbnMgPSA0O1xuICAgICAgICB0aGlzLl9wYXducyA9IHRoaXMuX3Jvd3MgKiB0aGlzLl9jb2x1bW5zO1xuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWFscyA9IDA7XG4gICAgICAgIHRoaXMuX3Bhd25Qb3NpdGlvbnMgPSB0aGlzLnNodWZmbGUoWzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTVdLCB0aGlzLl9wYXducyk7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UgPSBnZW5lcmljQXBwV2luZG93LmFwcFdpbmRvdyhcIkdhbWUxNVwiKTtcbiAgICAgICAgdGhpcy5zZXR1cFNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNldHVwR2FtZTE1KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgc2h1ZmZsZSBtZXRob2RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFycmF5VG9TaHVmZmxlIC0gdGhlIGFycmF5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIGxlbmd0aFxuICAgICAqL1xuICAgIHNodWZmbGUoYXJyYXlUb1NodWZmbGUsIG1heCkge1xuICAgICAgICBmb3IgKGxldCBpID0gbWF4OyBpOyBpID0gaSAtIDEpIHtcbiAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG4gICAgICAgICAgICBbYXJyYXlUb1NodWZmbGVbaSAtIDFdLCBhcnJheVRvU2h1ZmZsZVtqXV0gPSBbYXJyYXlUb1NodWZmbGVbal0sIGFycmF5VG9TaHVmZmxlW2kgLSAxXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5VG9TaHVmZmxlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXR1cCBhcHBib2FyZFxuICAgICAqL1xuICAgIHNldHVwR2FtZTE1KCl7XG4gICAgICAgIGxldCBtZW1vcnlDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW1vcnktY2FyZFwiKTtcbiAgICAgICAgbGV0IGFwcEJvYXJkID0gdGhpcy5fbXlJbnN0YW5jZS5xdWVyeVNlbGVjdG9yKFwiLmFwcC1ib2FyZFwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9yb3dzICogdGhpcy5fY29sdW1uczsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmQuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBhcHBCb2FyZC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICBhcHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmltZy1jYXJkXCIpW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtYm9yZC1wb3NpdGlvblwiLCBpKTtcbiAgICAgICAgICAgIGFwcEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW1nLWNhcmRcIilbaV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi9pbWFnZS9nYW1lMTUvXCIgKyB0aGlzLl9wYXduUG9zaXRpb25zW2ldICsgXCIuZ2lmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGFwcEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLkxNQi5iaW5kKHRoaXMpKTtcbiAgICAgICAgYXBwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMua2V5VXAuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHN3YXBzIHBvc2l0aW9ucyBpbiBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gdG8gYmUgc3dhcGVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhd24gLSBzd2FwXG4gICAgICovXG4gICAgc2V0TnVtYmVyUGF3bihpbmRleCwgcGF3bikge1xuICAgICAgICBpZiAoKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLl9wYXduUG9zaXRpb25zLmxlbmd0aCkpXG4gICAgICAgICAgICB0aGlzLl9wYXduUG9zaXRpb25zW2luZGV4XSA9IHBhd247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgbnVtYmVyIGZyb20gYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhpcy5fcGF3blBvc2l0aW9uc1tpbmRleF0gLSBwYXduIG9uIHNwZWNpZmljIHBvc1xuICAgICAqL1xuICAgIGdldE51bWJlclBhd24oaW5kZXgpIHtcbiAgICAgICAgaWYgKChpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5fcGF3blBvc2l0aW9ucy5sZW5ndGgpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Bhd25Qb3NpdGlvbnNbaW5kZXhdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZW1wdHkgcGF3biBhbmQgcmV0dXJucyBpbmRleFxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGkgLSBpbmRleFxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhpcy5fcGF3blBvc2l0aW9uc1tpbmRleF0gLSBwYXduIG9uIHNwZWNpZmljIHBvc1xuICAgICAqL1xuICAgIGdldEVtcHR5UGF3bigpe1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Bhd25zOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXduUG9zaXRpb25zW2ldID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgYm9hcmQgcG9zIG9mIHNlbGVjdGVkIHBhd25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpIC0gaW5kZXhcbiAgICAgKi9cbiAgICBwYXduU2VsZWN0ZWQoaW1hZ2UpIHtcbiAgICAgICAgbGV0IHRhYmxlUG9zID0gaW1hZ2UuZ2V0QXR0cmlidXRlKFwiZGF0YS1ib3JkLXBvc2l0aW9uXCIpO1xuICAgICAgICAvLyBpcyBwYXduIG5laWdoYm91ciB0byBibGFua1xuICAgICAgICBsZXQgaWR4UGF3blRvTW92ZSA9IHBhcnNlSW50KHRhYmxlUG9zKTtcbiAgICAgICAgbGV0IGlkeEVtcHR5UGF3biA9IHRoaXMuZ2V0RW1wdHlQYXduKCk7XG4gICAgICAgIGxldCBhcHBCb2FyZCA9IHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5hcHAtYm9hcmRcIik7XG4gICAgICAgIC8vIGNoZWNrIGlmIGRpcmVjdGx5IGJlc2lkZVxuICAgICAgICBpZiAoTWF0aC5mbG9vcihpZHhQYXduVG9Nb3ZlIC8gNCkgPT0gTWF0aC5mbG9vcihpZHhFbXB0eVBhd24gLyA0KSl7XG4gICAgICAgICAgICBpZiAoKGlkeFBhd25Ub01vdmUgKyAxID09PSBpZHhFbXB0eVBhd24pIHx8XG4gICAgICAgICAgICAgICAgKGlkeEVtcHR5UGF3biArIDEgPT09IGlkeFBhd25Ub01vdmUpKSB7XG4gICAgICAgICAgICAgICAgYXBwQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5pbWctY2FyZFwiKVtpZHhFbXB0eVBhd25dLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL2dhbWUxNS9cIiArIHRoaXMuZ2V0TnVtYmVyUGF3bihpZHhQYXduVG9Nb3ZlKSArIFwiLmdpZlwiKTtcbiAgICAgICAgICAgICAgICBhcHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmltZy1jYXJkXCIpW2lkeFBhd25Ub01vdmVdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL2dhbWUxNS9cIiArIHRoaXMuZ2V0TnVtYmVyUGF3bihpZHhFbXB0eVBhd24pICsgXCIuZ2lmXCIpO1xuICAgICAgICAgICAgICAgIGxldCBwYXduVGVtcCA9IHRoaXMuZ2V0TnVtYmVyUGF3bihpZHhQYXduVG9Nb3ZlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE51bWJlclBhd24oaWR4UGF3blRvTW92ZSwgdGhpcy5nZXROdW1iZXJQYXduKGlkeEVtcHR5UGF3bikpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TnVtYmVyUGF3bihpZHhFbXB0eVBhd24sIHBhd25UZW1wKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWFscyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGlmIGRpcmVjdGx5IGFib3ZlIG9yIGJlbG93XG4gICAgICAgIGlmICgoKGlkeFBhd25Ub01vdmUgKyA0KSA9PT0gaWR4RW1wdHlQYXduKSB8fFxuICAgICAgICAgICAgKChpZHhFbXB0eVBhd24gKyA0KSA9PT0gaWR4UGF3blRvTW92ZSkpIHtcbiAgICAgICAgICAgIGFwcEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW1nLWNhcmRcIilbaWR4RW1wdHlQYXduXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9nYW1lMTUvXCIgKyB0aGlzLmdldE51bWJlclBhd24oaWR4UGF3blRvTW92ZSkgKyBcIi5naWZcIik7XG4gICAgICAgICAgICBhcHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmltZy1jYXJkXCIpW2lkeFBhd25Ub01vdmVdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL2dhbWUxNS9cIiArIHRoaXMuZ2V0TnVtYmVyUGF3bihpZHhFbXB0eVBhd24pICsgXCIuZ2lmXCIpO1xuICAgICAgICAgICAgbGV0IHBhd25UZW1wID0gdGhpcy5nZXROdW1iZXJQYXduKGlkeFBhd25Ub01vdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXROdW1iZXJQYXduKGlkeFBhd25Ub01vdmUsIHRoaXMuZ2V0TnVtYmVyUGF3bihpZHhFbXB0eVBhd24pKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TnVtYmVyUGF3bihpZHhFbXB0eVBhd24sIHBhd25UZW1wKTtcbiAgICAgICAgICAgIHRoaXMuX251bWJlck9mVHJpYWxzICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0RvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBhIGtleSBpcyByZWxlYXNlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0ga2V5IGV2ZW50LCAoZW50ZXIpXG4gICAgICovXG4gICAga2V5VXAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJBXCIpe1xuICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLnN0eWxlLnpJbmRleCA9IGdlbmVyaWNBcHBXaW5kb3cuZ2V0TmV4dFooKTtcbiAgICAgICAgICAgIHRoaXMucGF3blNlbGVjdGVkKGV2ZW50LnRhcmdldC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZ2dlcmVkIHdoZW4gTE1CIGlzIHByZXNzZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0gTE1CXG4gICAgICovXG4gICAgTE1CKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMSAmJiBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSU1HXCIpe1xuICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLnN0eWxlLnpJbmRleCA9IGdlbmVyaWNBcHBXaW5kb3cuZ2V0TmV4dFooKTtcbiAgICAgICAgICAgIHRoaXMucGF3blNlbGVjdGVkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZ2FtZSBpcyBmaW5uaXNoZWRcbiAgICAgKi9cbiAgICBjaGVja0RvbmUoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5fcGF3bnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TnVtYmVyUGF3bihpIC0gMSkgIT09IGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdFwiKS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fbXlJbnN0YW5jZS5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvckFsbChcIi5yZXN1bHQgcFwiKVswXS50ZXh0Q29udGVudCA9IFwiWW91IG1hZGUgaXQgaW4gXCIgKyB0aGlzLl9udW1iZXJPZlRyaWFscyArIFwiIHRyaWFsc1wiO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVjb25maWcgZ2FtZSAxNVxuICAgICAqXG4gICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgLSBkcm9wIGRvd24gaXRlbSByZXN0YXJ0IG9wdGlvblxuICAgICAqL1xuICAgIGdhbWUxNVJlY29uZmlnKGV2ZW50KXtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5vcHRpb25zW2V2ZW50LnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZSA9PT0gXCJyZXN0YXJ0XCIpIHtcbiAgICAgICAgICAgIGxldCBhcHBCb2FyZCA9IHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5hcHAtYm9hcmRcIik7XG4gICAgICAgICAgICB3aGlsZSAoYXBwQm9hcmQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgYXBwQm9hcmQucmVtb3ZlQ2hpbGQoYXBwQm9hcmQubGFzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Bhd25Qb3NpdGlvbnMgPSB0aGlzLnNodWZmbGUoWzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTVdLCB0aGlzLl9wYXducyk7XG4gICAgICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWFscyA9IDA7XG4gICAgICAgICAgICB0aGlzLnNldHVwR2FtZTE1KCk7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ID0gdGhpcy5fbXlJbnN0YW5jZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNlbGVjdFwiKVswXTtcbiAgICAgICAgICAgIHNlbGVjdC5vcHRpb25zWzBdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXR1cCBzZWxlY3Rpb24gZHJvcCBkb3duIG1lbnVcbiAgICAgKi9cbiAgICBzZXR1cFNlbGVjdCgpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuX215SW5zdGFuY2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIilbMF07XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3B0aW9uc1wiKTtcbiAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgbGV0IG9wdGlvbjEgPSBzZWxlY3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIilbMF07XG4gICAgICAgIG9wdGlvbjEudmFsdWUgPSBvcHRpb24xLnRleHRDb250ZW50ID0gXCJydW5cIjtcblxuICAgICAgICBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIGxldCBvcHRpb24yID0gc2VsZWN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpWzFdO1xuICAgICAgICBvcHRpb24yLnZhbHVlID0gb3B0aW9uMi50ZXh0Q29udGVudCA9IFwicmVzdGFydFwiO1xuXG4gICAgICAgIHNlbGVjdC5vcHRpb25zWzBdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5nYW1lMTVSZWNvbmZpZy5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG5cbi8qKlxuICogIEV4cG9ydHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gR2FtZTE1O1xuIiwiLyoqXG4gKiBBYm91dCB3aW5kb3dcbiAqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuY29uc3QgZ2VuZXJpY0FwcFdpbmRvdyA9IHJlcXVpcmUoJy4vZ2VuZXJpY0FwcFdpbmRvdy5qcycpO1xuY2xhc3MgSW5mbyB7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGFuIG9iamVjdCBvZiBNZW1vcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UgPSBnZW5lcmljQXBwV2luZG93LmFwcFdpbmRvdyhcIkluZm9cIik7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5hcHAtbWluaW1pemVcIikuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5kcm9wLWRvd25cIikuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBmb3IgaW5mbyB3aW5kb3dcbiAgICAgKi9cbiAgICBzZXR1cCgpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcC1pbmZvJyk7XG4gICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB0aGlzLl9teUluc3RhbmNlLmNsYXNzTGlzdC5hZGQoXCJpbmZvLXNpemVcIik7XG4gICAgfVxuXG59XG5cbi8qKlxuICogIEV4cG9ydHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gSW5mbztcblxuIiwiLyoqXG4gKiBNZW1vcnkgYXBwXG4gKlxuICogQGF1dGhvciBKb2hhbiBTw7ZkZXJsdW5kXG4gKiBAdmVyc2lvbiAxLjBcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbmNvbnN0IGdlbmVyaWNBcHBXaW5kb3cgPSByZXF1aXJlKCcuL2dlbmVyaWNBcHBXaW5kb3cuanMnKTtcbmNsYXNzIE1lbW9yeSB7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGFuIG9iamVjdCBvZiBNZW1vcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3Jvd3MgPSA0O1xuICAgICAgICB0aGlzLl9jb2x1bW5zID0gNDtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlhbHMgPSAwO1xuICAgICAgICB0aGlzLl9jYXJkUG9zaXRpb25zID0gdGhpcy5zaHVmZmxlKFswLDAsMSwxLDIsMiwzLDMsNCw0LDUsNSw2LDYsNyw3XSwgMTYpO1xuICAgICAgICB0aGlzLl90dXJuZWRDYXJkcyA9IFtmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV07XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UgPSBnZW5lcmljQXBwV2luZG93LmFwcFdpbmRvdyhcIk1lbW9yeVwiKTtcbiAgICAgICAgdGhpcy5zZXR1cFNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNldHVwTWVtb3J5R3JpZCgpO1xuICAgICAgICB0aGlzLl90dXJuZWRDYXJkT25lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl90dXJuZWRDYXJkVHdvID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl90MSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fdDIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgc2h1ZmZsZSBtZXRob2RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFycmF5VG9TaHVmZmxlIC0gdGhlIGFycmF5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIGxlbmd0aFxuICAgICAqL1xuICAgIHNodWZmbGUoYXJyYXlUb1NodWZmZWwsIG1heCkge1xuICAgICAgICBmb3IgKGxldCBpID0gbWF4OyBpOyBpID0gaSAtIDEpIHtcbiAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG4gICAgICAgICAgICBbYXJyYXlUb1NodWZmZWxbaSAtIDFdLCBhcnJheVRvU2h1ZmZlbFtqXV0gPSBbYXJyYXlUb1NodWZmZWxbal0sIGFycmF5VG9TaHVmZmVsW2kgLSAxXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5VG9TaHVmZmVsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbWFnZSB0byB0dXJuIGZhY2UgdXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gaW1hZ2UgLSBjbGlja2VkIGltYWdlXG4gICAgICovXG4gICAgY2FyZFNlbGVjdGVkKGltYWdlKSB7XG4gICAgICAgIGxldCB0YWJsZVBvcyA9IGltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtYm9yZC1wb3NpdGlvblwiKTtcbiAgICAgICAgbGV0IGltYWdlSUQgPSB0aGlzLl9jYXJkUG9zaXRpb25zW3RhYmxlUG9zXTtcbiAgICAgICAgaWYgKHRoaXMuX3R1cm5lZENhcmRzW3RhYmxlUG9zXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl90dXJuZWRDYXJkT25lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90MSA9IGltYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3R1cm5lZENhcmRPbmUgPSB0YWJsZVBvcztcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2VTcmMgPSBcIi4vaW1hZ2UvbWVtb3J5L1wiICsgaW1hZ2VJRCArIFwiLnBuZ1wiO1xuICAgICAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBpbWFnZVNyYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHVybmVkQ2FyZHNbdGFibGVQb3NdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdHVybmVkQ2FyZFR3byA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdDIgPSBpbWFnZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90dXJuZWRDYXJkVHdvID0gdGFibGVQb3M7XG4gICAgICAgICAgICAgICAgbGV0IGltYWdlU3JjID0gXCIuL2ltYWdlL21lbW9yeS9cIiArIGltYWdlSUQgKyBcIi5wbmdcIjtcbiAgICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgaW1hZ2VTcmMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3R1cm5lZENhcmRzW3RhYmxlUG9zXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlhbHMgKz0gMTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FyZFBvc2l0aW9uc1t0aGlzLl90dXJuZWRDYXJkT25lXSA9PT0gdGhpcy5fY2FyZFBvc2l0aW9uc1t0aGlzLl90dXJuZWRDYXJkVHdvXSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMucmVtb3ZlTWF0Y2hlZENhcmRzLmJpbmQodGhpcyksIDUwMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tEb25lKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmNsb3NlVHVybmVkQ2FyZHMuYmluZCh0aGlzKSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJlZCB3aGVuIGEga2V5IGlzIHJlbGVhc2VkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgLSBrZXkgZXZlbnQsIChlbnRlcilcbiAgICAgKi9cbiAgICBrZXlVcChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMgJiYgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIkFcIil7XG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gZ2VuZXJpY0FwcFdpbmRvdy5nZXROZXh0WigpO1xuICAgICAgICAgICAgdGhpcy5jYXJkU2VsZWN0ZWQoZXZlbnQudGFyZ2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpWzBdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBMTUIgaXMgcHJlc3NlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgLSBMTUJcbiAgICAgKi9cbiAgICBMTUIoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTUdcIil7XG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gZ2VuZXJpY0FwcFdpbmRvdy5nZXROZXh0WigpO1xuICAgICAgICAgICAgdGhpcy5jYXJkU2VsZWN0ZWQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBnYW1lIGlzIGZpbm5pc2hlZFxuICAgICAqL1xuICAgIGNoZWNrRG9uZSgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9yb3dzICogdGhpcy5fY29sdW1uczsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdHVybmVkQ2FyZHNbaV0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRcIikuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB0aGlzLl9teUluc3RhbmNlLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucmVzdWx0IHBcIilbMF0udGV4dENvbnRlbnQgPSBcIllvdSBtYWRlIGl0IGluIFwiICsgdGhpcy5fbnVtYmVyT2ZUcmlhbHMgKyBcIiB0cmlhbHNcIjtcbiAgICAgICAgdGhpcy5fbXlJbnN0YW5jZS5xdWVyeVNlbGVjdG9yKFwiLmFwcC1ib2FyZFwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFR1cm5zIGNhcmQgZmFjZSBkb3duXG4gICAgICovXG4gICAgY2xvc2VUdXJuZWRDYXJkcygpIHtcbiAgICAgICAgdGhpcy5fdDEuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi9pbWFnZS9tZW1vcnkvYmxhbmsucG5nXCIpO1xuICAgICAgICB0aGlzLl90Mi5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltYWdlL21lbW9yeS9ibGFuay5wbmdcIik7XG4gICAgICAgIHRoaXMuX3R1cm5lZENhcmRzW3RoaXMuX3R1cm5lZENhcmRPbmVdID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3R1cm5lZENhcmRzW3RoaXMuX3R1cm5lZENhcmRUd29dID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3R1cm5lZENhcmRPbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX3R1cm5lZENhcmRUd28gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbWF0Y2hpbmcgY2FyZHNcbiAgICAgKi9cbiAgICByZW1vdmVNYXRjaGVkQ2FyZHMoKSB7XG4gICAgICAgIHRoaXMuX3QxLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5fdDIuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLl90dXJuZWRDYXJkT25lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl90dXJuZWRDYXJkVHdvID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXR1cCBwYXducyBvbiBtZW1vcnkgZ3JpZFxuICAgICAqL1xuICAgIHNldHVwTWVtb3J5R3JpZCgpe1xuICAgICAgICBsZXQgbWVtb3J5Q2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVtb3J5LWNhcmRcIik7XG4gICAgICAgIGxldCBhcHBCb2FyZCA9IHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5hcHAtYm9hcmRcIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcm93cyAqIHRoaXMuX2NvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlDYXJkLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgYXBwQm9hcmQuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgYXBwQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5pbWctY2FyZFwiKVtpXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWJvcmQtcG9zaXRpb25cIiwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIiNcIiArIHRoaXMuX215SW5zdGFuY2UuZ2V0QXR0cmlidXRlKFwiaWRcIik7XG4gICAgICAgIHRoaXMuX215SW5zdGFuY2UuZm9jdXMoKTtcbiAgICAgICAgYXBwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuTE1CLmJpbmQodGhpcykpO1xuICAgICAgICBhcHBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXlVcC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVjb25maWd1cmF0ZXMgdGhlIHNldHVwIG9mIHBhd25zIG9uIG1lbW9yeSBncmlkXG4gICAgICovXG4gICAgbWVtb3J5R3JpZFJlY29uZmlnKGV2ZW50KSB7XG4gICAgICAgIGxldCBhcHBCb2FyZCA9IHRoaXMuX215SW5zdGFuY2UucXVlcnlTZWxlY3RvcihcIi5hcHAtYm9hcmRcIik7XG4gICAgICAgIHdoaWxlIChhcHBCb2FyZC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGFwcEJvYXJkLnJlbW92ZUNoaWxkKGFwcEJvYXJkLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm9wdGlvbnNbZXZlbnQudGFyZ2V0LnNlbGVjdGVkSW5kZXhdLnZhbHVlID09PSBcIiA0ICogMlwiKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzID0gNDtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbnMgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldC5vcHRpb25zW2V2ZW50LnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZSA9PT0gXCIgNCAqIDNcIikge1xuICAgICAgICAgICAgdGhpcy5fcm93cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5zID0gMztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudC50YXJnZXQub3B0aW9uc1tldmVudC50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgPT09IFwiIDQgKiA0XCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvd3MgPSA0O1xuICAgICAgICAgICAgdGhpcy5fY29sdW1ucyA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FyZFBvc2l0aW9ucyA9IHRoaXMuc2h1ZmZsZShbMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsN10sIHRoaXMuX3Jvd3MgKiB0aGlzLl9jb2x1bW5zKTtcbiAgICAgICAgdGhpcy5fdHVybmVkQ2FyZHMgPSBbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdO1xuICAgICAgICB0aGlzLnNldHVwTWVtb3J5R3JpZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXR1cCBmb3IgZHJvcCBkb3duIG1lbnVcbiAgICAgKi9cbiAgICBzZXR1cFNlbGVjdCgpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuX215SW5zdGFuY2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIilbMF07XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3B0aW9uc1wiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgbGV0IG9wdGlvbiA9IHNlbGVjdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKVtpXTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBpICsgMjtcbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvbi50ZXh0Q29udGVudCA9IFwiIDQgKiBcIiArIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBzZWxlY3Qub3B0aW9uc1syXS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVtb3J5R3JpZFJlY29uZmlnLmJpbmQodGhpcykpO1xuICAgIH1cbn1cblxuLyoqXG4gKiAgRXhwb3J0cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCIvKipcbiAqIENvbnRyb2xsZXJcbiAqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnkuanNcIik7XG5jb25zdCBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcbmNvbnN0IEdhbWUxNSA9IHJlcXVpcmUoXCIuL0dhbWUxNS5qc1wiKTtcbmNvbnN0IEluZm8gPSByZXF1aXJlKFwiLi9JbmZvLmpzXCIpO1xuY29uc3QgZ2VuZXJpY0FwcFdpbmRvdyA9IHJlcXVpcmUoXCIuL2dlbmVyaWNBcHBXaW5kb3cuanNcIik7XG5jb25zdCB3ZWJTdG9yYWdlID0gcmVxdWlyZShcIi4vd2ViU3RvcmFnZVwiKTtcblxuY2xhc3MgUFdEIHtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYW4gb2JqZWN0IG9mIFBXRC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2hhdEFyciA9IFtdO1xuICAgICAgICB0aGlzLl91c2VyTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fc2lnbkluID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW92aW5nV2luZG93ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9jdXJzb3JSZWxQb3NYID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9jdXJzb3JSZWxQb3NZID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9tb3VzZU1vdmVFdmVudExpc3RlbmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMubW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNlVXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXlVcC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVwb3NpdGlvbnMgdGhlIHdpbmRvdyB0byBtb3VzZSBwb3NpdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgLSB0aGUgbW91c2UgbW92ZSBldmVudFxuICAgICAqL1xuICAgIHJlcG9zaXRpb24oZXZlbnQpe1xuICAgICAgICBsZXQgaW5uZXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBsZXQgaW5uZXJIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIGxldCBuZXdYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgbGV0IG5ld1kgPSBldmVudC5jbGllbnRZO1xuICAgICAgICBpZiAoKG5ld1ggPCBpbm5lcldpZHRoKSAmJiAobmV3WSA8IGlubmVySGVpZ2h0KSAmJiAobmV3WSA+IDYwKSkge1xuICAgICAgICAgICAgdGhpcy5fbW92aW5nV2luZG93LnN0eWxlLnRvcCA9IG5ld1kgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5fbW92aW5nV2luZG93LnN0eWxlLmxlZnQgPSBuZXdYIC0gdGhpcy5fY3Vyc29yUmVsUG9zWCArICdweCc7XG4gICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cuc3R5bGUudG9wID0gbmV3WSAtIHRoaXMuX2N1cnNvclJlbFBvc1kgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlcmVkIHdoZW4gTEZNIG9uIGEgYXBwbGljYXRpb24gdG9wIGJhciBhbmQgY2FsbHMgcmVwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0gdGhlIG1vdXNlIG1vdmUgZXZlbnRcbiAgICAgKi9cbiAgICBtb3VzZU1vdmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vdmluZ1dpbmRvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBMRk0gaXMgcHJlc3NlZC5cbiAgICAgKiBjaGVjayB0YXJnZXQgYW5kIGNyZWF0ZXMgaW5zdGFuY2VzIG9yIHRyaWdnZXJzIGZ1bmN0aW9uYWxpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudCAtIHRoZSBsZWZ0IG1vdXNlIGJ1dHRvbiBkb3duIGV2ZW50XG4gICAgICovXG4gICAgbW91c2VEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQuaWQgPT09IFwiY2hhdC1pY29uXCIgJiYgZXZlbnQud2hpY2ggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdCBhIG5pY2sgZmlyc3QgdGltZSBhIGNoYXQgaXMgb3BlbmVkXG4gICAgICAgICAgICBpZiAodGhpcy5fc2lnbkluKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxvZ2luQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsb2dpbi1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgbG9naW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgICAgICAgbG9naW5Db250YWluZXIucXVlcnlTZWxlY3RvcihcIiN1c2VybmFtZS1maWVsZFwiKS52YWx1ZSA9IHdlYlN0b3JhZ2UuZ2V0VXNlcm5hbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoYXQgPSBuZXcgQ2hhdCh0aGlzLl91c2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhdEFyci5wdXNoKGNoYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gXCJtZW1vcnktaWNvblwiICYmIGV2ZW50LndoaWNoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgbWVtb3J5ID0gbmV3IE1lbW9yeSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gXCJnYW1lMTUtaWNvblwiICYmIGV2ZW50LndoaWNoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgZ2FtZTE1ID0gbmV3IEdhbWUxNSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gXCJpbmZvLWljb25cIiAmJiBldmVudC53aGljaCA9PT0gMSkge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBuZXcgSW5mbygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gXCJsb2dpbi1idXR0b25cIiAmJiBldmVudC53aGljaCA9PT0gMSkge1xuICAgICAgICAgICAgLy9TYXZlIG5ldyBuaWNrIGluIGFsbCBvcGVuIGNoYXQgYXBwcyBhbmQgd2ViIHN0b3JhZ2VcbiAgICAgICAgICAgIHRoaXMuX3VzZXJOYW1lID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIiN1c2VybmFtZS1maWVsZFwiKS52YWx1ZTtcbiAgICAgICAgICAgIHdlYlN0b3JhZ2Uuc3RvcmVVc2VybmFtZSh0aGlzLl91c2VyTmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2lnbkluKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoYXQgPSBuZXcgQ2hhdCh0aGlzLl91c2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhdEFyci5wdXNoKGNoYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jaGF0QXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhdEFycltpXS5fc29ja2V0Q29uZmlnLnVzZXJuYW1lID0gdGhpcy5fdXNlck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zaWduSW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbG9naW4tY29udGFpbmVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LndoaWNoID09PSAxICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIFBsYWNlIHNlbGVjdGVkL2NsaWNrZWQgYXBwIG9uIHRvcFxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucyhcImFwcC10b29sYmFyXCIpICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJQXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdmluZ1dpbmRvdy5zdHlsZS56SW5kZXggPSBnZW5lcmljQXBwV2luZG93LmdldE5leHRaKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yUmVsUG9zWCA9IGV2ZW50LmNsaWVudFggLSBwYXJzZUludCh0aGlzLl9tb3ZpbmdXaW5kb3cuc3R5bGUubGVmdC5yZXBsYWNlKFwicHhcIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvclJlbFBvc1kgPSBldmVudC5jbGllbnRZIC0gcGFyc2VJbnQodGhpcy5fbW92aW5nV2luZG93LnN0eWxlLnRvcC5yZXBsYWNlKFwicHhcIiwgXCJcIikpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXBwLXRvb2xiYXJcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cuc3R5bGUuekluZGV4ID0gZ2VuZXJpY0FwcFdpbmRvdy5nZXROZXh0WigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvclJlbFBvc1ggPSBldmVudC5jbGllbnRYIC0gcGFyc2VJbnQodGhpcy5fbW92aW5nV2luZG93LnN0eWxlLmxlZnQucmVwbGFjZShcInB4XCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3JSZWxQb3NZID0gZXZlbnQuY2xpZW50WSAtIHBhcnNlSW50KHRoaXMuX21vdmluZ1dpbmRvdy5zdHlsZS50b3AucmVwbGFjZShcInB4XCIsIFwiXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBMRk0gaXMgcmVsZWFzZWQuXG4gICAgICogY2hlY2sgdGFyZ2V0IGFuZCBtaW5pbWl6ZXMgb3IgcmVzdG9yZXMgbWluaW1pemVkIGFwcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0gdGhlIGxlZnQgbW91c2UgYnV0dG9uIHVwIGV2ZW50XG4gICAgICovXG4gICAgbW91c2VVcChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFwcC1jbG9zZVwiKSkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZUFwcChldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC53aGljaCA9PT0gMSAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXBwLW1pbmltaXplXCIpKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmltemUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQud2hpY2ggPT09IDEgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFwcC1pY29uLW1pbmltaXplZFwiKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQXBwV2luZG93KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgdGhpcy5fbW92aW5nV2luZG93ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21vdmluZ1dpbmRvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZ2dlcmVkIHdoZW4gYSBrZXkgaXMgcmVsZWFzZWQuXG4gICAgICogY2hlY2sgdGFyZ2V0IGFuZCBtaW5pbWl6ZXMgb3IgcmVzdG9yZXMgbWluaW1pemVkIGFwcCBpZiB0aGUga2V5IGlzIGVudGVyIGtleS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IC0ga2V5IGV2ZW50LCAoZW50ZXIpXG4gICAgICovXG4gICAga2V5VXAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhcHAtY2xvc2VcIikpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VBcHAoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQud2hpY2ggPT09IDEzICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhcHAtbWluaW1pemVcIikpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW16ZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC53aGljaCA9PT0gMTMgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFwcC1pY29uLW1pbmltaXplZFwiKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQXBwV2luZG93KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzICYmIGV2ZW50LnRhcmdldC5pZCA9PT0gXCJtZW1vcnktaWNvbi1saW5rXCIpIHtcbiAgICAgICAgICAgIGxldCBtZW1vcnkgPSBuZXcgTWVtb3J5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50YXJnZXQucGFyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucyhcImFwcC10b29sYmFyXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW92aW5nV2luZG93ID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cuc3R5bGUuekluZGV4ID0gZ2VuZXJpY0FwcFdpbmRvdy5nZXROZXh0WigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvclJlbFBvc1ggPSBldmVudC5jbGllbnRYIC0gcGFyc2VJbnQodGhpcy5fbW92aW5nV2luZG93LnN0eWxlLmxlZnQucmVwbGFjZShcInB4XCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3JSZWxQb3NZID0gZXZlbnQuY2xpZW50WSAtIHBhcnNlSW50KHRoaXMuX21vdmluZ1dpbmRvdy5zdHlsZS50b3AucmVwbGFjZShcInB4XCIsIFwiXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbG9zZXMgdGhlIGFwcCB3aGVuIGNsb3NlIGltYWdlIGlzIHByZXNzZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gYXBwSW5zdGFuY2UgLSBzcGVjaWZpYyBhcHAgYXMgRE9NIGVsZW1lbnRcbiAgICAgKi9cbiAgICBjbG9zZUFwcChhcHBJbnN0YW5jZSkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKS5yZW1vdmVDaGlsZChhcHBJbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuX21vdmluZ1dpbmRvdyA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGFwcEluc3RhbmNlLnRpdGxlID09PSBcIkNoYXRcIikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jaGF0QXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NoYXRBcnJbaV0uX215SW5zdGFuY2UuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGFwcEluc3RhbmNlLmdldEF0dHJpYnV0ZShcImlkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXRBcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1pbmltaXplcyB0aGUgYXBwIHdoZW4gbWluaW1pemUgaW1hZ2UgaXMgcHJlc3NlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtlbGVtZW50fSBhcHBJbnN0YW5jZSAtIHNwZWNpZmljIGFwcCBhcyBET00gZWxlbWVudFxuICAgICAqL1xuICAgIG1pbmltemUoYXBwSW5zdGFuY2UpIHtcbiAgICAgICAgYXBwSW5zdGFuY2UuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIGlmIChhcHBJbnN0YW5jZS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBcIk1lbW9yeVwiKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmltaXplQXBwKFwibWVtb3J5XCIsIGFwcEluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcHBJbnN0YW5jZS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBcIkNoYXRcIikge1xuICAgICAgICAgICAgdGhpcy5taW5pbWl6ZUFwcChcImNoYXRcIiwgYXBwSW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2UgaWYgKGFwcEluc3RhbmNlLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgPT09IFwiR2FtZTE1XCIpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW1pemVBcHAoXCJnYW1lMTVcIiwgYXBwSW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWluaW1pemVzIHRoZSBhcHAsIGhlbHAgZnVuY3Rpb24gdG8gbWluaW1pemUoKVxuICAgICAqXG4gICAgICogQHBhcmFtIHthcHB9IGFwcEluc3RhbmNlLmdldEF0dHJpYnV0ZShcIm5hbWVcIilcbiAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGFwcEluc3RhbmNlIC0gc3BlY2lmaWMgYXBwIGFzIERPTSBlbGVtZW50XG4gICAgICovXG4gICAgbWluaW1pemVBcHAoYXBwLCBhcHBJbnN0YW5jZSkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgYXBwICsgXCItaWNvbi1taW5pbWl6ZWRcIik7XG4gICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIGxldCBtaW5pbWl6ZWRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtaW5pbWl6ZWQtXCIgKyBhcHApO1xuICAgICAgICBtaW5pbWl6ZWRMaXN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiSU1HXCIpWzBdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1hZ2UvXCIgKyBhcHAgKyBcIi5wbmdcIik7XG4gICAgICAgIG1pbmltaXplZExpc3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICBtaW5pbWl6ZWRMaXN0Lmxhc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBhcHBJbnN0YW5jZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByZXN0b3JlcyB0aGUgYXBwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGFwcEljb24gLSBzcGVjaWZpYyBhcHAgYXMgRE9NIGVsZW1lbnRcbiAgICAgKi9cbiAgICByZXN0b3JlQXBwV2luZG93KGFwcEljb24pe1xuICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhcHBJY29uLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpO1xuICAgICAgICB0aGlzLl9tb3ZpbmdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIGFwcEljb24ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhcHBJY29uKTtcbiAgICAgICAgdGhpcy5fbW92aW5nV2luZG93LnN0eWxlLnpJbmRleCA9IGdlbmVyaWNBcHBXaW5kb3cuZ2V0TmV4dFooKTtcbiAgICAgICAgLy90aGlzLl9tb3ZpbmdXaW5kb3cuZm9jdXMoKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIiNcIiArIHRoaXMuX21vdmluZ1dpbmRvdy5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICB9XG59XG5cbi8qKlxuICogIEV4cG9ydHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUFdEO1xuIiwiLyoqXG4gKiBAYXV0aG9yIEpvaGFuIFPDtmRlcmx1bmRcbiAqIEB2ZXJzaW9uIDEuMFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xuXG4vKlxuICpBcHBsaWNhdGlvbnMgZW50cnlwb2ludFxuICovXG50cnkge1xuICAgIGxldCBwV0QgPSBuZXcgUFdEKCk7XG59IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignRVJST1I6ICcsIGUubWVzc2FnZSk7XG59XG4iLCIvKipcbiAqIEdlbmVyaWMgd2luZG93XG4gKlxuICogQGF1dGhvciBKb2hhbiBTw7ZkZXJsdW5kXG4gKiBAdmVyc2lvbiAxLjBcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcC13aW5kb3cnKTtcbmxldCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xubGV0IElEY291bnRlciA9IDA7XG5cbmxldCB4ID0gMDtcbmxldCB5ID0gMjU7XG5sZXQgeiA9IDE7XG5cbi8qKlxuICogU2V0cyBwb3NpdGlvbiBvZiBuZXdseSBjcmVhdGVkIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7ZWxlbWVudH0gYXBwSW5zdGFuY2UgLSB0aGUgd2luZG93IHRvIGJlIHBsYWNlZFxuICovXG5mdW5jdGlvbiBzZXRQb3NpdGlvbihhcHBJbnN0YW5jZSl7XG4gICAgbGV0IGlubmVyV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgaW5uZXJIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgeiArPSAxO1xuICAgIGlmICh5IDwgaW5uZXJIZWlnaHQgLSAxMDApIHtcbiAgICAgICAgeSArPSA1MDtcbiAgICB9IGVsc2UgaWYgKHggPCBpbm5lcldpZHRoKSB7XG4gICAgICAgIHggKz0gMjQwO1xuICAgICAgICB5ID0gNTU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHggPSAwO1xuICAgICAgICBsZXQgeSA9IDI1O1xuICAgIH1cbiAgICBhcHBJbnN0YW5jZS5zdHlsZS5sZWZ0ID0geCArIFwicHhcIjtcbiAgICBhcHBJbnN0YW5jZS5zdHlsZS50b3AgPSB5ICsgXCJweFwiO1xuICAgIGFwcEluc3RhbmNlLnN0eWxlLnpJbmRleCA9IHo7XG59XG5cbi8qKlxuICogQWRkcyBhIGdlbmVyaWMgd2luZG93IHRvIHRoZSBtYWluIGRpdlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgYXBwbGljYXRpb25cbiAqL1xuY29uc3QgYXBwV2luZG93ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIElEY291bnRlcisrO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbWFpbi5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgbGV0IGFwcEluc3RhbmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wVmFyXCIpO1xuICAgIHNldFBvc2l0aW9uKGFwcEluc3RhbmNlKTtcbiAgICBhcHBJbnN0YW5jZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBJRGNvdW50ZXIpO1xuICAgIGFwcEluc3RhbmNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicFwiKVswXS50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgYXBwSW5zdGFuY2Uuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBuYW1lKTtcbiAgICBhcHBJbnN0YW5jZS50aXRsZSA9IG5hbWU7XG4gICAgcmV0dXJuIGFwcEluc3RhbmNlO1xufVxuXG4vKipcbiAqIHJldHVybnMgdGhlIG1vc3Qgb3V0ZXIgekluZGV4IHZhbHVlIG9uIHRoZSBjcmVlbiBhbmQgaW5jcmVhY2VzIGl0IGJ5IDFcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uXG4gKi9cbmNvbnN0IGdldE5leHRaID0gZnVuY3Rpb24oKSB7XG4gICAgeiA9IHogKyAxO1xuICAgIHJldHVybiB6O1xufVxuXG4vKipcbiAqICBFeHBvcnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cy5hcHBXaW5kb3cgPSBhcHBXaW5kb3c7XG5tb2R1bGUuZXhwb3J0cy5nZXROZXh0WiA9IGdldE5leHRaO1xuXG4iLCIvKipcbiAqIFN0b3JlcyBkYXRhIGluIFdlYnN0b3JhZ2VzLlxuICpcbiAqIEBhdXRob3IgSm9oYW4gU8O2ZGVybHVuZFxuICogQHZlcnNpb24gMS4wXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldExvZzogZ2V0TG9nLFxuICAgIGFkZE1lc3NhZ2U6IGFkZE1lc3NhZ2UsXG4gICAgc3RvcmVVc2VybmFtZTogc3RvcmVVc2VybmFtZSxcbiAgICBnZXRVc2VybmFtZTogZ2V0VXNlcm5hbWVcbn1cblxuLyoqXG4gKiBHZXQgY2hhdCBsb2cgZnJvbSB3ZWJzdG9yYWdlIGFuZCByZXR1cm5zIGl0XG4gKi9cbmZ1bmN0aW9uIGdldExvZygpIHtcbiAgICBsZXQgbWVzc2FnZUxvZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtZXNzYWdlTG9nXCIpKTtcbiAgICBpZiAobWVzc2FnZUxvZyA9PT0gbnVsbCkge1xuICAgICAgICBtZXNzYWdlTG9nID0gW107XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlTG9nO1xufVxuXG4vKipcbiAqICBMb2dzIHRoZSBtZXNzYWdlIGFycmF5IHRvIGxvY2FsIHN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gYWRkTWVzc2FnZShtZXNzYWdlLCBtZXNzYWdlTG9nKSB7XG4gICAgaWYgKG1lc3NhZ2VMb2cubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgbWVzc2FnZUxvZy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1lc3NhZ2VMb2dcIiwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZUxvZykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2VMb2cuc2hpZnQoKTtcbiAgICAgICAgbWVzc2FnZUxvZy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1lc3NhZ2VMb2dcIiwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZUxvZykpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVVc2VybmFtZSh1c2VybmFtZSkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgSlNPTi5zdHJpbmdpZnkodXNlcm5hbWUpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlcm5hbWUoKSB7XG4gICAgbGV0IHVzZXJuYW1lID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpKTtcbiAgICBpZiAodXNlcm5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgdXNlcm5hbWUgPSBcIlpsYXRhblwiO1xuICAgIH1cbiAgICByZXR1cm4gdXNlcm5hbWU7XG59XG4iXX0=
