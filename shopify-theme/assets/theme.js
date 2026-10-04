(() => {
  document.documentElement.classList.add('js');

  const pushEvent = (event, payload = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: `shukla_${event}`, ...payload });
  };

  document.querySelectorAll('[data-analytics-product-view]').forEach((element) => {
    pushEvent('product_view', {
      product_id: element.dataset.productId,
      product_handle: element.dataset.productHandle
    });
  });

  document.addEventListener('click', (event) => {
    const productLink = event.target.closest('[data-analytics-product-link]');
    if (!productLink) return;
    const card = productLink.closest('[data-product-card]');
    if (card) {
      pushEvent('select_item', {
        product_id: card.dataset.productId,
        product_handle: card.dataset.productHandle
      });
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-product-form]');
    if (!form) return;
    pushEvent('add_to_cart', {
      product_id: form.querySelector('[name="id"]')?.value || ''
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-menu-close]');
    if (!target) return;

    const menu = target.closest('details');
    if (menu) menu.removeAttribute('open');
  });
})();
