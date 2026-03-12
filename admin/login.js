async function getCsrf() {
  try {
    const r = await fetch('/api/auth/csrf');
    if (!r.ok) {
      console.error('CSRF fetch failed:', r.status, r.statusText);
      throw new Error(`Failed to fetch CSRF token: ${r.status}`);
    }
    const contentType = r.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await r.text();
      console.error('Expected JSON but got:', text);
      throw new Error('Invalid response type from server');
    }
    const j = await r.json();
    return j.token;
  } catch (e) {
    console.error('CSRF Error:', e);
    throw e;
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';
  
  try {
    const token = await getCsrf();
    const form = e.target;
    const payload = { username: form.username.value, password: form.password.value };
    
    const r = await fetch('/api/auth/login', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'CSRF-Token': token 
      }, 
      body: JSON.stringify(payload) 
    });
    
    const contentType = r.headers.get('content-type');
    
    if (!r.ok) {
      if (contentType && contentType.includes('application/json')) {
        const j = await r.json();
        errorEl.textContent = j.error || 'Login failed';
      } else {
        const text = await r.text();
        console.error('Login failed with non-JSON response:', r.status, text);
        errorEl.textContent = `Server Error (${r.status}). Check console.`;
      }
      return;
    }
    
    if (contentType && contentType.includes('application/json')) {
      const j = await r.json();
      if (j.ok) {
        location.href = '/admin/dashboard.html';
      } else {
        errorEl.textContent = 'Login failed';
      }
    } else {
      console.error('Login success but invalid response type');
      errorEl.textContent = 'Invalid server response';
    }
    
  } catch (err) {
    console.error('Login Process Error:', err);
    errorEl.textContent = 'An unexpected error occurred. Please try again.';
  }
});
