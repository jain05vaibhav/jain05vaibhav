/**
 * VAIBHAV JAIN - CYBERPUNK DEVELOPER PORTFOLIO ENGINE
 * Live GitHub API Integration • Interactive CLI Terminal • Canvas Constellation • Audio Synth
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSynth();
  initThemeSystem();
  initCanvasParticles();
  initTypingEffect();
  initStatsCounters();
  initSkillsSystem();
  initHeatmap();
  initProjectsEngine();
  initTerminalCLI();
  initModalsAndForms();
  initMobileMenu();
});

/* ==========================================================================
   1. WEB AUDIO SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
   ========================================================================== */
let audioCtx = null;
let sfxEnabled = true;

function initAudioSynth() {
  const toggleBtn = document.getElementById('sfx-toggle');
  
  // Restore saved preference
  const savedSFX = localStorage.getItem('vj_sfx_pref');
  if (savedSFX !== null) {
    sfxEnabled = savedSFX === 'true';
    updateSFXButtonUI();
  }

  toggleBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    localStorage.setItem('vj_sfx_pref', sfxEnabled);
    updateSFXButtonUI();
    if (sfxEnabled) playTone(880, 'sine', 0.1, 0.05);
    showToast(sfxEnabled ? 'Audio Synthesis: ONLINE' : 'Audio Synthesis: MUTED');
  });

  function updateSFXButtonUI() {
    const wave = toggleBtn.querySelector('.sfx-wave');
    if (wave) {
      wave.style.opacity = sfxEnabled ? '1' : '0.2';
    }
  }

  // Attach sound to interactive buttons
  document.querySelectorAll('button, .cyber-btn, .nav-item, .filter-btn, .skill-tab').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (sfxEnabled) playTone(340, 'triangle', 0.03, 0.02);
    });
    el.addEventListener('click', () => {
      if (sfxEnabled) playTone(580, 'sine', 0.06, 0.03);
    });
  });
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.04) {
  if (!sfxEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or unsupported
  }
}

/* ==========================================================================
   2. THEME SWITCHER
   ========================================================================== */
function initThemeSystem() {
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const options = document.querySelectorAll('.theme-option');

  // Load saved theme
  const savedTheme = localStorage.getItem('vj_theme') || 'cyan';
  setTheme(savedTheme);

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    themeMenu.classList.remove('show');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-set-theme');
      setTheme(theme);
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      themeMenu.classList.remove('show');
      showToast(`Visual Theme set to: ${theme.toUpperCase()}`);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vj_theme', theme);
  }
}

/* ==========================================================================
   3. PARTICLES & CONSTELLATION CANVAS
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Generate particles based on screen size
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      baseColor: Math.random() > 0.5 ? '0, 242, 254' : '157, 78, 221',
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion / attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 2;
        p.y -= (dy / dist) * force * 2;

        // Line to mouse
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.4 * force})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.baseColor}, ${p.alpha})`;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pjDx = p.x - p2.x;
        const pjDy = p.y - p2.y;
        const pDist = Math.sqrt(pjDx * pjDx + pjDy * pjDy);

        if (pDist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - pDist / 120) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const textEl = document.getElementById('typing-text');
  if (!textEl) return;

  const roles = [
    'AI & Machine Learning Engineer',
    'Generative AI & LLM Specialist',
    'Deep Learning & Computer Vision Builder',
    'High-Performance C++ & Algorithmic Solver',
    'Full-Stack Intelligent Systems Architect'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      textEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      textEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2000; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400; // Pause before next word
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   5. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          let count = 0;
          const speed = Math.ceil(target / 40);

          const timer = setInterval(() => {
            count += speed;
            if (count >= target) {
              num.textContent = target;
              clearInterval(timer);
            } else {
              num.textContent = count;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.hero-stats-bar');
  if (statsBar) observer.observe(statsBar);
}

/* ==========================================================================
   6. SKILLS SYSTEM
   ========================================================================== */
