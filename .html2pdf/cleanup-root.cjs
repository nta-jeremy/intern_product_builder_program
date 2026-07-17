const fs = require('node:fs');
const path = require('node:path');
const root = 'node_modules';
if (!fs.existsSync(root)) { console.log('no node_modules'); process.exit(0); }
const removed = [];
for (const entry of fs.readdirSync(root)) {
  if (entry.toLowerCase().includes('puppeteer')) {
    fs.rmSync(path.join(root, entry), { recursive: true, force: true });
    removed.push(entry);
  }
}
console.log('removed:', removed.length ? removed.join(', ') : 'nothing to remove');
