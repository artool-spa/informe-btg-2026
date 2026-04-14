# Informe BTG Pactual — Automatización de Reporte Trimestral

Sistema de generación automática del Informe de Marketing y Comunicaciones de BTG Pactual Chile.

---

## Descripción

Este repositorio contiene el sistema para producir el informe trimestral de Marketing y Comunicaciones de BTG Pactual, reemplazando el proceso manual en Canva por un flujo automatizado:

```
Spreadsheet de datos  →  Claude  →  index.html  →  Distribución
```

El informe HTML resultante es visualmente idéntico al diseño original de Canva, puede abrirse en cualquier navegador y compartirse directamente sin necesidad de software adicional.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | El reporte HTML completo (archivo principal) |
| `btg-assets/` | Imágenes del reporte (logo, fotos destacadas) |
| `CONTEXT.md` | Briefing técnico completo para Claude |
| `README.md` | Este archivo |

---

## Recursos del proyecto

| Recurso | URL |
|---|---|
| Diseño original Canva (Q4 2025) | https://artoolp1.my.canva.site/informe-btg-2025-reporte-4q-marketing-y-comunicaciones |
| Spreadsheet de datos del equipo | https://docs.google.com/spreadsheets/d/1eWOVcOrtfvA3gfS6-DULg52bkdHr17Zj/edit |
| Imágenes Q1 2026 (Google Drive) | https://drive.google.com/drive/folders/1JzEyjnClzEjiCoUPfRo2xLCZm9kQFCZ2 |
| Spreadsheet de mapeo técnico | https://docs.google.com/spreadsheets/d/1MWCgHgcAYcol3Q7hNzz4bYmwtRfrBAP6W4XWpLF-P_s/edit |

---

## Flujo trimestral

1. El equipo completa la columna **"Valor Q1 2026"** en el spreadsheet de datos
2. El equipo sube las imágenes destacadas a la carpeta de Google Drive
3. Claude lee el spreadsheet, actualiza el HTML y descarga las imágenes
4. Se hace commit al repositorio
5. Se descarga o publica el `index.html`

---

## Estructura del informe (12 slides)

1. Resumen Ejecutivo
2. Desglose Eventos & Medios
3. Impacto Digital
4. Inversiones Digitales — Eventos & Medios
5. Inversiones Digitales — Difusión RRSS
6. Investment Banking — Eventos & Medios
7. Wealth Management
8. Asset Management
9. Corporativo
10. Corporate Lending
11. Sales & Trading
12. Research

---

## Brand

| Variable | Color |
|---|---|
| Navy (principal) | `#002f73` |
| Blue (etiquetas) | `#195ab4` |
| Green (crecimiento) | `#00bf63` |

---

*Desarrollado por Artool — uso interno BTG Pactual Chile*
