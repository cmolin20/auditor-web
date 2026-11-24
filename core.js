async function AUDIT(o){
const V='2.0';const base=o.base;const api=base+'wp-json/';
let siteName=new URL(base).pathname.replace(/\//g,' ').trim()||new URL(base).hostname;
try{const j=await fetch(api).then(r=>r.json());if(j&&j.name)siteName=j.name;}catch(e){}
const W=api+'wp/v2/';
async function all(type,fields){let out=[],p=1,tot=1;do{const r=await fetch(W+type+'?per_page=100&page='+p+'&_fields='+fields);if(!r.ok)return out;tot=+r.headers.get('X-WP-TotalPages')||1;out=out.concat(await r.json());p++;}while(p<=tot&&p<=20);return out;}
o.progress('Llegint pàgines, entrades i fitxers…');
const [pages,posts,media]=await Promise.all([all('pages','id,link,modified,title,content'),all('posts','id,link,modified,date,title,content'),all('media','id,source_url,alt_text,mime_type,modified,date,title,media_details')]);
const T=x=>{const d=document.createElement('textarea');d.innerHTML=x||'';return d.value;};
const docs=[...pages.map(p=>({...p,k:'pàgina'})),...posts.map(p=>({...p,k:'entrada'}))];
const edit=id=>base+'wp-admin/post.php?post='+id+'&action=edit';
const R={v:V,site:base,name:T(siteName),partial:!o.file,date:new Date().toISOString().slice(0,10),counts:{pages:pages.length,posts:posts.length,media:media.length}};
const now=new Date(),y=now.getFullYear()%100,cs=now.getMonth()>=8?y:y-1;
const oldCourse=s=>{let m,re=/(?:^|\D)(\d{2})\s?[-_\/]\s?(\d{2})(?:\D|$)/g;while(m=re.exec(s)){const a=+m[1],b=+m[2];if(b===a+1&&a<cs&&a>=10)return true;}const ys=(s.match(/20[12]\d/g)||[]).map(Number);return ys.length>0&&Math.max(...ys)<2000+cs;};
o.progress('Revisant accessibilitat i contingut…');
const imgs=media.filter(m=>m.mime_type.startsWith('image/'));
const noAlt=imgs.filter(m=>!(m.alt_text||'').trim());
R.acc={imgs:imgs.length,noAlt:noAlt.length,skips:[],generic:[]};
R.dades={emails:[],tel:[],dni:[],iban:[],naix:[],tables:[]};
R.ia={leftovers:[],links:[],decl:[],c2pa:[],names:[],pdfAI:[],ext:{}};
const host=new URL(base).hostname;
const okMail=new RegExp('@('+['xtec.cat','gencat.cat',host.replace(/^www\./,'')].map(h=>h.replace(/\./g,'\\.')).join('|')+')$','i');
const dniOk=s=>{const m=s.toUpperCase().match(/^([XYZ]?)(\d{7,8})([A-Z])$/);if(!m)return false;const n=+(({X:'0',Y:'1',Z:'2'}[m[1]]||'')+m[2]);return 'TRWAGMYFPDXBNJZSQVHLCKE'[n%23]===m[3];};
const leftRe=/(com a model de llenguatge|como modelo de lenguaje|as an ai language|aquí tens (un|una|el|la|els|les) |espero que (això|aixo) (t'|et )?ajudi|espero que esto te ayude|certainly!|\[inser(eix|ta|ir|t)[^\]]{0,40}\]|\[nom (de|del)[^\]]{0,40}\]|my knowledge cutoff)/i;
const aiLinkRe=/(chatgpt\.com|chat\.openai|gemini\.google|copilot\.microsoft|claude\.ai|perplexity\.ai|character\.ai|poe\.com|chat\.deepseek|chat\.mistral|gamma\.app|magicschool|notebooklm)/i;
const declRe=/(intel·lig[eè]ncia artificial|intel\.lig[eè]ncia artificial|inteligencia artificial)/i;
let drive=[],photoPosts=0,internal=new Map();
for(const d of docs){const h=d.content?.rendered||'';const doc=new DOMParser().parseFromString(h,'text/html');const t=doc.body.textContent||'';const tt=T(d.title?.rendered);
 let prev=1;doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(x=>{const l=+x.tagName[1];if(l>prev+1&&!R.acc.skips.some(s=>s.t===tt))R.acc.skips.push({t:tt,s:'H'+prev+' → H'+l,e:edit(d.id)});prev=l;});
 doc.querySelectorAll('a').forEach(a=>{const tx=a.textContent.trim().toLowerCase();if(/^(aqu[ií]|clica|clic|fes clic|fes clic aquí|clica aquí|enllaç|link|here|més|més informació)$/.test(tx)&&!R.acc.generic.some(g=>g.t===tt))R.acc.generic.push({t:tt,e:edit(d.id)});
  const href=a.getAttribute('href')||'';
  if(/docs\.google|drive\.google|forms\.gle|forms\.office|onedrive|sharepoint|dropbox/.test(href))drive.push({t:tt,u:href});
  if(aiLinkRe.test(href))R.ia.links.push({t:tt,u:href});
  try{const u=new URL(href,base);if(u.href.startsWith(base)&&!/wp-admin|#/.test(href)&&!internal.has(u.href.split('#')[0]))internal.set(u.href.split('#')[0],tt);}catch(e){}});
 doc.querySelectorAll('iframe,script').forEach(f=>{if(aiLinkRe.test(f.src||''))R.ia.links.push({t:tt,u:f.src});});
 if(doc.querySelector('img')&&d.k==='entrada')photoPosts++;
 (t.match(/[\w.+-]+@[a-z0-9-]+(?:\.[a-z]{2,})+/g)||[]).forEach(e=>{if(!okMail.test(e))R.dades.emails.push({t:tt,v:e});});
 (t.match(/(?:\+34[ .]?)?\b[67]\d{2}[ .]?\d{3}[ .]?\d{3}\b/g)||[]).forEach(v=>R.dades.tel.push({t:tt,v}));
 (t.match(/\b[XYZ]?\d{7,8}[ -]?[A-Z]\b/gi)||[]).forEach(v=>{if(dniOk(v.replace(/[ -]/g,'')))R.dades.dni.push({t:tt,v:v.slice(0,3)+'*****'+v.slice(-1)});});
 (t.match(/\bES\d{2}[ ]?\d{4}[ ]?\d{4}/g)||[]).forEach(v=>R.dades.iban.push({t:tt,v:v.slice(0,8)+'…'}));
 if(/(data de naixement|fecha de nacimiento|nascut el|nascuda el)/i.test(t))R.dades.naix.push({t:tt});
 doc.querySelectorAll('table').forEach(tb=>{if(tb.rows.length>5)R.dades.tables.push({t:tt,n:tb.rows.length});});
 const lm=t.match(leftRe);if(lm)R.ia.leftovers.push({t:tt,v:lm[0].slice(0,60),e:edit(d.id)});
 if(declRe.test(tt+' '+t))R.ia.decl.push({t:tt,l:d.link});}
R.dades.drive=drive.length;R.dades.driveEx=drive.slice(0,8);R.dades.photoPosts=photoPosts;
try{const r=await fetch(W+'users?per_page=5');R.dades.users=r.ok?(await r.json()).map(u=>u.slug):[];}catch(e){R.dades.users=[];}
try{const r=await fetch(W+'comments?per_page=1');R.dades.comments=r.ok?+(r.headers.get('X-WP-Total')||0):0;}catch(e){R.dades.comments=0;}
const sensRe=/(llist(a|at) (d'|de )?(admes|exclos|alumn)|admesos|exclosos|barem|baremaci|qualificacions|notes d|resultats d|adjudicaci|expedient|sanci|expulsi|beques|ajuts|justificaci[oó] (d'?)?abs[eè]ncia|matr[ií]cula.*alumn)/i;
R.dades.sens=media.filter(m=>!m.mime_type.startsWith('image/')&&sensRe.test(T(m.title.rendered)+' '+m.source_url)).map(m=>({t:T(m.title.rendered),u:m.source_url,d:(m.date||'').slice(0,10)}));
R.cad={old:[],stale:[],dups:[]};
media.filter(m=>!m.mime_type.startsWith('image/')).forEach(m=>{const t=T(m.title.rendered);if(oldCourse(t+' '+m.source_url.split('/').pop()))R.cad.old.push({t,u:m.source_url});});
pages.forEach(p=>{if(now-new Date(p.modified)>2*365*864e5)R.cad.stale.push({t:T(p.title.rendered),m:p.modified.slice(0,10),e:edit(p.id)});});
const g={};media.filter(m=>!m.mime_type.startsWith('image/')).forEach(m=>{const k=T(m.title.rendered).toLowerCase().replace(/\s*\(\d+\)\s*$/,'').replace(/[-_ ]\d{1,2}$/g,'').replace(/[-_ ]\d{1,2}$/g,'').trim();g[k]=(g[k]||0)+1;});
R.cad.dups=Object.entries(g).filter(([k,n])=>n>2).map(([t,n])=>({t,n})).sort((a,b)=>b.n-a.n).slice(0,10);
R.img={heavy:imgs.filter(m=>(m.media_details?.filesize||0)>1e6).map(m=>({f:m.source_url.split('/').pop(),mb:+(m.media_details.filesize/1e6).toFixed(1),u:m.source_url})).sort((a,b)=>b.mb-a.mb),heic:imgs.filter(m=>/heic|heif/i.test(m.mime_type+m.source_url)).length};
R.img.heavyN=R.img.heavy.length;R.img.heavy=R.img.heavy.slice(0,10);
const bad=[];const arr=o.head?[...internal].slice(0,300):[];
if(o.head)o.progress('Comprovant enllaços interns…');
for(let i=0;i<arr.length;i+=10){await Promise.all(arr.slice(i,i+10).map(async([u,t])=>{try{const s=await o.head(u);if(s>=400)bad.push({u,t,s});}catch(e){}}));}
R.links={checked:arr.length,bad};
const dec=s=>{if(!s)return'';if(/^<FEFF/i.test(s)){const h=s.slice(5,-1);let o='';for(let i=0;i+3<h.length;i+=4)o+=String.fromCharCode(parseInt(h.substr(i,4),16));return o;}if(s[0]==='<'){const h=s.slice(1,-1);let o='';for(let i=0;i+1<h.length;i+=2)o+=String.fromCharCode(parseInt(h.substr(i,2),16));return o;}let o=s.slice(1,-1).replace(/\\([()\\])/g,'$1');if(o.charCodeAt(0)===254&&o.charCodeAt(1)===255){let r='';for(let i=2;i+1<o.length;i+=2)r+=String.fromCharCode(o.charCodeAt(i)*256+o.charCodeAt(i+1));return r;}try{return decodeURIComponent(escape(o));}catch(e){return o;}};
o.progress('Llegint metadades dels PDF…');
const pdfs=!o.file?[]:media.filter(m=>m.mime_type==='application/pdf'&&(m.media_details?.filesize||0)<25e6).slice(0,150);
const pr=[];
for(let i=0;i<pdfs.length;i+=6){await Promise.all(pdfs.slice(i,i+6).map(async m=>{try{const b=await o.file(m.source_url,{Range:'bytes=0-'}).then(r=>r.arrayBuffer());const t=new TextDecoder('latin1').decode(new Uint8Array(b));const gt=k=>{const x=t.match(new RegExp('/'+k+'\\s*(\\((?:\\\\.|[^\\\\)])*\\)|<[0-9A-Fa-f]+>)'));if(x)return dec(x[1]).trim();if(k==='Author'){const z=t.match(/<dc:creator>\s*<rdf:Seq>\s*<rdf:li[^>]*>([^<]+)/);if(z)try{return decodeURIComponent(escape(z[1])).trim();}catch(e){return z[1].trim();}}return '';};pr.push({f:T(m.title.rendered),u:m.source_url,author:gt('Author'),creator:gt('Creator'),producer:gt('Producer')});}catch(e){}}));}
R.meta={pdfs:pr.length,authors:{},tools:{},withAuthor:pr.filter(p=>p.author).map(p=>({f:p.f,a:p.author,u:p.u}))};
pr.forEach(p=>{if(p.author)R.meta.authors[p.author]=(R.meta.authors[p.author]||0)+1;const tl=(p.creator+' '+p.producer).toLowerCase();[['ilovepdf','iLovePDF'],['smallpdf','Smallpdf'],['canva','Canva'],['gamma','Gamma (IA)'],['copilot','Copilot (IA)'],['chatgpt','ChatGPT (IA)'],['openai','OpenAI (IA)'],['beautiful.ai','Beautiful.ai (IA)']].forEach(([k,n])=>{if(tl.includes(k)){R.ia.ext[n]=(R.ia.ext[n]||0)+1;if(/IA/.test(n))R.ia.pdfAI.push({f:p.f,n});}});});
o.progress('Llegint metadades de les imatges…');
function exif(u8){let i=-1;for(let k=0;k<u8.length-6;k++){if(u8[k]==69&&u8[k+1]==120&&u8[k+2]==105&&u8[k+3]==102&&u8[k+4]==0&&u8[k+5]==0){i=k+6;break;}}if(i<0)return null;const dv=new DataView(u8.buffer,u8.byteOffset+i);const le=dv.getUint16(0)==0x4949;const r16=o=>dv.getUint16(o,le),r32=o=>dv.getUint32(o,le);const str=(o,n)=>{let s='';for(let j=0;j<n&&j<200;j++){const c=dv.getUint8(o+j);if(!c)break;s+=String.fromCharCode(c);}return s;};const out={};const ifd=(off,f)=>{const n=r16(off);for(let k=0;k<n&&k<200;k++){const e=off+2+k*12;const tag=r16(e),type=r16(e+2),cnt=r32(e+4);const vo=(cnt>4||type==5)?r32(e+8):e+8;f(tag,type,cnt,vo);}};
 try{let gps=0;ifd(r32(4),(tag,type,cnt,vo)=>{if(tag==0x010F)out.make=str(vo,cnt);if(tag==0x0110)out.model=str(vo,cnt);if(tag==0x013B)out.artist=str(vo,cnt);if(tag==0x8825)gps=r32(vo);});if(gps){const g={};ifd(gps,(tag,type,cnt,vo)=>{if(tag==1)g.a=str(vo,2);if(tag==3)g.b=str(vo,2);if(tag==2||tag==4){const v=[0,1,2].map(j=>r32(vo+j*8)/(r32(vo+j*8+4)||1));g[tag]=v[0]+v[1]/60+v[2]/3600;}});if(g[2])out.gps=((g.a=='S'?-1:1)*g[2]).toFixed(4)+','+((g.b=='W'?-1:1)*g[4]).toFixed(4);}}catch(e){}return out;}
const aiSig=/(trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia)/;
const genRe=/(GPT-[\w.]+|ChatGPT|DALL[·.\-]?E[\w ]*|Adobe Firefly|Firefly|Gemini|Imagen[\w ]*|Midjourney|Stable Diffusion|Microsoft Designer|Copilot|Bing Image Creator|Ideogram|Leonardo)/;
const ir=[];
if(o.file)for(let i=0;i<imgs.length;i+=12){o.progress('Llegint metadades de les imatges… '+Math.min(i+12,imgs.length)+'/'+imgs.length);await Promise.all(imgs.slice(i,i+12).map(async m=>{try{const b=await o.file(m.source_url,{Range:'bytes=0-262143'}).then(r=>r.arrayBuffer());const u8=new Uint8Array(b);const s=new TextDecoder('latin1').decode(u8);const f=m.source_url.split('/').pop();const e=exif(u8)||{};if(e.make||e.gps||e.artist)ir.push({f,u:m.source_url,...e});
 if(aiSig.test(s)||/c2pa/.test(s)&&genRe.test(s)){const gm=s.match(genRe);R.ia.c2pa.push({f,u:m.source_url,g:gm?gm[0]:'IA (sense nom)',d:(m.date||'').slice(0,10)});}
 if(/canva/i.test(s))R.ia.ext['Canva']=(R.ia.ext['Canva']||0)+1;}catch(e){}}));}
R.meta.imgs=imgs.length;R.meta.exif=ir.length;R.meta.gps=ir.filter(x=>x.gps).map(x=>({f:x.f,u:x.u,gps:x.gps,cam:((x.make||'')+' '+(x.model||'')).trim()}));R.meta.artist=ir.filter(x=>x.artist).map(x=>({f:x.f,a:x.artist}));
R.meta.cams=[...new Set(ir.map(x=>((x.make||'')+' '+(x.model||'')).trim()).filter(Boolean))].slice(0,8);
R.ia.names=media.filter(m=>/(chatgpt|dall[-_ ]?e|midjourney|firefly|gemini_generated|copilot|stable[-_ ]?diffusion|ai[-_ ]generated|ideogram|leonardo)/i.test(m.source_url)).map(m=>m.source_url.split('/').pop());
return R;
}