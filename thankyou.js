/**
 * AmarVed Recovery - Thank You Page Interactive Scripts
 * Pure JS (no external libraries) for high performance and fast loading.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Scroll Reveal Observer
  initScrollReveal();

  // Initialize Canvas Confetti
  initConfetti();

  // Initialize Button Micro-interactions
  initButtonSpotlight();
});

/**
 * 1. Intersection Observer for Scroll Reveal
 * Fades in cards dynamically as the user scrolls.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // triggers slightly before entering viewport fully
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

/**
 * 2. Canvas-based Premium Confetti Engine
 * Simulates professional-grade celebratory dual-cannon bursts.
 */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let particles = [];
  
  const colors = [
    '#14B8A6', // Teal
    '#0D9488', // Dark Teal
    '#10B981', // Green
    '#059669', // Dark Green
    '#F59E0B', // Amber
    '#FCD34D', // Gold
    '#38BDF8'  // Soft Blue
  ];

  // Set canvas bounds
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle Class Definition
  class Particle {
    constructor(x, y, angle, spread) {
      this.x = x;
      this.y = y;
      
      // Velocities
      const velocity = 12 + Math.random() * 16; // Random launch speed
      const radians = (angle + (Math.random() * spread - spread / 2)) * Math.PI / 180;
      this.vx = Math.cos(radians) * velocity;
      this.vy = Math.sin(radians) * velocity;

      // Sizing
      this.width = 6 + Math.random() * 8;
      this.height = 10 + Math.random() * 10;
      
      // Rotation and wobble
      this.rotation = Math.random() * 360;
      this.rotationSpeed = -4 + Math.random() * 8;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = 0.05 + Math.random() * 0.05;

      // Visuals
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      // Physics properties
      this.gravity = 0.25 + Math.random() * 0.2;
      this.drag = 0.94 + Math.random() * 0.03;
      this.opacity = 1;
      this.fadeSpeed = 0.008 + Math.random() * 0.008;
    }

    update() {
      // Apply drag/friction
      this.vx *= this.drag;
      this.vy *= this.drag;
      
      // Apply gravity
      this.vy += this.gravity;

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Rotation and wobble
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;

      // Fade out
      this.opacity -= this.fadeSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      
      // Add wobble for 3D paper rotation illusion
      const currentWidth = this.width * Math.sin(this.wobble);
      
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      
      // Draw rectangular confetti piece
      ctx.fillRect(-currentWidth / 2, -this.height / 2, currentWidth, this.height);
      ctx.restore();
    }
  }

  // Create Confetti Burst Cannons
  function fireCannons() {
    const bottom = canvas.height + 20;
    
    // Left Cannon (fires up and right)
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(0, bottom, -60, 45));
    }
    
    // Right Cannon (fires up and left)
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(canvas.width, bottom, -120, 45));
    }
    
    // Center cluster (ambient spray)
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(canvas.width / 2, bottom - 100, -90, 80));
    }
  }

  // Animation Loop
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and Draw particles
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(tick);
    } else {
      // Cancel and cleanup when all particles have faded away
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    }
  }

  // Fire confetti bursts sequentially
  fireCannons();
  tick();

  // Secondary delayed burst for a premium "celebratory wave" feel
  setTimeout(() => {
    if (document.hidden) return; // Don't fire if user has swapped tabs
    fireCannons();
    if (particles.length > 0 && !animationId) {
      tick();
    }
  }, 750);
}

/**
 * 3. Button Spotlight Gradient Interaction
 * Creates a premium radial lighting gradient that follows the cursor on hover.
 */
function initButtonSpotlight() {
  const buttons = document.querySelectorAll('.btn-primary');

  // Dynamically inject spotlight style variables to CSS for button spotlight
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .btn-primary {
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      top: var(--spotlight-y, -100%);
      left: var(--spotlight-x, -100%);
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      transition: opacity 0.3s;
      opacity: 0;
    }
    .btn-primary:hover::after {
      opacity: 1;
    }
  `;
  document.head.appendChild(styleEl);

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      btn.style.setProperty('--spotlight-x', `${x}px`);
      btn.style.setProperty('--spotlight-y', `${y}px`);
    });
  });
}