const skillsData = {
  ai: {
    title: '🧠 AI, Machine Learning & Data Science',
    desc: 'Deep learning frameworks, model training, feature extraction, evaluation metrics, and optimization.',
    skills: [
      { name: 'PyTorch / Neural Networks', level: 92 },
      { name: 'TensorFlow & Keras', level: 86 },
      { name: 'Scikit-Learn & ML Algorithms', level: 95 },
      { name: 'OpenCV / Computer Vision', level: 88 },
      { name: 'Pandas, NumPy & Data Wrangling', level: 94 },
      { name: 'Hugging Face Transformers', level: 89 },
      { name: 'NLP & Text Classification', level: 91 },
      { name: 'Pareto-Optimal ML Prediction', level: 90 }
    ]
  },
  genai: {
    title: '⚡ Generative AI, LLMs & Autonomous Agents',
    desc: 'Building context-rich RAG pipelines, fine-tuned agent workflows, vector embeddings, and prompt orchestration.',
    skills: [
      { name: 'LangChain & LlamaIndex Frameworks', level: 90 },
      { name: 'RAG (Retrieval-Augmented Generation)', level: 92 },
      { name: 'Vector Databases (Chroma, FAISS)', level: 88 },
      { name: 'Prompt Engineering & Structured Output', level: 94 },
      { name: 'Context Memory & Agent Tools', level: 87 },
      { name: 'OpenAI & Claude API Integration', level: 93 }
    ]
  },
  languages: {
    title: '💻 Core Programming Languages',
    desc: 'Strong algorithmic foundations, systems programming, and high-level application engineering.',
    skills: [
      { name: 'Python (OOP, Concurrency, Asyncio)', level: 96 },
      { name: 'C++ (STL, Memory, Optimization)', level: 90 },
      { name: 'C Programming', level: 85 },
      { name: 'JavaScript (ES6+, DOM, Async)', level: 88 },
      { name: 'TypeScript', level: 82 },
      { name: 'SQL (PostgreSQL, MySQL)', level: 87 }
    ]
  },
  web: {
    title: '🌐 Web, Backend & Microservices',
    desc: 'Scalable RESTful API development, server architectures, and interactive responsive user interfaces.',
    skills: [
      { name: 'FastAPI (Asynchronous APIs)', level: 93 },
      { name: 'Flask Microframework', level: 90 },
      { name: 'Node.js & Express.js', level: 86 },
      { name: 'React & Modern Frontend UI', level: 84 },
      { name: 'HTML5, Modern CSS & Responsive Design', level: 94 },
      { name: 'RESTful API Architecture & Swagger Docs', level: 92 }
    ]
  },
  devops: {
    title: '🛠️ Databases, Cloud & DevOps Tooling',
    desc: 'Modern deployment workflows, containerization, version control, and data persistence.',
    skills: [
      { name: 'Git & Advanced GitHub Workflows', level: 95 },
      { name: 'GitHub Actions & CI/CD Pipelines', level: 88 },
      { name: 'Docker & Containerization', level: 82 },
      { name: 'PostgreSQL & Relational Data Modeling', level: 86 },
      { name: 'MongoDB & Document Databases', level: 85 },
      { name: 'Linux Command Line & Shell Scripting', level: 89 }
    ]
  }
};

