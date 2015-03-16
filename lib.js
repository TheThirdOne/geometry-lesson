//Math
function snap(shape){
  var tmp = shape.points[0];
  translate(shape,-(tmp.x+size/2)%size+size/2,-(tmp.y+size/2)%size+size/2);
}
function nearest(point){
  point.x -= (point.x+size/2)%size-size/2;
  point.y -= (point.y+size/2)%size-size/2;
}
function translate(shape,dx,dy){
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].x += dx;
    shape.points[i].y += dy;
  }
}

function rotate(shape,direction){
  var center = cg(shape), t;
  center.x -= (center.x + size/2)%size - size/2; //snap to grid
  center.y -= (center.y + size/2)%size - size/2;
  if(direction < 0){
    direction = direction % 4 + 4;
  }
  switch (direction % 4){
    case 3:
      for(var i = 0; i < shape.points.length;i++){
        t =  center.y + center.x - shape.points[i].x;
        shape.points[i].x = center.x - center.y + shape.points[i].y;
        shape.points[i].y = t;
      }
      break;
    case 2:
      for(i = 0; i < shape.points.length;i++){
        shape.points[i].y = 2*center.y - shape.points[i].y;
        shape.points[i].x = 2*center.x - shape.points[i].x;
      }
      break;
    case 1:
      for(i = 0; i < shape.points.length;i++){
        t =  center.y - center.x + shape.points[i].x;
        shape.points[i].x = center.x + center.y - shape.points[i].y;
        shape.points[i].y = t;
      }
      break;
    default:
  }
}
function reflectX(shape){
  var mirror = cg(shape);
  mirror.x -= (mirror.x + size/2)%size - size/2; //snap to grid
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].x = 2*mirror.x - shape.points[i].x;
  }
}
function reflectY(shape){
  var mirror = cg(shape);
  mirror.y -= (mirror.y + size/2)%size - size/2; //snap to grid
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].y = 2*mirror.y - shape.points[i].y;
  }
}
function cg(shape){
  var x = 0, y = 0;
  for(var i = 0; i < shape.points.length;i++){
    x += shape.points[i].x;
    y += shape.points[i].y;
  }
  
  return {x:x/shape.points.length,y:y/shape.points.length};
}
function pointOnPoly(shape,a){
  for(var i = 1; i < shape.length;i++){
    //a = point[i]
    if(shape[i].x === a.x && shape[i].y === a.y){
      a.i = i; a.t = true;
      break;
    }
    //area of triangle with vertices: a, point[i], point[i-1] = 0
    if(shape[i].x * (shape[i-1].y - a.y) + shape[i-1].x * (a.y - shape[i].y) + a.x * (shape[i].y - shape[i-1].y) === 0){
      //if point is between the two vertices
      if(shape[i].x < a.x ^ shape[i-1].x < a.x || shape[i].y < a.y ^ shape[i-1].y < a.y){
        a.i = i;
        break;
      }
    }
  }
  return a.i !== undefined;
}
function cut(poly,a,b){
  poly.points.push(poly.points[0]);
  var t;
  pointOnPoly(poly.points,a);
  pointOnPoly(poly.points,b);
  poly.points.pop();
  if(a.i === undefined || b.i === undefined){
    throw "Points don't lie on poly:" + a.i + b.i;
  }
  if(b.i < a.i){ //make sure ai is smaller
    t = b;
    b = a;
    a = t;
  }
  poly.points.splice(a.i,0,{x:a.x,y:a.y});
  b.i++;
  if(!a.t){
    poly.points.splice(a.i,0,{x:a.x,y:a.y});
    b.i++;
  }
  poly.points.splice(b.i,0,{x:b.x,y:b.y});
  if(!b.t){
    poly.points.splice(b.i,0,{x:b.x,y:b.y});
  }
  var tmp = poly.points.slice(a.i+1,b.i+1);
  poly.points.splice(a.i+1,b.i-a.i);
  
  return {points:tmp,color:poly.color};
}
function pointInside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point.x, y = point.y;
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function Shape(xs,ys){
  this.points = [];
  for(var i = 0; i < xs.length && i < ys.length;i++){
    this.points.push({x:xs[i]*size + size*4,y:ys[i]*size});
  }
  this.color = randomColor();
}

//Graphics
var hex = "0123456789ABCDEF";
function HSVtoRGB(h, s, v) { //http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately with modifications
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    r = r*255|0;
    g = g*255|0;
    b = b*255|0;
    return "#"+hex[r>>4%16]+hex[r%16]+hex[g>>4%16]+hex[r%16]+hex[b>>4%16]+hex[r%16];
}

var h = Math.random(), gold = 0.618033988749895;
function randomColor(){
  h = (h+gold)%1;
  return HSVtoRGB(h,0.6,0.95);
}

