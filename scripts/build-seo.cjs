// Run after editing content/*.json. Uses only Node.js built-ins.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'content', `${name}.json`), 'utf8'));
const site = read('site'), albums = read('albums'), about = read('about'), services = read('services');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = s => String(s || '').split(/\n+/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('');
const list = a => `<ul>${(a || []).map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`;
const category = {portrait:'人像／寫真',wedding:'婚禮／婚紗',commercial:'商業／商品',landscape:'風景／旅行',event:'活動紀錄',street:'街拍／紀實'};
const albumURL = a => `album-${a.slug}.html`;
const seen = new Set();
for (const a of albums) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug) || seen.has(a.slug)) throw new Error(`Invalid or duplicate album slug: ${a.slug}`);
  seen.add(a.slug);
}
// JPEG/PNG dimensions reserve layout space without extra dependencies.
const dimensions = {};
function size(src) {
  if (dimensions[src]) return dimensions[src];
  if (/^(?:https?:|data:|\/\/)/.test(src)) return null;
  const file = path.resolve(root, src.replace(/^\/+/, ''));
  if (!file.startsWith(root + path.sep)) throw new Error('Image outside project');
  if (!fs.existsSync(file)) throw new Error(`Missing image: ${src}`);
  const b = fs.readFileSync(file); let result;
  if (b.length > 24 && b.toString('hex',0,8)==='89504e470d0a1a0a') result={width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
  else if (b[0]===255 && b[1]===216) {
    for(let i=2;i+9<b.length;) {
      if(b[i++]!==255) break;
      while(b[i]===255)i++;
      const marker=b[i++];
      if(marker===217 || marker===218)break;
      if(marker===1 || (marker>=208 && marker<=215))continue;
      const length=b.readUInt16BE(i);
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {result={width:b.readUInt16BE(i+5),height:b.readUInt16BE(i+3)};break;}
      if(length<2)break;i+=length;
    }
  }
  if(result)dimensions[src]=result;
  return result;
}
function image(url, alt, thumb=false, eager=false) {
  let src=String(url || '').replace(/^\/+/, '');
  if(!src)return '';
  if(thumb && src.startsWith('images/uploads/')) {
    const t=src.replace('images/uploads/','images/thumbs/');
    if(fs.existsSync(path.join(root,t)))src=t;
  }
  const d=size(src);
  return `<img src="${esc(src)}" alt="${esc(alt)}"${d?` width="${d.width}" height="${d.height}"`:''} loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
}
const card = a => `<a class="album-card" href="${albumURL(a)}"><div class="album-card__img">${image(a.cover || a.photos?.[0],a.title,true)}</div><div class="album-card__body"><h3 class="album-card__title">${esc(a.title)}</h3><span class="album-card__cat">${esc(category[a.category])}</span></div></a>`;
const page = body => `<div class="page container"><div class="page-sheet">${body}</div></div>`;
const heading = (en, title) => `<header class="page-head"><span class="eyebrow">${en}</span><h1>${esc(title)}</h1></header>`;
const nav=[['index.html','首頁'],['works.html','作品集'],['about.html','關於我'],['services.html','服務與價格'],['contact.html','聯絡我']];
const brand=site.logo?image(site.logo,site.name):`${esc(site.name)} <small>${esc(site.nameEn)}</small>`;
const header=`<div class="container"><a class="brand" href="index.html">${brand}</a><nav class="nav">${nav.map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}</nav></div>`;
const footer=`<div class="container"><a class="brand" href="index.html">${brand}</a><a href="contact.html">預約諮詢</a><small>© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</small></div>`;
const metas={
  index:[`${site.contact?.location?.split('，')[0] || ''}人像、婚禮與商業攝影｜${site.name}`,site.description],
  works:[`攝影作品集｜人像、婚禮與商業攝影｜${site.name}`,`瀏覽 ${site.name}的人像寫真、婚禮紀錄、商業商品、風景旅行與活動攝影作品，了解拍攝風格與案例。`],
  about:[`關於攝影師｜拍攝理念與經驗｜${site.name}`,`認識 ${site.name}攝影師的拍攝理念與經驗，以自然光與輕鬆互動，記錄婚禮、人像、品牌及活動中的真實片刻。`],
  services:[`攝影服務與價格｜寫真、婚禮與品牌方案｜${site.name}`,`查看 ${site.name}個人寫真、婚禮紀錄與商業品牌攝影方案，了解參考價格、拍攝時間與交付內容，預約適合你的拍攝服務。`],
  contact:[`攝影預約諮詢｜${site.name}`,`聯絡 ${site.name}討論人像寫真、婚禮紀錄與商業攝影需求，提供日期、地點與拍攝想法，洽詢檔期及客製化報價。`]
};
const featured=albums.filter(a=>a.featured);
const content={
  index:`<section class="hero">${(site.heroImages||[]).map((u,i)=>`<div class="hero-slide${i===0?' is-active':''}">${image(u,site.name,false,i===0)}</div>`).join('')}<div class="hero-text"><h1>${esc(site.heroTitle || site.name)}</h1><p>${esc(site.heroSubtitle)}</p></div></section><section class="section"><div class="container intro"><h2>${esc(site.introTitle)}</h2>${paragraphs(site.intro)}</div></section><section class="section section--soft"><div class="container"><h2>精選作品</h2><div class="album-grid">${(featured.length?featured:albums).slice(0,6).map(card).join('')}</div><a href="works.html">查看全部作品</a></div></section><section class="section"><div class="container intro"><h2>有拍攝需求嗎？歡迎與我聊聊</h2><a class="btn btn--solid" href="contact.html">預約諮詢</a> <a class="btn" href="services.html">服務與價格</a></div></section>`,
  works:page(heading('Portfolio','作品集')+`<div class="album-grid">${albums.map(card).join('')}</div>`),
  about:page(heading('About',about.title || '關於我')+`<div class="about"><div class="about__img">${image(about.photo,site.name,false,true)}</div><div class="about__text">${paragraphs(about.bio)}${list(about.highlights)}<a class="btn btn--solid" href="contact.html">與我聯絡</a></div></div>`),
  services:page(heading('Services & Pricing','服務與價格')+paragraphs(services.intro)+`<div class="packages">${(services.packages||[]).map(p=>`<article class="package${p.recommended?' is-recommended':''}">${p.image?`<div class="package__img">${image(p.image,p.name,true)}</div>`:''}<div class="package__body"><h2 class="package__name">${esc(p.name)}</h2><div class="package__price">${esc(p.price)}</div><div class="package__duration">${esc(p.duration)}</div>${paragraphs(p.description)}${list(p.includes)}<a class="btn btn--solid" href="contact.html?type=${encodeURIComponent(p.name)}">預約此方案</a></div></article>`).join('')}</div><section class="section"><h2>預約流程</h2><div class="steps">${(services.process||[]).map(p=>`<div class="step"><h3>${esc(p.title)}</h3>${paragraphs(p.text)}</div>`).join('')}</div><h2>注意事項</h2>${list(services.notes)}</section>`)
};
function metadata(html,title,desc) {
  html=html.replace(/<title[^>]*>[\s\S]*?<\/title>/,`<title data-seo-title="${esc(title)}">${esc(title)}</title>`);
  html=html.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(desc)}" data-seo-description="${esc(desc)}">`);
  for(const [key,value] of [['title',title],['description',desc]])html=html.replace(new RegExp(`<meta property="og:${key}"[^>]*>`),`<meta property="og:${key}" content="${esc(value)}">`);
  return html;
}
function write(file,html,body,title,desc) {
  if(body!==null)html=html.replace(/<main id="app">[\s\S]*?<\/main>/,`<main id="app">${body}</main>`);
  html=html.replace(/<header class="site-header" id="site-header">[\s\S]*?<\/header>/,`<header class="site-header" id="site-header">${header}</header>`);
  html=html.replace(/<footer class="site-footer" id="site-footer">[\s\S]*?<\/footer>/,`<footer class="site-footer" id="site-footer">${footer}</footer>`);
  html=metadata(html,title,desc);
  if(!html.includes('assets/js/image-sizes.js'))html=html.replace('<script src="assets/js/app.js"','<script src="assets/js/image-sizes.js" defer></script>\n  <script src="assets/js/app.js"');
  if(!html.includes('id="seo-noscript"'))html=html.replace('</head>','<noscript id="seo-noscript"><style>.nav{display:flex!important;position:static!important;flex-wrap:wrap;gap:12px}.site-header .container{flex-wrap:wrap}.reveal{opacity:1!important;transform:none!important}</style></noscript>\n</head>');
  fs.writeFileSync(path.join(root,file),html);
}
for(const [name,[title,desc]] of Object.entries(metas))write(`${name}.html`,fs.readFileSync(path.join(root,`${name}.html`),'utf8'),content[name]??null,title,desc);
const albumTemplate=fs.readFileSync(path.join(root,'album.html'),'utf8');
const manifestFile=path.join(root,'scripts/generated-albums.json');
const previousAlbums=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):[];
for(let index=0;index<albums.length;index++) {
  const a=albums[index], photos=(a.photos?.length?a.photos:[a.cover]).filter(Boolean);
  const body=page(`<header class="album-head"><span class="eyebrow">${esc(category[a.category])}</span><h1>${esc(a.title)}</h1><div class="album-meta"><span>${esc(a.date)}</span><span>${esc(a.location)}</span><span>${photos.length} Photos</span></div><div class="album-desc">${paragraphs(a.description)}</div></header><div class="masonry">${photos.map((p,i)=>`<figure data-index="${i}">${image(p,`${a.title} ${i+1}`,true,i===0)}</figure>`).join('')}</div><nav class="album-nav">${[albums[index-1],albums[index+1]].map(other=>other?`<a href="${albumURL(other)}">${esc(other.title)}</a>`:'<a href="works.html">回作品集</a>').join('')}</nav>`);
  const html=albumTemplate.replace(/<meta name="robots"[^>]*>\s*/g,'').replace('<body data-page="album">',`<body data-page="album" data-album-id="${esc(a.slug)}" data-seo-generated="album">`);
  write(albumURL(a),html,body,`${a.title}｜${site.name}`,(a.description||site.description).split('\n')[0]);
}
const currentAlbums=albums.map(albumURL);
for(const stale of previousAlbums.filter(file=>!currentAlbums.includes(file))) {
  if(!/^album-[a-z0-9-]+\.html$/.test(stale))throw new Error('Invalid generated album manifest');
  const target=path.resolve(root,stale);
  if(path.dirname(target)!==root)throw new Error('Generated album outside project');
  if(fs.existsSync(target)) {
    if(!fs.readFileSync(target,'utf8').includes('data-seo-generated="album"'))throw new Error(`Refusing to remove an unmanaged file: ${stale}`);
    fs.unlinkSync(target);
  }
}
fs.writeFileSync(manifestFile,JSON.stringify(currentAlbums,null,2)+'\n');
// Populate dimensions for runtime thumbnails and full-size images, including heroes.
for(const a of albums)for(const p of [a.cover,...(a.photos||[])].filter(Boolean)){image(p,a.title);image(p,a.title,true);}
fs.writeFileSync(path.join(root,'assets/js/image-sizes.js'),`window.PHOTO_IMAGE_SIZES = ${JSON.stringify(dimensions)};\n`);
console.log(`Pre-rendered 5 public pages and ${albums.length} albums.`);
require('./write-site-metadata.cjs');
