# VAIDEHI // DIGITAL SPACE
### Multi-Page Interactive Personal Portfolio & Engineering Ecosystem

> **"Building. Learning. Exploring Technology."**

An advanced, multi-page interactive digital portfolio for **Vaidehi Harde**, 2nd-year Computer Engineering student at **Sanjivani College of Engineering, Kopargaon** (1st Year CGPA: **9.43**).

Built using vanilla modern web technologies, an interactive **Aurora Digital** dynamic canvas background, custom desktop cursor physics, Web Audio API sound synthesis, a real-time skills telemetry constellation, and Firebase Cloud Firestore with an elevated security administrative portal.

---

## 1. Multi-Page Architecture & File Structure

```text
portfolio/
│
├── index.html              # Home (Interactive entry point & visual centerpiece)
├── about.html              # About Me (Profile, personal journey & 4 interactive pillars)
├── education.html          # Education (Sanjivani COE, 9.43 CGPA scoreboard & timeline)
├── skills.html             # Skills Constellation (Categorized nodes & live telemetry inspector)
├── projects.html           # Project Universe (Filterable gallery & detailed modal inspector)
├── achievements.html       # Achievements (Curated milestones & category timeline)
├── contact.html            # Contact (Terminal comms interface & Firestore backend)
│
├── admin.html              # Secure Admin Console (Firebase Auth & message dispatch)
│
├── css/
│   ├── style.css           # Global design tokens, Aurora theme, header & home hero
│   ├── pages.css           # Subpage styles for About, Education, Skills, Projects, Contact
│   └── admin.css           # High-security dark operations center stylesheet
│
├── js/
│   ├── main.js             # Global navigation, page transitions, Web Audio & quick HUD (⌘K)
│   ├── background.js       # "Aurora Digital" plasma waves, particle drift & mouse physics
│   ├── cursor.js           # Desktop custom cursor (dot + ring + magnetic card scaling)
│   ├── projects.js         # Projects database, filter pills & modal inspector
│   ├── contact.js          # Live validation & Cloud Firestore message pipeline
│   └── admin.js            # Auth guard, Firestore sync, KPIs & message management
│
├── firebase/
│   └── firebase-config.js  # Firebase SDK config, Firestore service & local fallback
│
├── assets/
│   ├── images/
│   │   ├── README.txt      # Photo replacement instructions
│   │   ├── profile-placeholder.svg # Cybernetic monogram fallback portrait
│   │   └── profile.jpg     # TARGET PATH for your personal photograph
│   ├── icons/
│   │   └── favicon.svg     # Custom "VH" monogram geometric SVG
│   └── resume/
│       ├── README.txt      # Resume guide
│       └── resume.pdf      # TARGET PATH for your PDF resume
│
└── README.md               # Complete setup, rules, and deployment documentation
```

---

