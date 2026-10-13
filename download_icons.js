const fs = require('fs');
const path = require('path');
const https = require('https');

const icons = [
  'tree', 'person-burst', 'ban', 'route', 'trowel-bricks', 'network-wired',
  'user-secret', 'scale-unbalanced', 'arrows-to-circle', 'industry', 'ship',
  'water', 'plane', 'anchor', 'users-slash', 'plane-slash', 'link-slash',
  'gun', 'tower-broadcast', 'circle-xmark', 'boxes-stacked', 'droplet-slash',
  'sitemap', 'scroll', 'medal', 'jet-fighter', 'fire', 'triangle-exclamation',
  'weight-hanging', 'horse', 'landmark', 'radiation', 'bullseye', 'wrench',
  'certificate', 'mountain', 'bomb', 'shield-halved', 'train', 'award',
  'venus', 'satellite-dish', 'gas-pump', 'car-burst', 'skull', 'key',
  'lock', 'bolt', 'parachute-box', 'landmark-flag', 'binoculars',
  'handshake-slash', 'flag', 'handcuffs', 'user-slash'
];

const outDir = path.join(__dirname, 'assets', 'raw_svgs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadIcon(name) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, `${name}.svg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      return resolve();
    }
    const url = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/${name}.svg`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${name}: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Downloading ${icons.length} vector icons...`);
  for (const icon of icons) {
    try {
      await downloadIcon(icon);
      process.stdout.write(`.` );
    } catch (err) {
      console.error(`\nFailed for ${icon}:`, err.message);
    }
  }
  console.log('\nAll vector icons ready!');
}

run();
