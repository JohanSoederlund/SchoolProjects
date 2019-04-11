/**
 * Created by Johan on 2017-03-01.
 */
"use strict";
let Snippet = require('../models/snippet.js');
let express = require('express');
let router = express.Router();

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: false });

/*
    Get one snippet
 */
router.route('/edit/:snippetId')
    .get(function(req, res, next) {
        let snippetId = req.params.snippetId;
        Snippet.find({_id: snippetId}, function (error, data) {
            if (error) {
                console.log("Could not GET!");
                //error with four params
                next(error);
            } else {
                res.render('snippet', {auth: req.session.auth, csrfToken: req.csrfToken(), title: "Code Snippet", data});
            }
        })
    })
    .post(csrfProtection, function(req, res, next) {
        if (req.session.auth) {
            //call monoDB with snippet id param
            let snippetId = req.params.snippetId;

            Snippet.findOneAndUpdate({_id: snippetId}, {$set: {title: req.body.title, body: req.body.snippet, updatedAt: new Date() }}, {returnNewDocument: true}, function(error, data) {
                if (error) {
                    next();
                } else {
                    req.session.flash = {
                        success: true,
                        message: "Successfully saved edit of snippet to database!"
                    }
                    res.redirect("/");
                }
            });
        } else {
            req.session.flash = {
                success: false,
                message: "Please log in!"
            }
            res.redirect("/login");
        }
    });

router.route('/create')
    .get(function(req, res, next) {
        //  Get nextSnippetId variable from moxoDB
        // call monoDB with snippet id param
        res.render('createSnippet', {auth: req.session.auth, csrfToken: req.csrfToken(), title: 'Create' });
    })
    .post(csrfProtection, function(req, res, next) {
        if (req.session.auth) {
            let snippetObj = new Snippet({
                title:  req.body.title,
                author: req.session.user,
                body:   req.body.snippet
            })
            snippetObj.save( function (error) {
                if (error) {
                    next(error);
                } else {
                    req.session.flash = {
                        success: "true",
                        message: "Successfully saved snippet to database!"
                    }
                    res.redirect("/");
                }
            })
        } else {
            req.session.flash = {
                success: "false",
                message: "Please log in!"
            }
            res.redirect("/login");
        }
    });

router.route('/delete/:snippetId')
    .get(function(req, res, next) {
        res.render('deleteSnippet', {auth: req.session.auth, csrfToken: req.csrfToken(), title: 'Delete' });
    })
    .post(csrfProtection, function(req, res, next) {
        if (req.session.auth) {
            let snippetId = req.params.snippetId;
            Snippet.findOneAndRemove({_id: snippetId}, function (error) {
                if (error) {
                    next(error);
                } else {
                    req.session.flash = {
                        success: "true",
                        message: "Snippet was deleted successfully!"
                    }
                    res.redirect("/");
                }
            });
        } else {
            req.session.flash = {
                success: "false",
                message: "Please log in!"
            }
            res.redirect("/login");
        }
    });

module.exports = router;