## 2. Multi-Page Navigation Overview

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Home** | `index.html` | Visual centerpiece (**VAIDEHI HARDE** with elegant typography), dedicated photo area, and 6 exploration cards routing to subpages. |
| **About** | `about.html` | Engineering manifesto, Sanjivani COE student profile, core interests, hobbies (Travelling, Cooking), and 4 interactive expandable pillars (**LEARN, BUILD, EXPLORE, GROW**). |
| **Education** | `education.html` | Academic performance scoreboard (**Sem 1: 9.45 SGPA**, **Sem 2: 9.41 SGPA**, **1st Year: 9.43 CGPA**) and an interactive curriculum milestone timeline. |
| **Skills** | `skills.html` | Grouped categories (**Programming, Web Development, Tools, Data & AI**) with clickable nodes that render live telemetry into an interactive inspector panel (no fake percentage bars). |
| **Projects** | `projects.html` | Interactive gallery of 6 real projects with domain filters and modal telemetry views (**The Problem, The Solution, Tech Stack, Core Features, View Code, Live Demo**). |
| **Achievements** | `achievements.html` | Curated timeline across Hackathons, Certifications, Workshops, and Academic Honors with easy-to-edit JavaScript data structure. |
| **Contact** | `contact.html` | Terminal comms interface (**LET'S BUILD SOMETHING TOGETHER**) connected to Firebase Cloud Firestore with live validation and success feedback. |
| **Admin Console** | `admin.html` | Protected administrative dashboard with Firebase Auth login, real-time KPI counters (Total, Unread, Read), message viewer, read toggles, and deletion. |

---

## 3. "Aurora Digital" Background & Interactive Features

- **Aurora Canvas (`js/background.js`)**:
  - Deep midnight navy base (`#070b19`) infused with flowing violet (`#7209b7`), electric cyan (`#00f5d4`), indigo (`#4361ee`), and soft magenta accents (`#f72585`).
  - Smooth mouse physics: plasma gradients shift with parallax, light follows cursor subtly, and floating particles react to cursor proximity.
  - Automatically respects `prefers-reduced-motion` and pauses on inactive browser tabs to preserve battery and GPU cycles.
- **Custom Cursor (`js/cursor.js`)**:
  - Outer ring + inner dot that expands and glows on interactive links, buttons, and cards.
  - Automatically suppressed on touch/mobile devices.
- **Synthesized Web Audio API (`js/main.js`)**:
  - Procedural sound synthesis (no external MP3s needed) for button clicks, card expansions, and message transmissions. Includes a persistent mute/unmute toggle in the header.
- **Quick HUD (`⌘K` / `Ctrl+K`)**:
  - Fast keyboard navigation modal to jump to any page in milliseconds.

---

## 4. How to Add Your Photo

1. Prepare your portrait photo in JPG format.
2. Rename the file to:
   ```text
   profile.jpg
   ```
3. Place it in:
   ```text
   assets/images/profile.jpg
   ```
If `profile.jpg` is not yet present, the site automatically renders the high-tech geometric monogram fallback (`assets/images/profile-placeholder.svg`).

---

## 5. How to Add Your Resume

1. Export your resume as a PDF.
2. Name it:
   ```text
   resume.pdf
   ```
3. Place it in:
   ```text
   assets/resume/resume.pdf
   ```

---

## 6. Firebase Setup Walkthrough

### Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project** (e.g., `vaidehi-digital-space`).
3. Click the **Web icon (`</>`)** to register a web application.

### Step 2: Configure Credentials in `firebase/firebase-config.js`
Open `firebase/firebase-config.js` and paste your project config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

> **Local Simulation Fallback:** If credentials remain placeholders, the site automatically saves messages to `localStorage`, allowing you to test form submissions and the admin dashboard immediately without configuration!

---

## 7. Cloud Firestore Security Rules

In Firebase Console, go to **Cloud Firestore** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /contactMessages/{messageId} {
      // Allow any visitor to transmit an inquiry with valid fields
      allow create: if request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.subject is string
                    && request.resource.data.message is string
                    && request.resource.data.status == 'unread'
                    && request.resource.data.message.size() >= 8;

      // Only authenticated admin can read, update, or delete messages
      allow read, update, delete: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 8. Firebase Authentication Setup (Admin Account)

1. In Firebase Console, go to **Authentication** > **Get Started**.
2. Under **Sign-in method**, enable **Email/Password**.
3. Under the **Users** tab, click **Add user**.
4. Enter your email and password (e.g. `admin@vaidehi.space`).
5. You can now log into `admin.html` with this account!

> **Local Testing Credentials:**
> - **Email:** `admin@vaidehi.space`
> - **Password:** `vaidehi2026`

---

## 9. Running Locally

You can run the portfolio locally without installing node packages:

### Option A: VS Code Live Server
Right-click `index.html` and select **Open with Live Server**.

### Option B: Python Local Server
Run in PowerShell:
```powershell
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### Option C: Direct Double-Click
Double-click `index.html` to open directly in Google Chrome, Edge, or Firefox.

---

## 10. How to Add or Edit Projects

In `js/projects.js`, locate `PROJECTS_DATA` and add or edit:

```javascript
"07": {
  id: "07",
  name: "New Project Title",
  subtitle: "Tagline",
  domain: "DOMAIN / CATEGORY",
  badge: "PROTOTYPE",
  problem: "What problem was tackled...",
  solution: "What software was built...",
  technologies: ["Python", "Flask", "React"],
  features: [
    "Feature 1...",
    "Feature 2..."
  ],
  githubUrl: "https://github.com/vaidehiharde/new-project",
  demoUrl: "https://new-project-demo.web.app"
}
```

In `projects.html`, add a corresponding `<article class="project-card" data-project-id="07" data-domain="web">` card.

---

## 11. How to Add Achievements

In `achievements.html`, locate the `ACHIEVEMENTS_LIST` array inside the `<script>` tag and add your new entry:

```javascript
{
  id: "ach_05",
  category: "hackathons", // Options: "academics", "hackathons", "workshops", "certifications"
  title: "Hackathon Award / Winner",
  issuer: "Competition Organizer",
  date: "October 2026",
  description: "Description of your hackathon project or honor...",
  status: "Verified Award",
  icon: "fa-solid fa-trophy"
}
```

---

## 12. Verification & Quality Assurance

- **Multi-page navigation verified**: Every link opens its real page (`index.html`, `about.html`, `education.html`, `skills.html`, `projects.html`, `achievements.html`, `contact.html`, `admin.html`).
- **No single-page scrolling**: All modules are distinct, dedicated experiences.
- **Academic metrics**: 9.45 (Sem 1 SGPA), 9.41 (Sem 2 SGPA), 9.43 (1st Year CGPA) at Sanjivani College of Engineering, Kopargaon verified across all pages.
- **Zero console errors & clean responsive layout**.
#   P o r t f o l i o  
 