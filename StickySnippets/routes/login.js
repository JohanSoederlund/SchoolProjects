/**
 * Created by Johan on 2017-03-01.
 */
"use strict";

var express = require('express');
var router = express.Router();
var User = require("../models/user.js");

var bcrypt = require('bcrypt-nodejs');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: false });

router.route("/")
    .get(function(req, res, next) {
        res.render("login", {auth: req.session.auth, csrfToken: req.csrfToken(), title: "Login"});
    })
    .post(csrfProtection, function(req, res, next) {
        //call monoDB with snippet id param
        var username = req.body.username;
        var password = req.body.password;
        User.find({username: username}, function (error, data) {
            if (error) {
                next(error);
            } else {
                if (data[0] == null) {
                    req.session.flash = {
                        success: "false",
                        message: "Incorrect username or password, please try again!"
                    }
                    res.redirect("/login");
                } else {
                    var salt = data[0].salt;
                    bcrypt.hash(password, salt, null, function(err, hash) {
                        if (err) {
                            return next(err);
                        } else if (data[0].password === hash) {
                            var session = req.session;
                            session.auth = true;
                            session.user = data[0].username;
                            req.session.flash = {
                                success: "true",
                                message: "Successfully logged in to new session!"
                            }
                            res.redirect("/");
                        } else {
                            req.session.flash = {
                                success: "false",
                                message: "Incorrect username or password, please try again!"
                            }
                            res.redirect("/login");
                        }
                    });
                }
            }
        });
    });

module.exports = router;
