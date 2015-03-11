var canvas = document.getElementById('main');
var ctx = canvas.getContext("2d");

var rectangle = {
  color: "#000",
  points: [{x:10,y:10},{x:50,y:10},{x:60,y:100},{x:10,y:100}]
};
var point,x,y,down;
var size = 20;
rectangle.color = '#700';
outline(ctx,rectangle);
var shapes = [rectangle];
rectangle = {
  color: "#333",
  points: [{x:10,y:100},{x:50,y:100},{x:60,y:200},{x:10,y:200}]
};
shapes.push(rectangle);
draw();


function clear(ctx){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  ctx.strokeStyle = "#FF0";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(poly.points[0].x,poly.points[0].y);
  for(var i = 1; i < poly.points.length;i++){
    ctx.lineTo(poly.points[i].x,poly.points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawGrid(ctx){
  var horizontal = canvas.height/size, vertical = canvas.width/size;
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(var i = 0; i <= horizontal;i++){
    ctx.moveTo(0,i*size);
    ctx.lineTo(canvas.width,i*size);
  }
  for(i = 0; i <= vertical;i++){
    ctx.moveTo(i*size,0);
    ctx.lineTo(i*size,canvas.height);
  }
  ctx.closePath();
  ctx.stroke();
}
function draw(){
  clear(ctx);
  drawGrid(ctx);
  for(var i = 0;i < shapes.length;i++){
    if(shapes.selected === i){
      transform(shapes[i],x-point.x,y-point.y);
      fill(ctx,shapes[i]);
      outline(ctx,shapes[i]);
    }else{
      fill(ctx,shapes[i]);
    }
  }
}
canvas.onmousedown = function(e){
  down = true;
  point = {y:e.y,x:e.x};
  x = e.x; y = e.y;
  shapes.selected = -1;
  for(var i = 0;i < shapes.length;i++){
    if(pointInside(point,shapes[i].points)){
      shapes.selected = i;
    }
  }
  draw();
};
canvas.onmousemove = function(e){
  if(down){
    x = e.x;
    y = e.y;
    draw();
    point.x = x;
    point.y = y;
  }
};
canvas.onmouseup = function(e){
  down = false;
  if(shapes.selected !== -1){
    snap(shapes[shapes.selected]);
    draw();
  }
};

function touchHandler(event) //http://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;
        case "touchend":   type="mouseup"; break;
        default: return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

    irst.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
canvas.addEventListener("touchstart", touchHandler, true);
canvas.addEventListener("touchmove", touchHandler, true);
canvas.addEventListener("touchend", touchHandler, true);
    
function snap(shape){
  var tmp = shape.points[0];
  transform(shape,-(tmp.x+size/2)%size+size/2,-(tmp.y+size/2)%size+size/2);
}
function transform(shape,dx,dy){
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].x += dx;
    shape.points[i].y += dy;
  }
}
function pointInside(point,shape){
  var intersections = 0,a={m:0,b:point.y},b,tmp;
  shape.push(shape[0]); // make it loop
  for(var i = 1; i < shape.length;i++){
    if(point.y <= shape[i-1].y ^ point.y >= shape[i].y ){
      continue;
    }
    b = lineFromPoints(shape[i-1],shape[i]);
    tmp = intersection(a,b);
    if(tmp === true && (point.x <= shape[i-1].x || point.x <= shape[i].x)){ //colinear
      intersections++;
      continue;
    }
    if(tmp === undefined || tmp > point.x ){ //never intersects or wrong side
      continue;
    }
    if(!(tmp <= shape[i-1].x ^ tmp >= shape[i].x )|| tmp === shape[i].x || tmp === shape[i-1].x){ //intersection within boundaries
      intersections++;
    }
  }
  shape.pop();
  return intersections % 2; //even-odd test
}
//intesection between lines (in point slope form) a, b
function intersection(a,b){
  //vertical line intersection
  if(a.x !== undefined && b.x !== undefined){ //both are vertical
    if(a.x === b.x){
      return a.x;
    }else{
      return;
    }
  }else if(a.x !== undefined || b.x !== undefined){ //only one is
    return a.x || b.x || 0;
  }
  
  if(a.m === b.m){ //parrallel lines
    if(a.b === b.b){
      return true;
    }else{
      return;
    }
  }
  return -(a.b - b.b)/(a.m - b.m); //solve y = m_1 * x + b_1 = m_2 * x + b_2
}

//define line ab in point slope form (vertical line has x=k)
function lineFromPoints(a,b){
  if(a.x===b.x){
    return {x:a.x};
  }
  var out = {m:0,b:0};
  out.m = (b.y-a.y)/(b.x - a.x);
  out.b = a.y-out.m*a.x;
  return out;
}