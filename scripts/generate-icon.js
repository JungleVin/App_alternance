// Generates icons/icon.png (1024×1024) — the Tracka app icon.
// Uses sharp + SVG so no native canvas dependency is needed.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZE = 1024;
const R = SIZE / 2;          // 512 — center
const OUTER = R - 40;        // outer ring radius
const MID = OUTER - 90;      // inner hole of ring
const INNER = MID - 60;      // inner dot radius

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <!-- Background card gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A1F4E"/>
      <stop offset="100%" stop-color="#1A1030"/>
    </linearGradient>

    <!-- Outer ring gradient -->
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#FF5B8E"/>
      <stop offset="33%"  stop-color="#FFB547"/>
      <stop offset="66%"  stop-color="#7B61FF"/>
      <stop offset="100%" stop-color="#12B981"/>
    </linearGradient>

    <!-- Inner dot gradient -->
    <linearGradient id="dot" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#FF5B8E"/>
      <stop offset="50%"  stop-color="#7B61FF"/>
      <stop offset="100%" stop-color="#FFB547"/>
    </linearGradient>

    <!-- Glow filter for ring -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Clip to rounded square -->
    <clipPath id="roundedSquare">
      <rect width="${SIZE}" height="${SIZE}" rx="230" ry="230"/>
    </clipPath>
  </defs>

  <g clip-path="url(#roundedSquare)">
    <!-- Background -->
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>

    <!-- Subtle radial glow -->
    <circle cx="${R}" cy="${R}" r="${R}" fill="rgba(123,97,255,0.15)"/>

    <!-- Outer ring (donut) -->
    <circle cx="${R}" cy="${R}" r="${OUTER}" fill="url(#ring)" filter="url(#glow)"/>
    <!-- Cut out middle to make ring -->
    <circle cx="${R}" cy="${R}" r="${MID}" fill="url(#bg)"/>

    <!-- Inner dot -->
    <circle cx="${R}" cy="${R}" r="${INNER}" fill="url(#dot)" filter="url(#glow)"/>

    <!-- Soft highlight on top -->
    <ellipse cx="${R}" cy="${R - 120}" rx="260" ry="160" fill="rgba(255,255,255,0.06)"/>
  </g>
</svg>
`.trim();

const outPath = path.join(__dirname, '../icons/icon.png');
fs.mkdirSync(path.dirname(outPath), { recursive: true });

sharp(Buffer.from(svg))
  .resize(SIZE, SIZE)
  .png()
  .toFile(outPath)
  .then(() => console.log(`✓ Icon saved → ${outPath}`))
  .catch(err => { console.error('Icon generation failed:', err); process.exit(1); });
