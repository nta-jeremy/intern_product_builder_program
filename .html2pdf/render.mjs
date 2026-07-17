import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const INPUT_REL = process.argv[2];
const OUTPUT_REL = process.argv[3];
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!INPUT_REL || !OUTPUT_REL) {
  console.error('Usage: node render.mjs <input.html-relative-to-root> <output.pdf-relative-to-root>');
  process.exit(1);
}

const absInput = path.resolve(ROOT, INPUT_REL);
if (!fs.existsSync(absInput)) {
  console.error('Input HTML not found:', absInput);
  process.exit(1);
}

const PRINT_CSS = `
  @media print {
    @page { size: 1280px 720px; margin: 0; }
    html, body {
      background: #fdf6ee !important;
      overflow: visible !important;
      height: auto !important;
      width: auto !important;
    }
    .deck {
      height: auto !important;
      overflow: visible !important;
      scroll-snap-type: none !important;
    }
    .slide {
      height: 720px !important;
      width: 1280px !important;
      page-break-after: always !important;
      page-break-inside: avoid !important;
      break-after: page !important;
      break-inside: avoid !important;
      scroll-snap-align: none !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
    .slide:last-child { page-break-after: auto !important; break-after: auto !important; }
    .deck-progress, .deck-dots, .deck-counter, .deck-hints, .presenter-notes { display: none !important; }
  }
`;

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--force-device-scale-factor=2',
    '--hide-scrollbars',
    '--font-render-hinting=none',
  ],
  defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 2 },
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

  await page.goto('file://' + absInput, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.addStyleTag({ content: PRINT_CSS });

  try {
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    });
  } catch {}

  await new Promise((r) => setTimeout(r, 1500));

  const imgStatus = await page.evaluate(() => {
    return Array.from(document.images).map((i) => ({
      src: i.currentSrc || i.src,
      complete: i.complete,
      w: i.naturalWidth,
    }));
  });
  const broken = imgStatus.filter((i) => !i.complete || i.w === 0);
  if (broken.length) {
    console.error('Broken images:');
    broken.forEach((b) => console.error('  -', b.src));
  } else {
    console.log('All', imgStatus.length, 'images loaded OK');
  }

  const absOutput = path.resolve(ROOT, OUTPUT_REL);
  await page.pdf({
    path: absOutput,
    width: '1280px',
    height: '720px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  const stat = fs.statSync(absOutput);
  console.log('PDF written:', absOutput, '(' + (stat.size / 1024).toFixed(1) + ' KB)');
} finally {
  await browser.close();
}
