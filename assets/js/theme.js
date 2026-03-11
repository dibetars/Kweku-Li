(function() {
  const CACHE_KEY = 'kweku_li_theme';

  function applyTheme(themeData) {
    if (!themeData) return;
    
    // Apply Mode
    document.documentElement.setAttribute('data-theme', themeData.mode);
    
    // Apply Variables
    const root = document.documentElement;
    if (themeData.variables) {
      Object.entries(themeData.variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Apply Layouts
    if (themeData.layout) {
      const body = document.body;
      // Remove existing layout classes
      body.classList.forEach(cls => {
        if (cls.startsWith('layout-')) body.classList.remove(cls);
      });
      
      // Add new layout classes
      if (themeData.layout.hero) body.classList.add(`layout-hero-${themeData.layout.hero}`);
      if (themeData.layout.cards) body.classList.add(`layout-cards-${themeData.layout.cards}`);
    }
  }

  // Load from Cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      applyTheme(JSON.parse(cached));
    }
  } catch (e) { console.error('Error loading cached theme', e); }

  // Fetch latest from API
  fetch('/api/content/theme.config')
    .then(r => r.json())
    .then(data => {
      if (data.value) {
        const themeData = JSON.parse(data.value);
        applyTheme(themeData);
        localStorage.setItem(CACHE_KEY, data.value);
      }
    })
    .catch(e => console.error('Error fetching theme', e));
})();
