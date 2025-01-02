const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const port = 3000;
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req,res) => {
    res.send('Hello world!');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

server.listen(port,() => {
    console.log(`Listening on port ${port}`);
}); 