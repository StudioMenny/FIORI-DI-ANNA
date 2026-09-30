/* =========================================================
   FIORI DI ANNA — script condiviso
   ========================================================= */
(() => {
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const euro = n => n.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const MESI_BREVI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
const GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
const page = document.body.dataset.page;

/* ---------- mese e stagione (con anteprima per mostrare il sito al cliente) ---------- */
const demoMonth = (() => { try { return Number(sessionStorage.getItem("fd-demo-month")) || 0; } catch { return 0; } })();
const MONTH = demoMonth || new Date().getMonth() + 1;
const seasonOf = m => (m >= 3 && m <= 5) ? "primavera" : (m >= 6 && m <= 8) ? "estate" : (m >= 9 && m <= 11) ? "autunno" : "inverno";
const SEASON = seasonOf(MONTH);
document.documentElement.dataset.season = SEASON;
const inSeason = m => FLOWERS.filter(f => f.mesi.includes(m));
const seasonalOnly = m => inSeason(m).filter(f => f.mesi.length < 12);

/* ---------- icone ---------- */
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 1 1 12 21.8zm8.4-18.3A11.8 11.8 0 0 0 1.8 17.6L.1 24l6.5-1.7A11.8 11.8 0 0 0 23.8 12a11.7 11.7 0 0 0-3.4-8.5z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h18l-2 10H5z"/><path d="M8 10l4-6 4 6"/><path d="M9 14v3M15 14v3"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
};

/* =========================================================
   DISEGNO DEI FIORI (SVG generati dal codice)
   ========================================================= */
function hexToRgb(h) { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex); const t = amt < 0 ? 0 : 255; const p = Math.abs(amt);
  const f = c => Math.round((t - c) * p + c).toString(16).padStart(2, "0");
  return "#" + f(r) + f(g) + f(b);
}
function hsl(hex) {
  let [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s, l];
}
function colorFamily(hex) {
  const [h, s, l] = hsl(hex);
  if (l > .9 || s < .15) return "bianco";
  if ((h >= 300 && h < 345) || ((h >= 345 || h < 15) && l > .7)) return "rosa";
  if (h >= 345 || h < 15) return "rosso";
  if (h < 70) return "giallo";
  if (h < 190) return "verde";
  return "viola";
}
const FAMIGLIE = { rosso: "Rossi", rosa: "Rosa", giallo: "Gialli e arancio", bianco: "Bianchi", viola: "Blu e viola" };
function dist(a, b) { const x = hexToRgb(a), y = hexToRgb(b); return (x[0]-y[0])**2 + (x[1]-y[1])**2 + (x[2]-y[2])**2; }
function nearestColor(list, target) { return list.slice().sort((a, b) => dist(a, target) - dist(b, target))[0]; }

function flowerSVG(shape, color, o = {}) {
  const dark = shade(color, -.28), mid = shade(color, -.12), light = shade(color, .25);
  const isYellow = colorFamily(color) === "giallo";
  const center = o.center || (isYellow ? "#5a2e14" : "#ffcf33");
  let g = "";
  const rot = (n, fn) => { let s = ""; for (let i = 0; i < n; i++) s += fn(i * 360 / n, i); return s; };
  switch (shape) {
    case "daisy":
      g += rot(12, a => `<ellipse cx="0" cy="-17" rx="6" ry="14" fill="${mid}" transform="rotate(${a + 15})"/>`);
      g += rot(12, a => `<ellipse cx="0" cy="-16" rx="5.5" ry="13.5" fill="${color}" transform="rotate(${a})"/>`);
      g += `<circle r="9.5" fill="${center}"/><circle r="5" fill="${shade(center, -.25)}" opacity=".5"/>`;
      break;
    case "rose":
      g += `<circle r="25" fill="${dark}"/>`;
      g += rot(5, a => { const r = a * Math.PI / 180; return `<circle cx="${(Math.cos(r) * 13).toFixed(1)}" cy="${(Math.sin(r) * 13).toFixed(1)}" r="13" fill="${color}"/>`; });
      g += `<circle r="15" fill="${mid}"/><circle r="11" fill="${light}"/>`;
      g += `<path d="M-7 3C-9-6 4-10 7-2C9 5 0 8-3 3C-5-1 1-4 3-1" fill="none" stroke="${dark}" stroke-width="2.2" stroke-linecap="round"/>`;
      break;
    case "tulip":
      g += `<path d="M-17 0C-20-23-10-30-5-17L0-30L5-17C10-30 20-23 17 0C15 15-15 15-17 0Z" fill="${color}"/>`;
      g += `<path d="M0-25C-9-10-8 7 0 12C8 7 9-10 0-25Z" fill="${mid}"/>`;
      g += `<path d="M-10 4C-7 10 7 10 10 4" fill="none" stroke="${light}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
      break;
    case "cluster": {
      const pts = [[0,0]]; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; pts.push([Math.cos(a) * 11, Math.sin(a) * 11]); }
      for (let i = 0; i < 9; i++) { const a = i * Math.PI * 2 / 9 + .3; pts.push([Math.cos(a) * 20, Math.sin(a) * 20]); }
      pts.forEach(([x, y], i) => {
        const c = i % 3 === 0 ? mid : i % 3 === 1 ? color : light;
        g += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">` + rot(4, a => `<ellipse cx="0" cy="-3.6" rx="3" ry="4" fill="${c}" transform="rotate(${a + i * 17})"/>`) + `<circle r="1.4" fill="${dark}"/></g>`;
      });
      break;
    }
    case "spike":
      g += `<path d="M0 22V-38" stroke="#2f9e5f" stroke-width="2.4"/>`;
      for (let i = 0; i < 9; i++) {
        const y = 16 - i * 6.2, w = 9 - i * .75, c = i % 2 ? color : mid;
        g += `<ellipse cx="${-w * .55}" cy="${y}" rx="${w * .7}" ry="4.3" fill="${c}" transform="rotate(-20 ${-w * .55} ${y})"/><ellipse cx="${w * .55}" cy="${y - 2}" rx="${w * .7}" ry="4.3" fill="${c}" transform="rotate(20 ${w * .55} ${y - 2})"/>`;
      }
      g += `<ellipse cx="0" cy="-41" rx="3" ry="5" fill="${light}"/>`;
      break;
    case "star":
    default:
      g += rot(6, a => `<path d="M0 0C10-9 8-25 0-31C-8-25-10-9 0 0Z" fill="${color}" transform="rotate(${a})"/>`);
      g += rot(6, a => `<path d="M0 0C5-6 4-14 0-17C-4-14-5-6 0 0Z" fill="${mid}" transform="rotate(${a + 30})"/>`);
      g += rot(5, a => `<path d="M0 0L0-10" stroke="${o.center || "#ffd23f"}" stroke-width="1.6" stroke-linecap="round" transform="rotate(${a})"/>`);
      g += `<circle r="3.5" fill="${o.center || "#ffd23f"}"/>`;
  }
  const pale = hsl(color)[2] > .88;
  return pale ? `<g stroke="#d4c8dc" stroke-width=".8">${g}</g>` : g;
}
function flowerIcon(f, color, cls = "") {
  return `<svg class="${cls}" viewBox="-40 -46 80 80" role="img" aria-label="${esc(f.nome)}"><g>${flowerSVG(f.shape, color || f.colori[0])}</g></svg>`;
}

