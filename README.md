# laser-simulator
Little Javascript Laser/Mirror/Reflection Simulator

# Intro
I wrote this little laser simulator for a small side project of mine. It is meant to simulate a real life laser puzzle. All mirrors are meant to be mosaic tiles of equal size, assembled into squares and rectangles. Lasers are meant to hit sinks. This is to be acchieved by rotating the mirror pieces. Blocks prevent easy solutions.

All measures are ratios of the full canvas. The size of a mirror tile can be defined as follows:
```
var mirrorsize=0.03;
```

Laser sources, mirror triangles, mirror squares, sinks, and blocking areas can be defined as follows:
```
x: horizontal position in ratio of canvas [0-1],
y: vertical position in ratio of canvas [0-1],
a: angle in degrees [0-360],
w: width of block in ratio of canvas [0-1],
h: height of block in ratio of canvas [0-1],
```

```
var lasers=[{x:0,y:0.2,a:90},{x:1,y:0.1,a:270}];
var mirrortriangles=[{x:0.5,y:0.2,a:0},{x:0.5,y:0.8,a:0},{x:0.2,y:0.8,a:0}];
var mirrorsquares=[{x:0.7,y:0.5,a:0},{x:0.3,y:0.5,a:0},{x:0.3,y:0.7,a:0},{x:0.5,y:0.6,a:0}];
var blocks=[{x:0.3,y:0.6,w:0.4,h:0.01}];
var sinks=[{x:0.4,y:1,a:0}];
```

Once you open index.html in your browser, all objects can be dragged and dropped, all objects can be rotated by using the mouse wheel. Lasers update in real time. Once a laser hits a sink its ray turns green. Drag and rotate objects close to their center points.

# Browser support
Only tested with Chrome and Firefox.

Have fun.