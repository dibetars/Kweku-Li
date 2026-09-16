// Main Content Handler
async function loadContent() {
  try {
    const r = await fetch('/api/content');
    const data = await r.json();
    applyContent(data);
  } catch (e) {
    console.error('Failed to load content', e);
  }
}

function applyContent(data) {
  // 1. Handle Simple Text/Image Replacements
  document.querySelectorAll('[data-content-key]').forEach(el => {
    const k = el.getAttribute('data-content-key');
    if (!(k in data)) return;
    applyValue(el, data[k]);
  });

  // 2. Handle Dynamic Lists
  if (data['services.list']) renderServices(parseJSON(data['services.list']));
  if (data['work.list']) renderWork(parseJSON(data['work.list']));
  if (data['portfolio.list']) renderPortfolio(parseJSON(data['portfolio.list']));
  if (data['experience.list']) renderExperiences(parseJSON(data['experience.list']));
  if (data['insights.list']) renderInsights(parseJSON(data['insights.list']));
  if (data['testimonials.list']) renderTestimonials(parseJSON(data['testimonials.list']));
}

function setImage(el, src) {
  if (el.parentElement && el.parentElement.tagName === 'PICTURE') {
    el.parentElement.querySelectorAll('source').forEach(s => s.remove());
  }
  el.src = src;
}

function applyValue(el, raw) {
  let v = raw;
  try { v = typeof v === 'string' ? JSON.parse(v) : v; } catch {}

  if (typeof v === 'string') {
    if (el.tagName === 'IMG') setImage(el, v);
    else el.innerHTML = v; // Use innerHTML to allow simple HTML tags like spans
  } else if (v && typeof v === 'object') {
    if (v.text !== undefined && el.tagName !== 'IMG') el.innerHTML = v.text;
    if (v.href && el.tagName === 'A') el.href = v.href;
    if (v.image) {
      if (el.tagName === 'IMG') setImage(el, v.image);
      else el.style.backgroundImage = `url(${v.image})`;
    }
  }
}

