import express from 'express'
import session from 'express-session'
import cookieSession from 'cookie-session'
import connectSqlite3 from 'connect-sqlite3'
import bcrypt from 'bcrypt'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import csurf from 'csurf'
import path from 'path'
import fs from 'fs'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { getDb, initDb } from './db.js'

const app = express()

// Security Headers (Helmet)
// Note: We need to configure CSP to allow external scripts (FontAwesome) and inline scripts (theme.js)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      upgradeInsecureRequests: [], // Disable for localhost dev
    },
  },
}))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login attempts per hour
  message: { error: 'Too many login attempts, please try again later.' }
})
app.use('/api/auth/login', authLimiter)

// Trust proxy is required for secure cookies behind a reverse proxy (Coolify/Traefik/Vercel)
app.set('trust proxy', 1)

const SQLiteStore = connectSqlite3(session)
const isVercel = process.env.VERCEL === '1'

const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data')
const uploadDir = isVercel ? '/tmp/uploads' : path.join(process.cwd(), 'uploads')

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

// Initialize Database
const db = getDb()

// Initial Content Seed
const SEED_CONTENT = {
  'hero.subtitle': 'Visual Storyteller & Creative Strategist',
  'hero.title': JSON.stringify({ text: 'I help brands tell <span class="italic-text">stories</span> that make customers fall in <span class="italic-text">love</span>' }),
  'hero.description': 'A multifaceted creative professional bridging photography, copywriting, marketing strategy, and visual communication. From capturing Black cosplay culture to launching independent artists to mainstream success, I create work that matters.',
  
  'services.list': JSON.stringify([
    { icon: '📸', title: 'Photography & Visual Communication', description: 'Commercial photography specializing in portraiture, fashion, and cultural documentation. Master\'s degree in Visual Communication from Ohio University with a focus on representation and storytelling.' },
    { icon: '✍️', title: 'Copywriting & Content Creation', description: 'Web copy, video scripts, journalism, and creative writing that converts. Crafting compelling narratives for brands from tech startups to luxury real estate with published work in major outlets.' },
    { icon: '📈', title: 'Marketing Strategy & Campaign Execution', description: 'Full-service marketing campaigns that generate organic trends and sustained engagement. Proven track record of launching independent artists and growing brand visibility on limited budgets.' },
    { icon: '🎤', title: 'Spoken Word & Visual Storytelling', description: 'The Li Chronicles: Combining spoken word poetry with photography and videography. Creating work at the intersection of art, culture, and social commentary under the moniker "Li" / "The Beast".' },
    { icon: '🎨', title: 'Creative Direction & Art Direction', description: 'End-to-end creative direction for brands, artists, and cultural projects. From concept development to final execution across multiple mediums including video, photography, and digital content.' },
    { icon: '🎭', title: 'Cultural Projects & Representation', description: 'AfrOtakus project documenting Black cosplay culture, exploring identity and representation in anime fandom. Work exhibited in galleries and featured in academic contexts.' }
  ]),

  'work.list': JSON.stringify([
    { 
      icon: '🎵', 
      tag: 'Marketing Campaign', 
      title: 'Greetings From Abroad', 
      description: 'Marketing campaign for independent hip-hop artist\'s sophomore EP addressing Ghanaian youth seeking opportunities abroad. Artist was physically in the U.S. during entire campaign.',
      stats: JSON.stringify([
        { number: '21.7K', label: 'First Week Streams' },
        { number: '#1', label: 'Organic Twitter Trend' },
        { number: '2 Months', label: 'Sustained Relevance' },
        { number: '5+', label: 'Major Publications' }
      ])
    },
    { 
      icon: '🎤', 
      tag: 'Album Launch', 
      title: '5Foot3 Debut EP', 
      description: 'Launch campaign for unknown artist\'s debut project addressing mental health and socio-cultural issues. Created safe spaces for conversations while artist pursued PhD in U.S.',
      stats: JSON.stringify([
        { number: '2x', label: 'Organic Twitter Trends' },
        { number: '10K', label: 'First Month Streams' },
        { number: '3 Months', label: 'Continued Relevance' },
        { number: '1', label: 'Merchandising Deal' }
      ])
    },
    { 
      icon: '🎭', 
      tag: 'Cultural Project', 
      title: 'AfrOtakus: Black People & Cosplay', 
      description: 'Photographic documentation of Black cosplay culture exploring identity, representation, and cultural appreciation in Japanese anime fandom. Master\'s thesis project turned cultural movement.',
      stats: JSON.stringify([
        { number: 'Gallery', label: 'Exhibition in Athens, OH' },
        { number: 'Video', label: 'Documentary Interview' },
        { number: 'Fashion', label: 'Creative Ads Produced' },
        { number: 'Anime North', label: '2024 Coverage' }
      ])
    }
  ]),

  'portfolio.list': JSON.stringify([
    { icon: '🌐', title: 'Web Copywriting', description: 'Hubject (eRoaming), PayPlux (Crypto), Bewsys (ICT), BS Holding, UrbanPlug (Solar), Irrigation Hub - Complete information architecture and copy for 7+ websites' },
    { icon: '🎬', title: 'Video Copywriting', description: 'Tekura (Furniture), FanMilk SuperYogo (Father\'s Day), Goldkey (Founder\'s Day) - Poetic scripts combining brand storytelling with cultural commentary' },
    { icon: '📰', title: 'Journalism', description: '25+ articles for Ohio University covering arts, culture, sports, and academia. Features in Dallas Morning News, MyJoyOnline, VARIANT Magazine' },
    { icon: '📸', title: 'Photography', description: 'Portraiture, Still Life, and Cosplay photography. Specializing in candid storytelling and cultural documentation with technical mastery' },
    { icon: '🚀', title: 'Marketing Campaigns', description: 'QodeHub Internship (500+ video views unpaid), SASA Urban Lights (organic Twitter trend), multiple music releases with sustained 2-3 month relevance' },
    { icon: '🎤', title: 'The Li Chronicles', description: 'Spoken word poetry, visual storytelling, and sonic narratives. "The cadence of a rapper. The delivery of a warrior. And a message rooted in spoken word poetry."' }
  ]),

  'about.intro': 'Hi! I\'m Kweku Diaw. I have a way with words that translates into images that interest brands and businesses. I help customers fall in love with brands and their products.',
  'about.professional': 'A multifaceted visual communicator, music journalist, and digital strategist with a Master\'s degree in Visual Communication from Ohio University, specializing in commercial photography. My work spans copywriting, photography, marketing strategy, and journalism - always with a focus on storytelling that drives results.',
  'about.artist': 'Unlike those who tell their stories through song and rap, I deliver my message through the aesthetic art of Spoken Word & Poetry. I\'m a faith-based, eclectic individual who dreams that words will one day break through to the core of humanity and revive a dying breed of individuals to be more human.',
  'about.philosophy': '"Everyone is searching, except the pilot in airplane mode." - I believe in intentional disconnection from noise to find clarity. My work explores identity, representation, and cultural appreciation, amplifying narratives often overlooked in mainstream visual media.',
  'about.mission': 'I\'m driven by a desire to document underrepresented artistic movements and create work at the intersection of visual communication and storytelling. Whether it\'s Black cosplay culture, independent music, or brand narratives - I believe in making the invisible visible.',
  
  'testimonials.list': JSON.stringify([
    { text: 'We saw a 200% increase in Sales Qualified Leads from our collaboration. Kweku\'s strategic approach combined with creative execution delivered results beyond our expectations.', author: 'Digital Marketing Client' },
    { text: 'The album campaign was a game-changer. Despite being physically absent during the release, we trended organically twice and maintained relevance for 3 months. That\'s unheard of for independent artists.', author: 'Koo Kusi, Recording Artist' },
    { text: 'Kweku doesn\'t just write copy - he crafts experiences. The website copy he created for our brand perfectly captured our mission and dramatically improved our conversion rates.', author: 'Tech Startup Founder' }
  ]),

  'contact.email': 'kwekuk.diaw@gmail.com',
  'contact.phone': '+1 (704) 707-5226',
  'contact.location': 'Accra, Greater Accra, Ghana / Athens, Ohio, USA',
  'footer.quote': '"Everyone is searching, except the pilot in airplane mode."',
  
  'social.linkedin': 'https://www.linkedin.com/in/kweku-li-diaw/',
  'social.instagram': 'https://instagram.com/cue_li',
  'social.twitter': 'https://x.com/cue_li_beast',
  'social.youtube': 'https://www.youtube.com/channel/UCFOma1eGE_4ECagsg7B-ZJw',
  'social.tiktok': 'https://tiktok.com/@cuelibeast',
  'social.soundcloud': 'https://soundcloud.com/beast_li',
  
  'theme.config': JSON.stringify({
    mode: 'light',
    variables: {
      '--bg-body': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-nav': 'rgba(255, 255, 255, 0.95)',
      '--bg-gradient-start': '#ffffff',
      '--bg-gradient-end': '#f5f5f5',
      '--bg-inverse': '#0a0a0a',
      '--text-main': '#0a0a0a',
      '--text-muted': '#666666',
      '--text-inverse': '#ffffff',
      '--accent': '#6c3baa',
      '--accent-hover': '#341539',
      '--gradient-accent-end': '#ff8555',
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--border-light': 'rgba(0, 0, 0, 0.05)',
      '--shadow-sm': '0 4px 20px rgba(0, 0, 0, 0.08)',
      '--shadow-lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
      '--overlay-light': 'rgba(255, 255, 255, 0.05)',
      '--border-overlay': 'rgba(255, 255, 255, 0.1)',
      '--text-overlay-main': 'rgba(255, 255, 255, 0.9)',
      '--text-overlay-muted': 'rgba(255, 255, 255, 0.6)'
    }
  })
}

