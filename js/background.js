/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — "AURORA DIGITAL" BACKGROUND ENGINE
 * Multi-layer Canvas: Ambient Aurora Waves, Responsive Particles, Light Blobs & Grid
 * ===================================================================
 */

(function () {
  "use strict";

  const canvas = document.getElementById("aurora-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let animId = null;

  // Responsive state
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  // Mouse physics with inertia / smoothing
  const mouse = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.35,
    radius: isMobile ? 80 : 160
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Floating particles
  let particles = [];
  const PARTICLE_COUNT = isMobile ? 24 : 55;

  class FloatingParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4 - 0.15; // gentle upward drift
      this.alpha = Math.random() * 0.5 + 0.15;
      this.hue = Math.random() > 0.6 ? 174 : Math.random() > 0.5 ? 230 : 270; // cyan, electric blue, violet
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Subtle mouse push
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.2;
        this.y -= (dy / dist) * force * 1.2;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new FloatingParticle());
    }
  }
  initParticles();

  // Dynamic Aurora Plasma Blobs
  let time = 0;

  function renderAuroraBlobs() {
    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    time += 0.008;

    // Base background fill (Midnight Navy)
    ctx.fillStyle = "#070b19";
    ctx.fillRect(0, 0, width, height);

    // Aurora Blob 1: Deep Violet / Indigo (Upper Left to Center)
    const blob1X = width * 0.3 + Math.sin(time * 0.8) * (width * 0.1) + (mouse.x - width * 0.5) * 0.08;
    const blob1Y = height * 0.28 + Math.cos(time * 0.7) * (height * 0.08) + (mouse.y - height * 0.5) * 0.08;
    const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 10, blob1X, blob1Y, width * 0.45);
    grad1.addColorStop(0, "rgba(114, 9, 183, 0.28)"); // Deep violet
    grad1.addColorStop(0.5, "rgba(67, 97, 238, 0.14)"); // Indigo
    grad1.addColorStop(1, "rgba(7, 11, 25, 0)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    // Aurora Blob 2: Electric Cyan / Blue (Center Right)
    const blob2X = width * 0.72 + Math.cos(time * 0.6) * (width * 0.12) - (mouse.x - width * 0.5) * 0.06;
    const blob2Y = height * 0.42 + Math.sin(time * 0.75) * (height * 0.1) - (mouse.y - height * 0.5) * 0.06;
    const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 20, blob2X, blob2Y, width * 0.4);
    grad2.addColorStop(0, "rgba(0, 245, 212, 0.22)"); // Electric cyan
    grad2.addColorStop(0.55, "rgba(0, 180, 216, 0.1)"); // Soft blue
    grad2.addColorStop(1, "rgba(7, 11, 25, 0)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // Aurora Blob 3: Soft Magenta Accent (Lower center)
    const blob3X = width * 0.5 + Math.sin(time * 0.5) * (width * 0.15);
    const blob3Y = height * 0.78 + Math.cos(time * 0.6) * (height * 0.08);
    const grad3 = ctx.createRadialGradient(blob3X, blob3Y, 10, blob3X, blob3Y, width * 0.35);
    grad3.addColorStop(0, "rgba(247, 37, 133, 0.12)"); // Soft magenta accent
    grad3.addColorStop(0.6, "rgba(114, 9, 183, 0.05)");
    grad3.addColorStop(1, "rgba(7, 11, 25, 0)");
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, width, height);

    // Interactive cursor spotlight (subtle luminous glow under cursor)
    const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
    cursorGlow.addColorStop(0, "rgba(0, 245, 212, 0.07)");
    cursorGlow.addColorStop(0.5, "rgba(67, 97, 238, 0.04)");
    cursorGlow.addColorStop(1, "rgba(7, 11, 25, 0)");
    ctx.fillStyle = cursorGlow;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw delicate digital connecting threads between nearby particles
  function drawParticleConnections() {
    const maxDist = isMobile ? 85 : 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    if (document.hidden) {
      animId = requestAnimationFrame(loop);
      return;
    }

    renderAuroraBlobs();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawParticleConnections();

    if (!isReducedMotion) {
      animId = requestAnimationFrame(loop);
    }
  }

  if (!isReducedMotion) {
    animId = requestAnimationFrame(loop);
  } else {
    // Render single static frame
    renderAuroraBlobs();
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    drawParticleConnections();
  }

})();
