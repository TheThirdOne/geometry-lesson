var canvas = document.getElementById('main');
var ctx = canvas.getContext("2d");

var rectangle = {
  color: "#000",
  points: [{x:10,y:10},{x:100,y:10},{x:100,y:100},{x:10,y:100}]
};
draw(ctx, rectangle);

//draws a shape on a 2d context
function draw(ctx, shape){
  ctx.fillStyle = shape.color;
  ctx.beginPath();
  ctx.moveTo(shape.points[0].x,shape.points[0].y);
  for(var i = 1; i < shape.points.length;i++){
    ctx.lineTo(shape.points[i].x,shape.points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}