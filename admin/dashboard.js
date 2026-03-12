
// State
let currentUser = null;
let currentSection = 'hero';
let contentData = {};
let imageSelectorCallback = null;

// Config: Section Definitions
const SECTIONS = {
  hero: {
    title: 'Hero Section',
    type: 'form',
    fields: [
      { key: 'hero.subtitle', label: 'Subtitle', type: 'text' },
      { key: 'hero.title', label: 'Title (HTML allowed)', type: 'textarea', help: 'Use <span class="italic-text">text</span> for styling' },
      { key: 'hero.description', label: 'Description', type: 'textarea' }
    ]
  },
  services: {
    title: 'Services',
    type: 'list',
    key: 'services.list',
    itemTitle: 'Service',
    schema: [
      { key: 'icon', label: 'Icon (Emoji)', type: 'text', width: '20%' },
      { key: 'title', label: 'Service Title', type: 'text', width: '80%' },
      { key: 'description', label: 'Description', type: 'textarea', width: '100%' }
    ]
  },
  work: {
    title: 'Featured Case Studies',
    type: 'list',
    key: 'work.list',
    itemTitle: 'Case Study',
    schema: [
      { key: 'icon', label: 'Icon', type: 'text', width: '20%' },
      { key: 'tag', label: 'Tag (e.g. Marketing Campaign)', type: 'text', width: '40%' },
      { key: 'title', label: 'Project Title', type: 'text', width: '40%' },
      { key: 'description', label: 'Description', type: 'textarea', width: '100%' },
      { key: 'stats', label: 'Stats (JSON format for now)', type: 'textarea', width: '100%', help: '[{"number":"21.7K","label":"Streams"},...]' }
    ]
  },
  portfolio: {
    title: 'Selected Work',
    type: 'list',
    key: 'portfolio.list',
    itemTitle: 'Portfolio Item',
    schema: [
      { key: 'icon', label: 'Icon', type: 'text', width: '20%' },
      { key: 'title', label: 'Title', type: 'text', width: '80%' },
      { key: 'description', label: 'Description', type: 'textarea', width: '100%' }
    ]
  },
  about: {
    title: 'About Section',
    type: 'form',
    fields: [
      { key: 'about.intro', label: 'Intro Paragraph', type: 'textarea' },
      { key: 'about.professional', label: 'The Professional', type: 'textarea' },
      { key: 'about.artist', label: 'The Artist', type: 'textarea' },
      { key: 'about.philosophy', label: 'The Philosophy', type: 'textarea' },
      { key: 'about.mission', label: 'The Mission', type: 'textarea' }
    ]
  },
  testimonials: {
    title: 'Testimonials',
    type: 'list',
    key: 'testimonials.list',
    itemTitle: 'Testimonial',
    schema: [
      { key: 'text', label: 'Quote', type: 'textarea', width: '100%' },
      { key: 'author', label: 'Author', type: 'text', width: '100%' }
    ]
  },
  layout: {
    title: 'Layout & Navigation',
    type: 'layout-editor',
    fields: [
      { key: 'header.logo', label: 'Logo Text', type: 'text' },
      { key: 'header.cta', label: 'Header CTA Text', type: 'text' },
      { key: 'footer.quote', label: 'Footer Quote', type: 'text' },
      { key: 'footer.copyright', label: 'Copyright Text', type: 'text' }
    ]
  },
  contact: {
    title: 'Contact',
    type: 'form',
    fields: [
      { key: 'contact.email', label: 'Email', type: 'text' },
      { key: 'contact.phone', label: 'Phone', type: 'text' },
      { key: 'contact.location', label: 'Location', type: 'text' },
      { key: 'social.linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'social.instagram', label: 'Instagram URL', type: 'text' },
      { key: 'social.twitter', label: 'X/Twitter URL', type: 'text' },
      { key: 'social.youtube', label: 'YouTube URL', type: 'text' },
      { key: 'social.tiktok', label: 'TikTok URL', type: 'text' },
      { key: 'social.soundcloud', label: 'SoundCloud URL', type: 'text' }
    ]
  },
  theme: {
    title: 'Theme Settings',
    type: 'theme-editor',
    key: 'theme.config'
  },
  users: { title: 'User Management', type: 'system-users' },
  logs: { title: 'Audit Logs', type: 'system-logs' }
};

const THEME_PRESETS = {
  default: {
    name: 'Default Light',
    mode: 'light',
    variables: {
      '--bg-body': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-nav': 'rgba(255, 255, 255, 0.95)',
      '--bg-inverse': '#0a0a0a',
      '--text-main': '#0a0a0a',
      '--text-muted': '#666666',
      '--accent': '#6c3baa',
      '--accent-hover': '#341539',
      '--bg-secondary': '#0a0a0a',
      '--text-secondary': '#ffffff'
    }
  },
  dark: {
    name: 'Modern Dark',
    mode: 'dark',
    variables: {
      '--bg-body': '#0a0a0a',
      '--bg-card': '#151515',
      '--bg-nav': 'rgba(10, 10, 10, 0.95)',
      '--bg-inverse': '#ffffff',
      '--text-main': '#ffffff',
      '--text-muted': '#a0a0a0',
      '--accent': '#8b5cf6',
      '--accent-hover': '#7c3aed',
      '--bg-secondary': '#151515',
      '--text-secondary': '#ffffff'
    }
  },
  monochrome: {
    name: 'Minimal Monochrome',
    mode: 'light',
    variables: {
      '--bg-body': '#ffffff',
      '--bg-card': '#f8f8f8',
      '--bg-nav': 'rgba(255, 255, 255, 1)',
      '--bg-inverse': '#000000',
      '--text-main': '#000000',
      '--text-muted': '#555555',
      '--accent': '#000000',
      '--accent-hover': '#333333',
      '--bg-secondary': '#f0f0f0',
      '--text-secondary': '#000000'
    }
  }
};

// --- Initialization ---

async function init() {
  try {
    await checkAuth();
    await loadContent();
    setupNavigation();
    renderSection('hero');
  } catch (e) {
    console.error(e);
  }
}

async function checkAuth() {
  const r = await fetch('/api/auth/me');
  const j = await r.json();
  if (!j.user) {
    window.location.href = '/admin/login.html';
    return;
  }
  currentUser = j.user;
  document.getElementById('currentUser').textContent = currentUser.username;
  document.getElementById('currentRole').textContent = currentUser.role;
}

async function loadContent() {
  const r = await fetch('/api/content');
  contentData = await r.json();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sectionKey = btn.dataset.section;
      renderSection(sectionKey);
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login.html';
  });

  document.getElementById('saveBtn').addEventListener('click', saveCurrentSection);
  
  // Modal Events
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', closeModal);
  document.getElementById('modalUpload').addEventListener('change', uploadImage);
}

