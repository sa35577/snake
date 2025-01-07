/**
 * @type {Object.<string, string>}
 */
let pending_games = {};
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
pending_games = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    new_game_id = uuidv4();
    pending_games[new_game_id] = socket.id;
    io.to(socket.id).emit('new_game_id', {game_id: new_game_id});

    socket.on('join_game', (data) => {
        if (socket.id in socket_id_to_game_id) {
            console.error('Socket is already in a game');
            return;
        }

        console.log('join_game', data);
        const game_id = data.game_id;
        if (game_id in pending_games) {
            const player1 = pending_games[game_id];
            const player2 = socket.id;
            if (player1 === player2) {
                console.error("You are playing with yourself lol");
            } 
            else {
                socket_id_to_game_id[player1] = game_id;
                socket_id_to_game_id[player2] = game_id;
                io.to(player1).emit('game_start', { game_id, player_id: 1 });
                io.to(player2).emit('game_start', { game_id, player_id: 2 });
                delete pending_games[game_id];
            }
        }
        else {
            console.error('game_id not found, cant start a new game');
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        for (const game_id in pending_games) {
            if (pending_games[game_id] === socket.id) {
                console.log(`Removing pending game ${game_id} due to disconnection`);
                delete pending_games[game_id];
            }
        }

        const game_id = socket_id_to_game_id[socket.id];
        if (game_id) {
            console.log(`Player disconnected from game ${game_id}`);
            for (const [id, g_id] of Object.entries(socket_id_to_game_id)) {
                if (g_id === game_id && id !== socket.id) {
                    io.to(id).emit('opponent_disconnected', { game_id });
                }
            }
            delete socket_id_to_game_id[socket.id];
        }
    })
});

server.listen(port,() => {
    console.log(`Listening on port ${port}`);
}); 