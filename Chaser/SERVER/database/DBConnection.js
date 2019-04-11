/**
 * Handles the connection against the database.
 */

// Imports
const mongoose = require('mongoose');

/**
 * Sets up and handles the database-connection.
 */
module.exports =  function() {

	var db = mongoose.connection;

	/**
	 * Connects to the database with the connectionstring given.
	 */
	function connect(connectionString) {
		return new Promise((resolve, reject) => {
			connectToDB(connectionString).then(() => {
				setUpDBListeners();
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Disconnects from the database if there is an active connection.
	 */
	function disconnectDB() {
        if (db) {
			db.close();
		} 
	}

	/**
	 * Sets up listeners on the database.
	 */
	function setUpDBListeners() {
		//db = mongoose.connection;
		mongoose.Promise = global.Promise;

		db.on('error', (err) => {
            	console.error(err);
		});

		db.on('connected', () => {
            console.log('db ready: connected');
		});

		db.on('open', () => {
            console.log('db ready: open');
		});

		db.on('disconnected', () => {
            console.log('db disconnected');
		});

		// Close database connection if node process closes.
		db.on('SIGINT', () => {
			db.close((err) => {
				if(err){
					process.exit(0);
				} else {
					process.exit(0);
				}
				
			});
		});
	}

	/**
	 * Connects to the database.
	 */
	function connectToDB(connectionString) {
        return new Promise((resolve, reject) => {
            mongoose.connect(connectionString).then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
    
    return {
		connect,
	  	disconnectDB
	}

}
