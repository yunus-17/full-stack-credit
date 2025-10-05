# ⚡ Quick Start - Deploy to Vercel in 5 Minutes

## 🚀 Fastest Way to Deploy

### Method 1: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd "d:\WT\to do list"

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. Add environment variables
vercel env add MONGODB_URI
# Paste: mongodb+srv://YOUR_CONNECTION_STRING

vercel env add JWT_SECRET
# Enter: your-secret-key-here

# 6. Deploy to production
vercel --prod
```

**Done! Your app is live! 🎉**

---

### Method 2: GitHub + Vercel (Easiest)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git push -u origin main

# 2. Go to vercel.com/new
# 3. Import your GitHub repository
# 4. Add environment variables in Vercel dashboard:
#    - MONGODB_URI
#    - JWT_SECRET
# 5. Click Deploy

# Done! Auto-deploys on every push! 🎉
```

---

## 🔑 Environment Variables

Copy these from your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-jwt-secret-key
PORT=3002
```

Add them in Vercel:
- **Dashboard → Settings → Environment Variables**

---

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Register a new account
3. Create a task
4. Test features

---

## 🐛 Common Issues

**MongoDB Error?**
- Add `0.0.0.0/0` to MongoDB Atlas IP whitelist

**Build Failed?**
- Check Vercel logs
- Ensure all dependencies are installed

**API Not Working?**
- Verify environment variables are set
- Check Function Logs in Vercel

---

## 📖 Full Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

**Need help? Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)**