function initSkillsSystem() {
  const navTabs = document.querySelectorAll('.skill-tab');
  const displayContainer = document.getElementById('skills-display');

  function renderCategory(catKey) {
    const data = skillsData[catKey];
    if (!data) return;

    let html = `
      <div class="skill-category-block">
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <div class="skills-bar-grid">
    `;

    data.skills.forEach(skill => {
      html += `
        <div class="skill-bar-item">
          <div class="skill-label-row">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-pct">${skill.level}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" data-width="${skill.level}"></div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    displayContainer.innerHTML = html;

    // Trigger bar fill animation
    setTimeout(() => {
      displayContainer.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }, 40);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCategory(tab.getAttribute('data-skill-cat'));
    });
  });

  // Initial render
  renderCategory('ai');
}

/* ==========================================================================
   7. INTERACTIVE HEATMAP SIMULATOR
   ========================================================================== */
function initHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  const tooltip = document.getElementById('heatmap-tooltip');
  if (!grid) return;

  const totalDays = 52 * 7;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Deterministic seed for realistic developer activity
  for (let i = 0; i < totalDays; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';

    // Activity distribution weighting
    const rand = Math.random();
    let level = 0;
    let commits = 0;

    if (rand > 0.82) {
      level = 4;
      commits = Math.floor(Math.random() * 8) + 9;
    } else if (rand > 0.65) {
      level = 3;
      commits = Math.floor(Math.random() * 5) + 5;
    } else if (rand > 0.45) {
      level = 2;
      commits = Math.floor(Math.random() * 3) + 2;
    } else if (rand > 0.28) {
      level = 1;
      commits = 1;
    } else {
      level = 0;
      commits = 0;
    }

    cell.classList.add(`lvl-${level}`);

    // Compute approximate date
    const dayOfWeek = days[i % 7];
    const weekIdx = Math.floor(i / 7);
    const month = months[Math.floor((weekIdx / 52) * 12)];
    const dayNum = ((i * 3) % 28) + 1;

    cell.addEventListener('mouseenter', () => {
      tooltip.textContent = `${commits === 0 ? 'No' : commits} contribution${commits === 1 ? '' : 's'} on ${dayOfWeek}, ${month} ${dayNum}`;
      if (sfxEnabled && level > 0) playTone(500 + level * 70, 'sine', 0.03, 0.015);
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.textContent = 'Hover over a node to inspect commits';
    });

    grid.appendChild(cell);
  }
}

/* ==========================================================================
   8. PROJECTS ENGINE (LIVE GITHUB API + RICH ARCHITECTURAL FALLBACK)
   ========================================================================== */
const defaultProjects = [
  {
    name: 'Predictive-Multi-Objective-Compression-Selection',
    title: 'Predictive Multi-Objective Compression Selection',
    category: 'ai-ml',
    categoryLabel: 'ML & Optimization',
    description: 'Machine learning predictive framework evaluating Pareto-optimal trade-offs between compression ratio, CPU runtime, and memory overhead across heterogeneous data streams.',
    tech: ['Python', 'Scikit-learn', 'Pareto Optimization', 'Pandas', 'NumPy'],
    stars: 1,
    forks: 0,
    language: 'Python',
    langColor: '#3776ab',
    repoUrl: 'https://github.com/jain05vaibhav/Predictive-Multi-Objective-Compression-Selection',
    specs: {
      problem: 'Data compression algorithm selection traditionally requires costly trial-and-error testing across massive datasets.',
      solution: 'Engineered an ML predictive classifier that inspects dataset entropy, structure, and constraints to select the optimal algorithm along the Pareto front.',
      architecture: 'Feature extraction pipeline -> Normalization -> Multi-objective cost evaluation -> Model ensemble -> Benchmarked verification.'
    }
  },
  {
    name: 'ET-Hackathon-Gen-AI-Conceirge',
    title: 'ET-Hackathon GenAI Concierge',
    category: 'ai-ml',
    categoryLabel: 'Generative AI & LLMs',
    description: 'Autonomous conversational concierge utilizing Large Language Models, structured prompt orchestration, multi-turn memory, and low-latency response pipelines built for ET Hackathon.',
    tech: ['Python', 'GenAI', 'LLMs', 'Prompt Engineering', 'RAG', 'FastAPI'],
    stars: 1,
    forks: 0,
    language: 'Python',
    langColor: '#3776ab',
    repoUrl: 'https://github.com/jain05vaibhav/ET-Hackathon-Gen-AI-Conceirge',
    specs: {
      problem: 'Traditional rule-based chatbots fail to understand nuanced user intent and cannot maintain contextual continuity across multiple turns.',
      solution: 'Created an intelligent concierge leveraging advanced LLM reasoning, dynamic context grounding, and prompt chaining for real-time customer assistance.',
      architecture: 'FastAPI gateway -> Prompt routing layer -> Vector memory retrieval -> LLM inference generator -> Clean JSON formatted response.'
    }
  },
  {
    name: 'College_Feedback_Classifier',
    title: 'College Feedback & Sentiment Classifier',
    category: 'ai-ml',
    categoryLabel: 'NLP & Sentiment Analysis',
    description: 'End-to-end NLP system that automatically classifies student feedback into actionable departmental categories while extracting sentiment polarity and key themes.',
    tech: ['Python', 'NLP', 'Scikit-Learn', 'Sentiment Analysis', 'TF-IDF', 'Jupyter'],
    stars: 0,
    forks: 0,
    language: 'Jupyter Notebook',
    langColor: '#da5b0b',
    repoUrl: 'https://github.com/jain05vaibhav/College_Feedback_Classifier',
    specs: {
      problem: 'Educational institutions receive thousands of unstructured reviews, making manual categorization and sentiment assessment impractical.',
      solution: 'Trained text classification pipelines combining TF-IDF vectorization and multi-class classifiers to automate feedback routing and sentiment metrics.',
      architecture: 'Text tokenization & stopword removal -> TF-IDF feature matrix -> Multi-class classifier -> Sentiment polarity scoring.'
    }
  },
  {
    name: 'DSA',
    title: 'High-Performance Algorithmic Suite (DSA)',
    category: 'algorithms',
    categoryLabel: 'Algorithms & Core',
    description: 'Comprehensive C++ implementation of complex data structures and algorithmic paradigms, including dynamic programming, graph algorithms, and tree operations.',
    tech: ['C++', 'Graph Theory', 'Dynamic Programming', 'Trees', 'Time Complexity'],
    stars: 1,
    forks: 0,
    language: 'C++',
    langColor: '#00599c',
    repoUrl: 'https://github.com/jain05vaibhav/DSA',
    specs: {
      problem: 'Writing robust, production-level algorithmic solutions with minimal space-time overhead.',
      solution: 'Constructed modular, verified C++ implementations covering BFS/DFS, Dijkstra, Segment Trees, Trie, and DP optimization.',
      architecture: 'Zero memory leaks, rigorous edge-case testing, and standardized asymptotic performance.'
    }
  },
  {
    name: 'Vehicular_detection',
    title: 'Vehicular Detection & Traffic Intelligence',
    category: 'cv-audio',
    categoryLabel: 'Computer Vision',
    description: 'Real-time multi-class vehicle detection, bounding-box tracking, and traffic density estimation utilizing YOLO convolutional models and OpenCV video processing.',
    tech: ['Python', 'YOLO', 'OpenCV', 'Computer Vision', 'Deep Learning'],
    stars: 0,
    forks: 0,
    language: 'Python',
    langColor: '#3776ab',
    repoUrl: 'https://github.com/jain05vaibhav',
    specs: {
      problem: 'Accurate vehicle detection under variable lighting, occlusion, and varying camera perspectives.',
      solution: 'Fine-tuned deep convolutional object detectors with tracking algorithms to compute vehicle flow rates and congestion states in real-time.',
      architecture: 'Video stream input -> Frame preprocessing -> YOLO inference -> Centroid tracker -> Density HUD overlay.'
    }
  },
  {
    name: 'voice_command',
    title: 'Voice Command & Speech Assistant',
    category: 'cv-audio',
    categoryLabel: 'Audio & Speech AI',
    description: 'Acoustic speech recognition system translating microphone voice input into intent-classified system commands and automated workflow executions.',
    tech: ['Python', 'SpeechRecognition', 'Acoustic Processing', 'NLP'],
    stars: 0,
    forks: 0,
    language: 'Python',
    langColor: '#3776ab',
    repoUrl: 'https://github.com/jain05vaibhav',
    specs: {
      problem: 'Hands-free desktop operation requiring fast transcription and intent classification without external cloud lag.',
      solution: 'Engineered an audio pipeline capturing microphone signals, applying noise-filtering, and routing transcribed phonemes into command dispatchers.',
      architecture: 'Audio stream buffer -> Noise reduction filter -> Speech-to-text decoder -> Intent matcher -> OS execution.'
    }
  },
  {
    name: 'sign_language',
    title: 'Sign Language Gesture Recognizer',
    category: 'cv-audio',
    categoryLabel: 'Computer Vision & Deep Learning',
    description: 'Deep neural network interpreting real-time sign language hand gestures from camera streams and translating them into synthesized text and audible speech.',
    tech: ['Python', 'MediaPipe', 'OpenCV', 'CNN', 'Deep Learning'],
    stars: 0,
    forks: 0,
    language: 'Python',
    langColor: '#3776ab',
    repoUrl: 'https://github.com/jain05vaibhav',
    specs: {
      problem: 'Bridging communication barriers for hearing and speech impaired individuals through automated gesture interpretation.',
      solution: 'Extracted 21 3D hand landmark coordinates using MediaPipe and classified sequential gestures with neural network classifiers.',
      architecture: 'Camera capture -> Hand landmark keypoint extraction -> Neural classification -> Text & TTS voice output.'
    }
  },
  {
    name: 'antrik.co',
    title: 'Antrik Corporate Digital Architecture',
    category: 'web',
    categoryLabel: 'Web & Systems',
    description: 'Full-stack web application with responsive layouts, modern design system, optimized asset delivery, and dynamic component architecture.',
    tech: ['JavaScript', 'Blade', 'HTML5', 'CSS3', 'REST APIs'],
    stars: 0,
    forks: 0,
    language: 'Blade / JS',
    langColor: '#f7df1e',
    repoUrl: 'https://github.com/jain05vaibhav/antrik.co',
    specs: {
      problem: 'Building modern responsive web platforms requiring high page speed, clean SEO markup, and dynamic interactive elements.',
      solution: 'Developed modular template architecture with streamlined asset pipelines, resulting in fast load times and clean presentation.',
      architecture: 'Modular view templates -> Component styling -> Dynamic interactivity -> SEO metadata.'
    }
  }
];

let allProjects = [...defaultProjects];

async function initProjectsEngine() {
  const grid = document.getElementById('projects-grid');
  const searchInput = document.getElementById('project-search');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Attempt live GitHub API fetch
  try {
    const res = await fetch('https://api.github.com/users/jain05vaibhav/repos?per_page=100&sort=updated');
    if (res.ok) {
      const repos = await res.json();
      enrichWithLiveRepos(repos);
    }
  } catch (e) {
    console.log('GitHub API offline or rate-limited; using cached repositories.');
  }

  updateCategoryCounts();
  renderProjects('all', '');

  // Filter tab clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      const query = searchInput.value.trim().toLowerCase();
      renderProjects(cat, query);
    });
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const activeBtn = document.querySelector('.filter-btn.active');
    const cat = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    renderProjects(cat, query);
  });

  function enrichWithLiveRepos(apiRepos) {
    apiRepos.forEach(repo => {
      const existing = allProjects.find(p => p.name.toLowerCase() === repo.name.toLowerCase());
      if (existing) {
        existing.stars = repo.stargazers_count;
        existing.forks = repo.forks_count;
        existing.repoUrl = repo.html_url;
        if (repo.language) existing.language = repo.language;
      } else if (!repo.fork) {
        // Add new public non-forked repo
        const cat = categorizeRepo(repo.name, repo.description, repo.language);
        allProjects.push({
          name: repo.name,
          title: repo.name.replace(/[-_]/g, ' '),
          category: cat.cat,
          categoryLabel: cat.label,
          description: repo.description || 'Public GitHub project repository.',
          tech: [repo.language || 'Code', 'Git', 'GitHub'],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'Source',
          langColor: getLangColor(repo.language),
          repoUrl: repo.html_url,
          specs: {
            problem: 'Open source software implementation.',
            solution: 'Engineered modular codebase available on GitHub.',
            architecture: 'Repository source code hosted on GitHub.'
          }
        });
      }
    });
  }

  function categorizeRepo(name, desc, lang) {
    const text = (name + ' ' + (desc || '') + ' ' + (lang || '')).toLowerCase();
    if (text.includes('ml') || text.includes('ai') || text.includes('predict') || text.includes('classif') || text.includes('nlp') || text.includes('llm')) {
      return { cat: 'ai-ml', label: 'AI & Machine Learning' };
    }
    if (text.includes('vision') || text.includes('detect') || text.includes('speech') || text.includes('voice') || text.includes('gesture')) {
      return { cat: 'cv-audio', label: 'Computer Vision & Audio' };
    }
    if (text.includes('dsa') || text.includes('algorithm') || text.includes('c++') || text.includes('data-structure')) {
      return { cat: 'algorithms', label: 'Algorithms & Core' };
    }
    return { cat: 'web', label: 'Web & Systems' };
  }

  function getLangColor(lang) {
    const map = {
      'Python': '#3776ab',
      'C++': '#00599c',
      'C': '#555555',
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'HTML': '#e34f26',
      'CSS': '#563d7c',
      'Jupyter Notebook': '#da5b0b',
      'Blade': '#f05340'
    };
    return map[lang] || '#00f2fe';
  }

  function updateCategoryCounts() {
    document.getElementById('count-all').textContent = allProjects.length;
    document.getElementById('count-ai').textContent = allProjects.filter(p => p.category === 'ai-ml').length;
    document.getElementById('count-cv').textContent = allProjects.filter(p => p.category === 'cv-audio').length;
    document.getElementById('count-algo').textContent = allProjects.filter(p => p.category === 'algorithms').length;
    document.getElementById('count-web').textContent = allProjects.filter(p => p.category === 'web').length;
  }

  function renderProjects(filterCategory, searchQuery) {
    let filtered = allProjects;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => {
        const hay = (p.title + ' ' + p.description + ' ' + p.tech.join(' ')).toLowerCase();
        return hay.includes(searchQuery);
      });
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>No projects match your current search criteria.</p>
          <button class="cyber-btn sm-btn ghost-btn" onclick="document.getElementById('project-search').value=''; document.querySelector('.filter-btn[data-filter=all]').click();">Reset Filters</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach((p, idx) => {
      html += `
        <div class="project-card glass-panel" data-project-idx="${idx}">
          <div>
            <div class="project-top-row">
              <svg class="project-folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <div class="project-meta-links">
                <a href="${p.repoUrl}" target="_blank" rel="noopener" class="meta-link" title="View Source on GitHub" aria-label="GitHub repository">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <span class="project-category-tag">${p.categoryLabel}</span>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
          </div>

          <div>
            <div class="project-tech-list">
              ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="project-card-footer">
              <div class="repo-stats">
                <span class="stat-item">
                  <span class="lang-dot" style="background-color: ${p.langColor}"></span>
                  ${p.language}
                </span>
                <span class="stat-item" title="Stars">★ ${p.stars}</span>
              </div>
              <button class="inspect-btn" data-project-name="${p.name}">
                <span>Inspect Specs</span> &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Attach inspect click handlers
    grid.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-project-name');
        const proj = allProjects.find(p => p.name === name);
        if (proj) openProjectModal(proj);
      });
    });
  }
}