/* numeri casuali ripetibili */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* bouquet completo: items = [{shape,color}], mode = kraft|carta|box|vetro|ceramica */
function bouquetSVG({ items, mode = "kraft", paper = "#d9b98c", seed = 7, animate = true }) {
  const R = rng(seed), N = items.length;
  const boxed = mode === "box", vase = mode === "vetro" || mode === "ceramica";
  const cx = 200, cy = boxed ? 196 : vase ? 170 : 160, rx = 118, ry = boxed ? 70 : 88;
  const s0 = N < 10 ? 1.3 : N < 15 ? 1.15 : N < 21 ? 1.02 : .92;
  const pts = items.map((it, i) => {
    const r = Math.sqrt((i + .5) / N), t = i * 2.39996 + seed;
    return { ...it, x: cx + r * rx * Math.cos(t) + (R() - .5) * 8, y: cy + r * ry * Math.sin(t) * .95 + (R() - .5) * 8, s: s0 * (.88 + R() * .24), a: (R() - .5) * 50, i };
  }).sort((a, b) => a.y - b.y);
  const D = i => animate ? ` style="--d:${(.25 + i * .07).toFixed(2)}s"` : "";
  const cls = animate ? "bloom" : "", scls = animate ? "stem-draw" : "";
  let back = "", stems = "", leaves = "", flowers = "", front = "", extra = "";
  const gx = cx, gy = boxed ? 300 : vase ? 330 : 330;

  // foglie di contorno
  const nl = Math.max(7, Math.round(N * .6));
  for (let i = 0; i < nl; i++) {
    const side = i % 2 ? 1 : -1, k = Math.floor(i / 2) / Math.max(1, Math.ceil(nl / 2) - 1);
    const t = side < 0 ? Math.PI * (.8 + k * .45) : Math.PI * (2.2 - k * .45) + (R() - .5) * .15;
    const lx = cx + Math.cos(t) * (rx + 6), ly = cy + Math.sin(t) * (ry + 4) + 18;
    const ang = (t * 180 / Math.PI) + 90 + (R() - .5) * 20;
    const col = ["#2f9e5f", "#237a48", "#4bb878", "#6fa888"][i % 4];
    leaves += `<g transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)}) rotate(${ang.toFixed(0)})"><g class="${cls}"${D(i * .6)}><path d="M0 0C9-14 9-32 0-48C-9-32-9-14 0 0Z" fill="${col}"/><path d="M0-4V-42" stroke="#1d5e38" stroke-width="1.2" opacity=".5"/></g></g>`;
  }
  // nuvolette di velo da sposa
  for (let i = 0; i < Math.round(N * .9); i++) {
    const r = Math.sqrt(R()), t = R() * Math.PI * 2;
    extra += `<circle class="${cls}"${D(N * .5 + i * .2)} cx="${(cx + Math.cos(t) * r * (rx + 10)).toFixed(1)}" cy="${(cy + Math.sin(t) * r * (ry + 6)).toFixed(1)}" r="${(2 + R() * 2).toFixed(1)}" fill="#fff" stroke="#e6e0ea" stroke-width=".6"/>`;
  }
  // gambi
  if (!boxed) pts.forEach((p, i) => {
    const ex = gx + ((p.i % 7) - 3) * 3.2, ey = mode === "ceramica" ? 400 : 445;
    stems += `<path class="${scls}"${D(i * .05)} d="M${p.x.toFixed(1)} ${p.y.toFixed(1)}Q${((p.x + gx) / 2 + (R() - .5) * 20).toFixed(1)} ${((p.y + gy) / 2).toFixed(1)} ${ex.toFixed(1)} ${ey}" fill="none" stroke="#3a8f55" stroke-width="3" stroke-linecap="round"/>`;
  });
  // fiori
  pts.forEach((p, i) => {
    flowers += `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)}) scale(${p.s.toFixed(2)})"><g class="${cls}"${D(i + 3)}>${flowerSVG(p.shape, p.color)}</g></g>`;
  });

  // confezioni
  if (mode === "kraft" || mode === "carta") {
    const p1 = paper, p2 = shade(paper, -.12), p3 = shade(paper, .35);
    back = `<path d="M62 190L200 440L338 190Q200 250 62 190Z" fill="${p3}"/>`;
    front = `<path d="M96 262Q200 300 304 262L226 440H174Z" fill="${p1}"/><path d="M96 262L174 440H150Z" fill="${p2}"/><path d="M304 262L226 440H250Z" fill="${p2}"/><path d="M130 280L185 430M270 280L215 430" stroke="${p2}" stroke-width="1.5" opacity=".6"/>`;
    front += `<g transform="translate(200 352)"><ellipse cx="-22" cy="-4" rx="22" ry="11" fill="none" stroke="var(--s2, #c7254e)" stroke-width="6" transform="rotate(-18)"/><ellipse cx="22" cy="-4" rx="22" ry="11" fill="none" stroke="var(--s2, #c7254e)" stroke-width="6" transform="rotate(18)"/><path d="M-4 4L-18 38M4 4L16 40" stroke="var(--s2, #c7254e)" stroke-width="6" stroke-linecap="round"/><circle r="8" fill="var(--s2, #c7254e)"/></g>`;
  } else if (boxed) {
    back = `<ellipse cx="200" cy="262" rx="128" ry="30" fill="#6b4a3a"/>`;
    front = `<path d="M72 262V408A128 30 0 0 0 328 408V262A128 30 0 0 1 72 262Z" fill="${paper}"/><path d="M72 300A128 30 0 0 0 328 300V316A128 30 0 0 1 72 316Z" fill="var(--s2, #c7254e)"/><path d="M72 262A128 30 0 0 0 328 262" fill="none" stroke="${shade(paper, .3)}" stroke-width="3"/>`;
    front += `<text x="200" y="378" text-anchor="middle" font-family="Caveat, cursive" font-size="30" fill="${shade(paper, -.55)}">Fiori di Anna</text>`;
  } else if (mode === "vetro") {
    front = `<path d="M128 272H272L262 440H138Z" fill="#bfe6ff" opacity=".35" stroke="#8fc6e6" stroke-width="3"/><path d="M134 330H266L262 440H138Z" fill="#8fd0f5" opacity=".35"/><path d="M146 285L150 425" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
  } else if (mode === "ceramica") {
    front = `<path d="M130 262C110 300 110 360 140 410H260C290 360 290 300 270 262Z" fill="${paper}"/><path d="M120 330C160 344 240 344 280 330" stroke="#fff" stroke-width="7" opacity=".55" fill="none"/><ellipse cx="200" cy="262" rx="72" ry="12" fill="${shade(paper, -.3)}"/><path d="M150 300C146 330 150 360 160 385" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".45" fill="none"/>`;
  }
  return `<svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anteprima del mazzo">${back}${stems}${leaves}${extra}${flowers}${front}</svg>`;
}

/* =========================================================
   LAYOUT CONDIVISO: header, footer, barra rapida, cestino
   ========================================================= */
const NAV = [
  ["index.html", "Home", "home"],
  ["fiori.html", "Fiori di stagione", "fiori"],
  ["composizioni.html", "Composizioni", "composizioni"],
  ["piante.html", "Piante e vasi", "piante"],
  ["eventi.html", "Eventi", "eventi"],
  ["contatti.html", "Contatti", "contatti"]
];
const logoSVG = `<svg viewBox="-34 -38 68 68" aria-hidden="true">${flowerSVG("daisy", "#3e5bff", { center: "#2b1633" })}</svg>`;
const waLink = t => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(t)}`;
const mailLink = (s, b) => `mailto:${SHOP.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`;

function layout() {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip" href="#main">Vai al contenuto</a>
    <div class="wrap header-inner">
      <a class="logo" href="index.html" aria-label="Fiori di Anna, torna alla home">${logoSVG}<span>Fiori di Anna<small>fioreria a Nogara</small></span></a>
      <nav class="nav" id="nav" aria-label="Menu principale">
        ${NAV.map(([h, t, p]) => `<a href="${h}"${p === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
      </nav>
      <div class="header-actions">
        <span class="open-pill" data-open><i></i><span>…</span></span>
        <button class="basket-btn" type="button" data-basket-open aria-label="Apri la tua richiesta">${I.basket}<b data-basket-count></b></button>
        <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Apri il menu">${I.menu}</button>
      </div>
    </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <a class="logo" href="index.html" style="color:#fff">${logoSVG}<span>Fiori di Anna<small style="color:#cdb9d6">fioreria a Nogara</small></span></a>
          <p class="small" style="margin-top:1rem">Fiori freschi ogni settimana dal mercato, composizioni fatte a mano e piante scelte per durare. Consegniamo a Nogara e nei paesi vicini.</p>
        </div>
        <div><h3>Negozio</h3><ul>${NAV.slice(1).map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
        <div><h3>Contatti</h3><ul>
          <li><a href="tel:${SHOP.telLink}">${SHOP.telefono}</a></li>
          <li><a href="${waLink("Ciao Fiori di Anna! ")}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${SHOP.email}">${SHOP.email}</a></li>
          <li><a href="${SHOP.mappaLink}" target="_blank" rel="noopener">${SHOP.indirizzo}</a></li>
        </ul></div>
        <div><h3>Informazioni</h3><ul>
          <li><a href="privacy.html">Privacy policy</a></li>
          <li><a href="cookie.html">Cookie policy</a></li>
          <li><a href="note-legali.html">Note legali</a></li>
          <li><button type="button" data-cookie-open style="background:none;border:0;color:#fff;padding:0;cursor:pointer;font:inherit">Preferenze cookie</button></li>
        </ul></div>
      </div>
      <div class="foot-big" aria-hidden="true">Fiori di Anna</div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} Fiori di Anna di <span data-owner>Nome Cognome</span>, P.IVA 00000000000</span>
        <span class="season-switch" aria-label="Anteprima dei colori di stagione">
          Anteprima stagioni:
          ${[["primavera", 4], ["estate", 7], ["autunno", 10], ["inverno", 1]].map(([s, m]) => `<button type="button" data-demo="${m}" aria-pressed="${SEASON === s}">${s}</button>`).join("")}
          ${demoMonth ? `<button type="button" data-demo="0">torna a oggi</button>` : ""}
        </span>
        <span>Sito realizzato da <a href="https://www.studiomenny.it/" target="_blank" rel="noopener">Studio Menny</a></span>
      </div>
    </div>`;
  document.body.append(footer);

  const quick = document.createElement("nav");
  quick.className = "quickbar";
  quick.setAttribute("aria-label", "Contatti rapidi");
  quick.innerHTML = `<a href="tel:${SHOP.telLink}">${I.phone}Chiama</a><a href="${waLink("Ciao Fiori di Anna! ")}" target="_blank" rel="noopener">${I.wa}WhatsApp</a><a href="${SHOP.mappaLink}" target="_blank" rel="noopener">${I.pin}Mappa</a>`;
  document.body.append(quick);

  const toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.append(toast);

  // menu mobile
  const burger = $(".burger"), nav = $("#nav");
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 10), { passive: true });

  // anteprima stagioni
  $$("[data-demo]").forEach(b => b.addEventListener("click", () => {
    try { b.dataset.demo === "0" ? sessionStorage.removeItem("fd-demo-month") : sessionStorage.setItem("fd-demo-month", b.dataset.demo); } catch {}
    location.reload();
  }));
}

let toastT;
function toast(msg) { const t = $(".toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

/* ---------- aperto / chiuso ---------- */
function toMin(s) { const [h, m] = s.split(":").map(Number); return h * 60 + m; }
function openStatus(now = new Date()) {
  const day = now.getDay(), min = now.getHours() * 60 + now.getMinutes();
  const iso = now.toISOString().slice(0, 10);
  const closedToday = SHOP.chiusureStraordinarie.includes(iso);
  const slots = closedToday ? [] : SHOP.orari[day];
  for (const [a, c] of slots) if (min >= toMin(a) && min < toMin(c)) return { open: true, text: `Aperto, chiude alle ${c}` };
  for (const [a] of slots) if (min < toMin(a)) return { open: false, text: `Chiuso, apre alle ${a}` };
  for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (SHOP.orari[d].length) return { open: false, text: `Chiuso, apre ${i === 1 ? "domani" : GIORNI[d]} alle ${SHOP.orari[d][0][0]}` }; }
  return { open: false, text: "Chiuso" };
}
function paintOpen() {
  const st = openStatus();
  $$("[data-open]").forEach(el => { el.classList.toggle("is-open", st.open); el.classList.toggle("is-closed", !st.open); $("span", el).textContent = st.text; });
}

/* ---------- comparsa allo scorrimento ---------- */
function reveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

/* =========================================================
   CESTINO = RICHIESTA (non è un acquisto)
   ========================================================= */
const BKEY = "fiordaliso-richiesta";
let basket = store.get(BKEY, []);
function saveBasket() { store.set(BKEY, basket); paintBasket(); }
function addToBasket(item) {
  const ex = basket.find(b => b.key === item.key);
  if (ex) ex.qty += item.qty || 1; else basket.push({ qty: 1, ...item });
  saveBasket(); toast(`Aggiunto alla richiesta: ${item.nome}`);
}
function basketText() {
  const f = $("#basket-form");
  const d = f ? Object.fromEntries(new FormData(f)) : {};
  let t = `Ciao Fiori di Anna, vorrei chiedere la disponibilità di:\n\n`;
  basket.forEach(b => { t += `• ${b.qty} × ${b.nome}${b.dettagli ? ` (${b.dettagli})` : ""}${b.prezzo ? `, circa ${euro(b.prezzo * b.qty)}` : ""}\n`; });
  const tot = basket.reduce((s, b) => s + (b.prezzo || 0) * b.qty, 0);
  if (tot) t += `\nTotale indicativo: circa ${euro(tot)}\n`;
  if (d.nome) t += `\nNome: ${d.nome}`;
  if (d.quando) t += `\nPer il giorno: ${new Date(d.quando).toLocaleDateString("it-IT")}`;
  if (d.come) t += `\n${d.come}`;
  if (d.note) t += `\nNote: ${d.note}`;
  return t;
}
function drawer() {
  const el = document.createElement("aside");
  el.className = "drawer"; el.id = "drawer"; el.setAttribute("aria-label", "La tua richiesta"); el.setAttribute("aria-hidden", "true");
  el.innerHTML = `
    <header><h2>La tua richiesta</h2><button class="x" type="button" data-basket-close aria-label="Chiudi">✕</button></header>
    <div class="drawer-body">
      <div class="note-box">Non è un acquisto online. Ci mandi la lista, noi controlliamo la disponibilità e ti rispondiamo con il prezzo esatto. Paghi in negozio o alla consegna.</div>
      <div data-basket-list></div>
      <form id="basket-form" class="form-grid" style="margin-top:1rem" onsubmit="return false">
        <div class="full"><label for="b-nome">Il tuo nome</label><input id="b-nome" name="nome" type="text" autocomplete="name"></div>
        <div><label for="b-quando">Per quando</label><input id="b-quando" name="quando" type="date"></div>
        <div><label for="b-come">Ritiro o consegna</label><select id="b-come" name="come" class="field"><option>Ritiro in negozio</option><option>Consegna a domicilio</option></select></div>
        <div class="full"><label for="b-note">Note</label><textarea id="b-note" name="note" rows="2" placeholder="Indirizzo di consegna, colori preferiti…"></textarea></div>
      </form>
    </div>
    <div class="drawer-foot">
      <p style="display:flex;justify-content:space-between;font-weight:750;margin-bottom:.8rem"><span>Totale indicativo</span><span data-basket-total>0 €</span></p>
      <div class="btn-row">
        <button class="btn btn-wa" type="button" data-send="wa" style="flex:1">${I.wa}Invia su WhatsApp</button>
        <button class="btn btn-light" type="button" data-send="mail" style="flex:1">${I.mail}Invia per email</button>
      </div>
    </div>`;
  const bg = document.createElement("div"); bg.className = "drawer-bg";
  document.body.append(el, bg);
  const open = () => { el.classList.add("open"); bg.classList.add("show"); el.setAttribute("aria-hidden", "false"); $(".x", el).focus(); };
  const close = () => { el.classList.remove("open"); bg.classList.remove("show"); el.setAttribute("aria-hidden", "true"); };
  document.addEventListener("click", e => {
    if (e.target.closest("[data-basket-open]")) open();
    if (e.target.closest("[data-basket-close]") || e.target === bg) close();
    const q = e.target.closest("[data-q]");
    if (q) { const it = basket[q.dataset.i]; it.qty += Number(q.dataset.q); if (it.qty < 1) basket.splice(q.dataset.i, 1); saveBasket(); }
    const s = e.target.closest("[data-send]");
    if (s) {
      if (!basket.length) return toast("La richiesta è vuota: aggiungi qualcosa dal sito");
      const t = basketText();
      if (s.dataset.send === "wa") window.open(waLink(t), "_blank", "noopener");
      else location.href = mailLink("Richiesta disponibilità dal sito", t);
    }
  });
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  paintBasket();
}
function paintBasket() {
  const n = basket.reduce((s, b) => s + b.qty, 0);
  $$("[data-basket-count]").forEach(b => b.textContent = n || "");
  const list = $("[data-basket-list]"); if (!list) return;
  list.innerHTML = basket.length ? basket.map((b, i) => `
    <div class="bitem"><b>${esc(b.nome)}</b>
      <small>${b.dettagli ? esc(b.dettagli) + "<br>" : ""}${b.prezzo ? "circa " + euro(b.prezzo * b.qty) : "prezzo su richiesta"}</small>
      <div class="qty"><button type="button" data-q="-1" data-i="${i}" aria-label="Togli uno">−</button><span>${b.qty}</span><button type="button" data-q="1" data-i="${i}" aria-label="Aggiungi uno">+</button></div>
    </div>`).join("") : `<div class="empty">Ancora niente qui. Aggiungi fiori, piante o il mazzo che hai composto.</div>`;
  $("[data-basket-total]").textContent = euro(basket.reduce((s, b) => s + (b.prezzo || 0) * b.qty, 0));
}

/* =========================================================
   COOKIE: solo tecnici + contenuti esterni facoltativi (mappa)
   ========================================================= */
const CKEY = "fiordaliso-consenso";
function consent() { return store.get(CKEY, null); }
function cookieBanner() {
  const el = document.createElement("div");
  el.className = "cookie"; el.setAttribute("role", "dialog"); el.setAttribute("aria-labelledby", "ck-t");
  el.innerHTML = `
    <h2 id="ck-t">Cookie, pochi e chiari</h2>
    <p>Usiamo solo strumenti tecnici che servono al sito (per esempio per ricordare la tua richiesta). La mappa di Google si carica solo se ci dai il permesso. Niente profilazione, niente pubblicità. <a href="cookie.html">Leggi la cookie policy</a>.</p>
    <div class="prefs">
      <label><input type="checkbox" checked disabled> <span><b>Tecnici</b>, sempre attivi: fanno funzionare il sito.</span></label>
      <label><input type="checkbox" id="ck-ext"> <span><b>Contenuti esterni</b>: mostra la mappa di Google Maps (Google può impostare i propri cookie).</span></label>
    </div>
    <div class="btn-row">
      <button class="btn btn-sm" type="button" data-ck="all">Accetta tutto</button>
      <button class="btn btn-sm btn-ghost" type="button" data-ck="min">Solo necessari</button>
      <button class="btn btn-sm btn-ghost" type="button" data-ck="more">Scegli</button>
    </div>`;
  document.body.append(el);
  const show = () => { const c = consent(); $("#ck-ext").checked = !!(c && c.esterni); el.classList.add("show"); };
  const save = ext => { store.set(CKEY, { esterni: ext, data: new Date().toISOString() }); el.classList.remove("show", "expanded"); mapConsent(); };
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-ck]"); if (!b) return;
    if (b.dataset.ck === "all") save(true);
    if (b.dataset.ck === "min") save(false);
    if (b.dataset.ck === "more") { if (el.classList.contains("expanded")) save($("#ck-ext").checked); else { el.classList.add("expanded"); b.textContent = "Salva le scelte"; } }
  });
  document.addEventListener("click", e => { if (e.target.closest("[data-cookie-open]")) show(); });
  if (!consent()) show();
}
function mapConsent(force) {
  $$("[data-map]").forEach(box => {
    const c = consent();
    if ((c && c.esterni) || force) {
      if (!$("iframe", box)) box.innerHTML = `<iframe title="Mappa: ${esc(SHOP.indirizzo)}" src="${SHOP.mappa}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    } else if (!$("[data-map-load]", box)) {
      box.innerHTML = `<div><p style="margin:0 auto 1rem"><b>${SHOP.indirizzo}</b><br><span class="small muted">La mappa è di Google Maps: si carica solo se lo scegli, perché Google può usare cookie propri.</span></p>
        <div class="btn-row" style="justify-content:center"><button class="btn btn-sm" type="button" data-map-load>Mostra la mappa</button><a class="btn btn-sm btn-light" href="${SHOP.mappaLink}" target="_blank" rel="noopener">Apri in Google Maps</a></div></div>`;
      $("[data-map-load]", box).addEventListener("click", () => mapConsent(true));
    }
  });
}

