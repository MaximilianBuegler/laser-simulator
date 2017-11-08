/**
MIT License

Copyright (c) 2017 Maximilian Bügler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/


var canvas = document.getElementById("laserCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var mirrorsize=0.03;
var trianglediameter=Math.sqrt(3)/3*mirrorsize;
var squarediameter=Math.sqrt(2*Math.pow(mirrorsize,2))/2;







var lasers=[{x:0,y:0.2,a:90},{x:1,y:0.1,a:270}];
var mirrortriangles=[{x:0.5,y:0.2,a:0},{x:0.514,y:0.654,a:-8},{x:0.22,y:0.752,a:-1}];
var mirrorsquares=[{x:0.712,y:0.088,a:0},{x:0.22,y:0.654,a:-16},{x:0.392,y:0.79,a:-26},{x:0.726,y:0.676,a:0}];
var blocks=[{x:0.5,y:0.6,w:0.4,h:0.01,a:-6},{x:0.424,y:0.882,w:0.2,h:0.01,a:-28.5}];
var sinks=[{x:0.4,y:0.98,a:60},{x:0.6,y:0.98,a:60}];

var objects=[];

for (var i=0;i<mirrortriangles.length;i++){
    objects.push(mirrortriangles[i]);
}
for (var i=0;i<mirrorsquares.length;i++){
    objects.push(mirrorsquares[i]);
}
for (var i=0;i<blocks.length;i++){
    objects.push(blocks[i]);
}
for (var i=0;i<lasers.length;i++){
    objects.push(lasers[i]);
}
for (var i=0;i<sinks.length;i++){
    objects.push(sinks[i]);
}

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this >= min && this <= max;
};


function round(x){
    return Math.round(100000000*x)/100000000.0;
}

/**
 * l1 laser
 * l2 mirror
 **/
function getIntersection(l1,l2){
    var m1,m2,b1,b2,xi,yi,a,d;
    if (round(l1.x2)==round(l1.x1)){
        m1=NaN;
        b1=l1.x1;
    }
    else{
        m1=round((l1.y2-l1.y1)/(l1.x2-l1.x1));
        b1=l1.y1-m1*l1.x1;
    }
    if (round(l2.x2)==round(l2.x1)){
        m2=NaN;
        b2=l2.x1;
    }
    else{
        m2=round((l2.y2-l2.y1)/(l2.x2-l2.x1));
        b2=l2.y1-m2*l2.x1;
    }
    if (isNaN(m1) && !isNaN(m2)){
        xi=b1;
        yi=m2*xi+b2;
        
        if (xi.between(l2.x1,l2.x2) && xi.between(l1.x1,l1.x2)&& yi.between(l1.y1,l1.y2)){
            a=Math.atan(1/m2);
            d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
            return {x:xi,y:yi,a:a,d:d};
        }
        else{
            return 'nowhere';
        }        
    }
    if (isNaN(m2) && !isNaN(m1)){
        xi=b2;
        yi=m1*xi+b1;
        if (yi.between(l2.y1,l2.y2) && xi.between(l1.x1,l1.x2)){
            a=Math.atan(m1)+Math.PI/2;
            d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
            return {x:xi,y:yi,a:a,d:d};
        }
        else{
            return 'nowhere';
        }
    }
    if (m1==m2){
        if (b1==b2){
            return 'nowhere';//'everywhere';
        }
        else{
            return 'nowhere';
        }
    }
    else{
        xi=(b2-b1)/(m1-m2);
        yi=m1*xi+b1;
        if (xi.between(l2.x1,l2.x2) && xi.between(l1.x1,l1.x2)){
            a=Math.atan((m1-m2)/(1+m1*m2));
            d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
            return {x:xi,y:yi,a:a,d:d};
        }
        else{
            return 'nowhere';
        }
    }
    return 'nowhere';
}