// --- Rendering ---

function renderSection(sectionKey) {
  currentSection = sectionKey;
  const config = SECTIONS[sectionKey];
  const container = document.getElementById('editorArea');
  const pageTitle = document.getElementById('pageTitle');
  const saveBtn = document.getElementById('saveBtn');

  pageTitle.textContent = config.title;
  container.innerHTML = '';
  document.getElementById('saveStatus').textContent = '';

  if (config.type === 'form') {
    saveBtn.style.display = 'flex';
    renderForm(container, config.fields);
  } else if (config.type === 'list') {
    saveBtn.style.display = 'flex';
    renderListEditor(container, config);
  } else if (config.type === 'system-users') {
    saveBtn.style.display = 'none';
    renderUserManagement(container);
  } else if (config.type === 'system-logs') {
    saveBtn.style.display = 'none';
    renderAuditLogs(container);
  } else if (config.type === 'theme-editor') {
    saveBtn.style.display = 'flex';
    renderThemeEditor(container, config);
  } else if (config.type === 'layout-editor') {
    saveBtn.style.display = 'flex';
    renderLayoutEditor(container, config);
  }
}

function renderThemeEditor(container, config) {
  let themeData = { mode: 'light', layout: { hero: 'default', cards: 'default' }, variables: {} };
  try {
    const raw = contentData[config.key];
    if (raw) {
      const parsed = JSON.parse(raw);
      themeData = { ...themeData, ...parsed };
      if (!themeData.layout) themeData.layout = { hero: 'default', cards: 'default' };
    }
  } catch (e) { console.error('Error parsing theme config', e); }

  const wrapper = document.createElement('div');
  wrapper.className = 'theme-editor';
  
  // --- Presets ---
  const presetGroup = document.createElement('div');
  presetGroup.className = 'form-group';
  presetGroup.style.background = 'var(--bg-input)';
  presetGroup.style.padding = '1rem';
  presetGroup.style.borderRadius = '8px';
  presetGroup.style.marginBottom = '2rem';
  presetGroup.innerHTML = `
    <label style="color: var(--primary-color); font-weight: bold;">Apply Template Preset</label>
    <div style="display: flex; gap: 1rem;">
      <select id="themePreset" style="flex: 1;">
        <option value="">Select a preset...</option>
        ${Object.entries(THEME_PRESETS).map(([key, preset]) => `<option value="${key}">${preset.name}</option>`).join('')}
      </select>
      <button type="button" class="btn-secondary" id="applyPresetBtn">Apply</button>
    </div>
    <small style="color: var(--text-muted);">Warning: This will overwrite current color settings.</small>
  `;
  wrapper.appendChild(presetGroup);

  // --- Layout Settings ---
  const layoutContainer = document.createElement('div');
  layoutContainer.style.display = 'grid';
  layoutContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
  layoutContainer.style.gap = '1.5rem';
  layoutContainer.style.marginBottom = '2rem';

  // Mode Selector
  const modeGroup = document.createElement('div');
  modeGroup.className = 'form-group';
  modeGroup.innerHTML = `
    <label>Theme Mode</label>
    <select id="themeMode">
      <option value="light" ${themeData.mode === 'light' ? 'selected' : ''}>Light</option>
      <option value="dark" ${themeData.mode === 'dark' ? 'selected' : ''}>Dark</option>
      <option value="system" ${themeData.mode === 'system' ? 'selected' : ''}>System Default</option>
    </select>
  `;
  layoutContainer.appendChild(modeGroup);

  // Hero Layout
  const heroLayoutGroup = document.createElement('div');
  heroLayoutGroup.className = 'form-group';
  heroLayoutGroup.innerHTML = `
    <label>Hero Layout</label>
    <select id="layoutHero">
      <option value="default" ${themeData.layout.hero === 'default' ? 'selected' : ''}>Default (Left Aligned)</option>
      <option value="center" ${themeData.layout.hero === 'center' ? 'selected' : ''}>Centered</option>
    </select>
  `;
  layoutContainer.appendChild(heroLayoutGroup);

  // Cards Layout
  const cardsLayoutGroup = document.createElement('div');
  cardsLayoutGroup.className = 'form-group';
  cardsLayoutGroup.innerHTML = `
    <label>Cards Layout</label>
    <select id="layoutCards">
      <option value="default" ${themeData.layout.cards === 'default' ? 'selected' : ''}>Grid (Default)</option>
      <option value="list" ${themeData.layout.cards === 'list' ? 'selected' : ''}>List View</option>
    </select>
  `;
  layoutContainer.appendChild(cardsLayoutGroup);

  wrapper.appendChild(layoutContainer);

  // --- Variable Groups ---
  const variableGroups = {
    'Colors': [
      { key: '--bg-body', label: 'Body Background' },
      { key: '--bg-card', label: 'Card Background' },
      { key: '--bg-nav', label: 'Nav Background' },
      { key: '--bg-inverse', label: 'Inverse Background' },
      { key: '--bg-secondary', label: 'Secondary Background' },
      { key: '--bg-gradient-start', label: 'Gradient Start' },
      { key: '--bg-gradient-end', label: 'Gradient End' }
    ],
    'Text': [
      { key: '--text-main', label: 'Main Text' },
      { key: '--text-muted', label: 'Muted Text' },
      { key: '--text-inverse', label: 'Inverse Text' },
      { key: '--text-secondary', label: 'Secondary Text' }
    ],
    'Brand': [
      { key: '--accent', label: 'Accent Color' },
      { key: '--accent-hover', label: 'Accent Hover' },
      { key: '--gradient-accent-end', label: 'Gradient End' }
    ],
    'UI Elements': [
      { key: '--border-color', label: 'Border Color' },
      { key: '--shadow-sm', label: 'Small Shadow' },
      { key: '--shadow-lg', label: 'Large Shadow' },
      { key: '--overlay-light', label: 'Light Overlay' },
      { key: '--border-overlay', label: 'Overlay Border' }
    ]
  };

  const varsContainer = document.createElement('div');
  varsContainer.style.display = 'grid';
  varsContainer.style.gap = '2rem';
  
  Object.entries(variableGroups).forEach(([groupTitle, vars]) => {
    const groupEl = document.createElement('div');
    groupEl.innerHTML = `<h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">${groupTitle}</h4>`;
    
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    grid.style.gap = '1rem';
    
    vars.forEach(v => {
      const field = document.createElement('div');
      field.className = 'form-group';
      const val = themeData.variables[v.key] || '';
      
      field.innerHTML = `
        <label style="font-size: 0.9rem">${v.label}</label>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <input type="color" value="${val}" style="width: 40px; height: 40px; padding: 0; border: none;" onchange="this.nextElementSibling.value = this.value; this.nextElementSibling.dispatchEvent(new Event('change'));">
          <input type="text" class="theme-var-input" id="var_${v.key.replace(/-/g, '_')}" data-key="${v.key}" value="${val}" style="flex: 1;">
        </div>
        <small style="color: var(--text-muted); font-size: 0.8rem">${v.key}</small>
      `;
      grid.appendChild(field);
    });
    
    groupEl.appendChild(grid);
    varsContainer.appendChild(groupEl);
  });

  wrapper.appendChild(varsContainer);
  container.appendChild(wrapper);

  // Preset Logic
  setTimeout(() => {
    document.getElementById('applyPresetBtn').onclick = () => {
      const presetKey = document.getElementById('themePreset').value;
      const preset = THEME_PRESETS[presetKey];
      if (!preset) return;

      if (confirm(`Apply ${preset.name}? This will overwrite current colors.`)) {
        document.getElementById('themeMode').value = preset.mode;
        
        Object.entries(preset.variables).forEach(([key, val]) => {
          const input = document.getElementById(`var_${key.replace(/-/g, '_')}`);
          if (input) {
            input.value = val;
            input.previousElementSibling.value = val; // Update color picker
          }
        });
      }
    };
  }, 0);
}

