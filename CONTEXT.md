# CONTEXT — Proyecto Informe BTG Pactual (para Claude)

> Este archivo es el briefing completo del proyecto. Léelo antes de hacer cualquier cosa.

---

## ¿Qué es este proyecto?

BTG Pactual Chile produce trimestralmente un **informe de Marketing y Comunicaciones** que históricamente se hacía en Canva y se enviaba manualmente. El objetivo es **automatizar ese proceso**:

1. El equipo llena un spreadsheet con los datos del período
2. Claude lee el spreadsheet y genera el `index.html` del informe
3. El HTML es visualmente **idéntico** al informe original de Canva
4. Se exporta/comparte directamente — sin tocar Canva nunca más

**Ahorro real**: el informe actualmente tarda horas en producirse manualmente en Canva. Con este sistema, una vez que los datos están en el spreadsheet, la generación es inmediata.

---

## Referencia de diseño (FUENTE DE VERDAD)

El informe original de Canva Q4 2025 es la referencia visual exacta que debe replicar el HTML:

**Canva Q4 2025:**
`https://artoolp1.my.canva.site/informe-btg-2025-reporte-4q-marketing-y-comunicaciones`

> El HTML debe ser **pixel-perfect** respecto a este diseño. Si hay diferencias visuales, prevalece el diseño de Canva.

---

## Estado actual del HTML

El archivo `index.html` en este repositorio es una versión **avanzada pero incompleta** del reporte Q4 2025. Está bien encaminado pero aún presenta diferencias respecto al Canva original que deben corregirse antes de generar el Q1 2026.

**Lo que sí está:**
- Estructura de 12 slides completa
- Colores y tipografía BTG correctos
- Logo BTG visible (fondo navy, tamaño 72px)
- Datos Q4 2025 en todas las secciones

**Lo que falta / debe revisarse:**
- Ajuste pixel-perfect vs. Canva (tipografías, espaciados, jerarquía visual)
- Verificar que cada sección coincida exactamente con su equivalente en Canva
- Mejorar el sistema de reemplazo de datos para facilitar la actualización trimestral

---

## Repositorio GitHub

```
https://github.com/artool-spa/informe-btg-2026
```

**Estructura:**
```
/
├── index.html          ← El reporte HTML (archivo principal)
├── btg-assets/         ← Imágenes del reporte Q4 2025
│   ├── img1.png        ← Logo BTG Pactual
│   ├── 58f671e0...jpg  ← BTG Talks (Niemann)
│   ├── 5a22b2c6...jpg  ← BTG Talks (otro)
│   ├── f60bb3ae...png  ← Nota prensa (Oyarzo)
│   ├── 8bb3dbf0...png  ← BTG Call
│   ├── 7f062815...png  ← Programas económicos
│   ├── b6bafb85...png  ← Rollán BTG
│   ├── 62e0f554...png  ← Resultados / SQM
│   ├── 9d958e6e...png  ← BTG Podcast
│   ├── d202e731...png  ← Money Talks
│   └── 8caa5610...png  ← Head IB
├── README.md           ← Documentación formal
└── CONTEXT.md          ← Este archivo
```

> El repo es **privado**. Para publicar el informe, la persona encargada debe activar GitHub Pages manualmente (requiere plan GitHub Team para orgs privadas) o descargar el HTML y compartirlo directamente.

---

## Datos: Spreadsheet del equipo (FUENTE DE DATOS Q1 2026)

El equipo llenó los datos del período en este spreadsheet:

**URL:**
`https://docs.google.com/spreadsheets/d/1eWOVcOrtfvA3gfS6-DULg52bkdHr17Zj/edit`

**Nombre del archivo:** `BTG_Q4_2025_Q1_2026_Datos.xlsx`

**Pestañas:**
| Pestaña | Contenido |
|---|---|
| `Datos BTG` | Dataset principal — métricas orgánicas por área |
| `Datos BTG PAGADO` | Métricas de campañas pagas |
| `Origenes` | Fuentes de cada dato (Google Analytics, plataformas RRSS, etc.) |
| `Imagenes` | Mapeo de imágenes destacadas por sección |

**Estructura de columnas (Datos BTG):**
| Col | Nombre | Descripción |
|---|---|---|
| A | Área | Sección del informe (ej: Resumen General, Investment Banking) |
| B | Sub-área | Subsección (ej: Seguidores RRSS, Campañas y Alcance) |
| C | Nombre / Descripción del dato | Campo específico |
| D | Valor Q4 2025 | Dato del trimestre anterior (referencia) |
| E | Fuente / Origen del dato | De dónde se extrae (ej: Google Analytics) |
| F | Orgánico/Pagado | Clasificación del dato |
| G | Valor Q1 2026 | **Dato nuevo a usar en el informe** |
| H | Delta / Variación | Cambio porcentual Q4→Q1 |
| I | Imagen | Nombre o referencia de imagen asociada |

**Total de filas:** ~289 filas de datos

---

## Imágenes Q1 2026

Las imágenes destacadas para el reporte Q1 2026 están en Google Drive:

**Carpeta:**
`https://drive.google.com/drive/folders/1JzEyjnClzEjiCoUPfRo2xLCZm9kQFCZ2`

