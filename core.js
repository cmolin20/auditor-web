async function AUDIT(o){
const V='3.0';const base=o.base;const api=base+'wp-json/';
let siteName=new URL(base).pathname.replace(/\//g,' ').trim()||new URL(base).hostname;
try{const j=await fetch(api).then(r=>r.json());if(j&&j.name)siteName=j.name;}catch(e){}
const W=api+'wp/v2/';
async function all(type,fields){let out=[],p=1,tot=1;do{const r=await fetch(W+type+'?per_page=100&page='+p+'&_fields='+fields);if(!r.ok)return out;tot=+r.headers.get('X-WP-TotalPages')||1;out=out.concat(await r.json());p++;}while(p<=tot&&p<=20);return out;}
o.progress('Llegint pàgines, notícies i fitxers…');
const [pages,posts,media]=await Promise.all([all('pages','id,link,modified,title,content,featured_media'),all('posts','id,link,modified,date,title,content,featured_media'),all('media','id,source_url,alt_text,mime_type,modified,date,title,media_details')]);
const T=x=>{const d=document.createElement('textarea');d.innerHTML=x||'';return d.value;};
const edit=id=>base+'wp-admin/post.php?post='+id+'&action=edit';
const docs=[...pages.map(p=>({...p,k:'Pàgina'})),...posts.map(p=>({...p,k:'Notícia'}))].map(d=>({...d,tt:T(d.title?.rendered)||'(sense títol)',ref:{t:T(d.title?.rendered)||'(sense títol)',k:d.k,l:d.link,e:edit(d.id)}}));
const R={v:V,site:base,name:T(siteName),partial:!o.file,date:new Date().toISOString().slice(0,10),counts:{pages:pages.length,posts:posts.length,media:media.length}};
const fn=u=>{try{return decodeURIComponent(new URL(u,base).pathname.split('/').pop());}catch(e){return String(u).split('/').pop();}};
const key=u=>fn(u).toLowerCase().replace(/-(\d+)x(\d+)(?=\.\w+$)/,'').replace(/-scaled(?=\.\w+$)/,'');
const parsed=docs.map(d=>({d,doc:new DOMParser().parseFromString(d.content?.rendered||'','text/html')}));
const use=new Map();const addUse=(k,ref)=>{if(!use.has(k))use.set(k,[]);const a=use.get(k);if(!a.some(x=>x.l===ref.l))a.push(ref);};
for(const {d,doc} of parsed){doc.querySelectorAll('img[src],a[href],source[src],video[src],audio[src]').forEach(el=>{const u=el.getAttribute('src')||el.getAttribute('href')||'';if(u.includes('/wp-content/uploads/'))addUse(key(u),d.ref);(el.getAttribute('srcset')||'').split(',').forEach(s=>{const v=s.trim().split(' ')[0];if(v.includes('/wp-content/uploads/'))addUse(key(v),d.ref);});});
 if(d.featured_media){const m=media.find(x=>x.id===d.featured_media);if(m)addUse(key(m.source_url),{...d.ref,feat:1});}}
const where=m=>(use.get(key(m.source_url))||[]).slice(0,6);
const mref=m=>({f:fn(m.source_url),t:T(m.title?.rendered),u:m.source_url,e:edit(m.id),d:(m.date||'').slice(0,10),w:where(m)});
const now=new Date(),y=now.getFullYear()%100,cs=now.getMonth()>=8?y:y-1;
const oldCourse=s=>{let m,re=/(?:^|\D)(\d{2})\s?[-_\/]\s?(\d{2})(?:\D|$)/g;while(m=re.exec(s)){const a=+m[1],b=+m[2];if(b===a+1&&a<cs&&a>=10)return true;}const ys=(s.match(/20[12]\d/g)||[]).map(Number);return ys.length>0&&Math.max(...ys)<2000+cs;};
o.progress('Revisant el contingut…');
const imgs=media.filter(m=>m.mime_type.startsWith('image/'));
const files=media.filter(m=>!m.mime_type.startsWith('image/'));
R.acc={imgs:imgs.length,noAlt:0,libNoAlt:[],pagesNoAlt:[],skips:[],generic:[]};
R.dades={emails:[],tel:[],dni:[],iban:[],naix:[],tables:[],driveList:[],photoList:[]};
R.ia={leftovers:[],links:[],decl:[],c2pa:[],names:[],pdfAI:[],ext:{},extFiles:[]};
const host=new URL(base).hostname;
const okMail=new RegExp('@('+['xtec.cat','gencat.cat',host.replace(/^www\./,'')].map(h=>h.replace(/\./g,'\\.')).join('|')+')$','i');
const dniOk=s=>{const m=s.toUpperCase().match(/^([XYZ]?)(\d{7,8})([A-Z])$/);if(!m)return false;const n=+(({X:'0',Y:'1',Z:'2'}[m[1]]||'')+m[2]);return 'TRWAGMYFPDXBNJZSQVHLCKE'[n%23]===m[3];};
const leftRe=/(com a model de llenguatge|como modelo de lenguaje|as an ai language|aquí tens (un|una|el|la|els|les) |espero que (això|aixo) (t'|et )?ajudi|espero que esto te ayude|certainly!|\[inser(eix|ta|ir|t)[^\]]{0,40}\]|\[nom (de|del)[^\]]{0,40}\]|my knowledge cutoff)/i;
const aiLinkRe=/(chatgpt\.com|chat\.openai|gemini\.google|copilot\.microsoft|claude\.ai|perplexity\.ai|character\.ai|poe\.com|chat\.deepseek|chat\.mistral|gamma\.app|magicschool|notebooklm)/i;
const declRe=/(intel·lig[eè]ncia artificial|intel\.lig[eè]ncia artificial|inteligencia artificial)/i;
const genRe=/^(aqu[ií]|clica|clic|fes clic|fes clic aquí|clica aquí|enllaç|link|here|més|més informació|veure|descarrega|descarregar)$/;
const ctx=(t,i,len)=>t.slice(Math.max(0,i-40),i+len+40).replace(/\s+/g,' ').trim();
let internal=new Map();
for(const {d,doc} of parsed){const t=doc.body.textContent||'';const ref=d.ref;
 let prev=1;doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(x=>{const l=+x.tagName[1];if(l>prev+1)R.acc.skips.push({...ref,s:'Títol '+prev+' → Títol '+l,h:x.textContent.trim().slice(0,80)});prev=l;});
 const na=[...doc.querySelectorAll('img')].filter(i=>!(i.getAttribute('alt')||'').trim()).map(i=>fn(i.getAttribute('src')||''));
 if(na.length)R.acc.pagesNoAlt.push({...ref,n:na.length,files:na.slice(0,12)});
 doc.querySelectorAll('a').forEach(a=>{const tx=a.textContent.trim();const href=a.getAttribute('href')||'';
  if(genRe.test(tx.toLowerCase()))R.acc.generic.push({...ref,txt:tx,href});
  if(/docs\.google|drive\.google|forms\.gle|forms\.office|onedrive|sharepoint|dropbox/.test(href))R.dades.driveList.push({...ref,txt:tx.slice(0,80)||'(sense text)',href});
  if(aiLinkRe.test(href))R.ia.links.push({...ref,txt:tx.slice(0,80),href});
  try{const u=new URL(href,base);const k=u.href.split('#')[0];if(u.href.startsWith(base)&&!/wp-admin|#/.test(href)&&!internal.has(k))internal.set(k,{...ref,txt:tx.slice(0,80)});}catch(e){}});
 doc.querySelectorAll('iframe,script').forEach(f=>{if(aiLinkRe.test(f.src||''))R.ia.links.push({...ref,txt:'(incrustat)',href:f.src});});
 const ni=doc.querySelectorAll('img').length;if(ni&&d.k==='Notícia')R.dades.photoList.push({...ref,n:ni});
 let m,re;
 re=/[\w.+-]+@[a-z0-9-]+(?:\.[a-z]{2,})+/g;while(m=re.exec(t)){if(!okMail.test(m[0]))R.dades.emails.push({...ref,v:m[0],c:ctx(t,m.index,m[0].length)});}
 re=/(?:\+34[ .]?)?\b[67]\d{2}[ .]?\d{3}[ .]?\d{3}\b/g;while(m=re.exec(t))R.dades.tel.push({...ref,v:m[0],c:ctx(t,m.index,m[0].length)});
 re=/\b[XYZ]?\d{7,8}[ -]?[A-Z]\b/gi;while(m=re.exec(t)){if(dniOk(m[0].replace(/[ -]/g,'')))R.dades.dni.push({...ref,v:m[0].slice(0,3)+'*****'+m[0].slice(-1),c:ctx(t,m.index,0)});}
 re=/\bES\d{2}[ ]?\d{4}[ ]?\d{4}/g;while(m=re.exec(t))R.dades.iban.push({...ref,v:m[0].slice(0,8)+'…'});
 m=t.match(/(data de naixement|fecha de nacimiento|nascut el|nascuda el)/i);if(m)R.dades.naix.push({...ref,c:ctx(t,m.index,m[0].length)});
 doc.querySelectorAll('table').forEach(tb=>{if(tb.rows.length>5)R.dades.tables.push({...ref,n:tb.rows.length,h:(tb.rows[0]?.textContent||'').replace(/\s+/g,' ').trim().slice(0,90)});});
 m=t.match(leftRe);if(m)R.ia.leftovers.push({...ref,v:m[0].slice(0,60),c:ctx(t,m.index,m[0].length)});
 if(declRe.test(d.tt+' '+t))R.ia.decl.push(ref);}
const noAltLib=imgs.filter(m=>!(m.alt_text||'').trim());
R.acc.noAlt=noAltLib.length;
R.acc.libNoAlt=noAltLib.map(mref).sort((a,b)=>b.w.length-a.w.length);
try{const r=await fetch(W+'users?per_page=5');R.dades.users=r.ok?(await r.json()).map(u=>u.slug):[];}catch(e){R.dades.users=[];}
try{const r=await fetch(W+'comments?per_page=1');R.dades.comments=r.ok?+(r.headers.get('X-WP-Total')||0):0;}catch(e){R.dades.comments=0;}
const sensRe=/(llist(a|at) (d'|de )?(admes|exclos|alumn)|admesos|exclosos|barem|baremaci|qualificacions|notes d|resultats d|adjudicaci|expedient|sanci|expulsi|beques|ajuts|justificaci[oó] (d'?)?abs[eè]ncia|matr[ií]cula.*alumn)/i;
R.dades.sens=files.filter(m=>sensRe.test(T(m.title.rendered)+' '+m.source_url)).map(mref);
R.cad={old:files.filter(m=>oldCourse(T(m.title.rendered)+' '+fn(m.source_url))).map(mref),stale:pages.filter(p=>now-new Date(p.modified)>2*365*864e5).map(p=>({t:T(p.title.rendered),l:p.link,e:edit(p.id),m:p.modified.slice(0,10)})),dups:[]};
const g={};files.forEach(m=>{const k=T(m.title.rendered).toLowerCase().replace(/\s*\(\d+\)\s*$/,'').replace(/[-_ ]\d{1,2}$/g,'').replace(/[-_ ]\d{1,2}$/g,'').trim();(g[k]=g[k]||[]).push(m);});
R.cad.dups=Object.entries(g).filter(([k,a])=>a.length>2).map(([t,a])=>({t,files:a.map(mref)})).sort((a,b)=>b.files.length-a.files.length).slice(0,15);
R.cad.unused=files.filter(m=>!where(m).length).length;
R.img={heavy:imgs.filter(m=>(m.media_details?.filesize||0)>1e6).sort((a,b)=>b.media_details.filesize-a.media_details.filesize).map(m=>({...mref(m),mb:+(m.media_details.filesize/1e6).toFixed(1)})),heic:imgs.filter(m=>/heic|heif/i.test(m.mime_type+m.source_url)).map(mref)};
R.img.heavyN=R.img.heavy.length;
const bad=[];const arr=o.head?[...internal].slice(0,400):[];
if(o.head)o.progress('Comprovant els enllaços…');
for(let i=0;i<arr.length;i+=10){await Promise.all(arr.slice(i,i+10).map(async([u,ref])=>{try{const s=await o.head(u);if(s>=400)bad.push({...ref,u,s});}catch(e){}}));}
R.links={checked:arr.length,bad};
const dec=s=>{if(!s)return'';if(/^<FEFF/i.test(s)){const h=s.slice(5,-1);let o='';for(let i=0;i+3<h.length;i+=4)o+=String.fromCharCode(parseInt(h.substr(i,4),16));return o;}if(s[0]==='<'){const h=s.slice(1,-1);let o='';for(let i=0;i+1<h.length;i+=2)o+=String.fromCharCode(parseInt(h.substr(i,2),16));return o;}let o=s.slice(1,-1).replace(/\\([()\\])/g,'$1');if(o.charCodeAt(0)===254&&o.charCodeAt(1)===255){let r='';for(let i=2;i+1<o.length;i+=2)r+=String.fromCharCode(o.charCodeAt(i)*256+o.charCodeAt(i+1));return r;}try{return decodeURIComponent(escape(o));}catch(e){return o;}};
o.progress('Obrint els PDF…');
const pdfs=!o.file?[]:files.filter(m=>m.mime_type==='application/pdf'&&(m.media_details?.filesize||0)<25e6).slice(0,200);
const pr=[];
for(let i=0;i<pdfs.length;i+=6){o.progress('Obrint els PDF… '+Math.min(i+6,pdfs.length)+'/'+pdfs.length);await Promise.all(pdfs.slice(i,i+6).map(async m=>{try{const b=await o.file(m.source_url,{Range:'bytes=0-'}).then(r=>r.arrayBuffer());const t=new TextDecoder('latin1').decode(new Uint8Array(b));const gt=k=>{const x=t.match(new RegExp('/'+k+'\\s*(\\((?:\\\\.|[^\\\\)])*\\)|<[0-9A-Fa-f]+>)'));if(x)return dec(x[1]).trim();if(k==='Author'){const z=t.match(/<dc:creator>\s*<rdf:Seq>\s*<rdf:li[^>]*>([^<]+)/);if(z)try{return decodeURIComponent(escape(z[1])).trim();}catch(e){return z[1].trim();}}return '';};pr.push({m,author:gt('Author'),creator:gt('Creator'),producer:gt('Producer')});}catch(e){}}));}
R.meta={pdfs:pr.length,authors:{},withAuthor:pr.filter(p=>p.author).map(p=>({...mref(p.m),a:p.author}))};
pr.forEach(p=>{if(p.author)R.meta.authors[p.author]=(R.meta.authors[p.author]||0)+1;const tl=(p.creator+' '+p.producer).toLowerCase();[['ilovepdf','iLovePDF'],['smallpdf','Smallpdf'],['canva','Canva'],['gamma','Gamma (IA)'],['copilot','Copilot (IA)'],['chatgpt','ChatGPT (IA)'],['openai','OpenAI (IA)'],['beautiful.ai','Beautiful.ai (IA)']].forEach(([k,n])=>{if(tl.includes(k)){R.ia.ext[n]=(R.ia.ext[n]||0)+1;R.ia.extFiles.push({...mref(p.m),n});if(/IA/.test(n))R.ia.pdfAI.push({...mref(p.m),n});}});});
function exif(u8){let i=-1;for(let k=0;k<u8.length-6;k++){if(u8[k]==69&&u8[k+1]==120&&u8[k+2]==105&&u8[k+3]==102&&u8[k+4]==0&&u8[k+5]==0){i=k+6;break;}}if(i<0)return null;const dv=new DataView(u8.buffer,u8.byteOffset+i);const le=dv.getUint16(0)==0x4949;const r16=o=>dv.getUint16(o,le),r32=o=>dv.getUint32(o,le);const str=(o,n)=>{let s='';for(let j=0;j<n&&j<200;j++){const c=dv.getUint8(o+j);if(!c)break;s+=String.fromCharCode(c);}return s;};const out={};const ifd=(off,f)=>{const n=r16(off);for(let k=0;k<n&&k<200;k++){const e=off+2+k*12;const tag=r16(e),type=r16(e+2),cnt=r32(e+4);const vo=(cnt>4||type==5)?r32(e+8):e+8;f(tag,type,cnt,vo);}};
 try{let gps=0;ifd(r32(4),(tag,type,cnt,vo)=>{if(tag==0x010F)out.make=str(vo,cnt);if(tag==0x0110)out.model=str(vo,cnt);if(tag==0x013B)out.artist=str(vo,cnt);if(tag==0x8825)gps=r32(vo);});if(gps){const g={};ifd(gps,(tag,type,cnt,vo)=>{if(tag==1)g.a=str(vo,2);if(tag==3)g.b=str(vo,2);if(tag==2||tag==4){const v=[0,1,2].map(j=>r32(vo+j*8)/(r32(vo+j*8+4)||1));g[tag]=v[0]+v[1]/60+v[2]/3600;}});if(g[2])out.gps=((g.a=='S'?-1:1)*g[2]).toFixed(4)+','+((g.b=='W'?-1:1)*g[4]).toFixed(4);}}catch(e){}return out;}
const aiSig=/(trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia)/;
const genAI=/(GPT-[\w.]+|ChatGPT|DALL[·.\-]?E[\w ]*|Adobe Firefly|Firefly|Gemini|Imagen[\w ]*|Midjourney|Stable Diffusion|Microsoft Designer|Copilot|Bing Image Creator|Ideogram|Leonardo)/;
const ir=[];
if(o.file)for(let i=0;i<imgs.length;i+=12){o.progress('Obrint les fotos… '+Math.min(i+12,imgs.length)+'/'+imgs.length);await Promise.all(imgs.slice(i,i+12).map(async m=>{try{const b=await o.file(m.source_url,{Range:'bytes=0-262143'}).then(r=>r.arrayBuffer());const u8=new Uint8Array(b);const s=new TextDecoder('latin1').decode(u8);const e=exif(u8)||{};if(e.make||e.gps||e.artist)ir.push({...mref(m),...e});
 if(aiSig.test(s)||/c2pa/.test(s)&&genAI.test(s)){const gm=s.match(genAI);R.ia.c2pa.push({...mref(m),g:gm?gm[0]:'IA'});}
 if(/canva/i.test(s)){R.ia.ext['Canva']=(R.ia.ext['Canva']||0)+1;R.ia.extFiles.push({...mref(m),n:'Canva'});}}catch(e){}}));}
R.meta.imgs=imgs.length;R.meta.exif=ir.length;R.meta.gps=ir.filter(x=>x.gps);R.meta.artist=ir.filter(x=>x.artist);
R.meta.cams=[...new Set(ir.map(x=>((x.make||'')+' '+(x.model||'')).trim()).filter(Boolean))].slice(0,8);
R.ia.names=media.filter(m=>/(chatgpt|dall[-_ ]?e|midjourney|firefly|gemini_generated|copilot|stable[-_ ]?diffusion|ai[-_ ]generated|ideogram|leonardo)/i.test(m.source_url)).map(mref);
return R;
}
