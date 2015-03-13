var rectangle = {
  color: randomColor(),
  points: [{x:10,y:10},{x:50,y:10},{x:60,y:100},{x:10,y:100}]
};
var point,x,y,down;
var size = 30;
var shapes = [rectangle];
rectangle = {
  color: randomColor(),
  points: [{x:10,y:100},{x:50,y:100},{x:60,y:200},{x:10,y:200}]
};
shapes.push(rectangle);
draw();

