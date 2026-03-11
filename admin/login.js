async function getCsrf() {
  const r = await fetch('/api/auth/csrf')
  const j = await r.json()
  return j.token
}
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const token = await getCsrf()
  const form = e.target
  const payload = { username: form.username.value, password: form.password.value }
  const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'CSRF-Token': token }, body: JSON.stringify(payload) })
  const j = await r.json()
  if (!r.ok) {
    document.getElementById('loginError').textContent = j.error || 'Login failed'
    return
  }
  location.href = '/admin/dashboard.html'
})
