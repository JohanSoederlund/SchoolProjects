# WebScraper

In this assignment the task is to write a web scraper that scrapes but also analyzes information on some web sites built specially for this assignment. The idea is that you are going to write a scraper/agent that is designed to solve a specific problem.

You will get a main page to proceed from which links to three different web sites. You don't have to care about how they work internally, just the HTML they are rendering and how to form your HTTP request to get the data you want for analyzing.

Your starting point is: http://vhost3.lnu.se:20080/weekend, which should also be the starting point in your scraping script, meaning that no more hardcoded URLs should be used in your code (except for the AJAX call in the cinema site). Your scraping script should also be able to handle the alternative server (see below).

## Scenario

The three friends Peter, Paul and Mary usually get together one weekend every month to see a movie and, after that, eat at a restaurant. The problem is that it is hard to plan this event since they must find a time slot when all three are available, look for a movie that plays at the cinema that day, and finally see if they can book a table at their favorite restaurant. Since all this information is available through HTTP requests it would be nice to have a script that automates this workflow!

And that's your task...

## The web sites
Your script should 
start to scrape the links at the starting-URL and continue from there. This starting-URL should be easy to change when running your script. Remember that we are going to examine your scraper against another server when grading your assignment. As mentioned before, from this URL your application/web scraper should be able to crawl all three applications by itself. The scraper should be able to scrape all information, analyze it and present a solution to the user in a good way. Of course there will be some points internally in the web sites where you will have to hardcode, but try to write it as general as possible (see examinations for more info).

## The calendar

The first web site is where the three friends are syncing their calendar. Each of the friends have their own page, where he/she can edit the information to let the others know what day of the weekend is free. These pages are built with simple HTML and the task is to scrape the pages and analyze on what (if any) day(s) all three friends are free. The friends are only available to see each other on the weekends (Friday, Saturday, Sunday) so there is no need to handle other days.

## The cinema

The cinema web site is a simple web site that displays the cinema's shows for the weekend. You can get which day and at which time a specific movie is running, and if it is fully booked or not. By analyzing the traffic between the client and the server you should be able to find a way to request this information and use it in your code, together with the data from the calendar site. Use the browser's inspector to analyze the traffic.

## The restaurant

The third web site is the three friends' favorite restaurant (the only one they visit..!). To see this site, you must login first. For this you can use the credentials below:

username: zeke
password: coys
The site will use session cookies for authorization which your application must handle in some way. After this you can see the available booking times which you should analyze with the other data to propose a final solution.

## The workflow to automate

* Check which day or days all friends are available; if none - output this on screen
* Get the available movies for that day(s)
* Login to the restaurant web site and get the content
* See when the three friends can eat. Think that they want to book a table minimum two hours after the movie starts.
* Present the solution(s) as output in your terminal/console window (or as a HTML view)
* [Optional] - Use the form for a user to book a table with your application