Al generar el nuevo reporte, estas imágenes deben descargarse y colocarse en `btg-assets/` reemplazando las del Q4 2025.

---

## Spreadsheet de mapeo (referencia técnica)

Existe además un spreadsheet de documentación técnica creado para mapear cada campo del HTML con su dato correspondiente:

**URL:**
`https://docs.google.com/spreadsheets/d/1MWCgHgcAYcol3Q7hNzz4bYmwtRfrBAP6W4XWpLF-P_s/edit`

**Nombre:** `BTG Pactual — Datos Reporte Q4 2025`

Este archivo tiene ~346 filas con columnas: `SECCIÓN, MÓDULO, CAMPO, VALOR Q4-2025, TIPO DE DATO, NOTAS / INSTRUCCIONES`. Sirve como guía de qué campo del HTML corresponde a qué dato del spreadsheet del equipo.

---

## Estructura del informe (12 slides)

| Slide | Título | Contenido principal |
|---|---|---|
| 1 | Resumen Ejecutivo | Seguidores RRSS, personas alcanzadas, campañas, tráfico web, texto intro |
| 2 | Desglose Eventos & Medios | Eventos por mes, eventos destacados, apariciones en prensa por área |
| 3 | Impacto Digital | Campañas digitales, impresiones, tráfico web pagado y orgánico |
| 4 | Inversiones Digitales: Eventos & Medios | Eventos y cobertura de prensa del área |
| 5 | Inversiones Digitales: Difusión RRSS | Contenidos y campañas del área en RRSS |
| 6 | Investment Banking: Eventos & Medios | Eventos y cobertura de prensa del área |
| 7 | Wealth Management | KPIs, eventos, contenidos y prensa del área |
| 8 | Asset Management | KPIs, eventos, contenidos y prensa del área |
| 9 | Corporativo | KPIs, eventos, contenidos y prensa del área |
| 10 | Corporate Lending | KPIs, eventos, contenidos y prensa del área |
| 11 | Sales & Trading | KPIs, eventos, contenidos y prensa del área |
| 12 | Research | KPIs, eventos, contenidos y prensa del área |

---

## Brand guidelines BTG

```css
--c-navy:  #002f73   /* Azul oscuro — fondo principal de headers */
--c-blue1: #0b2859   /* Azul muy oscuro */
--c-blue2: #14448c   /* Azul medio oscuro */
--c-blue3: #195ab4   /* Azul medio — etiquetas, botones */
--c-blue4: #305de0   /* Azul medio claro */
--c-blue5: #549cff   /* Azul claro */
--c-sky:   #d2e5ff   /* Azul muy claro — fondos secundarios */
--c-green: #00bf63   /* Verde — indicadores de crecimiento */
--c-white: #fefefe
```

**Fuente:** `'Segoe UI', system-ui, sans-serif`
**Ancho de slide:** `720px`
**Logo BTG:** `btg-assets/img1.png` (blanco, sobre fondo navy)

---

## Flujo de trabajo para generar un nuevo reporte

```
1. El equipo llena el spreadsheet de datos (columna "Valor Q1 2026")
2. El equipo sube las imágenes destacadas a la carpeta de Drive
3. Claude lee el spreadsheet y la carpeta de imágenes
4. Claude actualiza index.html reemplazando todos los datos
5. Claude descarga las imágenes a btg-assets/
6. Claude hace commit y push al repo
7. La persona encargada descarga el HTML o activa GitHub Pages
```

---

## Próximos pasos (qué hacer en la siguiente sesión)

### Paso 1 — Hacer el HTML pixel-perfect vs. Canva
Comparar slide a slide el `index.html` actual contra el Canva original. Ajustar tipografía, espaciados, colores, jerarquía visual y layout hasta que sean idénticos.

### Paso 2 — Generar el reporte Q1 2026
Con el HTML corregido como base, leer el spreadsheet del equipo (`BTG_Q4_2025_Q1_2026_Datos.xlsx`) y reemplazar todos los valores Q4 2025 por los valores Q1 2026. Descargar las imágenes desde la carpeta de Drive y actualizar `btg-assets/`.

### Paso 3 — Mejorar el spreadsheet del equipo
El spreadsheet actual funciona pero puede mejorarse para que sea más claro, robusto y fácil de llenar cada trimestre. Proponer mejoras (validaciones, instrucciones inline, estructura más clara).

### Paso 4 — Documentar el proceso de actualización trimestral
Dejar instrucciones claras para que el equipo pueda ejecutar el proceso en el futuro sin depender de contexto previo.

---

## Historial de trabajo previo

- Se creó el `index.html` del reporte Q4 2025 basándose en el Canva original
- Se corrigió el logo BTG (blanco sobre fondo navy, tamaño 72px)
- Se creó el spreadsheet de mapeo técnico (346 filas documentando cada campo)
- Se migró el repositorio de `parodiscl/informe-btg-q4-2025` a `artool-spa/informe-btg-2026`
- El repo es privado — GitHub Pages requiere plan Team para activarse en orgs privadas

---

*Última actualización: abril 2026 — Artool*
