"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let snippetSchema = new Schema({
    title:  String,
    author: String,
    body:   String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

let Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
