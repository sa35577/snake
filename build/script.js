import { Direction } from './direction.js';
import './math.js';
import { arrayNumbersEqual, randomCell } from './math.js';
const c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
let p1;
let startCount;
// let startCount2 : number;
let gameWidth = 800;
let gameHeight = 800;
let foodLoc;
let squareStatus;
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
function collisionDetector() {
    //only possibility atm is the player detecting with the food
    if (foodLoc[0] != -1) {
        if (arrayNumbersEqual(foodLoc, p1.positions[0])) {
            console.log("collision");
            p1.positions.push(p1.lastPosition);
            foodLoc = [-1, -1];
            //TODO: Update old square art work
        }
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
    if (foodLoc[0] == -1) { //unset
        foodLoc = randomCell();
    }
    else { //still on map
        console.log("still on map");
    }
    console.log(foodLoc);
}
var counter = setInterval(function () {
    if (startCount == 0) {
        clearInterval(counter);
        setInterval(playGame, 100);
        setInterval(foodGen, 5000);
    }
    else {
        let ele = document.getElementById('demo');
        ele.innerHTML = startCount.toString();
        startCount--;
    }
}, 1000);
// var counter2 = setInterval(function() {
//     if (startCount2 == 0) {
//         clearInterval(counter2);
//     }
//     else {
//         let ele = document.getElementById('demo2')!!;
//         ele.innerHTML = startCount2.toString();
//         console.log(startCount2);
//         startCount2--;
//     }
// },1000);
document.addEventListener('DOMContentLoaded', function () {
    //alert('Game will begin now');
    foodLoc = [-1, -1];
    ctx.lineWidth = 1;
    renderInitialGridLines();
    initPlayers();
    renderObjects();
    startCount = 3;
    // startCount2 = 50;
});
//set interval (call a tick function)
//count down
//moving upon tick
//see what button is being pressed upon tick and adding it
//winning and losing upon clash (array of occupied coordinates by whom)
//websockets!!!!
