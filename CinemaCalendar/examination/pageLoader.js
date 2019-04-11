/**
 * Fetch and post modules
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

let request = require("request");
let rp = require('request-promise');

/*
 * Exports
 */
module.exports = {
    fetch: fetch,
    post: post
}

/**
 * Promise
 *
 * @param {String} url - link to next page to crawl
 * @param {object} credentials - session-cookie to stay signed in
 * @resolve {document} html
 */
function fetch(url, credentials){
    return new Promise( function(resolve, reject) {
       request(url, credentials, (error, response, html)=> {
          if (error) {
              return reject(error);
          }
          if (response.statusCode !== 200) {
              return reject(new Error("Bad status code: " + response.statusCode));
          }
          resolve(html);
       });
    });
}
/**
 * Promise
 *
 * @param {String} url - link to page to post to
 * @param {template} form - form to POST
 * @resolve {document} html
 */
function post(url, form){
    return new Promise( (resolve, reject)=> {
        request.post(url, form, function(error, response, obj) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode !== 302) {
                return reject(new Error("Bad status code: " + response.statusCode));
            }
            resolve(response.headers);
        });
    });
}
