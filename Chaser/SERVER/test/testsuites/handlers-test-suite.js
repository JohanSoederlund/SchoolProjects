const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const client = require('socket.io-client');
var stringHash = require("string-hash")
const Handlers = require('./../../server/handlers');
const ClientManager = require('./../../server/ClientManager');
const GameManager = require('./../../server/GameManager');


const clientManager = ClientManager();
const gameManager = GameManager();

const clientMock = {};
const clientManagerMock = {};
const gameManagerMock = {};
let user1 = "TEST_AAA";
let user2 = "TEST_BBB";
let password = "123";
let wrongPassword = "123";

//let handlers = Handlers(client, clientManager, gameManager);

const {
    handleRegister,
    handleLogin,
    handlePlay,
    handleBoardUpdate,
    handleGameOver,
    handleDisconnect,
    databaseHandler
  } = Handlers(client, clientManager, gameManager);


/**
 * Run the tests.
 */
module.exports = function run() {
	describe('handlers test-suite', () => {
        before( () => {
            /*
            databaseHandler.removeOne('user', {userName: user1})
                .then((removed) => {
                    console.log("before() removed user1 " + removed);
                })
                .catch((err) => {
                    console.error(err);
                });
            databaseHandler.removeOne('user', {userName: user2})
            .then((removed) => {
                console.log("before() removed user2 " + removed);
            })
            .catch((err) => {
                console.error(err);
            });
 */
            
/*
            databaseHandler.getAll('user', {})
                .then((all) => {
                    console.log("before() getAll " + all);
                })
                .catch((err) => {
                    console.error(err);
                });
                */
        });

        after( () =>  {
            
            databaseHandler.removeOne('user', user1)
            .then((removed) => {
            })
            .catch((err) => {
                console.error(err);
            });
            
        });

        describe('handleRegister()', () => {
            it('should be possible to register user', (done) => {
                handleRegister(user1, stringHash(password), (messageObject, user) => {
                    expect(user).to.equal(user1);
                    expect(messageObject).to.be.null;
                    expect(clientManager.isUserLoggedIn(user1)).to.be.true;
                    done();
                });
            });
           
            it('should not be possible to register user twice', (done) => {
                handleRegister(user1, stringHash(password), (messageObject, user) => {
                    expect(messageObject.message).to.equal("username is taken");
                    done();
                });
            });
        
        });

        describe('handleLogin()', () => {
            
            it('it should not be possible for not registered user to login', (done) => {
                handleLogin(user2, stringHash(password), (messageObject, user) => {
                    expect(messageObject.message).to.equal("password or username is wrong");
                    expect(user).to.equal(user2);
                    done();
                });
            });

            it('it should not be possible to login with wrong password', (done) => {
                handleLogin(user2, stringHash(wrongPassword), (messageObject, user) => {
                    expect("password or username is wrong").to.equal(messageObject.message);
                    expect(user2).to.equal(user);
                    done();
                });
            });

            it('it should not be possible to log in when already logged in', (done) => {
                handleLogin(user1, stringHash(password), (messageObject, user) => {
                    expect("user already logged in on another session").to.equal(messageObject.message);
                    expect(user).to.equal(user1);
                    done();
                });
            });

        });
       

        describe('handlePlay()', () => {
            
            it('should be possible to register for a game if logged in', (done) => {
                handlePlay(user1, (messageObject, gameId, array) => {
                    expect(messageObject).to.equal(null);
                    expect(gameId).to.greaterThan(-1);
                    done();
                });                    
            });
           
            it('should not be possible to register for a game if not logged in', (done) => {
                handlePlay(user2, (messageObject, gameId, array) => {
                    expect(messageObject.message).to.equal("user not logged in");
                    expect(gameId).to.equal(-1);
                    done();
                });                    
            });

        });
    });
}
