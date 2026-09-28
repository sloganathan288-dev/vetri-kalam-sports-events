/**
 * VETRI KALAM Sports & Events — brand artwork generator.
 *
 * Renders every image slot listed in VETRI-KALAM-IMAGE-MANIFEST.md at its exact
 * pixel size, using HTML/SVG + headless Chrome, then converts to the target
 * format (.jpg / .png) with the original filename.
 *
 * Style: deep navy (#0A1F44), blue (#1E6BE6), white, with a restrained lime
 * (#C3E92D) accent. Abstract sports compositions + athlete pictograms.
 * Deliberately contains NO text, NO logos, NO brand names.
 *
 *   node scripts/gen-images.mjs              # render everything
 *   node scripts/gen-images.mjs --only slides
 *   node scripts/gen-images.mjs --limit 3
 *   node scripts/gen-images.mjs --verify     # dimensions + flatness only
 */
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const PUBLIC = path.join(ROOT, 'public', 'images')
const TMP = path.join(process.env.TEMP || process.env.TMP || '.', 'vk-imagegen')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const C = {
  navy: '#0A1F44',
  deep: '#0C2350',
  blue: '#1E6BE6',
  sky: '#5A97F7',
  pale: '#DCE9FF',
  lime: '#C3E92D',
  white: '#FFFFFF',
}

/* ---------------------------------------------------------------- helpers */

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const round = (n) => Math.round(n * 100) / 100

/* --------------------------------------------------------------- pictograms */
/* Athletic figures built from round-capped strokes — a modern sports
   pictogram language. Each pose lives in a 100x100 box. */

const POSES = {
  run: {
    head: [57, 15, 9],
    lines: [
      'M55 25 L44 51',
      'M53 30 L69 37 L75 26',
      'M53 30 L37 41 L29 53',
      'M44 51 L60 65 L54 81',
      'M44 51 L32 67 L20 79',
      'M54 81 L64 85',
      'M20 79 L12 82',
    ],
  },
  celebrate: {
    head: [50, 16, 9],
    lines: [
      'M50 25 L50 52',
      'M50 30 L65 17 L71 6',
      'M50 30 L35 17 L29 6',
      'M50 52 L63 69 L61 85',
      'M50 52 L37 69 L39 85',
      'M61 85 L70 87',
      'M39 85 L30 87',
    ],
  },
  kick: {
    head: [43, 16, 9],
    lines: [
      'M44 25 L49 51',
      'M45 31 L61 35 L71 29',
      'M45 31 L30 37 L23 47',
      'M49 51 L47 69 L45 85',
      'M49 51 L67 57 L83 51',
      'M45 85 L37 87',
      'M83 51 L88 44',
    ],
  },
  jump: {
    head: [50, 14, 9],
    lines: [
      'M50 23 L50 49',
      'M50 28 L67 19 L74 9',
      'M50 28 L33 19 L26 9',
      'M50 49 L63 61 L57 76',
      'M50 49 L37 61 L43 76',
      'M57 76 L66 79',
      'M43 76 L34 79',
    ],
  },
  stretch: {
    head: [37, 23, 9],
    lines: [
      'M40 31 L53 53',
      'M42 35 L29 49 L34 64',
      'M42 35 L57 45 L66 41',
      'M53 53 L57 71 L59 87',
      'M53 53 L40 69 L36 87',
      'M59 87 L68 89',
      'M36 87 L27 89',
    ],
  },
  cycle: {
    head: [58, 20, 8],
    lines: [
      'M56 28 L44 47',
      'M54 32 L68 40 L74 47',
      'M54 32 L44 43 L38 49',
      'M44 47 L58 60 L56 76',
      'M44 47 L33 62 L40 76',
      'M56 76 L65 78',
      'M40 76 L31 79',
    ],
  },
}

function figure(pose, x, y, box, color, opacity, sw) {
  const p = POSES[pose] || POSES.run
  const s = box / 100
  const stroke = round(sw)
  const lines = p.lines
    .map((d) => `<path d="${d}" />`)
    .join('')
  return (
    `<g transform="translate(${round(x)} ${round(y)}) scale(${round(s)})" fill="none" ` +
    `stroke="${color}" stroke-width="${round(stroke / s)}" stroke-linecap="round" ` +
    `stroke-linejoin="round" opacity="${opacity}">${lines}` +
    `<circle cx="${p.head[0]}" cy="${p.head[1]}" r="${p.head[2]}" fill="${color}" stroke="none" /></g>`
  )
}

