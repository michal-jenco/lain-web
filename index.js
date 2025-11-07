const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// UI elements
const toggle = document.getElementById('mouseFollowToggle');
const strengthSlider = document.getElementById('mouseStrength');

// cursor tracking
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const textFragments = [
    "present day. present time.",
    "do you remember before the net?",
    "the wire remembers you.",
    "signal path drifting.",
    "fp-545148639",
    "mebious > entry",
    "your presence has been logged.",
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
    "this signal is alive."
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

class FloatTxt {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width - 500;
        this.y = Math.random() * canvas.height;

        // base drift velocities
        this.vxBase = (Math.random() + 0.5) * 0.08;
        this.vyBase = (Math.random() - 0.5) * 0.05;

        // drifting tempo
        this.speedT = Math.random() * 1000;

        // text appearance
        this.txt = pick(textFragments);
        this.size = 10 + Math.random() * 27;
        this.angle = (Math.random() - 0.5) * Math.random();

        // breathing brightness
        this.alphaBase = 0.30 + Math.random() * 0.30;
        this.alphaAmp = 0.10 + Math.random() * 0.15;
        this.alphaT = Math.random() * 2000;
        this.alphaSpeed = 0.002 + Math.random() * 0.004;
    }

    update() {
        // movement breathing
        const speedMul = 1 - Math.sin(this.speedT * 0.01) * 0.1;
        this.speedT += 1;

        this.x += this.vxBase * speedMul;
        this.y += this.vyBase * speedMul;

        // pulsing transparency
        this.alphaT += this.alphaSpeed;
        this.alpha = this.alphaBase + Math.sin(this.alphaT) * this.alphaAmp;

        // -------------------------
        // INTERACTION FIELD
        // -------------------------
        if (toggle.checked) {
            const strength = strengthSlider.value / 100;
            if (strength > 0) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                // attraction
                this.x += dx * (0.0008 * strength);
                this.y += dy * (0.0008 * strength);

                // avoidance bubble
                const avoidRadius = 120 * strength;
                if (dist < avoidRadius) {
                    const avoidForce = (avoidRadius - dist) * 0.01 * strength;
                    this.x -= dx * avoidForce;
                    this.y -= dy * avoidForce;
                }

                // gaze rotation
                const targetAngle = Math.atan2(dy, dx);
                this.angle += (targetAngle - this.angle) * (0.03 * strength);
            }
        }

        // bounds respawn
        if (this.x < -300 || this.x > canvas.width + 300 ||
            this.y < -300 || this.y > canvas.height + 300) {
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

const floats = Array.from({ length: 26 }, () => new FloatTxt());
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
