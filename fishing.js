/* =========================================================
   fishing.js - つりの しかけ
   ・せいかい(⭕)する たびに 1ぴき つる
   ・つれる さかなは その 回(さいだい 10もん)の ここまでの せいかいりつ で きまる
     (まちがえずに つづけるほど おおもの。かずを かさねる だけでは おおきく ならない)
   ・つった さかなは ずかんに のこる
   ========================================================= */

/* せいかいりつ で ランクが きまる。acc = この りつ いじょう、minN = この もんだいすう いじょうの 回で ないと でない
   (2もんだけ やって 100% で でんせつ、を ふせぐ) */
const FISH_TIERS = [
  { acc: 0,    minN: 1,  name: "こざかな",   ic: "🐟", color: "#5c7cfa" },
  { acc: 0.4,  minN: 1,  name: "ちゅうもの", ic: "🐠", color: "#20a4a4" },
  { acc: 0.6,  minN: 3,  name: "いいサイズ", ic: "🎣", color: "#2f9e44" },
  { acc: 0.75, minN: 5,  name: "おおもの",   ic: "💪", color: "#e8590c" },
  { acc: 0.9,  minN: 7,  name: "かいぶつ",   ic: "🔥", color: "#c92a2a" },
  { acc: 1,    minN: 10, name: "でんせつ",   ic: "👑", color: "#b8860b" },
];
const ROUND_MAX = 10;   // 1かいの もんだいすう

