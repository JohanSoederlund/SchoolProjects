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