function renderForm(container, fields) {
  fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.textContent = field.label;
    group.appendChild(label);

    let input;
    const value = contentData[field.key] || '';

    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }
    
    input.id = `input_${field.key}`;
    input.value = typeof value === 'object' ? JSON.stringify(value) : value; // Handle edge cases
    
    if (field.help) {
      const help = document.createElement('small');
      help.style.color = 'var(--text-muted)';
      help.textContent = field.help;
      group.appendChild(help);
    }

    group.appendChild(input);
    container.appendChild(group);
  });
}

function renderListEditor(container, config) {
  const listKey = config.key;
  let listData = [];
  try {
    listData = JSON.parse(contentData[listKey] || '[]');
  } catch (e) {
    listData = [];
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'list-container';
  wrapper.id = `list_${listKey}`;

  // Add Button
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-secondary';
  addBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${config.itemTitle}`;
  addBtn.onclick = () => {
    listData.push({});
    renderListItems(wrapper, listData, config);
  };
  container.appendChild(addBtn);
  container.appendChild(wrapper);

  renderListItems(wrapper, listData, config);
  
  // Store reference to data for saving
  container.dataset.listKey = listKey;
  container.dataset.listData = JSON.stringify(listData);
}

function renderListItems(wrapper, listData, config) {
  wrapper.innerHTML = '';
  wrapper.parentElement.dataset.listData = JSON.stringify(listData); // Update stored data

  listData.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'list-item';
    
    const header = document.createElement('div');
    header.className = 'list-item-header';
    header.innerHTML = `<span>${config.itemTitle} #${index + 1}</span>`;
    
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    
    const upBtn = document.createElement('button');
    upBtn.className = 'btn-icon';
    upBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    upBtn.onclick = () => moveItem(listData, index, -1, wrapper, config);
    
    const downBtn = document.createElement('button');
    downBtn.className = 'btn-icon';
    downBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
    downBtn.onclick = () => moveItem(listData, index, 1, wrapper, config);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon btn-danger';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.onclick = () => {
      listData.splice(index, 1);
      renderListItems(wrapper, listData, config);
    };

    actions.append(upBtn, downBtn, delBtn);
    header.appendChild(actions);
    itemEl.appendChild(header);

    // Fields
    const fieldsGrid = document.createElement('div');
    fieldsGrid.style.display = 'flex';
    fieldsGrid.style.flexWrap = 'wrap';
    fieldsGrid.style.gap = '1rem';

    config.schema.forEach(schema => {
      const fieldGroup = document.createElement('div');
      fieldGroup.style.flex = `1 1 ${schema.width || '100%'}`;
      fieldGroup.style.minWidth = '200px';
      
      const label = document.createElement('label');
      label.textContent = schema.label;
      label.style.display = 'block';
      label.style.fontSize = '0.8rem';
      label.style.marginBottom = '0.25rem';
      
      let input;
      if (schema.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 2;
      } else {
        input = document.createElement('input');
        input.type = 'text';
      }
      
      input.value = item[schema.key] || '';
      input.onchange = (e) => {
        item[schema.key] = e.target.value;
        wrapper.parentElement.dataset.listData = JSON.stringify(listData);
      };
      
      input.style.width = '100%';
      input.style.padding = '0.5rem';
      input.style.background = 'var(--bg-input)';
      input.style.border = '1px solid var(--border-color)';
      input.style.borderRadius = '4px';
      input.style.color = 'white';

      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);
      fieldsGrid.appendChild(fieldGroup);
    });

    itemEl.appendChild(fieldsGrid);
    wrapper.appendChild(itemEl);
  });
}

