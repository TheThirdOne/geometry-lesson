canvas.onmousedown = function(e){
  down = true;
  point = {y:e.y,x:e.x};
  x = e.x; y = e.y;
  if(e.x < size*4){
    if(e.y < size*8){
      if(shapes.selected != -1){
        rotate(shapes[shapes.selected],(e.y < size*4)?1:-1);
      }
      return;
    }
    if(e.y < size*12){
      if(shapes.selected != -1){
        reflectX(shapes[shapes.selected]);
      }
      return;
    }
    if(e.y < size*16){
      if(shapes.selected != -1){
        reflectY(shapes[shapes.selected]);
      }
      return;
    }
    if(e.y < size*20){
      cutmode ^= true;
      incision = undefined;
      return;
    }
    return;
  }
  if(!cutmode || shapes.selected === -1){
    shapes.selected = -1;
    for(var i = 0;i < shapes.length;i++){
      if(pointInside(point,shapes[i].points)){
        shapes.selected = i;
      }
    }
  }else{
    incision = {x:x,y:y};
  }
  draw();
};
canvas.onmousemove = function(e){
  if(down && !cutmode){
    x = e.x;
    y = e.y;
    draw();
    point.x = x;
    point.y = y;
  }
  if(cutmode){
    x = e.x;
    y = e.y;
    point.x = x;
    point.y = y;
    draw();
  }
  
};
canvas.onmouseup = function(e){
  down = false;
  if(shapes.selected !== -1 && !cutmode){
    snap(shapes[shapes.selected]);
  }
  if(incision){
    nearest(incision);
    nearest(point);
    console.log(shapes[shapes.selected].points[0].x);
    shapes.push(cut(shapes[shapes.selected],incision,point));
    incision = undefined;
    cutmode = false;
  }
  draw();
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

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
canvas.addEventListener("touchstart", touchHandler, true);
canvas.addEventListener("touchmove", touchHandler, true);
canvas.addEventListener("touchend", touchHandler, true);

