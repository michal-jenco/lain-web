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

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

const mouse = { x: window.innerWidth/2, y: window.innerHeight/2, moved: false };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
    mouse.lastMove = Date.now();
});

// slider and checkbox references
const toggle = document.getElementById('mouseFollowToggle');
const strengthSlider = document.getElementById('mouseStrength');

class FloatTxt {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - .5) * 0.4;
        this.vy = (Math.random() - .5) * 0.4;

        this.size = 14 + Math.random() * 26;
        this.baseAlpha = 0.22 + Math.random() * 0.45;

        this.alphaPulseSpeed = 0.2 + Math.random()*0.002;
        this.pulseT = Math.random()*1000;

        this.txt = pick(textFragments);
        this.angle = (Math.random()-0.5) * 0.2;

        this.awakenChance = Math.random()*0.25; // very rare
    }
    update() {
        // gentle breathing
        this.pulseT += this.alphaPulseSpeed;
        let a = this.baseAlpha + Math.sin(this.pulseT)*0.12;

        // occasional "awaken" flash
        if (Math.random() < this.awakenChance) {
            a += 0.75;
        }

        this.alpha = a;

        // drift
        this.x += this.vx;
        this.y += this.vy;

        // slight noise jitter (signal instability)
        this.x += (Math.random()-0.5)*0.1;
        this.y += (Math.random()-0.5)*0.1;

        // mouse gravity only if enabled and "awake"
        const inactive = Date.now() - (mouse.lastMove || 0);
        if (toggle.checked && inactive < 2000) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;

            // read slider dynamically and cast to number
            const strength = Number(strengthSlider.value) / 100;

            this.x += dx * 0.0025 * strength;
            this.y += dy * 0.0025 * strength;
        } else {
            // slowly forget you
            this.vx += (Math.random()-0.5)*0.001;
            this.vy += (Math.random()-0.5)*0.001;
        }

        // wrap edges softly
        if (this.x < -200 || this.x > canvas.width+200 ||
            this.y < -200 || this.y > canvas.height+200) {
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

const floats = Array.from({length: 26}, () => new FloatTxt());

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    floats.forEach(f => { f.update(); f.draw(); });

    requestAnimationFrame(draw);
}
draw();
