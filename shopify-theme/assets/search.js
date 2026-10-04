(() => {
  document.querySelectorAll('[data-predictive-search-form]').forEach((form) => {
    const input = form.querySelector('[data-predictive-search-input]');
    const results = form.parentElement.querySelector('[data-predictive-results]');
    if (!input || !results) return;

    let timer;
    let requestId = 0;

    const renderResults = (payload) => {
      const products = payload.resources?.results?.products || [];
      const collections = payload.resources?.results?.collections || [];
      const articles = payload.resources?.results?.articles || [];
      const pages = payload.resources?.results?.pages || [];
      const items = [
        ...collections.map((item) => ({ ...item, kind: 'Collection' })),
        ...products.map((item) => ({ ...item, kind: 'Product' })),
        ...articles.map((item) => ({ ...item, kind: 'Article' })),
        ...pages.map((item) => ({ ...item, kind: 'Page' }))
      ].slice(0, 8);

      if (!items.length) {
        results.innerHTML = '<p class="predictive-search__empty">No matching results.</p>';
        return;
      }

      results.innerHTML = items.map((item) => `
        <a class="predictive-search__item" href="${item.url}">
          ${item.image ? `<img src="${item.image}" alt="" loading="lazy">` : ''}
          <span><small>${item.kind}</small><strong>${item.title}</strong></span>
        </a>
      `).join('');
    };

    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      const query = input.value.trim();
      if (query.length < 2) {
        results.innerHTML = '';
        return;
      }

      timer = window.setTimeout(async () => {
        const currentRequest = ++requestId;
        results.innerHTML = '<p class="predictive-search__loading">Searching...</p>';
        const url = new URL(`${window.Shopify?.routes?.root || '/'}search/suggest.json`, window.location.origin);
        url.searchParams.set('q', query);
        url.searchParams.set('resources[type]', 'product,collection,article,page');
        url.searchParams.set('resources[limit]', '4');
        try {
          const response = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error('Search request failed');
          const payload = await response.json();
          if (currentRequest === requestId) renderResults(payload);
        } catch (error) {
          if (currentRequest === requestId) results.innerHTML = '<p class="predictive-search__empty">Search is temporarily unavailable.</p>';
        }
      }, 220);
    });
  });
})();