function avatar(x, y, box, color, opacity) {
  const s = box / 100
  return (
    `<g transform="translate(${round(x)} ${round(y)}) scale(${round(s)})" fill="${color}" opacity="${opacity}">` +
    `<circle cx="50" cy="35" r="17" />` +
    `<path d="M14 100 C14 72 30 60 50 60 C70 60 86 72 86 100 Z" /></g>`
  )
}

/* ------------------------------------------------------------ shape helpers */

function lanes(w, h, angle, count, gap, color, opacity, offset = 0) {
  const len = Math.hypot(w, h) * 1.6
  let out = `<g transform="rotate(${angle} ${w / 2} ${h / 2})" stroke="${color}" stroke-linecap="round" opacity="${opacity}">`
  for (let i = 0; i < count; i++) {
    const y = h / 2 + offset + (i - (count - 1) / 2) * gap
    out += `<line x1="${round(-len / 2)}" y1="${round(y)}" x2="${round(len / 2)}" y2="${round(y)}" stroke-width="${round(gap * 0.16)}" />`
  }
  return out + '</g>'
}

function halftone(x, y, cols, rows, gap, maxR, color, opacity, flip = 1) {
  let out = `<g fill="${color}" opacity="${opacity}">`
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = 1 - (c / cols) * flip - (r / rows) * 0.5
      const rad = Math.max(0, maxR * t)
      if (rad <= 0.25) continue
      out += `<circle cx="${round(x + c * gap)}" cy="${round(y + r * gap)}" r="${round(rad)}" />`
    }
  }
  return out + '</g>'
}

function chevrons(x, y, size, count, gap, color, opacity, flip = 1) {
  let out = `<g fill="none" stroke="${color}" stroke-width="${round(size * 0.16)}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">`
  for (let i = 0; i < count; i++) {
    const ox = x + i * gap * flip
    out += `<path d="M${round(ox)} ${round(y - size / 2)} L${round(ox + size * 0.55 * flip)} ${round(y)} L${round(ox)} ${round(y + size / 2)}" />`
  }
  return out + '</g>'
}

function ring(cx, cy, r, sw, color, opacity, dash = '') {
  return (
    `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="none" ` +
    `stroke="${color}" stroke-width="${round(sw)}" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ''} />`
  )
}

/* ----------------------------------------------------------- tile category art */

const TILE_ICONS = {
  track: (c, s) =>
    `<g fill="none" stroke="${c}" stroke-width="${round(s * 0.055)}" opacity="0.95">` +
    `<rect x="${round(s * 0.14)}" y="${round(s * 0.28)}" width="${round(s * 0.72)}" height="${round(s * 0.44)}" rx="${round(s * 0.22)}" />` +
    `<rect x="${round(s * 0.27)}" y="${round(s * 0.39)}" width="${round(s * 0.46)}" height="${round(s * 0.22)}" rx="${round(s * 0.11)}" /></g>`,
  medal: (c, s) =>
    `<g opacity="0.95"><path d="M${round(s * 0.34)} ${round(s * 0.14)} L${round(s * 0.44)} ${round(s * 0.44)} L${round(s * 0.56)} ${round(s * 0.44)} L${round(s * 0.66)} ${round(s * 0.14)}" fill="none" stroke="${c}" stroke-width="${round(s * 0.055)}" stroke-linejoin="round"/>` +
    `<circle cx="${round(s * 0.5)}" cy="${round(s * 0.63)}" r="${round(s * 0.2)}" fill="none" stroke="${c}" stroke-width="${round(s * 0.055)}"/></g>`,
  corporate: (c, s) =>
    `<g fill="none" stroke="${c}" stroke-width="${round(s * 0.055)}" stroke-linejoin="round" opacity="0.95">` +
    `<rect x="${round(s * 0.16)}" y="${round(s * 0.32)}" width="${round(s * 0.68)}" height="${round(s * 0.46)}" rx="${round(s * 0.06)}"/>` +
    `<path d="M${round(s * 0.38)} ${round(s * 0.32)} L${round(s * 0.38)} ${round(s * 0.24)} Q${round(s * 0.38)} ${round(s * 0.18)} ${round(s * 0.44)} ${round(s * 0.18)} L${round(s * 0.56)} ${round(s * 0.18)} Q${round(s * 0.62)} ${round(s * 0.18)} ${round(s * 0.62)} ${round(s * 0.24)} L${round(s * 0.62)} ${round(s * 0.32)}"/></g>`,
  community: (c, s) =>
    `<g fill="none" stroke="${c}" stroke-width="${round(s * 0.052)}" stroke-linecap="round" opacity="0.95">` +
    `<circle cx="${round(s * 0.5)}" cy="${round(s * 0.34)}" r="${round(s * 0.1)}" fill="${c}" stroke="none"/>` +
    `<path d="M${round(s * 0.3)} ${round(s * 0.76)} Q${round(s * 0.3)} ${round(s * 0.5)} ${round(s * 0.5)} ${round(s * 0.5)} Q${round(s * 0.7)} ${round(s * 0.5)} ${round(s * 0.7)} ${round(s * 0.76)}"/></g>`,
  ticket: (c, s) =>
    `<g fill="none" stroke="${c}" stroke-width="${round(s * 0.055)}" stroke-linejoin="round" opacity="0.95">` +
    `<path d="M${round(s * 0.14)} ${round(s * 0.34)} L${round(s * 0.86)} ${round(s * 0.34)} L${round(s * 0.86)} ${round(s * 0.46)} A${round(s * 0.08)} ${round(s * 0.08)} 0 0 0 ${round(s * 0.86)} ${round(s * 0.62)} L${round(s * 0.86)} ${round(s * 0.7)} L${round(s * 0.14)} ${round(s * 0.7)} L${round(s * 0.14)} ${round(s * 0.62)} A${round(s * 0.08)} ${round(s * 0.08)} 0 0 0 ${round(s * 0.14)} ${round(s * 0.46)} Z"/></g>`,
}

