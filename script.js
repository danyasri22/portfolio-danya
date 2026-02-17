// Simple modal handler
document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-project');
        const modal = document.getElementById('modal-' + id);
        if (modal) modal.classList.remove('hidden');
    });
});
document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal');
        if (modal) modal.classList.add('hidden');
    });
});
document.addEventListener('click', (e) => {
    // close when clicking backdrop
    if (e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) modal.classList.add('hidden');
    }
});

// Copy email
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText('hello@yourname.dev');
        const status = document.getElementById('formStatus');
        if (status) status.innerHTML = '<span class="text-green-400">Email copied to clipboard ✅</span>';
        else alert('Email copied! 🚀');
    } catch (err) { alert('Could not copy'); }
});

// Theme toggle (simple)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    themeToggle.textContent = isLight ? '🌞' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.classList.add('light');
        if (themeToggle) themeToggle.textContent = '🌞';
    }
});

// Contact form handling (fake submission — replace with real endpoint as needed)
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('formStatus');

function setStatus(msg, success = false) {
    if (!statusEl) return;
    statusEl.innerHTML = success ? '<span class="text-green-400">' + msg + '</span>' : '<span class="text-yellow-300">' + msg + '</span>';
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // basic validation
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();
        const honeypot = form.company ? form.company.value : '';

        if (honeypot) { setStatus('Spam detected — message blocked.'); return; }
        if (!name || !email || !message) { setStatus('Please complete required fields.'); return; }

        // simulate sending
        setStatus('Sending...');
        sendBtn.disabled = true;

        setTimeout(() => {
            // success
            setStatus('Message sent — I will reply within 48 hours.', true);
            form.reset();
            sendBtn.disabled = false;
        }, 1200);
    });
}

if (clearBtn && form) clearBtn.addEventListener('click', () => { form.reset(); if (statusEl) statusEl.textContent = ''; });

// 3D tilt effect for project cards
function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        const inner = card.querySelector('.tilt-inner');
        if (!inner) return;
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 14; // degrees
            const rotateX = (0.5 - py) * 14;
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
            inner.style.boxShadow = `${-rotateY}px ${rotateX}px 40px rgba(2,6,23,0.45)`;
        });
        card.addEventListener('pointerleave', () => {
            inner.style.transform = 'none';
            inner.style.boxShadow = 'none';
        });
        // make keyboard focus also slightly pop
        card.addEventListener('focusin', () => { inner.style.transform = 'translateZ(8px)'; });
        card.addEventListener('focusout', () => { inner.style.transform = 'none'; });
    });
}

// reveal on scroll
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
}

// subtle blob animation
function initBlobs() {
    const blobs = Array.from(document.querySelectorAll('.blob'));
    if (!blobs.length) return;
    let t = 0;
    function loop() {
        t += 0.01;
        blobs.forEach((b,i) => {
            const dx = Math.sin(t * (0.5 + i * 0.15)) * 12;
            const dy = Math.cos(t * (0.4 + i * 0.12)) * 10;
            b.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// initialize extras
document.addEventListener('DOMContentLoaded', () => { initTilt(); initReveal(); initBlobs(); });

// Skills interactions: animate fills, filter, chip details
function initSkills() {
    // animate fills when in view
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(f => {
        const target = f.getAttribute('data-fill');
        // reveal when visible
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    f.style.width = target + '%';
                    obs.unobserve(f);
                }
            });
        }, { threshold: 0.2 });
        io.observe(f);
    });

    // filter buttons
    document.querySelectorAll('.skill-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.skill-filter').forEach(b=>b.dataset.active = 'false');
            btn.dataset.active = 'true';
            document.querySelectorAll('[data-type]').forEach(el => {
                if (filter === 'all' || el.getAttribute('data-type') === filter) el.style.display = '';
                else el.style.display = 'none';
            });
        });
    });

    // chip details
    document.querySelectorAll('.skill-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const title = chip.textContent.trim();
            const desc = chip.getAttribute('data-desc') || '';
            const panel = document.getElementById('skillDetail');
            document.getElementById('skillTitle').textContent = title;
            document.getElementById('skillDesc').textContent = desc;
            panel.classList.remove('hidden');
        });
        chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') chip.click(); });
    });

    // initialize default filter
    const defaultBtn = document.querySelector('.skill-filter[data-filter="all"]');
    if (defaultBtn) defaultBtn.click();
}

document.addEventListener('DOMContentLoaded', initSkills);

// Lightbox preview handling
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Preview';
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImg.src = '';
    document.body.style.overflow = '';
}

// click on project images to open lightbox
document.querySelectorAll('.tilt-inner img, .modal-screenshot').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
