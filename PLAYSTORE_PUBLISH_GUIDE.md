# 🚀 Google Play Store Publishing Guide for SMOZI

This project is fully configured and optimized as an Android-ready game utilizing Google's official **Trusted Web Activity (TWA)** standard.

---

## 🛠️ Step 1: Build the Web App
Ensure the web app builds cleanly:
```bash
npm run build
```

---

## 📦 Step 2: Generate Android App Bundle (.aab) with Bubblewrap

Google provides the official [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) to convert PWAs into signed Google Play App Bundles:

### 1. Install Bubblewrap CLI
```bash
npm install -g @bubblewrap/cli
```

### 2. Initialize from your hosted URL
When you have deployed your app (e.g. Firebase Hosting, Vercel, or custom domain `https://your-smozi-domain.com`):
```bash
bubblewrap init --manifest=https://your-smozi-domain.com/manifest.webmanifest
```
Bubblewrap will automatically read `twa-manifest.json` and configure:
- **Package ID**: `app.smozi.puzzle`
- **Application Name**: SMOZI
- **Display**: Standalone (Full Screen Game)
- **Orientation**: Portrait

### 3. Build & Sign the Release App Bundle
```bash
bubblewrap build
```
This generates `app-release-bundle.aab` in your project folder.

---

## 🔗 Step 3: Enable Full-Screen Mode (AssetLinks Verification)

To remove the Chrome browser top bar and achieve a pure native Android experience:
1. Bubblewrap prints your SHA-256 fingerprint during build.
2. Update `/public/.well-known/assetlinks.json` with your real SHA-256 certificate fingerprint:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.smozi.puzzle",
      "sha256_cert_fingerprints": [
        "YOUR_BUBBLEWRAP_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```
3. Deploy the updated `assetlinks.json` so `https://your-domain.com/.well-known/assetlinks.json` is publicly reachable.

---

## 📋 Step 4: Google Play Console Submission Checklist

### 1. Create Application
- Go to [Google Play Console](https://play.google.com/console).
- Click **Create app**:
  - **App name**: SMOZI: Premium Block Puzzle
  - **Default language**: English (United States)
  - **App or game**: Game
  - **Free or paid**: Free

### 2. Privacy Policy URL (Mandatory)
Google Play requires a dedicated Privacy Policy:
- **URL**: `https://your-smozi-domain.com/privacy.html` (already included and styled in `/public/privacy.html`)

### 3. Data Safety Form Answers
- **Does your app collect or share user data?**: No
- **Data storage**: All gameplay data, coin balances, and achievements are stored locally on the user's device.
- **Children's Policy**: Safe for families & children (no personal info collected).

### 4. Upload App Bundle
- Go to **Release** ➔ **Internal testing** (or Production).
- Upload `app-release-bundle.aab`.
- Submit for review!
