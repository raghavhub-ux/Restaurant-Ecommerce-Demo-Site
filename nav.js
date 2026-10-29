// ==========================================
// THE SAFFRON PLATE — MINIMAL NAVIGATION SCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header') || document.querySelector('.navbar-overlay');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
      }
    });

    // Close when clicking any menu link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
      });
    });
  }
});
