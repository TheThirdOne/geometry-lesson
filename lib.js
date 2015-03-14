//Math
function snap(shape){
  var tmp = shape.points[0];
  translate(shape,-(tmp.x+size/2)%size+size/2,-(tmp.y+size/2)%size+size/2);
}
function translate(shape,dx,dy){
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].x += dx;
    shape.points[i].y += dy;
  }
}
function reflectX(shape){
  var mirror = cg(shape);
  mirror.x -= (mirror.x + size/2)%size - size/2;
  for(var i = 0; i < shape.points.length;i++){
    shape.points[i].x = 2*mirror.x - shape.points[i].x;
  }
}
function reflectY(shape){
  var mirror = cg(shape);
  mirror.y -= (mirror.y + size/2)%size - size/2;
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

function Shape(xs,ys){
  this.points = [];
  for(var i = 0; i < xs.length && i < ys.length;i++){
    this.points.push({x:xs[i]*size,y:ys[i]*size});
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

