const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let rectangles = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('initRectangles', Object.values(rectangles));

  socket.on('moveRectangle', ({ id, x, y }) => {
    if (rectangles[id]) {
      rectangles[id].x = x;
      rectangles[id].y = y;
      io.emit('moveRectangle', { id, x, y });
    }
  });

  socket.on('createRectangle', ({ x, y }) => {
    const id = socket.id + '_' + Date.now();
    rectangles[id] = { id, x, y };
    io.emit('createRectangle', rectangles[id]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});