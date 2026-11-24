function render(R){
const A=R.acc||{},D=R.dades||{},M=R.meta||{},I=R.ia||{},C=R.cad||{},G=R.img||{},L=R.links||{};
const n=x=>(x||[]).length;
const noAltP=pct(A.noAlt,A.imgs);
const dHard=n(D.dni)+n(D.iban)+n(D.tel)+n(D.emails)+n(D.naix);
const extN=n(I.extFiles);
const st={
dades:dHard?'r':(n(D.sens)||n(D.driveList)||n(D.photoList)||n(D.tables)||n(D.users))?'a':'g',
meta:R.partial?'n':(n(M.gps)||n(M.artist))?'r':n(M.withAuthor)?'a':'g',
ia:(n(I.c2pa)||n(I.leftovers)||n(I.links)||!n(I.decl)||extN)?'a':'g',
acc:(noAltP>10||n(A.pagesNoAlt)||n(A.skips)||n(A.generic))?'a':'g',
img:(G.heavyN||n(G.heic))?'a':'g',
cad:(n(C.old)||n(C.dups)||n(C.stale))?'a':'g',
links:R.partial?'n':n(L.bad)>5?'r':n(L.bad)?'a':'g'};
const S={r:'Urgent',a:'Cal mirar-ho',g:'Tot bé',n:'No revisat'};
const blocks=[
['dades','Dades personals',dHard?`${dHard} dades personals visibles`:`Cap dada visible · ${n(D.sens)} documents i ${n(D.driveList)} enllaços a Drive per revisar`],
['meta','Informació amagada als fitxers',R.partial?'No revisat':`${n(M.withAuthor)} PDF amb el nom de qui els va fer · ${n(M.gps)} fotos amb el lloc`],
['ia','Intel·ligència artificial',`${n(I.c2pa)} imatge${n(I.c2pa)==1?'':'s'} feta${n(I.c2pa)==1?'':'s'} amb IA · ${n(I.decl)?'hi ha pàgines que en parlen':'cap pàgina que n\'expliqui l\'ús'}`],
['acc','Accessibilitat',`${noAltP}% de fotos sense descripció · ${n(A.skips)} títols desordenats · ${n(A.generic)} enllaços «aquí»`],
['img','Fotos massa pesades',`${G.heavyN||0} fotos de més d'1 MB · ${n(G.heic)} en format d'iPhone`],
['cad','Documents antics o repetits',`${n(C.old)} de cursos passats · ${n(C.dups)} repetits · ${C.unused||0} sense enllaçar`],
['links','Enllaços que no funcionen',R.partial?'No revisat':`${n(L.bad)} de ${L.checked||0} no funcionen`]];
const order={r:0,a:1,g:2,n:3};
const worst=[...blocks].sort((x,y)=>order[st[x[0]]]-order[st[y[0]]]);
const nR=Object.values(st).filter(v=>v==='r').length,nA=Object.values(st).filter(v=>v==='a').length;
const title=dHard?'La web mostra dades personals':nR?`${nR} problema${nR>1?'es':''} urgent${nR>1?'s':''} i ${nA} apartats per revisar`:nA?`Res urgent; ${nA} apartats per revisar`:'La web està en bon estat';
const B=(href,txt)=>href?`<a class="btn" href="${url(href)}" target="_blank" rel="noopener">${txt}</a>`:'';
const page=r=>r?`<b>${esc(r.t)}</b>${r.k?` <span class="note">(${esc(r.k)}${r.feat?', imatge destacada':''})</span>`:''}<div class="acts">${B(r.l,'Veure')}${B(r.e,'Edita')}</div>`:'';
const file=m=>`<b class="fn">${esc(m.f)}</b>${m.t&&m.t!==m.f?`<div class="note">${esc(m.t)}</div>`:''}<div class="acts">${B(m.u,'Obre el fitxer')}${B(m.e,'Edita el fitxer')}</div>`;
const where=w=>w&&w.length?w.map(page).join('<hr class="sep">'):'<span class="note">No surt a cap pàgina ni notícia (pot ser un fitxer oblidat)</span>';
const list=(cols,rows,lim=10)=>{if(!rows.length)return'';const head=`<thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead>`;const first=`<table class="stack">${head}<tbody>${rows.slice(0,lim).join('')}</tbody></table>`;return rows.length>lim?first+`<details class="more"><summary>Mostra'n ${rows.length-lim} més</summary><table class="stack">${head}<tbody>${rows.slice(lim).join('')}</tbody></table></details>`:first;};
const how=s=>`<div class="how"><b>Com arreglar-ho</b><ol>${s.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const why=t=>`<p class="why">${t}</p>`;
const chk=(ok,txt)=>`<td class="${ok?'ok':'wa'}">${ok?'✓ ':'! '}${esc(txt)}</td>`;
const sub=(t,p)=>`<h3>${t}</h3>${p?`<p>${p}</p>`:''}`;
let h=`<nav class="scroll" aria-label="Seccions"><a href="#resum">Resum</a>${blocks.map(b=>`<a href="#s-${b[0]}">${esc(b[1])}</a>`).join('')}</nav>
<div class="band" id="resum"><h1>${esc(title)}</h1>
<div class="meta"><span>${esc(R.name)}</span><span>${esc(R.site)}</span><span>Revisat el ${esc(R.date)}</span><span>${R.counts?.pages||0} pàgines, ${R.counts?.posts||0} notícies i ${R.counts?.media||0} fitxers</span></div>
<div class="blocks" style="margin-top:20px;max-width:900px">${worst.map(b=>`<a class="blk" href="#s-${b[0]}"><span class="dot ${st[b[0]]}"></span><span><b>${esc(b[1])}</b><small>${esc(b[2])}</small></span><span class="st ${st[b[0]]}">${S[st[b[0]]]}</span></a>`).join('')}</div>
<p class="note" style="margin-top:14px">Cada apartat diu on és cada cosa: «Veure» obre la pàgina pública i «Edita» l'obre a l'escriptori de WordPress (cal haver entrat amb l'usuari d'administració). L'informe és automàtic: assenyala coses per revisar; la decisió és del centre.</p></div>`;

h+=`<section class="sec band" id="s-dades"><div class="lead"><h2>Dades personals</h2><span class="st ${st.dades}">${S[st.dades]}</span></div>
${why('La web és pública: qualsevol persona, i també Google, pot veure i guardar el que s\'hi publica. No s\'hi poden publicar dades personals d\'alumnes, famílies o personal si no és imprescindible i durant un temps limitat.')}
<table class="stack"><thead><tr><th>Què hem buscat al text de les pàgines i notícies</th><th>Resultat</th></tr></thead><tbody>
<tr><td>Números de DNI o NIE</td>${chk(!n(D.dni),n(D.dni)||'Cap')}</tr>
<tr><td>Telèfons mòbils</td>${chk(!n(D.tel),n(D.tel)||'Cap')}</tr>
<tr><td>Correus personals (no del centre ni de l'XTEC)</td>${chk(!n(D.emails),n(D.emails)||'Cap')}</tr>
<tr><td>Comptes bancaris</td>${chk(!n(D.iban),n(D.iban)||'Cap')}</tr>
<tr><td>Dates de naixement</td>${chk(!n(D.naix),n(D.naix)||'Cap')}</tr>
<tr><td>Documents amb nom de llista, barem o justificant</td>${chk(!n(D.sens),n(D.sens)||'Cap')}</tr>
<tr><td>Enllaços a Google Drive, Forms o OneDrive</td>${chk(!n(D.driveList),n(D.driveList)||'Cap')}</tr>
<tr><td>Notícies amb fotos</td>${chk(!n(D.photoList),n(D.photoList)||'Cap')}</tr>
<tr><td>Taules llargues (poden ser llistes de noms)</td>${chk(!n(D.tables),n(D.tables)||'Cap')}</tr>
<tr><td>Llista d'usuaris de WordPress visible</td>${chk(!n(D.users),n(D.users)?D.users.join(', '):'No')}</tr>
</tbody></table>
${dHard?sub('Dades trobades','La dada surt amb el text del voltant perquè la trobis ràpid dins la pàgina (Ctrl+F).')+list(['Dada','Text on surt','On és'],[...(D.dni||[]).map(x=>['DNI/NIE',x]),...(D.tel||[]).map(x=>['Telèfon',x]),...(D.emails||[]).map(x=>['Correu',x]),...(D.iban||[]).map(x=>['Compte bancari',x]),...(D.naix||[]).map(x=>['Data de naixement',x])].map(([k,x])=>`<tr><td><b>${esc(k)}</b><div>${esc(x.v||'')}</div></td><td><i>«…${esc(x.c||'')}…»</i></td><td>${page(x)}</td></tr>`)):''}
${n(D.sens)?sub('Documents per revisar','Pel nom, poden contenir dades d\'alumnes. Obre\'ls i mira què hi surt.')+list(['Document','Pujat el','Enllaçat a'],(D.sens||[]).map(x=>`<tr><td>${file(x)}</td><td style="white-space:nowrap">${esc(x.d)}</td><td>${where(x.w)}</td></tr>`)):''}
${n(D.driveList)?sub('Enllaços a documents de Google Drive o Forms','Des de fora no podem saber qui els pot obrir. Revisa\'ls un per un.')+list(['Document enllaçat','Text de l\'enllaç','A la pàgina'],(D.driveList||[]).map(x=>`<tr><td>${B(x.href,'Obre el document')}</td><td>${esc(x.txt)}</td><td>${page(x)}</td></tr>`)):''}
${n(D.tables)?sub('Taules llargues')+list(['Primera fila de la taula','Files','A la pàgina'],(D.tables||[]).map(x=>`<tr><td>${esc(x.h)}</td><td class="n">${x.n}</td><td>${page(x)}</td></tr>`)):''}
${n(D.photoList)?sub('Notícies amb fotos','Comprova que hi ha autorització de drets d\'imatge de l\'alumnat que hi surt.')+list(['Notícia','Fotos'],(D.photoList||[]).map(x=>`<tr><td>${page(x)}</td><td class="n">${x.n}</td></tr>`)):''}
${how([
'<b>Dades al text:</b> clica «Edita» a la pàgina indicada, cerca la dada (Ctrl+F) i esborra-la. Desa amb <b>Actualitza</b>.',
'<b>Documents de llistes i barems:</b> si el termini ja ha passat, treu l\'enllaç de la pàgina («Edita») i després esborra el fitxer («Edita el fitxer» › <b>Suprimeix permanentment</b>). Si s\'ha de publicar, que només hi surtin números de sol·licitud o inicials, mai nom i DNI junts.',
'<b>Enllaços a Google Drive:</b> obre cada document, clica <b>Comparteix</b> i mira «Accés general». Si diu «Qualsevol persona amb l\'enllaç» i el document té dades personals, canvia-ho a <b>Restringit</b>.',
'<b>Fotos d\'alumnes:</b> comprova les autoritzacions de drets d\'imatge d\'aquest curs. Si en falta alguna, treu la foto o tapa la cara.',
'<b>Dubtes:</b> consulta el delegat de protecció de dades del Departament.'])}</section>`;

const auth=Object.entries(M.authors||{}).sort((a,b)=>b[1]-a[1]);
h+=`<section class="sec band" id="s-meta"><div class="lead"><h2>Informació amagada als fitxers</h2><span class="st ${st.meta}">${S[st.meta]}</span></div>
${why('Els PDF i les fotos porten informació que no es veu però que qualsevol pot llegir si es descarrega el fitxer: el nom de qui el va fer, el programa i, a les fotos de mòbil, el lloc exacte on es van fer.')}
${R.partial?'<p class="note">No s\'han pogut obrir els fitxers en aquesta revisió.</p>':`
<p>Hem obert <b>${M.pdfs||0} PDF</b> i <b>${M.imgs||0} fotos</b>. <b>${n(M.withAuthor)} PDF</b> porten un nom de persona i <b>${n(M.gps)} fotos</b> porten el lloc on es van fer.</p>
${auth.length?sub('Noms que apareixen')+`<p>${auth.map(a=>`<b>${esc(a[0])}</b> (${a[1]} PDF)`).join(' · ')}</p>`:''}
${n(M.withAuthor)?sub('PDF amb nom de persona')+list(['Document','Nom amagat','Enllaçat a'],(M.withAuthor||[]).map(x=>`<tr><td>${file(x)}</td><td>${esc(x.a)}</td><td>${where(x.w)}</td></tr>`)):''}
${n(M.gps)?sub('Fotos amb el lloc on es van fer')+list(['Foto','Coordenades','On surt'],(M.gps||[]).map(x=>`<tr><td>${file(x)}</td><td>${esc(x.gps)}</td><td>${where(x.w)}</td></tr>`)):''}
${n(M.artist)?sub('Fotos amb nom d\'autor')+list(['Foto','Nom','On surt'],(M.artist||[]).map(x=>`<tr><td>${file(x)}</td><td>${esc(x.artist)}</td><td>${where(x.w)}</td></tr>`)):''}`}
${how([
'<b>PDF amb nom:</b> obre l\'original al Word, ves a <b>Fitxer › Informació › Inspecciona el document</b>, marca «Propietats del document i informació personal» i clica <b>Suprimeix-ho tot</b>. Desa\'l de nou en PDF.',
'<b>Substitueix-lo:</b> a la pàgina indicada a «Enllaçat a», clica «Edita», canvia l\'enllaç pel PDF nou i, després, esborra el vell («Edita el fitxer» › Suprimeix permanentment).',
'<b>Fotos amb el lloc:</b> treu-les i torna-les a pujar sense la ubicació. Al mòbil, desactiva la «Ubicació» a la configuració de la càmera.'])}</section>`;

h+=`<section class="sec band" id="s-ia"><div class="lead"><h2>Intel·ligència artificial</h2><span class="st ${st.ia}">${S[st.ia]}</span></div>
${why('Fer servir IA no està malament, però cal dir-ho. Les imatges fetes amb ChatGPT, Gemini i similars porten un segell digital invisible que l\'eina detecta. No intentem endevinar si un text està fet amb IA: els detectors s\'equivoquen sovint.')}
<table class="stack"><thead><tr><th>Què hem buscat</th><th>Resultat</th></tr></thead><tbody>
<tr><td>Imatges fetes amb IA</td>${R.partial?'<td class="note">No revisat</td>':chk(!n(I.c2pa),n(I.c2pa)||'Cap')}</tr>
<tr><td>Textos copiats d'un xat d'IA sense repassar («Aquí tens…», «Espero que t'ajudi», [Insereix…])</td>${chk(!n(I.leftovers),n(I.leftovers)||'Cap')}</tr>
<tr><td>Enllaços a xats d'IA</td>${chk(!n(I.links),n(I.links)||'Cap')}</tr>
<tr><td>Pàgines que parlen d'intel·ligència artificial</td>${chk(!!n(I.decl),n(I.decl)||'Cap')}</tr>
<tr><td>Fitxers fets amb webs externes (iLovePDF, Canva…)</td>${R.partial?'<td class="note">No revisat</td>':chk(!extN,extN||'Cap')}</tr>
</tbody></table>
${n(I.c2pa)?sub('Imatges fetes amb IA')+list(['Imatge','Eina','On surt'],(I.c2pa||[]).map(x=>`<tr><td>${file(x)}</td><td>${esc(x.g)}</td><td>${where(x.w)}</td></tr>`)):''}
${n(I.leftovers)?sub('Textos per repassar')+list(['Text trobat','On és'],(I.leftovers||[]).map(x=>`<tr><td><i>«…${esc(x.c)}…»</i></td><td>${page(x)}</td></tr>`)):''}
${n(I.links)?sub('Enllaços a xats d\'IA')+list(['Enllaç','On és'],(I.links||[]).map(x=>`<tr><td>${B(x.href,'Obre')} ${esc(x.txt)}</td><td>${page(x)}</td></tr>`)):''}
${n(I.decl)?sub('Pàgines que parlen d\'IA','Comprova si alguna explica com fa servir la IA el centre.')+list(['Pàgina'],(I.decl||[]).map(x=>`<tr><td>${page(x)}</td></tr>`)):''}
${extN?sub('Fitxers fets amb webs externes')+list(['Fitxer','Eina','On surt'],(I.extFiles||[]).map(x=>`<tr><td>${file(x)}</td><td>${esc(x.n)}</td><td>${where(x.w)}</td></tr>`)):''}
${how([
'<b>Imatges fetes amb IA:</b> clica «Edita» a la pàgina on surt, selecciona la imatge i escriu al peu de foto «Imatge generada amb IA». Si és la imatge destacada d\'una notícia, posa-ho al text de la notícia.',
'<b>Explicar l\'ús de la IA:</b> publica una pàgina breu que digui per a què fa servir la IA el centre, amb quines eines i com es protegeixen les dades.',
'<b>Webs externes com iLovePDF o Canva:</b> no hi pugis documents amb dades personals. Fes servir les eines del compte del centre (Google Workspace o Microsoft 365).'])}</section>`;

h+=`<section class="sec band" id="s-acc"><div class="lead"><h2>Accessibilitat</h2><span class="st ${st.acc}">${S[st.acc]}</span></div>
${why('Les persones cegues fan servir un programa que els llegeix la web en veu alta. Si una foto no té descripció, el programa diu només «imatge». Els títols desordenats i els enllaços que diuen només «aquí» també les desorienten.')}
<div class="box"><b>${A.noAlt||0} de ${A.imgs||0} fotos de la biblioteca no tenen descripció</b><div class="bar"><i style="width:${noAltP}%;background:var(--amb)"></i></div><span class="note">${n(A.pagesNoAlt)} pàgines i notícies tenen fotos sense descripció.</span></div>
${n(A.pagesNoAlt)?sub('Pàgines amb fotos sense descripció')+list(['Pàgina','Fotos sense descripció'],[...(A.pagesNoAlt||[])].sort((a,b)=>b.n-a.n).map(x=>`<tr><td>${page(x)}</td><td><b>${x.n}</b><div class="note fn">${x.files.map(esc).join(', ')}${x.n>x.files.length?'…':''}</div></td></tr>`)):''}
${n(A.skips)?sub('Títols desordenats','El títol indicat salta un nivell respecte de l\'anterior.')+list(['Pàgina','Títol','Salt'],(A.skips||[]).map(x=>`<tr><td>${page(x)}</td><td>«${esc(x.h)}»</td><td style="white-space:nowrap">${esc(x.s)}</td></tr>`)):''}
${n(A.generic)?sub('Enllaços que només diuen «aquí», «clica»…')+list(['Text de l\'enllaç','Porta a','A la pàgina'],(A.generic||[]).map(x=>{let f=x.href||'';try{f=decodeURIComponent(f.split('/').filter(Boolean).pop()||f);}catch(e){}return `<tr><td>«${esc(x.txt)}»</td><td class="fn">${B(x.href,'Obre')} ${esc(f)}</td><td>${page(x)}</td></tr>`;})):''}
${n(A.libNoAlt)?`<details class="more"><summary>Totes les fotos de la biblioteca sense descripció (${n(A.libNoAlt)})</summary>${list(['Foto','On surt'],(A.libNoAlt||[]).map(x=>`<tr><td>${file(x)}</td><td>${where(x.w)}</td></tr>`),400)}</details>`:''}
${how([
'<b>Fotos sense descripció:</b> clica «Edita» a la pàgina, clica la foto i, a la columna de la dreta, omple <b>Text alternatiu</b> amb una frase curta del que es veu (per exemple «Alumnes de 1r de batxillerat a la sortida de Montserrat»). També es pot fer des de «Edita el fitxer» a la llista de la biblioteca.',
'<b>Títols desordenats:</b> clica «Edita», clica el títol indicat i canvia\'n el nivell a la barra d\'eines perquè vagin en ordre (Títol 2, després Títol 3…).',
'<b>Enllaços «aquí»:</b> canvia el text de l\'enllaç perquè digui on porta, per exemple «Calendari de les proves d\'accés (PDF)».'])}</section>`;

h+=`<section class="sec band" id="s-img"><div class="lead"><h2>Fotos massa pesades</h2><span class="st ${st.img}">${S[st.img]}</span></div>
${why('Les fotos de mòbil pesen molt i fan que la web vagi lenta. Les fotos d\'iPhone en format HEIC no es veuen a Chrome ni Edge: per a molta gent, no surten.')}
${n(G.heic)?sub(`Fotos en format d'iPhone (HEIC): ${n(G.heic)}`)+list(['Foto','On surt'],(G.heic||[]).map(x=>`<tr><td>${file(x)}</td><td>${where(x.w)}</td></tr>`)):''}
${G.heavyN?sub(`Fotos de més d'1 MB: ${G.heavyN}`)+list(['Foto','Pes','On surt'],(G.heavy||[]).map(x=>`<tr><td>${file(x)}</td><td class="n">${esc(x.mb)} MB</td><td>${where(x.w)}</td></tr>`)):''}
${how([
'<b>Converteix i redueix la foto:</b> descarrega-la («Obre el fitxer»), obre-la amb l\'app Fotos de Windows › <b>⋯ › Canvia la mida</b>, posa 1600 píxels d\'amplada i desa-la en JPG. També es pot fer a squoosh.app.',
'<b>Substitueix-la:</b> a la pàgina indicada a «On surt», clica «Edita», canvia la foto per la nova i després esborra la vella.',
'<b>A l\'iPhone:</b> Configuració › Càmera › Formats › <b>Més compatible</b>, i les fotos es faran en JPG.'])}</section>`;

h+=`<section class="sec band" id="s-cad"><div class="lead"><h2>Documents antics o repetits</h2><span class="st ${st.cad}">${S[st.cad]}</span></div>
${why('Els documents de cursos passats poden confondre les famílies, i els repetits fan que no se sàpiga quin és el bo.')}
${n(C.old)?sub('Documents de cursos passats')+list(['Document','Pujat el','Enllaçat a'],(C.old||[]).map(x=>`<tr><td>${file(x)}</td><td style="white-space:nowrap">${esc(x.d)}</td><td>${where(x.w)}</td></tr>`)):''}
${n(C.dups)?sub('Documents repetits','A cada grup, «Enllaçat a» indica quina còpia es fa servir; les que no surten enlloc es poden esborrar.')+(C.dups||[]).map(g=>`<h4 style="margin:16px 0 4px">${esc(g.t)} (${g.files.length} còpies)</h4>`+list(['Còpia','Pujada el','Enllaçat a'],g.files.map(x=>`<tr><td>${file(x)}</td><td style="white-space:nowrap">${esc(x.d)}</td><td>${where(x.w)}</td></tr>`))).join(''):''}
${n(C.stale)?sub('Pàgines sense canvis fa més de 2 anys')+list(['Pàgina','Darrer canvi'],(C.stale||[]).map(x=>`<tr><td>${page(x)}</td><td>${esc(x.m)}</td></tr>`)):''}
${C.unused?`<p class="note">A més, hi ha <b>${C.unused}</b> documents a la biblioteca que no surten enllaçats a cap pàgina ni notícia.</p>`:''}
${how([
'<b>Documents antics:</b> si encara estan enllaçats, clica «Edita» a la pàgina i canvia l\'enllaç pel document d\'aquest curs. Després esborra el vell («Edita el fitxer» › Suprimeix permanentment).',
'<b>Repetits:</b> deixa la còpia que surt enllaçada i esborra les que diuen «No surt a cap pàgina».',
'<b>Abans d\'esborrar,</b> comprova la columna «Enllaçat a». Si en dubtes, deixa\'l.'])}</section>`;

h+=`<section class="sec band" id="s-links"><div class="lead"><h2>Enllaços que no funcionen</h2><span class="st ${st.links}">${S[st.links]}</span></div>
${R.partial?'<p class="note">No s\'ha pogut revisar.</p>':`<p>Hem provat <b>${L.checked||0}</b> enllaços que porten a altres pàgines o documents de la mateixa web. ${n(L.bad)?`<b>${n(L.bad)}</b> no funcionen.`:'Tots funcionen.'}</p>
${list(['Enllaç trencat','Text de l\'enllaç','A la pàgina'],(L.bad||[]).map(x=>`<tr><td class="fn" style="word-break:break-all">${esc(x.u)}<div class="note">Error ${esc(x.s)}</div></td><td>${esc(x.txt||'')}</td><td>${page(x)}</td></tr>`))}
${n(L.bad)?how(['Clica «Edita» a la pàgina, clica l\'enllaç i posa-hi l\'adreça correcta, o treu-lo si la pàgina o el document ja no existeixen.']):''}`}</section>
<section class="sec band"><h2>Com s'ha fet aquest informe</h2><p>L'eina llegeix la part pública de la web, la mateixa que veu qualsevol visitant, i hi aplica comprovacions automàtiques. No entra a l'administració, no canvia res i no guarda cap dada.</p>
<p class="note">No revisa el text de dins dels PDF, qui pot obrir els documents de Google Drive, qui surt a les fotos ni els enllaços a altres webs. «On surt» busca el fitxer dins del contingut de pàgines i notícies; si es fa servir en un menú o en un giny lateral, pot sortir com a «No surt a cap pàgina».</p></section>`;
$('report').innerHTML=h;
$('report').scrollIntoView({behavior:'smooth'});
}
