const DEV = false; // produção

// bt-boot - loader específico para Mizz
if (!window.__btInit) {
  window.__btInit = true;

  (async () => {
    const host = location.hostname;

    // Validação de domínio específico
    const allowedHosts = ['mizz.com.br', 'www.mizz.com.br'];
    if (!allowedHosts.some(allowed => host.includes(allowed))) {
      console.warn('[bt-theme-mizz] Domínio não autorizado:', host);
      return;
    }

    try {
      const tenant = 'mizz';
      document.documentElement.setAttribute('data-bt', tenant);

      // Carregar CSS base (tema base opcional)
      const baseCss = new URL('/bt/base.css', import.meta.url).href;
      const pre = Object.assign(document.createElement('link'), {
        rel: 'preload',
        as: 'style',
        href: baseCss,
      });
      const link = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: baseCss,
      });
      document.head.append(pre, link);

      // Carregar CSS específico do tema
      const themeCss = new URL('/bt/bt-overrides.mizz.v1.css', import.meta.url).href;
      const themePre = Object.assign(document.createElement('link'), {
        rel: 'preload',
        as: 'style',
        href: themeCss,
      });
      const themeLink = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: themeCss,
      });
      document.head.append(themePre, themeLink);

      // Importar blocos (serão code-split em chunks pelo Vite)
      const faqModule = () => import('../blocks/faq.js');
      const carouselModule = () => import('../blocks/carousel.js');

      // Montar blocos por âncoras
      document.querySelectorAll('[data-bt-block]').forEach(async el => {
        const kind = el.getAttribute('data-bt-block');
        let mod = null;
        if (kind === 'faq') {
          mod = await faqModule();
        } else if (kind === 'carousel') {
          mod = await carouselModule();
        } else {
          console.warn('[bt-theme-mizz] Bloco desconhecido:', kind);
          return;
        }
        if (typeof mod.mount === 'function') mod.mount(el, { tenant, host });
      });
    } catch (err) {
      console.error('[bt-theme-mizz] boot error:', err);
    }
  })();
}
