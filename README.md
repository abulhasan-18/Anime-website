# anime-website

Anime vibes, built with **Next.js**.  
A single-page, dark/light themed site with fiery red styling, responsive layouts, and image galleries.  

⚡ Fast, modern, and fun — the perfect starter for otaku web projects.

---

## ✨ Preview

<img width="1474" height="845" alt="image" src="https://github.com/user-attachments/assets/d62a46b0-448e-4700-a678-18d95d96ea38" />

<img width="1369" height="840" alt="image" src="https://github.com/user-attachments/assets/23ebc13f-94a1-47dc-906b-a5ff9d9a6da5" />

---

## 🚀 Features

- 🔥 Fire-themed UI with dark/light mode  
- 🖼️ Responsive gallery grid with hover preview  
- 📱 Fully responsive layouts (desktop + mobile)  
- ⚡ Built for speed with Next.js 15 and Tailwind  
- ☁️ Google Drive integration for image hosting & downloads  

---

## 🧱 Tech Stack

- **Next.js 15**  
- **Tailwind CSS**  
- **TypeScript**  
- **Google Drive API (Service Account)**  

---

## ☁️ Google Drive Integration

This project uses **Google Drive** as the image store.  
Instead of bundling static images, files are pulled dynamically from a shared Drive folder:

1. **Service Account Setup**  
   - Create a Service Account in Google Cloud → IAM & Admin.  
   - Download the JSON key.  

2. **Share Drive Folder**  
   - Create a folder on Google Drive.  
   - Share it with the service account email (Viewer access).  

3. **Environment Variables**  
   Add these to `.env.local` (and in Vercel Project Settings for production):  

   ```env
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"
   DRIVE_FOLDER_ID=your_drive_folder_id
