/**
 * Created by Johan on 2017-03-01.
 */
"use strict";

var express = require('express');
var index = require('./index');
var snippet = require('./snippet');
var register = require('./register');
var login = require('./login');
var logout = require('./logout');
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: false });
var router = express.Router();

router.use('/snippet', csrfProtection, snippet);
router.use('/logout', csrfProtection, logout);
router.use('/login', csrfProtection, login);
router.use('/register', csrfProtection, register);

router.use('/', index);

module.exports = router;
