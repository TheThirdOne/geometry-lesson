var point,x,y,down,cutmode,incision;


var size = ((window.innerWidth<window.innerHeight)?window.innerWidth:window.innerHeight)/25|0; //make 20 cells minimum
canvas.width  = window.innerWidth; //canvas should take up the entire screen
canvas.height = window.innerHeight;
canvas.width  -= canvas.width%size+size-1; //make the edges line up + not need scrollbars
canvas.height -= canvas.height%size+size-1;
var templates = [new Shape([1,1,3],[3,1,3]),
                 new Shape([4,5,6],[3,1,3]),
                 new Shape([7,10,9],[3,1,3]),
                 new Shape([11,11,13,13],[3,1,1,3]),
                 new Shape([14,15,17,16],[3,1,1,3]),
                 new Shape([18,19,21,22],[3,1,1,3]),
                 new Shape([23,24,25,27],[3,1,1,3]),
                 new Shape([28,29,31,32,31,29],[3,1,1,3,5,5])];

var shapes = [];
shapes.selected = -1;


draw();