/* =========================================================
   PAGINE
   ========================================================= */
function occasionList() {
  return [
    ["compleanno", "Compleanno", "auguri", "arcobaleno"],
    ["amore", "Amore", "amore", "romantica"],
    ["grazie", "Grazie", "grazie", "pastello"],
    ["nascita", "Nascita", "nascita", "pastello"],
    ["anniversario", "Anniversario", "anniversario", "romantica"],
    ["scuse", "Scuse", "scuse", "viola"],
    ["senza-motivo", "Senza motivo", "allegria", "solare"]
  ];
}

/* ---------- HOME ---------- */
function initHome() {
  const stage = $("#hero-bouquet");
  const pool = seasonalOnly(MONTH).length >= 3 ? seasonalOnly(MONTH) : inSeason(MONTH);
  let seed = new Date().getDate() + MONTH * 31;
  const draw = animate => {
    const R = rng(seed);
    const items = Array.from({ length: 17 }, (_, i) => { const f = pool[Math.floor(R() * pool.length)]; return { shape: f.shape, color: f.colori[Math.floor(R() * f.colori.length)] }; });
    stage.innerHTML = bouquetSVG({ items, seed, animate });
  };
  draw(true);
  $("#hero-shuffle").addEventListener("click", () => { seed = Math.floor(Math.random() * 1e6); draw(true); });
  const names = pool.slice(0, 3).map(f => f.nome.split(" (")[0].toLowerCase());
  $("#hero-note").textContent = `In bottega a ${MESI[MONTH - 1]}: ${names.join(", ")}`;
  $("#now-strip").innerHTML = `<span class="label">Adesso di stagione</span>` + inSeason(MONTH).slice(0, 9).map(f => `<a class="chip" href="fiori.html#${f.id}" style="--c:${f.colori[0]}"><i></i>${esc(f.nome.split(" (")[0])}</a>`).join("") + `<a class="chip" href="fiori.html" style="--c:var(--ink)"><i></i>Tutti</a>`;

  // fiore del giorno
  const today = new Date(); const doy = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 864e5);
  const f = pool[doy % pool.length];
  $("#fotd").innerHTML = `
    <div class="fotd-art" data-img="f-${f.id}.jpg">${flowerIcon(f)}</div>
    <div><h2>Il fiore di oggi: ${esc(f.nome)}</h2>
      <p class="lead">${esc(f.significato)}</p>
      <div class="btn-row" style="align-items:center"><span class="tag tag-tilt">${euro(f.prezzo)} a stelo</span>
      <a class="btn btn-sm" href="composizioni.html?fiore=${f.id}#configuratore">Mettilo in un mazzo</a></div></div>`;

  // cosa vuoi dire?
  const occ = $("#occasions"), res = $("#occasion-result");
  occ.innerHTML = occasionList().map(([id, t], i) => `<button type="button" class="chip" data-occ="${id}" aria-pressed="${i === 0}" style="--c:${["#ffc300","#e0263f","#ff8fc7","#7fb7ff","#c7254e","#3e5bff","#ff8a1f"][i]}"><i></i>${t}</button>`).join("");
  const pick = id => {
    const o = occasionList().find(x => x[0] === id);
    $$("[data-occ]", occ).forEach(b => b.setAttribute("aria-pressed", b.dataset.occ === id));
    let fl = inSeason(MONTH).filter(f => f.temi.includes(o[2]));
    if (!fl.length) fl = FLOWERS.filter(f => f.temi.includes(o[2]) && f.mesi.length === 12);
    res.innerHTML = fl.slice(0, 6).map(f => `<div class="mini-flower">${flowerIcon(f)}${esc(f.nome.split(" (")[0])}</div>`).join("");
    $("#occasion-go").href = `composizioni.html?occasione=${id}#configuratore`;
  };
  occ.addEventListener("click", e => { const b = e.target.closest("[data-occ]"); if (b) pick(b.dataset.occ); });
  pick("compleanno");

  $("#reviews").innerHTML = RECENSIONI.map(r => `<figure class="review" style="margin:0"><div class="stars" aria-label="${r.voto} stelle su 5">${"★".repeat(r.voto)}</div><blockquote style="margin:.5rem 0"><p>${esc(r.testo)}</p></blockquote><figcaption><b>${esc(r.nome)}</b></figcaption></figure>`).join("");
}