function moveItem(list, index, direction, wrapper, config) {
  if (direction === -1 && index > 0) {
    [list[index], list[index - 1]] = [list[index - 1], list[index]];
  } else if (direction === 1 && index < list.length - 1) {
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
  }
  renderListItems(wrapper, list, config);
}

// --- Saving ---

async function saveCurrentSection() {
  const saveBtn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('saveStatus');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  try {
    const config = SECTIONS[currentSection];
    const token = await getCsrf();
    const updates = [];

    if (config.type === 'form') {
      config.fields.forEach(field => {
        const input = document.getElementById(`input_${field.key}`);
        if (input) {
          updates.push({ key: field.key, value: input.value });
        }
      });
    } else if (config.type === 'list') {
      const container = document.getElementById('editorArea');
      const listKey = container.dataset.listKey;
      const listData = container.dataset.listData;
      updates.push({ key: listKey, value: JSON.parse(listData) });
    } else if (config.type === 'theme-editor') {
      const mode = document.getElementById('themeMode').value;
      const layout = {
        hero: document.getElementById('layoutHero').value,
        cards: document.getElementById('layoutCards').value
      };
      const variables = {};
      document.querySelectorAll('.theme-var-input').forEach(input => {
        variables[input.dataset.key] = input.value;
      });
      
      updates.push({ 
        key: config.key, 
        value: { mode, layout, variables } 
      });
    } else if (config.type === 'layout-editor') {
      // Save Form Fields
      config.fields.forEach(field => {
        const input = document.getElementById(`input_${field.key}`);
        if (input) {
          updates.push({ key: field.key, value: input.value });
        }
      });
      
      // Save Section Order
      const order = [];
      document.querySelectorAll('#sectionOrderList .sortable-item').forEach(item => {
        order.push(item.dataset.section);
      });
      updates.push({ key: 'layout.order', value: JSON.stringify(order) });
    }

    // Process all updates
    for (const update of updates) {
      await fetch('/api/content/' + encodeURIComponent(update.key), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': token
        },
        body: JSON.stringify({ value: update.value })
      });
      // Update local cache
      contentData[update.key] = update.value;
    }

    statusEl.textContent = 'Saved successfully!';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Error saving changes';
    statusEl.style.color = 'var(--danger)';
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
  }
}