/* h = からだの たかさ、pat = もよう、shape = かたち */
const FISH = [
  // こざかな
  { id: "haze",    name: "ハゼ",         tier: 0, min: 8,  max: 15,  back: "#9c7f58", belly: "#efe4cc", fin: "#7d6444", h: 9,  pat: "spots" },
  { id: "iwashi",  name: "イワシ",       tier: 0, min: 10, max: 18,  back: "#35577f", belly: "#eef3f7", fin: "#8fa6bd", h: 9,  pat: "dots" },
  { id: "mameaji", name: "まめアジ",     tier: 0, min: 6,  max: 12,  back: "#5f8798", belly: "#f1f4ef", fin: "#d9c46a", h: 11 },
  { id: "kisu",    name: "キス",         tier: 0, min: 12, max: 22,  back: "#dcc79a", belly: "#fbf7ec", fin: "#e9dcb8", h: 8 },
  { id: "tanago",  name: "ウミタナゴ",   tier: 0, min: 12, max: 22,  back: "#a3876b", belly: "#e9dccd", fin: "#8a6f55", h: 15 },
  { id: "suzume",  name: "スズメダイ",   tier: 0, min: 8,  max: 14,  back: "#3b5bdb", belly: "#91a7ff", fin: "#364fc7", h: 15 },
  { id: "bera",    name: "キュウセン",   tier: 0, min: 12, max: 24,  back: "#5c940d", belly: "#ffd8a8", fin: "#e8590c", h: 9,  pat: "hstripes" },
  { id: "nenbutsu",name: "ネンブツダイ", tier: 0, min: 6,  max: 11,  back: "#f08c00", belly: "#ffe8cc", fin: "#e67700", h: 14, pat: "line" },
  // ちゅうもの
  { id: "aji",     name: "アジ",         tier: 1, min: 18, max: 32,  back: "#4f7f93", belly: "#f1f4ef", fin: "#d9c46a", h: 12, pat: "line" },
  { id: "saba",    name: "サバ",         tier: 1, min: 20, max: 38,  back: "#2a6b78", belly: "#eef3f5", fin: "#4d7f88", h: 11, pat: "wavy" },
  { id: "kasago",  name: "カサゴ",       tier: 1, min: 12, max: 26,  back: "#b4472f", belly: "#f4c9a8", fin: "#9c3a26", h: 16, pat: "spots" },
  { id: "mebaru",  name: "メバル",       tier: 1, min: 15, max: 28,  back: "#5b4c42", belly: "#d9c9b8", fin: "#4a3d35", h: 15 },
  { id: "kawahagi",name: "カワハギ",     tier: 1, min: 15, max: 28,  back: "#a1896b", belly: "#e3d5bf", fin: "#8a7357", h: 18, pat: "spots" },
  { id: "fugu",    name: "クサフグ",     tier: 1, min: 10, max: 20,  emoji: "🐡" },
  { id: "sayori",  name: "サヨリ",       tier: 1, min: 20, max: 38,  back: "#5c7f99", belly: "#f4f8fa", fin: "#adb5bd", h: 5,  shape: "long" },
  { id: "ishimochi",name: "イシモチ",    tier: 1, min: 18, max: 32,  back: "#ced4da", belly: "#f8f9fa", fin: "#adb5bd", h: 12 },
  // いいサイズ
  { id: "chinu",   name: "チヌ",         tier: 2, min: 25, max: 50,  back: "#4f5864", belly: "#d7dde3", fin: "#3b434c", h: 17 },
  { id: "tachiuo", name: "タチウオ",     tier: 2, min: 70, max: 120, back: "#c9d3dc", belly: "#f4f7fa", fin: "#aab7c3", h: 6,  shape: "long" },
  { id: "ika",     name: "アオリイカ",   tier: 2, min: 20, max: 40,  emoji: "🦑" },
  { id: "karei",   name: "カレイ",       tier: 2, min: 20, max: 40,  back: "#8a6d4c", belly: "#e6d8c2", fin: "#715839", h: 20, pat: "spots", shape: "flat" },
  { id: "ainame",  name: "アイナメ",     tier: 2, min: 25, max: 45,  back: "#8f5e2e", belly: "#e8c99b", fin: "#76491f", h: 11, pat: "spots" },
  { id: "gure",    name: "グレ",         tier: 2, min: 25, max: 50,  back: "#2b3a42", belly: "#5a6b75", fin: "#22303a", h: 17 },
  { id: "kamasu",  name: "カマス",       tier: 2, min: 25, max: 45,  back: "#7a8b6f", belly: "#f1f3ed", fin: "#d4b648", h: 7 },
  { id: "isaki",   name: "イサキ",       tier: 2, min: 25, max: 45,  back: "#6b7a5a", belly: "#dfe4d3", fin: "#5a6849", h: 13, pat: "hstripes" },
  // おおもの
  { id: "madai",   name: "マダイ",       tier: 3, min: 30, max: 70,  back: "#e2697f", belly: "#fbe3e7", fin: "#d1495f", h: 17, pat: "dots" },
  { id: "hamachi", name: "ハマチ",       tier: 3, min: 40, max: 65,  back: "#33648a", belly: "#f1f5f8", fin: "#e3c341", h: 11, pat: "band" },
  { id: "hirame",  name: "ヒラメ",       tier: 3, min: 35, max: 75,  back: "#7a6248", belly: "#e3d6c4", fin: "#5f4b36", h: 21, pat: "spots", shape: "flat" },
  { id: "suzuki",  name: "スズキ",       tier: 3, min: 45, max: 90,  back: "#5e6f7c", belly: "#eef2f5", fin: "#4b5965", h: 12 },
  { id: "sawara",  name: "サワラ",       tier: 3, min: 50, max: 100, back: "#4a6d8c", belly: "#eef3f7", fin: "#3d5a73", h: 8,  pat: "dots" },
  { id: "ishidai", name: "イシダイ",     tier: 3, min: 30, max: 60,  back: "#dee2e6", belly: "#f8f9fa", fin: "#343a40", h: 18, pat: "band2" },
  { id: "magochi", name: "マゴチ",       tier: 3, min: 40, max: 70,  back: "#8c7b62", belly: "#ece4d6", fin: "#72634d", h: 7,  pat: "spots" },
  { id: "akahata", name: "アカハタ",     tier: 3, min: 25, max: 45,  back: "#e03131", belly: "#ffc9c9", fin: "#c92a2a", h: 15, pat: "band2" },
  // かいぶつ
  { id: "katsuo",  name: "カツオ",       tier: 4, min: 45, max: 80,  back: "#1f3f68", belly: "#e9eef3", fin: "#2e5684", h: 14, pat: "belly" },
  { id: "shiira",  name: "シイラ",       tier: 4, min: 70, max: 130, back: "#2f9e5c", belly: "#f5d742", fin: "#2b8a4e", h: 15, pat: "dots", shape: "bump" },
  { id: "kue",     name: "クエ",         tier: 4, min: 50, max: 110, back: "#6b5440", belly: "#c9b49c", fin: "#55412f", h: 18, pat: "band2" },
  { id: "tako",    name: "マダコ",       tier: 4, min: 40, max: 80,  emoji: "🐙" },
  { id: "buri",    name: "ブリ",         tier: 4, min: 80, max: 110, back: "#2c5f8a", belly: "#f1f5f8", fin: "#e3c341", h: 13, pat: "band" },
  { id: "hiramasa",name: "ヒラマサ",     tier: 4, min: 80, max: 140, back: "#3d6e8f", belly: "#f3f6f8", fin: "#f0c94a", h: 12, pat: "band" },
  { id: "kanpachi",name: "カンパチ",     tier: 4, min: 60, max: 120, back: "#8a6b4f", belly: "#f1ece4", fin: "#b08b4f", h: 14, pat: "line" },
  { id: "utsubo",  name: "ウツボ",       tier: 4, min: 60, max: 100, back: "#7a5c2e", belly: "#c9a66b", fin: "#5c4520", h: 7,  shape: "long", pat: "spots" },
  // でんせつ
  { id: "maguro",  name: "クロマグロ",   tier: 5, min: 120, max: 260, back: "#1b3354", belly: "#dfe7ef", fin: "#f0c419", h: 15, pat: "finlets" },
  { id: "kajiki",  name: "カジキ",       tier: 5, min: 150, max: 320, back: "#26507e", belly: "#e3ebf3", fin: "#1d3f66", h: 12, shape: "bill" },
  { id: "ryugu",   name: "リュウグウノツカイ", tier: 5, min: 200, max: 500, back: "#d6dde4", belly: "#f6f8fa", fin: "#e03131", h: 6, shape: "long", pat: "redfin" },
  { id: "kintai",  name: "おうごんの マダイ", tier: 5, min: 50, max: 90, back: "#e0a800", belly: "#fff3bf", fin: "#c68a00", h: 17, pat: "shine" },
  { id: "coela",   name: "シーラカンス", tier: 5, min: 120, max: 200, back: "#364fc7", belly: "#748ffc", fin: "#2b3a9e", h: 15, pat: "dots" },
  { id: "manbo",   name: "マンボウ",     tier: 5, min: 150, max: 330, back: "#868e96", belly: "#dee2e6", fin: "#6c757d", h: 24, shape: "flat" },
  { id: "same",    name: "ホホジロザメ", tier: 5, min: 300, max: 600, emoji: "🦈" },
  { id: "daiou",   name: "ダイオウイカ", tier: 5, min: 500, max: 1200, emoji: "🦑", glow: true },
];
const FISH_BY_ID = new Map(FISH.map((f) => [f.id, f]));

