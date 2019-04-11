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

