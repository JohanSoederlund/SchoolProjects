/**
 * Module for planing schedule
 *
 * @author Johan Söderlund
 * @version 1.0
 */
"use strict";

/*
 * Exports
 */
module.exports = {
    planDate: planDate
}
/**
 * Solves which times and days that the friends can choose between to meet,
 * and see a movie and then eat. Prints the result into the terminal.
 *
 * @param {array} availableMovies - data about availible movies
 * @param {array} movieOptionsArr - data about availible movies
 * @param {array} availableRestaurantArr - data about availible restaurant table times
 */
function planDate(availableMovies, movieOptionsArr, availableRestaurantArr) {
    //calculateSuitableTables
    for (let i = 0; i < availableMovies.length; i += 1) {
        //Adding day name to availableMovies array
        let tmpDay = availableMovies[i].day;
        for (let j = 0; j < movieOptionsArr['compareDaysArr'].length; j += 1) {
            if (movieOptionsArr['compareDaysArr'][j].dayNumber === tmpDay) {
                availableMovies[i].dayName = movieOptionsArr['compareDaysArr'][j].name;
            }
        }
        //Adding movie name to availableMovies array
        let tmpMovieNumber = availableMovies[i].movie;
        for (let k = 0; k < movieOptionsArr['moviesArr'].length; k += 1) {
            if (movieOptionsArr['moviesArr'][k].movieNumber === tmpMovieNumber) {
                availableMovies[i].movieName = movieOptionsArr['moviesArr'][k].name;
            }
        }
    }
    //restaurant
    let finalAlternativesArr = [];
    let tmpAlternativeStr = "";
    for (let i = 0; i < availableRestaurantArr.length; i += 1) {
        let tmpRestaurantDay = availableRestaurantArr[i].slice(0, 3).toLowerCase();
        let tmpRestaurantTime = availableRestaurantArr[i].slice(3, 5);
        for (let j = 0; j < availableMovies.length; j += 1) {
            let tmpMovieDay = availableMovies[j].dayName.slice(0, 3).toLowerCase();
            let tmpMovieTime = availableMovies[j].time.slice(0, 2);
            if (tmpRestaurantDay === tmpMovieDay && parseInt(tmpRestaurantTime) === parseInt(tmpMovieTime)+2) {
                tmpAlternativeStr = "Alternative: Meet on " + availableMovies[j].dayName + " at " + availableMovies[j].time + " and see " + availableMovies[j].movieName +
                        ", then go to Zekes for dinner at " + tmpRestaurantTime;
                finalAlternativesArr.push(tmpAlternativeStr);
                console.log(tmpAlternativeStr);
            }
        }
    }
    if (finalAlternativesArr.length === 0) {
        console.log("Sorry, no combination of day, movie and restaurant table available this week");
    }
}
