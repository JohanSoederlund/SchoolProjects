In this assignment, you will create a web application for persistent handling of programming code snippets using an application framework and an object data modeling library for MongoDB.

## Requirements
The application in Node.js will use Express.js as the application framework and Mongoose as the object modeling library. The application must have full CRUD functionality regarding snippets, whereby a user must be able to create, read, update and delete snippets.

Users must be able to register themselves and must be able to login to the application after entering a user ID and a password. A user cannot register an already existing user ID as user ID is unique for the application. A user must be able to log off from the application it has already logged on to.

Anonymous users will only be able to view snippets. Authenticated users, in addition to view, must also be able to create, edit and delete own snippets. Nobody but the authenticated user should be able to create, edit and delete her/his own snippets. Because of this the application must support some basic authentication and authorization. Only use of the session store, using the express-session module, is allowed for implementation of authentication and authorization. You must not use any modules like Passport, etc., to authenticate or authorize. When writing and presenting snippets the application must support multiline text, meaning the user should be able to write real code snippet, not just a one line text string. The application should be easy to understand meaning that the users should get clear notification on what is going on in the application (eg. using flash messages)

If a user tries to access a resource which requires the user to be logged in, the application must return the status code 403 (forbidden). Of course, when necessary, the application must also return the status code 404 (not found) as well as 500 (internal error).

As far as possible, the application must be protected from vulnerable attacks. Be prepared to explain and defend your solution at the oral hearing.

As always, we have the following requirements:

The application should be written as a Node.js application in Javascript following the JavaScript Standard Style
The only command the examinator should do to run your application when cloning it from GitHub is npm install and npm start
You should work with GitHub and do several commits to show how your solution has been made.
To submit your solution and tell the examinators that you are ready you must do a release of your code on your GitHub repo otherwise will you not be able to book a time for the oral hearing.
