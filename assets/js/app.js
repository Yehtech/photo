/* =========================================================
   LUMEN Photography — 網站主程式
   內容全部來自 /content/*.json（由 Pages CMS 後台編輯）
   一般更新作品不需要修改這個檔案。
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 分類（需與 .pages.yml 的 category 選項一致） ---------- */
  const CATEGORIES = [
    { key: 'portrait',   label: '人像／寫真' },
    { key: 'wedding',    label: '婚禮／婚紗' },
    { key: 'commercial', label: '商業／商品' },
    { key: 'landscape',  label: '風景／旅行' },
    { key: 'event',      label: '活動紀錄' },
    { key: 'street',     label: '街拍／紀實' },
  ];
  const catLabel = (key) => (CATEGORIES.find((c) => c.key === key) || {}).label || '';

  const NAV = [
    { href: 'index.html',    label: '首頁',      page: 'home' },
    { href: 'works.html',    label: '作品集',    page: 'works' },
    { href: 'about.html',    label: '關於我',    page: 'about' },
    { href: 'services.html', label: '服務與價格', page: 'services' },
    { href: 'contact.html',  label: '聯絡我',    page: 'contact' },
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
    return url.replace(/^\/+/, '');
  };
  // 縮圖（由 GitHub Action 自動產生於 images/thumbs/），找不到時自動改用原圖
  const thumb = (url) => {
    const s = src(url);
    return s.startsWith('images/uploads/') ? s.replace('images/uploads/', 'images/thumbs/') : s;
  };
  const imgTag = (url, { alt = '', useThumb = false, eager = false, cls = '' } = {}) => {
    const full = src(url);
    const s = useThumb ? thumb(url) : full;
    const fallback = s !== full ? ` onerror="this.onerror=null;this.src='${esc(full)}'"` : '';
    return `<img src="${esc(s)}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async"${fallback}>`;
  };

  const cache = {};
  const load = (name) => {
    if (!cache[name]) {
      cache[name] = fetch(`content/${name}.json`, { cache: 'no-cache' }).then((r) => {
        if (!r.ok) throw new Error(`無法讀取 content/${name}.json`);
        return r.json();
      });
    }
    return cache[name];
  };

  const setMeta = (site, pageTitle, desc) => {
    document.title = pageTitle ? `${pageTitle}｜${site.name}` : `${site.name} ${site.nameEn || ''}`.trim();
    let m = $('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = desc || site.description || '';
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
        <button class="nav-toggle" aria-label="選單" aria-expanded="false"><span></span><span></span></button>
        <nav class="nav">${NAV.map((n) => `<a href="${n.href}" class="${n.page === page || (page === 'album' && n.page === 'works') ? 'is-active' : ''}">${n.label}</a>`).join('')}</nav>
      </div>`;

    const toggle = $('.nav-toggle', header);
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
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
    <a class="album-card reveal" style="transition-delay:${(i % 3) * 90}ms" href="album.html?id=${encodeURIComponent(a.slug)}">
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
          ${heroImgs.length > 1 ? `<div class="hero-dots">${heroImgs.map((_, i) => `<button aria-label="第 ${i + 1} 張" class="${i === 0 ? 'is-active' : ''}"></button>`).join('')}</div>` : ''}
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
              <div><span class="eyebrow">Selected Works</span><h2>精選作品</h2></div>
              <a class="link-more" href="works.html">查看全部作品</a>
            </div>
            <div class="album-grid">${list.map(albumCard).join('')}</div>
          </div>
        </section>

        <section class="section">
          <div class="container intro reveal">
            <span class="eyebrow">Let's Work Together</span>
            <h2>有拍攝需求嗎？歡迎與我聊聊</h2>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:12px">
              <a class="btn btn--solid" href="contact.html">預約諮詢</a>
              <a class="btn" href="services.html">服務與價格</a>
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
      setMeta(site, '作品集');
      const used = CATEGORIES.filter((c) => albums.some((a) => a.category === c.key));
      const params = new URLSearchParams(location.search);
      let active = params.get('cat') || 'all';

      $('#app').innerHTML = `
        <div class="page container">
          <header class="page-head">
            <span class="eyebrow">Portfolio</span>
            <h1>作品集</h1>
          </header>
          <div class="filter" role="tablist">
            <button data-cat="all">全部</button>
            ${used.map((c) => `<button data-cat="${c.key}">${c.label}</button>`).join('')}
          </div>
          <div class="album-grid" id="grid"></div>
        </div>`;

      const grid = $('#grid');
      const draw = () => {
        const list = active === 'all' ? albums : albums.filter((a) => a.category === active);
        grid.innerHTML = list.length ? list.map(albumCard).join('') : '<p class="empty">此分類目前還沒有作品</p>';
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
      const id = new URLSearchParams(location.search).get('id');
      const idx = albums.findIndex((a) => a.slug === id);
      const a = albums[idx];
      if (!a) {
        setMeta(site, '找不到作品');
        $('#app').innerHTML = `<div class="page container"><p class="empty">找不到這組作品。<br><br><a class="btn" href="works.html">回作品集</a></p></div>`;
        return;
      }
      setMeta(site, a.title, (a.description || '').split('\n')[0]);
      const photos = (a.photos && a.photos.length ? a.photos : [a.cover]).filter(Boolean);
      const prev = albums[idx - 1], next = albums[idx + 1];

      $('#app').innerHTML = `
        <div class="page container">
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
            ${prev ? `<a href="album.html?id=${encodeURIComponent(prev.slug)}"><small>← PREV</small><span>${esc(prev.title)}</span></a>` : '<span></span>'}
            ${next ? `<a href="album.html?id=${encodeURIComponent(next.slug)}"><small>NEXT →</small><span>${esc(next.title)}</span></a>` : ''}
          </nav>
        </div>`;

      const lb = lightbox(photos.map(src));
      document.querySelector('.masonry').addEventListener('click', (e) => {
        const f = e.target.closest('figure'); if (f) lb.open(+f.dataset.index);
      });
    },

    /* ---------- 關於我 ---------- */
    async about(site) {
      const d = await load('about');
      setMeta(site, d.title || '關於我');
      $('#app').innerHTML = `
        <div class="page container">
          <div class="about">
            <div class="about__img reveal">${d.photo ? imgTag(d.photo, { alt: site.name, eager: true }) : ''}</div>
            <div class="about__text reveal">
              <span class="eyebrow">${esc(d.subtitle || 'About')}</span>
              <h1>${esc(d.title || '關於我')}</h1>
              ${paragraphs(d.bio)}
              ${(d.highlights || []).length ? `<ul class="highlights">${d.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
              <a class="btn" href="contact.html">與我聯絡</a>
            </div>
          </div>
        </div>`;
    },

    /* ---------- 服務與價格 ---------- */
    async services(site) {
      const d = await load('services');
      setMeta(site, '服務與價格');
      const pk = d.packages || [];
      $('#app').innerHTML = `
        <div class="page">
          <div class="container">
            <header class="page-head">
              <span class="eyebrow">Services & Pricing</span>
              <h1>服務與價格</h1>
              ${d.intro ? `<div style="margin-top:18px;color:var(--text-soft)">${paragraphs(d.intro)}</div>` : ''}
            </header>
            <div class="packages">
              ${pk.map((p, i) => `
                <article class="package reveal${p.recommended ? ' is-recommended' : ''}" style="transition-delay:${i * 90}ms">
                  ${p.recommended ? '<span class="package__badge">推薦</span>' : ''}
                  ${p.image ? `<div class="package__img">${imgTag(p.image, { alt: p.name, useThumb: true })}</div>` : ''}
                  <div class="package__body">
                    <h2 class="package__name">${esc(p.name)}</h2>
                    ${p.price ? `<div class="package__price">${esc(p.price)}</div>` : ''}
                    ${p.duration ? `<div class="package__duration">${esc(p.duration)}</div>` : ''}
                    ${p.description ? `<div class="package__desc">${paragraphs(p.description)}</div>` : ''}
                    ${(p.includes || []).length ? `<ul>${p.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
                  </div>
                </article>`).join('')}
            </div>
          </div>

          ${(d.process || []).length ? `
          <section class="section section--soft" style="margin-top:clamp(64px,9vw,120px)">
            <div class="container">
              <header class="page-head reveal"><span class="eyebrow">Process</span><h2 style="font-size:clamp(22px,2.6vw,30px)">預約流程</h2></header>
              <div class="steps">${d.process.map((s) => `<div class="step reveal"><h3>${esc(s.title)}</h3>${paragraphs(s.text)}</div>`).join('')}</div>
            </div>
          </section>` : ''}

          ${(d.notes || []).length ? `
          <section class="container" style="padding-top:clamp(56px,8vw,96px)">
            <header class="page-head reveal" style="margin-bottom:28px"><span class="eyebrow">Notes</span><h2 style="font-size:22px">注意事項</h2></header>
            <ul class="notes reveal">${d.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
            <p style="text-align:center;margin-top:48px"><a class="btn btn--solid" href="contact.html">預約諮詢</a></p>
          </section>` : ''}
        </div>`;
    },

    /* ---------- 聯絡我 ---------- */
    async contact(site) {
      setMeta(site, '聯絡我');
      const c = site.contact || {};
      const info = [
        c.email && ['Email', `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`],
        c.phone && ['Phone', `<a href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">${esc(c.phone)}</a>`],
        c.lineId && ['LINE', c.lineUrl ? `<a href="${esc(c.lineUrl)}" target="_blank" rel="noopener">${esc(c.lineId)}</a>` : esc(c.lineId)],
        c.location && ['Area', esc(c.location)],
      ].filter(Boolean);

      // 表單本體寫在 contact.html（Netlify 需在 HTML 中偵測到表單），這裡只填入資訊與選項
      $('#contact-info').innerHTML = `
        <h2>聯絡資訊</h2>
        <p style="color:var(--text-soft)">填寫表單後，我會在 1–2 個工作天內回覆你。<br>急件請直接透過 LINE 聯繫。</p>
        <dl>${info.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        <div class="social" style="margin-top:32px">${socialLinks(c)}</div>`;

      const sel = $('#f-type');
      sel.insertAdjacentHTML('beforeend', CATEGORIES.map((x) => `<option>${x.label}</option>`).join('') + '<option>其他</option>');

      const form = $('#contact-form');
      const status = $('#form-status');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true; status.className = 'form-status'; status.textContent = '送出中…';
        try {
          const res = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
          });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = 'form-status is-ok';
          status.textContent = '已收到你的訊息，謝謝！我會盡快與你聯繫。';
        } catch (err) {
          status.className = 'form-status is-err';
          status.innerHTML = `送出失敗，請稍後再試，或直接來信 <a href="mailto:${esc(c.email || '')}">${esc(c.email || '')}</a>`;
        } finally {
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
      <button class="lightbox__btn lightbox__close" aria-label="關閉">${arrow('M5 5l14 14M19 5L5 19')}</button>
      ${list.length > 1 ? `
      <button class="lightbox__btn lightbox__prev" aria-label="上一張">${arrow('M15 4l-8 8 8 8')}</button>
      <button class="lightbox__btn lightbox__next" aria-label="下一張">${arrow('M9 4l8 8-8 8')}</button>` : ''}
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
      if (app) app.innerHTML = `<div class="page container"><p class="empty">內容載入失敗：${esc(err.message)}<br>（若在本機預覽，請用本機伺服器開啟，不能直接雙擊 HTML 檔）</p></div>`;
    });
})();
