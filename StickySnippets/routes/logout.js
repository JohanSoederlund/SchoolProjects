"use strict";

var express = require('express');
var router = express.Router();

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: false });

router.route("/")
    .get(function(req, res, next) {
        res.render("logout", {auth: req.session.auth, csrfToken: req.csrfToken(), title: "Logout"});
    })
    .post(csrfProtection, function(req, res, next) {
        req.session.auth = false;
        req.session.flash = {
            success: "true",
            message: "Successfully logged out of session!"
        }
        res.redirect("/");
    });

module.exports = router;
