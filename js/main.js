/**
 * LearnX Academy - Interactive Client Scripts
 * Handles mobile navigation, smooth scrolling, scrollspy,
 * form validation with animated feedback, dynamic stats counters,
 * and micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initContactForm();
  initCourseEnrollButtons();
  initHeroCardInteraction();
  initDynamicYear();
});

/* ==========================================================================
   1. NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ==========================================================================
   2. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  if (!hamburgerBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = hamburgerBtn.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking outside of the drawer
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('is-open') &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length) return;

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   4. STATS ANIMATED COUNTERS
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const easeProgress = 1 - (1 - progress) * (1 - progress);

        if (isDecimal) {
          const current = (easeProgress * target).toFixed(1);
          el.textContent = `${current}/5`;
        } else if (target >= 1000) {
          const current = Math.floor(easeProgress * target);
          el.textContent = `${current.toLocaleString()}+`;
        } else {
          const current = Math.floor(easeProgress * target);
          el.textContent = el.textContent.includes('%') ? `${current}%` : `${current}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. CONTACT FORM VALIDATION & HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBanner = document.getElementById('formSuccessBanner');
  const resetBtn = document.getElementById('resetFormBtn');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Real-time input validation to clear error states
  fullNameInput.addEventListener('input', () => validateName(false));
  emailInput.addEventListener('input', () => validateEmail(false));
  messageInput.addEventListener('input', () => validateMessage(false));

  function setFieldError(fieldId, errorMsg) {
    const group = document.getElementById(`group-${fieldId}`);
    const feedback = document.getElementById(`feedback-${fieldId}`);
    if (group && feedback) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      feedback.textContent = errorMsg;
      feedback.style.display = 'block';
    }
  }

  function setFieldSuccess(fieldId) {
    const group = document.getElementById(`group-${fieldId}`);
    const feedback = document.getElementById(`feedback-${fieldId}`);
    if (group && feedback) {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  }

  function validateName(showSuccess = true) {
    const val = fullNameInput.value.trim();
    if (!val) {
      setFieldError('name', 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setFieldError('name', 'Name must be at least 2 characters long.');
      return false;
    }
    if (showSuccess) setFieldSuccess('name');
    return true;
  }

  function validateEmail(showSuccess = true) {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setFieldError('email', 'Please provide your email address.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setFieldError('email', 'Please enter a valid email address (e.g., name@domain.com).');
      return false;
    }
    if (showSuccess) setFieldSuccess('email');
    return true;
  }

  function validateMessage(showSuccess = true) {
    const val = messageInput.value.trim();
    if (!val) {
      setFieldError('message', 'Please include a message or inquiry.');
      return false;
    }
    if (val.length < 10) {
      setFieldError('message', `Please provide more details (${10 - val.length} more characters).`);
      return false;
    }
    if (showSuccess) setFieldSuccess('message');
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(true);
    const isEmailValid = validateEmail(true);
    const isMessageValid = validateMessage(true);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showToast('Please fix the errors in the form before submitting.', 'info');
      return;
    }

    // Enter loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Update success banner content
      const nameVal = fullNameInput.value.trim();
      const emailVal = emailInput.value.trim();
      
      const successNameEl = document.getElementById('successSenderName');
      const successEmailEl = document.getElementById('successSenderEmail');
      if (successNameEl) successNameEl.textContent = nameVal;
      if (successEmailEl) successEmailEl.textContent = emailVal;

      // Hide form and show success banner
      form.style.display = 'none';
      if (successBanner) {
        successBanner.style.display = 'flex';
      }

      showToast(`🎉 Thank you ${nameVal}! Your inquiry has been sent to admissions.`, 'success');
    }, 850);
  });

  // Reset form handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      ['name', 'email', 'message'].forEach(fieldId => {
        const group = document.getElementById(`group-${fieldId}`);
        const feedback = document.getElementById(`feedback-${fieldId}`);
        if (group) group.classList.remove('has-error', 'has-success');
        if (feedback) {
          feedback.textContent = '';
          feedback.style.display = 'none';
        }
      });
      if (successBanner) successBanner.style.display = 'none';
      form.style.display = 'flex';
      fullNameInput.focus();
    });
  }
}

/* ==========================================================================
   6. COURSE ENROLL BUTTONS AUTO-SELECT PROGRAM
   ========================================================================== */
function initCourseEnrollButtons() {
  const courseButtons = document.querySelectorAll('.course-btn');
  const programSelect = document.getElementById('program');
  const contactForm = document.getElementById('contact');

  courseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseName = btn.getAttribute('data-course');
      if (programSelect && courseName) {
        // Find matching option
        for (let i = 0; i < programSelect.options.length; i++) {
          if (programSelect.options[i].text.includes(courseName) || programSelect.options[i].value.includes(courseName)) {
            programSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Smooth scroll to contact and focus name input
      if (contactForm) {
        setTimeout(() => {
          const nameInput = document.getElementById('fullName');
          if (nameInput) nameInput.focus();
        }, 400);
      }

      showToast(`Selected course: ${courseName}. Complete the form to enroll!`, 'info');
    });
  });
}

/* ==========================================================================
   7. HERO CARD INTERACTIVE DEMO LAB
   ========================================================================== */
function initHeroCardInteraction() {
  const continueBtn = document.getElementById('continueLearningBtn');
  const livePercent = document.getElementById('livePercent');
  const progressFill = document.querySelector('.progress-fill');
  const xpVal = document.querySelector('.xp-value');

  if (!continueBtn) return;

  let currentPercent = 82;
  let currentXp = 1850;

  continueBtn.addEventListener('click', () => {
    if (currentPercent < 100) {
      currentPercent = Math.min(100, currentPercent + 6);
      currentXp += 150;

      if (livePercent) livePercent.textContent = `${currentPercent}%`;
      if (progressFill) progressFill.style.width = `${currentPercent}%`;
      if (xpVal) xpVal.textContent = `+${currentXp.toLocaleString()} XP`;

      if (currentPercent === 100) {
        showToast('🏆 Milestone Completed! You unlocked the Transformer Certificate!', 'success');
        continueBtn.innerHTML = `<span>Module Completed!</span> ⭐`;
        continueBtn.style.borderColor = 'var(--emerald-accent)';
      } else {
        showToast(`⚡ +150 XP gained! Module progress: ${currentPercent}%`, 'info');
      }
    } else {
      showToast('🎉 You have completed this module! Check out the next syllabus.', 'info');
    }
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  const iconSvg = type === 'success'
    ? `<svg viewBox="0 0 20 20" fill="#10b981" width="20" height="20" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`
    : `<svg viewBox="0 0 20 20" fill="#60a5fa" width="20" height="20" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger enter animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 400);
  }, 4500);
}

/* ==========================================================================
   9. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