/* ---------- FIORI DI STAGIONE ---------- */
function initFiori() {
  let month = MONTH, fam = "", tema = "";
  const months = $("#months"), bench = $("#bench");
  months.innerHTML = MESI.map((m, i) => `<button type="button" data-m="${i + 1}" class="${i + 1 === MONTH ? "today" : ""}" aria-pressed="${i + 1 === month}">${m[0].toUpperCase() + m.slice(1)}</button>`).join("");
  $("#f-tema").innerHTML = `<option value="">Qualsiasi messaggio</option>` + Object.entries(TEMI).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#f-col").innerHTML = `<option value="">Tutti i colori</option>` + Object.entries(FAMIGLIE).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");

  const paint = () => {
    $$("button", months).forEach(b => b.setAttribute("aria-pressed", Number(b.dataset.m) === month));
    $("#month-title").textContent = `Di stagione a ${MESI[month - 1]}`;
    const prev = month === 1 ? 12 : month - 1, next = month === 12 ? 1 : month + 1;
    let list = inSeason(month);
    if (tema) list = list.filter(f => f.temi.includes(tema));
    if (fam) list = list.filter(f => f.colori.some(c => colorFamily(c) === fam));
    list.sort((a, b) => (a.mesi.length === 12) - (b.mesi.length === 12));
    $("#count").textContent = `${list.length} ${list.length === 1 ? "fiore" : "fiori"}`;
    bench.innerHTML = list.length ? list.map(f => {
      const col = fam ? f.colori.find(c => colorFamily(c) === fam) : f.colori[0];
      let badge = "";
      if (f.mesi.length < 12 && !f.mesi.includes(prev)) badge = `<span class="badge new">Appena arrivato</span>`;
      else if (f.mesi.length < 12 && !f.mesi.includes(next)) badge = `<span class="badge last">Ultime settimane</span>`;
      return `<article class="flower-card reveal in" id="${f.id}">${badge}
        <div class="art" data-img="f-${f.id}.jpg">${flowerIcon(f, col)}</div>
        <h3>${esc(f.nome)}</h3>
        <div class="swatches" aria-label="Colori disponibili">${f.colori.map(c => `<i style="--c:${c}" title="${FAMIGLIE[colorFamily(c)] || ""}"></i>`).join("")}</div>
        <p>${esc(f.significato)}</p>
        <div class="row"><span class="tag">${euro(f.prezzo)} a stelo</span><button class="btn btn-sm btn-light" type="button" data-add-flower="${f.id}">Aggiungi</button></div>
      </article>`;
    }).join("") : `<div class="empty">Nessun fiore con questi filtri a ${MESI[month - 1]}. Prova un altro colore o chiedici: spesso riusciamo a ordinarlo lo stesso.</div>`;
  };
  months.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (b) { month = Number(b.dataset.m); paint(); } });
  $("#f-tema").addEventListener("change", e => { tema = e.target.value; paint(); });
  $("#f-col").addEventListener("change", e => { fam = e.target.value; paint(); });
  bench.addEventListener("click", e => {
    const b = e.target.closest("[data-add-flower]"); if (!b) return;
    const f = FLOWERS.find(x => x.id === b.dataset.addFlower);
    addToBasket({ key: "f-" + f.id, nome: `${f.nome}, steli sfusi`, prezzo: f.prezzo, dettagli: "colore da concordare" });
  });
  paint();
  const cur = months.querySelector(`[data-m="${MONTH}"]`);
  if (cur) months.scrollLeft = cur.offsetLeft - months.offsetLeft - (months.clientWidth - cur.offsetWidth) / 2;
  if (location.hash) setTimeout(() => $(location.hash)?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);

  // calendario
  $("#calendar").innerHTML = `<table><caption class="sr-only">Mesi in cui ogni fiore è disponibile</caption><thead><tr><th scope="col">Fiore</th>${MESI_BREVI.map((m, i) => `<th scope="col" class="${i + 1 === MONTH ? "cur" : ""}">${m}</th>`).join("")}</tr></thead><tbody>
    ${FLOWERS.filter(f => f.mesi.length < 12).sort((a, b) => a.mesi[0] - b.mesi[0]).map(f => `<tr><td>${esc(f.nome.split(" (")[0])}</td>${MESI_BREVI.map((m, i) => { const on = f.mesi.includes(i + 1); const col = hsl(f.colori[0])[2] > .85 ? "#c7b8d3" : f.colori[0]; return `<td class="${on ? "on" : ""} ${i + 1 === MONTH ? "cur" : ""}" style="--c:${col};--t:${hsl(col)[2] > .62 ? "#2b1633" : "#fff"}"><i class="ini" aria-hidden="true">${m[0]}</i>${on ? `<span title="${esc(f.nome)} a ${MESI[i]}"></span><span class="sr-only">disponibile a ${MESI[i]}</span>` : ""}</td>`; }).join("")}</tr>`).join("")}
  </tbody></table>`;
  $("#always").innerHTML = FLOWERS.filter(f => f.mesi.length === 12).map(f => `<span class="chip" style="--c:${hsl(f.colori[0])[2] > .85 ? "#c7b8d3" : f.colori[0]}"><i></i>${esc(f.nome.split(" (")[0])}</span>`).join("");
}

