# Auditor web de centre

Eina gratuïta que revisa la web Nodes (WordPress) d'un centre educatiu: protecció de dades, metadades dels fitxers, ús d'IA, accessibilitat, imatges, contingut caducat i enllaços. Tot es processa al navegador de qui la fa servir; no es guarda cap dada.

Projecte del grup de treball d'IA (XTCD Osona i Lluçanès), curs 2026-27.

## Peces

| Fitxer | Què és |
|---|---|
| `index.html` | L'eina. Es publica a GitHub Pages. |
| `core.js` | El motor d'anàlisi (ja està inclòs dins d'`index.html`; aquí per poder-lo editar i revisar). |
| `worker/worker.js` | Intermediari de Cloudflare per poder llegir els PDF i les imatges (metadades, GPS, signatures d'IA). |
| `worker/wrangler.toml` | Configuració del Worker. |

## Per què cal l'intermediari

L'Àgora deixa llegir l'API del WordPress des de qualsevol web, però bloqueja la lectura dels fitxers (PDF, imatges) des d'una altra web (CORS). Sense intermediari, l'eina funciona en **mode bàsic**: tot menys metadades, imatges generades amb IA, serveis externs i enllaços trencats.

L'intermediari no és un proxy obert: només descarrega fitxers de `/wp-content/uploads/`, de les altres adreces només en comprova l'estat (HEAD), només respon a l'adreça de l'eina i, de les imatges, només baixa els primers 256 KB.

## Posada en marxa

### 1. GitHub Pages
1. Crea un repositori públic, per exemple `auditor-web`, i puja-hi aquests fitxers.
2. *Settings › Pages › Build and deployment*: *Deploy from a branch*, branca `main`, carpeta `/ (root)`.
3. L'eina quedarà a `https://ELTEUUSUARI.github.io/auditor-web/`. Ja funciona en mode bàsic.

### 2. Cloudflare Worker
Opció A, des del navegador:
1. Crea un compte gratuït a dash.cloudflare.com.
2. *Workers & Pages › Create › Create Worker*, nom `auditor-web-proxy`, *Deploy*.
3. *Edit code*: substitueix-ho tot pel contingut de `worker/worker.js` i *Deploy*.
4. *Settings › Variables and Secrets › Add*: `ALLOWED_ORIGIN` = `https://ELTEUUSUARI.github.io` (sense barra final ni carpeta). *Deploy*.
5. Apunta l'adreça del Worker: `https://auditor-web-proxy.ELTEUSUBDOMINI.workers.dev`.

Opció B, amb terminal (o amb Claude Code):
```
cd worker
# edita ALLOWED_ORIGIN a wrangler.toml
npx wrangler login
npx wrangler deploy
```

### 3. Connectar-los
A `index.html`, busca la línia
```js
const PROXY='https://auditor-web-proxy.ELTEUUSUARI.workers.dev';
```
i posa-hi l'adreça del teu Worker. Desa i puja el canvi. L'avís de «mode bàsic» desapareixerà.

## Límits
- No llegeix el text de dins dels PDF (només les metadades).
- No veu els permisos dels fitxers de Google Drive enllaçats.
- No reconeix persones a les fotos.
- No intenta endevinar si un text està fet amb IA: només senyals objectius (signatura C2PA, restes de text de xat, noms de fitxer).
- El pla gratuït de Cloudflare permet 100.000 peticions al dia; una revisió completa en fa unes 300-500.

## Idees per a properes versions
- Llegir el text dels PDF (pdf.js) per buscar dades personals a dins i la declaració d'ús d'IA a la NOFC.
- Exportar l'informe a PDF.
- Revisió periòdica de totes les webs de la subxarxa amb GitHub Actions (informes privats).
