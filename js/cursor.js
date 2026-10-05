/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — CUSTOM CURSOR SYSTEM
 * Inner dot + Smooth trailing outer ring + Interactive magnetic scaling
 * ===================================================================
 */

(function () {
  "use strict";

  // Only initialize on desktop devices with fine pointer
  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Attach hover interactions to interactive targets
  function bindInteractions() {
    const targets = document.querySelectorAll(
      "a, button, input, textarea, select, .nav-link, .interactive-card, .btn, .skill-node, .project-card, .achievement-card, .pillar-card"
    );

    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("cursor-hover");
        ring.classList.add("cursor-hover");

        // Subtle scale / glow depending on element type
        if (el.classList.contains("interactive-card") || el.classList.contains("project-card")) {
          ring.classList.add("cursor-card");
        }
      });

      el.addEventListener("mouseleave", () => {
        dot.classList.remove("cursor-hover");
        ring.classList.remove("cursor-hover");
        ring.classList.remove("cursor-card");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", bindInteractions);
  // Re-bind after dynamic content loads
  window.addEventListener("load", bindInteractions);
})();
