/**
 * Responsive / horizontal-overflow test.
 *
 *   node scripts/responsive-test.mjs                # all widths x all routes
 *   node scripts/responsive-test.mjs --widths 375 --routes /event,/register
 *   node scripts/responsive-test.mjs --no-shots     # overflow data only
 *
 * For each (width, route) pair it loads build\__overflow.html?route=... in
 * headless Chrome at exactly that window size. The probe page hosts the route
 * in an iframe sized to the viewport and writes the measured document width
 * back into the DOM, which --dump-dom then returns. A screenshot of the real
 * route is captured alongside as visual evidence.
 *
 * Requires: scripts\serve-build.mjs running (default :4173).
 */
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const BUILD = path.join(ROOT, 'build')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = path.join(ROOT, 'responsive-report')

const ROUTES = [
  '/', '/about', '/blog', '/blog-single', '/contact', '/event',
  '/event-details', '/homeV2', '/homeV3', '/register', '/admin/login', '/admin/dashboard',
]
const WIDTHS = [1440, 1366, 768, 375, 390]

const args = process.argv.slice(2)
const argOf = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null)
const widths = argOf('--widths') ? argOf('--widths').split(',').map(Number) : WIDTHS
const routes = argOf('--routes') ? argOf('--routes').split(',') : ROUTES
const shots = !args.includes('--no-shots')
const PORT = argOf('--port') || '4173'
const BASE = `http://127.0.0.1:${PORT}`

const PROBE = `<!doctype html>
<html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden}iframe{border:0;display:block}</style>
</head><body>
<div id="vk-result" data-status="pending" data-route="" data-docw="0" data-bodyw="0" data-winw="0" data-worst="" data-title=""></div>
<iframe id="vk-frame"></iframe>
<script>
(function () {
  var params = new URLSearchParams(location.search);
  var route = params.get('route') || '/';
  var out = document.getElementById('vk-result');
  var frame = document.getElementById('vk-frame');
  frame.style.width = window.innerWidth + 'px';
  frame.style.height = window.innerHeight + 'px';

  function measure() {
    try {
      var d = frame.contentDocument;
      if (!d || !d.documentElement) { return false; }
      // --virtual-time-budget advances timers but freezes CSS animations on their
      // first frame, so entrance animations such as fadeInRight (0% { transform:
      // translateX(20px) }) would be measured permanently mid-flight and every
      // fade-in looked like horizontal overflow. Neutralise animations so the
      // settled, real-world layout is what gets measured.
      try {
        if (!d.getElementById('vk-no-motion')) {
          var s = d.createElement('style');
          s.id = 'vk-no-motion';
          s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
          (d.head || d.documentElement).appendChild(s);
        }
      } catch (e) {}
      var docW = d.documentElement.scrollWidth || 0;
      var bodyW = (d.body && d.body.scrollWidth) || 0;
      var winW = frame.clientWidth || window.innerWidth;
      var worst = '';
      // find the element sticking out furthest past the viewport. maxRight must
      // start at the viewport width, not at docW/bodyW - seeding it with the
      // very measurement we are trying to explain guarantees that the element
      // which CAUSED the overflow can never be reported.
      var all = d.querySelectorAll('*');
      var maxRight = winW;
      for (var i = 0; i < all.length && i < 4000; i++) {
        var el = all[i];
        var r;
        try { r = el.getBoundingClientRect(); } catch (e) { continue; }
        if (r.width > 0 && (r.right > maxRight + 1)) {
          maxRight = r.right;
          var cls = (el.className && el.className.baseVal !== undefined) ? el.className.baseVal : (el.className || '');
          worst = el.tagName.toLowerCase() + (cls ? '.' + String(cls).trim().split(/\\s+/).slice(0, 2).join('.') : '');
        }
      }
      out.setAttribute('data-status', 'ok');
      out.setAttribute('data-route', route);
      out.setAttribute('data-docw', String(Math.round(docW)));
      out.setAttribute('data-bodyw', String(Math.round(bodyW)));
      out.setAttribute('data-winw', String(Math.round(winW)));
      out.setAttribute('data-worst', worst || 'none');
      out.setAttribute('data-title', d.title || '');
      return true;
    } catch (e) {
      out.setAttribute('data-status', 'error:' + e.message);
      return false;
    }
  }

  frame.addEventListener('load', function () {
    measure();
    // re-measure after animations / swiper / lazy layout settle
    setTimeout(measure, 600);
    setTimeout(measure, 1800);
  });
  frame.src = route;
  setTimeout(measure, 3000);
  setTimeout(measure, 6000);
})();
</script>
</body></html>`

function slug(route) {
  return (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'))
}

function chrome(argsArr, timeout = 90000) {
  return spawnSync(CHROME, argsArr, { encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024 })
}

function main() {
  if (!fs.existsSync(CHROME)) {
    console.error('Chrome not found: ' + CHROME)
    process.exit(1)
  }
  fs.mkdirSync(BUILD, { recursive: true })
  fs.writeFileSync(path.join(BUILD, '__overflow.html'), PROBE, 'utf8')

  if (shots) {
    for (const w of widths) fs.mkdirSync(path.join(OUT, String(w)), { recursive: true })
  }

  const rows = []
  let failures = 0

  for (const w of widths) {
    const h = w >= 768 ? 900 : 844
    for (const route of routes) {
      const probeUrl = `${BASE}/__overflow.html?route=${encodeURIComponent(route)}`
      const res = chrome([
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
        '--no-default-browser-check', '--force-device-scale-factor=1',
        `--window-size=${w},${h}`, '--virtual-time-budget=9000',
        '--dump-dom', probeUrl,
      ])

      const html = res.stdout || ''
      const m = html.match(/<div id="vk-result"([^>]*)>/)
      let status = 'no-result', docW = 0, bodyW = 0, winW = w, worst = ''
      if (m) {
        const attr = (n) => {
          const a = m[1].match(new RegExp(n + '="([^"]*)"'))
          return a ? a[1] : ''
        }
        status = attr('data-status')
        docW = parseInt(attr('data-docw'), 10) || 0
        bodyW = parseInt(attr('data-bodyw'), 10) || 0
        winW = parseInt(attr('data-winw'), 10) || w
        worst = attr('data-worst')
      }

      const widest = Math.max(docW, bodyW)
      const overflow = widest - winW
      const pass = status === 'ok' && overflow <= 1
      if (!pass) failures++

      rows.push({ w, route, status, docW, bodyW, winW, overflow, worst, pass })

      if (shots) {
        const shot = path.join(OUT, String(w), slug(route) + '.png')
        chrome([
          '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
          '--no-default-browser-check', '--force-device-scale-factor=1',
          `--window-size=${w},${h}`, '--virtual-time-budget=9000',
          '--screenshot=' + shot, BASE + route,
        ], 90000)
      }

      const mark = pass ? 'PASS' : 'FAIL'
      console.log(
        `${mark}  ${String(w).padStart(4)}px  ${route.padEnd(17)} doc=${String(docW).padStart(5)} body=${String(bodyW).padStart(5)} win=${winW}  overflow=${overflow > 0 ? overflow : 0}` +
          (pass ? '' : `   status=${status} worst=${worst}`)
      )
    }
  }

  fs.mkdirSync(OUT, { recursive: true })
  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify({ generated: new Date().toISOString(), base: BASE, rows }, null, 2),
    'utf8'
  )

  console.log('')
  console.log(`checks: ${rows.length}   failures: ${failures}`)
  console.log('report: ' + path.join(OUT, 'results.json'))
  console.log('shots : ' + OUT)
  process.exit(failures === 0 ? 0 : 1)
}

main()