// Initialize Database Schema and Seed Data
initDb(SEED_CONTENT, bcrypt)

app.use(express.json())

if (isVercel) {
  // Use cookie-session for Vercel (stateless, stores session in cookie)
  app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'dev-secret-key-1', process.env.SESSION_SECRET_2 || 'dev-secret-key-2'],
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
    secure: true, // Vercel is always HTTPS
    sameSite: 'lax',
    httpOnly: true
  }))
} else {
  // Use SQLite store for local dev
  app.use(session({
    store: new SQLiteStore({ dir: dataDir, db: 'sessions.sqlite' }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 4
    }
  }))
}

// CSRF Protection (works with both session types)
// For cookie-session, csurf uses req.session by default
const csrfProtection = csurf()
const sseClients = new Set()

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next()
  res.status(401).json({ error: 'unauthorized' })
}

function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.session.user
    if (user && roles.includes(user.role)) return next()
    res.status(403).json({ error: 'forbidden' })
  }
}

app.get('/setup', (req, res) => {
  db.get('SELECT COUNT(*) as c FROM users', (err, row) => {
    if (err) return res.status(500).send('error')
    if (row.c > 0) return res.status(403).send('already initialized')
    res.sendFile(path.join(process.cwd(), 'server', 'views', 'setup.html'))
  })
})

