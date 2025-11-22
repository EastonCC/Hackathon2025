# Quick Deployment Guide

Choose the method that works best for you:

---

## 🚀 Method 1: Docker (Local or Any Server) - EASIEST

**Prerequisites:** Docker and Docker Compose installed

### Step 1: Clone and Navigate
```bash
git clone https://github.com/EastonCC/Hackathon2025.git
cd Hackathon2025
git checkout claude/employee-management-admin-01WacUd9V15UzDgUvQix5wWz
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Initialize Database
```bash
docker exec -it valdosta-backend npm run seed
```

### Step 4: Access Your App
- Frontend: http://localhost
- Backend API: http://localhost:3000

**That's it!** 🎉

To stop:
```bash
docker-compose down
```

---

## 🌐 Method 2: Render.com (Free Cloud Hosting)

### Option A: Using render.yaml (Automatic)

1. **Fork/Push this repo to your GitHub**

2. **Go to [render.com](https://render.com) and sign up**

3. **Click "New +" → "Blueprint"**

4. **Connect your GitHub repository**

5. **Render will automatically detect render.yaml and deploy both services**

6. **After deployment, seed the database:**
   - Go to your backend service
   - Click "Shell" tab
   - Run: `npm run seed`

### Option B: Manual Setup (More Control)

#### Deploy Backend:
1. Click "New +" → "Web Service"
2. Connect GitHub repo
3. Configure:
   - **Name:** valdosta-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (click "Generate" for random value)
   - `PORT` = `10000`
5. Click "Create Web Service"
6. After deployment, open Shell and run: `npm run seed`

#### Deploy Frontend:
1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Configure:
   - **Name:** valdosta-frontend
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://valdosta-backend.onrender.com/api`
   (Replace with your actual backend URL from step 1)
5. Click "Create Static Site"

**Done!** Your app is live at the frontend URL.

---

## ⚡ Method 3: Railway.app (Fastest)

### Step 1: Deploy Backend
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables":
   - `JWT_SECRET` = (any random string)
   - `NODE_ENV` = `production`
6. Click "Settings" → "Change root directory" → Enter `backend`
7. Click "Generate Domain"
8. Copy the domain URL

### Step 2: Deploy Frontend
1. In the same project, click "New"
2. Select "GitHub Repo" → Same repository
3. Click "Add variables":
   - `VITE_API_URL` = `https://your-backend-url-from-step1.railway.app/api`
4. Click "Settings":
   - "Change root directory" → Enter `frontend`
   - "Change build command" → Enter `npm install && npm run build`
   - "Change start command" → Enter `npx serve dist`
5. Click "Generate Domain"

### Step 3: Seed Database
1. Click on backend service
2. Go to "Deployments"
3. Click latest deployment → "View Logs"
4. Click "Shell" or use the command:
   ```bash
   npm run seed
   ```

**Live!** Open your frontend Railway URL.

---

## 💻 Method 4: Any VPS (DigitalOcean, Linode, AWS, etc.)

### Prerequisites:
- Ubuntu 20.04+ server
- SSH access
- Domain (optional)

### Quick Setup Script:
```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/EastonCC/Hackathon2025.git
cd Hackathon2025
git checkout claude/employee-management-admin-01WacUd9V15UzDgUvQix5wWz

# Setup backend
cd backend
npm install
echo "PORT=3000
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production" > .env
npm run seed
pm2 start server.js --name valdosta-backend
pm2 save
pm2 startup

# Setup frontend
cd ../frontend
npm install
echo "VITE_API_URL=http://your-server-ip:3000/api" > .env.production
npm run build

# Install and configure Nginx
cd ..
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/valdosta << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /root/Hackathon2025/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/valdosta /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "Access your app at: http://your-server-ip"
```

---

## 🔧 Troubleshooting

### Docker Issues:
```bash
# Check if containers are running
docker ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Rebuild from scratch
docker-compose down
docker-compose up --build -d
```

### Render/Railway Issues:
- Check build logs in the dashboard
- Verify environment variables are set correctly
- Make sure root directory is set to `backend` or `frontend`
- Ensure the backend URL in frontend env is correct

### Connection Issues:
- Frontend can't connect to backend:
  - Check `VITE_API_URL` environment variable
  - Verify backend is running and accessible
  - Check CORS settings in backend

---

## 📱 Default Login After Deployment

**Admin:**
- Email: `admin@valdostamedicine.com`
- Password: `admin123`

**Staff:**
- Email: `sarah.johnson@valdostamedicine.com`
- Password: `password123`

⚠️ **IMPORTANT:** Change these passwords after first login!

---

## 🎯 Recommended Approach

**Just testing locally?** → Use **Docker** (Method 1)

**Want it online for free?** → Use **Render.com** (Method 2)

**Need it fast and don't mind paying $5/mo?** → Use **Railway** (Method 3)

**Going to production?** → Use **VPS** (Method 4) or Docker on a cloud provider

---

Need help? Check DEPLOYMENT.md for detailed guides!
