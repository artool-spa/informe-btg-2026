# CONTEXT — Proyecto Reporte Trimestral BTG Pactual

> Leer completo antes de cualquier acción. Es la fuente de verdad del proyecto.

---

## ¿Qué es este proyecto?

BTG Pactual Chile produce trimestralmente un **informe de Marketing y Comunicaciones**. El objetivo es **automatizar completamente ese proceso** sobre Firebase, con datos que se actualizan solos desde las plataformas y un panel admin para lo que sigue siendo manual.

**Equipo:**
- **Artool** — agencia de datos/marketing que produce el informe
- **BTG Pactual Chile** — cliente

**Contacto técnico Artool:** aparodi@artool.cl (admin general del proyecto)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Hosting | Firebase Hosting |
| Base de datos serving | Firestore |
| Data warehouse | BigQuery (proyecto nuevo: `artool-data-warehouse`) |
| Funciones / backend | Firebase Functions gen2, Node 20, TypeScript |
| PDF server-side | Firebase Function + @sparticuz/chromium + pdfkit |
| Auth / SSO | Firebase Auth — Google SSO restringido a @artool.cl |
| Datos paid | Windsor API (cuenta puslocomercial@artool.cl) |
| Datos organic | Windsor API (cuenta jpundurraga@artool.cl) |
| Tráfico web | GA4 API (credenciales en btg---etf Firebase project) |
| Storage (imágenes, PDFs) | Firebase Storage |
| Repo | github.com/artool-spa/informe-btg-2026 (privado) |

---

## Proyecto Firebase

- **Nombre:** Reporte Trimestral BTG
- **Project ID:** `reporte-trimestral-btg`
- **Hosting URL (temporal):** https://reporte-trimestral-btg.web.app
- **Hosting URL (definitiva, pendiente DNS):** https://btg-quarter.artool.vip
- **Admin UI:** /admin (SSO Google, solo @artool.cl)
- **Firebase App ID:** 1:271211917953:web:9ffaffee84651253ec9380
- **API Key:** AIzaSyBL0ZVS_gbqC6tfw8CCnKcmn2gYkxTE5io
- **Storage bucket:** reporte-trimestral-btg.firebasestorage.app (región us-central1)

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
  views: metricas_q1_2026 (agregación por área, sin escritura)
        │
        ▼ Firebase Function diaria ~01:00
────────────────────────────────────────────────
Firestore — snapshot del trimestre activo
  1 sobreescritura/día (barato en Firestore, no en BQ)
        │
        ▼
────────────────────────────────────────────────
HTML Report — lee Firestore (rápido, sin costo BQ)
PDF Export  — Firebase Function lee Firestore → genera PDF → Storage URL firmada
```

**Regla de oro BigQuery:** solo append + delete. Jamás UPDATE/OVERWRITE. Las agregaciones se hacen con Views (no escriben).

---

## Cuentas Windsor

| Rol | Email | Acceso aparodi |
|---|---|---|
| Paid media | puslocomercial@artool.cl | Admin (no es creador) |
| Organic / RRSS | jpundurraga@artool.cl | Pendiente confirmar |

**API Keys Windsor:** pendientes — obtener desde app.windsor.ai → Settings → API en cada cuenta.
No usar MCP de Windsor para este proyecto — todo vía API directa.

---

## Fuentes de datos por tipo (tab Origenes del Excel)

| # | Fuente | Tipo | Automatización |
|---|---|---|---|
| 1 | Consolidado Acciones Comunicacionales (orgánico) | GSheets manual | Windsor API organic |
| 2 | BTG & MEL Data Dashboard (paid) | GSheets auto-diario | Windsor API paid |
| 3 | Tráfico web GA4 | Supermetrics → GSheets | GA4 API |
| 4 | Dashboard Looker Studio campañas | Extracción manual | Windsor API (agregado) |
| 5 | Documento MKTNG con aportantes | GSheets semi-manual | Admin manual (Firestore) |
| 6 | Extracción manual plataformas | Manual por área/trimestre | Windsor partial — alcance por área sigue manual |

---

## Estructura Firestore

```
reportes/{periodo}/              ← ej: "Q1-2026"
  metricas/{id}                  ← datos del reporte (Area, SubArea, ValorQ1, ValorQ4, Variacion, fuente, esAutomatico)
  origenes/{id}                  ← mapa de fuentes
  imagenes/{id}                  ← URLs Storage por área
  config/{doc}                   ← config del período (publicado, fechaCierre, etc.)
  historial/{timestamp}          ← log de cambios (append only, no se borra)

