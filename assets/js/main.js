document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const statusEl = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const setStatus = (text, kind) => {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = 'form-status' + (kind ? ` is-${kind}` : '');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contactForm.reportValidity()) return;

        const fields = ['name', 'email', 'phone', 'company', 'service', 'timeline', 'budget', 'location', 'message', 'website'];
        const payload = {};
        fields.forEach(f => { payload[f] = contactForm[f] ? contactForm[f].value.trim() : ''; });

        submitBtn.disabled = true;
        setStatus('Sending…', 'pending');
        try {
            const r = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const j = await r.json().catch(() => ({}));
            if (r.ok && j.ok) {
                contactForm.reset();
                setStatus("Thanks, your message is in. I'll reply within a couple of days.", 'success');
            } else if (r.status === 429) {
                setStatus('Too many messages from this connection. Please try again in a few minutes.', 'error');
            } else {
                setStatus('Something went wrong. Please email me directly instead.', 'error');
            }
        } catch (err) {
            setStatus('Could not reach the server. Please email me directly instead.', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Mobile navigation
(function () {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 720 && !menu.hidden) setOpen(false); });
})();

// Portfolio category filter chips
window.buildPortfolioFilters = function () {
    const bar = document.getElementById('portfolio-filters');
    const grid = document.getElementById('portfolio-grid');
    if (!bar || !grid) return;

    const items = Array.from(grid.querySelectorAll('.portfolio-item'));
    const categories = [];
    items.forEach(item => {
        const c = item.getAttribute('data-category');
        if (c && !categories.includes(c)) categories.push(c);
    });

    // Keep the authored chip labels when they still match; otherwise rebuild from data
    const existing = Array.from(bar.querySelectorAll('.chip')).map(b => b.getAttribute('data-filter'));
    const authoredMatch = categories.every(c => existing.includes(c));
    if (!authoredMatch) {
        const label = c => c.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        bar.innerHTML = ['all', ...categories].map((c, i) =>
            `<button class="chip${i === 0 ? ' is-active' : ''}" data-filter="${c}" type="button">${c === 'all' ? 'All' : label(c)}</button>`
        ).join('');
    }

    const apply = (filter) => {
        items.forEach(item => {
            const match = filter === 'all' || item.getAttribute('data-category') === filter;
            item.classList.toggle('is-hidden', !match);
        });
        bar.querySelectorAll('.chip').forEach(b => b.classList.toggle('is-active', b.getAttribute('data-filter') === filter));
    };

    bar.onclick = (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        apply(btn.getAttribute('data-filter'));
    };
};

window.buildPortfolioFilters();
