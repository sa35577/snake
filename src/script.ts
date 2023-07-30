import { Direction } from './direction.js';
import { Player } from './player.js'

const c = <HTMLCanvasElement>document.getElementById("gameCanvas");
var ctx = c.getContext("2d")!!;
let p1 : Player;
let startCount : number;
// let startCount2 : number;
let gameWidth : number = 800;
let gameHeight : number = 800;

function renderLine(startX : number, startY : number, endX : number, endY : number) {
    //console.log(ctx.lineWidth);
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
}

function renderRect(startX : number, startY : number, width : number = 50, height : number = 50) {
    ctx.fillStyle = "black";
    ctx.fillRect(startX,startY,width,height);
}

function renderColourRect(colour : string, startX : number, startY : number, width : number = 50, height : number = 50) {
    ctx.fillStyle = colour;
    ctx.fillRect(startX,startY,width,height);
}

function renderInitialGridLines() {
    for (let i = 0; i <= 800; i += 50) {
        renderLine(i,0,i,800);
        renderLine(0,i,800,i);
    }
}

function initPlayers() {
    p1 = { direction: Direction.Right, positions: [[100,400]], futureDirection : Direction.Right };
}

function renderPlayers() {
    for (let pos of p1.positions) {
        renderRect(pos[0],pos[1]);
    }
    //renderRect(p1.positions[0][0],p1.positions[0][1]);
}

document.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) return;

    switch(event.key) {
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
})

function getNewCoordinates(originalCoordinates : Array<number>,direction: Direction) : Array<number> {
    let coordinates = originalCoordinates;
    if (direction == Direction.Right) {
        coordinates[0] = (coordinates[0]+50) % 800;
    }
    else if (direction == Direction.Left) {
        coordinates[0] = (coordinates[0]-50 + 800) % 800;
    }
    else if (direction == Direction.Down) {
        coordinates[1] = (coordinates[1]+50) % 800;
    }
    else if (direction == Direction.Up) {
        coordinates[1] = (coordinates[1]-50 + 800) % 800;
    }
    return coordinates;
}

function fillOldSquare(x : number, y : number) {
    renderColourRect("white",x,y);
    renderLine(x,y,x+50,y);
    renderLine(x,y,x,y+50);
    renderLine(x+50,y,x+50,y+50);
    renderLine(x,y+50,x+50,y+50);
}

function moveListener() {
    let lastCoordinate = structuredClone(p1.positions[p1.positions.length - 1]);
    for (let i = p1.positions.length-1; i > 0; i--) {
        p1.positions[i] = structuredClone(p1.positions[i-1]);
    }
    p1.direction = p1.futureDirection;
    p1.positions[0] = getNewCoordinates(p1.positions[0],p1.direction);
    //renderColourRect("white",lastCoordinate[0],lastCoordinate[1]);
    fillOldSquare(lastCoordinate[0],lastCoordinate[1]);
}

function playGame() {
    moveListener();
    renderPlayers();
}

var counter = setInterval(function() {
    if (startCount == 0) {
        clearInterval(counter);
        setInterval(playGame,100);
    }
    else {
        let ele = document.getElementById('demo')!!;
        ele.innerHTML = startCount.toString();
        startCount--;
    }
},1000);

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



document.addEventListener('DOMContentLoaded', function() {
    //alert('Game will begin now');
    ctx.lineWidth = 1;
    renderInitialGridLines();
    initPlayers();
    renderPlayers();
    startCount = 5;
    // startCount2 = 50;
})

//set interval (call a tick function)
//count down
//moving upon tick
//see what button is being pressed upon tick and adding it
//winning and losing upon clash (array of occupied coordinates by whom)
//websockets!!!!
