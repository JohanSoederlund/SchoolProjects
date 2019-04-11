/**
 * Controller
 *
 * @author Johan Söderlund
 * @version 1.0
 */

"use strict";
let rp = require('request-promise');
let htmlAnalyzer = require("./htmlAnalyzer");
let planer = require("./planer");
let pageLoad = require("./pageLoader");
let serverAdr = "http://vhost3.lnu.se:20080";
let startingUrl = "http://vhost3.lnu.se:20080/weekend";
let url = process.argv[2] || startingUrl;


let request = require("request");

class Controller {
    /**
     * Constructs an object of PWD.
     */
    constructor() {
        this.compareDaysArr = [];
        this.linkToCalendar = [];
        this.linkToCinema;
        this.linkToRestaurant;
        this.movieOptionsArr = [];
        this.startPageLinks = [];
        this.calendarLinks = [];
        this.calendar();
        this.availableMovies = [];
    }
    /**
     * Creates URLs to use in submit
     *
     * @param {array} movieOptionsArr - array with movieoptions to use in submit
     */
    modifyMovieUrl(movieOptionsArr) {
        let urlArr = [];
        let url = this.linkToCinema + "/check?day=";
        for (let i = 0; i < movieOptionsArr.compareDaysArr.length; i += 1) {
            if (movieOptionsArr.compareDaysArr[i].status) {
                for (let j = 0; j < movieOptionsArr.moviesArr.length; j += 1) {
                    urlArr.push(url + movieOptionsArr.compareDaysArr[i].dayNumber + "&movie=" + movieOptionsArr.moviesArr[j].movieNumber);
                }
            }
        }
        return urlArr;
    }
    /**
     * Creates URLs to use in submit
     *
     * @param {array} movieOptionsArr - array with movieoptions to use in submit
     */
    getAvailableMovies(arr) {
        arr.forEach( (element)=> {
            let tmp = JSON.parse(element);
            for (let i = 0; i < tmp.length; i += 1) {
                if (tmp[i].status === 1) {
                    this.availableMovies.push(tmp[i]);
                }
            }
        });
    }
    /**
     * Member function controlling flow of tasks regarding restaurant booking options
     */
    restaurant() {
        this.linkToRestaurant = serverAdr + this.startPageLinks[2];
        pageLoad.fetch(this.linkToRestaurant).then( (data) => {
            let actionValue = htmlAnalyzer.getAction(data);
            let uri = serverAdr + actionValue;
            let config = {
                form: {
                    username: 'zeke',
                    password: 'coys',
                    submit: 'login'
                }
            };
            pageLoad.post(uri, config).then( (data)=> {
                let redirectLink = serverAdr + this.startPageLinks[2] + "/" + data.location;
                let credentials = {
                    headers: {
                        cookie: data['set-cookie']
                    }
                }
                pageLoad.fetch(redirectLink, credentials).then( (data)=> {
                    let availableRestaurantArr = htmlAnalyzer.getInput(data);
                    planer.planDate(this.availableMovies,this.movieOptionsArr , availableRestaurantArr);
                }).catch( function(error) {
                    console.log(error);
                });
            }).catch( function(error) {
                console.log(error);
            });
        }).catch( function(error) {
            console.log(error);
        });
    }
    /**
     * Member function controlling flow of tasks regarding movie booking options
     */
    cinema() {
        this.linkToCinema = serverAdr + this.startPageLinks[1];
            pageLoad.fetch(this.linkToCinema).then( (data) => {
                this.movieOptionsArr = htmlAnalyzer.getCinemaOptions(data, this.compareDaysArr);
                let url = this.modifyMovieUrl(this.movieOptionsArr);
                let promiseArr = [];
                url.forEach( function(e) {
                    promiseArr.push(pageLoad.fetch(e));
                });
                Promise.all(promiseArr).then( (data) => {
                    this.getAvailableMovies(data);
                    this.restaurant();
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch( function(error) {
            console.log(error);
        })
    }
    /**
     * Member function controlling flow of tasks regarding each persons calendar
     */
    calendar() {
        pageLoad.fetch(url).then( (data) =>  {
            this.startPageLinks = htmlAnalyzer.getLink(data);
            return this.startPageLinks;
        }).then( (data) =>  {
            this.linkToCalendar = serverAdr + data[0];
            return pageLoad.fetch(this.linkToCalendar);
        }).then( (data) =>  {
            //Calendar
            this.calendarLinks = htmlAnalyzer.getLink(data);
            //calendarFucntion
            let newTarget = this.linkToCalendar + "/" + this.calendarLinks[0];
            return pageLoad.fetch(newTarget);
        }).then( (data) =>  {
            this.compareDaysArr = htmlAnalyzer.getSchedule(data);
            this.compareDaysArr = htmlAnalyzer.compareSchedule(data, this.compareDaysArr);
            let newTarget = this.linkToCalendar + "/" + this.calendarLinks[1];
            return pageLoad.fetch(newTarget);
        }).then( (data) => {
            this.compareDaysArr = htmlAnalyzer.compareSchedule(data, this.compareDaysArr);
            let newTarget = this.linkToCalendar + "/" + this.calendarLinks[2];
            return pageLoad.fetch(newTarget);
        }).then( (data) =>  {
            this.compareDaysArr = htmlAnalyzer.compareSchedule(data, this.compareDaysArr);
            if (!this.testCalendar(this.compareDaysArr)) {
                console.log("No day this week is suitable for all!")
                return;
            }
            this.cinema();
        }).catch( function(error) {
            console.log(error);
        });
    }
    /**
     * Help function to calendar, checks that there is day(s) that everybody can meet
     *
     * @param {array} compareDaysArr - array with calendar-data objects
     */
    testCalendar(compareDaysArr) {
        for (let i = 0; i < compareDaysArr.length; i += 1) {
            if (compareDaysArr[i].status) {
                return true;
            }
        }
        return false;
    }
}

/*
 * Exports
 */
module.exports = Controller;