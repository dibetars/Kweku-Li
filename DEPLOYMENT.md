# Kweku Portfolio - Production Deployment Guide

## Application Overview
- **Frontend**: Static HTML/CSS/JS with dynamic content loading via Server-Sent Events
- **Backend**: Node.js Express server with SQLite database
- **Authentication**: Session-based with bcrypt password hashing
- **Content Management**: RESTful API with role-based access control
- **File Uploads**: Image uploads with MIME type validation

## Prerequisites
- Node.js 20.x or higher
- npm or pnpm package manager
- 512MB+ RAM recommended
- 100MB+ disk space for dependencies and uploads

## Environment Variables
```bash
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret-min-32-chars
PORT=8080
```

## Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd kweku-portfolio
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret-min-32-chars
PORT=8080
```

### 3. Initial Admin Setup
Visit `/setup` to create the first admin user (only available when no users exist).

### 4. Start the Application
```bash
npm start
```

## Security Features
- **Password Hashing**: bcrypt with cost factor 12
- **CSRF Protection**: All state-changing operations require valid CSRF tokens
- **Session Security**: httpOnly, sameSite cookies; secure in production
- **Role-Based Access**: Admin/Editor roles with granular permissions
- **Audit Logging**: All content changes are logged with user and timestamp
- **File Upload Validation**: Only image files (MIME type check)

## Content Management
- Access admin dashboard at `/admin/login.html`
- Real-time content updates via Server-Sent Events
- Support for text and image content
- Audit trail for all modifications

## API Endpoints
- `GET /api/content` - Retrieve all content
- `PUT /api/content/:key` - Update content (requires auth)
- `POST /api/upload/image` - Upload image (requires auth)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/admin/users` - List users (admin only)
- `POST /api/admin/users` - Create user (admin only)

## File Structure
```
├── assets/           # Static assets (CSS, JS, images)
├── admin/            # Admin dashboard files
├── server/           # Node.js backend
├── data/             # SQLite database files
├── uploads/          # Uploaded images
├── package.json      # Dependencies
└── server/index.js   # Main server file
```

## Production Considerations

### Security
- Change default session secret
- Use HTTPS in production
- Set secure cookie flag
- Implement rate limiting for auth endpoints
- Regular security updates

### Performance
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Monitor database performance

### Monitoring
- Set up application logging
- Monitor error rates
- Track user activity
- Set up health checks

## Troubleshooting
- **Port conflicts**: Change PORT in environment variables
- **Database errors**: Check file permissions in `/data` directory
- **Upload failures**: Verify `/uploads` directory exists and is writable
- **CSRF errors**: Ensure CSRF token is included in requests

## Deployment Options
- **VPS/Dedicated Server**: Full control, manual setup
- **Docker**: Containerized deployment
- **Platform-as-a-Service**: Heroku, Railway, etc.

Remember to test thoroughly in a staging environment before deploying to production.