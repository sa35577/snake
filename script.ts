const c = <HTMLCanvasElement>document.getElementById("gameCanvas");
//@//ts-ignore
var ctx = c.getContext("2d")!!; 

function renderRect(startX : number, startY : number, endX : number, endY : number) {
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
}


function renderLines() {
    for (let i = 0; i <= 800; i += 50) {
        renderRect(i,0,i,800);
        renderRect(0,i,800,i);
    }
}

function renderPlayers() {
    
}

document.addEventListener('DOMContentLoaded', function() {
    alert('Game will begin now');
    ctx.lineWidth = 1;
    renderLines();
    renderPlayers();
})