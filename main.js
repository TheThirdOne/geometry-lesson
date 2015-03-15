var point,x,y,down;


var size = ((window.innerWidth<window.innerHeight)?window.innerWidth:window.innerHeight)/25; //make 20 cells minimum
canvas.width  = window.innerWidth; //canvas should take up the entire screen
canvas.height = window.innerHeight;
canvas.width  -= canvas.width%size+size-1; //make the edges line up + not need scrollbars
canvas.height -= canvas.height%size+size-1;
var shapes = [new Shape([1,2,3],[3,1,3]),new Shape([1,2,4,5],[6,4,4,6])];
shapes.selected = -1;
draw();

