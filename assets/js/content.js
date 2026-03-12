
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
    
    let v = data[k];
    try { v = typeof v === 'string' ? JSON.parse(v) : v; } catch {}

    if (typeof v === 'string') {
      if (el.tagName === 'IMG') el.src = v;
      else el.innerHTML = v; // Use innerHTML to allow simple HTML tags like spans
    } else if (v && typeof v === 'object') {
      if (v.text !== undefined) el.innerHTML = v.text;
      if (v.href && el.tagName === 'A') el.href = v.href;
      if (v.image) {
        if (el.tagName === 'IMG') el.src = v.image;
        else el.style.backgroundImage = `url(${v.image})`;
      }
    }
  });

  // 2. Handle Dynamic Lists
  if (data['services.list']) renderServices(parseJSON(data['services.list']));
  if (data['work.list']) renderWork(parseJSON(data['work.list']));
  if (data['portfolio.list']) renderPortfolio(parseJSON(data['portfolio.list']));
  if (data['testimonials.list']) renderTestimonials(parseJSON(data['testimonials.list']));
}

function parseJSON(str) {
  try { return typeof str === 'string' ? JSON.parse(str) : str; } catch { return []; }
}

// --- Renderers ---

function renderServices(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  container.innerHTML = list.map(item => `
    <div class="service-card">
      <div class="service-icon">${item.icon || '✨'}</div>
      <h3>${item.title || 'Service Title'}</h3>
      <p>${item.description || ''}</p>
    </div>
  `).join('');
}

function renderWork(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('case-grid');
  if (!container) return;

  container.innerHTML = list.map(item => {
    let statsHtml = '';
    try {
      const stats = typeof item.stats === 'string' ? JSON.parse(item.stats) : (item.stats || []);
      if (Array.isArray(stats)) {
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

    return `
    <div class="case-card">
      <div class="case-image">${item.icon || '📁'}</div>
      <div class="case-content">
        <span class="case-tag">${item.tag || 'Case Study'}</span>
        <h3>${item.title || 'Project Title'}</h3>
        <p>${item.description || ''}</p>
        ${statsHtml}
      </div>
    </div>
    `;
  }).join('');
}

function renderPortfolio(list) {
  if (!list || !list.length) return;
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="portfolio-item">
      <div class="portfolio-image">${item.icon || '🎨'}</div>
      <div class="portfolio-content">
        <h3>${item.title || 'Project'}</h3>
        <p>${item.description || ''}</p>
      </div>
    </div>
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
      
      // Update simple fields
      const els = document.querySelectorAll(`[data-content-key="${key}"]`);
      if (els.length > 0) {
        let v = value;
        try { v = typeof v === 'string' ? JSON.parse(v) : v; } catch {}
        
        els.forEach(el => {
          if (typeof v === 'string') {
             if (el.tagName === 'IMG') el.src = v;
             else el.innerHTML = v;
          } else if (v && typeof v === 'object') {
            if (v.text !== undefined) el.innerHTML = v.text;
            if (v.image) {
              if (el.tagName === 'IMG') el.src = v.image;
              else el.style.backgroundImage = `url(${v.image})`;
            }
          }
        });
      }

      // Update lists
      if (key === 'services.list') renderServices(parseJSON(value));
      if (key === 'work.list') renderWork(parseJSON(value));
      if (key === 'portfolio.list') renderPortfolio(parseJSON(value));
      if (key === 'testimonials.list') renderTestimonials(parseJSON(value));

    } catch (err) {
      console.error('Error processing update', err);
    }
  };
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  listenUpdates();
});
