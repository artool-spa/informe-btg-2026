# CONTEXT — Proyecto Reporte Trimestral BTG Pactual

> **Leer completo antes de cualquier acción.** Fuente de verdad del proyecto. Actualizar al cerrar cada sesión.

---

## ¿Qué es este proyecto?

BTG Pactual Chile produce trimestralmente un **informe de Marketing y Comunicaciones**. El objetivo es automatizar completamente ese proceso sobre Firebase, con datos que se actualizan solos desde las plataformas y un panel admin para lo que sigue siendo manual.

- **Cliente:** BTG Pactual Chile
- **Agencia:** Artool (aparodi@artool.cl — admin técnico del proyecto)
- **Repo:** https://github.com/artool-spa/informe-btg-2026 (privado)
- **Branch principal:** main

---

## Firebase — IDs y credenciales

| Campo | Valor |
|---|---|
| Project ID | `reporte-trimestral-btg` |
| Project Number | `271211917953` |
| App ID | `1:271211917953:web:9ffaffee84651253ec9380` |
| API Key | `AIzaSyBL0ZVS_gbqC6tfw8CCnKcmn2gYkxTE5io` |
| Auth Domain | `reporte-trimestral-btg.firebaseapp.com` |
| Storage Bucket | `reporte-trimestral-btg.firebasestorage.app` |
| Messaging Sender ID | `271211917953` |
| Hosting URL (activo) | https://reporte-trimestral-btg.web.app |
| Hosting URL (futuro) | https://btg-quarter.artool.vip ← pendiente DNS |
| Admin UI | https://reporte-trimestral-btg.web.app/admin |
| Firebase Console | https://console.firebase.google.com/project/reporte-trimestral-btg |
| Function API URL | https://api-3wkbtstdia-uc.a.run.app |

**Auth:** Google SSO, restringido a `@artool.cl`. Solo email verificado puede escribir en Firestore/Storage.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Hosting | Firebase Hosting |
| Base de datos serving | Firestore |
| Data warehouse | BigQuery — proyecto `artool-data-warehouse` (pendiente crear) |
| Funciones / backend | Firebase Functions gen2, Node 20, TypeScript |
| PDF export local | Puppeteer (Chrome local) + PDFKit — `export-pdf.mjs` ✅ funciona |
| PDF export server | Firebase Function + @sparticuz/chromium + PDFKit (desplegado, falta conectar) |
| Auth / SSO | Firebase Auth — Google SSO `@artool.cl` |
| Datos paid | Windsor API — cuenta `puslocomercial@artool.cl` |
| Datos organic | Windsor API — cuenta `jpundurraga@artool.cl` |
| Tráfico web | GA4 API — credenciales en proyecto Firebase `btg---etf` |
| Storage | Firebase Storage — región `us-central1` |

---

## ✅ Generación PDF local — técnica que FUNCIONA

**Script:** `/Users/ap/Documents/btg-report/export-pdf.mjs`
**Ejecutar:** `node export-pdf.mjs` desde el directorio del proyecto
**Output:** `BTG-Informe-Q1-2026.pdf` (~2.4 MB, 9 páginas, calidad profesional)

### Técnica exacta (NO cambiar, está probada y funciona bien)

```
1. Puppeteer lanza Chrome local headless (deviceScaleFactor: 2 = retina)
2. Primer pass: viewport 1440×900, carga index.html, mide cada .slide con getBoundingClientRect()
   → obtiene: { x, y (offsetTop), w (width), h (scrollHeight) } por slide
3. Segundo pass: viewport height = suma de todos los slides + 200px (evita clipping)
   → recarga la página para que todos los elementos estén en el DOM sin scroll virtual
4. Por cada slide: page.screenshot({ clip: { x, y, width: w, height: h } }) → PNG en /tmp
5. PDFKit ensambla: una página por slide, tamaño exacto de cada slide en puntos
   → Conversión: px × 0.75 = pt (96dpi → 72pt)
   → doc.addPage({ size: [ptW, ptH], margin: 0 }) — sin márgenes
   → doc.image(pngPath, 0, 0, { width: ptW, height: ptH })
6. Cleanup: borra /tmp, escribe PDF final
```

