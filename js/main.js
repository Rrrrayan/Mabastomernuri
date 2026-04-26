/* ============================================================
   MABAST OMER NURI — Portfolio JS
   ============================================================ */

'use strict';

// ─── Theme Toggle ────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ─── Custom Cursor ───────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = -100,
    my = -100,
    rx = -100,
    ry = -100;

document.addEventListener('mousemove', e => { mx = e.clientX;
    my = e.clientY; });
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0';
    cursorRing.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1';
    cursorRing.style.opacity = '0.6'; });

function moveCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(moveCursor);
}
moveCursor();

document.querySelectorAll('a, button, .skill-category-card, .tl-card, .edu-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered');
        cursorRing.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered');
        cursorRing.classList.remove('hovered'); });
});

// ─── Network Canvas Animation ────────────────────────────
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const DARK_COLOR = '47,47,228';
const LIGHT_COLOR = '47,47,228';

function getNodeColor() {
    return html.getAttribute('data-theme') === 'light' ? LIGHT_COLOR : DARK_COLOR;
}

class Node {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.r = Math.random() * 2.5 + 1;
        this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
        const c = getNodeColor();
        const pr = this.r + Math.sin(this.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.85)`;
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, pr * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.08)`;
        ctx.fill();
    }
}

const COUNT = Math.min(80, Math.floor(W * H / 12000));
for (let i = 0; i < COUNT; i++) nodes.push(new Node());

let mouseNode = { x: -9999, y: -9999 };
document.addEventListener('mousemove', e => { mouseNode.x = e.clientX;
    mouseNode.y = e.clientY; });

function drawNetwork() {
    ctx.clearRect(0, 0, W, H);
    const c = getNodeColor();

    nodes.forEach(n => n.update());

    // draw edges
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                const alpha = (1 - dist / 160) * 0.35;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(${c},${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
        // mouse connection
        const dx = nodes[i].x - mouseNode.x;
        const dy = nodes[i].y - mouseNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouseNode.x, mouseNode.y);
            ctx.strokeStyle = `rgba(0,240,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    nodes.forEach(n => n.draw());

    // mouse dot
    ctx.beginPath();
    ctx.arc(mouseNode.x, mouseNode.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,240,255,0.8)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mouseNode.x, mouseNode.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,240,255,0.1)`;
    ctx.fill();

    requestAnimationFrame(drawNetwork);
}
drawNetwork();

// ─── Mobile Hamburger ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => { navLinks.classList.remove('open'); });
});

// ─── Active Nav on Scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
    let found = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) found = s.id;
    });
    navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + found ?
            'var(--primary)' :
            '';
    });
}, { passive: true });

// ─── Scroll Reveal ──────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // skill bars
            e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.pct + '%';
            });
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline-item').forEach(el => observer.observe(el));

// Observe skill sections for bar animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 200);
            });
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category-card').forEach(card => skillObserver.observe(card));

// ─── Typewriter Effect ───────────────────────────────────
const titles = [
    'IT / Network Specialist',
    'System Administrator',
    'Fiber Optic Engineer',
    'Technical Support Lead',
    'Network Infrastructure Expert',
];
let titleIdx = 0,
    charIdx = 0,
    deleting = false;
const typeTarget = document.getElementById('typewriter');

function typeLoop() {
    const current = titles[titleIdx];
    if (!deleting) {
        typeTarget.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1800);
            return;
        }
        setTimeout(typeLoop, 60);
    } else {
        typeTarget.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            setTimeout(typeLoop, 300);
            return;
        }
        setTimeout(typeLoop, 35);
    }
}
typeLoop();

// ─── Terminal animation ──────────────────────────────────
const termLines = document.querySelectorAll('.t-line');
termLines.forEach((line, i) => {
    line.style.opacity = '0';
    setTimeout(() => {
        line.style.transition = 'opacity 0.4s ease';
        line.style.opacity = '1';
    }, 800 + i * 220);
});

// ─── Counter animation ───────────────────────────────────
function animateCounter(el, target, suffix = '+') {
    let cur = 0;
    const step = target / 60;
    const interval = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur) + (cur >= target ? suffix : '');
        if (cur >= target) clearInterval(interval);
    }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('.stat-num').forEach(el => {
                const val = parseInt(el.dataset.val);
                const sfx = el.dataset.sfx || '+';
                animateCounter(el, val, sfx);
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ─── Orbit dots animation ────────────────────────────────
const orbitDots = document.querySelectorAll('.orbit-dot');
orbitDots.forEach((dot, i) => {
    const radius = 170 + i * 30;
    const speed = 0.6 + i * 0.3;
    const phase = (i / orbitDots.length) * Math.PI * 2;

    function animOrbit(t) {
        const angle = phase + t * 0.001 * speed;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius;
        dot.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(animOrbit);
    }
    requestAnimationFrame(animOrbit);
});

// ─── 3D Social Icon Mouse Tilt ───────────────────────────
document.querySelectorAll('.si3d').forEach(icon => {
    icon.addEventListener('mousemove', e => {
        const rect = icon.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = dy * -22;
        const rotY = dx * 22;
        icon.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.12)`;
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = '';
        icon.style.animationPlayState = 'running';
    });
    icon.addEventListener('mouseenter', () => {
        icon.style.animationPlayState = 'paused';
    });
});
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        btn.textContent = '✓ MESSAGE SENT';
        btn.style.background = 'linear-gradient(90deg, #00c853, #00e5ff)';
        setTimeout(() => {
            btn.textContent = 'SEND MESSAGE';
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

// ─── Smooth nav scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ─── Particle burst on click ─────────────────────────────
document.addEventListener('click', e => {
    const count = 8;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:5px;height:5px;background:var(--primary);border-radius:50%;
      pointer-events:none;z-index:9997;
      transition:all 0.7s cubic-bezier(0.23,1,0.32,1);
      box-shadow:0 0 8px var(--primary);
    `;
        document.body.appendChild(p);
        const angle = (i / count) * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        requestAnimationFrame(() => {
            p.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`;
            p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), 800);
    }
});