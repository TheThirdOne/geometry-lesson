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

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
canvas.addEventListener("touchstart", touchHandler, true);
canvas.addEventListener("touchmove", touchHandler, true);
canvas.addEventListener("touchend", touchHandler, true);

