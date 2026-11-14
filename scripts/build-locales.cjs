// Build complete English HTML from the Chinese source and reviewed translations.
// Run after write-site-metadata.cjs. No network or translation API is used.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
const acorn=require('acorn');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'seo.config.json'),'utf8'));
const dictionary=JSON.parse(fs.readFileSync(path.join(__dirname,'translations.en.json'),'utf8'));
const keys=Object.keys(dictionary).filter(k=>/[\u3400-\u9fff]/.test(k)).sort((a,b)=>b.length-a.length);
const re=new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
const chinese=/[\u3400-\u9fff]/;
const translate=s=>String(s).replace(re,k=>dictionary[k]);
const photo=fs.existsSync(path.join(root,'content/site.json'));
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!['admin.html','album.html','logo_compare.html'].includes(f));
const base=new URL((process.env.SEO_SITE_URL||config.siteUrl).replace(/\/?$/,'/'));
const indexable=config.indexable!==false;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const urls=[];
const missing=new Set();
const manifestFile=path.join(__dirname,'generated-locales.json');
const previous=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):[];
function check(s,label){if(chinese.test(s)&&s!=='繁中'&&s!=='繁體中文')missing.add(label+': '+s);return s;}
function translateJS(source,label){
 const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'module'}),edits=[];
 function visit(n){
  if(!n||typeof n!=='object')return;
  if(n.type==='Literal'&&typeof n.value==='string'&&chinese.test(n.value)){
   const t=check(translate(n.value),label);edits.push([n.start,n.end,JSON.stringify(t)]);
  }else if(n.type==='TemplateElement'&&chinese.test(n.value.cooked||'')){
   const t=check(translate(n.value.cooked),label);edits.push([n.start,n.end,t.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${')]);
  }
  for(const [k,v]of Object.entries(n))if(k!=='start'&&k!=='end'){if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v);}
 }
 visit(ast);for(const [a,b,t]of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,a)+t+source.slice(b);
 return source;
}
function walk(node){
 if(node.nodeType===3){node.textContent=check(translate(node.textContent),'HTML text');return;}
 if(['SCRIPT','STYLE'].includes(node.tagName)||node.classList?.contains('locale-switch'))return;
 if(node.attributes)for(const a of [...node.attributes])if(['alt','title','placeholder','aria-label','content','data-seo-title','data-seo-description'].includes(a.name))node.setAttribute(a.name,check(translate(a.value),a.name));
 for(const n of [...node.childNodes])walk(n);
}
function setMeta(doc,key,value,property=false){const attr=property?'property':'name';let el=doc.querySelector(`meta[${attr}="${key}"]`);if(!el){el=doc.createElement('meta');el.setAttribute(attr,key);doc.head.appendChild(el)}el.setAttribute('content',value);}
function decorate(doc,file,en){
 doc.documentElement.lang=en?'en':'zh-TW';
 doc.querySelectorAll('link[rel="alternate"][hreflang],link[rel="canonical"],[data-locale-generated]').forEach(n=>n.remove());
 const rel=file==='index.html'?'':file;
 const zh=new URL(rel,base).href,english=new URL('en/'+rel,base).href;
 const canon=doc.createElement('link');canon.rel='canonical';canon.href=en?english:zh;doc.head.appendChild(canon);
 setMeta(doc,'og:url',en?english:zh,true);setMeta(doc,'og:locale',en?'en_US':'zh_TW',true);
 setMeta(doc,'og:title',doc.title,true);setMeta(doc,'og:description',doc.querySelector('meta[name="description"]').content,true);
 if(!indexable)setMeta(doc,'robots','noindex, follow');
 if(indexable){
  for(const [lang,href]of [['zh-TW',zh],['en',english],['x-default',zh]]){const l=doc.createElement('link');l.rel='alternate';l.hreflang=lang;l.href=href;doc.head.appendChild(l)}
  urls.push(en?english:zh);
 }
 for(const node of doc.querySelectorAll('script[type="application/ld+json"]')){
  const org=JSON.parse(node.textContent);if(en&&org.name)org.name=photo?'LUMEN Photography':file==='index.html'&&config.pages?.[file]?.organizationName?config.pages[file].organizationName:'EVERESTEK INC.';
  org.url=new URL(en?'en/':'./',base).href;node.textContent=JSON.stringify(org).replace(/</g,'\\u003c');
 }
 // Native links work without JavaScript. A small script preserves query/hash on use.
 const switches=[...doc.querySelectorAll('.lang-toggle-btn, .locale-switch')];
 const link=doc.createElement('a');link.className='locale-switch';link.href=(en?'../':'en/')+file;link.setAttribute('hreflang',en?'zh-TW':'en');link.lang=en?'zh-TW':'en';link.textContent=en?'繁中':'EN';link.setAttribute('aria-label',en?'Switch to Traditional Chinese':'切換至英文');
 if(photo){
  const names=['人像／寫真','婚禮／婚紗','商業／商品','風景／旅行','活動紀錄','街拍／紀實','個人寫真','婚禮紀錄','商業／品牌攝影','其他'];
  link.setAttribute('data-locale-types',JSON.stringify(Object.fromEntries(names.map(n=>en?[translate(n),n]:[n,translate(n)]))));
 }
 if(switches.length)for(const old of switches){const a=link.cloneNode(true);a.className=old.className.replace(/lang-toggle-btn/g,'locale-switch');if(old.hasAttribute('style'))a.setAttribute('style',old.getAttribute('style'));old.replaceWith(a)}
 else {link.setAttribute('style','position:fixed;bottom:20px;left:16px;z-index:1000;display:inline-flex;align-items:center;justify-content:center;min-width:48px;min-height:44px;padding:8px 12px;background:#fff;color:#172033;border:1px solid #8893a5;border-radius:8px;font:600 14px system-ui;text-decoration:none;box-shadow:0 2px 8px #0002');doc.body.appendChild(link)}
 const script=doc.createElement('script');script.src=(en?'../':'')+'assets/js/locale-switch.js';script.defer=true;script.setAttribute('data-locale-generated','true');doc.body.appendChild(script);
}
fs.mkdirSync(path.join(root,'en'),{recursive:true});
if(photo){
 fs.mkdirSync(path.join(root,'content/en'),{recursive:true});
 const deep=v=>typeof v==='string'?check(translate(v),'content JSON'):Array.isArray(v)?v.map(deep):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,deep(x)])):v;
 for(const name of ['site','albums','about','services'])fs.writeFileSync(path.join(root,'content/en',name+'.json'),JSON.stringify(deep(JSON.parse(fs.readFileSync(path.join(root,'content',name+'.json'),'utf8'))),null,2)+'\n');
 fs.writeFileSync(path.join(root,'assets/js/app.en.js'),translateJS(fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8'),'photo runtime'));
}
for(const file of files){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 const zh=parseHTML(source).document;
 decorate(zh,file,false);
 const en=parseHTML(zh.toString()).document;
 en.querySelectorAll('[data-locale-generated]').forEach(n=>n.remove());
 en.normalize(); walk(en);
 if(!photo){
  // Use the same product renderer as the interactive filters, in English.
  const list=en.getElementById('fullProductsList');
  if(list){const container={innerHTML:''};const ctx={document:{documentElement:{lang:'en'},addEventListener(){},getElementById:id=>id==='fullProductsList'?container:null},localStorage:{getItem:()=>null}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8'),ctx);vm.runInContext("currentLang='en';renderFullProducts()",ctx);list.innerHTML=container.innerHTML;}
 }
 for(const el of en.querySelectorAll('[src],[href],[poster],[style]')){
  for(const attr of ['src','href','poster']){const value=el.getAttribute(attr);if(value&&/^(?:\.\/)?(?:assets|images|content)\//.test(value))el.setAttribute(attr,'../'+value.replace(/^\.\//,''));}
  const style=el.getAttribute('style');if(style)el.setAttribute('style',style.replace(/url\((['"]?)(assets|images)\//g,'url($1../$2/'));
 }
 for(const style of en.querySelectorAll('style'))style.textContent=style.textContent.replace(/url\((['"]?)(assets|images)\//g,'url($1../$2/');
 for(const script of en.querySelectorAll('script:not([src]):not([type="application/ld+json"])')){
  script.textContent=translateJS(script.textContent,file+' inline script').replace(/(['"])\.\/assets\//g,'$1../assets/');
 }
 if(photo)en.querySelectorAll('script[src$="/app.js"]').forEach(s=>s.src='../assets/js/app.en.js');
 decorate(en,file,true);
 fs.writeFileSync(path.join(root,file),zh.toString());
 fs.writeFileSync(path.join(root,'en',file),en.toString());
}
if(missing.size)throw new Error('Missing English translations:\n'+[...missing].join('\n'));
for(const file of previous.filter(f=>!files.includes(f))){
 if(!/^[a-z0-9-]+\.html$/.test(file))throw new Error('Invalid generated locale manifest entry');
 const target=path.resolve(root,'en',file);
 if(path.dirname(target)!==path.resolve(root,'en'))throw new Error('Locale file outside en directory');
 if(fs.existsSync(target)){
  if(!fs.readFileSync(target,'utf8').includes('data-locale-generated'))throw new Error('Refusing to remove unmanaged English file: '+file);
  fs.unlinkSync(target);
 }
}
fs.writeFileSync(manifestFile,JSON.stringify(files,null,2)+'\n');
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${esc(u)}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n'+(indexable?'\nSitemap: '+new URL('sitemap.xml',base).href+'\n':''));
console.log(`Built ${files.length} English pages; ${indexable?'indexable language pairs':'all preview pages noindex'}.`);
