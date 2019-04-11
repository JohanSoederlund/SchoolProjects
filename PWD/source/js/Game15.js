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