app.post('/setup', express.urlencoded({ extended: true }), (req, res) => {
  db.get('SELECT COUNT(*) as c FROM users', async (err, row) => {
    if (err) return res.status(500).send('error')
    if (row.c > 0) return res.status(403).send('already initialized')
    const { username, password } = req.body
    if (!username || !password) return res.status(400).send('invalid')
    const hash = await bcrypt.hash(password, 12)
    const now = new Date().toISOString()
    db.run('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)', [username, hash, 'admin', now], function (e) {
      if (e) return res.status(500).send('error')
      res.redirect('/admin/login.html')
    })
  })
})

app.get('/api/auth/csrf', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() })
})

app.post('/api/auth/login', csrfProtection, (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'invalid' })
  db.get('SELECT id, username, password_hash, role FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'error' })
    if (!row) return res.status(401).json({ error: 'invalid' })
    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid' })
  if (isVercel) {
    // cookie-session exposes req.session as the object directly
    req.session.user = { id: row.id, username: row.username, role: row.role }
  } else {
    req.session.user = { id: row.id, username: row.username, role: row.role }
  }
    res.json({ ok: true, user: req.session.user })
  })
})

app.post('/api/auth/logout', requireAuth, (req, res) => {
  if (isVercel) {
    req.session = null // cookie-session way to destroy
    res.json({ ok: true })
  } else {
    req.session.destroy(() => {
      res.json({ ok: true })
    })
  }
})

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.session.user || null })
})