### Parámetros críticos (no tocar)
- `deviceScaleFactor: 2` — retina, necesario para calidad
- `waitUntil: 'networkidle0'` + `setTimeout(1200ms)` — espera fuentes y animaciones
- `scrollHeight` para alto (no clientHeight) — captura contenido que desborda
- `compress: true` en PDFKit — reduce tamaño sin perder calidad
- `margin: 0` en cada página — sin bordes blancos

### Errores previos a evitar
- ❌ `display:none` por slide → causa artefactos y páginas en blanco
- ❌ `clientHeight` en vez de `scrollHeight` → corta slides altos
- ❌ `height: 900` fijo en viewport → recorta slides más largos que la ventana
- ❌ Solo un `page.goto` → los slides que no caben en el viewport quedan mal medidos

### Para adaptar a server-side (Firebase Function)
Mismo algoritmo, reemplazar:
- `executablePath: '/Applications/Google Chrome.app/...'` → `await chromium.executablePath()` (@sparticuz/chromium)
- `file://` path → URL de Firebase Hosting (`https://reporte-trimestral-btg.web.app?periodo=Q1-2026`)
- `fs.writeFileSync` → Buffer en memoria → subir a Firebase Storage → URL firmada (TTL 1h)

---

## Arquitectura de datos (flujo completo)

```
FUENTES (diario ~00:30 via Cloud Scheduler)
────────────────────────────────────────────────
Windsor API (paid)    — puslocomercial@artool.cl
Windsor API (organic) — jpundurraga@artool.cl
GA4 API               — credenciales Firebase btg---etf
Admin manual          — Firestore directo vía /admin
        │
        ▼ APPEND ONLY — NUNCA UPDATE EN BQ (muy caro)
────────────────────────────────────────────────
BigQuery — proyecto artool-data-warehouse
  tablas raw: windsor_paid, windsor_organic, ga4_sessions
  views: metricas_q1_2026 (agregación por área — sin escritura = gratis)
        │
        ▼ Firebase Function diaria ~01:00
────────────────────────────────────────────────
Firestore — snapshot del trimestre activo
  1 sobreescritura/día por trimestre (barato en Firestore, caro en BQ)
        │
        ▼
────────────────────────────────────────────────
HTML Report — lee Firestore (fast, sin costo BQ)
PDF Export  — Function → screenshot HTML → PDFKit → Storage URL firmada
```

**Regla de oro BQ:** solo append + delete. Jamás UPDATE/OVERWRITE en BQ. Agregaciones via Views (no escriben nada).

---

## Cuentas Windsor

| Rol | Email | Acceso aparodi |
|---|---|---|
| Paid media | puslocomercial@artool.cl | Admin (no es creador) |
| Organic / RRSS | jpundurraga@artool.cl | Pendiente confirmar |

**API Keys Windsor:** pendientes de obtener.
- Ir a: `app.windsor.ai → Settings → API` en cada cuenta
- NO usar MCP Windsor para este proyecto — todo vía API REST directa

---

## Fuentes de datos (tab Origenes del Excel)

| # | Fuente | Tipo | Automatización futura |
|---|---|---|---|
| 1 | Consolidado Acciones Comunicacionales (orgánico) | GSheets manual | Windsor API organic |
| 2 | BTG & MEL Data Dashboard (paid) | GSheets auto-diario | Windsor API paid |
| 3 | Tráfico web GA4 | Supermetrics → GSheets | GA4 API |
| 4 | Dashboard Looker Studio campañas | Extracción manual | Windsor API agregado |
| 5 | Documento MKTNG con aportantes | GSheets semi-manual | Admin manual (Firestore) |
| 6 | Extracción manual plataformas | Manual por área/trimestre | Windsor partial — alcance por área sigue manual |