/* ------------------------------------------------------------------- scenes */

function defs(spec, r) {
  const angle = 90 + Math.round((r() - 0.5) * 70)
  const dark = spec.tone === 'deep'
  const light = spec.tone === 'light'
  const stops = light
    ? `<stop offset="0%" stop-color="#FFFFFF"/><stop offset="55%" stop-color="#EAF1FF"/><stop offset="100%" stop-color="#CFE0FF"/>`
    : dark
      ? `<stop offset="0%" stop-color="#050D22"/><stop offset="60%" stop-color="#0A1F44"/><stop offset="100%" stop-color="#123068"/>`
      : `<stop offset="0%" stop-color="#0A1F44"/><stop offset="55%" stop-color="#122E63"/><stop offset="100%" stop-color="#1E6BE6"/>`
  return `
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} .5 .5)">${stops}</linearGradient>
    <radialGradient id="glow"><stop offset="0%" stop-color="${C.blue}" stop-opacity=".55"/><stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowLime"><stop offset="0%" stop-color="${C.lime}" stop-opacity=".30"/><stop offset="100%" stop-color="${C.lime}" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".78">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#04102A" stop-opacity="${light ? 0.18 : 0.5}"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${Math.floor(r() * 100)}" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>
  </defs>`
}

function art(spec, seed) {
  const { w, h, scene, pose, tone } = spec
  const r = rng(seed)
  const ink = tone === 'light' ? C.navy : C.white
  const body = []
  body.push(defs(spec, r))
  body.push(`<rect width="${w}" height="${h}" fill="url(#bg)"/>`)

  const S = Math.min(w, h)

  if (scene === 'bg') {
    // Wide, low-contrast venue/track backdrop that must carry white text.
    body.push(`<ellipse cx="${round(w * 0.16)}" cy="${round(h * 0.3)}" rx="${round(w * 0.42)}" ry="${round(h * 0.55)}" fill="url(#glow)"/>`)
    body.push(`<ellipse cx="${round(w * 0.88)}" cy="${round(h * 0.78)}" rx="${round(w * 0.38)}" ry="${round(h * 0.5)}" fill="url(#glow)" opacity=".7"/>`)
    body.push(lanes(w, h, -14, 7, h * 0.14, C.white, 0.05))
    body.push(lanes(w, h, 26, 4, h * 0.2, C.sky, 0.04))
    body.push(ring(w * 0.82, h * 0.24, S * 0.42, S * 0.012, C.white, 0.06, `${round(S * 0.05)} ${round(S * 0.035)}`))
    body.push(ring(w * 0.14, h * 0.86, S * 0.3, S * 0.01, C.lime, 0.07))
    body.push(`<rect width="${w}" height="${h}" fill="#05102A" opacity=".38"/>`)
    body.push(halftone(w * 0.7, h * 0.58, 9, 7, S * 0.05, S * 0.02, C.white, 0.05))
  } else if (scene === 'avatar') {
    body.push(`<rect width="${w}" height="${h}" fill="${C.navy}"/>`)
    body.push(`<circle cx="${round(w * 0.5)}" cy="${round(h * 0.42)}" r="${round(S * 0.72)}" fill="url(#glow)"/>`)
    body.push(ring(w * 0.5, h * 0.5, S * 0.44, S * 0.03, C.white, 0.1))
    body.push(avatar(w * 0.5 - S * 0.36, h * 0.5 - S * 0.36, S * 0.72, C.pale, 0.92))
    body.push(`<rect x="0" y="${round(h * 0.86)}" width="${w}" height="${round(h * 0.14)}" fill="${C.blue}" opacity=".55"/>`)
    body.push(halftone(w * 0.06, h * 0.08, 5, 4, S * 0.08, S * 0.016, C.lime, 0.5))
  } else if (scene === 'tile') {
    const icon = TILE_ICONS[spec.icon] || TILE_ICONS.track
    body.push(`<circle cx="${round(w * 0.5)}" cy="${round(h * 0.5)}" r="${round(S * 0.34)}" fill="url(#glow)"/>`)
    body.push(ring(w * 0.5, h * 0.5, S * 0.36, S * 0.02, C.white, 0.18, `${round(S * 0.07)} ${round(S * 0.05)}`))
    body.push(icon(C.pale, S))
    body.push(halftone(w * 0.06, h * 0.72, 6, 4, S * 0.055, S * 0.014, C.lime, 0.55))
  } else if (scene === 'poster') {
    body.push(`<circle cx="${round(w * 0.5)}" cy="${round(h * 0.46)}" r="${round(S * 0.46)}" fill="url(#glow)"/>`)
    body.push(ring(w * 0.5, h * 0.46, Math.min(w, h) * 0.36, S * 0.014, C.white, 0.2, `${round(S * 0.045)} ${round(S * 0.03)}`))
    body.push(lanes(w, h, -22, 5, h * 0.1, C.white, 0.07))
    body.push(figure(pose, w * 0.5 - h * 0.34, h * 0.5 - h * 0.34, h * 0.68, ink, 0.92, h * 0.035))
    body.push(chevrons(w * 0.1, h * 0.87, h * 0.06, 3, h * 0.075, C.lime, 0.75))
    body.push(halftone(w * 0.68, h * 0.06, 7, 5, S * 0.06, S * 0.017, C.white, 0.14))
  } else if (scene === 'card') {
    body.push(`<ellipse cx="${round(w * 0.76)}" cy="${round(h * 0.5)}" rx="${round(h * 0.72)}" ry="${round(h * 0.72)}" fill="url(#glow)"/>`)
    body.push(lanes(w, h, -16, 6, h * 0.15, C.white, 0.07))
    body.push(ring(w * 0.84, h * 0.5, h * 0.46, h * 0.012, C.white, 0.16, `${round(h * 0.05)} ${round(h * 0.035)}`))
    body.push(ring(w * 0.84, h * 0.5, h * 0.6, h * 0.008, C.lime, 0.22))
    body.push(figure(pose, w * 0.7 - h * 0.36, h * 0.5 - h * 0.36, h * 0.72, C.white, 0.9, h * 0.036))
    body.push(chevrons(w * 0.05, h * 0.5, h * 0.13, 4, h * 0.075, C.white, 0.18))
    body.push(halftone(w * 0.04, h * 0.68, 8, 5, S * 0.05, S * 0.015, C.lime, 0.35))
  } else if (scene === 'hero') {
    body.push(`<ellipse cx="${round(w * 0.68)}" cy="${round(h * 0.52)}" rx="${round(h * 0.95)}" ry="${round(h * 0.95)}" fill="url(#glow)"/>`)
    body.push(`<ellipse cx="${round(w * 0.1)}" cy="${round(h * 0.9)}" rx="${round(h * 0.7)}" ry="${round(h * 0.7)}" fill="url(#glowLime)" opacity=".5"/>`)
    body.push(lanes(w, h, -13, 8, h * 0.12, C.white, 0.08))
    body.push(ring(w * 0.74, h * 0.5, h * 0.44, h * 0.011, C.white, 0.18, `${round(h * 0.055)} ${round(h * 0.04)}`))
    body.push(ring(w * 0.74, h * 0.5, h * 0.62, h * 0.007, C.white, 0.09))
    body.push(figure(pose, w * 0.66 - h * 0.37, h * 0.5 - h * 0.37, h * 0.74, C.white, 0.93, h * 0.036))
    body.push(chevrons(w * 0.04, h * 0.55, h * 0.11, 4, h * 0.07, C.lime, 0.65))
    body.push(halftone(w * 0.86, h * 0.08, 7, 6, h * 0.05, h * 0.016, C.white, 0.16, -1))
  } else if (scene === 'wide') {
    body.push(`<ellipse cx="${round(w * 0.5)}" cy="${round(h * 0.55)}" rx="${round(w * 0.4)}" ry="${round(h * 0.9)}" fill="url(#glow)" opacity=".8"/>`)
    body.push(lanes(w, h, -8, 6, h * 0.17, C.white, 0.06))
    body.push(ring(w * 0.18, h * 0.3, S * 0.5, S * 0.012, C.white, 0.12, `${round(S * 0.05)} ${round(S * 0.035)}`))
    body.push(ring(w * 0.86, h * 0.74, S * 0.4, S * 0.01, C.lime, 0.2))
    body.push(figure(pose, w * 0.5 - h * 0.34, h * 0.5 - h * 0.34, h * 0.68, C.white, 0.88, h * 0.034))
    body.push(halftone(w * 0.04, h * 0.62, 9, 5, S * 0.055, S * 0.016, C.white, 0.13))
  } else if (scene === 'square') {
    body.push(`<circle cx="${round(w * 0.52)}" cy="${round(h * 0.46)}" r="${round(S * 0.46)}" fill="url(#glow)"/>`)
    body.push(ring(w * 0.5, h * 0.5, S * 0.38, S * 0.016, C.white, 0.2, `${round(S * 0.05)} ${round(S * 0.035)}`))
    body.push(lanes(w, h, -30, 5, S * 0.13, C.white, 0.07))
    body.push(figure(pose, w * 0.5 - S * 0.34, h * 0.5 - S * 0.34, S * 0.68, C.white, 0.92, S * 0.04))
    body.push(halftone(w * 0.04, h * 0.74, 6, 4, S * 0.06, S * 0.016, C.lime, 0.5))
  } else if (scene === 'ops') {
    // Portrait "how we deliver events" panels — abstract operations motifs.
    body.push(`<ellipse cx="${round(w * 0.5)}" cy="${round(h * 0.3)}" rx="${round(w * 0.9)}" ry="${round(w * 0.9)}" fill="url(#glow)" opacity=".85"/>`)
    body.push(lanes(w, h, -24, 7, h * 0.1, C.white, 0.06))
    for (let i = 0; i < 5; i++) {
      const bw = w * (0.16 + r() * 0.1)
      body.push(
        `<rect x="${round(w * 0.1 + i * w * 0.17)}" y="${round(h * (0.12 + r() * 0.1))}" width="${round(bw)}" height="${round(h * 0.055)}" rx="${round(h * 0.027)}" fill="${C.white}" opacity="${round(0.1 + r() * 0.12)}"/>`
      )
    }
    body.push(ring(w * 0.5, h * 0.58, w * 0.42, w * 0.014, C.white, 0.16, `${round(w * 0.05)} ${round(w * 0.035)}`))
    body.push(figure(pose, w * 0.5 - h * 0.24, h * 0.42 - h * 0.24, h * 0.48, C.white, 0.9, h * 0.028))
    body.push(chevrons(w * 0.08, h * 0.86, h * 0.05, 4, h * 0.055, C.lime, 0.7))
    body.push(halftone(w * 0.66, h * 0.7, 6, 5, w * 0.05, w * 0.014, C.white, 0.13))
  } else if (scene === 'band') {
    // Small wide decorative strip (heading accent) — no figure, no clutter.
    body.push(`<ellipse cx=\"${round(w * 0.78)}\" cy=\"${round(h * 0.5)}\" rx=\"${round(h * 1.1)}\" ry=\"${round(h * 1.4)}\" fill=\"url(#glow)\"/>`)
    body.push(lanes(w, h, -10, 5, h * 0.2, C.white, 0.1))
    body.push(ring(w * 0.86, h * 0.5, h * 0.42, h * 0.03, C.white, 0.18, `${round(h * 0.16)} ${round(h * 0.11)}`))
    body.push(`<rect x=\"0\" y=\"${round(h * 0.82)}\" width=\"${w}\" height=\"${round(h * 0.055)}\" fill=\"${C.lime}\" opacity=\"0.75\"/>`)
    body.push(halftone(w * 0.04, h * 0.18, 6, 3, h * 0.14, h * 0.03, C.white, 0.22))
  } else if (scene === 'avatarWide') {
    body.push(`<rect width="${w}" height="${h}" fill="${C.navy}"/>`)
    body.push(`<circle cx="${round(w * 0.5)}" cy="${round(h * 0.45)}" r="${round(S * 0.7)}" fill="url(#glow)"/>`)
    body.push(avatar(w * 0.5 - S * 0.4, h * 0.5 - S * 0.42, S * 0.8, C.pale, 0.9))
    body.push(`<rect y="${round(h * 0.88)}" width="${w}" height="${round(h * 0.12)}" fill="${C.blue}" opacity=".6"/>`)
  } else {
    // 'abstract'
    body.push(`<ellipse cx="${round(w * 0.7)}" cy="${round(h * 0.4)}" rx="${round(w * 0.5)}" ry="${round(h * 0.8)}" fill="url(#glow)"/>`)
    body.push(lanes(w, h, -18, 6, h * 0.14, C.white, 0.07))
    body.push(ring(w * 0.7, h * 0.5, S * 0.42, S * 0.014, C.white, 0.16, `${round(S * 0.05)} ${round(S * 0.035)}`))
    body.push(ring(w * 0.2, h * 0.7, S * 0.3, S * 0.01, C.lime, 0.22))
    body.push(figure(pose, w * 0.62 - S * 0.3, h * 0.5 - S * 0.3, S * 0.6, C.white, 0.9, S * 0.035))
    body.push(halftone(w * 0.05, h * 0.1, 8, 5, S * 0.055, S * 0.016, C.white, 0.13))
  }

  body.push(`<rect width="${w}" height="${h}" fill="url(#vig)"/>`)
  body.push(`<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${tone === 'light' ? 0.05 : 0.09}" style="mix-blend-mode:overlay"/>`)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body.join('')}</svg>`
}

/* -------------------------------------------------------------------- specs */

const SPECS = []
function add(rel, w, h, scene, extra = {}) {
  SPECS.push({ rel, w, h, scene, ...extra })
}

// 2.1 hero slides
const slidePoses = ['run', 'jump', 'run', 'celebrate', 'run', 'kick']
for (let i = 1; i <= 6; i++) add(`images/slides/slide${i}.jpg`, 1920, 858, 'hero', { pose: slidePoses[i - 1], tone: 'dark' })
add('images/slides/slidev1.jpg', 930, 580, 'card', { pose: 'run', tone: 'dark' })
add('images/slides/slidev2.jpg', 930, 580, 'card', { pose: 'celebrate', tone: 'dark' })
add('images/slides/bannerv1.jpg', 450, 275, 'wide', { pose: 'run', tone: 'dark' })
add('images/slides/bannerv2.jpg', 450, 275, 'wide', { pose: 'kick', tone: 'dark' })

// 2.2 event cards
add('images/evtent/event1.jpg', 1370, 640, 'card', { pose: 'run', tone: 'dark' })
add('images/evtent/event2.jpg', 1596, 640, 'card', { pose: 'kick', tone: 'dark' })
add('images/evtent/event3.jpg', 1670, 640, 'card', { pose: 'run', tone: 'dark' })
add('images/evtent/event4.jpg', 1402, 640, 'card', { pose: 'celebrate', tone: 'dark' })
add('images/evtent/evt1.jpg', 689, 517, 'square', { pose: 'stretch', tone: 'dark' })
add('images/evtent/evt2.jpg', 924, 616, 'square', { pose: 'jump', tone: 'dark' })
add('images/evtent/new-event.jpg', 732, 488, 'wide', { pose: 'celebrate', tone: 'dark' })

// 2.3 capability panels
const opsPoses = ['run', 'stretch', 'jump', 'celebrate']
for (let i = 1; i <= 4; i++) add(`images/member/team${i}.jpg`, 669, 891, 'ops', { pose: opsPoses[i - 1], tone: 'dark' })

// 2.4 about
add('images/about/run1.jpg', 570, 380, 'wide', { pose: 'run', tone: 'dark' })
add('images/about/run2.jpg', 570, 380, 'wide', { pose: 'run', tone: 'dark' })
add('images/about/run3.jpg', 570, 380, 'square', { pose: 'celebrate', tone: 'dark' })
add('images/about/tab1.jpg', 640, 480, 'abstract', { pose: 'stretch', tone: 'dark' })
add('images/about/tab2.jpg', 306, 459, 'poster', { pose: 'stretch', tone: 'dark' })

// 2.5 testimonials
add('images/testimonial/image.jpg', 580, 871, 'poster', { pose: 'celebrate', tone: 'dark' })
add('images/testimonial/profile.jpg', 136, 136, 'avatar', { tone: 'dark' })

// 2.6 blog
add('images/blog/blog1.jpg', 1020, 574, 'wide', { pose: 'stretch', tone: 'dark' })
add('images/blog/blog2.jpg', 1020, 575, 'wide', { pose: 'run', tone: 'dark' })
add('images/blog/blog3.jpg', 1020, 575, 'wide', { pose: 'jump', tone: 'dark' })
add('images/blog/blog-details.jpg', 1020, 680, 'abstract', { pose: 'run', tone: 'dark' })
add('images/blog/bl-v3.jpg', 675, 450, 'square', { pose: 'stretch', tone: 'dark' })
add('images/blog/bl-v3-1.jpg', 675, 450, 'square', { pose: 'run', tone: 'dark' })
add('images/blog/bl-v3-2.jpg', 675, 450, 'square', { pose: 'jump', tone: 'dark' })
add('images/blog/post-widget1.jpg', 1368, 1369, 'poster', { pose: 'run', tone: 'dark' })
add('images/blog/post-widget2.jpg', 618, 411, 'wide', { pose: 'run', tone: 'dark' })
add('images/blog/post-widget3.jpg', 618, 411, 'abstract', { pose: 'celebrate', tone: 'dark' })
add('images/blog/post-widget4.jpg', 618, 411, 'square', { pose: 'kick', tone: 'dark' })
for (let i = 1; i <= 3; i++) add(`images/blog/post${i}.jpg`, 120, 120, 'square', { pose: i === 1 ? 'stretch' : i === 2 ? 'run' : 'jump', tone: 'dark' })
for (let i = 1; i <= 3; i++) add(`images/blog/cmt${i}.jpg`, 104, 104, 'avatar', { tone: 'dark' })

// 2.7 registration grid
const posters = ['run', 'celebrate', 'run', 'kick']
for (let i = 1; i <= 4; i++) add(`images/product/${i}.jpg`, 329, 493, 'poster', { pose: posters[i - 1], tone: i % 2 ? 'dark' : 'deep' })
const cards = ['run', 'kick', 'jump', 'celebrate', 'stretch', 'cycle', 'run', 'jump', 'celebrate', 'run']
for (let i = 5; i <= 14; i++) add(`images/product/${i}.png`, 495, 660, 'poster', { pose: cards[i - 5], tone: i % 2 ? 'dark' : 'deep' })
const tileIcons = ['track', 'medal', 'corporate', 'community', 'ticket']
const tileNames = ['categories.png', 'categories1.png', 'categories2.png', 'categories3.png', 'categories4.png']
for (let i = 0; i < 5; i++) add(`images/product/${tileNames[i]}`, 240, 240, 'tile', { icon: tileIcons[i], tone: 'dark' })
add('images/product/pack.jpg', 1440, 1182, 'abstract', { pose: 'run', tone: 'dark' })
for (let i = 1; i <= 4; i++) add(`images/product/pd${i}.jpg`, 100, 100, 'square', { pose: posters[i - 1], tone: 'dark' })

// 2.8 gallery
const igPoses = ['run', 'celebrate', 'stretch', 'jump', 'kick']
for (let i = 1; i <= 5; i++) add(`images/retinal/ig${i}.jpg`, 480, 480, 'square', { pose: igPoses[i - 1], tone: 'dark' })
add('images/retinal/ig6.jpg', 320, 320, 'square', { pose: 'run', tone: 'dark' })

// 2.9 guides & video
add('images/retinal/tutorial1.jpg', 897, 598, 'wide', { pose: 'run', tone: 'dark' })
add('images/retinal/tutorial2.jpg', 896, 598, 'abstract', { pose: 'stretch', tone: 'dark' })
add('images/retinal/tutorial3.jpg', 897, 598, 'wide', { pose: 'jump', tone: 'dark' })
add('images/retinal/video.jpg', 540, 540, 'square', { pose: 'celebrate', tone: 'dark' })
add('images/retinal/img-form.jpg', 1920, 1395, 'abstract', { pose: 'celebrate', tone: 'dark' })
add('images/retinal/cls1.jpg', 1034, 1034, 'poster', { pose: 'run', tone: 'dark' })
add('images/retinal/cls2.jpg', 495, 495, 'square', { pose: 'kick', tone: 'dark' })
add('images/retinal/cls3.jpg', 495, 495, 'square', { pose: 'run', tone: 'dark' })
add('images/retinal/cls4.jpg', 1034, 495, 'wide', { pose: 'celebrate', tone: 'dark' })

// 2.11 masked about frames
add('images/about/mask1.png', 305, 432, 'poster', { pose: 'stretch', tone: 'dark' })
add('images/about/mask2.png', 427, 528, 'poster', { pose: 'run', tone: 'dark' })

// Not in the manifest but referenced by About1.js/about.js and actually blank
add('images/about/graphic-box.png', 201, 80, 'band', { tone: 'dark' })

// 3 — CSS backgrounds (public copy; the src copies are deliberately untouched)
add('images/parallax/paralax1.jpg', 1920, 984, 'bg', { tone: 'deep' })
add('images/parallax/2.jpg', 1920, 936, 'bg', { tone: 'deep' })
add('images/retinal/contact.jpg', 1920, 640, 'bg', { tone: 'deep' })
add('images/retinal/1.jpg', 2880, 1140, 'bg', { tone: 'deep' })

// Unreferenced template leftovers — rendered anyway so no blank image remains.
add('images/slides/slide7.jpg', 1920, 858, 'hero', { pose: 'cycle', tone: 'dark' })
add('images/slides/slide8.jpg', 1920, 858, 'hero', { pose: 'stretch', tone: 'dark' })
add('images/slides/slide9.jpg', 1920, 858, 'hero', { pose: 'celebrate', tone: 'dark' })
add('images/parallax/paralax2.jpg', 1920, 984, 'bg', { tone: 'deep' })
add('images/parallax/3.jpg', 3330, 1251, 'bg', { tone: 'deep' })
add('images/testimonial/map.jpg', 401, 302, 'abstract', { pose: 'run', tone: 'dark' })

/* ------------------------------------------------------------------ render */

function render(spec, index) {
  const w = spec.w
  const h = spec.h
  const svg = art(spec, 1000 + index * 7919)
  const html =
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<style>html,body{margin:0;padding:0;width:${w}px;height:${h}px;overflow:hidden;background:#0A1F44}svg{display:block}</style>` +
    `</head><body>${svg}</body></html>`
  const htmlPath = path.join(TMP, `img${index}.html`)
  const pngPath = path.join(TMP, `img${index}.png`)
  fs.writeFileSync(htmlPath, html, 'utf8')
  if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath)
  const res = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
      `--window-size=${w},${h}`,
      '--virtual-time-budget=4000',
      '--screenshot=' + pngPath,
      'file:///' + htmlPath.replace(/\\/g, '/'),
    ],
    { encoding: 'utf8', timeout: 60000 }
  )
  if (!fs.existsSync(pngPath)) {
    return { spec, ok: false, error: (res.stderr || res.error || 'no output').toString().slice(0, 300) }
  }
  fs.copyFileSync(pngPath, path.join(TMP, `final${index}.png`))
  return { spec, ok: true, index }
}

