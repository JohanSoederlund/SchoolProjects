"use strict";

var express = require('express');
var Snippet = require('../models/snippet.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Snippet.find({}, function (error, data) {
        if (error) {
            console.log("Could not save!");
        } else {
            console.log("index " + res.locals.flash);
            res.render('index', {auth: req.session.auth, title: "Snippets", data});
        }
    })
});


module.exports = router;