/* ---------- COMPOSIZIONI + CONFIGURATORE ---------- */
function initComposizioni() {
  const FBS = ["#ffb400,#ff5fa2", "#ff5fa2,#b98cff", "#c7254e,#ff8a1f", "#ffd6e5,#ff7aa8", "#ffc53d,#1fb36b", "#3e5bff,#7fd6b0", "#fff4ee,#b98cff", "#9aa7b0,#f4f1f7", "#2f8f83,#ffc53d"];
  $("#price-list").innerHTML = COMPOSIZIONI.map((c, i) => `
    <article class="comp reveal">
      <div class="ph" data-img="${c.img}" style="--fb:linear-gradient(135deg,${FBS[i % FBS.length]})"><span class="tag">da ${euro(c.da)} a ${euro(c.a)}</span></div>
      <h3>${esc(c.nome)}</h3><p>${esc(c.desc)}</p>
      <div class="btn-row"><button class="btn btn-sm" type="button" data-add-comp="${c.id}">Aggiungi alla richiesta</button></div>
    </article>`).join("");
  $("#price-list").addEventListener("click", e => {
    const b = e.target.closest("[data-add-comp]"); if (!b) return;
    const c = COMPOSIZIONI.find(x => x.id === b.dataset.addComp);
    addToBasket({ key: "c-" + c.id, nome: c.nome, prezzo: null, dettagli: `fascia ${euro(c.da)} – ${euro(c.a)}, budget da concordare` });
  });

  // ---- configuratore ----
  const SIZES = [["piccolo", "Piccolo", 7, 22], ["medio", "Medio", 12, 38], ["grande", "Grande", 18, 58], ["wow", "Da lasciare senza parole", 26, 88]];
  const WRAPS = [["kraft", "Carta kraft", 0, "#d9b98c"], ["rosa", "Carta rosa", 3, "#ffb3cf"], ["blu", "Carta blu fiordaliso", 3, "#9fb0ff"], ["salvia", "Carta verde salvia", 3, "#b9dcc2"], ["box", "Scatola cappelliera", 12, "#2b1633"], ["vetro", "Vaso in vetro", 12, "#bfe6ff"], ["ceramica", "Vaso in ceramica", 20, "#ff8a1f"]];
  const EXTRAS = [["cioccolatini", "Cioccolatini", 9], ["candela", "Candela profumata", 14], ["palloncino", "Palloncino", 6]];
  const avail = inSeason(MONTH);
  const radios = (name, arr, fn) => arr.map((a, i) => `<span class="opt"><input type="radio" name="${name}" id="${name}-${a[0]}" value="${a[0]}"${i === (name === "size" ? 1 : 0) ? " checked" : ""}><label for="${name}-${a[0]}">${fn(a)}</label></span>`).join("");

  $("#o-occ").innerHTML = occasionList().map(([id, t]) => `<span class="opt"><input type="radio" name="occ" id="occ-${id}" value="${id}"><label for="occ-${id}">${t}</label></span>`).join("");
  $("#o-size").innerHTML = radios("size", SIZES, a => `${a[1]} <small>${a[2]} fiori</small>`);
  $("#o-pal").innerHTML = radios("pal", PALETTE.map(p => [p.id, p.nome, p.colori]), a => `<span class="dots">${a[2].slice(0, 4).map(c => `<i style="--c:${c}"></i>`).join("")}</span>${a[1]}`);
  $("#o-fl").innerHTML = avail.map(f => `<span class="opt"><input type="checkbox" name="fl" id="fl-${f.id}" value="${f.id}"><label for="fl-${f.id}"><svg viewBox="-40 -46 80 80" width="22" height="22" aria-hidden="true">${flowerSVG(f.shape, f.colori[0])}</svg>${esc(f.nome.split(" (")[0])}</label></span>`).join("");
  $("#o-wrap").innerHTML = radios("wrap", WRAPS, a => `<span class="dots"><i style="--c:${a[3]}"></i></span>${a[1]}${a[2] ? ` <small>+${euro(a[2])}</small>` : ""}`);
  $("#o-extra").innerHTML = EXTRAS.map(e => `<span class="opt"><input type="checkbox" name="ex" id="ex-${e[0]}" value="${e[0]}"><label for="ex-${e[0]}">${e[1]} <small>+${euro(e[2])}</small></label></span>`).join("");
  $("#o-town").innerHTML = `<option value="">Ritiro in negozio (gratis)</option>` + CONSEGNE.map((c, i) => `<option value="${i}">Consegna a ${c.paese}</option>`).join("");

  // stato iniziale: fiori più tipici del mese
  const defaults = seasonalOnly(MONTH).slice(0, 3).map(f => f.id);
  (defaults.length ? defaults : avail.slice(0, 3).map(f => f.id)).forEach(id => { const c = $("#fl-" + id); if (c) c.checked = true; });
  const params = new URLSearchParams(location.search);
  let seed = 11;

  const form = $("#builder-form");
  const applyOccasion = id => {
    const o = occasionList().find(x => x[0] === id); if (!o) return;
    $("#occ-" + id).checked = true;
    $("#pal-" + o[3]).checked = true;
    const match = avail.filter(f => f.temi.includes(o[2])).slice(0, 3);
    if (match.length) { $$("[name=fl]").forEach(c => c.checked = false); match.forEach(f => $("#fl-" + f.id).checked = true); }
  };
  if (params.get("occasione")) applyOccasion(params.get("occasione"));
  if (params.get("fiore")) { const c = $("#fl-" + params.get("fiore")); if (c) { $$("[name=fl]").forEach(x => x.checked = false); c.checked = true; } }

  const cardPrev = $("#card-preview"), cardTxt = $("#card-text");
  const state = () => {
    const d = new FormData(form);
    const size = SIZES.find(s => s[0] === d.get("size"));
    const pal = PALETTE.find(p => p.id === d.get("pal"));
    let fl = d.getAll("fl").map(id => FLOWERS.find(f => f.id === id));
    if (!fl.length) fl = avail.slice(0, 2);
    const wrap = WRAPS.find(w => w[0] === d.get("wrap"));
    const ex = d.getAll("ex").map(id => EXTRAS.find(e => e[0] === id));
    const town = d.get("town") === "" ? null : CONSEGNE[Number(d.get("town"))];
    const occ = occasionList().find(o => o[0] === d.get("occ"));
    return { size, pal, fl, wrap, ex, town, occ, card: cardTxt.value.trim() };
  };
  const price = s => {
    const avg = s.fl.reduce((a, f) => a + f.prezzo, 0) / s.fl.length;
    let p = s.size[3] + Math.max(0, Math.round((avg - 2.5) * s.size[2] * .6));
    p += s.wrap[2] + s.ex.reduce((a, e) => a + e[2], 0) + (s.card ? 2 : 0);
    return p;
  };
  const render = (animate = false) => {
    const s = state();
    // limite 3 fiori protagonisti
    const checked = $$("[name=fl]:checked");
    $$("[name=fl]").forEach(c => c.disabled = !c.checked && checked.length >= 3);
    const items = Array.from({ length: s.size[2] }, (_, i) => {
      const f = s.fl[i % s.fl.length], target = s.pal.colori[(i * 7 + Math.floor(i / s.fl.length)) % s.pal.colori.length];
      return { shape: f.shape, color: nearestColor(f.colori, target) };
    });
    const mode = ["kraft", "rosa", "blu", "salvia"].includes(s.wrap[0]) ? (s.wrap[0] === "kraft" ? "kraft" : "carta") : s.wrap[0];
    const paperCol = s.wrap[0] === "box" ? "#fff6ee" : s.wrap[0] === "ceramica" ? s.pal.colori[0] === "#ffffff" ? "#2f8f83" : shade(s.pal.colori[0], -.1) : s.wrap[3];
    $("#builder-svg").innerHTML = bouquetSVG({ items, mode, paper: paperCol, seed, animate });
    const p = price(s);
    let del = "";
    if (s.town) del = p >= s.town.gratisDa ? `consegna a ${s.town.paese} gratuita` : `+ ${euro(s.town.costo)} consegna a ${s.town.paese}`;
    const lo = Math.floor(p * .95 / 5) * 5, hi = Math.ceil(p * 1.08 / 5) * 5;
    $("#b-price").innerHTML = `circa ${lo}–${hi} €<small>${del || "ritiro in negozio"}</small>`;
    cardPrev.textContent = s.card || "Scrivi qui sopra il tuo messaggio: lo scriviamo a mano sul biglietto.";
    cardPrev.style.opacity = s.card ? 1 : .55;
    return { s, lo, hi, del };
  };
  form.addEventListener("change", e => { if (e.target.name === "occ") applyOccasion(e.target.value); render(e.target.name === "size" || e.target.name === "fl" || e.target.name === "occ"); });
  cardTxt.addEventListener("input", () => render());
  $("#b-shuffle").addEventListener("click", () => { seed = Math.floor(Math.random() * 1e5); render(true); });
  $("#b-surprise").addEventListener("click", () => {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    $("#pal-" + pick(PALETTE).id).checked = true;
    $("#size-" + pick(SIZES)[0]).checked = true;
    $("#wrap-" + pick(WRAPS)[0]).checked = true;
    $$("[name=fl]").forEach(c => c.checked = false);
    avail.slice().sort(() => Math.random() - .5).slice(0, 1 + Math.floor(Math.random() * 3)).forEach(f => $("#fl-" + f.id).checked = true);
    seed = Math.floor(Math.random() * 1e5); render(true);
    $("#builder-stage").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  const summary = r => {
    const s = r.s;
    return `${s.size[1]} (${s.size[2]} fiori), palette ${s.pal.nome.toLowerCase()}, con ${s.fl.map(f => f.nome.split(" (")[0].toLowerCase()).join(", ")}; ${s.wrap[1].toLowerCase()}${s.ex.length ? "; extra: " + s.ex.map(e => e[1].toLowerCase()).join(", ") : ""}${s.card ? `; biglietto: "${s.card}"` : ""}${s.occ ? `; occasione: ${s.occ[1].toLowerCase()}` : ""}`;
  };
  $("#b-add").addEventListener("click", () => { const r = render(); addToBasket({ key: "mazzo-" + Date.now(), nome: "Mazzo composto sul sito", prezzo: r.hi, dettagli: summary(r) + (r.s.town ? `; ${r.del}` : "") }); });
  $("#b-wa").addEventListener("click", () => { const r = render(); window.open(waLink(`Ciao Fiori di Anna! Ho composto questo mazzo sul sito:\n\n${summary(r)}\n\nPrezzo indicativo: ${r.lo}–${r.hi} €${r.s.town ? `\n${r.del}` : ""}\n\nÈ disponibile?`), "_blank", "noopener"); });
  render(true);
}

/* ---------- PIANTE ---------- */
function initPiante() {
  const LUCE = ["", "Poca luce", "Luce media", "Tanta luce"], CURA = ["", "Facilissima", "Qualche attenzione", "Per esperti"];
  const leaf = `<svg class="leaf-fb" viewBox="0 0 100 120" aria-hidden="true"><path d="M50 118C50 80 50 60 50 40" stroke="#1f7a4d" stroke-width="4"/><path d="M50 60C20 55 5 30 12 5C40 10 55 35 50 60Z" fill="#1f7a4d"/><path d="M50 75C80 70 95 45 88 20C60 25 45 50 50 75Z" fill="#2f9e5f"/></svg>`;
  let scores = null, tipo = "";
  const paint = () => {
    let list = PIANTE.map(p => ({ ...p, score: scores ? scores(p) : null }));
    if (tipo) list = list.filter(p => p.tipo === tipo);
    if (scores) list.sort((a, b) => b.score - a.score);
    $("#plants").innerHTML = list.map(p => `
      <article class="plant ${scores && p.score < 50 ? "dim" : ""}">
        <div class="ph" data-img="${p.img}">${leaf}<span class="tag">${euro(p.prezzo)}</span>${scores ? `<span class="match">${p.score}% adatta a te</span>` : ""}</div>
        <h3>${esc(p.nome)}</h3>
        <div class="meta"><span class="pill">${p.tipo === "interno" ? "Da casa" : "Da esterno"}</span><span class="pill">${LUCE[p.luce]}</span><span class="pill">${CURA[p.cura]}</span>${p.pet ? `<span class="pill">Sicura con cani e gatti</span>` : `<span class="pill warn">Tossica per animali</span>`}</div>
        <p class="muted small">${esc(p.nota)}</p>
        <button class="btn btn-sm btn-light" type="button" data-add-plant="${p.id}">Aggiungi alla richiesta</button>
      </article>`).join("");
  };
  $("#quiz").addEventListener("change", () => {
    const d = Object.fromEntries(new FormData($("#quiz")));
    if (Object.keys(d).length < 4) { $("#quiz-msg").textContent = `Rispondi ancora a ${4 - Object.keys(d).length} ${4 - Object.keys(d).length === 1 ? "domanda" : "domande"}.`; return; }
    scores = p => {
      let s = 100;
      s -= Math.abs(p.luce - Number(d.luce)) * 22;
      if (p.cura > Number(d.cura)) s -= (p.cura - Number(d.cura)) * 25;
      if (d.animali === "si" && !p.pet) s -= 60;
      if (p.tipo !== d.dove) s -= 45;
      return Math.max(0, Math.min(100, s));
    };
    const best = PIANTE.slice().sort((a, b) => scores(b) - scores(a))[0];
    $("#quiz-msg").innerHTML = `La più adatta a te: <b>${esc(best.nome)}</b>. Le piante sotto sono ordinate dalla più alla meno adatta.`;
    tipo = ""; $$("[data-tipo]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tipo === ""));
    paint();
  });
  $("#tipo").addEventListener("click", e => { const b = e.target.closest("[data-tipo]"); if (!b) return; tipo = b.dataset.tipo; $$("[data-tipo]").forEach(x => x.setAttribute("aria-pressed", x === b)); paint(); });
  $("#plants").addEventListener("click", e => { const b = e.target.closest("[data-add-plant]"); if (!b) return; const p = PIANTE.find(x => x.id === b.dataset.addPlant); addToBasket({ key: "p-" + p.id, nome: p.nome, prezzo: p.prezzo }); });
  paint();

  $("#vases").innerHTML = VASI.map(v => `
    <article class="vase"><div class="ph" data-img="${v.img}" style="--vc:${v.colore}"></div>
      <h3>${esc(v.nome)}</h3>
      <div class="row"><span class="tag">${euro(v.prezzo)}</span><button class="btn btn-sm btn-light" type="button" data-add-vase="${v.id}" aria-label="Aggiungi ${esc(v.nome)} alla richiesta">+</button></div>
    </article>`).join("");
  $("#vases").addEventListener("click", e => { const b = e.target.closest("[data-add-vase]"); if (!b) return; const v = VASI.find(x => x.id === b.dataset.addVase); addToBasket({ key: "v-" + v.id, nome: v.nome, prezzo: v.prezzo }); });

  // dottore delle piante
  const list = $("#doctor-list"), ans = $("#doctor-answer");
  list.innerHTML = SINTOMI.map((s, i) => `<button type="button" data-s="${s.id}" aria-pressed="${i === 0}">${esc(s.nome)}</button>`).join("");
  const show = id => {
    const s = SINTOMI.find(x => x.id === id);
    $$("button", list).forEach(b => b.setAttribute("aria-pressed", b.dataset.s === id));
    ans.innerHTML = `<h3>${esc(s.nome)}</h3><p><b>Perché succede.</b> ${esc(s.causa)}</p><p><b>Cosa fare.</b> ${esc(s.rimedio)}</p>
      <p class="small muted">Non migliora? Mandaci una foto su WhatsApp: guardiamo noi.</p>
      <a class="btn btn-wa btn-sm" href="${waLink(`Ciao Fiori di Anna, la mia pianta ha questo problema: ${s.nome.toLowerCase()}. Vi mando una foto.`)}" target="_blank" rel="noopener">${I.wa}Manda una foto</a>`;
  };
  list.addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) show(b.dataset.s); });
  show(SINTOMI[0].id);
}

