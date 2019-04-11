/**
 * Handles clients.
 */
module.exports = function () {
  
  // mapping of all connected clients
  let clients = new Map();
  // mapping of all logged in users
  let users = new Map();

  function addClient(client) {
    clients.set(client.id, client);
  }
  function getClient(clientId) {
    return clients.get(clientId);
  }
  function userLoggedIn(client, username) {
    if (!isUserLoggedIn(username)) {
      users.set(client.id, {name: username} );
      return true;
    }
    return false;
  }

  function isUserLoggedIn(name) {
    let ret = false;
    users.forEach(user => {
      if (user.name === name)
        ret = true;
    });
    return ret;
  }

  function removeClient(client) {
    clients.delete(client.id);
    users.delete(client.id);
  }

  return {
    addClient,
    getClient,
    removeClient,
    userLoggedIn,
    isUserLoggedIn
  }
}