/* ==========================================================================
   9. INTERACTIVE CYBER CLI TERMINAL
   ========================================================================== */
function initTerminalCLI() {
  const overlay = document.getElementById('terminal-modal');
  const triggerBtn = document.getElementById('terminal-trigger-btn');
  const heroTriggerBtn = document.getElementById('hero-terminal-btn');
  const closeBtn = document.getElementById('term-close');
  const minBtn = document.getElementById('term-min');
  const maxBtn = document.getElementById('term-max');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  const history = [];
  let historyIdx = -1;

  function openTerminal() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    input.focus();
    playTone(660, 'sine', 0.1, 0.04);
  }

  function closeTerminal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  triggerBtn.addEventListener('click', openTerminal);
  if (heroTriggerBtn) heroTriggerBtn.addEventListener('click', openTerminal);
  closeBtn.addEventListener('click', closeTerminal);
  minBtn.addEventListener('click', closeTerminal);

  maxBtn.addEventListener('click', () => {
    const win = overlay.querySelector('.terminal-window');
    win.style.maxWidth = win.style.maxWidth === '95vw' ? '780px' : '95vw';
    win.style.height = win.style.height === '85vh' ? '520px' : '85vh';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminal();
  });

  // Global hotkey: ~ or ` to toggle terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        overlay.classList.contains('active') ? closeTerminal() : openTerminal();
      }
    } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeTerminal();
    }
  });

  // Command execution
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';
      if (!rawCmd) return;

      history.push(rawCmd);
      historyIdx = history.length;

      printLine(`<span class="term-cyan">guest@vaibhav-ai:~$</span> ${escapeHTML(rawCmd)}`);
      executeCommand(rawCmd);
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });

  function printLine(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    output.appendChild(div);
  }

  function executeCommand(raw) {
    const parts = raw.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1];

    switch (cmd) {
      case 'help':
        printLine(`
          <span class="term-yellow">AVAILABLE SYSTEM PROTOCOLS:</span><br>
          &nbsp;&nbsp;<span class="term-cyan">about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Executive bio, research vision & background<br>
          &nbsp;&nbsp;<span class="term-cyan">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List featured repositories & innovations<br>
          &nbsp;&nbsp;<span class="term-cyan">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display core AI/ML, C++ and web proficiencies<br>
          &nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Transmission details (Email, GitHub, LinkedIn)<br>
          &nbsp;&nbsp;<span class="term-cyan">stats</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Real-time GitHub profile telemetry<br>
          &nbsp;&nbsp;<span class="term-cyan">theme &lt;name&gt;</span>&nbsp;- Switch accent: 'cyan', 'purple', or 'matrix'<br>
          &nbsp;&nbsp;<span class="term-cyan">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Execute digital rain cascade<br>
          &nbsp;&nbsp;<span class="term-cyan">snake</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Contribution snake grid animation<br>
          &nbsp;&nbsp;<span class="term-cyan">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Wipe terminal buffer<br>
          &nbsp;&nbsp;<span class="term-cyan">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close interactive terminal
        `);
        break;

      case 'about':
      case 'bio':
        printLine(`
          <span class="term-bright">VAIBHAV JAIN // AI & MACHINE LEARNING ENGINEER</span><br>
          Focus: Deep Learning, Generative AI & LLMs, Computer Vision, Pareto Optimization.<br>
          Philosophy: "Transforming complex algorithmic intelligence into seamless real-world impact."<br>
          Status: Open to high-impact ML/AI engineering roles and collaborative research.
        `);
        break;

      case 'projects':
      case 'repos':
        let projList = '<span class="term-yellow">FEATURED REPOSITORIES:</span><br>';
        allProjects.slice(0, 6).forEach((p, i) => {
          projList += `&nbsp;&nbsp;[${i + 1}] <a href="${p.repoUrl}" target="_blank" style="color:#00f2fe;text-decoration:none;">${p.title}</a> - <span class="term-dim">${p.categoryLabel} (${p.language})</span><br>`;
        });
        projList += `Type 'cat repo.txt' or inspect cards in the Projects section for full specs.`;
        printLine(projList);
        break;

      case 'skills':
        printLine(`
          <span class="term-green">CORE ARSENAL MATRIX:</span><br>
          &nbsp;&nbsp;• <b>AI / ML:</b> PyTorch, TensorFlow, Scikit-learn, OpenCV, Hugging Face<br>
          &nbsp;&nbsp;• <b>GenAI & LLMs:</b> LangChain, LlamaIndex, RAG, Vector DBs, Prompt Eng<br>
          &nbsp;&nbsp;• <b>Languages:</b> Python, C++, C, JavaScript, TypeScript, SQL<br>
          &nbsp;&nbsp;• <b>Backend:</b> FastAPI, Flask, Node.js, Express, REST APIs<br>
          &nbsp;&nbsp;• <b>Tools & Cloud:</b> Git, GitHub Actions, Docker, Linux, PostgreSQL
        `);
        break;

      case 'contact':
      case 'email':
        printLine(`
          <span class="term-yellow">TRANSMISSION CHANNELS:</span><br>
          &nbsp;&nbsp;📧 Email:&nbsp;&nbsp;&nbsp;&nbsp;<a href="mailto:jain05vaibhav@gmail.com" style="color:#00f2fe">jain05vaibhav@gmail.com</a><br>
          &nbsp;&nbsp;🐙 GitHub:&nbsp;&nbsp;&nbsp;<a href="https://github.com/jain05vaibhav" target="_blank" style="color:#00f2fe">github.com/jain05vaibhav</a><br>
          &nbsp;&nbsp;💼 LinkedIn:&nbsp;<a href="https://linkedin.com/in/" target="_blank" style="color:#00f2fe">Connect on LinkedIn</a>
        `);
        break;

      case 'stats':
        printLine(`
          <span class="term-cyan">GITHUB TELEMETRY STATUS:</span><br>
          &nbsp;&nbsp;User:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@jain05vaibhav<br>
          &nbsp;&nbsp;Repos Online:&nbsp;${allProjects.length}+ active engineering repositories<br>
          &nbsp;&nbsp;Primary Stack: Python, C++, Deep Learning, FastAPI, Blade<br>
          &nbsp;&nbsp;Streak:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Continuous active development
        `);
        break;

      case 'theme':
        if (arg === 'cyan' || arg === 'purple' || arg === 'matrix') {
          document.documentElement.setAttribute('data-theme', arg);
          localStorage.setItem('vj_theme', arg);
          printLine(`<span class="term-green">Theme successfully updated to [${arg.toUpperCase()}].</span>`);
        } else {
          printLine(`<span class="term-yellow">Usage: theme [cyan | purple | matrix]</span>`);
        }
        break;

      case 'matrix':
        printLine(`<span class="term-green">Initializing matrix protocol...</span>`);
        simulateMatrixRain();
        break;

      case 'snake':
        printLine(`
          <span class="term-green">Contribution Snake Eater initialized!</span><br>
          Generating workflow: <span class="term-yellow">profile-readme/.github/workflows/snake.yml</span><br>
          Inspect full README inside the 'GitHub README' modal or at github.com/jain05vaibhav.
        `);
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        closeTerminal();
        break;

      case 'sudo':
        printLine(`<span class="term-magenta">Permission denied: guest has root access to AI models only.</span>`);
        break;

      default:
        printLine(`<span class="term-magenta">Command not recognized: '${escapeHTML(raw)}'. Type <span class="term-yellow">'help'</span> for list of commands.</span>`);
        break;
    }
  }

  function simulateMatrixRain() {
    const chars = '01010101 VAIBHAV JAIN NEURAL NETWORKS TENSORFLOW PYTORCH C++ FASTAPI';
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        let stream = '';
        for (let j = 0; j < 45; j++) {
          stream += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        printLine(`<span class="term-green" style="opacity:${0.5 + i * 0.1}">${stream}</span>`);
        output.scrollTop = output.scrollHeight;
      }, i * 150);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/* ==========================================================================
   10. MODALS & FORMS
   ========================================================================== */