---

## Estructura Firestore (poblada)

```
reportes/Q1-2026                 ← { periodo, titulo, publicado: false, totalMetricas: 518 }
  metricas/{auto-id}             ← 518 documentos migrados desde Excel
    {
      area: string,              ← Col A del Excel
      subarea: string,           ← Col B
      nombre: string,            ← Col C
      valorQ4: number,           ← Col D (histórico, no cambia)
      valorQ1: number|null,      ← Col G (se actualiza con conectores)
      variacion: number|null,    ← Col H (recalculada automáticamente)
      fuente: string,            ← Col E
      orgPag: string,            ← Col F ("organico" o "pagado")
      sheet: string,             ← "Datos BTG" o "Datos BTG PAGADO"
      orden: number,             ← fila original Excel (para orden de display)
      esAutomatico: false,       ← true cuando viene de Windsor/GA4
      ultimaActualizacion: Timestamp
    }
  origenes/{id}                  ← mapa de fuentes (pendiente popular)
  imagenes/{id}                  ← URLs Storage por área (pendiente)
  config/{doc}                   ← config del período
  historial/{timestamp}          ← log de cambios (append only)

periodos/{doc}                   ← lista de períodos disponibles
```

**Nota migración:** `Datos BTG PAGADO` tenía valores Q4 como texto `"52,100"` → parseados a número `52100`.
**Script de migración:** `/Users/ap/Documents/btg-report/scripts/migrate-excel.mjs`
**Ejecutar:** `node scripts/migrate-excel.mjs` (requiere Application Default Credentials activas)

---

## Firebase Functions desplegadas

| Function | Trigger | Estado | Descripción |
|---|---|---|---|
| `api` POST `/generate` | HTTP | ✅ Desplegada | PDF server-side. SSO guard @artool.cl. Acepta `areas[]` para PDF parcial |
| `syncWindsor` | Cron 00:30 SCL | ✅ Desplegada | Placeholder — implementar Fase 4 |
| `syncGA4` | Cron 01:00 SCL | ✅ Desplegada | Placeholder — implementar Fase 4 |

**Fuente:** `/Users/ap/Documents/btg-report/functions/src/index.ts`

---

## Reporte HTML — estructura de slides

| Slide | data-area | Título |
|---|---|---|
| 1 | resumen-general | Resumen General |
| 2 | eventos-medios | Desglose Eventos & Medios |
| 3 | impacto-digital | Impacto Digital |
| 4 | inversiones-digitales | Inversiones Digitales |
| 5 | asset-management | Asset Management |
| 6 | sales-trading | Sales & Trading |
| 7 | wealth-management | Wealth Management |
| 8 | corporate-lending | Corporate Lending |
| 9 | investment-banking | Investment Banking |

**Ancho slide:** 1440px | **Viewport PDF:** 1440 × (suma alturas) | **Scale:** 2x retina
**Valores dinámicos mapeados:** ~127 elementos identificados, pendiente agregar `data-metric` attributes

---

## Brand guidelines BTG

```css
--c-navy:  #002f73   /* Fondo principal headers */
--c-blue1: #0b2859
--c-blue2: #14448c
--c-blue3: #195ab4
--c-blue4: #305de0
--c-blue5: #549cff
--c-sky:   #d2e5ff   /* Fondos secundarios */
--c-green: #00bf63   /* Indicadores de crecimiento */
--c-white: #fefefe
```
**Fuente:** `'Segoe UI', system-ui, sans-serif`
**Logo:** `btg-assets/img1.png` (blanco, sobre fondo navy)

---

## Excel de datos (referencia histórica Q4 2025)

**Archivo local:** `/Users/ap/Desktop/BTG_Q4_2025_Q1_2026_Datos.xlsx`
**Pestañas:** Datos BTG (287 filas), Datos BTG PAGADO (231 filas), Origenes, Imagenes
**Columnas:** A=Area, B=SubArea, C=Nombre, D=ValorQ4, E=Fuente, F=OrgPag, G=ValorQ1, H=Variacion

