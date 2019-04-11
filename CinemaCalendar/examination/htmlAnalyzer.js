/**
 * Module for analyzing html
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";

let cheerio = require("cheerio");

/*
 * Exports
 */
module.exports = {
    getLink: getLink,
    getSchedule: getSchedule,
    compareSchedule: compareSchedule,
    getCinemaOptions: getCinemaOptions,
    getAction: getAction,
    getInput: getInput
}
/**
 * Returns all <Input> tags from document
 *
 * @param {document} html - A html document
 * @return {array} inputValueArr - input tags
 */
function getInput(html) {
    let $ = cheerio.load(html);
    let input = $("input");
    let inputValueArr = [];
    $(input).each( function(i, e) {
        inputValueArr.push(e.attribs.value);
    });
    return inputValueArr;
}
/**
 * Returns <Form> tag value from document
 *
 * @param {document} html - A html document
 * @return {value} form[0].attribs.action
 */
function getAction(html) {
    let $ = cheerio.load(html);
    let form = $("form");
    return form[0].attribs.action;
}
/**
 * Returns matching data from calendar array and available cinemas
 *
 * @param {array} compareDaysArr - array with calendar-data objects and cinema-data objects
 * @param {document} html - A html document
 * @return {array} optionsItem - Consists of objects with data about movies
 */
function getCinemaOptions(html, compareDaysArr) {
    let $ = cheerio.load(html);
    let options = $("option");
    let movies = [];
    $(options).each( function(i, e) {
        for (let i = 0; i < compareDaysArr.length; i += 1) {
            if (compareDaysArr[i].status && compareDaysArr[i].name === e.children[0].data) {
                compareDaysArr[i].dayNumber = e.attribs.value;
            }
        }
        if (i > 4 && e.attribs.value !== "") {
            movies.push({
                name: e.children[0].data,
                movieNumber: e.attribs.value
            })
        }

    });
    let optionsItem = {
        compareDaysArr: compareDaysArr,
        moviesArr: movies
    }
    return optionsItem;
}
/**
 * Returns hyperlinks in an array
 *
 * @param {document} html - A html document
 * @return {array} linksArr - Consists of hrefs
 */
function getLink(html) {
    let $ = cheerio.load(html);
    let links = $("a");
    let linksArr = [];
    $(links).each( function(i, link) {
        linksArr.push(link.attribs.href);
    });
    return linksArr;
}
/**
 * Creates an array with weekdays that works and that doesnt work for everybody
 *
 * @param {array} daysArr
 * @param {document} html - A html document
 * @return {array} linksArr
 */
function compareSchedule(html, daysArr) {
    let $ = cheerio.load(html);
    let status = $("td");
    $(status).each( function(i, status) {
        if (status.children[0].data !== "ok" && status.children[0].data !== "Ok" && status.children[0].data !== "OK") {
            daysArr[i].status = false;
        }
    });
    return daysArr;
}
/**
 * Creates an array of weekdays that works for one person
 *
 * @param {document} html - A html document
 * @return {array} dayArr
 */
function getSchedule(html) {
    let $ = cheerio.load(html);
    let days = $("th");
    let dayArr = [];
    $(days).each( function(i, day) {
        dayArr.push({
            dayNumber: undefined,
            name: day.children[0].data,
            status: true
        });
    });
    return dayArr;
}

