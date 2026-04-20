import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import cors = require("cors");
import express = require("express");

admin.initializeApp();

const corsMiddleware = cors({ origin: true });

// ─── Middleware: verificar token SSO (@artool.cl) ────────────────────────────
async function verifyArtoolToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded.email?.endsWith("@artool.cl") || !decoded.email_verified) {
      res.status(403).json({ error: "Acceso restringido a @artool.cl" });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// ─── API: Generar PDF ────────────────────────────────────────────────────────
const pdfApp = express();
pdfApp.use(corsMiddleware as express.RequestHandler);

pdfApp.post("/generate", verifyArtoolToken, async (req, res) => {
  const { periodo = "Q1-2026", areas } = req.body as {
    periodo?: string;
    areas?: string[];
  };

  try {
    // Importaciones lazy para reducir cold start
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    const PDFDocument = (await import("pdfkit")).default;

    const browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    // URL del reporte en Firebase Hosting
    const reportUrl = `https://btg-quarter.artool.vip?periodo=${periodo}&preview=1`;
    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Medir todos los slides
    let rects = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".slide")).map((el) => {
        const r = el.getBoundingClientRect();
        const htmlEl = el as HTMLElement;
        return {
          x: r.left,
          y: htmlEl.offsetTop,
          w: r.width,
          h: htmlEl.scrollHeight,
          area: htmlEl.dataset.area ?? "",
        };
      })
    );

    // Filtrar por áreas si se especificaron
    if (areas && areas.length > 0) {
      rects = rects.filter((r) => areas.includes(r.area));
    }

    // Viewport total
    const totalH = rects.reduce((sum, s) => sum + s.h + 6, 0);
    await page.setViewport({
      width: 1440,
      height: Math.ceil(totalH) + 200,
      deviceScaleFactor: 2,
    });
    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Screenshot por slide
    const slides: Array<{ buffer: Buffer; w: number; h: number }> = [];
    for (const { x, y, w, h } of rects) {
      const buffer = await page.screenshot({
        clip: { x, y, width: w, height: h },
      });
      slides.push({ buffer: buffer as Buffer, w, h });
    }

    await browser.close();

    // Ensamblar PDF
    const doc = new PDFDocument({ autoFirstPage: false, compress: true });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    for (const slide of slides) {
      const ptW = slide.w * 0.75;
      const ptH = slide.h * 0.75;
      doc.addPage({ size: [ptW, ptH], margin: 0 });
      doc.image(slide.buffer, 0, 0, { width: ptW, height: ptH });
    }

    doc.end();
    await new Promise<void>((r) => doc.on("end", r));

    const pdfBuffer = Buffer.concat(chunks);
    const filename = `BTG-Informe-${periodo}-${Date.now()}.pdf`;

    // Guardar en Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(`reportes/${periodo}/pdfs/${filename}`);
    await file.save(pdfBuffer, { contentType: "application/pdf" });

    // URL firmada válida 1 hora
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 3600 * 1000,
    });

    res.json({ url: signedUrl, pages: slides.length, filename });
  } catch (err: any) {
    console.error("Error generando PDF:", err);
    res.status(500).json({ error: err.message });
  }
});

export const api = onRequest(
  {
    region: "us-central1",
    memory: "2GiB",
    timeoutSeconds: 540, // 9 minutos
    minInstances: 0,
  },
  pdfApp
);

// ─── Scheduled: Sync Windsor (paid + organic) ────────────────────────────────
export const syncWindsor = onSchedule(
  {
    schedule: "0 8 * * *", // diario 08:00
    timeZone: "America/Santiago",
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 300,
  },
  async () => {
    // TODO Fase 4: llamar Windsor API y actualizar Firestore
    // Métricas paid: Meta Ads, Google Ads (por área via taxonomía de campaña)
    // Métricas organic: Instagram, LinkedIn (totales de cuenta)
    console.log("Windsor sync placeholder — implementar en Fase 4");
  }
);

// ─── Scheduled: Sync GA4 ────────────────────────────────────────────────────
export const syncGA4 = onSchedule(
  {
    schedule: "30 8 * * *",
    timeZone: "America/Santiago",
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 300,
  },
  async () => {
    // TODO Fase 4: migrar lógica del servidor GA4 local a esta function
    console.log("GA4 sync placeholder — implementar en Fase 4");
  }
);
