var canvas = document.getElementById('main');
var ctx = canvas.getContext("2d");

var rectangle = {
  color: "#000",
  points: [{x:10,y:10},{x:50,y:10},{x:60,y:100},{x:10,y:100}]
}
fill(ctx, rectangle);
rectangle.color = '#700';
outline(ctx,rectangle);

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
  ctx.strokeStyle = poly.color;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(poly.points[0].x,poly.points[0].y);
  for(var i = 1; i < poly.points.length;i++){
    ctx.lineTo(poly.points[i].x,poly.points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

canvas.onmousedown = function(e){
  var point = {y:e.y,x:e.x};
  if(pointInside(point,rectangle.points)){
    rectangle.color = '#999';
    fill(ctx,rectangle);
  }else{
    rectangle.color = '#700';
    fill(ctx,rectangle);
  }
};


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