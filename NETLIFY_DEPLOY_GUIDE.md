# Deploy SMOZI on Netlify via GitHub

This project is fully configured for zero-configuration, continuous deployment on **Netlify** directly from your **GitHub** repository.

---

## 🚀 Preconfigured Settings

The repository already includes all necessary Netlify configuration files:

- **`netlify.toml`**: Configured with:
  - **Build Command**: `npm run build`
  - **Publish Directory**: `dist`
  - **Single Page App (SPA) Redirects**: `/* -> /index.html 200`
  - **Security & Performance Headers**: Strict security headers and static asset caching
- **`public/_redirects`**: Secondary SPA fallback ensuring client-side routes never return 404s.

---

## 📋 Option A: Connect GitHub to Netlify (Continuous Deployment)

Every time you push code to GitHub, Netlify will automatically build and deploy the latest version.

### Step 1: Push your code to GitHub

If you haven't linked your local repository to GitHub yet, run:

```bash
# 1. Add your GitHub repository remote (replace with your actual GitHub repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# 2. Push the main branch to GitHub
git push -u origin main
```

*(If you already have a remote configured, simply run `git push origin main`)*

---

### Step 2: Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Choose **"GitHub"** as your Git provider and authorize Netlify.
4. Select your **`Smozi`** (or block puzzle) repository.
5. Netlify will auto-detect the build settings from `netlify.toml`:
   - **Branch to deploy**: `main`
   - **Base directory**: *(leave empty / root)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**.

Your game will build in ~30 seconds and receive a live `.netlify.app` URL with automatic HTTPS and CDN caching!

---

## ⚡ Option B: Quick Deploy via Netlify CLI

If you prefer deploying directly from your terminal:

```bash
# 1. Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy to production
netlify deploy --prod --dir=dist
```

---

## 📦 Option C: Netlify Drop (Manual Drag & Drop)

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Open [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder into the browser window.
4. Your site will go live immediately!

---

## 🛠 Build Verification Check

You can test that the production build succeeds locally at any time:

```bash
npm run build
npm run preview
```