function parseJSON(str) {
  try { return typeof str === 'string' ? JSON.parse(str) : str; } catch { return []; }
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function slug(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Defaults captured from the authored markup so CMS lists without an image still show the photos
const defaultMedia = {};

function captureDefaults(containerId, itemSel, imgSel) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const byTitle = {};
  const byIndex = [];
  c.querySelectorAll(itemSel).forEach((el, i) => {
    const img = el.querySelector(imgSel);
    const h = el.querySelector('h3');
    const overlay = el.querySelector('.case-overlay span:last-child, .portfolio-overlay span:last-child');
    const source = img && img.parentElement.tagName === 'PICTURE' ? img.parentElement.querySelector('source') : null;
    const entry = {
      image: img ? img.getAttribute('src') : '',
      sourceHtml: source ? source.outerHTML : '',
      category: el.getAttribute('data-category') || '',
      subtitle: overlay ? overlay.textContent.trim() : ''
    };
    byIndex[i] = entry;
    if (h) byTitle[h.textContent.trim().toLowerCase()] = entry;
  });
  defaultMedia[containerId] = { byTitle, byIndex };
}

function withDefaults(containerId, item, index) {
  const d = defaultMedia[containerId];
  if (!d) return item;
  const def = d.byTitle[String(item.title || '').trim().toLowerCase()] || d.byIndex[index] || {};
  const image = item.image || def.image || '';
  return {
    ...item,
    image,
    // Only reuse the authored WebP sources when the photo itself is the authored one
    sourceHtml: image === def.image ? (def.sourceHtml || '') : '',
    category: item.category || def.category || '',
    subtitle: item.subtitle || def.subtitle || ''
  };
}

// Media slot: real image when provided, emoji/icon fallback otherwise
function mediaHtml(item, cls, fallbackIcon) {
  if (item.image) {
    const img = `<img class="${cls}" src="${esc(item.image)}" alt="${esc(item.title || '')}" loading="lazy">`;
    return item.sourceHtml ? `<picture>${item.sourceHtml}${img}</picture>` : img;
  }
  return `<div class="${cls} ${cls}-fallback">${item.icon || fallbackIcon}</div>`;
}

// --- Renderers ---

function renderServices(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = list.map((item, index) => `
    <article class="service-card">
      <span class="service-index">${String(index + 1).padStart(2, '0')}</span>
      <div class="service-icon-wrap">
        <div class="service-icon">${item.icon || '✨'}</div>
      </div>
      <div class="service-body">
        <h3>${item.title || 'Service Title'}</h3>
        <p>${item.description || ''}</p>
      </div>
    </article>
  `).join('');
}

function renderWork(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('case-grid');
  if (!container) return;

  container.innerHTML = list.map((raw, index) => {
    const item = withDefaults('case-grid', raw, index);
    let statsHtml = '';
    try {
      const stats = typeof item.stats === 'string' ? JSON.parse(item.stats) : (item.stats || []);
      if (Array.isArray(stats) && stats.length) {
        statsHtml = `<div class="case-stats">
          ${stats.map(s => `
            <div class="stat">
              <span class="stat-number">${s.number}</span>
              <span class="stat-label">${s.label}</span>
            </div>
          `).join('')}
        </div>`;
      }
    } catch {}

    const client = item.client ? `<span class="case-client">For <strong>${esc(item.client)}</strong></span>` : '';
    const overlay = `<span class="case-overlay"><span>${esc(item.tag || 'Case Study')}</span><span>${esc(item.year || '')}</span></span>`;

    return `
    <article class="case-card">
      <a href="${esc(item.href || '#contact')}" class="case-media">
        ${mediaHtml(item, 'case-image', '📁')}
        ${overlay}
        <span class="case-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="case-content">
        <div class="case-heading">
          <h3>${item.title || 'Project Title'}</h3>
          ${client}
        </div>
        <p>${item.description || ''}</p>
        ${statsHtml}
      </div>
    </article>
    `;
  }).join('');
}

function renderPortfolio(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  container.innerHTML = list.map((raw, index) => withDefaults('portfolio-grid', raw, index)).map(item => `
    <article class="portfolio-item" data-category="${slug(item.category)}">
      <div class="portfolio-visual">
        ${mediaHtml(item, 'portfolio-image', '🎨')}
        <span class="portfolio-overlay"><span>${esc(item.category || '')}</span><span>${esc(item.subtitle || '')}</span></span>
        <span class="portfolio-arrow" aria-hidden="true">↗</span>
      </div>
      <div class="portfolio-meta">
        <div class="portfolio-content">
          <h3>${item.title || 'Project'}</h3>
          <p>${item.description || ''}</p>
        </div>
      </div>
    </article>
  `).join('');

  if (typeof window.buildPortfolioFilters === 'function') window.buildPortfolioFilters();
}

function renderExperiences(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('experience-list');
  if (!container) return;

  container.innerHTML = list.map((item, index) => {
    const tags = Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const isLast = index === list.length - 1;
    const tagHtml = `<div class="tag-list${isLast ? ' tag-list-dark' : ''}">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
    const images = Array.isArray(item.images) ? item.images : [];

    if (isLast && images.length) {
      return `
      <article class="experience-row is-open">
        <div class="experience-head">
          <h3>${esc(item.title || '')}</h3>
          <span class="experience-date">${esc(item.date || '')}</span>
        </div>
        ${tagHtml}
        <div class="experience-detail">
          <div class="experience-thumbs">${images.slice(0, 3).map(src => `<img src="${esc(src)}" alt="" loading="lazy">`).join('')}</div>
          <p>${item.description || ''}</p>
          <a href="#contact" class="circle-arrow" aria-label="Get in touch">↗</a>
        </div>
      </article>`;
    }

    return `
    <article class="experience-row">
      <div class="experience-head">
        <h3>${esc(item.title || '')}</h3>
        <span class="experience-date">${esc(item.date || '')}</span>
      </div>
      <p class="experience-desc">${item.description || ''}</p>
      ${tagHtml}
    </article>`;
  }).join('');
}

function renderInsights(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('insight-grid');
  if (!container) return;

  container.innerHTML = list.map(item => `
    <article class="insight-card">
      ${item.image ? `<img src="${esc(item.image)}" alt="" loading="lazy">` : ''}
      <div class="insight-body">
        <div class="insight-meta"><span class="tag tag-dark">${esc(item.category || 'Note')}</span><span>${esc(item.meta || '')}</span></div>
        <h3>${esc(item.title || '')}</h3>
        <p>${item.description || ''}</p>
      </div>
    </article>
  `).join('');
}

function renderTestimonials(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('testimonial-grid');
  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="testimonial-card">
      <p class="testimonial-text">"${item.text || ''}"</p>
      <p class="testimonial-author">— ${item.author || 'Client'}</p>
    </div>
  `).join('');
}

// --- Real-time Updates ---

function listenUpdates() {
  const eventSource = new EventSource('/events/content');

  eventSource.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data);
      const key = payload.key;
      const value = payload.value;

      document.querySelectorAll(`[data-content-key="${key}"]`).forEach(el => applyValue(el, value));

      if (key === 'services.list') renderServices(parseJSON(value));
      if (key === 'work.list') renderWork(parseJSON(value));
      if (key === 'portfolio.list') renderPortfolio(parseJSON(value));
      if (key === 'experience.list') renderExperiences(parseJSON(value));
      if (key === 'insights.list') renderInsights(parseJSON(value));
      if (key === 'testimonials.list') renderTestimonials(parseJSON(value));
    } catch (err) {
      console.error('Error processing update', err);
    }
  };
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  captureDefaults('case-grid', '.case-card', '.case-image');
  captureDefaults('portfolio-grid', '.portfolio-item', '.portfolio-image');
  loadContent();
  listenUpdates();
});
