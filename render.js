function render(R){
const A=R.acc||{},D=R.dades||{},M=R.meta||{},I=R.ia||{},C=R.cad||{},G=R.img||{},L=R.links||{};
const n=x=>(x||[]).length;
const noAltP=pct(A.noAlt,A.imgs);
const dHard=n(D.dni)+n(D.iban)+n(D.tel)+n(D.emails)+n(D.naix);
const dSoft=n(D.sens)+(D.drive?1:0)+(D.photoPosts?1:0)+n(D.tables)+n(D.users);
const extN=Object.keys(I.ext||{}).length;
const st={
dades:dHard?'r':dSoft?'a':'g',
meta:R.partial?'n':(n(M.gps)||n(M.artist))?'r':n(M.withAuthor)?'a':'g',
ia:(n(I.c2pa)||n(I.leftovers)||n(I.links)||!n(I.decl)||extN)?'a':'g',
acc:(noAltP>10||n(A.skips)||n(A.generic))?'a':'g',
img:(G.heavyN||G.heic)?'a':'g',
cad:(n(C.old)||n(C.dups)||n(C.stale))?'a':'g',
links:R.partial?'n':n(L.bad)>5?'r':n(L.bad)?'a':'g'};
const S={r:'Urgent',a:'Cal mirar-ho',g:'Tot bé',n:'No revisat'};
const blocks=[
['dades','Dades personals',dHard?`Hi ha ${dHard} dades personals visibles a la web`:`No n'hi ha cap a la vista, però cal revisar ${n(D.sens)} documents i ${D.drive||0} enllaços`],
['meta','Informació amagada als fitxers',`${n(M.withAuthor)} PDF diuen qui els va fer · ${n(M.gps)} fotos diuen on es van fer`],
['ia','Intel·ligència artificial',`${n(I.c2pa)} imatge${n(I.c2pa)==1?'':'s'} feta${n(I.c2pa)==1?'':'s'} amb IA sense avisar-ho`],
['acc','Accessibilitat',`${noAltP}% de les fotos sense descripció per a persones cegues`],
['img','Fotos massa pesades',`${G.heavyN||0} fotos de més d'1 MB · ${G.heic||0} en format d'iPhone que no es veu a tot arreu`],
['cad','Documents antics o repetits',`${n(C.old)} documents de cursos passats · ${n(C.dups)} documents repetits`],
['links','Enllaços que no funcionen',R.partial?'No s\'ha pogut revisar':`${n(L.bad)} de ${L.checked||0} enllaços no funcionen`]];
const order={r:0,a:1,g:2,n:3};
const worst=[...blocks].sort((x,y)=>order[st[x[0]]]-order[st[y[0]]]);
let key,keyTxt;
if(dHard){key=dHard;keyTxt='dades personals que qualsevol pot veure a la web';}
else if(noAltP>50){key=noAltP+'%';keyTxt=`de les fotos no tenen descripció: una persona cega no sap què hi ha (${A.noAlt} de ${A.imgs})`;}
else if(n(I.c2pa)){key=n(I.c2pa);keyTxt='imatges fetes amb IA sense indicar-ho';}
else{key=n(M.withAuthor);keyTxt='PDF que porten amagat el nom de qui els va fer';}
const nR=Object.values(st).filter(v=>v==='r').length,nA=Object.values(st).filter(v=>v==='a').length;
const title=dHard?'La web mostra dades personals: cal retirar-les avui':nR?`La web té ${nR} problema${nR>1?'es':''} urgent${nR>1?'s':''} i ${nA} coses a millorar`:nA?`Res urgent, però hi ha ${nA} coses a millorar`:'La web està en bon estat';
const how=(steps)=>`<div class="how"><b>Com arreglar-ho</b><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol></div>`;
const why=t=>`<p class="why">${t}</p>`;
const tasks=[];
if(dHard)tasks.push(['Avui','Treure les dades personals que surten a la web','#s-dades']);
if(n(D.sens))tasks.push(['Aquesta setmana',`Revisar ${n(D.sens)} documents de llistes o barems i treure els que ja no calen`,'#s-dades']);
if(D.drive)tasks.push(['Aquesta setmana',`Comprovar qui pot obrir els ${D.drive} documents de Google Drive enllaçats`,'#s-dades']);
if(n(M.gps))tasks.push(['Aquesta setmana',`Treure ${n(M.gps)} fotos que diuen on es van fer`,'#s-meta']);
if(n(I.c2pa))tasks.push(['Aquesta setmana',`Indicar que ${n(I.c2pa)==1?'una imatge està feta':n(I.c2pa)+' imatges estan fetes'} amb IA`,'#s-ia']);
if(D.photoPosts)tasks.push(['Aquest mes',`Confirmar que hi ha autorització de les famílies per a les fotos de ${D.photoPosts} notícies`,'#s-dades']);
if(n(M.withAuthor))tasks.push(['Aquest mes',`Tornar a pujar ${n(M.withAuthor)} PDF sense el nom de qui els va fer`,'#s-meta']);
if(noAltP>10)tasks.push(['A poc a poc',`Posar una descripció a les fotos (${A.noAlt} pendents), començant per les més vistes`,'#s-acc']);
if(G.heic||G.heavyN)tasks.push(['A poc a poc','Canviar les fotos pesades o en format d\'iPhone per JPG','#s-img']);
if(n(C.old)||n(C.dups))tasks.push(['A poc a poc','Esborrar documents de cursos passats i còpies repetides','#s-cad']);
const editBtn=e=>e?`<a class="btn" href="${url(e)}" target="_blank" rel="noopener">Edita la pàgina</a>`:'';
const openBtn=u=>u?`<a class="btn" href="${url(u)}" target="_blank" rel="noopener">Obre</a>`:'';
const chk=(ok,txt)=>`<td class="${ok?'ok':'wa'}">${ok?'✓ ':'! '}${esc(txt)}</td>`;
let h=`<nav class="scroll" aria-label="Seccions"><a href="#resum">Resum</a>${blocks.map(b=>`<a href="#s-${b[0]}">${esc(b[1])}</a>`).join('')}</nav>
<div class="band" id="resum"><h1>${esc(title)}</h1>
<div class="meta"><span>${esc(R.name)}</span><span>${esc(R.site)}</span><span>Revisat el ${esc(R.date)}</span><span>${R.counts?.pages||0} pàgines, ${R.counts?.posts||0} notícies i ${R.counts?.media||0} fitxers</span></div>
<div class="hero"><div><div class="key"><b>${esc(key)}</b><span>${esc(keyTxt)}</span></div>
<p class="note" style="margin-top:10px">Aquest informe l'ha fet una eina automàtica. Assenyala coses a revisar; la decisió final és del centre.</p></div>
<div class="blocks">${worst.map(b=>`<a class="blk" href="#s-${b[0]}"><span class="dot ${st[b[0]]}"></span><span><b>${esc(b[1])}</b><small>${esc(b[2])}</small></span><span class="st ${st[b[0]]}">${S[st[b[0]]]}</span></a>`).join('')}</div></div>
${tasks.length?`<h2 style="margin-top:30px">Llista de feina</h2><p>Per ordre d'importància. Cada punt porta a l'explicació i als passos.</p><table class="stack"><thead><tr><th>Quan</th><th>Què cal fer</th><th></th></tr></thead><tbody>${tasks.map(t=>`<tr><td style="white-space:nowrap"><b>${esc(t[0])}</b></td><td>${esc(t[1])}</td><td><a class="btn" href="${t[2]}">Com fer-ho</a></td></tr>`).join('')}</tbody></table>`:''}
<p class="note" style="margin-top:14px">On diu «Edita la pàgina», el botó obre l'escriptori de WordPress. Cal haver entrat abans amb l'usuari d'administració de la web.</p></div>`;

h+=`<section class="sec band" id="s-dades"><div class="lead"><h2>Dades personals</h2><span class="st ${st.dades}">${S[st.dades]}</span></div>
${why('La web del centre és pública: qualsevol persona, i també els cercadors com Google, pot veure i guardar el que s\'hi publica. Per llei (protecció de dades), no s\'hi poden publicar dades personals d\'alumnes, famílies o personal si no és imprescindible i per un temps limitat.')}
<table class="stack"><thead><tr><th>Què hem buscat</th><th>Resultat</th></tr></thead><tbody>
<tr><td>Números de DNI o NIE</td>${chk(!n(D.dni),n(D.dni)?n(D.dni)+' trobats':'Cap')}</tr>
<tr><td>Telèfons mòbils</td>${chk(!n(D.tel),n(D.tel)?n(D.tel)+' trobats':'Cap')}</tr>
<tr><td>Correus personals (no del centre)</td>${chk(!n(D.emails),n(D.emails)?n(D.emails)+' trobats':'Cap')}</tr>
<tr><td>Comptes bancaris</td>${chk(!n(D.iban),n(D.iban)?n(D.iban)+' trobats':'Cap')}</tr>
<tr><td>Dates de naixement</td>${chk(!n(D.naix),n(D.naix)?n(D.naix)+' pàgines':'Cap')}</tr>
<tr><td>Documents amb nom de llista, barem o justificant</td>${chk(!n(D.sens),n(D.sens)?n(D.sens)+' per revisar':'Cap')}</tr>
<tr><td>Enllaços a documents de Google Drive o Forms</td>${chk(!D.drive,D.drive?D.drive+' per revisar':'Cap')}</tr>
<tr><td>Notícies amb fotos (poden sortir alumnes)</td>${chk(!D.photoPosts,D.photoPosts?D.photoPosts+' notícies':'Cap')}</tr>
<tr><td>Taules llargues (poden ser llistes de noms)</td>${chk(!n(D.tables),n(D.tables)?(D.tables||[]).map(t=>t.t).join(', '):'Cap')}</tr>
</tbody></table>
${dHard?`<h3>Dades trobades</h3>${tbl(['On és','Dada'],[...(D.dni||[]),...(D.tel||[]),...(D.emails||[]),...(D.iban||[])].map(x=>`<tr><td>${esc(x.t)}</td><td>${esc(x.v)}</td></tr>`))}`:''}
${n(D.sens)?`<h3>Documents per revisar</h3><p>Pel nom, poden contenir dades d'alumnes. Obre'ls i mira què hi surt.</p>${tbl(['Document','Pujat el',''],(D.sens||[]).map(x=>`<tr><td>${esc(x.t)}</td><td style="white-space:nowrap">${esc(x.d)}</td><td>${openBtn(x.u)}</td></tr>`))}`:''}
${how([
'<b>Documents de llistes i barems:</b> si el termini ja ha passat, treu-los. A l\'escriptori de WordPress, ves a <b>Mèdia › Biblioteca</b>, cerca el document pel nom, obre\'l i clica <b>Suprimeix permanentment</b>. Abans, treu l\'enllaç de la pàgina on surt.',
'<b>Llistes que s\'han de publicar</b> (admesos, notes de proves): que hi surti només el número de sol·licitud o les inicials, mai nom complet i DNI junts.',
'<b>Enllaços a Google Drive:</b> obre cada enllaç, clica <b>Comparteix</b> i mira què diu a «Accés general». Si és «Qualsevol persona amb l\'enllaç» i el document té dades personals, canvia-ho a <b>Restringit</b>.',
'<b>Fotos d\'alumnes:</b> comprova que les famílies han signat l\'autorització de drets d\'imatge d\'aquest curs. Si en falta alguna, treu la foto o difumina la cara.',
'<b>Dubtes:</b> consulta la delegada o el delegat de protecció de dades del Departament.'])}
</section>`;

const auth=Object.entries(M.authors||{}).sort((a,b)=>b[1]-a[1]);
h+=`<section class="sec band" id="s-meta"><div class="lead"><h2>Informació amagada als fitxers</h2><span class="st ${st.meta}">${S[st.meta]}</span></div>
${why('Els PDF i les fotos porten informació que no es veu però que qualsevol pot llegir si es descarrega el fitxer: el nom de la persona que el va fer, el programa i, a les fotos fetes amb mòbil, sovint el lloc exacte on es van fer. És com deixar una etiqueta amb el nom enganxada a sota d\'un document.')}
${R.partial?'<p class="note">No s\'han pogut obrir els fitxers en aquesta revisió.</p>':`
<div class="box"><b>${n(M.withAuthor)} de ${M.pdfs||0} PDF porten el nom de qui els va fer</b><div class="bar"><i style="width:${pct(n(M.withAuthor),M.pdfs)}%;background:var(--amb)"></i></div><span class="note">${n(M.gps)?n(M.gps)+' fotos diuen el lloc on es van fer.':'Cap foto diu el lloc on es va fer.'}</span></div>
${auth.length?`<h3>Noms que apareixen</h3>${tbl(['Nom amagat al fitxer','Quants PDF'],auth.map(a=>`<tr><td>${esc(a[0])}</td><td class="n">${a[1]}</td></tr>`))}`:''}
${n(M.withAuthor)?`<h3>Fitxers</h3>${tbl(['Document','Nom que porta',''],(M.withAuthor||[]).map(x=>`<tr><td>${esc(x.f)}</td><td>${esc(x.a)}</td><td>${openBtn(x.u)}</td></tr>`))}`:''}
${n(M.gps)?`<h3>Fotos amb el lloc on es van fer</h3>${tbl(['Foto',''],(M.gps||[]).map(x=>`<tr><td>${esc(x.f)}</td><td>${openBtn(x.u)}</td></tr>`))}`:''}`}
${how([
'<b>Per als PDF que ja hi ha:</b> obre el document original al Word, ves a <b>Fitxer › Informació › Inspecciona el document</b>, marca «Propietats del document i informació personal» i clica <b>Suprimeix-ho tot</b>. Torna a desar-lo en PDF.',
'<b>Substitueix-lo a la web:</b> a <b>Mèdia › Biblioteca</b>, puja el PDF nou i canvia l\'enllaç a la pàgina. Després esborra el vell.',
'<b>A partir d\'ara:</b> fes això abans de pujar qualsevol document. Amb Google Docs no cal, perquè no hi posa el nom.',
'<b>Fotos amb el lloc:</b> al mòbil, entra a la configuració de la càmera i desactiva «Ubicació» o «Etiquetes de localització».'])}
</section>`;

h+=`<section class="sec band" id="s-ia"><div class="lead"><h2>Intel·ligència artificial</h2><span class="st ${st.ia}">${S[st.ia]}</span></div>
${why('Fer servir IA no està malament, però cal dir-ho. Les imatges fetes amb ChatGPT, Gemini o altres porten un segell digital invisible, i l\'eina el detecta. No intentem endevinar si un text està escrit amb IA, perquè els detectors s\'equivoquen sovint i podrien acusar algú injustament.')}
<table class="stack"><thead><tr><th>Què hem buscat</th><th>Resultat</th></tr></thead><tbody>
<tr><td>Imatges fetes amb IA</td>${R.partial?'<td class="note">No revisat</td>':chk(!n(I.c2pa),n(I.c2pa)?(I.c2pa||[]).map(x=>x.g).join(', '):'Cap')}</tr>
<tr><td>Textos copiats d'un xat d'IA sense repassar («Aquí tens…», «Espero que t'ajudi», [Insereix…])</td>${chk(!n(I.leftovers),n(I.leftovers)?n(I.leftovers)+' pàgines':'Cap')}</tr>
<tr><td>Enllaços a xats d'IA per a l'alumnat</td>${chk(!n(I.links),n(I.links)?n(I.links)+' enllaços':'Cap')}</tr>
<tr><td>Pàgina que expliqui com fa servir la IA el centre</td>${chk(!!n(I.decl),n(I.decl)?'Hi ha '+n(I.decl)+' pàgina que en parla. Comprova si és una explicació d\'ús.':'No n\'hi ha')}</tr>
<tr><td>Documents passats per webs externes (iLovePDF, Canva…)</td>${R.partial?'<td class="note">No revisat</td>':chk(!extN,extN?Object.entries(I.ext).map(([k,v])=>k+' ('+v+')').join(', '):'Cap')}</tr>
</tbody></table>
${n(I.c2pa)?`<h3>Imatges fetes amb IA</h3>${tbl(['Imatge','Eina','Pujada el',''],(I.c2pa||[]).map(x=>`<tr><td>${esc(x.f)}</td><td>${esc(x.g)}</td><td>${esc(x.d)}</td><td>${openBtn(x.u)}</td></tr>`))}`:''}
${n(I.leftovers)?`<h3>Textos per repassar</h3>${tbl(['Pàgina','Text',''],(I.leftovers||[]).map(x=>`<tr><td>${esc(x.t)}</td><td>${esc(x.v)}</td><td>${editBtn(x.e)}</td></tr>`))}`:''}
${how([
'<b>Imatges fetes amb IA:</b> edita la pàgina on surt la imatge, clica-la i escriu al peu de foto «Imatge generada amb IA».',
'<b>Pàgina d\'ús de la IA:</b> publica una pàgina breu que expliqui per a què fa servir la IA el centre, amb quines eines i com es protegeixen les dades. Es pot enllaçar al peu de la web.',
'<b>Webs externes com iLovePDF o Canva:</b> no hi pugis documents amb dades personals. Si cal, fes servir les eines del compte del Departament (Google Workspace o Microsoft 365 del centre).'])}
</section>`;

h+=`<section class="sec band" id="s-acc"><div class="lead"><h2>Accessibilitat</h2><span class="st ${st.acc}">${S[st.acc]}</span></div>
${why('Les persones cegues fan servir un programa que els llegeix la web en veu alta. Si una foto no té descripció, el programa diu només «imatge» i no saben què hi ha. Les webs públiques han de ser accessibles.')}
<div class="box"><b>${A.noAlt||0} de ${A.imgs||0} fotos no tenen descripció</b><div class="bar"><i style="width:${noAltP}%;background:var(--red)"></i></div></div>
${n(A.skips)?`<h3>Pàgines amb els títols desordenats</h3><p>Els títols han d'anar en ordre (Títol 2, després Títol 3…), com un índex. Si se salta un nivell, el lector de veu s'hi perd.</p>${tbl(['Pàgina',''],(A.skips||[]).map(x=>`<tr><td>${esc(x.t)}</td><td>${editBtn(x.e)}</td></tr>`))}`:''}
${n(A.generic)?`<h3>Enllaços que només diuen «aquí» o «clica»</h3><p>Llegits sols no diuen on porten.</p>${tbl(['Pàgina',''],(A.generic||[]).map(x=>`<tr><td>${esc(x.t)}</td><td>${editBtn(x.e)}</td></tr>`))}`:''}
${how([
'<b>Descripció de les fotos:</b> a <b>Mèdia › Biblioteca</b>, clica una foto i omple el camp <b>Text alternatiu</b> amb una frase curta del que es veu (per exemple «Alumnes de 1r de batxillerat a la sortida de Montserrat»). Comença per les fotos de la portada i les pàgines fixes.',
'<b>Títols desordenats:</b> edita la pàgina, clica el títol i, a la barra d\'eines, canvia\'n el nivell perquè vagin en ordre: Títol 2 per a les seccions i Títol 3 per a les subseccions.',
'<b>Enllaços «aquí»:</b> canvia el text de l\'enllaç perquè digui on porta, per exemple «Calendari de les proves d\'accés (PDF)» en lloc de «clica aquí».'])}
</section>`;

h+=`<section class="sec band" id="s-img"><div class="lead"><h2>Fotos massa pesades</h2><span class="st ${st.img}">${S[st.img]}</span></div>
${why('Les fotos fetes amb el mòbil pesen molt i fan que la web vagi lenta, sobretot des del mòbil. A més, les fotos d\'iPhone en format HEIC no es veuen als navegadors Chrome ni Edge: per a molta gent, aquestes fotos simplement no surten.')}
<p><b>${G.heavyN||0} fotos pesen més d'1 MB</b> i <b>${G.heic||0} són en format HEIC</b>.</p>
${n(G.heavy)?tbl(['Foto','Pes',''],(G.heavy||[]).map(x=>`<tr><td>${esc(x.f)}</td><td class="n">${esc(x.mb)} MB</td><td>${openBtn(x.u)}</td></tr>`)):''}
${how([
'<b>Converteix i redueix la foto:</b> obre-la a l\'ordinador i desa-la com a JPG. Amb l\'aplicació Fotos de Windows: <b>⋯ › Canvia la mida</b>, tria una amplada de 1600 píxels i desa una còpia. També pots fer servir la web gratuïta squoosh.app.',
'<b>Substitueix-la:</b> puja la foto nova a la pàgina i esborra la vella de <b>Mèdia › Biblioteca</b>.',
'<b>A partir d\'ara:</b> a l\'iPhone, ves a <b>Configuració › Càmera › Formats</b> i tria <b>Més compatible</b>. Així les fotos es fan directament en JPG.'])}
</section>`;

h+=`<section class="sec band" id="s-cad"><div class="lead"><h2>Documents antics o repetits</h2><span class="st ${st.cad}">${S[st.cad]}</span></div>
${why('Documents de cursos passats poden confondre les famílies (un calendari antic, una llista de llibres de l\'any passat). Els documents repetits fan que no se sàpiga quin és el bo.')}
${n(C.old)?`<h3>Documents de cursos passats</h3>${tbl(['Document',''],(C.old||[]).map(x=>`<tr><td>${esc(x.t)}</td><td>${openBtn(x.u)}</td></tr>`))}`:''}
${n(C.dups)?`<h3>Documents repetits</h3>${tbl(['Document','Còpies'],(C.dups||[]).map(x=>`<tr><td>${esc(x.t)}</td><td class="n">${x.n}</td></tr>`))}`:''}
${n(C.stale)?`<h3>Pàgines que fa més de 2 anys que no es toquen</h3>${tbl(['Pàgina','Darrer canvi',''],(C.stale||[]).map(x=>`<tr><td>${esc(x.t)}</td><td>${esc(x.m)}</td><td>${editBtn(x.e)}</td></tr>`))}`:''}
${how([
'<b>Documents antics:</b> a <b>Mèdia › Biblioteca</b>, cerca\'ls pel nom. Si encara estan enllaçats, substitueix l\'enllaç pel document d\'aquest curs; després esborra el vell.',
'<b>Repetits:</b> mira quin és el que surt enllaçat a la web i esborra la resta de còpies.',
'<b>Abans d\'esborrar</b>, comprova que el document no estigui enllaçat enlloc. Si en dubtes, deixa\'l.'])}
</section>`;

h+=`<section class="sec band" id="s-links"><div class="lead"><h2>Enllaços que no funcionen</h2><span class="st ${st.links}">${S[st.links]}</span></div>
${R.partial?'<p class="note">No s\'ha pogut revisar en aquesta revisió.</p>':`<p>Hem provat ${L.checked||0} enllaços que porten a altres pàgines de la mateixa web. ${n(L.bad)?n(L.bad)+' no funcionen.':'Tots funcionen.'}</p>
${n(L.bad)?tbl(['Enllaç trencat','A la pàgina'],(L.bad||[]).map(x=>`<tr><td style="word-break:break-all">${esc(x.u)}</td><td>${esc(x.t)}</td></tr>`))+how(['Edita la pàgina, clica l\'enllaç i canvia\'l per l\'adreça correcta, o treu-lo si la pàgina ja no existeix.']):''}`}
</section>
<section class="sec band"><h2>Com s'ha fet aquest informe</h2><p>L'eina llegeix la part pública de la web, la mateixa que veu qualsevol visitant, i aplica unes comprovacions automàtiques. No entra a l'administració de la web, no canvia res i no guarda cap dada.</p>
<p class="note">Què no revisa: el text de dins dels PDF, qui té permís per obrir els documents de Google Drive, ni qui surt a les fotos. Els enllaços a altres webs tampoc es comproven.</p></section>`;
$('report').innerHTML=h;
$('report').scrollIntoView({behavior:'smooth'});
}
