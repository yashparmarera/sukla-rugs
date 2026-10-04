(() => {
  document.querySelectorAll('[data-product-section]').forEach((section) => {
    const media = Array.from(section.querySelectorAll('[data-product-media]'));
    const thumbnails = Array.from(section.querySelectorAll('[data-product-thumbnail]'));
    const variantSelect = section.querySelector('[data-product-variant]');
    const price = section.querySelector('[data-product-price]');
    const zoomButton = section.querySelector('[data-product-zoom]');
    const primary = section.querySelector('.product-gallery__primary');

    const showMedia = (index) => {
      media.forEach((item, itemIndex) => {
        const active = itemIndex === index;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-hidden', String(!active));
      });
      thumbnails.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
    };

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => showMedia(Number(thumbnail.dataset.index)));
    });

    variantSelect?.addEventListener('change', () => {
      const selected = variantSelect.options[variantSelect.selectedIndex];
      if (price && selected?.dataset.price) price.textContent = selected.dataset.price;
    });

    zoomButton?.addEventListener('click', () => {
      primary?.classList.toggle('is-zoomed');
      zoomButton.setAttribute('aria-label', primary?.classList.contains('is-zoomed') ? 'Close product image fullscreen' : 'Open product image fullscreen');
    });
  });
})();
