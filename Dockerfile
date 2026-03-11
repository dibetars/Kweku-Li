# Use Node.js LTS (Long Term Support)
FROM node:20-alpine

# Install build dependencies for native modules (sqlite3)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create data and uploads directories with correct permissions
RUN mkdir -p data uploads && chown -R node:node data uploads

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
