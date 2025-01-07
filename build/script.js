var _a, _b;
import { Direction } from './direction.js';
import './math.js';
import { arrayNumbersEqual, randomCell } from './math.js';
const c = document.getElementById("gameCanvas");
let ctx = c.getContext("2d");
let p1;
let startCount;
let gameWidth = 800;
let gameHeight = 800;
let foodLoc;
let squareStatus;
let playGameIntervalID;
let foodGenIntervalID;
let game_id = "";
const socket = io("http://localhost:3000"); // Replace with server URL
function renderLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function renderRect(startX, startY, width = 50, height = 50) {
    ctx.fillStyle = "black";
    ctx.fillRect(startX, startY, width, height);
}
function renderColourRect(colour, startX, startY, width = 50, height = 50) {
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.fillRect(startX, startY, width, height);
}
function renderCircleInSquare(startX, startY, colour = "red") {
    let ctrX = startX + 25;
    let ctrY = startY + 25;
    ctx.beginPath();
    ctx.arc(ctrX, ctrY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = colour;
    ctx.fill();
}
function renderInitialGridLines() {
    for (let i = 0; i <= 800; i += 50) {
        renderLine(i, 0, i, 800);
        renderLine(0, i, 800, i);
    }
}
function initPlayers() {
    p1 = { direction: Direction.Right, positions: [[100, 400]], futureDirection: Direction.Right, lastPosition: [50, 400] };
}
function renderObjects() {
    for (let pos of p1.positions) {
        renderRect(pos[0], pos[1]);
    }
    if (foodLoc[0] != -1) {
        renderCircleInSquare(foodLoc[0], foodLoc[1]);
    }
}
(_a = document.getElementById('createGame')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    console.log('Create game clicked');
    navigator.clipboard.writeText(game_id).then(function () {
        console.log('Text copied to clipboard');
    }).catch(function (err) {
        console.error('Could not copy text: ', err);
    });
});
(_b = document.getElementById('joinGame')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    console.log('Join game clicked');
    let joinGameId = document.getElementById('gameId').value;
    console.log(joinGameId);
    socket.emit('join_game', { game_id: joinGameId });
});
document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented)
        return;
    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            if (p1.direction != Direction.Up)
                p1.futureDirection = Direction.Down;
            break;
        case "ArrowUp":
            event.preventDefault();
            if (p1.direction != Direction.Down)
                p1.futureDirection = Direction.Up;
            break;
        case "ArrowLeft":
            event.preventDefault();
            if (p1.direction != Direction.Right)
                p1.futureDirection = Direction.Left;
            break;
        case "ArrowRight":
            event.preventDefault();
            if (p1.direction != Direction.Left)
                p1.futureDirection = Direction.Right;
            break;
        default:
            return;
    }
});
function getNewCoordinates(originalCoordinates, direction) {
    let coordinates = originalCoordinates;
    if (direction == Direction.Right) {
        coordinates[0] = (coordinates[0] + 50) % 800;
    }
    else if (direction == Direction.Left) {
        coordinates[0] = (coordinates[0] - 50 + 800) % 800;
    }
    else if (direction == Direction.Down) {
        coordinates[1] = (coordinates[1] + 50) % 800;
    }
    else if (direction == Direction.Up) {
        coordinates[1] = (coordinates[1] - 50 + 800) % 800;
    }
    return coordinates;
}
function fillOldSquare(x, y) {
    renderColourRect("white", x, y);
    renderLine(x, y, x + 50, y);
    renderLine(x, y, x, y + 50);
    renderLine(x + 50, y, x + 50, y + 50);
    renderLine(x, y + 50, x + 50, y + 50);
}
function setSquareStatus(pos, value) {
    squareStatus[Math.floor(pos[0] / 50)][Math.floor(pos[1] / 50)] = value;
}
function getSquareStatus(pos) {
    return squareStatus[Math.floor(pos[0] / 50)][Math.floor(pos[1] / 50)];
}
function collisionDetector() {
    //only possibility atm is the player detecting with the food
    let p1Grows = false;
    //let p2Grows : boolean = false;
    let p1Loses = false;
    // let p2Loses : boolean = false;
    if (foodLoc[0] != -1) {
        if (arrayNumbersEqual(foodLoc, p1.positions[0])) {
            console.log("collision");
            p1.positions.push(p1.lastPosition);
            foodLoc = [-1, -1];
            p1Grows = true;
            // setSquareStatus(p1.lastPosition,1);
        }
        //same logic for player 2 when implemented
    }
    console.log(p1Grows);
    if (p1Grows)
        setSquareStatus(p1.lastPosition, 1);
    else
        setSquareStatus(p1.lastPosition, 0);
    // if (p2Grows) setSquareStatus(p2.lastPosition,1);
    // else setSquareStatus(p2.lastPosition,0);
    //TODO: check if both p1 and p2 are about to hit each head on
    if (getSquareStatus(p1.positions[0]) != 0 ||
        (p1.positions.length > 1 && arrayNumbersEqual(p1.lastPosition, p1.positions[0]))) { //p1 collided with p2 (not implemented) or itself
        p1Loses = true;
    }
    else
        setSquareStatus(p1.positions[0], 1);
    //same for p2
    if (p1Loses) {
        alert('you lose lol');
        clearInterval(playGameIntervalID);
        clearInterval(foodGenIntervalID);
    }
}
function moveListener() {
    p1.lastPosition = structuredClone(p1.positions[p1.positions.length - 1]);
    for (let i = p1.positions.length - 1; i > 0; i--) {
        p1.positions[i] = structuredClone(p1.positions[i - 1]);
    }
    p1.direction = p1.futureDirection;
    p1.positions[0] = getNewCoordinates(p1.positions[0], p1.direction);
}
function playGame() {
    moveListener();
    //collision detector
    collisionDetector();
    //old cleanups
    fillOldSquare(p1.lastPosition[0], p1.lastPosition[1]);
    renderObjects();
}
function foodGen() {
    if (foodLoc[0] == -1) {
        foodLoc = randomCell();
    }
    else { //still on map
        // console.log("still on map");
    }
    // console.log(foodLoc);
}
var counter = setInterval(function () {
    if (startCount == 0) {
        clearInterval(counter);
        playGameIntervalID = setInterval(playGame, 100);
        foodGenIntervalID = setInterval(foodGen, 5000);
    }
    else {
        let ele = document.getElementById('demo');
        ele.innerHTML = startCount.toString();
        startCount--;
    }
}, 1000);
document.addEventListener('DOMContentLoaded', function () {
    foodLoc = [-1, -1];
    ctx.lineWidth = 1;
    squareStatus = new Array(16);
    for (let i = 0; i < 16; i++) {
        squareStatus[i] = new Array(16).fill(0);
    }
    renderInitialGridLines();
    initPlayers();
    renderObjects();
    startCount = 3;
});
//winning and losing upon clash (array of occupied coordinates by whom)
//websockets!!!!
socket.on('connect', () => {
    console.log('Connected to server');
});
socket.on('game_start', (data) => {
    console.log('Game started');
    console.log(data);
});
socket.on('new_game_id', (data) => {
    console.log('New game id received');
    console.log(data);
    game_id = data.game_id;
});
