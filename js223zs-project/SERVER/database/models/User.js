/**
 * Mongoose Schema User Model.
 */

 // Imports
 const Schema = require('mongoose').Schema;
 const model = require('mongoose').model;
 
 // Schema
 const UserSchema = Schema({
     userName: {type: String, required: true},
     password: {type: String, required: true}
 });
 //let User = model('User', UserSchema);

 let User = model.call(require('mongoose'), 'User', UserSchema);
 
 // Exports
 module.exports = User;