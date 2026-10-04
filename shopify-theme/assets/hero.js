(() => {
  const initializeHero = (carousel) => {
    if (carousel.dataset.heroInitialized === 'true') return;
    const layers = Array.from(carousel.querySelectorAll('[data-hero-image]'));
    if (layers.length < 2) return;
    const previousButton = carousel.querySelector('[data-hero-previous]');
    const nextButton = carousel.querySelector('[data-hero-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer;

    carousel.dataset.heroInitialized = 'true';

    const updateSlide = (nextIndex) => {
      activeIndex = (nextIndex + layers.length) % layers.length;
      layers.forEach((layer, index) => {
        const active = index === activeIndex;
        layer.classList.toggle('is-active', active);
        layer.setAttribute('aria-hidden', String(!active));
      });
    };

    const restartAutoplay = () => {
      if (reducedMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(() => moveSlide(1), 4500);
    };

    const moveSlide = (direction) => {
      updateSlide(activeIndex + direction);
      restartAutoplay();
    };

    previousButton?.addEventListener('click', () => moveSlide(-1));
    nextButton?.addEventListener('click', () => moveSlide(1));
    restartAutoplay();
  };

  const initializeAllHeroes = () => {
    document.querySelectorAll('[data-hero-carousel]').forEach(initializeHero);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllHeroes, { once: true });
  } else {
    initializeAllHeroes();
  }

  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll?.('[data-hero-carousel]').forEach(initializeHero);
  });
})();
