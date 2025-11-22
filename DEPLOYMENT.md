# Deployment Guide for Valdosta Medicine

This guide covers multiple hosting options for deploying your application.

## 📋 Table of Contents
1. [Option 1: Render.com (Recommended - Free Tier)](#option-1-rendercom)
2. [Option 2: Railway.app (Simple & Fast)](#option-2-railwayapp)
3. [Option 3: Vercel + Railway (Best Performance)](#option-3-vercel--railway)
4. [Option 4: DigitalOcean/VPS (Full Control)](#option-4-digitaloceanvps)
5. [Option 5: Docker Deployment](#option-5-docker)

---

## Option 1: Render.com (Recommended - Free Tier)

**Best for:** Quick deployment, free hosting for small projects

### Steps:

1. **Push your code to GitHub**
   ```bash
   # Already done! Your code is on the branch
   ```

2. **Sign up at [Render.com](https://render.com)**

3. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the branch: `claude/employee-management-admin-01WacUd9V15UzDgUvQix5wWz`
   - Configure:
     - **Name:** valdosta-medicine-backend
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment Variables:**
       - `JWT_SECRET`: (generate a random string)
       - `NODE_ENV`: `production`
       - `PORT`: `10000`
   - Click "Create Web Service"

4. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name:** valdosta-medicine-frontend
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
     - **Environment Variable:**
       - `VITE_API_URL`: `https://valdosta-medicine-backend.onrender.com/api`
   - Click "Create Static Site"

5. **Initialize Database:**
   - Go to your backend service
   - Click "Shell" tab
   - Run: `npm run seed`

**Your app will be live at:** `https://valdosta-medicine-frontend.onrender.com`

---

## Option 2: Railway.app (Simple & Fast)

**Best for:** Even simpler deployment with automatic HTTPS

### Steps:

1. **Sign up at [Railway.app](https://railway.app)**

2. **Deploy Backend:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js
   - Add environment variables:
     - `JWT_SECRET`: (random string)
     - `NODE_ENV`: production
   - Click "Deploy"

3. **Deploy Frontend:**
   - In the same project, click "New Service"
   - Select the same GitHub repo
   - Set root directory to `frontend`
   - Add environment variable:
     - `VITE_API_URL`: (your backend Railway URL)/api
   - Deploy

4. **Generate domains:**
   - Click on each service
   - Go to "Settings" → "Generate Domain"

---

## Option 3: Vercel + Railway (Best Performance)

**Best for:** Production apps with high traffic

### Backend on Railway:
Follow Option 2 for backend deployment

### Frontend on Vercel:

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import your repository:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory:** `frontend`
     - **Framework Preset:** Vite
     - **Environment Variables:**
       - `VITE_API_URL`: (your Railway backend URL)/api

3. **Deploy:**
   - Click "Deploy"
   - Your app will be live at a `.vercel.app` domain

---

## Option 4: DigitalOcean/VPS (Full Control)

**Best for:** Production apps requiring full server control

### Requirements:
- Ubuntu 20.04+ VPS
- Domain name (optional)

### Steps:

1. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone your repository:**
   ```bash
   git clone https://github.com/EastonCC/Hackathon2025.git
   cd Hackathon2025
   git checkout claude/employee-management-admin-01WacUd9V15UzDgUvQix5wWz
   ```

4. **Setup Backend:**
   ```bash
   cd backend
   npm install

   # Create production .env
   cat > .env << EOF
   PORT=3000
   JWT_SECRET=$(openssl rand -base64 32)
   NODE_ENV=production
   FRONTEND_URL=http://your-domain.com
   EOF

   npm run seed
   pm2 start server.js --name valdosta-backend
   pm2 save
   pm2 startup
   ```

5. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install

   # Create production .env
   echo "VITE_API_URL=http://your-server-ip:3000/api" > .env.production

   npm run build
   ```

6. **Install Nginx:**
   ```bash
   sudo apt install nginx
   ```

7. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/valdosta-medicine
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /root/Hackathon2025/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable and start Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/valdosta-medicine /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL (Optional but recommended):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Option 5: Docker Deployment

**Best for:** Containerized deployments, easy scaling

### Create Dockerfile for Backend:

```bash
cd backend
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF
```

### Create Dockerfile for Frontend:

```bash
cd ../frontend
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
```

### Create docker-compose.yml:

```bash
cd ..
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - JWT_SECRET=your-secret-here
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost
    volumes:
      - ./backend/database.sqlite:/app/database.sqlite

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:3000/api
    ports:
      - "80:80"
    depends_on:
      - backend
EOF
```

### Deploy:
```bash
docker-compose up -d
```

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Review CORS settings
- [ ] Change default admin password
- [ ] Set up database backups
- [ ] Add rate limiting
- [ ] Enable logging and monitoring

---

## 🎯 Quick Start Recommendation

**For beginners:** Use **Option 1 (Render.com)** - It's free and easiest to set up.

**For production:** Use **Option 3 (Vercel + Railway)** - Best performance and reliability.

**For learning:** Use **Option 5 (Docker)** - Great for understanding containerization.

---

## 📞 Support

If you encounter issues during deployment:

1. Check the logs in your hosting platform
2. Verify environment variables are set correctly
3. Ensure database is seeded with initial data
4. Check CORS settings if frontend can't connect to backend

---

## 🚀 Post-Deployment

After deployment:

1. Test all features (login, create tasks, manage employees)
2. Change the default admin password
3. Set up monitoring (optional: UptimeRobot, StatusCake)
4. Configure backups for the database
5. Add your custom domain (if applicable)

Good luck with your deployment! 🎉
