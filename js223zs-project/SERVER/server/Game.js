/**
 * Game controller.
 */
module.exports = function (id) {
  const players = [];
  const gameClients = new Map();
  let chaserSquares = [];
  let activePlayer = "";
  let roundNumber = -1; 
  let runawaySquare;

  function setSquares(gameBoard) {
    chaserSquares = [];
    gameBoard.forEach(square => {
      if (Array.isArray(runawaySquare)) {
        runawaySquare[1].text = "R";
      }
      if (square[1].occupiedBy === "R") {
        runawaySquare = square;
        runawaySquare[1].text = "R";
      } else {
        chaserSquares.push(square);
      }
   }); 
  }

  function updateGameRound(gameBoard) {
    if (gameBoard) {
      setSquares(gameBoard);
    }
    if (roundNumber === 10) {
      onGameOver('Runaway');
      return;
    }
    if ( activePlayer === "Chaser") {
      activePlayer = "Runaway";
      
    } else {
      roundNumber += 1;
      activePlayer = "Chaser";
    }
    gameClients.get(players[1].id).emit('message', activePlayer, roundNumber, players, chaserSquares, runawaySquare);
    // Runaway is only visible to chaser certain rounds
    if (roundNumber !== 1 && (roundNumber%3) !== 0 && !runawaySquare[1].occupiedByCCTV) {
      runawaySquare[1].text = "";
    }
    gameClients.get(players[0].id).emit('message', activePlayer, roundNumber, players, chaserSquares, runawaySquare);
  }

  function getGameStatus() {
    return chaserSquares.slice();
  }

  function addPlayer(name, client) {
    let role="";
    if (players.length === 0){
      role = "Chaser";
    } 
    else {
      role = "Runaway";
    }
    players.push({id: client.id, role: role, name: name});
    gameClients.set(client.id, client);

    return role;
  }

  function getNoOfPlayers() {
    return players.length;
  }
  function getGameId() {
    return id;
  }
  function getPlayers() {
    return players;
  }
  function getPlayerRole(client) {
    let role;
    players.forEach(player => {
      if (player.id === client.id){
        role = player.role;
      }
    });
    return role;
  }

  function onGameOver(winner) {
    gameClients.forEach(
      gameClient => gameClient.emit('gameOver', winner)
    )
  }

  return {
    updateGameRound,
    onGameOver,
    getGameId,
    getPlayers,
    getPlayerRole,
    getNoOfPlayers,
    addPlayer
  }
}
