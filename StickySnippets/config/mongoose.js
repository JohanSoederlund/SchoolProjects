/**
 * Mongoose configuration.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

"use strict";

let mongoose = require("mongoose");


const CONNECTION_STRING = "mongodb://test:test@ds115110.mlab.com:15110/johan";

module.exports =  function() {
    let db = mongoose.connect(CONNECTION_STRING);

    db.connection.on("connected", function() {
        console.log("Mongoose connection open.");
    });

    db.connection.on("error", function(err) {
        console.error("Mongoose connection error: ", err);
    });

    db.connection.on("disconnected", function() {
        console.log("Mongoose connection disconnected.");
    });

    // If the Node process ends, close the Mongoose connection.
    process.on("SIGINT", function() {
        db.connection.close(function() {
            console.log("Mongoose connection disconnected through app termination.");
            process.exit(0);
        });
    });

    return db;
};