function initModalsAndForms() {
  // Project Inspect Modal
  const projModal = document.getElementById('project-modal');
  const projModalClose = document.getElementById('modal-close');
  const projContent = document.getElementById('modal-content');

  window.openProjectModal = function(p) {
    projContent.innerHTML = `
      <div class="card-hud-header" style="margin: -34px -34px 24px;">
        <span class="hud-dot red"></span>
        <span class="hud-dot yellow"></span>
        <span class="hud-dot green"></span>
        <span class="hud-title">${p.name}.spec</span>
      </div>

      <div class="project-category-tag" style="margin-bottom: 8px;">${p.categoryLabel}</div>
      <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; margin-bottom: 12px;">${p.title}</h2>
      <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 24px;">${p.description}</p>

      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <h4 style="color: var(--primary-color); font-family: var(--font-mono); font-size: 0.88rem; margin-bottom: 8px;">// PROBLEM DEFINITION:</h4>
        <p style="color: #cbd5e1; font-size: 0.92rem; margin-bottom: 16px;">${p.specs.problem}</p>

        <h4 style="color: var(--primary-color); font-family: var(--font-mono); font-size: 0.88rem; margin-bottom: 8px;">// SYSTEM ARCHITECTURE:</h4>
        <p style="color: #cbd5e1; font-size: 0.92rem; margin-bottom: 16px;">${p.specs.solution}</p>

        <h4 style="color: var(--primary-color); font-family: var(--font-mono); font-size: 0.88rem; margin-bottom: 8px;">// PIPELINE WORKFLOW:</h4>
        <p style="color: var(--text-dim); font-family: var(--font-mono); font-size: 0.84rem;">${p.specs.architecture}</p>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
        ${p.tech.map(t => `<span class="tech-tag" style="padding: 5px 10px; font-size: 0.82rem;">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 14px;">
        <a href="${p.repoUrl}" target="_blank" rel="noopener" class="cyber-btn primary-btn glow-btn">
          <span>View Source on GitHub &rarr;</span>
        </a>
        <button class="cyber-btn ghost-btn" onclick="document.getElementById('project-modal').classList.remove('active')">
          <span>Close Specification</span>
        </button>
      </div>
    `;

    projModal.classList.add('active');
  };

  projModalClose.addEventListener('click', () => {
    projModal.classList.remove('active');
  });

  projModal.addEventListener('click', (e) => {
    if (e.target === projModal) projModal.classList.remove('active');
  });

  // Profile README Preview Modal
  const readmeBtn = document.getElementById('profile-readme-btn');
  const readmeModal = document.getElementById('readme-modal');
  const readmeClose = document.getElementById('readme-modal-close');
  const copyReadmeBtn = document.getElementById('copy-readme-code');
  const readmeContent = document.getElementById('readme-preview-content');

  readmeBtn.addEventListener('click', () => {
    renderReadmePreview();
    readmeModal.classList.add('active');
  });

  readmeClose.addEventListener('click', () => {
    readmeModal.classList.remove('active');
  });

  readmeModal.addEventListener('click', (e) => {
    if (e.target === readmeModal) readmeModal.classList.remove('active');
  });

  function renderReadmePreview() {
    readmeContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,26,45&height=180&section=header&text=VAIBHAV%20JAIN&fontSize=42&fontAlignY=36&animation=fadeIn&fontColor=00f2fe&desc=AI%20%2F%20ML%20Engineer%20%E2%80%A2%20GenAI%20Developer%20%E2%80%A2%20Full-Stack%20Creator&descSize=16&descAlignY=60&descAlign=50" style="max-width: 100%; border-radius: 8px;" alt="Banner" />
        <br><br>
        <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=1000&color=00F2FE&center=true&vCenter=true&multiline=false&width=600&height=40&lines=👋+Hello+World!+I'm+Vaibhav+Jain;🚀+AI+%26+Machine+Learning+Engineer;🧠+Building+Generative+AI+%26+LLM+Apps" style="max-width: 100%;" alt="Typing SVG" />
      </div>

      <div style="border-top: 1px solid #30363d; padding-top: 16px; margin-top: 16px;">
        <h3 style="color: #58a6ff; margin-bottom: 10px;">Executive Summary</h3>
        <p style="color: #8b949e; line-height: 1.6;">
          Engineered for repository <code>jain05vaibhav/jain05vaibhav/README.md</code> with animated typing SVG, 
          live dynamic stats, streak tracker, top languages, trophies, and automated daily contribution snake game.
        </p>
      </div>
    `;
  }

  copyReadmeBtn.addEventListener('click', async () => {
    try {
      const resp = await fetch('profile-readme/README.md');
      const text = await resp.text();
      await navigator.clipboard.writeText(text);
      showToast('Profile README markdown copied to clipboard!');
    } catch (e) {
      showToast('Copied README location: profile-readme/README.md');
    }
  });

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.getAttribute('data-email');
    try {
      await navigator.clipboard.writeText(email);
      showToast(`Email copied: ${email}`);
      playTone(740, 'sine', 0.1, 0.04);
    } catch (e) {
      showToast(`Email: ${email}`);
    }
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    // Trigger futuristic transmission feedback
    playTone(920, 'sine', 0.15, 0.05);
    showToast(`Transmission initiated! Connecting with Vaibhav...`);

    // Prepare mailto link
    const mailtoLink = `mailto:jain05vaibhav@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
    
    setTimeout(() => {
      window.location.href = mailtoLink;
      contactForm.reset();
    }, 1000);
  });
}

/* ==========================================================================
   11. MOBILE MENU & UTILITIES
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });

  // Navbar scroll background change
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Set current year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--primary-color)">⚡</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