/* 1かいの けっか(correct / n)で でる ランク */
function tierFor(correct, n) {
  const acc = n ? correct / n : 0;
  let t = 0;
  FISH_TIERS.forEach((x, i) => { if (acc >= x.acc - 1e-9 && n >= x.minN) t = i; });
  return t;
}

/* 1かいの けっかで つれる さかなを きめる。
   ときどき(10%)ひとつ うえの ランクが かかる「ラッキー」つき。
   せいかいりつが たかいほど、おなじ さかなでも おおきく なりやすい。
   まだ つっていない さかなが いれば、すこし でやすく して ずかんを うめやすく する。 */
function rollFish(correct, n, caught) {
  let t = tierFor(correct, n);
  let lucky = false;
  if (t < FISH_TIERS.length - 1 && Math.random() < 0.1) { t++; lucky = true; }
  const pool = FISH.filter((f) => f.tier === t);
  const fresh = pool.filter((f) => !caught[f.id]);
  const from = fresh.length && Math.random() < 0.5 ? fresh : pool;
  const sp = from[(Math.random() * from.length) | 0];
  const acc = n ? correct / n : 0;
  const size = Math.round(sp.min + (sp.max - sp.min) * Math.pow(Math.random(), 1.8 - acc));
  return { sp, size, lucky, tier: t };
}

/* ---------- さかなの え(SVG) ----------
   どの さかなも 120x60 の なかに 左むきで かく。 */
