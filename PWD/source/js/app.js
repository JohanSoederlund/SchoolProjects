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
