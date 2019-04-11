"use strict";

var express = require("express");
var User = require("../models/user.js");
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: false });

router.route("/")
    .get(function(req, res, next) {
        res.render('register', {auth: req.session.auth, csrfToken: req.csrfToken(), title: "Register new user"});
    })
    .post(csrfProtection, function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var passwordRepeat = req.body.repeatPassword;
        if (password === passwordRepeat && username !== undefined && username !== null) {
            User.find({username: username}, function (error, data) {
                if (error) {
                    req.session.flash = {
                        success: "false",
                        message: "Please try again!"
                    }
                    res.redirect("/register");
                } else {
                    if (data[0] == null) {
                        var userObj = new User({
                            username:  username,
                            password: password
                        })
                        userObj.save(function(error) {
                            if (error) {
                                console.log("Could not save user!   " + error);
                                next(error);
                            } else {
                                req.session.flash = {
                                    success: "true",
                                    message: "Successfully created user, go ahead and login!"
                                }
                                res.redirect("/login");
                            }
                        });
                    } else {
                        req.session.flash = {
                            success: "false",
                            message: "Username taken!"
                        }
                        res.redirect("/register");
                    }
                }
            });
        } else {
            req.session.flash = {
                success: "false",
                message: "Please try again!"
            }
            res.redirect("/register");
        }
    });

module.exports = router;
