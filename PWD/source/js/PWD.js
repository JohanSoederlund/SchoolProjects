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
