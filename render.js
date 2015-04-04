var canvas = document.getElementById('main'),
right = document.getElementById('right'),
left = document.getElementById('left'),
horizontal = document.getElementById('horizontal'),
vertical = document.getElementById('vertical'),
scissor = document.getElementById('scissor'),
highlight = document.getElementById('highlight');
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
function outline(ctx, poly,color){
  ctx.strokeStyle = color || "#555";
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
    ctx.moveTo(4*size,i*size);
    ctx.lineTo(ctx.canvas.width,i*size);
  }
  for(i = 4; i <= vertical;i++){
    ctx.moveTo(i*size,0);
    ctx.lineTo(i*size,ctx.canvas.height);
  }
  ctx.stroke();
}
function draw(){
  clear(ctx);
  drawGrid(ctx);
  for(var i = 0;i < templates.length;i++){
      fill(ctx,templates[i]);
  }
  for(i = 0;i < shapes.length;i++){
    if(shapes.selected === i){
      translate(shapes[i],x-point.x,y-point.y);
      fill(ctx,shapes[i]);
      outline(ctx,shapes[i]);
    }else{
      fill(ctx,shapes[i]);
    }
  }
  ctx.drawImage(right,5,5,size*4-10,size*4-10);
  ctx.drawImage(left,5,size*4-5,size*4-10,size*4-10);
  ctx.drawImage(horizontal,5,size*8-5,size*4-10,size*4-10);
  ctx.drawImage(vertical,5,size*12-5,size*4-10,size*4-10);
  if(cutmode){
    ctx.drawImage(highlight,5,size*16-5,size*4-10,size*4-10);
    if(incision){
      ctx.strokeStyle = '#333';
      ctx.beginPath();
      ctx.moveTo(incision.x,incision.y);
      ctx.lineTo(point.x,point.y);
      ctx.stroke();
    }
  }else{
    ctx.drawImage(scissor,5,size*16-5,size*4-10,size*4-10);
  }
  
}