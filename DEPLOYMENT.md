# Deployment Guide

## Step 1: Set up MongoDB Atlas (Cloud Database)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Sign up / Login
2. Create a **free** cluster (M0 tier)
3. Add a database user (username + password)
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Go to **Connect** → Get your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/personal_assistant
   ```

---

## Step 2: Deploy Backend on Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New +** → **Web Service**
3. Connect GitHub → Select your repo
4. Set these options:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add **Environment Variables** in the Render dashboard:
   - `MONGODB_URI` = `mongodb+srv://...` (from MongoDB Atlas)
   - `JWT_SECRET` = `some-very-long-random-string-here`
   - `GEMINI_API_KEY` = `AIzaSyCzZcPouRg4RG6I6Ko81xV3fzF-dfwXeYM`
   - `FLASK_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://your-vercel-app.vercel.app`
6. Click **Create Web Service** → Wait for deployment
7. Copy your Render URL: `https://your-service.onrender.com`

---

## Step 3: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo
3. Settings:
   - **Framework**: Vite
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL` = `https://your-service.onrender.com/api`
5. Click **Deploy**

---

## Step 4: Update CORS on Render (after Vercel deploys)
1. Go to your Render service → **Environment**
2. Update `ALLOWED_ORIGINS` to your actual Vercel URL:
   ```
   https://rahulrathore579.vercel.app
   ```
3. Render will automatically redeploy

---

## Important Notes
- **Render Free Tier** sleeps after 15 min of inactivity (30s cold start on wakeup)
- **Seed your user** after backend deploys: visit `POST /api/auth/signup` or run seed_user.py with your MongoDB Atlas URI
- **Re-seed** the user `rahulrathore39769@gmail.com` with password `rathore@1` on the new database
