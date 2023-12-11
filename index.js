// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.static('public'));

let rectangles = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit existing rectangles to the new client
  socket.emit('initRectangles', Object.values(rectangles));

  // Handle rectangle movement
  socket.on('moveRectangle', (data) => {
    const { id, x, y } = data;
    if (rectangles[id]) {
      rectangles[id].x = x;
      rectangles[id].y = y;
      io.emit('moveRectangle', { id, x, y });
    }
  });

  // Handle new rectangle creation
  socket.on('createRectangle', (data) => {
    const id = socket.id + '_' + Date.now();
    rectangles[id] = { id, x: data.x, y: data.y };
    io.emit('createRectangle', rectangles[id]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