function draw(){
    ctx.fillStyle='white';
    ctx.fillRect(0,0,500,500);
    ctx.strokeStyle='gray';
    ctx.strokeRect(0,0,500,500);
    ctx.fillStyle='white';
    var x1,x2,x3,x4,y1,y2,y3,y4,i,d,a,r;
    for (i=0;i<mirrortriangles.length;i++){
        x1=mirrortriangles[i].x+trianglediameter*Math.sin((mirrortriangles[i].a)/180*Math.PI);
        y1=mirrortriangles[i].y+trianglediameter*Math.cos((mirrortriangles[i].a)/180*Math.PI);
        x2=mirrortriangles[i].x+trianglediameter*Math.sin((mirrortriangles[i].a+120)/180*Math.PI);
        y2=mirrortriangles[i].y+trianglediameter*Math.cos((mirrortriangles[i].a+120)/180*Math.PI);
        x3=mirrortriangles[i].x+trianglediameter*Math.sin((mirrortriangles[i].a+240)/180*Math.PI);
        y3=mirrortriangles[i].y+trianglediameter*Math.cos((mirrortriangles[i].a+240)/180*Math.PI);
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        ctx.lineTo(x2*width,y2*height);
        ctx.lineTo(x3*width,y3*height);
        ctx.lineTo(x1*width,y1*height);
        ctx.fill();
        ctx.stroke();
        mirrortriangles[i].points=[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3}];
        mirrortriangles[i].lines=[{x1:x1,y1:y1,x2:x2,y2:y2},{x1:x2,y1:y2,x2:x3,y2:y3},{x1:x3,y1:y3,x2:x1,y2:y1}];
    }
    for (i=0;i<mirrorsquares.length;i++){
        x1=mirrorsquares[i].x+squarediameter*Math.sin((mirrorsquares[i].a)/180*Math.PI);
        y1=mirrorsquares[i].y+squarediameter*Math.cos((mirrorsquares[i].a)/180*Math.PI);
        x2=mirrorsquares[i].x+squarediameter*Math.sin((mirrorsquares[i].a+90)/180*Math.PI);
        y2=mirrorsquares[i].y+squarediameter*Math.cos((mirrorsquares[i].a+90)/180*Math.PI);
        x3=mirrorsquares[i].x+squarediameter*Math.sin((mirrorsquares[i].a+180)/180*Math.PI);
        y3=mirrorsquares[i].y+squarediameter*Math.cos((mirrorsquares[i].a+180)/180*Math.PI);
        x4=mirrorsquares[i].x+squarediameter*Math.sin((mirrorsquares[i].a+270)/180*Math.PI);
        y4=mirrorsquares[i].y+squarediameter*Math.cos((mirrorsquares[i].a+270)/180*Math.PI);        
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        ctx.lineTo(x2*width,y2*height);
        ctx.lineTo(x3*width,y3*height);
        ctx.lineTo(x4*width,y4*height);
        ctx.lineTo(x1*width,y1*height);
        ctx.fill();
        ctx.stroke();
        mirrorsquares[i].points=[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}];
        mirrorsquares[i].lines=[{x1:x1,y1:y1,x2:x2,y2:y2},{x1:x2,y1:y2,x2:x3,y2:y3},{x1:x3,y1:y3,x2:x4,y2:y4},{x1:x4,y1:y4,x2:x1,y2:y1}];
    }
    ctx.fillStyle='grey';
    for (i=0;i<blocks.length;i++){
        d=Math.sqrt(Math.pow(blocks[i].w,2)+Math.pow(blocks[i].h,2))/2;
        a=Math.atan(blocks[i].w/blocks[i].h);
        r=Math.PI*blocks[i].a/180;
        x1=blocks[i].x+d*Math.sin(a+r);
        y1=blocks[i].y+d*Math.cos(a+r);
        x2=blocks[i].x+d*Math.sin(Math.PI-a+r);
        y2=blocks[i].y+d*Math.cos(Math.PI-a+r);
        x3=blocks[i].x+d*Math.sin(Math.PI+a+r);
        y3=blocks[i].y+d*Math.cos(Math.PI+a+r);
        x4=blocks[i].x+d*Math.sin(-a+r);
        y4=blocks[i].y+d*Math.cos(-a+r);                    
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        ctx.lineTo(x2*width,y2*height);
        ctx.lineTo(x3*width,y3*height);
        ctx.lineTo(x4*width,y4*height);
        ctx.lineTo(x1*width,y1*height);
        ctx.fill();
        blocks[i].points=[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}];
        blocks[i].lines=[{x1:x1,y1:y1,x2:x2,y2:y2},{x1:x2,y1:y2,x2:x3,y2:y3},{x1:x3,y1:y3,x2:x4,y2:y4},{x1:x4,y1:y4,x2:x1,y2:y1}];
        
    }
    ctx.fillStyle='green';
    for (i=0;i<sinks.length;i++){
        x1=sinks[i].x+trianglediameter*Math.sin((sinks[i].a)/180*Math.PI);
        y1=sinks[i].y+trianglediameter*Math.cos((sinks[i].a)/180*Math.PI);
        x2=sinks[i].x+trianglediameter*Math.sin((sinks[i].a+120)/180*Math.PI);
        y2=sinks[i].y+trianglediameter*Math.cos((sinks[i].a+120)/180*Math.PI);
        x3=sinks[i].x+trianglediameter*Math.sin((sinks[i].a+240)/180*Math.PI);
        y3=sinks[i].y+trianglediameter*Math.cos((sinks[i].a+240)/180*Math.PI);
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        ctx.lineTo(x2*width,y2*height);
        ctx.lineTo(x3*width,y3*height);
        ctx.lineTo(x1*width,y1*height);
        ctx.fill();
        ctx.stroke();
        sinks[i].points=[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3}];
        sinks[i].lines=[{x1:x1,y1:y1,x2:x2,y2:y2},{x1:x2,y1:y2,x2:x3,y2:y3},{x1:x3,y1:y3,x2:x1,y2:y1}];
    }    
    ctx.fillStyle='red';
    for (l=0;l<lasers.length;l++){
        x1=lasers[l].x+trianglediameter*Math.sin((lasers[l].a+0)/180*Math.PI);
        y1=lasers[l].y+trianglediameter*Math.cos((lasers[l].a+0)/180*Math.PI);
        x2=lasers[l].x+trianglediameter*Math.sin((lasers[l].a+120)/180*Math.PI);
        y2=lasers[l].y+trianglediameter*Math.cos((lasers[l].a+120)/180*Math.PI);
        x3=lasers[l].x+trianglediameter*Math.sin((lasers[l].a+240)/180*Math.PI);
        y3=lasers[l].y+trianglediameter*Math.cos((lasers[l].a+240)/180*Math.PI);
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        ctx.lineTo(x2*width,y2*height);
        ctx.lineTo(x3*width,y3*height);
        ctx.lineTo(x1*width,y1*height);
        ctx.fill();
        ctx.stroke();
        lasers[l].points=[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3}];
        var terminated=false;
        var sinked=false;
        var lasera=(lasers[l].a)/180*Math.PI;
        var laserx2=x1+2*Math.sin(lasera);
        var lasery2=y1+2*Math.cos(lasera);
        var laser={x1:x1,y1:y1,a:lasera,x2:laserx2,y2:lasery2};
        ctx.beginPath();
        ctx.moveTo(x1*width,y1*height);
        var bounce=0;
        var lasthit=null;
        var newLasthit=null;
        while(!terminated){
            var earliestHit=null;
            var intersection;
            for (i=0;i<mirrortriangles.length;i++){
                for (j=0;j<mirrortriangles[i].lines.length;j++){
                    if (lasthit===null || lasthit.t!=0 || lasthit.i!=i){
                        intersection=getIntersection(laser,mirrortriangles[i].lines[j]);
                        if (intersection!='nowhere'){                       
                            if (earliestHit==null || intersection.d<earliestHit.d){
                                newLasthit={t:0,i:i,j:j};
                                earliestHit=intersection;
                            }
                        }
                    }
                }
            }
            for (i=0;i<mirrorsquares.length;i++){
                for (j=0;j<mirrorsquares[i].lines.length;j++){
                    if (lasthit===null || lasthit.t!=1 || lasthit.i!=i){                                                
                        intersection=getIntersection(laser,mirrorsquares[i].lines[j]);
                        if (intersection!='nowhere'){
                            if (earliestHit==null || intersection.d<earliestHit.d){
                                newLasthit={t:1,i:i,j:j};
                                earliestHit=intersection;
                            }
                        }
                    }
                }
            }
            for (i=0;i<blocks.length;i++){
                for (j=0;j<blocks[i].lines.length;j++){
                    if (lasthit===null || lasthit.t!=2 || lasthit.i!=i){                        
                        intersection=getIntersection(laser,blocks[i].lines[j]);
                        if (intersection!='nowhere'){
                            if (earliestHit==null || intersection.d<earliestHit.d){
                                newLasthit={t:2,i:i,j:j};
                                earliestHit=intersection;
                                terminated=true;
                            }
                        }
                    }
                }
            }
          for (i=0;i<sinks.length;i++){
                for (j=0;j<sinks[i].lines.length;j++){
                    if (lasthit===null || lasthit.t!=2 || lasthit.i!=i){                        
                        intersection=getIntersection(laser,sinks[i].lines[j]);
                        if (intersection!='nowhere'){
                            if (earliestHit==null || intersection.d<earliestHit.d){
                                newLasthit={t:2,i:i,j:j};
                                earliestHit=intersection;
                                terminated=true;
                                sinked=true;
                            }
                        }
                    }
                }
            }            
            if (earliestHit==null){
                terminated=true;
                ctx.lineTo(laser.x2*width,laser.y2*height);
            }
            else{
                x2=earliestHit.x;
                y2=earliestHit.y;
                a=(laser.a+Math.PI*(earliestHit.a/(Math.PI/2)));
                laserx2=x2+2*Math.sin(a);
                lasery2=y2+2*Math.cos(a);
                laser={x1:x2,y1:y2,a:a,x2:laserx2,y2:lasery2};
                ctx.lineTo(x2*width,y2*height);
            }
            if (bounce++>10){
                terminated=true;
            }
            lasthit=newLasthit;
        }
        if (sinked){
          ctx.strokeStyle='green';
        }
        else{
          ctx.strokeStyle='red';
        }
        
        ctx.stroke();
    }
    
}