periodos/{doc}                   ← lista de períodos disponibles
```

**Reglas:** lectura pública del reporte, escritura solo @artool.cl con email verificado.

---

## Estructura BigQuery (artool-data-warehouse)

```
dataset: btg_pactual
  tabla: windsor_paid       ← append diario, raw Windsor paid
  tabla: windsor_organic    ← append diario, raw Windsor organic
  tabla: ga4_sessions       ← append diario, raw GA4
  view: metricas_q1_2026    ← agregación por área para Firestore snapshot
  view: metricas_q4_2025    ← período anterior (comparación)
```

---

## Firebase Functions desplegadas

| Function | Trigger | Descripción |
|---|---|---|
| `api` (POST /generate) | HTTP | Genera PDF server-side con Puppeteer + pdfkit. SSO guard @artool.cl. Acepta ?areas= para PDF parcial |
| `syncWindsor` | Cron 00:30 SCL | Windsor API paid + organic → append BQ → leer view → snapshot Firestore |
| `syncGA4` | Cron 01:00 SCL | GA4 API → append BQ → actualizar Firestore |

**URL Function API:** https://api-3wkbtstdia-uc.a.run.app

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

**Ancho slide:** 1440px (exportado a PDF: px × 0.75 = pt)
**PDF export:** screenshot por slide vía Puppeteer clip → PDFKit, una página por slide exacta

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
--c-green: #00bf63   /* Indicadores crecimiento */
--c-white: #fefefe
```

**Fuente:** `'Segoe UI', system-ui, sans-serif`

---

## Excel de datos actual (referencia histórica)

**Archivo local:** `/Users/ap/Desktop/BTG_Q4_2025_Q1_2026_Datos.xlsx`
**Pestañas:** Datos BTG, Datos BTG PAGADO, Origenes, Imagenes
**Columnas:** A=Area, B=SubArea, C=Nombre, D=ValorQ4, E=Fuente, F=OrgPag, G=ValorQ1, H=Variacion

> Este Excel es la fuente de datos de Q4 2025 (histórico) y del Q1 2026 mientras no esté el pipeline automático. Los valores Q4 2025 deben migrarse a Firestore una sola vez. Los Q1 2026 serán reemplazados por los conectores cuando estén listos.

**Nota importante:** `Datos BTG PAGADO` tiene valores Q4 como texto con coma (`"52,100"`). Parsear antes de escribir a Firestore/BQ.

---

## Estado del proyecto por fases

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Firebase fundación (Hosting, Functions, Firestore, Storage, Auth SSO) | ✅ Completa |
| 1 | Firestore schema + migración Q4 histórico + refactor HTML dinámico | 🔲 Pendiente |
| 2 | Admin UI — formularios por área para datos manuales | 🔲 Pendiente |
| 3 | PDF server-side (Function ya desplegada, falta conectar con Firestore) | 🔲 Pendiente |
| 4 | BigQuery + Windsor API (paid + organic) + GA4 → sync diario | 🔲 Pendiente — necesita API keys Windsor |
| 5 | Historial de cambios | 🔲 Pendiente |
| 6 | Validaciones automáticas | 🔲 Pendiente |

---

## Pendientes bloqueantes

1. **API key Windsor paid** — obtener desde puslocomercial@artool.cl → app.windsor.ai → Settings → API
2. **API key Windsor organic** — obtener desde jpundurraga@artool.cl → app.windsor.ai → Settings → API
3. **Dominio btg-quarter.artool.vip** — DNS lo maneja otra persona del equipo. Cuando esté: agregar en Firebase Hosting + Auth authorized domains
4. **Proyecto BigQuery** `artool-data-warehouse` — crear y vincular billing

---

## Archivos clave del repo

```
/
├── public/
│   ├── index.html          ← Reporte HTML (actualmente estático, Fase 1 lo hace dinámico)
│   └── admin/
│       └── index.html      ← Admin UI con Google SSO
├── functions/
│   ├── src/index.ts        ← Functions: api (PDF), syncWindsor, syncGA4
│   ├── package.json        ← Node 20, @sparticuz/chromium, pdfkit, express
│   └── tsconfig.json
├── firebase.json           ← Hosting + Functions + Firestore + Storage config
├── .firebaserc             ← Proyecto: reporte-trimestral-btg
├── firestore.rules         ← Lectura pública, escritura solo @artool.cl
├── storage.rules           ← Imágenes públicas, PDFs solo URL firmada
├── firestore.indexes.json  ← Índices por área/subarea y historial
├── export-pdf.mjs          ← Script local (legacy, reemplazado por Function)
└── CONTEXT.md              ← Este archivo
```

---

## GA4 MCP server (referencia)

Existe un servidor GA4 local en `/Users/ap/Documents/btg_etf/mcp_server/server.py` con credenciales del proyecto Firebase `btg---etf`. En Fase 4 se migra esta lógica a una Firebase Function.

---

*Última actualización: abril 2026 — Artool × BTG Pactual*
