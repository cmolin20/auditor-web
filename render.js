function render(R){
const A=R.acc||{},D=R.dades||{},M=R.meta||{},I=R.ia||{},C=R.cad||{},G=R.img||{},L=R.links||{};
const n=x=>(x||[]).length;
const CATS={
dades:{t:'Dades personals',why:'La web és pública: qualsevol persona, i també Google, pot veure i guardar el que s\'hi publica. No s\'hi han de deixar dades d\'alumnes, famílies o personal més temps del necessari.',how:['Clica <b>Edita</b>, busca la dada amb Ctrl+F, esborra-la i desa amb <b>Actualitza</b>.','Llistes i barems: quan el termini s\'ha acabat, treu l\'enllaç de la pàgina i esborra el fitxer (<b>Fitxer</b> › Suprimeix permanentment).','Google Drive: obre el document › <b>Comparteix</b> › «Accés general». Si té dades personals, posa <b>Restringit</b>.','Fotos d\'alumnes: comprova que hi ha l\'autorització de drets d\'imatge d\'aquest curs.']},
meta:{t:'Informació amagada als fitxers',why:'Els PDF i les fotos porten dades que no es veuen però que qualsevol pot llegir si es descarrega el fitxer: el nom de qui el va fer o el lloc on es va fer la foto.',how:['Obre l\'original al Word › <b>Fitxer › Informació › Inspecciona el document</b> › «Propietats del document i informació personal» › <b>Suprimeix-ho tot</b>. Torna\'l a desar en PDF.','Clica <b>Edita</b> a la pàgina, canvia l\'enllaç pel PDF nou i esborra el vell.','Al mòbil, desactiva la «Ubicació» a la configuració de la càmera.']},
ia:{t:'Intel·ligència artificial',why:'Fer servir IA no està malament, però cal dir-ho. Les imatges fetes amb ChatGPT, Gemini i similars porten un segell digital invisible que l\'eina detecta. No intentem endevinar si un text és d\'IA, perquè els detectors s\'equivoquen.',how:['Imatge feta amb IA: clica <b>Edita</b>, selecciona la imatge i escriu al peu «Imatge generada amb IA».','Publica una pàgina breu que expliqui per a què fa servir la IA el centre i com protegeix les dades.','No pugis documents amb dades personals a webs externes (iLovePDF, Canva…). Fes servir les eines del compte del centre.']},
acc:{t:'Accessibilitat',why:'Les persones cegues fan servir un programa que els llegeix la web en veu alta. Sense descripció, una foto només es llegeix com «imatge».',how:['Fotos: clica <b>Edita</b>, clica la foto i omple <b>Text alternatiu</b> amb una frase del que es veu.','Títols: clica el títol indicat i canvia\'n el nivell perquè vagin en ordre (Títol 2, després Títol 3…).','Enllaços: canvia «aquí» o «enllaç» per un text que digui on porta.']},
img:{t:'Fotos massa pesades',why:'Les fotos de mòbil alenteixen la web. Les d\'iPhone (HEIC) no es veuen a Chrome ni Edge.',how:['Descarrega la foto (<b>Fitxer</b>), obre-la amb l\'app Fotos de Windows › ⋯ › <b>Canvia la mida</b> › 1600 píxels › desa en JPG.','Clica <b>Edita</b> a la pàgina, posa la foto nova i esborra la vella.','A l\'iPhone: Configuració › Càmera › Formats › <b>Més compatible</b>.']},
cad:{t:'Documents antics o repetits',why:'Els documents de cursos passats confonen les famílies, i les còpies repetides fan dubtar de quin és el bo.',how:['Si està enllaçat, clica <b>Edita</b> i posa el document d\'aquest curs. Després esborra el vell.','Els fitxers que no surten a cap pàgina es poden esborrar des de <b>Fitxer</b> › Suprimeix permanentment. Si en dubtes, deixa\'l.']},
links:{t:'Enllaços que no funcionen',why:'Un enllaç trencat porta a una pàgina d\'error.',how:['Clica <b>Edita</b>, clica l\'enllaç i posa-hi l\'adreça correcta, o treu-lo.']}};
const iss=[];let k=0;
const add=(cat,sev,title,o={})=>iss.push({id:cat+(k++)+'-'+(o.key||title).slice(0,40),cat,sev,title,detail:o.detail||'',pages:o.pages||[],file:o.file||null,link:o.link||null});
(D.dni||[]).forEach(x=>add('dades','r','DNI o NIE visible',{detail:'«…'+x.c+'…»',pages:[x],key:x.l+x.v}));
(D.tel||[]).forEach(x=>add('dades','r','Telèfon mòbil visible: '+x.v,{detail:'«…'+x.c+'…»',pages:[x],key:x.l+x.v}));
(D.emails||[]).forEach(x=>add('dades','r','Correu personal visible: '+x.v,{detail:'«…'+x.c+'…»',pages:[x],key:x.l+x.v}));
(D.iban||[]).forEach(x=>add('dades','r','Compte bancari visible',{pages:[x],key:x.l+x.v}));
(D.naix||[]).forEach(x=>add('dades','r','Data de naixement visible',{detail:'«…'+x.c+'…»',pages:[x],key:x.l}));
(D.sens||[]).forEach(x=>add('dades','a','Document que pot contenir dades d\'alumnes',{detail:x.f+' · pujat el '+x.d,pages:x.w,file:x,key:x.u}));
(D.driveList||[]).forEach(x=>add('dades','a','Document de Google Drive: comprova qui el pot obrir',{detail:'Enllaç «'+x.txt+'»',pages:[x],link:x.href,key:x.l+x.href}));
(D.tables||[]).forEach(x=>add('dades','a','Taula de '+x.n+' files: comprova si és una llista de persones',{detail:x.h,pages:[x],key:x.l+x.h}));
(D.photoList||[]).forEach(x=>add('dades','a',x.n+' foto'+(x.n>1?'s':'')+': comprova l\'autorització de drets d\'imatge',{pages:[x],key:x.l}));
(M.withAuthor||[]).forEach(x=>add('meta','a','PDF amb el nom «'+x.a+'» amagat',{detail:x.f,pages:x.w,file:x,key:x.u}));
(M.gps||[]).forEach(x=>add('meta','r','Foto que diu on es va fer',{detail:x.f,pages:x.w,file:x,key:x.u}));
(M.artist||[]).forEach(x=>add('meta','a','Foto amb el nom «'+x.artist+'» amagat',{detail:x.f,pages:x.w,file:x,key:x.u}));
(I.c2pa||[]).forEach(x=>add('ia','a','Imatge feta amb IA ('+x.g+') sense indicar-ho',{detail:x.f,pages:x.w,file:x,key:x.u}));
(I.leftovers||[]).forEach(x=>add('ia','a','Text copiat d\'un xat d\'IA sense repassar',{detail:'«…'+x.c+'…»',pages:[x],key:x.l}));
(I.links||[]).forEach(x=>add('ia','a','Enllaç a un xat d\'IA',{detail:x.txt,pages:[x],link:x.href,key:x.l+x.href}));
if(!n(I.decl))add('ia','a','La web no té cap pàgina que expliqui com fa servir la IA el centre',{key:'decl'});
(I.extFiles||[]).forEach(x=>add('ia','a','Fitxer fet amb '+x.n+' (web externa)',{detail:x.f,pages:x.w,file:x,key:x.u}));
(A.pagesNoAlt||[]).forEach(x=>add('acc','a',x.n+' foto'+(x.n>1?'s':'')+' sense descripció',{detail:x.files.join(', ')+(x.n>x.files.length?'…':''),pages:[x],key:x.l}));
(A.skips||[]).forEach(x=>add('acc','a','Títol desordenat: «'+x.h+'»',{detail:x.s,pages:[x],key:x.l+x.h}));
(A.generic||[]).forEach(x=>add('acc','a','Enllaç que només diu «'+x.txt+'»',{detail:'Porta a: '+x.href,pages:[x],key:x.l+x.href}));
(G.heic||[]).forEach(x=>add('img','a','Foto en format d\'iPhone: no es veu a Chrome ni Edge',{detail:x.f,pages:x.w,file:x,key:x.u}));
const heicSet=new Set((G.heic||[]).map(x=>x.u));
(G.heavy||[]).filter(x=>!heicSet.has(x.u)).forEach(x=>add('img','a','Foto de '+x.mb.toLocaleString('ca')+' MB',{detail:x.f,pages:x.w,file:x,key:x.u}));
(C.old||[]).forEach(x=>add('cad','a','Document d\'un curs passat',{detail:x.f,pages:x.w,file:x,key:x.u}));
(C.dups||[]).forEach(g=>{const used=g.files.filter(f=>n(f.w));g.files.forEach(x=>{if(n(x.w)&&used.length<=1)return;add('cad','a','Còpia repetida de «'+g.t+'»',{detail:x.f+' · pujat el '+x.d,pages:x.w,file:x,key:x.u});});});
(C.stale||[]).forEach(x=>add('cad','a','Pàgina sense canvis des del '+x.m,{pages:[{...x,k:'Pàgina'}],key:x.l}));
(L.bad||[]).forEach(x=>add('links','a','Enllaç trencat (error '+x.s+')',{detail:(x.txt?'«'+x.txt+'» → ':'')+x.u,pages:[x],key:x.l+x.u}));
const SK='aw-done:'+R.site;let done={};try{done=JSON.parse(localStorage.getItem(SK)||'{}');}catch(e){}
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(done));}catch(e){}};
let view='pagina',filt='';
const B=(href,txt,cls='')=>href?`<a class="btn ${cls}" href="${url(href)}" target="_blank" rel="noopener">${txt}</a>`:'';
const cnt=c=>iss.filter(i=>i.cat===c).length;
const sevOf=c=>iss.some(i=>i.cat===c&&i.sev==='r')?'r':cnt(c)?'a':'g';
const row=(i,showPage)=>`<li class="iss${done[i.id]?' done':''}" data-id="${esc(i.id)}"><label class="ck"><input type="checkbox" ${done[i.id]?'checked':''} aria-label="Marcar com a fet"></label>
<div class="ib"><div class="it"><span class="dot ${i.sev}"></span>${esc(i.title)}</div>${i.detail?`<div class="id">${esc(i.detail)}</div>`:''}
${showPage?`<div class="ip">${i.pages.length?i.pages.slice(0,3).map(p=>`<span class="pg">${B(p.l,esc(p.t),'lnk')}${p.feat?' <span class="note">(imatge destacada)</span>':''} ${B(p.e,'Edita')}</span>`).join(''):(i.file?'<span class="note">No surt a cap pàgina</span>':'')}${i.pages.length>3?`<span class="note">i ${i.pages.length-3} més</span>`:''}</div>`:''}</div>
<div class="ia">${i.file?B(i.file.u,'Obre')+B(i.file.e,'Fitxer'):''}${i.link?B(i.link,'Obre'):''}</div></li>`;
function body(){
const list=iss.filter(i=>!filt||i.cat===filt);
const left=list.filter(i=>!done[i.id]).length;
let h=`<p class="note" style="margin:0 0 10px">${left} de ${list.length} pendents${filt?' a «'+esc(CATS[filt].t)+'»':''}.</p>`;
if(view==='tema'){
h+=Object.keys(CATS).filter(c=>!filt||c===filt).map(c=>{const its=list.filter(i=>i.cat===c);const p=its.filter(i=>!done[i.id]).length;
return `<details class="grp" ${filt?'open':''}><summary><span class="dot ${sevOf(c)}"></span><b>${esc(CATS[c].t)}</b><span class="cnt">${its.length?p+' pendents':'Tot bé'}</span></summary>
<div class="gin"><p class="why">${CATS[c].why}</p><details class="hw"><summary>Com s'arregla</summary><ol>${CATS[c].how.map(x=>`<li>${x}</li>`).join('')}</ol></details>
${its.length?`<ul class="issl">${its.map(i=>row(i,true)).join('')}</ul>`:'<p class="ok">✓ No s\'ha trobat res.</p>'}</div></details>`;}).join('');
}else{
const pg=new Map(),orphan=[],global=[];
list.forEach(i=>{if(!i.pages.length){(i.file?orphan:global).push(i);return;}i.pages.forEach(p=>{if(!pg.has(p.l))pg.set(p.l,{p,its:[]});pg.get(p.l).its.push(i);});});
const groups=[...pg.values()].sort((a,b)=>b.its.filter(i=>!done[i.id]).length-a.its.filter(i=>!done[i.id]).length);
h+=global.length?`<ul class="issl" style="margin-bottom:12px">${global.map(i=>row(i,false)).join('')}</ul>`:'';
h+=groups.map(g=>{const p=g.its.filter(i=>!done[i.id]).length;const cats=[...new Set(g.its.map(i=>CATS[i.cat].t))];
return `<details class="grp"><summary><span class="dot ${g.its.some(i=>i.sev==='r')?'r':p?'a':'g'}"></span><span class="gt"><b>${esc(g.p.t)}</b><small>${esc(g.p.k||'')} · ${esc(cats.join(', '))}</small></span><span class="cnt">${p?p+' pendents':'Fet ✓'}</span></summary>
<div class="gin"><div class="acts" style="margin-bottom:10px">${B(g.p.l,'Veure la pàgina')}${B(g.p.e,'Edita la pàgina','pri')}</div><ul class="issl">${g.its.map(i=>row(i,false).replace('<div class="it">',`<div class="it"><span class="tag">${esc(CATS[i.cat].t)}</span>`)).join('')}</ul></div></details>`;}).join('');
if(orphan.length)h+=`<details class="grp"><summary><span class="dot a"></span><span class="gt"><b>Fitxers que no surten a cap pàgina</b><small>Es poden descarregar si es coneix l'adreça. Revisa'ls abans d'esborrar-los.</small></span><span class="cnt">${orphan.filter(i=>!done[i.id]).length} pendents</span></summary><div class="gin"><ul class="issl">${orphan.map(i=>row(i,false).replace('<div class="it">',`<div class="it"><span class="tag">${esc(CATS[i.cat].t)}</span>`)).join('')}</ul></div></details>`;
}
$('rbody').innerHTML=h;
}
const total=iss.length,urg=iss.filter(i=>i.sev==='r').length;
let h=`<div class="band" id="resum"><h1>${urg?`${urg} ${urg==1?'cosa urgent':'coses urgents'} i ${total-urg} per revisar`:total?`${total} ${total==1?'cosa':'coses'} per revisar`:'No s\'ha trobat res per revisar'}</h1>
<div class="meta"><span>${esc(R.name)}</span><span>${esc(R.site)}</span><span>Revisat el ${esc(R.date)}</span><span>${R.counts?.pages||0} pàgines · ${R.counts?.posts||0} notícies · ${R.counts?.media||0} fitxers</span></div>
${R.partial?'<p class="note">Revisió reduïda: no s\'han pogut obrir els fitxers.</p>':''}
<div class="chips" role="group" aria-label="Filtra per tema"><button type="button" class="chip on" data-c="">Tots <b>${total}</b></button>${Object.keys(CATS).map(c=>`<button type="button" class="chip" data-c="${c}"><span class="dot ${sevOf(c)}"></span>${esc(CATS[c].t)} <b>${cnt(c)}</b></button>`).join('')}</div>
<div class="seg" role="group" aria-label="Com vols veure els resultats"><button type="button" class="sv on" data-v="pagina">Per pàgina</button><button type="button" class="sv" data-v="tema">Per tema</button></div>
<div id="rbody"></div>
<p class="note" style="margin-top:18px">«Edita» obre la pàgina a l'escriptori de WordPress (cal haver entrat amb l'usuari d'administració). «Fitxer» obre la fitxa del document o la foto a la Mediateca. Les caselles de «fet» es guarden en aquest navegador. L'informe és automàtic: assenyala coses per revisar; la decisió és del centre.</p></div>`;
$('report').innerHTML=h;
body();
$('report').onclick=e=>{const c=e.target.closest('.chip');if(c){filt=c.dataset.c;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===c));body();return;}
const v=e.target.closest('.sv');if(v){view=v.dataset.v;document.querySelectorAll('.sv').forEach(x=>x.classList.toggle('on',x===v));body();}};
$('report').onchange=e=>{const cb=e.target.closest('.iss input[type=checkbox]');if(!cb)return;const id=cb.closest('.iss').dataset.id;if(cb.checked)done[id]=1;else delete done[id];save();document.querySelectorAll('.iss').forEach(li=>{if(li.dataset.id===id){li.classList.toggle('done',cb.checked);const x=li.querySelector('input');if(x)x.checked=cb.checked;}});};
$('report').scrollIntoView({behavior:'smooth'});
}