draw();

var mouseWheelHandler=function(event){
    var delta=event.detail || event.deltaY;
    var rect = canvas.getBoundingClientRect();
    var mx=event.clientX-rect.left;
    var my=event.clientY-rect.top;    
    var xp,yp,i;
    var minDist=0;
    var minI=-1;
    for (i=0;i<objects.length;i++){
        xp=objects[i].x*width;
        yp=objects[i].y*height;
        dist=Math.sqrt(Math.pow(xp-mx,2)+Math.pow(yp-my,2));
        if ((minI<0 || dist<minDist) && dist<50){
            minDist=dist;
            minI=i;
        }
    }
    if (minI>-1){
      objects[minI].a+=Math.sign(delta)*0.5;
      draw();      
    }
    
    return false; };
  
canvas.addEventListener('DOMMouseScroll',mouseWheelHandler,false);
canvas.addEventListener('mousewheel',mouseWheelHandler,false);
canvas.addEventListener('onwheel',mouseWheelHandler,false);

var dragged=null;

canvas.addEventListener('mousedown',function(event){
    if (event.buttons==2){
      console.log(JSON.stringify(lasers));
      console.log(JSON.stringify(mirrortriangles));
      console.log(JSON.stringify(mirrorsquares));
      console.log(JSON.stringify(blocks));
      console.log(JSON.stringify(sinks));
    }  
    var rect = canvas.getBoundingClientRect();
    var mx=event.clientX-rect.left;
    var my=event.clientY-rect.top;
    var xp,yp,i,dist;
    var minDist=100000;
    for (i=0;i<objects.length;i++){
        xp=objects[i].x*width;
        yp=objects[i].y*height;
        dist=Math.sqrt(Math.pow(xp-mx,2)+Math.pow(yp-my,2));
        if (dist<minDist && dist<50){
            minDist=dist;
            dragged=i;
        }
    }
    return false;
});


canvas.addEventListener('mouseup',function(){
    dragged=null;
});

canvas.addEventListener('mouseout',function(){
    dragged=null;
});    

canvas.addEventListener('mousemove',function(event){
    var rect = canvas.getBoundingClientRect();
    var mx=event.clientX-rect.left;
    var my=event.clientY-rect.top;    
    if (dragged!==null){
        objects[dragged].x=mx/width;
        objects[dragged].y=my/width;
        draw();
    }
});