var canvas = document.getElementById('main');
var ctx = canvas.getContext("2d");

function clear(ctx){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
//draws a solid polygon
function fill(ctx, poly){
  ctx.fillStyle = poly.color;
  ctx.beginPath();
  ctx.moveTo(poly.points[0].x,poly.points[0].y);
  for(var i = 1; i < poly.points.length;i++){
    ctx.lineTo(poly.points[i].x,poly.points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

//outlines a polygon
function outline(ctx, poly){
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(poly.points[0].x,poly.points[0].y);
  for(var i = 1; i < poly.points.length;i++){
    ctx.lineTo(poly.points[i].x,poly.points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawGrid(ctx){
  var horizontal = ctx.canvas.height/size, vertical = ctx.canvas.width/size;
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(var i = 0; i <= horizontal;i++){
    ctx.moveTo(0,i*size);
    ctx.lineTo(ctx.canvas.width,i*size);
  }
  for(i = 0; i <= vertical;i++){
    ctx.moveTo(i*size,0);
    ctx.lineTo(i*size,ctx.canvas.height);
  }
  ctx.closePath();
  ctx.stroke();
}
function draw(){
  clear(ctx);
  drawGrid(ctx);
  for(var i = 0;i < shapes.length;i++){
    if(shapes.selected === i){
      translate(shapes[i],x-point.x,y-point.y);
      fill(ctx,shapes[i]);
      outline(ctx,shapes[i]);
    }else{
      fill(ctx,shapes[i]);
    }
  }
}