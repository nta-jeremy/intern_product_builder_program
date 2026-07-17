import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PDF_REL = process.argv[2];
const OUT_DIR_REL = process.argv[3];
const PAGES = process.argv.slice(4).map((n) => parseInt(n, 10));
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const absPdf = path.resolve(ROOT, PDF_REL);
const outDir = path.resolve(ROOT, OUT_DIR_REL);
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=2'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.goto('file://' + absPdf, { waitUntil: 'networkidle0', timeout: 60000 });
  const total = await page.evaluate(() => window.PDFViewerApplication ? window.PDFViewerApplication.pdfViewer.numPages : 0).catch(() => 0);
  console.log('PDF viewer total pages (0 = native render):', total);

  // Fallback: render the whole pdf to per-page screenshots via pdfjs is complex.
  // Instead use macOS sips / quartz for fast page extraction.
} finally {
  await browser.close();
}
console.log('Use sips/pdfgears for page extraction instead.');
