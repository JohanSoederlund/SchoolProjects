const io = require('socket.io-client')

/*
 * Append the jwt token using query string:
 * 
var socket = io.connect('http://localhost:3001', {
  'query': 'token=' + your_jwt
});
*/

/**
 * Websockethandler for client
 */
export default function () {
  const socket = io.connect('http://52.14.229.108:80')
  // For local production
  // const socket = io.connect('http://localhost:3001')

  function registerHandler(updateFromServer) {
    socket.on('message', updateFromServer);
  }

  function registerGameOverHandler(updateFromServer) {
    socket.on('gameOver', updateFromServer);
  }

  function unregisterHandler() {
    socket.off('message');
    socket.off('message');
  }

  socket.on('error', function (err) {
    console.error('received socket error:' + err);
  })

  function emitRegister(name, password, cb) {
    socket.emit('register', name, password, cb)
  }
  function emitLogin(name, password, cb) {
    socket.emit('login', name, password, cb)    
  }
  function emitPlay(name, cb) {
    socket.emit('play', name, cb)
  }

  function playerMove(gameId, boardUpdate, cb) {
    socket.emit('boardUpdate', { gameId, boardUpdate: boardUpdate }, cb)
  }

  function emitGameOver(gameId) {
    socket.emit('gameOver', gameId)
  }

  return {
    emitRegister,
    emitLogin,
    emitPlay,
    playerMove,
    registerHandler,
    registerGameOverHandler,
    unregisterHandler,
    emitGameOver
  }
}

