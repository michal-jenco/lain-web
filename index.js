<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>mebious / entry</title>
<style>
    html, body {
        margin: 0;
        padding: 0;
        background: #000;
        overflow: hidden;
        font-family: monospace;
    }

    canvas {
        display: block;
        width: 100vw;
        height: 100vh;
        image-rendering: pixelated;
        filter: contrast(1.05) brightness(1.05) saturate(1.2);
    }

    /* subtle CRT scanline layer */
    #scan {
        pointer-events: none;
        position: fixed;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,0.25) 3px
        );
        mix-blend-mode: multiply;
    }

    /* optional tiny tag */
    #tag {
        position: fixed;
        top: 12px;
        left: 12px;
        color: #6afc6a;
        font-size: 12px;
        opacity: 0.7;
        letter-spacing: 0.5px;
    }
</style>
</head>
<body>

<canvas id="c"></canvas>
<div id="scan"></div>
<div id="tag">observed node: mebious / entry</div>

<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const textFragments = [
    "present day. present time.",
    "do you remember before the net?",
    "the wire remembers you.",
    "signal path drifting.",
    "fp-545148639",
    "mebious > entry",
    "your presence has been logged.",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

class FloatTxt {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.08; // slow
        this.vy = (Math.random() - 0.5) * 0.08; // slow
        this.txt = pick(textFragments);
        this.size = 12 + Math.random() * 10;
        this.alpha = 0.35 + Math.random() * 0.35;
        this.angle = (Math.random() - 0.5) * 0.15;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -200 || this.x > canvas.width + 200 ||
            this.y < -200 || this.y > canvas.height + 200) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#5dfc5d";
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.txt, 0, 0);
        ctx.restore();
    }
}

const floats = Array.from({ length: 22 }, () => new FloatTxt());

let paused = false;

function draw() {
    if (!paused) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        floats.forEach(f => { f.update(); f.draw(); });
    }
    requestAnimationFrame(draw);
}
draw();

window.addEventListener('keydown', e => {
    if (e.key === " ") paused = !paused;
    if (e.key.toLowerCase() === "d") {
        floats.push(new FloatTxt(), new FloatTxt(), new FloatTxt());
    }
});
</script>
</body>
</html>
