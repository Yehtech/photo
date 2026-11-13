// Canonical/sitemap are emitted only after a real production siteUrl is configured.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'seo.config.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode=s=>String(s).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const raw=(process.env.SEO_SITE_URL || config.siteUrl || '').trim();
let base;
if(raw) {
  base=new URL(raw.endsWith('/')?raw:raw+'/');
  if(base.protocol!=='https:' || base.username || base.password || base.search || base.hash || /^(?:localhost|127\.|0\.0\.0\.0|example\.(?:com|org|net)$)/i.test(base.hostname))throw new Error('siteUrl must be the real HTTPS production base URL.');
}
const siteFile=path.join(root,'content/site.json');
const name=fs.existsSync(siteFile)?JSON.parse(fs.readFileSync(siteFile,'utf8')).name:config.organizationName;
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html') && !['admin.html','logo_compare.html','album.html'].includes(f));
const urls=[];
for(const file of files) {
  const target=path.join(root,file);let html=fs.readFileSync(target,'utf8');
  if(/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html))continue;
  html=html.replace(/\s*<!-- SITE_SEO_START -->[\s\S]*?<!-- SITE_SEO_END -->/g,'');
  const page=config.pages?.[file] || {};
  const org={'@context':'https://schema.org','@type':'Organization',name:page.organizationName || name};
  const tags=[];
  const title=decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || '');
  const description=decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
  if(!html.includes('property="og:title"'))tags.push(`<meta property="og:title" content="${esc(title)}">`);
  if(!html.includes('property="og:description"'))tags.push(`<meta property="og:description" content="${esc(description)}">`);
  if(!html.includes('property="og:type"'))tags.push('<meta property="og:type" content="website">');
  if(!html.includes('property="og:locale"'))tags.push('<meta property="og:locale" content="zh_TW">');
  if(!html.includes('name="twitter:card"'))tags.push('<meta name="twitter:card" content="summary_large_image">');
  if(base) {
    const url=new URL(file==='index.html'?'./':file,base).href;
    urls.push(url);org.url=base.href;
    tags.push(`<link rel="canonical" href="${esc(url)}">`,`<meta property="og:url" content="${esc(url)}">`);
    let shareImage=page.shareImage || config.shareImage;
    const albumId=html.match(/data-album-id="([^"]+)"/)?.[1];
    if(albumId && fs.existsSync(path.join(root,'content/albums.json'))){
      const albums=JSON.parse(fs.readFileSync(path.join(root,'content/albums.json'),'utf8'));
      shareImage=albums.find(album=>album.slug===albumId)?.cover || shareImage;
    }
    if(shareImage) {
      const img=new URL(shareImage.replace(/^\//,''),base).href;
      tags.push(`<meta property="og:image" content="${esc(img)}">`);
    }
  }
  tags.push(`<script type="application/ld+json">${JSON.stringify(org).replace(/</g,'\\u003c')}</script>`);
  html=html.replace('</head>',`\n<!-- SITE_SEO_START -->\n${tags.join('\n')}\n<!-- SITE_SEO_END -->\n</head>`);
  fs.writeFileSync(target,html);
}
if(base) {
  fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>`  <url><loc>${esc(url)}</loc></url>`).join('\n')+'\n</urlset>\n');
  fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml',base).href}\n`);
}
console.log(base?`Generated ${urls.length} canonical URLs and sitemap.`:'Organization metadata updated; production URL is not configured, canonical/sitemap deferred.');
