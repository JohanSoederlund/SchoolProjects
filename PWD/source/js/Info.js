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