// --- System Pages ---

async function renderUserManagement(container) {
  container.innerHTML = `
    <div class="card">
      <h3>Add New User</h3>
      <form id="addUserForm">
        <div class="form-group">
          <label>Username</label>
          <input type="text" id="newUsername" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="newPassword" required>
        </div>
        <div class="form-group">
          <label>Role</label>
          <select id="newRole">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Create User</button>
      </form>
    </div>
    <div style="margin-top: 2rem">
      <h3>Existing Users</h3>
      <div id="usersList">Loading...</div>
    </div>
  `;

  document.getElementById('addUserForm').onsubmit = async (e) => {
    e.preventDefault();
    const token = await getCsrf();
    const payload = {
      username: document.getElementById('newUsername').value,
      password: document.getElementById('newPassword').value,
      role: document.getElementById('newRole').value
    };
    
    const r = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CSRF-Token': token },
      body: JSON.stringify(payload)
    });

    if (r.ok) {
      document.getElementById('addUserForm').reset();
      loadUsersList();
    } else {
      alert('Failed to create user');
    }
  };

  loadUsersList();
}

async function loadUsersList() {
  const r = await fetch('/api/admin/users');
  const users = await r.json();
  const list = document.getElementById('usersList');
  list.innerHTML = users.map(u => `
    <div class="list-item" style="margin-bottom: 0.5rem">
      <strong>${u.username}</strong> <span class="badge">${u.role}</span>
      <span style="float: right; color: var(--text-muted)">Created: ${new Date(u.created_at).toLocaleDateString()}</span>
    </div>
  `).join('');
}