/* ---------- EVENTI ---------- */
function initEventi() {
  const moods = [
    ["Romantico", ["#ffd6e5", "#ff7aa8", "#fff4ee", "#b3264c"]],
    ["Campestre", ["#ffe14d", "#ffffff", "#8f6bff", "#9fcf8f"]],
    ["Elegante bianco", ["#ffffff", "#f2efe9", "#dfe8e0", "#9aa7b0"]],
    ["Tramonto sul lago", ["#ff8a1f", "#ff5a36", "#ffc53d", "#c7254e"]],
    ["Blu fiordaliso", ["#3e5bff", "#9fb0ff", "#ffffff", "#2b1633"]]
  ];
  const mb = $("#moodboard");
  mb.innerHTML = moods.map((m, i) => `<button type="button" class="mood" data-mood="${i}" aria-pressed="${i === 0}"><span class="bar">${m[1].map(c => `<i style="--c:${c}"></i>`).join("")}</span><span>${m[0]}</span></button>`).join("");
  const wm = $("#wed-month");
  wm.innerHTML = MESI.map((m, i) => `<option value="${i + 1}"${i === 5 ? " selected" : ""}>${m[0].toUpperCase() + m.slice(1)}</option>`).join("");
  let mood = 0;
  const paint = () => {
    const m = Number(wm.value), cols = moods[mood][1];
    const fl = inSeason(m).map(f => ({ f, c: nearestColor(f.colori, cols[0]), d: Math.min(...cols.map(c => dist(nearestColor(f.colori, c), c))) })).sort((a, b) => a.d - b.d).slice(0, 6);
    $("#wed-result").innerHTML = fl.map(({ f }) => { const c = f.colori.slice().sort((a, b) => Math.min(...cols.map(x => dist(a, x))) - Math.min(...cols.map(x => dist(b, x))))[0]; return `<div class="mini-flower">${flowerIcon(f, c)}${esc(f.nome.split(" (")[0])}</div>`; }).join("");
    $("#wed-go").href = waLink(`Ciao Fiori di Anna! Ci sposiamo a ${MESI[m - 1]} e ci piace lo stile "${moods[mood][0]}". Possiamo fissare un appuntamento per parlarne?`);
  };
  mb.addEventListener("click", e => { const b = e.target.closest("[data-mood]"); if (!b) return; mood = Number(b.dataset.mood); $$(".mood", mb).forEach(x => x.setAttribute("aria-pressed", x === b)); paint(); });
  wm.addEventListener("change", paint);
  paint();

  // abbonamento aziende
  const f = $("#sub-form");
  const calc = () => {
    const d = Object.fromEntries(new FormData(f));
    const per = { piccola: 25, media: 40, grande: 60 }[d.misura] * Number(d.quante);
    const volte = d.frequenza === "settimanale" ? 4.33 : 2.17;
    const mese = Math.round(per * volte * (d.frequenza === "settimanale" ? .9 : 1));
    $("#sub-result").innerHTML = `Circa <b>${euro(mese)} al mese</b> (${euro(per)} a consegna${d.frequenza === "settimanale" ? ", già scontato del 10%" : ""}).`;
    $("#sub-go").href = waLink(`Ciao Fiori di Anna, vorrei un preventivo per fiori in abbonamento: ${d.quante} composizioni ${d.misura}, consegna ${d.frequenza}. Stima dal sito: circa ${euro(mese)} al mese.`);
  };
  f.addEventListener("change", calc); calc();
}