let fishUid = 0;
function fishInner(sp, sil) {
  if (sp.emoji) {
    const st = sil ? "filter:brightness(0);opacity:.22" : sp.glow ? "filter:hue-rotate(160deg) saturate(1.6)" : "";
    return `<text x="60" y="44" font-size="46" text-anchor="middle"${st ? ` style="${st}"` : ""}>${sp.emoji}</text>`;
  }
  const id = "fg" + (++fishUid);
  const H = sp.h;
  const long = sp.shape === "long";
  const flat = sp.shape === "flat";
  const tailX = long ? 116 : 98;
  const body = flat
    ? `M 14 30 C 18 ${30 - H}, 84 ${30 - H}, 96 30 C 84 ${30 + H}, 18 ${30 + H}, 14 30 Z`
    : sp.shape === "bump"
      ? `M 12 32 C 12 ${30 - H - 6}, 60 ${30 - H}, ${tailX} 30 C 70 ${30 + H}, 24 ${30 + H}, 12 32 Z`
      : `M 10 30 C 22 ${30 - H}, 70 ${30 - H}, ${tailX} 30 C 70 ${30 + H}, 22 ${30 + H}, 10 30 Z`;
  const back = sil ? "#c3ced9" : sp.back;
  const belly = sil ? "#c3ced9" : sp.belly;
  const fin = sil ? "#b5c2ce" : sp.fin;
  let out = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${back}"/><stop offset=".5" stop-color="${back}"/>
      <stop offset=".62" stop-color="${belly}"/><stop offset="1" stop-color="${belly}"/></linearGradient>
      <clipPath id="${id}c"><path d="${body}"/></clipPath></defs>`;
  // しっぽ と ひれ
  if (!long) {
    const T = flat ? 9 : Math.max(9, H * 0.9);
    out += `<path d="M ${tailX - 3} 30 L 117 ${30 - T} L 110 30 L 117 ${30 + T} Z" fill="${fin}"/>`;
  }
  if (sp.pat === "redfin" && !sil) {
    out += `<path d="M 16 ${30 - H} C 40 ${30 - H - 7}, 80 ${30 - H - 4}, 114 30" stroke="#e03131" stroke-width="4" fill="none"/>`;
  } else if (!flat) {
    out += `<path d="M 40 ${30 - H * 0.85} L 52 ${30 - H - 6} L 66 ${30 - H * 0.72} Z" fill="${fin}"/>`;
    out += `<path d="M 58 ${30 + H * 0.8} L 64 ${30 + H + 4} L 72 ${30 + H * 0.66} Z" fill="${fin}"/>`;
  }
  if (sp.shape === "bill") out += `<path d="M 12 29 L -8 28 L 12 32 Z" fill="${back}"/>`;
  out += `<path d="${body}" fill="url(#${id})"/>`;
  // もよう
  if (!sil) {
    const g = [];
    if (sp.pat === "spots") for (let i = 0; i < 9; i++) g.push(`<circle cx="${30 + (i * 37) % 60}" cy="${30 - H * 0.5 + ((i * 13) % (H + 2))}" r="1.8" fill="rgba(0,0,0,.25)"/>`);
    if (sp.pat === "dots") for (let i = 0; i < 6; i++) g.push(`<circle cx="${32 + i * 9}" cy="${30 - H * 0.15}" r="1.4" fill="rgba(255,255,255,.6)"/>`);
    if (sp.pat === "wavy") for (let i = 0; i < 5; i++) g.push(`<path d="M ${30 + i * 11} ${30 - H} q 3 4 0 8 q -3 4 0 7" stroke="rgba(0,0,0,.35)" stroke-width="1.4" fill="none"/>`);
    if (sp.pat === "line") g.push(`<path d="M 32 29 Q 60 26 96 30" stroke="rgba(0,0,0,.25)" stroke-width="1.2" fill="none"/>`);
    if (sp.pat === "band") g.push(`<rect x="10" y="${28 - H * 0.15}" width="100" height="2.6" fill="#f5d742"/>`);
    if (sp.pat === "hstripes") for (let i = 0; i < 3; i++) g.push(`<rect x="10" y="${30 - H * 0.55 + i * H * 0.4}" width="100" height="1.6" fill="rgba(0,0,0,.28)"/>`);
    if (sp.pat === "band2") for (let i = 0; i < 4; i++) g.push(`<rect x="${30 + i * 16}" y="0" width="6" height="60" fill="rgba(0,0,0,.18)"/>`);
    if (sp.pat === "belly") for (let i = 0; i < 4; i++) g.push(`<rect x="10" y="${31 + i * 3}" width="100" height="1.2" fill="rgba(31,63,104,.45)"/>`);
    if (sp.pat === "finlets") for (let i = 0; i < 5; i++) g.push(`<path d="M ${74 + i * 4} ${30 - H * 0.55} l 2 -3 l 1 3 Z" fill="#f0c419"/>`);
    if (sp.pat === "shine") g.push(`<path d="M 30 ${30 - H * 0.55} Q 50 ${30 - H * 0.8} 70 ${30 - H * 0.5}" stroke="rgba(255,255,255,.75)" stroke-width="2.5" fill="none"/>`);
    out += `<g clip-path="url(#${id}c)">${g.join("")}</g>`;
    // え ら・め・くち
    const ex = flat ? 26 : 22;
    out += `<path d="M ${ex + 9} ${30 - H * 0.55} Q ${ex + 14} 30 ${ex + 9} ${30 + H * 0.55}" stroke="rgba(0,0,0,.22)" stroke-width="1.2" fill="none"/>`;
    out += `<circle cx="${ex}" cy="${flat ? 24 : 27}" r="3.3" fill="#fff"/><circle cx="${ex - 0.6}" cy="${flat ? 24 : 27}" r="1.8" fill="#111"/>`;
    out += `<path d="M ${flat ? 15 : 11} 31 l 4 0" stroke="rgba(0,0,0,.35)" stroke-width="1" />`;
  }
  return out;
}
function fishSVG(sp, sil = false, cls = "") {
  return `<svg class="fish-svg ${cls}" viewBox="-10 0 130 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${fishInner(sp, sil)}</svg>`;
}

