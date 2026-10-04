(() => {
  const root = window.Shopify?.routes?.root || '/';
  const cartUrl = (path) => `${root}${path}`;
  let lastTrigger = null;

  const getDrawer = () => document.querySelector('[data-cart-drawer]');
  const setBodyLock = (locked) => document.body.classList.toggle('cart-is-open', locked);
  const announce = (message) => {
    const status = getDrawer()?.querySelector('[data-cart-status]');
    if (status) status.textContent = message;
  };

  const openDrawer = () => {
    const drawer = getDrawer();
    if (!drawer) return;
    lastTrigger = document.activeElement;
    drawer.setAttribute('aria-hidden', 'false');
    setBodyLock(true);
    drawer.querySelector('[data-cart-close]')?.focus();
  };

  const closeDrawer = () => {
    const drawer = getDrawer();
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'true');
    setBodyLock(false);
    if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
  };

  const updateCartCount = (cart) => {
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      element.textContent = cart.item_count;
    });
  };

  const renderDrawer = async () => {
    const response = await fetch(`${root}?sections=cart-drawer`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Unable to refresh cart drawer.');
    const sections = await response.json();
    const markup = sections['cart-drawer'];
    const current = getDrawer();
    if (!markup || !current) return;
    current.outerHTML = markup;
  };

  const refreshCart = async (shouldOpen = false) => {
    const response = await fetch(cartUrl('cart.js'), { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Unable to refresh cart.');
    const cart = await response.json();
    updateCartCount(cart);
    await renderDrawer();
    announce('Cart updated.');
    if (shouldOpen) openDrawer();
  };

  const changeLine = async (lineKey, quantity) => {
    const response = await fetch(cartUrl('cart/change.js'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: lineKey, quantity })
    });
    if (!response.ok) throw new Error('Unable to update this cart line.');
    await refreshCart(document.body.classList.contains('cart-is-open'));
  };

  const addProduct = async (form) => {
    const response = await fetch(cartUrl('cart/add.js'), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    if (!response.ok) throw new Error('This product could not be added to the cart.');
    await refreshCart(true);
    announce('Product added to your cart.');
  };

  document.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-cart-toggle], [data-cart-close], [data-cart-increase], [data-cart-decrease], [data-cart-remove]');
    if (!target) return;

    if (target.matches('[data-cart-toggle]')) {
      event.preventDefault();
      openDrawer();
      return;
    }

    if (target.matches('[data-cart-close]')) {
      event.preventDefault();
      closeDrawer();
      return;
    }

    const lineKey = target.dataset.lineKey;
    if (!lineKey) return;
    const line = target.closest('[data-cart-line]');
    const quantityElement = line?.querySelector('[data-cart-quantity]');
    const currentQuantity = Number(quantityElement?.textContent || 1);
    const nextQuantity = target.matches('[data-cart-remove]') ? 0 : currentQuantity + (target.matches('[data-cart-increase]') ? 1 : -1);

    try {
      await changeLine(lineKey, Math.max(0, nextQuantity));
    } catch (error) {
      announce(error instanceof Error ? error.message : 'Unable to update the cart.');
    }
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('form[action*="/cart/add"]');
    if (!form || form.matches('[data-cart-form]')) return;

    event.preventDefault();
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      await addProduct(form);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add this product.';
      const drawer = getDrawer();
      if (drawer?.getAttribute('aria-hidden') === 'false') announce(message);
      else form.insertAdjacentHTML('afterend', `<p class="form-message form-message--error" role="alert">${message}</p>`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('cart-is-open')) closeDrawer();
  });
})();
