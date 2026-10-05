# ⚡ Vaibhav Jain - GitHub Profile & Interactive Web Portfolio Suite

Welcome to your complete developer showcase suite! This repository delivers a state-of-the-art **Interactive Cyberpunk Portfolio Website** and a **High-Impact GitHub Profile README** equipped with real-time stats, dynamic typing headers, and an automated contribution snake game.

---

## 🌟 What Has Been Built

### 1. 🌐 Interactive Cyberpunk Web Portfolio (`index.html`, `style.css`, `app.js`)
* **Theme & Visuals:** Futuristic dark cyberpunk glassmorphism with glowing neon cyan, tokyo violet, and acid matrix themes.
* **Interactive Particle Canvas:** Constellation particles that react to mouse hover, gravitation, and clicks.
* **Interactive CLI Terminal:** Press `~` or click `CLI [~]` to launch a functional terminal shell supporting commands (`help`, `about`, `projects`, `skills`, `contact`, `stats`, `theme`, `matrix`, `snake`, `clear`).
* **Live GitHub Integration:** Dynamically fetches your repositories from the GitHub API (`jain05vaibhav`) with built-in rich architectural fallbacks for your actual AI/ML, NLP, Computer Vision, and C++ projects.
* **Real-time Filter & Search:** Instant multi-category filtering (`All`, `AI/ML & GenAI`, `CV & Audio`, `Algorithms & Core`, `Web & Systems`).
* **Project Architecture Modals:** Click *Inspect Specs* on any card to view problem statements, solution design, and technical pipelines.
* **Audio Synthesizer Engine:** Native Web Audio API sound synthesis with futuristic micro-interaction sound effects (with mute toggle).
* **Interactive Activity Heatmap:** 52-week simulated commit grid with live hover telemetry HUD.

### 2. 🚀 GitHub Profile README (`profile-readme/README.md`)
* Built specifically for your special GitHub repository: `https://github.com/jain05vaibhav/jain05vaibhav`.
* **Animated Cyber Header Banner:** Gradient waving capsule header with your name and engineering title.
* **Dynamic Typing Headline:** Real-time SVG typing effect showcasing your core disciplines.
* **Executive Terminal Overview:** YAML-styled developer profile and mission statement.
* **Technical Arsenal Grid:** Styled shields and devicons organized across AI/ML, GenAI & LLMs, Languages, Backend, and DevOps.
* **Highlighted Repositories Table:** Custom cards for your flagship projects (`ET-Hackathon-Gen-AI-Conceirge`, `Predictive-Multi-Objective-Compression-Selection`, `College_Feedback_Classifier`, `DSA`).
* **Real-time Telemetry Cards:** TokyoNight-themed lifetime stats, streak tracker, top languages, and activity graph.
* **GitHub Profile Trophies:** Matrix-themed achievement trophy case.
* **Contribution Snake Eater:** Animated SVG eating your GitHub contribution squares.
* **Automated GitHub Action (`profile-readme/.github/workflows/snake.yml`):** Automatically generates and updates your contribution snake every 24 hours.

---

## 📁 Repository Structure

```text
github_portfolio/
├── index.html                           # The interactive web portfolio
├── style.css                            # Cyberpunk glassmorphism design system
├── app.js                              # Particle canvas, GitHub API sync, CLI terminal, audio synth
├── assets/
│   ├── banner.svg                       # High-res vector cyberpunk banner
│   └── avatar.svg                       # Futuristic holographic monogram avatar
├── profile-readme/                      # GitHub Profile Repository files
│   ├── README.md                        # The GitHub Profile README for jain05vaibhav/jain05vaibhav
│   └── .github/
│       └── workflows/
│           └── snake.yml                # Daily automated contribution snake workflow
└── README.md                            # Documentation & deployment guide
```

---

## 🚀 How to Deploy & Activate

### Step 1: Activate Your GitHub Profile README
Your GitHub profile displays the `README.md` from a special repository named after your GitHub username (`jain05vaibhav/jain05vaibhav`).

1. Go to [GitHub](https://github.com/new) and create a **new public repository** named:
   ```text
   jain05vaibhav
   ```
   *(Ensure it is **Public** and initialized with a README if you like, or push directly).*
2. Copy the contents of [`profile-readme/README.md`](file:///c:/Users/Vaibhav/Desktop/projects/github_portfolio/profile-readme/README.md) into that repository's `README.md`.
3. Copy the [`.github/workflows/snake.yml`](file:///c:/Users/Vaibhav/Desktop/projects/github_portfolio/profile-readme/.github/workflows/snake.yml) folder and file into that repository.
4. **Enable GitHub Actions Permissions:**
   - In your `jain05vaibhav/jain05vaibhav` repo on GitHub, go to **Settings** &rarr; **Actions** &rarr; **General**.
   - Under **Workflow permissions**, select **"Read and write permissions"** and click **Save**.
   - Go to the **Actions** tab, select **Generate Contribution Snake Animation**, and click **Run workflow**.
   - Once completed, the snake animation will appear on your GitHub profile!

---

### Step 2: Deploy Your Interactive Web Portfolio to GitHub Pages (1-Click & Free)

You can host your portfolio for free on GitHub Pages:

1. In this workspace folder (`c:\Users\Vaibhav\Desktop\projects\github_portfolio`), initialize Git if not already done:
   ```bash
   git init
   git add .
   git commit -m "feat: launch interactive cyberpunk developer portfolio"
   ```
2. Create a new repository on GitHub named:
   - `jain05vaibhav.github.io` *(if you want it at `https://jain05vaibhav.github.io`)*  
   **OR**  
   - `portfolio` *(will be available at `https://jain05vaibhav.github.io/portfolio`)*
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/jain05vaibhav/jain05vaibhav.github.io.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, navigate to **Settings** &rarr; **Pages**:
   - Under **Source**, select `Deploy from a branch`.
   - Branch: `main` / Folder: `/(root)`.
   - Click **Save**.
5. Your interactive portfolio is now live on the internet!

---

## 💻 Local Testing & Preview

To run and preview the website locally on your computer:

```powershell
# Using Python built-in HTTP server:
python -m http.server 3000
```
Then open your browser at:
```text
http://localhost:3000
```
Or double-click `index.html` in your file explorer!

---

## 🛠️ Customization & Tweaks
* **Themes:** You can change the default accent in `index.html` by setting `data-theme="cyan"`, `data-theme="purple"`, or `data-theme="matrix"`.
* **Social Links:** Update your LinkedIn profile URL in both `index.html` and `profile-readme/README.md`.
* **Projects:** The portfolio dynamically retrieves your public repositories from GitHub. You can also customize static highlights directly in `app.js` under `defaultProjects`.