async function renderAuditLogs(container) {
  container.innerHTML = '<h3>Recent Activity</h3><div id="logsList">Loading...</div>';
  const r = await fetch('/api/admin/logs');
  const logs = await r.json();
  const list = document.getElementById('logsList');
  list.innerHTML = logs.map(l => `
    <div class="list-item" style="margin-bottom: 0.5rem; font-size: 0.9rem">
      <span style="color: var(--primary-color)">${l.username}</span> 
      ${l.action} 
      <strong>${l.key || 'unknown'}</strong>
      <span style="float: right; color: var(--text-muted)">${new Date(l.created_at).toLocaleString()}</span>
    </div>
  `).join('');
}

// --- Utilities ---

async function getCsrf() {
  const r = await fetch('/api/auth/csrf');
  const j = await r.json();
  return j.token;
}

function openMediaModal(callback) {
  imageSelectorCallback = callback;
  document.getElementById('mediaModal').classList.remove('hidden');
  loadMediaImages();
}

function closeModal() {
  document.getElementById('mediaModal').classList.add('hidden');
  imageSelectorCallback = null;
}

async function uploadImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const status = document.getElementById('uploadStatus');
  status.textContent = 'Uploading...';
  
  const token = await getCsrf();
  const fd = new FormData();
  fd.append('image', file);
  
  const r = await fetch('/api/upload/image', {
    method: 'POST',
    headers: { 'CSRF-Token': token },
    body: fd
  });
  
  if (r.ok) {
    status.textContent = 'Done!';
    loadMediaImages();
  } else {
    status.textContent = 'Failed';
  }
}

