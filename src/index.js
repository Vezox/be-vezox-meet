const app = require('express')()
const { ExpressPeerServer } = require('peer');
const { createServer } = require('http');
require('dotenv').config()

const socket = require('./socket')

const PORT = process.env.PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;
const PEER_PORT = process.env.PEER_PORT;

const httpSocketServer = createServer(app);
const httpPeerServer = createServer(app);

socket(httpSocketServer);

const peerServer = ExpressPeerServer(httpPeerServer, {
  path: '/'
});
app.use('/peer', peerServer);


app.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`))
httpSocketServer.listen(SOCKET_PORT, () => console.log(`Socket listening on port http://localhost:${SOCKET_PORT}`))
httpPeerServer.listen(PEER_PORT, () => console.log(`Peer listening on port http://localhost:${PEER_PORT}`))
