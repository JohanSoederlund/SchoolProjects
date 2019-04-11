/**
 * Handles the connection against the database.
 */

// Imports
const mongoose = require('mongoose');

//var DBConnection = require('./DBConnection');
const User = require('./models/User');

/**
 * Sets up and handles the database.
 */
module.exports = function(databaseConnection) {

	var dbconnection = databaseConnection;
	var models = {};
	models.user = User;
	

	/**
	 * Connects to the database with the connectionstring given.
	 */
	function connect(connectionString) {
		return new Promise((resolve, reject) => {
			dbconnection.connect(connectionString).then(() => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
        });
	}

	/**
	 * Returns the first document of the specific type that matches the info given.
	 */
	function getOne(type, info) {
		if (!isConnected()) {
			return new Promise((resolve, reject) => {
				reject(new DBConnectionError('Connection to the database is down'));
			});
		} else {
            return new Promise((resolve, reject) => {
				if (!info.userName || !info.password){
					reject(info);
				} else {
					User.findOne(info)
					.then((result) => {
						resolve(result);
					})
					.catch((error) => {
						reject(error);
					});
				}
            });
		}
	}

	/**
	 * Returns all documents of the specific type that matches the info given.
	 */
	function getAll(type, info) {
		if (!isConnected()) {
			return new Promise((resolve, reject) => {
				reject(new DBConnectionError('Connection to the database is down'));
			});
		} else {
            return new Promise((resolve, reject) => {
                User.find(info)
					.then((result) => {
						resolve(result);
					})
					.catch((error) => {
						reject(error);
					});
            });
		}
	}

	function add(type, info) {
		if (!isConnected()) {
			return new Promise((resolve, reject) => {
				reject(new Error('Connection to the database is down'));
			});
		} else {
			return new Promise((resolve, reject) => {
				User.findOne({userName: info.userName})
					.then((found) => {
						if (found) {
							reject(found);
						} else {
							let user = {};
							if (info.userName) {
								user.userName = info.userName;
							}
							if (info.password) {
								user.password = info.password;
							}
							let userModel = new User(user);
							userModel.save((err, saved) => {
								if (err) {
									console.error(err);
									reject(err);
								}
								resolve(saved);
							})
						}
					});
			});
		}
	}

	/**
	 * Removes one document of the given type that matches the given attributes.
	 */
	function removeOne(type, removeOn) {
		if (!isConnected()) {
			return new Promise((resolve, reject) => {
				reject(new Error('Connection to the database is down'));
			});
		} else {
			const lowerCaseType = type.toLowerCase();
            return new Promise((resolve, reject) => {
                User.findOneAndRemove(removeOn)
                .then((removed) => {
                    resolve(removed);
                })
                .catch((err) => {
                    reject(err);
                });
            });
		}
	}

	/**
	 * Removes all document of the given type that matches the given attributes.
	 */
	function removeAll(type, removeOn) {
		if (!isConnected) {
			return new Promise((resolve, reject) => {
				reject(new Error('Connection to the database is down'));
			});
		} else {
			return new Promise((resolve, reject) => {
                User.remove(removeOn)
                .then((removed) => {
                    resolve(removed);
                })
                .catch((err) => {
                    reject(err);
                });
            });
		}
	}

	/**
	 * Checks if theconnection is up.
	 */
	function isConnected() {
		return mongoose.connection.readyState === 1;
	}

	/**
	 * Adds the given object of the given type to the databse.
	 * @param info - The info of the object to add.
	 * @param findBy - The property to look for in case of updating
	 * a document rather than adding one. If a document with the property is found
	 * that one will be updated with the new information, and no new document will be created.
	 * If more than one matching result is found, all will be updated.
	 */
/*
	function addOrUpdate(type, info, findBy) {
		if (!isConnected()) {
			return new Promise((resolve, reject) => {
				reject(new Error('Connection to the database is down'));
			});
		} else {
			return new Promise((resolve, reject) => {
				const lowerCaseType = type.toLowerCase();
				const conditions = findBy || info;
				if(lowerCaseType === 'user') {
					createNewUser(conditions, info).then((result) => {
						resolve(result);
					})
					.catch((error) => {
						reject(error);
					});
				}
			});
		}
    }
    
    function createNewUser(conditions, info) {
        return new Promise((resolve, reject) => {
            const user = {};
            if (info.userName) {
                user.userName = info.userName;
            }
            if (info.password) {
                user.password = info.password;
            }

			User.findOne(conditions)
                .then((userShouldUpdate) => {
                    let found;

                    if (userShouldUpdate) {
                        found = userShouldUpdate;
                        const fieldsToUpdate = Object.keys(user);
                        fieldsToUpdate.forEach((attribute) => {
                            found[attribute] = user[attribute];
                        });
                    } else {
                        found = new User(user);
                    }
                    return found.save();
                })
                .then((saved) => {
                    resolve(saved);
                })
                .catch((err) => {
                    reject(err);
                });
		});
	}
	*/

	/**
	 * Sets up listeners on the database connection.
	 */
	/*
	function setUpDBListeners() {
		dbconnection.on('connection-error', (err) => {
            console.error(err);
		});

		dbconnection.on('ready', () => {
            console.log('db ready');
		});

		dbconnection.on('disconnected', () => {
            console.log('db disconnected');
		});
		dbconnection.on('close', () => {
            console.log('db disconnected: close');
		});
	}
	*/
    
    return {
        connect,
        getOne,
        getAll,
        removeOne,
		removeAll,
		add
      }
}
