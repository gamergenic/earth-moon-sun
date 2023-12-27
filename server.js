const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(express.static('public'));

const moonScale = 0.5;
const earthScale = 1.0;
const sunScale = 2.0;

let rotationY = 0; // Initialize rotationY

io.on('connection', (socket) => {
//    console.log('A user connected');
    socket.emit('moonScale', moonScale);
    socket.emit('earthScale', earthScale);
    socket.emit('sunScale', sunScale);

    // Emit sphere rotation value every second
    setInterval(() => {
        rotationY += 0.001; // Update rotationY
        socket.emit('earthRotation', rotationY);
    }, 1000);

    socket.on('disconnect', () => {
//        console.log('A user disconnected');
    });
});

// Change to server.listen
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
