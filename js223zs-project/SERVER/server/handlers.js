//Imports.
const DatabaseHandler = require('./../database/DatabaseHandler');
const DBConnection = require('./../database/DBConnection');
const GameConfig = require('./../config/GameConfig');
var stringHash = require("string-hash")

module.exports = function (client, clientManager, gameManager) {
  
  const databaseHandler = new DatabaseHandler(new DBConnection());
  const databaseConnectionString =  'mongodb://127.0.0.1:27017';
  let gameConfig = new GameConfig();

  databaseHandler.connect(databaseConnectionString).then(() => {
    
    /*
     * Todo: remove after publishing V1.0
    databaseHandler.removeAll('user', {})
      .then((removed) => {
        console.log('handler: removeAll()');
        console.log(removed);
        databaseHandler.getAll('user', {})
          .then((users) => {
            console.log('handler: getAll()');
            console.log(users);
          })
          .catch((error) => {
            console.log('\n\nSome error in getAll');
            console.log(error);
          });
      })
      .catch((error) => {
        console.log('\n\nSome error in removeAll');
        console.log(error);
      });
      */
  });

  function handleRegister(name, pw, callback) {
    if ((pw.length < 6) || (name.length < 6)){
      return callback({message: 'name and password must be at least 6 characters'}, name);
    };
    let pwHashed = stringHash(pw);
      databaseHandler.add('user', {userName: name, password: pwHashed})
      .then((saved) => {
        handleLogin(name, pw, (messageObj, loggedInUserName) => {
          if (messageObj) {
            return callback(messageObj.message, loggedInUserName);
          } else {
            return callback(messageObj, loggedInUserName);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        return callback({message: 'username is taken'}, name);
      });
  }

  function handleLogin(name, pw, callback) {
    let pwHashed = stringHash(pw);
      databaseHandler.getOne('user', {userName: name, password: pwHashed})
      .then((user) => {
        if (user) {
          console.log("handleLogin " + client.id + "  name:" + name);
          if (clientManager.isUserLoggedIn(name)) {
            return callback({message: 'user already logged in on another session'}, name);
          }
          else {
            clientManager.userLoggedIn(client, user.userName);
            return callback(null, user.userName);
          }
        } else {
          return callback({message: 'password or username is wrong'}, name);
        }
      })
      .catch((error) => {
        console.error(error);
        error.serverError = 'password or username is wrong';
        return callback({message: 'password or username is wrong'}, name);
      });
  }

  function handlePlay(name, callback) {
    let game;
    if (!clientManager.isUserLoggedIn(name)){
      return callback({message: 'user not logged in'}, -1, null);
    }
    if (gameManager.gamePending())
    {
      game = gameManager.getGame(gameManager.getPendingGameId());
    }
    else{
      game = gameManager.addGame();
    }
    console.log("handlePlay " + client.id + "  name:" + name + " gameId:" + game.getGameId());

    gameConfig.setGamePieces('role', game.addPlayer(name, client));
    gameConfig.setGamePieces('gameId', game.getGameId());

    callback(null, game.getGameId(), gameConfig.getGamePieces());
    if (gameConfig.getGamePieces().role === 'Runaway'){
      game.updateGameRound(null);
    }
  }

  function handleBoardUpdate({ gameId, boardUpdate } = {}, callback) {
    gameManager.updateGameboard(gameId, boardUpdate);
    callback(null,"FROM SERVER boardUpdate");
  }

  function handleGameOver(gameId) {
    gameManager.onGameOver(gameId);
  }

  function handleDisconnect() {
    // remove user profile
    clientManager.removeClient(client);
    // kill game
    // gameManager.closeGame(client)
  }

  return {
    handleRegister,
    handleLogin,
    handlePlay,
    handleBoardUpdate,
    handleGameOver,
    handleDisconnect,
    databaseHandler
  }
}
