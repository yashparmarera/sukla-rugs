(() => {
  const entrance = document.querySelector('[data-brand-entrance]');
  if (!entrance) return;

  const homePath = entrance.dataset.homePath || '/';
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const normalizedHomePath = homePath.replace(/\/$/, '') || '/';
  if (currentPath !== normalizedHomePath) {
    entrance.remove();
    return;
  }

  const sessionKey = entrance.dataset.sessionKey || 'shukla-entry-seen';
  let hasBeenSeen = false;
  try {
    hasBeenSeen = window.sessionStorage.getItem(sessionKey) === 'true';
  } catch (error) {
    hasBeenSeen = false;
  }

  if (hasBeenSeen) {
    entrance.remove();
    return;
  }

  const layers = Array.from(entrance.querySelectorAll('[data-entrance-image]'));
  const progressItems = Array.from(entrance.querySelectorAll('[data-entrance-progress]'));
  const previousButton = entrance.querySelector('[data-entrance-previous]');
  const nextButton = entrance.querySelector('[data-entrance-next]');
  const enterButtons = Array.from(entrance.querySelectorAll('[data-enter-website]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slideDuration = Number(entrance.dataset.slideDuration) || 2200;
  let activeIndex = 0;
  let timer;
  let isLeaving = false;

  const rememberVisit = () => {
    try {
      window.sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      // Continue the transition when storage is unavailable.
    }
  };

  const updateSlide = (nextIndex) => {
    activeIndex = (nextIndex + layers.length) % layers.length;
    layers.forEach((layer, index) => {
      const active = index === activeIndex;
      layer.classList.toggle('is-active', active);
      layer.setAttribute('aria-hidden', String(!active));
    });
    progressItems.forEach((item, index) => {
      item.classList.toggle('is-active', index <= activeIndex);
    });
  };

  const scheduleNext = () => {
    window.clearTimeout(timer);
    if (reducedMotion || isLeaving || activeIndex >= layers.length - 1) return;
    timer = window.setTimeout(() => {
      updateSlide(activeIndex + 1);
      scheduleNext();
    }, slideDuration);
  };

  const leave = (event) => {
    const target = event.currentTarget;
    const destination = target.getAttribute('href');
    const isSamePage = !destination || destination === homePath || destination === window.location.pathname;
    if (isSamePage) event.preventDefault();

    rememberVisit();
    isLeaving = true;
    window.clearTimeout(timer);
    entrance.classList.add('is-leaving');
    if (isSamePage) {
      window.setTimeout(() => entrance.remove(), reducedMotion ? 1 : 850);
    }
  };

  enterButtons.forEach((button) => button.addEventListener('click', leave));
  previousButton?.addEventListener('click', () => {
    updateSlide(activeIndex - 1);
    scheduleNext();
  });
  nextButton?.addEventListener('click', () => {
    updateSlide(activeIndex + 1);
    scheduleNext();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !isLeaving) {
      event.preventDefault();
      enterButtons[0]?.click();
    }
  }, { once: false });

  updateSlide(0);
  scheduleNext();
})();
