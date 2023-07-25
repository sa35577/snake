"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("./direction");
const c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
let p1;
function renderLine(startX, startY, endX, endY) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function renderRect(startX, startY, width = 50, height = 50) {
    ctx.fillRect(startX, startY, width, height);
}
function renderInitialGridLines() {
    for (let i = 0; i <= 800; i += 50) {
        renderLine(i, 0, i, 800);
        renderLine(0, i, 800, i);
    }
}
function initPlayers() {
    p1.direction = direction_1.Direction.Right;
    let p1OriginalPosition = [100, 400];
    p1.positions = [p1OriginalPosition];
}
function renderPlayers() {
    renderRect(p1.positions[0][0], p1.positions[0][1]);
}
document.addEventListener('DOMContentLoaded', function () {
    alert('Game will begin now');
    ctx.lineWidth = 1;
    renderInitialGridLines();
    initPlayers();
    renderPlayers();
});
