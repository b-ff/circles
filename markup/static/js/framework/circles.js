/**
 * Created by slava on 13.02.16.
 */

var
    shouldAnimate = true,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d"),

    r = window.innerHeight / 3,
    x = 0,
    y = 0,
    kr = 0.09,
    s = 3,
    animateDegree = 1;

ctx.translate(canvas.clientWidth / 2, window.innerHeight / 2);

/**
 * Draw a sun of circles
 * @param context - canvas context
 * @param {Number} x - x axis coordinate of the center of sun
 * @param {Number} y - y axis coordinate of the center of sun
 * @param {Number} r - radius of main circle
 * @param {Number} k - coefficient of radius decrease
 * @param {Number} s - steps of recursion
 * @param {Array} c - colors for each step
 * @constructor
 */
function CircleSun(context, x, y, r, k, s, c, isFirst) {
    this.context = context;
    this.centerX = x;
    this.centerY = y;
    this.mainRadius = r;
    this.K = k;
    this.steps = s;
    this.colors = c;

    //this.context.strokeStyle = "rgba(0, 0, 0, "+ (0.1 + (s * 2 / 10)) +")";
    this.context.strokeStyle = "rgba(0, 0, 0, 0.2)";

    this.drawCircle(x, y, r);

    if (isFirst) {
        //this.context.strokeStyle = "rgba(0, 0, 0, 0.2)";

        this.context.strokeStyle = "rgba(0, 0, 0, 0.2)";
        this.drawOrbitCircles(x, y, 180, r + 8, 2, true);
        //
        //this.context.strokeStyle = "rgba(0, 0, 0, 0.4)";
        //this.drawOrbitCircles(x, y, 90, r + 60, 2, true);
    }

    if (s > 0) {
        this.drawOrbitSuns(3 * s * 2, s % 2 == 0);
    }

    this.drawOrbitCircles(x, y, Math.pow(3, this.steps) * 2, r - r * (this.K / (this.steps - 1)), r * this.K / this.steps);
}

/**
 * Draw a simple circle contour
 * @param x
 * @param y
 * @param r
 */
CircleSun.prototype.drawCircle = function(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI, true);
    this.context.stroke();
    this.context.closePath();
};

CircleSun.prototype.getOrbitPoint = function(x,y,r,alpha) {
    var
        x0 = x + r,
        y0 = y,
        rx = x0 - x,
        ry = y0 - y,
        c = Math.cos(alpha),
        s = Math.sin(alpha),
        x1 = x + rx * c - ry * s,
        y1 = y + rx * s + ry * c;

    return {
        x: Math.round(x1),
        y: Math.round(y1)
    };
};

CircleSun.prototype.drawOrbitCircles = function(x, y, count, r, cr, offset) {
    var step = Math.PI * 2 / count;

    for (var i = (offset) ? 0 : 0.5; i < count; i++) {
        var alpha = step * i;

        var orbitCoords = this.getOrbitPoint(x, y, r, alpha);
        this.drawCircle(orbitCoords.x, orbitCoords.y, cr || r * this.K);
    }
};

CircleSun.prototype.drawOrbitSuns = function(count, offset) {
    var step = Math.PI * 2 / count;

    for (var i = (offset) ? 0 : 0.5; i < count; i++) {
        var alpha = step * i;

        var orbitCoords = this.getOrbitPoint(this.centerX, this.centerY, this.mainRadius + this.mainRadius * this.K * (this.steps), alpha);
        new CircleSun(this.context, orbitCoords.x, orbitCoords.y, this.mainRadius * this.K, this.K / (8 / count), this.steps - 1, this.colors);
    }
};

var animate = _.throttle(function () {
    if (!shouldAnimate) {
        return;
    }

    ctx.clearRect(0 - canvas.width / 2, 0 - canvas.height / 2, canvas.width, canvas.height);
    new CircleSun(ctx, x, y, r, kr, s, [], true);
    ctx.rotate(animateDegree * Math.PI / 180);

    window.requestAnimationFrame(animate);
}, 1000 / 30);

//animate();
new CircleSun(ctx, x, y, r, kr, s, [], true);

function stopAnimate() {
    shouldAnimate = false;
}




