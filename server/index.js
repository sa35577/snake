const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const port = 3000;
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const io = new Server(server);


app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

socket_id_to_game_id = {};
pending_users = [];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    //generate a uuid for the user
    // const user_id = uuidv4();
    // console.log('user_id:', user_id);
    pending_users.push(socket.id);

    //if there are two users in the pending list, create a new game
    if (pending_users.length >= 2) {
        const player1 = pending_users.pop();
        const player2 = pending_users.pop();
        const game_id = uuidv4();
        socket_id_to_game_id[player1] = game_id;
        socket_id_to_game_id[player2] = game_id;
        io.to(player1).emit('game_start', {game_id, player_id: 1});
        io.to(player2).emit('game_start', {game_id, player_id: 2});
    }
    

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

server.listen(port,() => {
    console.log(`Listening on port ${port}`);
}); 