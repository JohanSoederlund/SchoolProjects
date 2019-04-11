const Game = require('./Game')

/**
 * Handler for active and pending games.
 */
module.exports = function () {

  let nextGameId = 0;
  let games = [];


  function gamePending() {
    if (nextGameId > 0){
      if (games[nextGameId-1].getNoOfPlayers() === 1)
        return true;
    }
    return false; 
  }


  function addGame() {
    let game = Game(nextGameId);
    games[nextGameId] = game;
    nextGameId++;

    return games[nextGameId-1];
  }
  function getPendingGameId() {
    return nextGameId-1;
  }
  function getGame(id) {
    
    if (games.length-1 < id || id < 0) {
      return;
      //throw new Error('parameter id out of bounds');
    }
    
    return games[id];
  }
  function updateGameboard(gameId, boardUpdate) {
    let tmp = JSON.stringify(boardUpdate);
    games.forEach(game => {
      if (game.getGameId() === gameId){
        game.updateGameRound(boardUpdate);
        return ;
      }
    });

  }

  function onGameOver(gameId, boardUpdate) {
    try {
      games.forEach(game => {
        if (game.getGameId() === gameId){
          game.onGameOver('Chaser');
        }
      })
    } catch (error) {
      throw error;
    }
  }

  return {
    gamePending,
    getPendingGameId,
    addGame,
    getGame,
    updateGameboard,
    onGameOver
  }
}