/* ---------- こうかおん ---------- */
const sfxCast = () => { [900, 760, 620, 480, 340].forEach((f, i) => setTimeout(() => beep(f, 0.05, "triangle", 0.05), i * 45)); };
const sfxPlop = () => { beep(220, 0.12, "sine", 0.08); setTimeout(() => beep(150, 0.14, "sine", 0.06), 60); };
const sfxBite = () => { beep(1250, 0.07, "square", 0.05); setTimeout(() => beep(1250, 0.07, "square", 0.05), 120); };
const sfxReel = () => { for (let i = 0; i < 9; i++) setTimeout(() => beep(380 + i * 35, 0.03, "square", 0.03), i * 55); };
const sfxCatch = (big) => {
  const seq = big ? [523, 659, 784, 1047, 1319] : [660, 880, 1100];
  seq.forEach((f, i) => setTimeout(() => beep(f, 0.12, "triangle", 0.06), i * 85));
};

/* ---------- つりの ミニゲーム ----------
   なげる → うきが ぷかぷか → 「!」 → 画面を れんだ して リールを まく → さかなが とびだす → けっか。
   まきあげメーターが いっぱいに なったら つれる。おおものほど あばれて たくさん まく ひつようが ある。
   タップを やめても メーターは すこし もどる だけ。しっぱいは なし(ちいさい 子でも かならず つれる)。 */
/* スマホの たてがめんに あわせて たてながの ぶたいに する
   (よこに ひろいと 左右が きれて さおが 見えなくなる) */
const SCENE_W = 260, SCENE_H = 520, WATER = 250;
const ROD_BASE = { x: 22, y: 505 }, ROD_LEN = 270;
const SPOT = { x: 196, y: WATER + 16 };
const NEAR = { x: 92, y: WATER + 34 };            // まききった ときの さかなの いち
/* ランクごとの てごたえ: step = 1タップで すすむ %、back = 1びょうで もどる %、
   swim = あばれる はば、shadow = かげの おおきさ */
/* せいかい する たびに つるので、1かいの まきあげは かるめ(こざかな 約4タップ 〜 でんせつ 約14タップ) */
const FIGHT = [
  { step: 27, back: 3,  swim: 14, shadow: 0.55 },
  { step: 21, back: 5,  swim: 18, shadow: 0.7 },
  { step: 16, back: 7,  swim: 24, shadow: 0.85 },
  { step: 13, back: 8,  swim: 30, shadow: 1.05 },
  { step: 10, back: 9,  swim: 36, shadow: 1.25 },
  { step: 8,  back: 10, swim: 42, shadow: 1.5 },
];
const sfxTick = () => beep(420 + Math.random() * 80, 0.035, "square", 0.035);

function ensureOverlay() {
  let ov = document.getElementById("fishOverlay");
  if (ov) return ov;
  ov = document.createElement("div");
  ov.id = "fishOverlay";
  ov.className = "fish-overlay hidden";
  ov.innerHTML = `
    <svg class="fish-scene" id="fsScene" viewBox="0 0 ${SCENE_W} ${SCENE_H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6f2"/><stop offset="1" stop-color="#d7f0ff"/></linearGradient>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c8fd1"/><stop offset="1" stop-color="#0b3d6e"/></linearGradient>
      </defs>
      <rect x="-60" width="${SCENE_W + 120}" height="${WATER}" fill="url(#skyG)"/>
      <circle cx="215" cy="70" r="26" fill="#ffe066"/>
      <g class="cloud"><ellipse cx="80" cy="80" rx="34" ry="13" fill="#fff" opacity=".9"/><ellipse cx="104" cy="72" rx="22" ry="12" fill="#fff" opacity=".9"/></g>
      <rect x="-60" y="${WATER}" width="${SCENE_W + 120}" height="${SCENE_H - WATER}" fill="url(#seaG)"/>
      <g id="fsShadow" opacity="0"><path d="M -34 0 C -24 -13, 18 -13, 30 0 C 18 13, -24 13, -34 0 Z M 26 0 L 44 -11 L 40 0 L 44 11 Z" fill="rgba(4,22,44,.55)"/></g>
      <g class="wave w1"><path d="M -40 ${WATER} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 V ${WATER + 14} H -40 Z" fill="#3aa6e0"/></g>
      <g class="wave w2"><path d="M -40 ${WATER + 40} q 20 -6 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/></g>
      <g id="fsRipples"></g>
      <path id="fsLine" stroke="#fff" stroke-width="1.6" fill="none" opacity=".9"/>
      <g id="fsBobber"><circle r="8" fill="#fff"/><path d="M -8 0 A 8 8 0 0 1 8 0 Z" fill="#e03131"/><line x1="0" y1="-8" x2="0" y2="-15" stroke="#333" stroke-width="2"/></g>
      <g id="fsFish"></g>
      <g id="fsSplash"></g>
      <path id="fsRod" stroke="#6b4423" stroke-width="7" stroke-linecap="round" fill="none"/>
      <g id="fsReelG"><circle id="fsReel" r="13" fill="#495057" stroke="#212529" stroke-width="3"/><line id="fsHandle" x1="0" y1="0" x2="0" y2="-13" stroke="#ffd43b" stroke-width="4" stroke-linecap="round"/></g>
      <text id="fsBang" x="${SPOT.x}" y="${WATER - 40}" text-anchor="middle" font-size="64" font-weight="900" fill="#ffd43b" stroke="#c92a2a" stroke-width="3" opacity="0">!</text>
    </svg>
    <div class="fight-ui hidden" id="fsFightUI">
      <div class="fight-label" id="fsFightLabel">まきあげ メーター</div>
      <div class="fight-meter"><div class="fight-fill" id="fsFill"></div><span class="fight-fish" id="fsMeterFish">🐟</span></div>
    </div>
    <div class="tap-prompt hidden" id="fsTap">👆 タップ! タップ!<small>れんだ して リールを まこう</small></div>
    <div class="fish-hint" id="fsHint">タップで はやおくり</div>
    <div class="catch-card hidden" id="catchCard"></div>`;
  document.body.appendChild(ov);
  return ov;
}

