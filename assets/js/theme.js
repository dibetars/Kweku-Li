(function() {
  const CACHE_KEY = 'kweku_li_theme';

  function applyTheme(themeData) {
    if (!themeData) return;
    
    // Apply Mode & Variables (Root is available in head)
    if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', themeData.mode);
        if (themeData.variables) {
            Object.entries(themeData.variables).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
        }
    }

    // Apply Layouts (requires body)
    const applyLayouts = () => {
        if (themeData.layout) {
          const body = document.body;
          if (!body) return;
          
          // Remove existing layout classes
          Array.from(body.classList).forEach(cls => {
            if (cls.startsWith('layout-')) body.classList.remove(cls);
          });
          
          // Add new layout classes
          if (themeData.layout.hero) body.classList.add(`layout-hero-${themeData.layout.hero}`);
          if (themeData.layout.cards) body.classList.add(`layout-cards-${themeData.layout.cards}`);
        }
    };

    if (document.body) {
        applyLayouts();
    } else {
        document.addEventListener('DOMContentLoaded', applyLayouts);
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

  // Apply Section Reordering
  const applyReordering = (data) => {
      if (data.value) {
        let order;
        try {
          order = JSON.parse(data.value);
        } catch (e) {
          console.error('Invalid layout order JSON', e);
          return;
        }
        
        const sections = {};
        order.forEach(id => {
          const el = document.getElementById(id);
          if (el) sections[id] = el;
        });

        const footer = document.querySelector('footer');
        
        if (footer) {
             order.forEach(id => {
                 const el = sections[id];
                 if (el) {
                     footer.parentNode.insertBefore(el, footer);
                 }
             });
        }
      }
  };

  fetch('/api/content/layout.order')
    .then(r => r.json())
    .then(data => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => applyReordering(data));
        } else {
            applyReordering(data);
        }
    })
    .catch(e => console.error('Error fetching layout order', e));
})();