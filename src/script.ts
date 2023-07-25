import { Direction } from './direction';
import { Player } from './player'

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
    p1.direction = Direction.Right;
    let p1OriginalPosition : Array<number> = [100,400];
    p1.positions = [p1OriginalPosition];
}

function renderPlayers() {
    renderRect(p1.positions[0][0],p1.positions[0][1]);
}

document.addEventListener('DOMContentLoaded', function() {
    alert('Game will begin now');
    ctx.lineWidth = 1;
    renderInitialGridLines();
    initPlayers();
    renderPlayers();
})