# My Portfolio Website (Flat Version — no subfolders)

This is the same portfolio site, just reorganized so that **every file sits side by side in one folder** — no `css/`, `js/`, `assets/`, `images/`, or `data/` subfolders. This makes it much easier to upload from a phone, where selecting whole folders often doesn't work.

Every piece of content on the page (name, photo, bio, skills, projects, timeline, etc.) is loaded from one file: **`profile.json`**. Edit that file and the whole site updates automatically — you never need to touch the HTML.

---

## 📁 Files in this folder

```
index.html        → the page structure (don't edit content here)
style.css         → all styling
app.js            → reads profile.json and builds the page
typing.js         → the looping typing animation
counter.js        → the animated number counters
profile.json      → ⭐ EDIT THIS FILE to change everything
logo.png          → your logo
profile.jpg       → your profile photo
project-1.jpg
project-2.jpg
project-3.jpg
project-4.jpg     → project screenshots
README.md
```

All 13 files are meant to live together in the **root of your GitHub repository** — don't put them inside a subfolder, or the site's internal links will break.

---

## ✏️ How to edit your content

Open `profile.json` in any text editor. It's plain JSON — change the text between the quotes and save.

### Change your name
```json
"name": "Your Full Name",
```

### Change the typing animation text
```json
"titles": [
  "Programmer",
  "Full Stack Developer",
  "AI Developer"
],
```

### Replace your profile photo
1. Name your photo file **`profile.jpg`** and upload it to the repo root, replacing the existing one.
2. Or, if you'd rather use a different filename, update this line in `profile.json`:
```json
"profileImage": "profile.jpg",
```

### Replace your logo
1. Upload your logo as **`logo.png`** to the repo root, replacing the existing one. The header currently shows a text logo (`"logo": "M."`) — to show your image instead, open `index.html`, find `id="logo"` in the header, and swap the text for:
```html
<img src="logo.png" alt="Logo" style="height:32px">
```

### Change your bio, email, phone, location, website
```json
"bio": "Write a couple of sentences about yourself here.",
"email": "you@example.com",
"phone": "+1 234 567 8900",
"location": "Your City, Country",
"website": "www.yoursite.com",
```

### Change your social links
```json
"social": {
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourusername",
  "facebook": "https://facebook.com/yourusername",
  "x": "https://x.com/yourusername",
  "email": "mailto:you@example.com"
}
```
Leave any field as an empty string `""` to hide that icon.

### Edit your stats (the animated counters)
```json
"stats": [
  { "label": "Years of Experience", "value": 2, "suffix": "+" }
]
```

### Edit your skills
```json
"skills": [
  { "name": "HTML", "percent": 95 }
]
```

### Edit your services
```json
"services": [
  { "title": "Web Development", "description": "...", "icon": "code" }
]
```
Available icons: `code`, `layers`, `cpu`, `zap`, `shield`, `share`, `figma`.

### Add a project
1. Upload a screenshot to the repo root (e.g. `project-5.jpg`).
2. Add an entry to the `projects` array in `profile.json`:
```json
{
  "title": "Project Name",
  "description": "One or two sentences about what it does.",
  "image": "project-5.jpg",
  "github": "https://github.com/yourusername/project",
  "live": "https://your-live-demo-link.com",
  "tech": ["React", "Node.js"]
}
```

### Edit your timeline (education, experience, certificates)
```json
"timeline": {
  "experience": [
    { "title": "Job Title", "place": "Company Name", "date": "2024 — Present", "description": "..." }
  ],
  "education": [ ... ],
  "certificates": [ ... ]
}
```

---

## 🚀 How to upload to GitHub (mobile-friendly)

1. Go to your repository on GitHub (in Chrome or any browser)
2. Tap **Add file → Upload files**
3. Tap the upload box, and select all 13 files from your phone **one by one, or all at once if your file picker allows multi-select** — this works well here since there are no folders to select, only individual files
4. Scroll down and tap **Commit changes**

## 🚀 Deploying with GitHub Pages

1. In your repository, go to **Settings → Pages**
2. Under **Source**, choose **Deploy from a branch**
3. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**
4. Wait about a minute, refresh the Pages settings page — your live link will appear, like:
   ```
   https://yourusername.github.io/portfolio/
   ```

---

## 🖥️ Preview it locally before uploading

Browsers block a page from loading a JSON file directly from your hard drive (`file://`), so preview with a tiny local server:

```bash
# from inside this folder
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

---

## 📬 About the contact form

The contact form validates fields and shows a confirmation message, but doesn't send email anywhere yet (a static GitHub Pages site can't run backend code). To make it send real messages, sign up at [Formspree](https://formspree.io), get your form endpoint, and wire it into the `initContactForm` function inside `app.js`.

---

## 🎨 Customizing the design

All colors, fonts, spacing, and animation timing live at the top of `style.css` inside the `:root { ... }` block:

```css
--color-white:      #ffffff;
--color-black:      #111111;
--color-gray:       #666666;
--color-light-gray: #f6f6f6;
```

---

Built with plain HTML, CSS, and JavaScript — no build step, no dependencies to install. Just edit, save, and refresh.
