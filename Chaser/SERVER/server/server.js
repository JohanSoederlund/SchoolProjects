const server = require('http').createServer();
const io = require('socket.io')(server);
const socketioJwt  = require('socketio-jwt');

const ClientManager = require('./ClientManager')
const GameManager = require('./GameManager')
const Handlers = require('./handlers')

const clientManager = ClientManager();
const gameManager = GameManager();

const secretToken = 'mySecretKey';

/**
 * Socket Server
 */
io.on('connection', function (client) {

  console.log('client connected...', client.id);

  const channels = {
    register: 'register',
    login: 'login',
    play: 'play',
    boardUpdate: 'boardUpdate',
    gameOver: 'gameOver',
    disconnect: 'disconnect',
    error: 'error'
  }

  const {
    handleRegister,
    handleLogin,
    handlePlay,
    handleBoardUpdate,
    handleGameOver,
    handleDisconnect
  } = Handlers(client, clientManager, gameManager);

  clientManager.addClient(client);

  client.on(channels.register, handleRegister);

  client.on(channels.login, handleLogin);

  /*
  client.on('login', (logedIn) => {
    
    console.log('hello! ', socket.decoded_token.name);

    io.use(socketioJwt.authorize({
      secret: secretToken,
      handshake: true
    }));

    client.on(channels.play, (token) => {
      validateToken(token);
      handlePlay;
    });

    client.on(channels.boardUpdate, (token) => {
      validateToken(token);
      handleBoardUpdate;
    });

    client.on(channels.gameOver, (token) => {
      validateToken(token);
      onGameOver;
    });
    
  });
  */

  /**
   * requires jwttoken is set
   */
  client.on(channels.play, handlePlay);

  /*
  client.on('play', handlePlay, (token) => {
    validateToken();
  });
  */

  client.on(channels.boardUpdate, handleBoardUpdate);

  client.on(channels.gameOver, handleGameOver);

  client.on(channels.disconnect, function () {
    console.log('client disconnect...', client.id);
    handleDisconnect();
  })

  client.on(channels.error, function (err) {
    console.error('received error from client:', client.id);
    console.error(err);
  })
});

function validateToken(token) {

}

/**
 * Configure port for server
 */
server.listen(3001, function (err) {
  if (err){
    throw err;
  } else {
    console.log('listening on port 3001');
  }
})
