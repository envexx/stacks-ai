# 🚀 Deployment Guide - StacksAI

This guide covers deploying the StacksAI project (both frontend and backend) to production.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
- [Environment Variables](#environment-variables)
- [Alternative Deployment Options](#alternative-deployment-options)

---

## 🏗️ Project Structure

```
stack/
├── packages/
│   ├── web-demo/          # Next.js Frontend
│   └── gateway/           # Express.js Backend API
```

**Important:** This is a monorepo with 2 separate applications that need to be deployed independently.

---

## 🎨 Frontend Deployment (Vercel)

### ✅ Recommended: Vercel

Vercel is the best choice for Next.js applications.

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Make sure `packages/web-demo` contains your Next.js app

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `packages/web-demo`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Add Environment Variables (see below)
6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd packages/web-demo

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set root directory
# - Configure build settings
```

### Frontend Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# API Gateway URL (your backend deployment URL)
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app

# Stacks Network (testnet or mainnet)
NEXT_PUBLIC_STACKS_NETWORK=testnet

# Optional: Analytics, etc.
```

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## ⚙️ Backend Deployment (Railway/Render)

### ✅ Recommended: Railway

Railway is excellent for Node.js/Express backends with easy setup.

### Option 1: Railway Deployment

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway will auto-detect the Express app

#### Step 3: Configure Build

If Railway doesn't auto-detect correctly:

1. Go to **Settings**
2. Set **Root Directory:** `packages/gateway`
3. Set **Build Command:** `npm install && npm run build`
4. Set **Start Command:** `npm start`

#### Step 4: Add Environment Variables

In Railway Dashboard → Variables:

```env
# Port (Railway provides this automatically)
PORT=3000

# OpenAI API Key (Required)
OPENAI_API_KEY=sk-...

# Anthropic API Key (Optional, for Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Stacks Network
STACKS_NETWORK=testnet

# Payment Recipient Address
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Redis URL (Optional, for caching)
REDIS_URL=redis://...

# CORS Origins (Your frontend URL)
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3001
```

#### Step 5: Get Deployment URL

Railway will provide a URL like: `https://your-app.railway.app`

Use this URL as `NEXT_PUBLIC_API_URL` in your frontend.

---

### Option 2: Render Deployment

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** stacksai-gateway
   - **Root Directory:** `packages/gateway`
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

#### Step 3: Add Environment Variables

Same as Railway (see above)

#### Step 4: Deploy

Render will automatically deploy and provide a URL.

---

## 🔐 Environment Variables

### Frontend (web-demo)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.stacksai.com` |
| `NEXT_PUBLIC_STACKS_NETWORK` | Stacks network | `testnet` or `mainnet` |

### Backend (gateway)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `OPENAI_API_KEY` | OpenAI API key | **Yes** |
| `ANTHROPIC_API_KEY` | Anthropic API key | No |
| `STACKS_NETWORK` | Stacks network | Yes |
| `PAYMENT_RECIPIENT_ADDRESS` | STX payment address | Yes |
| `REDIS_URL` | Redis connection URL | No |
| `CORS_ORIGINS` | Allowed CORS origins | Yes |

---

## 🔄 Alternative Deployment Options

### Frontend Alternatives

#### 1. **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd packages/web-demo
netlify deploy --prod
```

**Configuration:**
- Build command: `npm run build`
- Publish directory: `.next`
- Root directory: `packages/web-demo`

#### 2. **Cloudflare Pages**
- Connect GitHub repository
- Set root directory: `packages/web-demo`
- Build command: `npm run build`
- Output directory: `.next`

### Backend Alternatives

#### 1. **Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create stacksai-gateway

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git subtree push --prefix packages/gateway heroku main
```

#### 2. **DigitalOcean App Platform**
- Connect GitHub repository
- Select `packages/gateway` as root
- Configure environment variables
- Deploy

#### 3. **AWS Elastic Beanstalk**
- Create Node.js environment
- Upload `packages/gateway` as ZIP
- Configure environment variables
- Deploy

---

## 🧪 Testing Deployment

### Frontend Testing

1. Visit your Vercel URL
2. Check:
   - ✅ Landing page loads
   - ✅ Navigation works
   - ✅ Chat page accessible
   - ✅ Wallet connection works

### Backend Testing

Test API endpoints:

```bash
# Health check
curl https://your-backend.railway.app/health

# Test prompt endpoint (should return 402)
curl https://your-backend.railway.app/v1/prompt/gpt-3.5 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Build Fails:**
- Check Node.js version (use Node 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors

**API Connection Fails:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is deployed and running

### Backend Issues

**API Key Errors:**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key is valid and has credits

**Port Issues:**
- Use `process.env.PORT` in your code
- Railway/Render provide PORT automatically

**CORS Errors:**
- Add frontend URL to `CORS_ORIGINS`
- Format: `https://your-app.vercel.app` (no trailing slash)

---

## 📊 Monitoring & Logs

### Vercel
- Dashboard → Your Project → Deployments
- View build logs and runtime logs
- Monitor performance metrics

### Railway
- Dashboard → Your Service → Logs
- Real-time log streaming
- Metrics and usage statistics

### Render
- Dashboard → Your Service → Logs
- View deployment logs
- Monitor resource usage

---

## 🚀 CI/CD Setup

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. **Push to main branch** → Automatic production deployment
2. **Push to other branches** → Preview deployments
3. **Pull requests** → Preview deployments with unique URLs

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./packages/web-demo
```

---

## 💰 Cost Estimation

### Free Tier Options

**Vercel:**
- ✅ Free for personal projects
- Unlimited deployments
- 100GB bandwidth/month

**Railway:**
- ✅ $5 free credit/month
- Pay-as-you-go after that
- ~$5-10/month for small apps

**Render:**
- ✅ Free tier available
- 750 hours/month free
- Sleeps after 15 min inactivity

### Recommended Setup (Free)

- **Frontend:** Vercel (Free)
- **Backend:** Railway ($5 credit) or Render (Free tier)
- **Total:** $0-5/month

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] API connection working
- [ ] Wallet connection working
- [ ] Payment flow tested (testnet)
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up
- [ ] Error tracking configured

---

## 🆘 Support

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration
5. Review this guide

For more help:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

## 🎉 Success!

Your StacksAI application should now be live and accessible to users worldwide!

**Frontend:** `https://your-app.vercel.app`  
**Backend:** `https://your-api.railway.app`

Happy deploying! 🚀
