# 🚀 Vercel Deployment Guide

This guide will help you deploy your Task Manager app to Vercel.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - For connecting your repository
3. **MongoDB Atlas** - Your database is already set up

---

## 🎯 Deployment Options

### **Option 1: Deploy via Vercel CLI (Recommended)**

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy from Project Root
```bash
cd "d:\WT\to do list"
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → task-manager (or your choice)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

#### Step 4: Set Environment Variables
```bash
vercel env add MONGODB_URI
# Paste your MongoDB Atlas connection string

vercel env add JWT_SECRET
# Enter a secure random string (e.g., your current JWT_SECRET from .env)
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

---

### **Option 2: Deploy via GitHub (Easier)**

#### Step 1: Push to GitHub

1. **Create a new repository** on GitHub
2. **Initialize git** in your project:
```bash
cd "d:\WT\to do list"
git init
git add .
git commit -m "Initial commit"
```

3. **Add remote and push**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **task-manager** repository
4. Click **"Import"**

#### Step 3: Configure Project

**Framework Preset:** Other
**Root Directory:** ./
**Build Command:** `npm run vercel-build`
**Output Directory:** `client/dist`
**Install Command:** `npm install`

#### Step 4: Add Environment Variables

In Vercel dashboard, go to:
**Settings → Environment Variables**

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Production, Preview, Development |
| `JWT_SECRET` | Your secret key (from .env) | Production, Preview, Development |
| `PORT` | 3002 | Production, Preview, Development |

**Example:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3002
```

#### Step 5: Deploy

Click **"Deploy"** button and wait for deployment to complete!

---

## 🔧 Important Configuration Files

### 1. `vercel.json` (Already Created)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 2. `.gitignore` (Create if missing)
```
node_modules/
.env
client/node_modules/
client/dist/
.vercel
```

---

## 🌐 Update Frontend API URL

After deployment, you'll get a URL like: `https://task-manager-xyz.vercel.app`

**No changes needed!** The app is configured to use relative URLs (`/api/*`) which work in both development and production.

---

## ✅ Post-Deployment Checklist

1. **Test the deployed app:**
   - Visit your Vercel URL
   - Register a new account
   - Create tasks
   - Test all features (categories, subtasks, calendar, analytics)

2. **Check MongoDB Atlas:**
   - Ensure IP whitelist includes `0.0.0.0/0` (allow all) for Vercel
   - Or add Vercel's IP ranges

3. **Monitor logs:**
   - Go to Vercel dashboard → Your project → Deployments
   - Click on latest deployment → View Function Logs

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection error"
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow connections from anywhere
- Verify MONGODB_URI is correct in Vercel environment variables

### Issue: "Cannot find module"
**Solution:**
- Ensure all dependencies are in `package.json`
- Run `vercel --prod` to redeploy

### Issue: "API routes not working"
**Solution:**
- Check `vercel.json` routes configuration
- Ensure environment variables are set
- Check Function Logs in Vercel dashboard

### Issue: "Build failed"
**Solution:**
- Check build logs in Vercel dashboard
- Ensure `client/package.json` has correct build script
- Try building locally: `cd client && npm run build`

---

## 📱 Custom Domain (Optional)

1. Go to Vercel dashboard → Your project → **Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch → Auto-deploys to production
- Every push to other branches → Creates preview deployment
- Pull requests → Automatic preview URLs

---

## 📊 Monitoring

**Vercel Dashboard provides:**
- Real-time logs
- Performance analytics
- Error tracking
- Deployment history

---

## 🎉 Success!

Your Task Manager app is now live on Vercel!

**Share your app:**
- Landing page: `https://your-app.vercel.app`
- Direct login: `https://your-app.vercel.app/login`

---

## 💡 Tips

1. **Free Tier Limits:**
   - 100 GB bandwidth/month
   - Unlimited deployments
   - Serverless function execution time: 10 seconds

2. **Performance:**
   - Vercel uses CDN for static assets
   - Automatic HTTPS
   - Global edge network

3. **Updates:**
   - Push to GitHub → Auto-deploys
   - Or use `vercel --prod` from CLI

---

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [mongodb.com/docs/atlas](https://mongodb.com/docs/atlas)

---

**Happy Deploying! 🚀**
