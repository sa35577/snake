import { Direction } from './direction.js';
import { Player } from './player.js'

const c = <HTMLCanvasElement>document.getElementById("gameCanvas");
var ctx = c.getContext("2d")!!;
let p1 : Player;

function renderLine(startX : number, startY : number, endX : number, endY : number) {
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
}

function renderRect(startX : number, startY : number, width : number = 50, height : number = 50) {
    ctx.fillRect(startX,startY,width,height);
} 


function renderInitialGridLines() {
    for (let i = 0; i <= 800; i += 50) {
        renderLine(i,0,i,800);
        renderLine(0,i,800,i);
    }
}

function initPlayers() {
    p1 = { direction: Direction.Right, positions: [[100,400]] };
}

function renderPlayers() {
    renderRect(p1.positions[0][0],p1.positions[0][1]);
}

document.addEventListener('DOMContentLoaded', function() {
    //alert('Game will begin now');
    ctx.lineWidth = 1;
    renderInitialGridLines();
    initPlayers();
    renderPlayers();
    
})

//set interval (call a tick function)
//count down
//moving upon tick
//see what button is being pressed upon tick and adding it
//winning and losing upon clash (array of occupied coordinates by whom)
//websockets!!!!
