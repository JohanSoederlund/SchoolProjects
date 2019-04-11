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
