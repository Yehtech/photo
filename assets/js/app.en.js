/* =========================================================
   LUMEN Photography — 網站主程式
   內容全部來自 /content/*.json（由 Pages CMS 後台編輯）
   一般更新作品不需要修改這個檔案。
   ========================================================= */
(() => {
  'use strict';
  const isEnglish = document.documentElement.lang === 'en';
  const assetPrefix = isEnglish ? '../' : '';


  /* ---------- 分類（需與 .pages.yml 的 category 選項一致） ---------- */
  const CATEGORIES = [
    { key: 'portrait',   label: "Portraits" },
    { key: 'wedding',    label: "Weddings" },
    { key: 'commercial', label: "Commercial & Products" },
    { key: 'landscape',  label: "Landscape & Travel" },
    { key: 'event',      label: "Events" },
    { key: 'street',     label: "Street & Documentary" },
  ];
  const catLabel = (key) => (CATEGORIES.find((c) => c.key === key) || {}).label || '';

  const NAV = [
    { href: 'index.html',    label: "Home",      page: 'home' },
    { href: 'works.html',    label: "Portfolio",    page: 'works' },
    { href: 'about.html',    label: "About Me",    page: 'about' },
    { href: 'services.html', label: "Services & Pricing", page: 'services' },
    { href: 'contact.html',  label: "Contact",    page: 'contact' },
  ];

  const ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.1 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.2.6 2.9.3.8.7 1.5 1.4 2.1.7.7 1.3 1.1 2.1 1.4.8.3 1.6.5 2.9.6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.3 2.9-.6.8-.3 1.5-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.6-2.9-.3-.8-.7-1.5-1.4-2.1C21.4 1.3 20.7.9 19.9.6 19.1.3 18.2.1 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>',
    line: '<svg viewBox="0 0 24 24"><path d="M19.4 9.9c.4 0 .6.3.6.6s-.3.6-.6.6h-1.7v1.1h1.7c.4 0 .6.3.6.6 0 .3-.3.6-.6.6H17c-.3 0-.6-.3-.6-.6V8.2c0-.3.3-.6.6-.6h2.4c.4 0 .6.3.6.6 0 .4-.3.6-.6.6h-1.7v1.1h1.7zm-3.9 2.9c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.6.6-.3 0-.6-.3-.6-.6V8.2c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.2c0-.3.3-.6.6-.6.3 0 .6.3.6.6v4.6zm-5.8 0c0 .3-.3.6-.6.6-.3 0-.6-.3-.6-.6V8.2c0-.3.3-.6.6-.6.3 0 .6.3.6.6v4.6zm-2.4.6H4.9c-.3 0-.6-.3-.6-.6V8.2c0-.3.3-.6.6-.6.3 0 .6.3.6.6v4h1.7c.4 0 .6.3.6.6 0 .3-.2.6-.5.6M24 10.3C24 4.9 18.6.5 12 .5S0 4.9 0 10.3c0 4.8 4.3 8.9 10.1 9.6.4.1.9.3 1.1.6.1.3.1.8 0 1.1l-.2 1c-.1.3-.2 1.2 1.1.7 1.3-.6 7-4.1 9.6-7.1 1.6-1.8 2.3-3.7 2.3-5.9"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.5l10 6.3 10-6.3V6H2zm20 2.8-9.5 6a1 1 0 0 1-1 0L2 8.8V18h20V8.8z"/></svg>',
  };

  /* ---------- 小工具 ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paragraphs = (text) => String(text || '').split(/\n+/).map((t) => t.trim()).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join('');

  // 後台寫入的路徑是 /images/uploads/xxx.jpg，轉成相對路徑以相容 GitHub Pages 子路徑
  const src = (url) => {
    if (!url) return '';
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url;
    return assetPrefix + url.replace(/^\/+/, '');
  };
  // 縮圖（由 GitHub Action 自動產生於 images/thumbs/），找不到時自動改用原圖
  const thumb = (url) => {
    const s = src(url);
    return s.startsWith(assetPrefix + 'images/uploads/') ? s.replace('images/uploads/', 'images/thumbs/') : s;
  };
  const imgTag = (url, { alt = '', useThumb = false, eager = false, cls = '' } = {}) => {
    const full = src(url);
    const s = useThumb ? thumb(url) : full;
    const fallback = s !== full ? ` onerror="this.onerror=null;this.src='${esc(full)}'"` : '';
    const dimensions = window.PHOTO_IMAGE_SIZES?.[s.replace(/^\.\.\//, '')];
    const size = dimensions ? ` width="${dimensions.width}" height="${dimensions.height}"` : '';
    return `<img src="${esc(s)}" alt="${esc(alt)}"${size}${cls ? ` class="${cls}"` : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async"${fallback}>`;
  };

  const cache = {};
  const load = (name) => {
    if (!cache[name]) {
      cache[name] = fetch(`${isEnglish ? '../content/en/' : 'content/'}${name}.json`, { cache: 'no-cache' }).then((r) => {
        if (!r.ok) throw new Error(`Unable to load content/${name}.json`);
        return r.json();
      });
    }
    return cache[name];
  };

  const setMeta = (site, pageTitle, desc) => {
    const initialTitle = document.querySelector('title')?.dataset.seoTitle;
    const dynamicAlbum = document.body.dataset.page === 'album';
    document.title = !dynamicAlbum && initialTitle ? initialTitle : pageTitle ? `${pageTitle}｜${site.name}` : `${site.name} ${site.nameEn || ''}`.trim();
    let m = $('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = desc || m.dataset.seoDescription || site.description || '';
    for (const [key, value] of [['og:title', document.title], ['og:description', m.content]]) {
      const tag = document.querySelector(`meta[property="${key}"]`);
      if (tag) tag.content = value;
    }
  };

  const socialLinks = (c = {}) => {
    const items = [];
    if (c.instagram) items.push(['instagram', c.instagram, 'Instagram']);
    if (c.facebook) items.push(['facebook', c.facebook, 'Facebook']);
    if (c.lineUrl) items.push(['line', c.lineUrl, 'LINE']);
    if (c.email) items.push(['email', `mailto:${c.email}`, 'Email']);
    return items.map(([k, href, label]) =>
      `<a href="${esc(href)}" aria-label="${label}" ${k === 'email' ? '' : 'target="_blank" rel="noopener"'}>${ICONS[k]}</a>`).join('');
  };

  const brandHTML = (site) => site.logo
    ? `<img src="${esc(src(site.logo))}" alt="${esc(site.name)}">`
    : `${esc(site.name)}${site.nameEn ? ` <small>${esc(site.nameEn)}</small>` : ''}`;

  /* ---------- Header / Footer ---------- */
  function renderChrome(site) {
    const page = document.body.dataset.page;
    const header = $('#site-header');
    header.innerHTML = `
      <div class="container">
        <a class="brand" href="index.html">${brandHTML(site)}</a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
        <nav class="nav">${NAV.map((n) => `<a href="${n.href}" class="${n.page === page || (page === 'album' && n.page === 'works') ? 'is-active' : ''}">${n.label}</a>`).join('')}</nav>
      </div>`;

    const toggle = $('.nav-toggle', header);
    const nav = $('.nav', header);
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // 首頁 header 在大圖上方時透明
    const transparent = page === 'home';
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 10);
      if (transparent) header.classList.toggle('is-transparent', y < window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    $('#site-footer').innerHTML = `
      <div class="container">
        <a class="brand" href="index.html">${brandHTML(site)}</a>
        <div class="social">${socialLinks(site.contact)}</div>
        <small>© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</small>
      </div>`;
  }

  /* ---------- 進場動畫 ---------- */
  function observeReveal(root = document) {
    const els = root.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  const albumCard = (a, i = 0) => `
    <a class="album-card reveal" style="transition-delay:${(i % 3) * 90}ms" href="album-${encodeURIComponent(a.slug)}.html">
      <div class="album-card__img">${imgTag(a.cover || (a.photos || [])[0], { alt: a.title, useThumb: true })}</div>
      <div class="album-card__body">
        <h3 class="album-card__title">${esc(a.title)}</h3>
        <span class="album-card__cat">${esc(catLabel(a.category))}</span>
      </div>
    </a>`;

  /* ========================================================
     各頁面
     ======================================================== */
  const pages = {
    /* ---------- 首頁 ---------- */
    async home(site) {
      const albums = await load('albums');
      setMeta(site);
      const heroImgs = (site.heroImages || []).filter(Boolean);
      const featured = albums.filter((a) => a.featured);
      const list = (featured.length ? featured : albums).slice(0, 6);

      $('#app').innerHTML = `
        <section class="hero">
          ${heroImgs.map((u, i) => `<div class="hero-slide${i === 0 ? ' is-active' : ''}">${imgTag(u, { alt: site.name, eager: i === 0 })}</div>`).join('')}
          <div class="hero-text">
            ${site.heroTitle ? `<h1>${esc(site.heroTitle)}</h1>` : ''}
            ${site.heroSubtitle ? `<p>${esc(site.heroSubtitle)}</p>` : ''}
          </div>
          ${heroImgs.length > 1 ? `<div class="hero-dots">${heroImgs.map((_, i) => `<button aria-label="Slide ${i + 1}" class="${i === 0 ? 'is-active' : ''}"></button>`).join('')}</div>` : ''}
        </section>

        ${site.intro || site.introTitle ? `
        <section class="section">
          <div class="container intro reveal">
            <span class="eyebrow">Welcome</span>
            ${site.introTitle ? `<h2>${esc(site.introTitle)}</h2>` : ''}
            <div>${paragraphs(site.intro)}</div>
          </div>
        </section>` : ''}

        <section class="section section--soft">
          <div class="container">
            <div class="section-head reveal">
              <div><span class="eyebrow">Selected Works</span><h2>Featured Work</h2></div>
              <a class="link-more" href="works.html">View All Work</a>
            </div>
            <div class="album-grid">${list.map(albumCard).join('')}</div>
          </div>
        </section>

        <section class="section">
          <div class="container intro reveal">
            <span class="eyebrow">Let's Work Together</span>
            <h2>Planning a Photo Session? Let's Talk</h2>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:12px">
              <a class="btn btn--solid" href="contact.html">Book a Consultation</a>
              <a class="btn" href="services.html">Services & Pricing</a>
            </div>
          </div>
        </section>`;

      // 輪播
      const slides = document.querySelectorAll('.hero-slide');
      const dots = document.querySelectorAll('.hero-dots button');
      if (slides.length > 1) {
        let cur = 0, timer;
        const go = (n) => {
          slides[cur].classList.remove('is-active'); dots[cur]?.classList.remove('is-active');
          cur = (n + slides.length) % slides.length;
          slides[cur].classList.add('is-active'); dots[cur]?.classList.add('is-active');
        };
        const start = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
        dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));
        start();
      }
    },

    /* ---------- 作品集列表 ---------- */
    async works(site) {
      const albums = await load('albums');
      setMeta(site, "Portfolio");
      const used = CATEGORIES.filter((c) => albums.some((a) => a.category === c.key));
      const params = new URLSearchParams(location.search);
      let active = params.get('cat') || 'all';

      $('#app').innerHTML = `
        <div class="page container">
          <div class="page-sheet">
            <header class="page-head">
              <span class="eyebrow">Portfolio</span>
              <h1>Portfolio</h1>
            </header>
            <div class="filter" role="tablist">
              <button data-cat="all">All</button>
              ${used.map((c) => `<button data-cat="${c.key}">${c.label}</button>`).join('')}
            </div>
            <div class="album-grid" id="grid"></div>
          </div>
        </div>`;

      const grid = $('#grid');
      const draw = () => {
        const list = active === 'all' ? albums : albums.filter((a) => a.category === active);
        grid.innerHTML = list.length ? list.map(albumCard).join('') : "<p class=\"empty\">There are no projects in this category yet.</p>";
        document.querySelectorAll('.filter button').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === active));
        observeReveal(grid);
      };
      document.querySelector('.filter').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        active = b.dataset.cat;
        const url = new URL(location.href);
        active === 'all' ? url.searchParams.delete('cat') : url.searchParams.set('cat', active);
        history.replaceState(null, '', url);
        draw();
      });
      draw();
    },

    /* ---------- 單一作品頁 ---------- */
    async album(site) {
      const albums = await load('albums');
      const id = document.body.dataset.albumId || new URLSearchParams(location.search).get('id');
      const idx = albums.findIndex((a) => a.slug === id);
      const a = albums[idx];
      if (!a) {
        setMeta(site, "Project Not Found", "This project is unavailable. Return to the portfolio to explore other work.");
        const robots = document.createElement('meta');
        robots.name = 'robots';
        robots.content = 'noindex, follow';
        document.head.appendChild(robots);
        $('#app').innerHTML = `<div class="page container"><p class="empty">This project could not be found.<br><br><a class="btn" href="works.html">Back to Portfolio</a></p></div>`;
        return;
      }
      // Keep old query-string links working on static hosting too.
      if (!document.body.dataset.albumId) {
        location.replace(`album-${encodeURIComponent(a.slug)}.html`);
        return;
      }
      setMeta(site, a.title, (a.description || '').split('\n')[0]);
      const photos = (a.photos && a.photos.length ? a.photos : [a.cover]).filter(Boolean);
      const prev = albums[idx - 1], next = albums[idx + 1];

      $('#app').innerHTML = `
        <div class="page container">
          <div class="page-sheet">
            <header class="album-head">
              <span class="eyebrow">${esc(catLabel(a.category))}</span>
              <h1>${esc(a.title)}</h1>
              <div class="album-meta">
                ${a.date ? `<span>${esc(String(a.date).slice(0, 10).replace(/-/g, '.'))}</span>` : ''}
                ${a.location ? `<span>${esc(a.location)}</span>` : ''}
                <span>${photos.length} Photos</span>
              </div>
              <div class="album-desc">${paragraphs(a.description)}</div>
            </header>
            <div class="masonry">
              ${photos.map((p, i) => `<figure class="reveal" data-index="${i}">${imgTag(p, { alt: `${a.title} ${i + 1}`, useThumb: true, eager: i < 3 })}</figure>`).join('')}
            </div>
            <nav class="album-nav">
              ${prev ? `<a href="album-${encodeURIComponent(prev.slug)}.html"><small>← PREV</small><span>${esc(prev.title)}</span></a>` : "<a href=\"works.html\"><small>BACK</small><span>Back to Portfolio</span></a>"}
              ${next ? `<a href="album-${encodeURIComponent(next.slug)}.html"><small>NEXT →</small><span>${esc(next.title)}</span></a>` : "<a href=\"works.html\"><small>BACK</small><span>Back to Portfolio</span></a>"}
            </nav>
          </div>
        </div>`;

      const lb = lightbox(photos.map(src));
      document.querySelector('.masonry').addEventListener('click', (e) => {
        const f = e.target.closest('figure'); if (f) lb.open(+f.dataset.index);
      });
    },

    /* ---------- 關於我 ---------- */
    async about(site) {
      const d = await load('about');
      setMeta(site, d.title || "About Me");
      $('#app').innerHTML = `
        <div class="page container">
          <div class="page-sheet">
            <header class="page-head">
              <span class="eyebrow">${esc(d.subtitle || 'About')}</span>
              <h1>${esc(d.title || "About Me")}</h1>
            </header>
            <div class="about">
              <div class="about__img reveal">${d.photo ? imgTag(d.photo, { alt: site.name, eager: true }) : ''}</div>
              <div class="about__text reveal">
                ${paragraphs(d.bio)}
                ${(d.highlights || []).length ? `<ul class="highlights">${d.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
                <div style="margin-top:36px"><a class="btn btn--solid" href="contact.html">Get in Touch</a></div>
              </div>
            </div>
          </div>
        </div>`;
    },

    /* ---------- 服務與價格 ---------- */
    async services(site) {
      const d = await load('services');
      setMeta(site, "Services & Pricing");
      const pk = d.packages || [];
      $('#app').innerHTML = `
        <div class="page container">
          <div class="page-sheet">
            <header class="page-head">
              <span class="eyebrow">Services & Pricing</span>
              <h1>Services & Pricing</h1>
              ${d.intro ? `<div style="margin-top:18px;color:var(--text-soft)">${paragraphs(d.intro)}</div>` : ''}
            </header>
            <div class="packages">
              ${pk.map((p, i) => `
                <article class="package reveal${p.recommended ? ' is-recommended' : ''}" style="transition-delay:${i * 90}ms">
                  ${p.recommended ? "<span class=\"package__badge\">Recommended</span>" : ''}
                  ${p.image ? `<div class="package__img">${imgTag(p.image, { alt: p.name, useThumb: true })}</div>` : ''}
                  <div class="package__body">
                    <h2 class="package__name">${esc(p.name)}</h2>
                    ${p.price ? `<div class="package__price">${esc(p.price)}</div>` : ''}
                    ${p.duration ? `<div class="package__duration">${esc(p.duration)}</div>` : ''}
                    ${p.description ? `<div class="package__desc">${paragraphs(p.description)}</div>` : ''}
                    ${(p.includes || []).length ? `<ul>${p.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
                    <div style="margin-top:24px;">
                      <a class="btn btn--solid" style="width:100%;text-align:center;display:block;" href="contact.html?type=${encodeURIComponent(p.name)}">Book This Package</a>
                    </div>
                  </div>
                </article>`).join('')}
            </div>

            ${(d.process || []).length ? `
            <section style="margin-top:clamp(56px,7vw,88px);padding-top:48px;border-top:1px solid var(--line)">
              <header class="page-head reveal" style="margin-bottom:36px"><span class="eyebrow">Process</span><h2 style="font-size:clamp(22px,2.6vw,30px)">How Booking Works</h2></header>
              <div class="steps">${d.process.map((s) => `<div class="step reveal"><h3>${esc(s.title)}</h3>${paragraphs(s.text)}</div>`).join('')}</div>
            </section>` : ''}

            ${(d.notes || []).length ? `
            <section style="margin-top:clamp(48px,6vw,72px);padding-top:40px;border-top:1px solid var(--line)">
              <header class="page-head reveal" style="margin-bottom:24px"><span class="eyebrow">Notes</span><h2 style="font-size:22px">Booking Notes</h2></header>
              <ul class="notes reveal">${d.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
              <p style="text-align:center;margin-top:40px"><a class="btn btn--solid" href="contact.html">Book a Consultation</a></p>
            </section>` : ''}
          </div>
        </div>`;
    },

    /* ---------- 聯絡我 ---------- */
    async contact(site) {
      setMeta(site, "Book a Consultation");
      const c = site.contact || {};
      const info = [
        c.email && ['Email', `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`],
        c.phone && ['Phone', `<a href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">${esc(c.phone)}</a>`],
        c.lineId && ['LINE', c.lineUrl ? `<a href="${esc(c.lineUrl)}" target="_blank" rel="noopener">${esc(c.lineId)}</a>` : esc(c.lineId)],
        c.location && ['Area', esc(c.location)],
      ].filter(Boolean);

      // 表單本體寫在 contact.html（Netlify 需在 HTML 中偵測到表單），這裡只填入資訊與選項
      $('#contact-info').innerHTML = `
        <h2>Contact Details</h2>
        <p style="color:var(--text-soft)">I aim to reply within 1–2 business days after receiving your inquiry.<br>For urgent inquiries, please contact me on LINE.</p>
        <dl>${info.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        <div class="social" style="margin-top:32px">${socialLinks(c)}</div>`;

      const sel = $('#f-type');
      sel.innerHTML = "<option value=\"\">Please selectSession Type</option>" + 
        CATEGORIES.map((x) => `<option value="${esc(x.label)}">${esc(x.label)}</option>`).join('') +
        "<option value=\"Portrait Session\">Portrait Package</option><option value=\"Wedding Coverage\">Wedding Package</option><option value=\"Commercial & Brand Photography\">Commercial & Brand Package</option><option value=\"Other\">Other Requirements</option>";

      // 檢查網址是否有傳入預約方案參數（例如 contact.html?type=婚禮紀錄）
      const urlParams = new URLSearchParams(location.search);
      const reqType = urlParams.get('type') || urlParams.get('package');
      if (reqType) {
        for (const opt of sel.options) {
          if (opt.value && (opt.value.includes(reqType) || reqType.includes(opt.value))) {
            opt.selected = true;
            break;
          }
        }
        const msgEl = $('#f-message');
        if (msgEl && !msgEl.value) {
          msgEl.placeholder = `Selected package: [${reqType}]
1. Preferred location:
2. Number of people or subject:
3. Style references or special requirements:`;
        }
      }

      const form = $('#contact-form');
      const status = $('#form-status');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        status.className = 'form-status';
        status.textContent = "Sending your request. Please wait…";

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        let isSuccess = false;
        let bookingData = null;

        // 優先嘗試：本機或獨立後端 API (/api/bookings)
        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success) {
              isSuccess = true;
              bookingData = json;
            }
          }
        } catch (err) {
          // 本機無 /api/bookings，繼續嘗試 Netlify Forms
        }

        // 次要嘗試：Netlify Forms POST
        if (!isSuccess) {
          try {
            const netlifyRes = await fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams(formData).toString(),
            });
            if (netlifyRes.ok) {
              isSuccess = true;
              bookingData = {
                bookingNumber: 'PHO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000),
                message: "Your request has been received. I will contact you soon!"
              };
            }
          } catch (netErr) {
            // Netlify 亦無法連線
          }
        }

        // 成功建立預約：顯示精美預約收據卡片
        if (isSuccess && bookingData) {
          const bNum = bookingData.bookingNumber || ('PHO-' + Math.floor(100000 + Math.random() * 900000));
          form.style.display = 'none';
          status.className = 'form-status is-ok';
          status.innerHTML = `
            <div style="border:1px solid var(--text);padding:32px 28px;background:#fff;margin-top:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:20px;">
                <span style="font-family:var(--font-display);font-size:24px;letter-spacing:.08em;">LUMEN Booking Receipt</span>
                <span style="background:#3c7a4c;color:#fff;font-size:11px;letter-spacing:.2em;padding:4px 10px;text-transform:uppercase;">Request Received</span>
              </div>
              <h3 style="font-size:18px;margin-bottom:8px;">Request Number: <span style="font-family:monospace;font-weight:bold;">${esc(bNum)}</span></h3>
              <p style="color:var(--text-soft);font-size:14px;margin-bottom:18px;">
                Dear <strong>${esc(payload.name)}</strong>, we have received your request for [<strong>${esc(payload.type || "Photography Package")}</strong>].
              </p>
              <div style="background:var(--bg-soft);padding:18px;border-radius:4px;font-size:14px;line-height:1.8;margin-bottom:20px;">
                <div>Preferred Date：<strong>${esc(payload.date || "To be confirmed")}</strong></div>
                <div>Mobile Phone: <strong>${esc(payload.phone || "Not provided")}</strong></div>
                <div>Email: <strong>${esc(payload.email || '')}</strong></div>
                ${payload.line ? `<div>LINE ID：<strong>${esc(payload.line)}</strong></div>` : ''}
                <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);font-size:13px;color:var(--accent);">
                  Note: A formal quote will follow once the details are confirmed. A 30% deposit secures the date.
                </div>
              </div>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="btn btn--solid" onclick="location.reload()">Make Another Inquiry</button>
                ${c.lineUrl ? `<a class="btn" href="${esc(c.lineUrl)}" target="_blank" rel="noopener">Contact Me on LINE</a>` : ''}
              </div>
            </div>
          `;
        } else {
          // 備援方案：若無後端環境且 Netlify 失敗，提供 1-Click Email 與 LINE 傳送，絕不流失客戶
          status.className = 'form-status is-err';
          const mailSubject = encodeURIComponent(`[Photography Inquiry] ${payload.name} - ${payload.type}`);
          const mailBody = encodeURIComponent(`Name：${payload.name}
Phone：${payload.phone}\nLINE：${payload.line}
Session type: ${payload.type}
Preferred date: ${payload.date}
Requirements: 
${payload.message}`);
          status.innerHTML = `
            The server could not be reached. You can <a class="btn btn--solid" style="display:inline-block;margin-top:8px;padding:6px 16px;font-size:13px;" href="mailto:${esc(c.email || 'hello@example.com')}?subject=${mailSubject}&body=${mailBody}">send your inquiry by email</a>, or contact me on LINE: <strong>${esc(c.lineId || '')}</strong> directly.
          `;
          btn.disabled = false;
        }
      });
    },
  };

  /* ---------- Lightbox ---------- */
  function lightbox(list) {
    const el = document.createElement('div');
    el.className = 'lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    const arrow = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    el.innerHTML = `
      <img alt="">
      <button class="lightbox__btn lightbox__close" aria-label="Close">${arrow('M5 5l14 14M19 5L5 19')}</button>
      ${list.length > 1 ? `
      <button class="lightbox__btn lightbox__prev" aria-label="Previous photo">${arrow('M15 4l-8 8 8 8')}</button>
      <button class="lightbox__btn lightbox__next" aria-label="Next photo">${arrow('M9 4l8 8-8 8')}</button>` : ''}
      <div class="lightbox__count"></div>`;
    document.body.appendChild(el);
    const img = $('img', el), count = $('.lightbox__count', el);
    let cur = 0;

    const show = (n) => {
      cur = (n + list.length) % list.length;
      img.style.opacity = 0;
      const next = new Image();
      next.onload = next.onerror = () => { img.src = list[cur]; img.style.opacity = 1; };
      next.src = list[cur];
      count.textContent = `${cur + 1} / ${list.length}`;
      [cur + 1, cur - 1].forEach((k) => { new Image().src = list[(k + list.length) % list.length]; });
    };
    const open = (n) => { show(n); el.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const close = () => { el.classList.remove('is-open'); document.body.style.overflow = ''; };

    $('.lightbox__close', el).addEventListener('click', close);
    $('.lightbox__prev', el)?.addEventListener('click', () => show(cur - 1));
    $('.lightbox__next', el)?.addEventListener('click', () => show(cur + 1));
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
    document.addEventListener('keydown', (e) => {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    let sx = null;
    el.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
    return { open };
  }

  /* ---------- 啟動 ---------- */
  load('site')
    .then(async (site) => {
      renderChrome(site);
      const fn = pages[document.body.dataset.page];
      if (fn) await fn(site);
      observeReveal();
    })
    .catch((err) => {
      console.error(err);
      const app = $('#app');
      // A failed API/JSON request must not erase pre-rendered useful content.
      if (app && !app.querySelector('h1')) app.innerHTML = `<div class="page container"><p class="empty">Unable to load content: ${esc(err.message)}<br>For local previews, use a local web server instead of opening the HTML file directly.</p></div>`;
    });
})();