app.get('/api/content', (req, res) => {
  db.all('SELECT key, value FROM content', (err, rows) => {
    if (err) return res.status(500).json({ error: 'error' })
    const map = {}
    rows.forEach(r => { map[r.key] = r.value })
    res.json(map)
  })
})

app.get('/api/content/:key', (req, res) => {
  db.get('SELECT key, value FROM content WHERE key = ?', [req.params.key], (err, row) => {
    if (err) return res.status(500).json({ error: 'error' })
    if (!row) return res.status(404).json({ error: 'not_found' })
    res.json({ key: row.key, value: row.value })
  })
})

app.put('/api/content/:key', requireAuth, requireRole('admin', 'editor'), csrfProtection, (req, res) => {
  const key = req.params.key
  const value = typeof req.body.value === 'string' ? req.body.value : JSON.stringify(req.body.value)
  db.get('SELECT value FROM content WHERE key = ?', [key], (err, row) => {
    if (err) return res.status(500).json({ error: 'error' })
    const before = row ? row.value : null
    const now = new Date().toISOString()
    db.run('INSERT INTO content(key, value, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_by=excluded.updated_by, updated_at=excluded.updated_at', [key, value, req.session.user.id, now], function (e) {
      if (e) return res.status(500).json({ error: 'error' })
      db.run('INSERT INTO audit_logs(user_id, action, key, before, after, created_at, ip) VALUES(?, ?, ?, ?, ?, ?, ?)', [req.session.user.id, before ? 'update' : 'create', key, before, value, now, req.ip || ''], () => {})
      const payload = `data: ${JSON.stringify({ key, value })}\n\n`
      sseClients.forEach(res => res.write(payload))
      res.json({ ok: true })
    })
  })
})

app.get('/api/admin/logs', requireAuth, requireRole('admin'), (req, res) => {
  db.all('SELECT a.created_at, a.action, a.key, u.username FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT 100', (err, rows) => {
    if (err) return res.status(500).json({ error: 'error' })
    res.json(rows)
  })
})

app.get('/api/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  db.all('SELECT id, username, role, created_at FROM users ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'error' })
    res.json(rows)
  })
})

app.post('/api/admin/users', requireAuth, requireRole('admin'), csrfProtection, (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password || !role) return res.status(400).json({ error: 'invalid' })
  bcrypt.hash(password, 12).then(hash => {
    const now = new Date().toISOString()
    db.run('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)', [username, hash, role, now], function (e) {
      if (e) return res.status(500).json({ error: 'error' })
      res.json({ ok: true, id: this.lastID })
    })
  })
})

app.post('/api/admin/users/password', requireAuth, requireRole('admin'), csrfProtection, (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'invalid' })
  bcrypt.hash(password, 12).then(hash => {
    db.run('UPDATE users SET password_hash = ? WHERE username = ?', [hash, username], function (e) {
      if (e) return res.status(500).json({ error: 'error' })
      if (this.changes === 0) return res.status(404).json({ error: 'not_found' })
      res.json({ ok: true })
    })
  })
})

const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('unsupported'))
  }
})

app.post('/api/upload/image', requireAuth, requireRole('admin', 'editor'), csrfProtection, upload.single('image'), (req, res) => {
  const ext = path.extname(req.file.originalname).toLowerCase()
  const id = uuidv4().replace(/-/g, '')
  const filename = `${id}${ext}`
  const target = path.join(uploadDir, filename)
  fs.renameSync(req.file.path, target)
  res.json({ url: `/uploads/${filename}` })
})

app.get('/events/content', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.flushHeaders()
  res.write('retry: 1000\n\n')
  sseClients.add(res)
  req.on('close', () => {
    sseClients.delete(res)
  })
})

app.use('/uploads', express.static(uploadDir))
app.get('/admin/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'admin', 'dashboard.html'))
})
app.use('/admin', express.static(path.join(process.cwd(), 'admin')))
app.use(express.static(process.cwd()))

if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 8000
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

export default app