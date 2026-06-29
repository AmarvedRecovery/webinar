/**
 * AmarVed Recovery Landing Page JavaScript
 * Handles Countdown Timer, FAQ Accordion, Scroll Animation Reveals, 
 * Mobile Sticky CTA visibility, and Button hover ripples.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initCountdown();
  initAccordion();
  initScrollReveal();
  initStickyCTA();
  initButtonRipple();
});

/**
 * 1. Countdown Timer
 * Smart countdown targeting a customizable date.
 * If target date has passed, it auto-shifts to the next Sunday at 11:00 AM (Evergreen mode).
 */
function initCountdown() {
  const timerElements = {
    days: document.getElementById('timer-days'),
    hours: document.getElementById('timer-hours'),
    minutes: document.getElementById('timer-minutes'),
    seconds: document.getElementById('timer-seconds')
  };

  if (!timerElements.days) return;

  // Configuration: Set target date (Format: YYYY-MM-DDTHH:MM:SS)
  let targetDate = getNextWebinarDate();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Webinar starts or has passed. Recalculate to next target to prevent showing negative numbers
      targetDate = getNextWebinarDate();
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format numbers to always be 2 digits
    timerElements.days.textContent = String(days).padStart(2, '0');
    timerElements.hours.textContent = String(hours).padStart(2, '0');
    timerElements.minutes.textContent = String(minutes).padStart(2, '0');
    timerElements.seconds.textContent = String(seconds).padStart(2, '0');
  }

  // Helper to get next Sunday at 11:00 AM
  function getNextWebinarDate() {
    const today = new Date();
    const resultDate = new Date();
    
    // Find days until next Sunday (0 is Sunday)
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    
    resultDate.setDate(today.getDate() + daysUntilSunday);
    resultDate.setHours(11, 0, 0, 0); // 11:00 AM

    // If today is Sunday and it's already past 11:00 AM, target NEXT Sunday
    if (dayOfWeek === 0 && today.getHours() >= 11) {
      resultDate.setDate(resultDate.getDate() + 7);
    }
    
    return resultDate.getTime();
  }

  // Run immediately and then start interval
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * 2. FAQ Accordion
 * Standard dynamic collapse/expand accordion with accessibility attributes (ARIA).
 */
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all open items first for a clean single-open behavior
      faqItems.forEach(el => {
        el.classList.remove('active');
        const elHeader = el.querySelector('.faq-header');
        const elBody = el.querySelector('.faq-body');
        if (elHeader) elHeader.setAttribute('aria-expanded', 'false');
        if (elBody) {
          elBody.style.maxHeight = null;
          elBody.setAttribute('aria-hidden', 'true');
        }
      });

      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.setAttribute('aria-hidden', 'false');
        // Set max height dynamically based on scrollHeight to trigger CSS transition
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 3. Scroll Reveal Animations
 * Uses IntersectionObserver to trigger animations when elements enter the viewport.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

/**
 * 4. Sticky Mobile CTA Bar
 * Shows the sticky bar at the bottom of the screen when user scrolls past Hero CTA,
 * and hides it when user reaches the Final CTA area to prevent duplicate inputs.
 */
function initStickyCTA() {
  const stickyBar = document.getElementById('mobile-sticky-cta');
  const finalCTA = document.getElementById('final-cta');

  if (!stickyBar) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const finalCtaTop = finalCTA ? finalCTA.offsetTop : document.body.scrollHeight;

    // Show after scrolling past Hero (500px) and hide before reaching the final CTA block
    if (scrollY > 500 && scrollY < (finalCtaTop - 600)) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  });
}

/**
 * 5. Button Ripple Effect
 * Premium UX detail that adds a ripple circle inside buttons when clicked.
 */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}
