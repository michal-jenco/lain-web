const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.25; // optional, lower the volume

// Try to start immediately (may fail in some browsers)
bgMusic.play().catch(() => {
    console.log("Autoplay blocked, waiting for user interaction...");
});

// Start playback on first user interaction
function startAudio() {
    bgMusic.play().catch(e => console.log("Error playing audio:", e));
    document.body.removeEventListener('click', startAudio);
    document.body.removeEventListener('keydown', startAudio);
}

document.body.addEventListener('click', startAudio);
document.body.addEventListener('keydown', startAudio);

const textFragments = [
    "present day. present time.",
    "hahahahaha",
    ":3",
    "do you remember time before the net?",
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

// UI controls references
const toggle = document.getElementById('mouseFollowToggle');
const strengthSlider = document.getElementById('mouseStrength');
const numTextsSlider = document.getElementById('numTexts');
const minSizeSlider = document.getElementById('minSize');
const maxSizeSlider = document.getElementById('maxSize');
const driftSpeedSlider = document.getElementById('driftSpeed');
const pulseRangeSlider = document.getElementById('pulseRange');
const awakenChanceSlider = document.getElementById('awakenChance');
const jitterSlider = document.getElementById('jitter');
const wrapPaddingSlider = document.getElementById('wrapPadding');
const fadeOpacitySlider = document.getElementById('fadeOpacity');

// 10 new sliders
const rotationSpeedSlider = document.getElementById('rotationSpeed');
const alphaMinSlider = document.getElementById('alphaMin');
const alphaMaxSlider = document.getElementById('alphaMax');
const pulseSpeedSlider = document.getElementById('pulseSpeed');
const mouseRadiusSlider = document.getElementById('mouseRadius');
const mouseFactorSlider = document.getElementById('mouseFactor');
const hueSlider = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const brightnessSlider = document.getElementById('brightness');
const angleMaxSlider = document.getElementById('angleMax');

class FloatTxt {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - .5) * Number(driftSpeedSlider.value);
        this.vy = (Math.random() - .5) * Number(driftSpeedSlider.value);

        const minSize = Number(minSizeSlider.value);
        const maxSize = Number(maxSizeSlider.value);
        this.size = minSize + Math.random()*(maxSize-minSize);

        this.baseAlpha = Number(alphaMinSlider.value) + Math.random() * (Number(alphaMaxSlider.value)-Number(alphaMinSlider.value));
        this.alphaPulseSpeed = Number(pulseSpeedSlider.value);
        this.pulseT = Math.random()*1000;

        this.txt = pick(textFragments);
        this.angle = (Math.random()-0.5) * Number(angleMaxSlider.value);
        this.rotationSpeed = (Math.random()-0.5)*Number(rotationSpeedSlider.value);

        this.awakenChance = Number(awakenChanceSlider.value);
        this.hue = Number(hueSlider.value);
        this.saturation = Number(saturationSlider.value);
        this.brightness = Number(brightnessSlider.value);
    }
    update() {
        const pulseRange = Number(pulseRangeSlider.value);
        this.pulseT += this.alphaPulseSpeed;
        let a = this.baseAlpha + Math.sin(this.pulseT)*pulseRange;

        if (Math.random() < this.awakenChance) a += 0.75;
        this.alpha = a;

        this.x += this.vx;
        this.y += this.vy;

        const jitter = Number(jitterSlider.value);
        this.x += (Math.random()-0.5)*jitter;
        this.y += (Math.random()-0.5)*jitter;

        this.angle += this.rotationSpeed;

        const inactive = Date.now() - (mouse.lastMove || 0);
        const mouseRadius = Number(mouseRadiusSlider.value);
        const mouseFactor = Number(mouseFactorSlider.value)/100;
        if (toggle.checked && inactive < 2000) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if (dist < mouseRadius) {
                this.x += dx*0.0025*mouseFactor;
                this.y += dy*0.0025*mouseFactor;
            }
        } else {
            this.vx += (Math.random()-0.5)*0.001;
            this.vy += (Math.random()-0.5)*0.001;
        }

        const wrapPadding = Number(wrapPaddingSlider.value);
        if (this.x < -wrapPadding || this.x > canvas.width+wrapPadding ||
            this.y < -wrapPadding || this.y > canvas.height+wrapPadding) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue},${this.saturation}%,${this.brightness}%)`;
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.txt, 0, 0);
        ctx.restore();
    }
}

// initialize floats
let floats = Array.from({length: Number(numTextsSlider.value)}, () => new FloatTxt());

const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => {
    floats.forEach(f => f.reset());
});

// dynamically adjust number of floats
numTextsSlider.addEventListener('input', () => {
    const n = Number(numTextsSlider.value);
    if (n > floats.length) {
        floats.push(...Array.from({length: n - floats.length}, () => new FloatTxt()));
    } else if (n < floats.length) {
        floats = floats.slice(0,n);
    }
});

function draw() {
    const fadeOpacity = Number(fadeOpacitySlider.value);
    ctx.fillStyle = `rgba(0,0,0,${fadeOpacity})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    floats.forEach(f => { f.update(); f.draw(); });

    requestAnimationFrame(draw);
}
draw();
