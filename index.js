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

    // new ones:
    "no boundaries between thought and signal.",
    "do you believe in god?",
    "i can hear you.",
    "layers of self dissolving.",
    "let's all love lain.",
    "i don't need a body to exist.",
    "wired / meat / dream / echo",
    "close your eyes to connect.",
    "this is not the real world.",
    "the real world is not here.",
    "there is no frontier between us.",
    "everything is connected.",
    "i am here.",
    "i am not here.",
    "i thought i was the only one.",
    "your identity is leaking.",
    "do you remember who you were?",
    "incoming transmission…",
    "you are already inside.",
    "the sky hums like a modem.",
    "i feel reality thinning.",
    "synchronization increasing.",
    "the network is breathing.",
    "some things are better forgotten.",
    "wake up, lain.",
    "static carries voices.",
    "something is watching you.",
    "this signal is alive.",
];


function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

class FloatTxt {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width - 500;
        this.y = Math.random() * canvas.height;

        // base drift
        this.vxBase = (Math.random() + 0.5) * 0.08;
        this.vyBase = (Math.random() - 0.5) * 0.05;

        // movement modulation
        this.speedT = Math.random() * 1000;

        // text + style
        this.txt = pick(textFragments);
        this.size = 4 + Math.random() * 27;
        this.angle = (Math.random() - 0.5) * Math.random();

        // alpha pulsing
        this.alphaBase = 0.05 + Math.random() * 0.7; // base transparency
        this.alphaAmp = 0.10 + Math.random() * 0.15;  // how much it varies
        this.alphaT = Math.random() * 2000;           // time offset so they don't sync
        this.alphaSpeed = Math.random() * 0.4; // each text pulses at different speed
    }
    update() {
        // smooth speed modulation
        const speedMul = 1 - Math.sin(this.speedT * 0.01) * 0.1;
        this.speedT += 1;

        this.x += this.vxBase * speedMul;
        this.y += this.vyBase * speedMul;

        // alpha pulsing
        this.alphaT += this.alphaSpeed;
        this.alpha = this.alphaBase + Math.sin(this.alphaT) * this.alphaAmp;

        // borders -> respawn
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
