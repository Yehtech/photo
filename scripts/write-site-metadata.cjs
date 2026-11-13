// Canonical/sitemap are emitted only after a real production siteUrl is configured.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'seo.config.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  const org={'@context':'https://schema.org','@type':'Organization',name};
  const tags=[];
  if(base) {
    const url=new URL(file==='index.html'?'./':file,base).href;
    urls.push(url);org.url=base.href;
    tags.push(`<link rel="canonical" href="${esc(url)}">`,`<meta property="og:url" content="${esc(url)}">`);
    if(config.shareImage) {
      const img=new URL(config.shareImage.replace(/^\//,''),base).href;
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
