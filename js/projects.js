/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — PROJECTS REPOSITORY & MODAL ENGINE
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const PROJECTS_DATA = {
    "01": {
      id: "01",
      name: "Personal Portfolio",
      subtitle: "Multi-page interactive digital universe & engineering portfolio",
      domain: "WEB ENGINEERING & CLOUD",
      badge: "FLAGSHIP",
      problem: "Traditional student portfolios are often static, linear resume scrolls with generic templates that fail to showcase interface engineering craft and technical aptitude.",
      solution: "Engineered an interactive multi-page digital universe featuring custom 'Aurora Digital' canvas physics, skills constellation inspector, Firebase Firestore messaging, and an elevated administrative dashboard.",
      technologies: ["HTML5", "CSS3", "JavaScript (ES6+)", "Canvas API", "Web Audio API", "Cloud Firestore", "Firebase Auth"],
      features: [
        "Modular multi-page architecture with seamless page transitions.",
        "Interactive 'Aurora Digital' background with mouse-responsive plasma and particle drift.",
        "Dynamic skills matrix with deep telemetry inspection panel (no fake percentages).",
        "Direct Cloud Firestore contact transmission with local storage offline fallback.",
        "Authenticated Admin Console for message review, read/unread status, and deletion."
      ],
      githubUrl: "https://github.com/vaidehiharde/digital-space-portfolio",
      demoUrl: "index.html"
    },
    "02": {
      id: "02",
      name: "AI Study Planner",
      subtitle: "Intelligent academic curriculum decomposition & scheduling engine",
      domain: "AI & PRODUCTIVITY",
      badge: "FEATURED",
      problem: "Students experience cognitive overload attempting to balance multiple engineering courses, practical submissions, and exam revisions without an adaptive priority schedule.",
      solution: "Engineered a heuristic study planner that decomposes academic curricula into manageable milestones and dynamically re-balances revision slots based on exam proximity and topic difficulty.",
      technologies: ["Python", "JavaScript", "HTML5", "CSS3", "AI Heuristics"],
      features: [
        "Dynamic syllabus decomposition into modular learning milestones.",
        "Proximity and weighted-difficulty algorithm to allocate prioritized study blocks.",
        "Interactive timeline view for milestone completion and progress tracking.",
        "Real-time schedule recalculation when exams or deadlines change."
      ],
      githubUrl: "https://github.com/vaidehiharde/ai-study-planner",
      demoUrl: "https://vaidehiharde.github.io/ai-study-planner-demo"
    },
    "03": {
      id: "03",
      name: "Café Loyalty & Rewards System",
      subtitle: "Digital customer retention & tier rewards management platform",
      domain: "COMMERCE & WEB",
      badge: "WEB APP",
      problem: "Independent cafés lose repeat patrons due to easily misplaced physical stamp cards and prohibitive pricing of enterprise loyalty software.",
      solution: "Engineered a modern web platform enabling baristas to log customer visits via rapid lookup and patrons to unlock milestone rewards and tier vouchers.",
      technologies: ["JavaScript", "Cloud Firestore", "HTML5", "CSS3"],
      features: [
        "Instant customer search and one-click visit registration for staff.",
        "Tiered points calculation (Bronze, Silver, Gold) with automatic voucher unlocks.",
        "Digital reward redemption ledger with anti-fraud safeguards.",
        "Cloud-synchronized balance tracking across multiple counters."
      ],
      githubUrl: "https://github.com/vaidehiharde/cafe-loyalty-rewards",
      demoUrl: "https://cafe-rewards-vh.web.app"
    },
    "04": {
      id: "04",
      name: "Agritech Project",
      subtitle: "Soil telemetry, climate monitoring & crop advisory system",
      domain: "IOT & DATA ANALYTICS",
      badge: "IOT / DATA",
      problem: "Smallholder farmers face unpredictable crop yield loss due to a lack of accessible soil moisture, temperature, and localized environmental telemetry.",
      solution: "Constructed an agricultural monitoring dashboard that analyzes environmental parameters (moisture, temperature, humidity) and produces actionable irrigation alerts.",
      technologies: ["Python", "Data Analytics", "Web Interface", "Sensor Data Logic"],
      features: [
        "Real-time sensor telemetry simulation for soil moisture and ambient temperature.",
        "Threshold-based advisory notifications for precision irrigation.",
        "Historical trend charts to monitor soil hydration patterns.",
        "Accessible, high-contrast dashboard tailored for rapid mobile comprehension."
      ],
      githubUrl: "https://github.com/vaidehiharde/agritech-advisory-system",
      demoUrl: "https://vaidehiharde.github.io/agritech-preview"
    },
    "05": {
      id: "05",
      name: "Hospital Management System",
      subtitle: "Centralized healthcare intake, doctor scheduling & records system",
      domain: "SYSTEMS & DATABASE",
      badge: "SYSTEM ARCHITECTURE",
      problem: "Healthcare facilities encounter severe bottlenecks when managing patient intake, physician schedules, and consultation records across disjointed manual systems.",
      solution: "Constructed an object-oriented system model in C++/Python organizing patient registration records, appointment slots, diagnosis history, and departmental data.",
      technologies: ["C++", "Python", "Object-Oriented Design", "File Systems"],
      features: [
        "Patient intake profiling with unique medical registration numbers.",
        "Doctor appointment scheduler with conflict prevention logic.",
        "Medical records ledger tracking diagnosis history and prescriptions.",
        "Robust input validation and modular menu interface."
      ],
      githubUrl: "https://github.com/vaidehiharde/hospital-management-system",
      demoUrl: "https://vaidehiharde.github.io/hospital-mgmt-demo"
    },
    "06": {
      id: "06",
      name: "Data Visualization Dashboard",
      subtitle: "Multi-dimensional business analytics & interactive KPI telemetry",
      domain: "BUSINESS INTELLIGENCE",
      badge: "DATA VISUALIZATION",
      problem: "Multidimensional business datasets are difficult for decision-makers to analyze without intuitive interactive visual storytelling and exploratory slicing.",
      solution: "Built executive business intelligence dashboards in Power BI and Tableau transforming thousands of raw records into interactive KPI visuals and trend projections.",
      technologies: ["Power BI", "Tableau", "Python", "Data Analytics"],
      features: [
        "Executive KPI metric cards tracking historical performance deltas.",
        "Multi-dimensional slicing across geographical and categorical attributes.",
        "Time-series trend analysis and categorical contribution charts.",
        "Standardized visual hierarchy ensuring accessible data contrast."
      ],
      githubUrl: "https://github.com/vaidehiharde/data-viz-dashboards",
      demoUrl: "https://public.tableau.com/app/profile/vaidehi.harde"
    }
  };

  const projectModal = document.getElementById("project-modal");
  const modalClose = document.getElementById("project-modal-close");

  const modalNum = document.getElementById("modal-project-num");
  const modalDomain = document.getElementById("modal-project-domain");
  const modalTitle = document.getElementById("modal-project-title");
  const modalSubtitle = document.getElementById("modal-project-subtitle");
  const modalProblem = document.getElementById("modal-project-problem");
  const modalSolution = document.getElementById("modal-project-solution");
  const modalTech = document.getElementById("modal-project-tech");
  const modalFeatures = document.getElementById("modal-project-features");
  const modalGithub = document.getElementById("modal-github-btn");
  const modalDemo = document.getElementById("modal-demo-btn");

  function openProject(id) {
    const data = PROJECTS_DATA[id];
    if (!data || !projectModal) return;

    if (window.playUiTone) window.playUiTone(620, "sine", 0.07);

    modalNum.textContent = `PROJECT // ${data.id}`;
    modalDomain.textContent = data.domain;
    modalTitle.textContent = data.name;
    modalSubtitle.textContent = data.subtitle;
    modalProblem.textContent = data.problem;
    modalSolution.textContent = data.solution;

    modalTech.innerHTML = data.technologies.map(t => `<span class="tech-tag">${t}</span>`).join("");
    modalFeatures.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join("");

    modalGithub.href = data.githubUrl;
    modalDemo.href = data.demoUrl;

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    if (!projectModal) return;
    if (window.playUiTone) window.playUiTone(400, "triangle", 0.05);
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Bind project card clicks
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-project-id");
      openProject(id);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const id = card.getAttribute("data-project-id");
        openProject(id);
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeProject);

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) closeProject();
    });
  }

  // Filter pills on projects page (if present)
  const filterPills = document.querySelectorAll(".project-filter-pill");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const category = pill.getAttribute("data-filter");

      document.querySelectorAll(".project-card").forEach(card => {
        const cardDomain = card.getAttribute("data-domain") || "";
        if (category === "all" || cardDomain.includes(category)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
