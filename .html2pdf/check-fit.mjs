import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_REL = process.argv[2] || 'knowledge/sharing/b1/agent-skills-slide.html';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const PRINT_CSS = `
  @media print {
    @page { size: 1280px 720px; margin: 0; }
    .deck { height: auto !important; overflow: visible !important; scroll-snap-type: none !important; }
    .slide { height: 720px !important; width: 1280px !important; overflow: hidden !important; }
    .deck-progress, .deck-dots, .deck-counter, .deck-hints, .presenter-notes { display: none !important; }
  }
`;

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
  defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(ROOT, INPUT_REL), { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: PRINT_CSS });
  await new Promise((r) => setTimeout(r, 1200));

  // For each slide, check if its inner content fits within 720px height
  const report = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('section.slide'));
    return slides.map((el, i) => {
      // Temporarily allow overflow to measure true content height
      const inner = el.querySelector('.slide__inner') || el;
      const innerH = inner.scrollHeight;
      const slideH = el.clientHeight;
      // Find elements that overflow the slide
      const overflows = [];
      const r = el.getBoundingClientRect();
      const slideBottom = r.bottom;
      const descendants = el.querySelectorAll('*');
      for (const d of descendants) {
        const db = d.getBoundingClientRect();
        if (db.bottom > slideBottom + 1 && db.height > 4) {
          overflows.push({
            cls: d.className || d.tagName,
            bottom: Math.round(db.bottom - slideBottom),
          });
        }
      }
      return {
        idx: i + 1,
        slideHeight: slideH,
        innerHeight: innerH,
        overflows: overflows.slice(0, 5),
        overflowCount: overflows.length,
      };
    });
  });

  const flagged = report.filter((r) => r.overflows.some((o) => o.bottom > 2) || r.innerHeight > r.slideHeight + 2);
  console.log('Total slides:', report.length);
  console.log('Slides with possible clipping:', flagged.length);
  for (const f of flagged) {
    console.log(`  - Slide ${f.idx}: inner=${f.innerHeight}px slide=${f.slideHeight}px overflowElems=${f.overflowCount}`);
    for (const o of f.overflows) console.log(`      • ${o.cls} (bottom ${o.bottom}px past)`);
  }
  if (!flagged.length) console.log('OK: no clipping detected at 1280x720');
} finally {
  await browser.close();
}
