export function initAnimations() {
  // Prevent animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's a one-time animation, unobserve
        if (!entry.target.classList.contains('reveal-repeat')) {
          observer.unobserve(entry.target);
        }
      } else if (entry.target.classList.contains('reveal-repeat')) {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  // Select all elements with reveal classes
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(el => observer.observe(el));

  // Add parallax effect to floating images if any
  window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}
