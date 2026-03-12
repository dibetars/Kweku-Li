async function getCsrf() {
  const r = await fetch('/api/auth/csrf')
  if (!r.ok) {
    console.error('CSRF fetch failed:', r.status, r.statusText)
    try {
      const text = await r.text()
      console.error('Response body:', text)
    } catch (e) {
      console.error('Could not read response text')
    }
    throw new Error(`Failed to fetch CSRF token: ${r.status}`)
  }
  const j = await r.json()
  return j.token
}
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const token = await getCsrf()
  const form = e.target
  const payload = { username: form.username.value, password: form.password.value }
  const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'CSRF-Token': token }, body: JSON.stringify(payload) })
  
  // Handle non-JSON responses (e.g. 403 HTML from server)
  if (!r.ok) {
    try {
      const j = await r.json()
      document.getElementById('loginError').textContent = j.error || 'Login failed'
    } catch (e) {
      console.error('Login failed with non-JSON response:', r.status)
      const text = await r.text()
      console.error(text)
      document.getElementById('loginError').textContent = `Server Error (${r.status}). Check console.`
    }
    return
  }
  
  const j = await r.json()
  location.href = '/admin/dashboard.html'
})