function verify() {
  const bad = []
  const good = []
  for (const s of SPECS) {
    const target = path.join(PUBLIC, s.rel.replace(/^images\//, ''))
    if (!fs.existsSync(target)) {
      bad.push(s.rel + '  MISSING')
      continue
    }
    good.push(s.rel + '  ' + Math.round(fs.statSync(target).size / 1024) + 'KB')
  }
  console.log('present: ' + good.length + ' / ' + SPECS.length)
  if (bad.length) console.log('MISSING:\n  ' + bad.join('\n  '))
  return bad.length === 0
}

/* -------------------------------------------------------------------- main */

const args = process.argv.slice(2)
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 0

let list = SPECS
if (only) list = list.filter((s) => s.rel.includes(only))
if (limit) list = list.slice(0, limit)

if (args.includes('--list')) {
  console.log(SPECS.map((s) => `${s.rel}\t${s.w}x${s.h}\t${s.scene}`).join('\n'))
  console.log('TOTAL ' + SPECS.length)
  process.exit(0)
}
if (args.includes('--verify')) {
  process.exit(verify() ? 0 : 1)
}
if (!fs.existsSync(CHROME)) {
  console.error('Chrome not found at ' + CHROME)
  process.exit(1)
}
fs.mkdirSync(TMP, { recursive: true })
fs.mkdirSync(PUBLIC, { recursive: true })

console.log(`rendering ${list.length} image(s) with headless Chrome...`)
const results = []
const t0 = Date.now()
for (let i = 0; i < list.length; i++) {
  const spec = list[i]
  const globalIndex = SPECS.indexOf(spec)
  const r = render(spec, globalIndex)
  results.push(r)
  if (!r.ok) console.log('FAIL ' + spec.rel + ' :: ' + r.error)
  else if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${list.length}  (${Math.round((Date.now() - t0) / 1000)}s)`)
}
const failed = results.filter((r) => !r.ok)
console.log(`rendered ${results.length - failed.length}/${results.length} in ${Math.round((Date.now() - t0) / 1000)}s`)
console.log('PNG output staged in: ' + TMP)
console.log('Next: convert final*.png to the target filenames (see scripts/image-commit.ps1)')
