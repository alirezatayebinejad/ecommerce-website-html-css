// Mobile menu toggle functionality with touch support
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  
  navMenu.classList.toggle('active');
  mobileToggle.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Enhanced mobile functionality
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.header-list-nav ul li a');
  const navMenu = document.getElementById('nav-menu');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  
  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = event.target.closest('.header-list') || event.target.closest('.mobile-menu-toggle');
    
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Optimize email field focus for mobile
  const emailField = document.getElementById("email-address-input");
  if (emailField) {
    // Only focus on desktop, avoid on mobile to prevent keyboard popup
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
      emailField.focus({
        preventScroll: true,
      });
    }
  }
  
  // Add touch feedback for buttons
  const buttons = document.querySelectorAll('button, .product-cart .buy-icon');
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Lazy loading for images (if browser doesn't support native lazy loading)
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // Smooth scrolling for mobile
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Optimize scroll performance
  let ticking = false;
  function updateScrollPosition() {
    // Add any scroll-based functionality here
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  }, { passive: true });
  
  // Add viewport height fix for mobile browsers
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);
});

// Service worker registration for PWA features (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