const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (a, b, t) => a + (b - a) * t;

function rodPath(angleDeg, bend) {
  const a = (angleDeg * Math.PI) / 180;
  const tip = { x: ROD_BASE.x + ROD_LEN * Math.cos(a), y: ROD_BASE.y - ROD_LEN * Math.sin(a) };
  // まんなかを すこし ずらして しなりを だす
  const mx = (ROD_BASE.x + tip.x) / 2 + Math.sin(a) * bend;
  const my = (ROD_BASE.y + tip.y) / 2 + Math.cos(a) * bend;
  return { d: `M ${ROD_BASE.x} ${ROD_BASE.y} Q ${mx} ${my} ${tip.x} ${tip.y}`, tip };
}

let fishingBusy = false;
/* correct / n = この 1かいの せいかいすう / もんだいすう。onDone は けっかを とじた あとに よぶ */
function playCatch(correct, n, caught, onDone) {
  const ov = ensureOverlay();
  const catchResult = rollFish(correct, n, caught);
  const { sp } = catchResult;
  const isNew = !caught[sp.id];   // よびだしがわが すぐ ずかんに きろく するので、さきに きめておく
  const F = FIGHT[sp.tier];
  fishingBusy = true;

  const $ = (id) => document.getElementById(id);
  const scene = $("fsScene"), rod = $("fsRod"), line = $("fsLine"), bob = $("fsBobber"), fishG = $("fsFish");
  const bang = $("fsBang"), ripples = $("fsRipples"), splash = $("fsSplash"), reelG = $("fsReelG"), handle = $("fsHandle");
  const shadow = $("fsShadow"), fightUI = $("fsFightUI"), fill = $("fsFill"), meterFish = $("fsMeterFish"), tapP = $("fsTap");
  const card = $("catchCard");
  card.classList.add("hidden");
  fightUI.classList.add("hidden");
  tapP.classList.add("hidden");
  $("fsHint").classList.remove("hidden");
  $("fsFightLabel").textContent = sp.tier >= 3 ? "⚠️ でかい! まきあげ メーター" : "まきあげ メーター";
  meterFish.textContent = sp.tier >= 3 ? "🐋" : "🐟";
  fishG.innerHTML = `<g transform="translate(-60,-30)">${fishInner(sp, false)}</g>`;
  fishG.setAttribute("opacity", "0");
  shadow.setAttribute("opacity", "0");
  bob.setAttribute("opacity", "1");
  bang.setAttribute("opacity", "0");
  ripples.innerHTML = "";
  splash.innerHTML = "";
  scene.style.transform = "";
  ov.classList.remove("hidden");
  const RX = ROD_BASE.x + 26, RY = ROD_BASE.y - 30;
  reelG.setAttribute("transform", `translate(${RX} ${RY})`);

  // じょうたい: cast → wait → bite → fight → jump → result
  let state = "cast", t0 = performance.now();
  const go = (s) => { state = s; t0 = performance.now(); };
  let progress = 0, kick = 0, shake = 0, reelRot = 0, lastTap = 0, landed = false;
  let jumpFrom = { x: SPOT.x, y: SPOT.y };
  const drops = Array.from({ length: 12 }, (_, i) => ({ a: Math.PI * (0.12 + 0.065 * i), v: 60 + Math.random() * 80 }));
  const played = {};
  const once = (key, fn) => { if (!played[key]) { played[key] = true; fn(); } };
  let raf = 0, last = performance.now(), finished = false;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now - t0;
    let ang = 48, bend = 0, bx = SPOT.x, by = SPOT.y, showBob = true, lineTo = null;

    if (state === "cast") {
      // ふりかぶって → まえへ なげる
      const p = Math.min(1, t / 750);
      ang = p < 0.3 ? lerp(55, 88, ease(p / 0.3)) : lerp(88, 48, ease((p - 0.3) / 0.7));
      bend = p < 0.3 ? 0 : -18 * Math.sin(Math.PI * (p - 0.3) / 0.7);
      const tip = rodPath(ang, bend).tip;
      if (p < 0.4) { bx = tip.x; by = tip.y + 18; }
      else {
        once("cast", sfxCast);
        const q = ease((p - 0.4) / 0.6);
        bx = lerp(tip.x, SPOT.x, q);
        by = lerp(tip.y, SPOT.y, q) - 150 * Math.sin(Math.PI * q);
      }
      if (p >= 1) go("wait");
    } else if (state === "wait") {
      once("plop", () => { sfxPlop(); addRipple(SPOT.x); });
      by = SPOT.y + 3 * Math.sin(now / 110);
      // かげが よってくる
      shadow.setAttribute("opacity", String(Math.min(0.8, t / 900)));
      setShadow(SPOT.x + 50 - 50 * Math.min(1, t / 900), SPOT.y + 26, 0);
      if (t > 400) once("rip2", () => addRipple(SPOT.x));
      if (t > 950) go("bite");
    } else if (state === "bite") {
      once("bite", () => { sfxBite(); bang.setAttribute("opacity", "1"); addRipple(SPOT.x); });
      const p = t / 550;
      bang.setAttribute("transform", `translate(${SPOT.x} ${WATER - 60}) scale(${1 + 0.25 * Math.sin(p * Math.PI * 4)}) translate(${-SPOT.x} ${-(WATER - 60)})`);
      ang = 48 - 4 * Math.sin(p * Math.PI * 6); bend = 12;
      bx = SPOT.x + 3 * Math.sin(now / 25); by = SPOT.y + 12 + 4 * Math.sin(now / 40);
      setShadow(SPOT.x, SPOT.y + 24, Math.sin(now / 60) * 8);
      if (t > 550) {
        bang.setAttribute("opacity", "0");
        $("fsHint").classList.add("hidden");
        fightUI.classList.remove("hidden");
        tapP.classList.remove("hidden");
        go("fight");
      }
    } else if (state === "fight") {
      // さかなが ひっぱる(すこし もどる)。タップで すすむ
      if (!landed) progress = Math.max(0, progress - F.back * dt);
      kick = Math.max(0, kick - dt * 4);
      shake = Math.max(0, shake - dt * 3);
      const q = progress / 100;
      const swim = F.swim * (1 - q * 0.5);
      const fx = lerp(SPOT.x, NEAR.x, q) + Math.sin(now / (260 - sp.tier * 25)) * swim;
      const fy = lerp(SPOT.y + 24, NEAR.y, q) + Math.cos(now / 330) * 5;
      setShadow(fx, fy, Math.cos(now / (260 - sp.tier * 25)) * 18);
      jumpFrom = { x: fx, y: fy };
      showBob = false;
      lineTo = { x: fx - 30 * F.shadow, y: WATER + 2 };
      ang = 50 + 22 * q - 6 * kick; bend = 22 + 20 * kick + sp.tier * 3;
      if (Math.random() < dt * (1.5 + sp.tier)) addRipple(fx);
      tapP.classList.toggle("idle", now - lastTap > 1200);
      fill.style.width = progress + "%";
      meterFish.style.left = progress + "%";
      if (landed) {
        fightUI.classList.add("hidden");
        tapP.classList.add("hidden");
        shadow.setAttribute("opacity", "0");
        go("jump");
      }
    } else if (state === "jump") {
      // さかなが うみから とびだして まんなかへ
      once("jump", () => { sfxPlop(); spawnSplash(); });
      const p = Math.min(1, t / 800);
      const q = ease(p);
      const fx = lerp(jumpFrom.x, 130, q);
      const fy = lerp(jumpFrom.y, 175, q) - 90 * Math.sin(Math.PI * q);
      fishG.setAttribute("opacity", "1");
      fishG.setAttribute("transform", `translate(${fx} ${fy}) rotate(${lerp(-40, 370, q)}) scale(${lerp(0.6, 1.5, q)})`);
      showBob = false;
      lineTo = { x: fx, y: fy };
      ang = lerp(72, 82, q); bend = 30 * (1 - q);
      updateSplash(p);
      if (p >= 1) { showResult(); return; }
    } else {
      return;
    }

    const r = rodPath(ang, bend);
    rod.setAttribute("d", r.d);
    const end = lineTo || { x: bx, y: by };
    const sag = state === "cast" ? 0 : state === "fight" || state === "jump" ? 6 : 26;
    line.setAttribute("d", `M ${r.tip.x} ${r.tip.y} Q ${(r.tip.x + end.x) / 2} ${(r.tip.y + end.y) / 2 + sag} ${end.x} ${end.y}`);
    bob.setAttribute("opacity", showBob ? "1" : "0");
    bob.setAttribute("transform", `translate(${bx} ${by})`);
    handle.setAttribute("transform", `rotate(${reelRot})`);
    scene.style.transform = shake > 0 ? `translate(${(Math.random() - 0.5) * 8 * shake}px, ${(Math.random() - 0.5) * 8 * shake}px)` : "";
    raf = requestAnimationFrame(frame);
  }

  function setShadow(x, y, rot) {
    shadow.setAttribute("transform", `translate(${x} ${y}) rotate(${rot}) scale(${F.shadow})`);
  }
  function addRipple(x) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    e.setAttribute("cx", x); e.setAttribute("cy", WATER + 6);
    e.setAttribute("class", "ripple");
    ripples.appendChild(e);
    if (ripples.childNodes.length > 8) ripples.removeChild(ripples.firstChild);
  }
  function spawnSplash() {
    splash.innerHTML = drops.map(() => `<circle r="4" fill="#dff3ff"/>`).join("");
  }
  function updateSplash(p) {
    const cs = splash.querySelectorAll("circle");
    cs.forEach((c, i) => {
      const d = drops[i];
      const tt = Math.min(1, p * 1.5);
      c.setAttribute("cx", jumpFrom.x + Math.cos(d.a) * d.v * tt * (i % 2 ? 1 : -1));
      c.setAttribute("cy", WATER - Math.sin(d.a) * d.v * tt + 120 * tt * tt);
      c.setAttribute("opacity", String(1 - tt));
    });
  }

  function tap(e) {
    if (e.target.closest(".catch-card")) return;
    e.preventDefault();
    if (state === "fight") {
      progress = Math.min(100, progress + F.step);
      if (progress >= 100) landed = true;   // つぎの フレームで もどる まえに きめる
      kick = 1;
      reelRot += 55;
      lastTap = performance.now();
      if (sp.tier >= 3) shake = Math.min(1, shake + 0.35);
      sfxTick();
    } else if (state === "cast" || state === "wait") {
      go("bite");                      // まちきれない ときは すぐ 「!」へ
    }
  }

  function showResult() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    ov.removeEventListener("pointerdown", tap);
    scene.style.transform = "";
    const big = sp.tier >= 3 || catchResult.lucky;
    sfxCatch(big);
    const tier = FISH_TIERS[sp.tier];
    const pct = Math.round((correct / n) * 100);
    // つぎも ⭕ だったら ランクが あがるか
    const nowT = tierFor(correct, n), ifOk = tierFor(correct + 1, n + 1);
    const hint = nowT >= FISH_TIERS.length - 1
      ? "👑 パーフェクト! でんせつの うみ!"
      : ifOk > nowT
        ? `つぎも ⭕ なら ${FISH_TIERS[ifOk].ic} ${FISH_TIERS[ifOk].name} が でるかも!`
        : "まちがえずに つづけるほど おおものに なるよ";
    card.innerHTML = `
      <div class="cc-badges">
        ${isNew ? '<span class="cc-new">NEW!</span>' : ""}
        ${catchResult.lucky ? '<span class="cc-lucky">ラッキー!</span>' : ""}
        <span class="cc-tier" style="background:${tier.color}">${tier.ic} ${tier.name}</span>
      </div>
      <div class="cc-fish">${fishSVG(sp, false, "big")}</div>
      <div class="cc-title">${sp.name} が つれた!</div>
      <div class="cc-size"><b>${catchResult.size}</b> cm</div>
      <div class="cc-score">この 回 ${n}もん ちゅう <b>${correct}</b>もん せいかい(<b>${pct}</b>%)</div>
      <div class="cc-sub">${hint}</div>
      <button class="cc-btn" id="ccNext">つぎへ ▶</button>`;
    card.classList.remove("hidden");
    $("ccNext").addEventListener("click", (e) => {
      e.stopPropagation();
      ov.classList.add("hidden");
      fishingBusy = false;
      onDone(catchResult);
    }, { once: true });
  }

  ov.addEventListener("pointerdown", tap);
  raf = requestAnimationFrame(frame);
  return catchResult;
}
