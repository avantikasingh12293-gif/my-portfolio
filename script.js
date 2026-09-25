// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initNavigation();
  initProjectFilters();
  initModal();
  initContactForm();
  initScrollSpy();
});

// Navigation Bar Scrolling and Mobile Drawer
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuOpenIcon = document.getElementById('menuOpenIcon');
  const menuCloseIcon = document.getElementById('menuCloseIcon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      if (menuOpenIcon && menuCloseIcon) {
        if (isOpen) {
          menuOpenIcon.classList.add('hidden');
          menuCloseIcon.classList.remove('hidden');
        } else {
          menuOpenIcon.classList.remove('hidden');
          menuCloseIcon.classList.add('hidden');
        }
      }
    });

    // Close drawer when clicking any link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        if (menuOpenIcon && menuCloseIcon) {
          menuOpenIcon.classList.remove('hidden');
          menuCloseIcon.classList.add('hidden');
        }
      });
    });
  }
}

// Project Category Filters
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          const categories = card.getAttribute('data-category') || '';
          if (categories.includes(filterValue)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

// Contact Modal Handling
function initModal() {
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openContactModalBtn');
  const heroGetInTouch = document.getElementById('heroGetInTouch');
  const closeBtn = document.getElementById('closeModalBtn');

  function openModal(e) {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (heroGetInTouch) heroGetInTouch.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when clicking outside dialog
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Form Submission - Send email to avantika12294@gmail.com
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;

    const name = form.userName ? form.userName.value.trim() : '';
    const email = form.userEmail ? form.userEmail.value.trim() : '';
    const projectType = form.projectType ? form.projectType.value : 'General Inquiry';
    const message = form.userMessage ? form.userMessage.value.trim() : '';
    const targetEmail = 'avantika12294@gmail.com';

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i data-lucide="loader-2"></i>';
    if (window.lucide) window.lucide.createIcons();

    // Check if opened as raw local file (file://)
    const isLocalFile = window.location.protocol === 'file:';

    if (isLocalFile) {
      // Local HTML files cannot use FormSubmit server. Use direct pre-filled email client.
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const mailtoSubject = encodeURIComponent(`Portfolio Inquiry: ${projectType} from ${name}`);
      const mailtoBody = encodeURIComponent(`Hello Avantika,\n\nName: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}\n\nBest regards,\n${name}`);
      
      window.location.href = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      form.reset();
      const modal = document.getElementById('contactModal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      showToast('Opening email client to send to avantika12294@gmail.com');
      return;
    }

    // When running on a web server (localhost / live hosting / Vercel / Netlify / GitHub Pages)
    const payload = {
      name: name,
      email: email,
      project_interest: projectType,
      message: message,
      _subject: `New Portfolio Message from ${name} (${projectType})`,
      _template: 'table',
      _captcha: 'false'
    };

    fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();

        const modal = document.getElementById('contactModal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }

        showToast('Thank you! Your message has been sent to Avantika.');
        if (window.lucide) window.lucide.createIcons();
      })
      .catch(error => {
        console.warn('FormSubmit AJAX error, falling back to mailto:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        const mailtoSubject = encodeURIComponent(`Portfolio Inquiry: ${projectType} from ${name}`);
        const mailtoBody = encodeURIComponent(`Hello Avantika,\n\nName: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`);
        window.location.href = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

        form.reset();
        const modal = document.getElementById('contactModal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }

        showToast('Opening email client to send to avantika12294@gmail.com');
      });
  });
}

// Toast Notifications
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }
}

// Copy to Clipboard Utility
function copyText(text, successMessage) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopyText(text, successMessage);
    });
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(successMessage || 'Copied to clipboard!');
}

// Active Nav Link Scroll Spy
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
