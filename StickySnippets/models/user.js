"use strict";
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:  {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: String
});
userSchema.pre("save", function(next) {
    var user = this;
    bcrypt.genSalt(2, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            user.salt = salt;
            next();
        });
    });
});

userSchema.path("password").validate(function(password) {
    return password.length >= 6;
}, "The password must be of minimum length of six characters");

userSchema.methods.genHashedPassword = function(password, salt, next) {
    bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) {
            return next(err);
        } else {
            return hash;
        }
    });
}

// Check if password user is trying (in our model)
// compare-function takes the hashed string in db
// Hash candidatePassword, if they are the same res is true
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, res) {
        if(err) {
            return callback(err);
        }
        callback(null, res);
    });
};

let User = mongoose.model("User", userSchema);

module.exports = User;