/* ---------- CONTATTI ---------- */
function initContatti() {
  // orari
  const today = new Date().getDay();
  $("#hours").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<tr class="${d === today ? "today" : ""}"><td>${GIORNI[d][0].toUpperCase() + GIORNI[d].slice(1)}</td><td>${SHOP.orari[d].length ? SHOP.orari[d].map(s => s.join("–")).join(", ") : "Chiuso"}</td></tr>`).join("");

  // consegne
  $("#d-town").innerHTML = CONSEGNE.map((c, i) => `<option value="${i}">${c.paese}</option>`).join("") + `<option value="altro">Un altro paese</option>`;
  const calc = () => {
    const v = $("#d-town").value, amt = Number($("#d-amount").value) || 0;
    const now = new Date(), open = SHOP.orari[now.getDay()].length > 0, early = now.getHours() < 12;
    const when = open && early ? "Se ordini ora, possiamo consegnare già oggi pomeriggio." : "Consegna dal prossimo giorno di apertura (per urgenze chiamaci).";
    if (v === "altro") { $("#d-result").innerHTML = `Consegniamo anche più lontano: scrivici il paese e ti diciamo il costo.`; return; }
    const c = CONSEGNE[v];
    $("#d-result").innerHTML = amt >= c.gratisDa ? `Consegna a ${c.paese} <b>gratuita</b>. ${when}` : `Consegna a ${c.paese}: <b>${euro(c.costo)}</b>. Gratis per ordini da ${euro(c.gratisDa)}. ${when}`;
  };
  $("#d-town").addEventListener("change", calc); $("#d-amount").addEventListener("input", calc); calc();

  // messaggio
  const mf = $("#msg-form");
  mf.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(mf));
    if (!d.privacy) return toast("Per inviare devi accettare l'informativa privacy");
    if (!d.nome || !d.messaggio) return toast("Scrivi il tuo nome e il messaggio");
    const t = `${d.messaggio}\n\n${d.nome}${d.telefono ? "\nTel. " + d.telefono : ""}`;
    if (e.submitter && e.submitter.value === "wa") window.open(waLink(t), "_blank", "noopener");
    else location.href = mailLink(`Messaggio dal sito: ${d.argomento}`, t);
  });

  // promemoria date importanti
  const rf = $("#rem-form");
  const pad = n => String(n).padStart(2, "0");
  const next = dStr => { const [y, m, d] = dStr.split("-").map(Number); const now = new Date(); let dt = new Date(now.getFullYear(), m - 1, d); if (dt < new Date(now.getFullYear(), now.getMonth(), now.getDate())) dt = new Date(now.getFullYear() + 1, m - 1, d); return dt; };
  const ymd = dt => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
  rf.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(rf));
    if (!d.chi || !d.data) return toast("Scrivi per chi è e la data");
    const dt = next(d.data), end = new Date(dt); end.setDate(end.getDate() + 1);
    const title = `${d.occasione} di ${d.chi}`;
    const desc = `Promemoria di Fiori di Anna: ordina i fiori per tempo. Tel. ${SHOP.telefono}, WhatsApp wa.me/${SHOP.whatsapp}`;
    if (e.submitter && e.submitter.value === "google") {
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${ymd(dt)}/${ymd(end)}&recur=${encodeURIComponent("RRULE:FREQ=YEARLY")}&details=${encodeURIComponent(desc)}`, "_blank", "noopener");
      return;
    }
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Fiori di Anna//Promemoria//IT", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:${Date.now()}@fiordaliso`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(dt)}`, `DTEND;VALUE=DATE:${ymd(end)}`, "RRULE:FREQ=YEARLY",
      `SUMMARY:${title.replace(/[,;]/g, " ")}`, `DESCRIPTION:${desc.replace(/[,;]/g, " ")}`,
      "BEGIN:VALARM", "TRIGGER:-P3D", "ACTION:DISPLAY", `DESCRIPTION:Tra 3 giorni: ${title.replace(/[,;]/g, " ")}. Ordina i fiori da Fiori di Anna`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `promemoria-${d.chi.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
    document.body.append(a); a.click(); a.remove();
    toast("Promemoria scaricato: aprilo per aggiungerlo al calendario");
  });
}

/* tabelle legali: etichette per la vista a schede sul telefono */
$$(".legal table").forEach(t => {
  const heads = $$("tr:first-child th", t).map(th => th.textContent);
  $$("tr", t).slice(1).forEach(tr => $$("td", tr).forEach((td, i) => td.dataset.label = heads[i] || ""));
});

/* foto: percorso assoluto, così funziona da qualsiasi foglio di stile */
function setImgs() {
  $$("[data-img]").forEach(el => { if (el.dataset.imgDone) return; const src = new URL("img/" + el.dataset.img, location.href).href; el.dataset.imgDone = 1;
    const im = new Image(); im.onload = () => { el.style.setProperty("--img", `url("${src}")`); el.classList.add("has-img"); }; im.src = src; });
}
new MutationObserver(setImgs).observe(document.body, { childList: true, subtree: true });

/* ---------- avvio ---------- */
layout();
drawer();
cookieBanner();
paintOpen(); setInterval(paintOpen, 60000);
({ home: initHome, fiori: initFiori, composizioni: initComposizioni, piante: initPiante, eventi: initEventi, contatti: initContatti }[page] || (() => {}))();
setImgs();
mapConsent();
reveal();
if (demoMonth) toast(`Anteprima: il sito come apparirebbe a ${MESI[demoMonth - 1]}`);
})();
