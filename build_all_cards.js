const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const fontPath = path.join(__dirname, 'assets', 'fonts', 'AnimeAce-v05.ttf');
const fontBase64 = fs.readFileSync(fontPath).toString('base64');
const rawSvgDir = path.join(__dirname, 'assets', 'raw_svgs');
const outDir = path.join(__dirname, 'assets', 'cards');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function getSvgData(name) {
  const filePath = path.join(rawSvgDir, `${name}.svg`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing SVG file: ${name}.svg`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const vbMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 512 512';
  
  // Extract paths
  const paths = (content.match(/<path[^>]+>/g) || []).join('\n');
  return { viewBox, paths };
}

const CARDS_DATA = [
  {
    id: 'card-01-rubber-deficit',
    title: 'НЕТ РЕЗИНЫ',
    icon: 'tree',
    badge: 'droplet-slash',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-02-training-in-war',
    title: 'ЗАБЫЛ СНЯТЬ С ТРЕНИРОВКИ НУЖНЫЕ ДИВКИ',
    icon: 'person-burst',
    badge: 'arrows-spin',
    theme: '#e67e22',
    iconColor: '#ffa502',
    badgeColor: '#ff7f50'
  },
  {
    id: 'card-03-no-order',
    title: 'НАСТУПАТЬ БЕЗ ПРИКАЗА',
    icon: 'route',
    badge: 'ban',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-04-forgot-building',
    title: 'ЗАБЫЛ СТРОЙКУ',
    icon: 'trowel-bricks',
    badge: 'circle-xmark',
    theme: '#f39c12',
    iconColor: '#f1c40f',
    badgeColor: '#e67e22'
  },
  {
    id: 'card-05-bad-templates',
    title: 'НЕ МЕТА ШАБЛОНЫ ДИВОК',
    icon: 'network-wired',
    badge: 'circle-xmark',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-05b-bad-templates-tanks',
    title: 'НЕ МЕТА ШАБЛОНЫ ТАНКОВ',
    icon: 'tank',
    badge: 'circle-xmark',
    theme: '#d35400',
    iconColor: '#fa8231',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-05c-bad-templates-air',
    title: 'НЕ МЕТА ШАБЛОНЫ АВИАЦИИ',
    icon: 'jet-fighter',
    badge: 'circle-xmark',
    theme: '#0984e3',
    iconColor: '#4bcffa',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-05d-bad-templates-navy',
    title: 'НЕ МЕТА ШАБЛОНЫ ФЛОТА',
    icon: 'ship',
    badge: 'circle-xmark',
    theme: '#2980b9',
    iconColor: '#70a1ff',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-06-forgot-agency',
    title: 'ЗАБЫЛ АГЕНТСТВО',
    icon: 'user-secret',
    badge: 'circle-xmark',
    theme: '#9b59b6',
    iconColor: '#a55eea',
    badgeColor: '#8854d0'
  },
  {
    id: 'card-07-zero-stability',
    title: 'НЕ СЛЕДИТЬ ПРО СТАБИЛЬНОСТЬ И ПОДДЕРЖКУ ВОЙНЫ',
    icon: 'scale-unbalanced',
    badge: 'skull',
    theme: '#c0392b',
    iconColor: '#ff4d4d',
    badgeColor: '#ff3838'
  },
  {
    id: 'card-10-fleet-sunk-one-battle',
    title: 'МИНУС ВЕСЬ ФЛОТ В ОДНОМ СРАЖЕНИИ',
    icon: 'ship',
    badge: 'water',
    theme: '#2980b9',
    iconColor: '#45aaf2',
    badgeColor: '#2d98da'
  },
  {
    id: 'card-11-naval-bombers-no-fleet',
    title: 'МОРБОБРЫ БЕЗ ФЛОТА',
    icon: 'plane',
    badge: 'anchor',
    theme: '#00b4d8',
    iconColor: '#00d2d3',
    badgeColor: '#2bcbba'
  },
  {
    id: 'card-12-no-manpower',
    title: '0 МЕНПАВЕРА',
    icon: 'users-slash',
    badge: 'circle-xmark',
    theme: '#c0392b',
    iconColor: '#eb3b5a',
    badgeColor: '#fc5c65'
  },
  {
    id: 'card-13-lost-air',
    title: 'КРАСНЫЙ ВОЗДУХ',
    icon: 'plane-slash',
    badge: 'fire',
    theme: '#e74c3c',
    iconColor: '#ff5252',
    badgeColor: '#ff793f'
  },
  {
    id: 'card-15-guns-deficit',
    title: 'ДЕФИЦИТ СКЛАДОВ НА НАЧАЛЕ ВОЙНЫ',
    icon: 'gun',
    badge: 'circle-xmark',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#eb3b5a'
  },
  {
    id: 'card-18-tanks-no-supply',
    title: 'ГОРЕНИЕ ДИВОК ОТ СНАБЖЕНИЯ',
    icon: 'boxes-stacked',
    badge: 'droplet-slash',
    theme: '#e67e22',
    iconColor: '#fa8231',
    badgeColor: '#f39c12'
  },
  {
    id: 'card-19-no-focus',
    title: 'ЗАБЫЛ ПОСТАВИТЬ НОВЫЙ ФОКУС',
    icon: 'sitemap',
    badge: 'circle-xmark',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#ff4757'
  },
  {
    id: 'card-26-cb-expired',
    title: 'СГОРЕЛА ЦЕЛЬ ВОЙНЫ',
    icon: 'bullseye',
    badge: 'fire',
    theme: '#e67e22',
    iconColor: '#fa8231',
    badgeColor: '#ff793f'
  },
  {
    id: 'card-56-no-sub-repair',
    title: 'РЕМОНТ ПОДЛОДОК',
    icon: 'anchor',
    badge: 'wrench',
    theme: '#0984e3',
    iconColor: '#74b9ff',
    badgeColor: '#00cec9'
  },
  {
    id: 'card-27-no-dockyards-repair',
    title: '0 ВЕРФЕЙ НА РЕМОНТ',
    icon: 'wrench',
    badge: 'ship',
    theme: '#2980b9',
    iconColor: '#45aaf2',
    badgeColor: '#2d98da'
  },
  {
    id: 'card-28-zero-doctrines',
    title: 'НЕ ВКАЧЕННЫЕ ДОКТРИНЫ НА НУЖНОМ ЭТАПЕ ВОЙНЫ',
    icon: 'certificate',
    badge: 'circle-xmark',
    theme: '#7f8c8d',
    iconColor: '#a5b1c2',
    badgeColor: '#778ca3'
  },
  {
    id: 'card-32-no-trains',
    title: '0 ПОЕЗДОВ',
    icon: 'train',
    badge: 'circle-xmark',
    theme: '#d35400',
    iconColor: '#fa8231',
    badgeColor: '#eb3b5a'
  },
  {
    id: 'card-33-no-convoys-trade',
    title: '0 КОНВОЕВ',
    icon: 'ship',
    badge: 'circle-xmark',
    theme: '#2980b9',
    iconColor: '#45aaf2',
    badgeColor: '#eb3b5a'
  },
  {
    id: 'card-34-generals-no-traits',
    title: 'АРМИЯ БЕЗ ГЕНЕРАЛА',
    icon: 'award',
    badge: 'circle-xmark',
    theme: '#8e44ad',
    iconColor: '#a55eea',
    badgeColor: '#eb3b5a'
  },
  {
    id: 'card-36-early-mobilization',
    title: 'ЗАБЫЛ ПОМЕНЯТЬ ЗАКОН ОБ ЭКОНОМИКЕ',
    icon: 'industry',
    badge: 'circle-xmark',
    theme: '#f39c12',
    iconColor: '#f1c40f',
    badgeColor: '#e67e22'
  },
  {
    id: 'card-38-no-radar',
    title: 'БЕЗ РАДАРОВ',
    icon: 'satellite-dish',
    badge: 'circle-xmark',
    theme: '#00b4d8',
    iconColor: '#00d2d3',
    badgeColor: '#778ca3'
  },
  {
    id: 'card-39-no-fuel-empty',
    title: '0 ТОПЛИВА',
    icon: 'gas-pump',
    badge: 'circle-xmark',
    theme: '#c0392b',
    iconColor: '#eb3b5a',
    badgeColor: '#fc5c65'
  },
  {
    id: 'card-40-tanks-in-mountains',
    title: 'ТАНКИ В ГОРАХ',
    icon: 'mountain',
    badge: 'car-burst',
    theme: '#7f8c8d',
    iconColor: '#d1d8e0',
    badgeColor: '#e74c3c'
  },
  {
    id: 'card-42-no-decryption',
    title: 'БЕЗ ДЕШИФРОВКИ',
    icon: 'key',
    badge: 'lock',
    theme: '#8e44ad',
    iconColor: '#a55eea',
    badgeColor: '#778ca3'
  },
  {
    id: 'card-47-no-recon',
    title: 'БЕЗ РАЗВЕДКИ',
    icon: 'binoculars',
    badge: 'circle-xmark',
    theme: '#7f8c8d',
    iconColor: '#a5b1c2',
    badgeColor: '#778ca3'
  },
  {
    id: 'card-48-english-channel-convoy',
    title: 'КОНВОИ В ЛА-МАНШЕ',
    icon: 'water',
    badge: 'ship',
    theme: '#e74c3c',
    iconColor: '#45aaf2',
    badgeColor: '#eb3b5a'
  },
  {
    id: 'card-55-no-microcontrol',
    title: 'ОТСУТСТВИЕ МИКРОКОНТРОЛЯ',
    icon: 'arrow-pointer',
    badge: 'ban',
    theme: '#e74c3c',
    iconColor: '#ff6b6b',
    badgeColor: '#ff4757'
  }
];

async function generateCard(card) {
  const mainSvg = getSvgData(card.icon);
  const badgeSvg = card.badge ? getSvgData(card.badge) : null;

  const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${card.theme}" stop-opacity="0.38"/>
      <stop offset="55%" stop-color="#181b22" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#101216" stop-opacity="1"/>
    </radialGradient>
    <filter id="artShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="28" fill="url(#bgGlow)"/>

  <!-- Military Outer Frame -->
  <rect x="12" y="12" width="488" height="488" rx="20" fill="none" stroke="${card.theme}" stroke-width="2.5" opacity="0.45"/>
  <rect x="20" y="20" width="472" height="472" rx="14" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.08"/>

  <!-- Tactical Reticle Elements (Centered at 256, 256) -->
  <circle cx="256" cy="256" r="190" fill="${card.theme}" opacity="0.08"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="${card.theme}" stroke-width="2" stroke-dasharray="10,8" opacity="0.32"/>
  <circle cx="256" cy="256" r="100" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="5,7" opacity="0.14"/>

  <!-- Corner Tactical Crosses -->
  <path d="M 32 44 L 46 44 M 46 30 L 46 44" stroke="${card.theme}" stroke-width="2.5" opacity="0.6"/>
  <path d="M 480 44 L 466 44 M 466 30 L 466 44" stroke="${card.theme}" stroke-width="2.5" opacity="0.6"/>
  <path d="M 32 468 L 46 468 M 46 482 L 46 468" stroke="${card.theme}" stroke-width="2.5" opacity="0.6"/>
  <path d="M 480 468 L 466 468 M 466 482 L 466 468" stroke="${card.theme}" stroke-width="2.5" opacity="0.6"/>

  <!-- Main Art / Hero Vector Icon (Centered 280x280) -->
  <g transform="translate(116, 116)" filter="url(#artShadow)">
    <svg width="280" height="280" viewBox="${mainSvg.viewBox}">
      <g fill="${card.iconColor}">
        ${mainSvg.paths}
      </g>
    </svg>
  </g>

  <!-- Secondary Tactical Badge (Bottom Right of Icon Area) -->
  ${badgeSvg ? `
  <g transform="translate(320, 320)" filter="url(#artShadow)">
    <circle cx="44" cy="44" r="42" fill="#121418" stroke="${card.badgeColor}" stroke-width="3.5"/>
    <svg x="16" y="16" width="56" height="56" viewBox="${badgeSvg.viewBox}">
      <g fill="${card.badgeColor}">
        ${badgeSvg.paths}
      </g>
    </svg>
  </g>
  ` : ''}
</svg>
  `;

  const outPath = path.join(outDir, `${card.id}.webp`);
  await sharp(Buffer.from(svg))
    .webp({ quality: 94 })
    .toFile(outPath);
}

async function run() {
  console.log(`Generating ${CARDS_DATA.length} authentic HOI4 mistake cards in WebP (pure icons)...`);
  const t0 = Date.now();
  for (let i = 0; i < CARDS_DATA.length; i++) {
    const c = CARDS_DATA[i];
    await generateCard(c);
    process.stdout.write(`[${i+1}/${CARDS_DATA.length}] ${c.id}\n`);
  }
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`\nAll ${CARDS_DATA.length} cards generated successfully in ${elapsed}s!`);
}

run().catch(console.error);
