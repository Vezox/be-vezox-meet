const socket = require('socket.io')

module.exports = (server) => {
  const io = socket(server, {
    cors: {
      origin: '*',
    }
  });
  io.on('connection', client => {
    client.on('send_message', data => {
      const room = data.room;
      if(!room) return
      const message = data.message;
      client.to(room).emit('new_message', message);
    });

    client.on('join', async data => {
      const room = data.room;
      const peer_id = data.peer_id;
      client.join(room);
      client.to(room).emit('joined', peer_id);
    });

    client.on('leave', room => {
      client.leave(room);
    });

    client.on('disconnect', () => { 
      client.leaveAll();
     });
  });
}