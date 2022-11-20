const app = require('express')()
const { ExpressPeerServer } = require('peer');
const http = require('http')
require('dotenv').config()

const socket = require('./socket')

const PORT = process.env.PORT;

const server = http.createServer(app);

socket(server);

const peerServer = ExpressPeerServer(server, {
  path: '/'
});

app.use('/peer', peerServer);


server.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`))