// Mock function - in real app would need an API to list images
// For now, we'll just show the one we just uploaded if possible, 
// or simpler: just allow URL input in the main form.
// Since we don't have a "list images" API, we'll disable the gallery for now
// and just rely on the upload returning a URL.
async function loadMediaImages() {
  // To implement this, we'd need a new API endpoint GET /api/images
  // For now, let's skip the gallery grid and just handle uploads
}

// --- Layout Editor & DnD ---

function renderLayoutEditor(container, config) {
  // 1. Render Header/Footer Fields
  const formContainer = document.createElement('div');
  formContainer.innerHTML = '<h3 style="margin-bottom: 1rem;">Header & Footer Settings</h3>';
  renderForm(formContainer, config.fields);
  container.appendChild(formContainer);

  // 2. Render Drag & Drop Section Reordering
  const dndContainer = document.createElement('div');
  dndContainer.style.marginTop = '3rem';
  dndContainer.style.borderTop = '1px solid var(--border-color)';
  dndContainer.style.paddingTop = '2rem';
  
  dndContainer.innerHTML = `
    <h3 style="margin-bottom: 0.5rem;">Landing Page Layout</h3>
    <p style="color: var(--text-muted); margin-bottom: 1rem;">Drag and drop sections to reorder them on the main page.</p>
  `;
  
  const list = document.createElement('ul');
  list.id = 'sectionOrderList';
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.maxWidth = '600px';
  
  // Get current order or default
  let order = ['hero', 'services', 'work', 'portfolio', 'about', 'testimonials', 'contact'];
  try {
    if (contentData['layout.order']) {
      const parsed = JSON.parse(contentData['layout.order']);
      if (Array.isArray(parsed) && parsed.length > 0) order = parsed;
    }
  } catch (e) { console.error('Error parsing layout order', e); }

  order.forEach(section => {
    const li = document.createElement('li');
    li.className = 'sortable-item';
    li.draggable = true;
    li.dataset.section = section;
    li.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 500;">${section.charAt(0).toUpperCase() + section.slice(1)}</span>
        <i class="fas fa-grip-lines" style="color: var(--text-muted);"></i>
      </div>
    `;
    
    // Style
    li.style.padding = '1rem';
    li.style.marginBottom = '0.5rem';
    li.style.background = 'var(--bg-card)';
    li.style.border = '1px solid var(--border-color)';
    li.style.borderRadius = '6px';
    li.style.cursor = 'grab';
    li.style.transition = 'all 0.2s ease';
    
    // DnD Events
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('dragend', handleDragEnd);
    
    list.appendChild(li);
  });
  
  dndContainer.appendChild(list);
  container.appendChild(dndContainer);
}

// DnD Handlers
let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  this.style.opacity = '0.4';
  this.style.transform = 'scale(0.98)';
}

function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.style.border = '2px dashed var(--primary-color)';
}

function handleDragLeave(e) {
  this.style.border = '1px solid var(--border-color)';
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  this.style.transform = 'scale(1)';
  document.querySelectorAll('.sortable-item').forEach(item => {
    item.style.border = '1px solid var(--border-color)';
  });
}

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  
  if (dragSrcEl !== this) {
    const list = this.parentNode;
    const allItems = [...list.children];
    const srcIndex = allItems.indexOf(dragSrcEl);
    const targetIndex = allItems.indexOf(this);
    
    if (srcIndex < targetIndex) {
      list.insertBefore(dragSrcEl, this.nextSibling);
    } else {
      list.insertBefore(dragSrcEl, this);
    }
  }
  return false;
}

// Start
init();