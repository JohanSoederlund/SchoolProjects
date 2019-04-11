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
