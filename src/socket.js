const { Server } = require('socket.io')
let data_rooms = {};

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    }
  });
  io.on('connection', client => {
    client.on('send_message', data => {
      const room = data.room;
      if (!room) return
      const message = data.message;
      client.to(room).emit('new_message', message);
    });

    client.on('join', async data => {
      const room = data.room;
      const peer_id = data.peer_id;
      if (peer_id && room) {
        if (!data_rooms[room]) data_rooms[room] = [];
        data_rooms[room] = [...new Set([peer_id, ...data_rooms[room]])]
      }
      client.join(room);
      client.to(room).emit('joined', data_rooms[room]);
      client.on('disconnect', () => {
        data_rooms[room] = data_rooms[room].filter(item => item !== peer_id)
        client.to(room).emit('left', peer_id);
      });
    });

    client.on('leave', room => {
      client.leave(room);
    });

    client.on('disconnect', () => {
      client.leaveAll();
    });

    client.on("stop-sharing", data => {
      const room = data.room;
      const peer_id = data.peer_id;
      if (peer_id && room) {
        if (!data_rooms[room]) data_rooms[room] = [];
        data_rooms[room] = data_rooms[room].filter(item => item !== peer_id)
      }
      client.to(room).emit('left', peer_id);
    });

    client.on("start-sharing", data => {
      const room = data.room;
      const peer_id = data.peer_id;
      if (peer_id && room) {
        if (!data_rooms[room]) data_rooms[room] = [];
        data_rooms[room] = [...new Set([peer_id, ...data_rooms[room]])]
      }
      client.to(room).emit('joined', data_rooms[room]);
    });
  });
}