> Los valores Q4 2025 ya están en Firestore (migración completada). Los Q1 2026 se reemplazarán con los conectores Windsor/GA4 en Fase 4.

---

## Estado del proyecto por fases

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Firebase fundación — Hosting, Functions, Firestore, Storage, Auth SSO | ✅ Completa |
| 1a | Migración Excel → Firestore (518 docs, Q4+Q1 histórico) | ✅ Completa |
| 1b | Refactor HTML dinámico — agregar `data-metric` + Firebase SDK | 🔄 En curso |
| 2 | Admin UI — formularios por área para datos manuales | 🔲 Pendiente |
| 3 | PDF Function conectada a Firestore (Function ya desplegada) | 🔲 Pendiente |
| 4 | BigQuery + Windsor API + GA4 → sync diario automático | 🔲 Bloqueado (necesita API keys Windsor) |
| 5 | Historial de cambios | 🔲 Pendiente |
| 6 | Validaciones automáticas | 🔲 Pendiente |

---

## Pendientes bloqueantes

1. **API key Windsor paid** → `puslocomercial@artool.cl` → `app.windsor.ai` → Settings → API
2. **API key Windsor organic** → `jpundurraga@artool.cl` → `app.windsor.ai` → Settings → API
3. **Dominio `btg-quarter.artool.vip`** → DNS lo maneja otra persona. Al tener el DNS: `firebase hosting:channel:deploy` + agregar en Auth authorized domains
4. **Proyecto BigQuery `artool-data-warehouse`** → crear, vincular billing, crear dataset `btg_pactual`

---

## Archivos clave del repo

```
/
├── public/
│   ├── index.html              ← Reporte HTML (9 slides, 1440px, actualmente estático)
│   └── admin/
│       └── index.html          ← Admin UI — Google SSO, selector áreas, botón PDF
├── functions/
│   ├── src/index.ts            ← Functions: api (PDF), syncWindsor, syncGA4
│   ├── package.json            ← Node 20, @sparticuz/chromium, pdfkit, express, cors
│   └── tsconfig.json
├── scripts/
│   └── migrate-excel.mjs       ← Lee Excel → escribe Firestore (ya ejecutado)
├── export-pdf.mjs              ← PDF local con Puppeteer+Chrome+PDFKit ✅ FUNCIONA
├── firebase.json               ← Hosting + Functions + Firestore + Storage
├── .firebaserc                 ← Proyecto activo: reporte-trimestral-btg
├── firestore.rules             ← Lectura pública, escritura solo @artool.cl
├── storage.rules               ← Imágenes públicas, PDFs solo URL firmada
├── firestore.indexes.json      ← Índices: metricas por area/orden, historial por timestamp
└── CONTEXT.md                  ← Este archivo
```

---

## GA4 MCP server (referencia para Fase 4)

Servidor local: `/Users/ap/Documents/btg_etf/mcp_server/server.py`
Credenciales: proyecto Firebase `btg---etf`
En Fase 4 esta lógica se migra a Firebase Function `syncGA4`.

---

## Comandos útiles

```bash
# Desplegar todo
cd /Users/ap/Documents/btg-report && firebase deploy

# Solo hosting
firebase deploy --only hosting

# Solo functions
firebase deploy --only functions --force

# Solo reglas Firestore
firebase deploy --only firestore:rules

# Generar PDF local (✅ funciona, ~2.4MB, 9 páginas)
cd /Users/ap/Documents/btg-report && node export-pdf.mjs

# Migrar Excel a Firestore (ya ejecutado para Q1-2026)
node scripts/migrate-excel.mjs

# Ver logs de functions
firebase functions:log --only api
```

---

*Última actualización: abril 2026 — Artool × BTG Pactual*
