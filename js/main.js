/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — GLOBAL MAIN ENGINE
 * Navigation, Page Transitions, Audio Synthesizer, Quick HUD (⌘K)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // -----------------------------------------------------------------
  // 1. PAGE ENTRANCE & SMOOTH MULTI-PAGE TRANSITIONS
  // -----------------------------------------------------------------
  const pageTransition = document.getElementById("page-transition-overlay");
  
  // Fade in page on load
  if (pageTransition) {
    setTimeout(() => {
      pageTransition.classList.add("loaded");
    }, 40);
  }

  // Intercept internal navigation for seamless exit animation
  const internalLinks = document.querySelectorAll("a[href]:not([target='_blank']):not([href^='#']):not([href^='mailto:']):not([href^='tel:']):not([download])");
  internalLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");
      if (!targetUrl || targetUrl.startsWith("#")) return;

      // Don't intercept if modifier key is held (e.g. Cmd/Ctrl for new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      e.preventDefault();
      if (pageTransition) {
        pageTransition.classList.remove("loaded");
        pageTransition.classList.add("exiting");
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 180);
    });
  });

  // -----------------------------------------------------------------
  // 2. ACTIVE NAVIGATION HIGHLIGHT
  // -----------------------------------------------------------------
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === pageName || (pageName === "" && linkHref === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
    }
  });

  // -----------------------------------------------------------------
  // 3. MOBILE HAMBURGER MENU
  // -----------------------------------------------------------------
  const mobileToggle = document.getElementById("mobile-toggle-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileClose = document.getElementById("mobile-close-btn");
  const drawerBackdrop = document.getElementById("drawer-backdrop");

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add("open");
      mobileDrawer.setAttribute("aria-hidden", "false");
    }
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
    }
    if (drawerBackdrop) drawerBackdrop.classList.remove("active");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (mobileClose) mobileClose.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  // -----------------------------------------------------------------
  // 4. SYNTHESIZED WEB AUDIO API SOUND SYSTEM
  // -----------------------------------------------------------------
  let audioCtx = null;
  let audioEnabled = localStorage.getItem("vh_audio_enabled") === "true";
  const audioBtn = document.getElementById("audio-toggle-btn");
  const audioIcon = document.getElementById("audio-icon");

  function updateAudioUI() {
    if (!audioBtn) return;
    if (audioEnabled) {
      audioBtn.classList.add("active");
      if (audioIcon) audioIcon.className = "fa-solid fa-volume-high";
    } else {
      audioBtn.classList.remove("active");
      if (audioIcon) audioIcon.className = "fa-solid fa-volume-xmark";
    }
  }
  updateAudioUI();

  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  window.playUiTone = function (freq = 520, type = "sine", duration = 0.06, gainVal = 0.04) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      audioEnabled = !audioEnabled;
      localStorage.setItem("vh_audio_enabled", audioEnabled ? "true" : "false");
      updateAudioUI();
      if (audioEnabled) {
        initAudio();
        window.playUiTone(660, "sine", 0.08, 0.05);
      }
    });
  }

  // -----------------------------------------------------------------
  // 5. COMMAND PALETTE / QUICK NAVIGATOR (⌘K / Ctrl+K)
  // -----------------------------------------------------------------
  const cmdPalette = document.getElementById("cmd-palette");
  const cmdBtn = document.getElementById("cmd-palette-btn");
  const cmdInput = document.getElementById("cmd-search-input");
  const cmdResults = document.getElementById("cmd-results");

  function openCmd() {
    if (!cmdPalette) return;
    window.playUiTone(440, "sine", 0.06);
    cmdPalette.classList.add("open");
    cmdPalette.setAttribute("aria-hidden", "false");
    if (cmdInput) {
      cmdInput.value = "";
      filterCmd("");
      cmdInput.focus();
    }
    document.body.style.overflow = "hidden";
  }

  function closeCmd() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("open");
    cmdPalette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (cmdBtn) cmdBtn.addEventListener("click", openCmd);

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains("open")) {
        closeCmd();
      } else {
        openCmd();
      }
    }
    if (e.key === "Escape") {
      closeCmd();
      closeDrawer();
      const projModal = document.getElementById("project-modal");
      if (projModal && projModal.classList.contains("open")) {
        projModal.classList.remove("open");
        document.body.style.overflow = "";
      }
    }
  });

  if (cmdPalette) {
    cmdPalette.addEventListener("click", (e) => {
      if (e.target === cmdPalette) closeCmd();
    });
  }

  function filterCmd(val) {
    if (!cmdResults) return;
    const q = val.toLowerCase().trim();
    const items = cmdResults.querySelectorAll(".cmd-item");
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => filterCmd(e.target.value));
  }

  if (cmdResults) {
    cmdResults.querySelectorAll(".cmd-item").forEach(item => {
      item.addEventListener("click", () => {
        const url = item.getAttribute("data-url");
        if (url) {
          window.playUiTone(700, "sine", 0.05);
          closeCmd();
          window.location.href = url;
        }
      });
    });
  }
});
