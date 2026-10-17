/* =========================================================
   fishing.js - つりの しかけ
   ・「おぼえた」を おす たびに 1ぴき つる(タップで まく ミニゲーム)
   ・なにが つれるかは うんしだい(ガチャ)。でんせつ 2% / まぼろし 0.7% / ゴッド 0.3%
   ・つった さかなは ずかんに のこる
   ========================================================= */

/* rate = その ランクが でる かくりつ(%)。ごうけい 100 */
const FISH_TIERS = [
  { rate: 40, name: "こざかな",   ic: "🐟", color: "#5c7cfa" },
  { rate: 25, name: "ちゅうもの", ic: "🐠", color: "#20a4a4" },
  { rate: 17, name: "いいサイズ", ic: "🎣", color: "#2f9e44" },
  { rate: 10, name: "おおもの",   ic: "💪", color: "#e8590c" },
  { rate: 5,  name: "かいぶつ",   ic: "🔥", color: "#c92a2a" },
  { rate: 2,   name: "でんせつ",   ic: "👑", color: "#b8860b" },
  { rate: 0.7, name: "まぼろし",   ic: "🌀", color: "#7048e8", rare: true },
  { rate: 0.3, name: "ゴッド",     ic: "🌈", color: "#e64980", rare: true },
];

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
  // まぼろし(しんかいの めずらしい さかな)
  { id: "anko",    name: "チョウチンアンコウ", tier: 6, min: 30, max: 60, back: "#3b2f2f", belly: "#5c4b4b", fin: "#2b2222", h: 19, pat: "lure" },
  { id: "demenigisu", name: "デメニギス", tier: 6, min: 10, max: 18, back: "#343a40", belly: "#adb5bd", fin: "#495057", h: 10, pat: "glowhead" },
  { id: "rabuka",  name: "ラブカ",       tier: 6, min: 120, max: 200, back: "#5c4033", belly: "#a68a73", fin: "#4a3328", h: 7, shape: "long", pat: "spots" },
  { id: "megamouth", name: "メガマウス", tier: 6, min: 400, max: 700, back: "#3d4a5c", belly: "#cfd8e3", fin: "#2f3a4a", h: 15, pat: "mouth" },
  // ゴッド(ゆめの さかな)
  { id: "ryu",     name: "うみの りゅう", tier: 7, min: 800, max: 2000, emoji: "🐉" },
  { id: "niji",    name: "にじいろ マグロ", tier: 7, min: 200, max: 350, back: "#7048e8", belly: "#fff0f6", fin: "#f76707", h: 15, pat: "rainbow" },
  { id: "diamond", name: "ダイヤモンド フィッシュ", tier: 7, min: 40, max: 90, back: "#74c0fc", belly: "#e7f5ff", fin: "#a5d8ff", h: 17, pat: "sparkle" },
  { id: "hoshi",   name: "ほしの さかな", tier: 7, min: 50, max: 120, back: "#1c2a6b", belly: "#4c6ef5", fin: "#ffd43b", h: 14, pat: "stars" },
];
const FISH_BY_ID = new Map(FISH.map((f) => [f.id, f]));

/* ランクを くじびき で きめる */
function drawTier() {
  let r = Math.random() * 100;
  for (let i = 0; i < FISH_TIERS.length; i++) {
    r -= FISH_TIERS[i].rate;
    if (r < 0) return i;
  }
  return 0;
}

/* つれる さかなを きめる。まだ つっていない さかなが いれば、
   すこし でやすく して ずかんを うめやすく する。 */
function rollFish(caught) {
  const t = drawTier();
  const pool = FISH.filter((f) => f.tier === t);
  const fresh = pool.filter((f) => !caught[f.id]);
  const from = fresh.length && Math.random() < 0.5 ? fresh : pool;
  const sp = from[(Math.random() * from.length) | 0];
  const size = Math.round(sp.min + (sp.max - sp.min) * Math.pow(Math.random(), 1.4));
  return { sp, size, tier: t };
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
  if (sp.pat === "lure") out += `<path d="M 24 ${30 - H * 0.8} Q 18 ${30 - H - 14} 4 ${30 - H - 6}" stroke="${back}" stroke-width="1.6" fill="none"/><circle cx="4" cy="${30 - H - 6}" r="4" fill="${sil ? "#b5c2ce" : "#ffe066"}"/>`;
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
    if (sp.pat === "glowhead") g.push(`<circle cx="22" cy="${30 - H * 0.35}" r="6" fill="rgba(105,219,124,.85)"/>`);
    if (sp.pat === "mouth") g.push(`<path d="M 10 31 Q 24 37 36 31" stroke="#f1f3f5" stroke-width="2.4" fill="none"/>`);
    if (sp.pat === "rainbow") ["#f03e3e", "#fd7e14", "#fab005", "#40c057", "#228be6", "#7048e8"].forEach((c, i) => g.push(`<rect x="10" y="${30 - H + i * (H * 2 / 6)}" width="100" height="${H * 2 / 6 + 0.3}" fill="${c}" opacity=".75"/>`));
    if (sp.pat === "sparkle") for (let i = 0; i < 6; i++) g.push(`<path d="M ${30 + i * 11} ${30 - H * 0.4 + (i % 2) * H * 0.6} l 1.5 -4 l 1.5 4 l 4 1.5 l -4 1.5 l -1.5 4 l -1.5 -4 l -4 -1.5 Z" fill="#fff"/>`);
    if (sp.pat === "stars") for (let i = 0; i < 7; i++) g.push(`<circle cx="${28 + i * 10}" cy="${30 - H * 0.5 + ((i * 7) % (H + 1))}" r="${i % 2 ? 1.2 : 1.8}" fill="#ffd43b"/>`);
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
const sfxCatch = (big, rare) => {
  const seq = rare ? [523, 659, 784, 1047, 784, 1047, 1319, 1568, 2093] : big ? [523, 659, 784, 1047, 1319] : [660, 880, 1100];
  seq.forEach((f, i) => setTimeout(() => beep(f, 0.12, "triangle", 0.06), i * 85));
};

/* ---------- つりの ミニゲーム(うみの なかが 見える ばめん) ----------
   うえ半分=そら と さんばし(子どもが さおを もつ)、した半分=うみの なか。
   なげる → しかけが しずむ → さかなが およいで くる(おおものは でっかい かげ)→ 「!」→
   画面を れんだ して まく(さかなが あばれながら うえへ)→ ザバーン!と とびだす → けっか。
   タップを やめても メーターは すこし もどる だけ。しっぱいは なし(ちいさい 子でも かならず つれる)。 */
const SCENE_W = 260, SCENE_H = 520, SURF = 188;
const HAND = { x: 58, y: 138 }, ROD_LEN = 140;     // さおの もちて
const FLOAT_X = 182;                               // うきが おちる ところ
const BAIT = { x: 182, y: 352 };                   // しかけ(えさ)の ふかさ
/* ランクごとの てごたえ: step = 1タップで すすむ %、back = 1びょうで もどる %、
   swim = あばれる はば、scale = うみの なかの さかなの おおきさ */
const FIGHT = [
  { step: 27, back: 3,  swim: 12, scale: 0.62 },
  { step: 21, back: 5,  swim: 16, scale: 0.74 },
  { step: 16, back: 7,  swim: 22, scale: 0.86 },
  { step: 13, back: 8,  swim: 28, scale: 1.0 },
  { step: 10, back: 9,  swim: 34, scale: 1.18 },
  { step: 8,  back: 10, swim: 40, scale: 1.4 },
  { step: 7,  back: 11, swim: 44, scale: 1.5 },
  { step: 6,  back: 12, swim: 48, scale: 1.6 },
];
const sfxTick = () => beep(420 + Math.random() * 80, 0.035, "square", 0.035);
const sfxBig = () => { [110, 98, 110, 98].forEach((f, i) => setTimeout(() => beep(f, 0.22, "sawtooth", 0.05), i * 260)); };
const sfxSplash = () => { [300, 220, 160, 120].forEach((f, i) => setTimeout(() => beep(f, 0.12, "sine", 0.07), i * 40)); };

function ensureOverlay() {
  let ov = document.getElementById("fishOverlay");
  if (ov) return ov;
  ov = document.createElement("div");
  ov.id = "fishOverlay";
  ov.className = "fish-overlay hidden";
  const kelp = (x, h, d) => `<path class="kelp" style="animation-delay:${d}s" d="M ${x} 520 C ${x - 10} ${520 - h * 0.3}, ${x + 10} ${520 - h * 0.6}, ${x} ${520 - h}" stroke="#2f9e44" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const bubbles = Array.from({ length: 9 }, (_, i) =>
    `<circle class="bub" style="animation-delay:${(i * 0.7).toFixed(1)}s;animation-duration:${(4 + (i % 3)).toFixed(1)}s" cx="${20 + i * 27}" cy="515" r="${2 + (i % 3)}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.2"/>`).join("");
  const school = Array.from({ length: 6 }, (_, i) =>
    `<path d="M ${i * 11} ${(i % 2) * 7} q 5 -3 9 0 q -4 3 -9 0 Z M ${i * 11 + 8} ${(i % 2) * 7} l 4 -2.5 l 0 5 Z" fill="rgba(200,230,255,.55)"/>`).join("");
  ov.innerHTML = `
    <svg class="fish-scene" id="fsScene" viewBox="0 0 ${SCENE_W} ${SCENE_H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb8f0"/><stop offset="1" stop-color="#cdeeff"/></linearGradient>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22a2dc"/><stop offset=".55" stop-color="#0d6aa8"/><stop offset="1" stop-color="#06345e"/></linearGradient>
        <linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.35)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>
        <radialGradient id="glowG"><stop offset="0" stop-color="rgba(255,240,150,.95)"/><stop offset="1" stop-color="rgba(255,240,150,0)"/></radialGradient>
      </defs>
      <!-- そら -->
      <rect x="-80" width="${SCENE_W + 160}" height="${SURF}" fill="url(#skyG)"/>
      <circle cx="214" cy="52" r="22" fill="#ffe066"/><circle cx="214" cy="52" r="32" fill="rgba(255,224,102,.25)"/>
      <g class="cloud"><ellipse cx="70" cy="60" rx="30" ry="11" fill="#fff" opacity=".95"/><ellipse cx="92" cy="53" rx="19" ry="11" fill="#fff" opacity=".95"/></g>
      <g class="gull"><path d="M 0 0 q 5 -5 10 0 q 5 -5 10 0" stroke="#34495e" stroke-width="1.6" fill="none"/></g>
      <path d="M -80 ${SURF - 22} L 40 ${SURF - 34} L 120 ${SURF - 24} L 340 ${SURF - 30} V ${SURF} H -80 Z" fill="#7aa5c4" opacity=".55"/>
      <!-- うみ -->
      <rect x="-80" y="${SURF}" width="${SCENE_W + 160}" height="${SCENE_H - SURF}" fill="url(#seaG)"/>
      <g class="rays"><path d="M 40 ${SURF} L 70 ${SURF} L 20 520 L -30 520 Z" fill="url(#rayG)"/><path d="M 130 ${SURF} L 150 ${SURF} L 120 520 L 80 520 Z" fill="url(#rayG)"/><path d="M 220 ${SURF} L 245 ${SURF} L 230 520 L 190 520 Z" fill="url(#rayG)"/></g>
      <g class="school" transform="translate(0 290)">${school}</g>
      <path d="M -80 520 Q 20 488 80 500 T 200 494 T 340 504 V 530 H -80 Z" fill="#c9a66b"/>
      <ellipse cx="226" cy="505" rx="20" ry="11" fill="#6c757d"/><ellipse cx="34" cy="508" rx="14" ry="8" fill="#868e96"/>
      ${kelp(14, 70, 0)}${kelp(26, 95, .6)}${kelp(244, 85, .3)}${kelp(232, 60, 1)}
      ${bubbles}
      <g id="fsShadow" opacity="0"><ellipse rx="70" ry="24" fill="rgba(2,16,34,.55)"/><path d="M 60 0 L 92 -20 L 84 0 L 92 20 Z" fill="rgba(2,16,34,.55)"/></g>
      <g id="fsFishU" opacity="0"></g>
      <g id="fsHook" opacity="0"><path d="M 0 -6 V 4 a 4 4 0 0 1 -8 0" stroke="#adb5bd" stroke-width="1.6" fill="none"/><circle cx="-1" cy="2" r="3.2" fill="#f783ac"/></g>
      <!-- なみ -->
      <g class="wave w1"><path d="M -80 ${SURF} q 20 -7 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 V ${SURF + 9} H -80 Z" fill="#7fd0f5" opacity=".9"/></g>
      <g id="fsRipples"></g>
      <!-- さんばし と 子ども -->
      <rect x="-80" y="${SURF - 18}" width="150" height="9" rx="2" fill="#a0703c"/>
      <rect x="-80" y="${SURF - 10}" width="150" height="4" fill="#7a5229"/>
      <rect x="6" y="${SURF - 10}" width="7" height="70" fill="#7a5229"/><rect x="52" y="${SURF - 10}" width="7" height="70" fill="#7a5229"/>
      <g id="fsKid">
        <rect x="30" y="${SURF - 40}" width="7" height="22" rx="3" fill="#364fc7"/><rect x="40" y="${SURF - 40}" width="7" height="22" rx="3" fill="#364fc7"/>
        <rect x="27" y="${SURF - 70}" width="23" height="33" rx="9" fill="#fd7e14"/>
        <circle cx="38" cy="${SURF - 82}" r="12" fill="#ffd8a8"/>
        <path d="M 25 ${SURF - 84} a 13 12 0 0 1 26 0 Z" fill="#1971c2"/><rect x="40" y="${SURF - 87}" width="16" height="4" rx="2" fill="#1971c2"/>
        <circle cx="43" cy="${SURF - 81}" r="1.6" fill="#212529"/><path d="M 40 ${SURF - 75} q 3 2 6 0" stroke="#212529" stroke-width="1.2" fill="none"/>
        <path id="fsArm" d="M 44 ${SURF - 62} L ${HAND.x} ${HAND.y}" stroke="#ffd8a8" stroke-width="5" stroke-linecap="round"/>
      </g>
      <path id="fsLineA" stroke="#fff" stroke-width="1.4" fill="none"/>
      <path id="fsLineB" stroke="rgba(255,255,255,.55)" stroke-width="1.2" fill="none"/>
      <g id="fsBobber"><circle r="6.5" fill="#fff"/><path d="M -6.5 0 A 6.5 6.5 0 0 1 6.5 0 Z" fill="#e03131"/><line x1="0" y1="-6" x2="0" y2="-12" stroke="#333" stroke-width="1.8"/></g>
      <path id="fsRod" stroke="#5c3d1e" stroke-width="5" stroke-linecap="round" fill="none"/>
      <g id="fsReelG" transform="translate(${HAND.x - 4} ${HAND.y + 6})"><circle r="8" fill="#495057" stroke="#212529" stroke-width="2"/><line id="fsHandle" x1="0" y1="0" x2="0" y2="-8" stroke="#ffd43b" stroke-width="3" stroke-linecap="round"/></g>
      <g id="fsFishJ" opacity="0"></g>
      <g id="fsSplash"></g>
      <circle id="fsGlow" cx="130" cy="100" r="90" fill="url(#glowG)" opacity="0"/>
      <text id="fsBang" x="${FLOAT_X}" y="${SURF - 30}" text-anchor="middle" font-size="58" font-weight="900" fill="#ffd43b" stroke="#c92a2a" stroke-width="3" opacity="0">!</text>
      <text id="fsGot" x="130" y="60" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" stroke="#e8590c" stroke-width="4" paint-order="stroke" opacity="0">つれた!</text>
    </svg>
    <div class="fight-ui hidden" id="fsFightUI">
      <div class="fight-label" id="fsFightLabel">まきあげ メーター</div>
      <div class="fight-meter"><div class="fight-fill" id="fsFill"></div><span class="fight-fish" id="fsMeterFish">🐟</span></div>
    </div>
    <div class="big-warn hidden" id="fsWarn">⚠️ でかいのが きた!</div>
    <div class="tap-prompt hidden" id="fsTap">👆 タップ! タップ!<small>れんだ して リールを まこう</small></div>
    <div class="fish-hint" id="fsHint">タップで はやおくり</div>
    <div class="confetti" id="fsConfetti"></div>
    <div class="catch-card hidden" id="catchCard"></div>`;
  document.body.appendChild(ov);
  return ov;
}

const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (a, b, t) => a + (b - a) * t;

function rodPath(angleDeg, bend) {
  const a = (angleDeg * Math.PI) / 180;
  const tip = { x: HAND.x + ROD_LEN * Math.cos(a), y: HAND.y - ROD_LEN * Math.sin(a) };
  const mx = (HAND.x + tip.x) / 2 + Math.sin(a) * bend;
  const my = (HAND.y + tip.y) / 2 + Math.cos(a) * bend;
  return { d: `M ${HAND.x - 10 * Math.cos(a)} ${HAND.y + 10 * Math.sin(a)} L ${HAND.x} ${HAND.y} Q ${mx} ${my} ${tip.x} ${tip.y}`, tip };
}

let fishingBusy = false;
/* k = きょう なんびきめ か。onDone は けっかを とじた あとに よぶ */
function playCatch(k, caught, onDone) {
  const ov = ensureOverlay();
  const catchResult = rollFish(caught);
  const { sp } = catchResult;
  const isNew = !caught[sp.id];   // よびだしがわが すぐ ずかんに きろく するので、さきに きめておく
  const F = FIGHT[sp.tier];
  const big = sp.tier >= 3;
  fishingBusy = true;

  const $ = (id) => document.getElementById(id);
  const scene = $("fsScene"), rod = $("fsRod"), lineA = $("fsLineA"), lineB = $("fsLineB"), bob = $("fsBobber");
  const hook = $("fsHook"), fishU = $("fsFishU"), fishJ = $("fsFishJ"), shadow = $("fsShadow"), kid = $("fsKid"), arm = $("fsArm");
  const bang = $("fsBang"), got = $("fsGot"), glow = $("fsGlow"), ripples = $("fsRipples"), splash = $("fsSplash"), handle = $("fsHandle");
  const fightUI = $("fsFightUI"), fill = $("fsFill"), meterFish = $("fsMeterFish"), tapP = $("fsTap"), warn = $("fsWarn");
  const card = $("catchCard"), confetti = $("fsConfetti");
  [card, fightUI, tapP, warn].forEach((el) => el.classList.add("hidden"));
  $("fsHint").classList.remove("hidden");
  confetti.innerHTML = "";
  $("fsFightLabel").textContent = big ? "⚠️ おおもの! まきあげ メーター" : "まきあげ メーター";
  meterFish.textContent = big ? "🐋" : "🐟";
  const inner = `<g transform="translate(-60,-30)">${fishInner(sp, false)}</g>`;
  fishU.innerHTML = inner;
  fishJ.innerHTML = inner;
  [fishU, fishJ, shadow, hook, bang, got, glow].forEach((el) => el.setAttribute("opacity", "0"));
  bob.setAttribute("opacity", "1");
  ripples.innerHTML = "";
  splash.innerHTML = "";
  scene.style.transform = "";
  kid.setAttribute("transform", "");
  ov.classList.remove("hidden");

  // じょうたい: cast → sink → come → bite → fight → jump → result
  let state = "cast", t0 = performance.now();
  const go = (st) => { state = st; t0 = performance.now(); };
  let progress = 0, kick = 0, shake = 0, reelRot = 0, lastTap = 0, landed = false;
  let fishPos = { x: BAIT.x + 50 * F.scale, y: BAIT.y };
  const drops = Array.from({ length: 16 }, (_, i) => ({ a: Math.PI * (0.1 + 0.05 * i), v: 50 + Math.random() * 90 }));
  const played = {};
  const once = (key, fn) => { if (!played[key]) { played[key] = true; fn(); } };
  let raf = 0, last = performance.now(), finished = false;

  const putFish = (el, x, y, rot, sc) => el.setAttribute("transform", `translate(${x} ${y}) rotate(${rot}) scale(${sc})`);

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now - t0;
    let ang = 40, bend = 0, bx = FLOAT_X, by = SURF, showBob = true;
    let hookPos = null, lineEnd = null, lean = 0;

    if (state === "cast") {
      // ふりかぶって → まえへ なげる
      const p = Math.min(1, t / 800);
      ang = p < 0.3 ? lerp(52, 76, ease(p / 0.3)) : lerp(76, 40, ease((p - 0.3) / 0.7));   // がめんの うえに はみ出さない はんいで ふりかぶる
      bend = p < 0.3 ? 0 : -14 * Math.sin(Math.PI * (p - 0.3) / 0.7);
      lean = p < 0.3 ? -6 * ease(p / 0.3) : lerp(-6, 4, ease((p - 0.3) / 0.7));
      const tip = rodPath(ang, bend).tip;
      if (p < 0.4) { bx = tip.x; by = tip.y + 14; }
      else {
        once("cast", sfxCast);
        const q = ease((p - 0.4) / 0.6);
        bx = lerp(tip.x, FLOAT_X, q);
        by = lerp(tip.y, SURF, q) - 120 * Math.sin(Math.PI * q);
      }
      if (p >= 1) go("sink");
    } else if (state === "sink") {
      // しかけが しずんでいく
      once("plop", () => { sfxPlop(); addRipple(FLOAT_X); });
      const p = Math.min(1, t / 700);
      by = SURF + 2 * Math.sin(now / 120);
      hookPos = { x: FLOAT_X, y: lerp(SURF + 6, BAIT.y, ease(p)) };
      if (p >= 1) go("come");
    } else if (state === "come") {
      // さかなが よってくる。おおものは さきに でっかい かげ
      const dur = big ? 1500 : 1000;
      const p = Math.min(1, t / dur);
      by = SURF + 2 * Math.sin(now / 120);
      hookPos = { x: FLOAT_X, y: BAIT.y + 3 * Math.sin(now / 200) };
      const tx = BAIT.x + 50 * F.scale;
      if (big) {
        once("big", () => {
          sfxBig();
          warn.textContent = sp.tier >= 7 ? "🌈 うみが ひかってる…!?" : sp.tier >= 6 ? "🌀 まぼろしの けはい…!" : "⚠️ でかいのが きた!";
          warn.classList.toggle("rare", sp.tier >= 6);
          warn.classList.remove("hidden");
        });
        const sp2 = Math.min(1, p / 0.55);
        shadow.setAttribute("opacity", String(0.8 * Math.min(1, sp2 * 2) * (1 - Math.max(0, (p - 0.55) / 0.2))));
        shadow.setAttribute("transform", `translate(${lerp(330, tx + 20, ease(sp2))} ${BAIT.y + 30}) scale(${F.scale})`);
        shake = 0.25;
      }
      const fp = big ? Math.max(0, (p - 0.45) / 0.55) : p;
      const fx = lerp(330, tx, ease(fp));
      const fy = BAIT.y + 10 * Math.sin(fp * Math.PI * 2);
      fishU.setAttribute("opacity", fp > 0 ? "1" : "0");
      putFish(fishU, fx, fy, 4 * Math.sin(now / 90), F.scale);
      fishPos = { x: fx, y: fy };
      if (p >= 1) { warn.classList.add("hidden"); shadow.setAttribute("opacity", "0"); go("bite"); }
    } else if (state === "bite") {
      once("bite", () => { sfxBite(); bang.setAttribute("opacity", "1"); addRipple(FLOAT_X); });
      const p = t / 600;
      bang.setAttribute("transform", `translate(${FLOAT_X} ${SURF - 50}) scale(${1 + 0.25 * Math.sin(p * Math.PI * 4)}) translate(${-FLOAT_X} ${-(SURF - 50)})`);
      ang = 40 - 4 * Math.sin(p * Math.PI * 6); bend = 10;
      bx = FLOAT_X + 2 * Math.sin(now / 25); by = SURF + 8 + 3 * Math.sin(now / 40);
      const mx = BAIT.x + 50 * F.scale - 6 * Math.sin(p * Math.PI);
      putFish(fishU, mx, BAIT.y, 8 * Math.sin(now / 50), F.scale);
      fishPos = { x: mx, y: BAIT.y };
      hookPos = { x: mx - 50 * F.scale, y: BAIT.y + 1 };
      if (t > 600) {
        bang.setAttribute("opacity", "0");
        $("fsHint").classList.add("hidden");
        fightUI.classList.remove("hidden");
        tapP.classList.remove("hidden");
        go("fight");
      }
    } else if (state === "fight") {
      if (!landed) progress = Math.max(0, progress - F.back * dt);
      kick = Math.max(0, kick - dt * 4);
      shake = Math.max(0, shake - dt * 3);
      const q = progress / 100;
      const swim = F.swim * (1 - q * 0.4);
      const wob = Math.sin(now / (230 - sp.tier * 20));
      const fx = lerp(BAIT.x + 50 * F.scale, 150, q) + wob * swim;
      const fy = lerp(BAIT.y, SURF + 24, q) + Math.cos(now / 300) * 8;
      putFish(fishU, fx, fy, wob * 14 - 10 * q, F.scale);
      fishPos = { x: fx, y: fy };
      const mouth = { x: fx - 50 * F.scale * Math.cos((wob * 14 - 10 * q) * Math.PI / 180), y: fy - 50 * F.scale * Math.sin((wob * 14 - 10 * q) * Math.PI / 180) };
      hookPos = mouth;
      showBob = false;
      lineEnd = mouth;
      ang = 44 + 18 * q - 7 * kick; bend = 18 + 16 * kick + sp.tier * 3;
      lean = -5 - 6 * kick;
      if (Math.random() < dt * (1.5 + sp.tier)) addRipple(lerp(FLOAT_X, 150, q) + wob * 10);
      tapP.classList.toggle("idle", now - lastTap > 1200);
      fill.style.width = progress + "%";
      meterFish.style.left = progress + "%";
      if (landed) {
        fightUI.classList.add("hidden");
        tapP.classList.add("hidden");
        fishU.setAttribute("opacity", "0");
        go("jump");
      }
    } else if (state === "jump") {
      // ザバーン! と とびだして そらへ
      once("jump", () => { sfxSplash(); spawnSplash(); if (big) shake = 1; });
      shake = Math.max(0, shake - dt * 2);
      const p = Math.min(1, t / 900);
      const q = ease(p);
      const fx = lerp(fishPos.x, 130, q);
      const fy = lerp(SURF + 10, 112, q) - 70 * Math.sin(Math.PI * q);
      fishJ.setAttribute("opacity", "1");
      putFish(fishJ, fx, fy, lerp(-30, 360, q), lerp(F.scale, Math.max(1.3, F.scale * 1.15), q));
      showBob = false;
      lineEnd = { x: fx - 40, y: fy };
      ang = lerp(62, 74, q); bend = 26 * (1 - q); lean = -8 * (1 - q);
      updateSplash(p);
      if (p > 0.55) {
        once("got", () => { got.setAttribute("opacity", "1"); glow.setAttribute("opacity", "1"); sfxCatch(big, sp.tier >= 6); });
        const g = (p - 0.55) / 0.45;
        got.setAttribute("transform", `translate(130 60) scale(${0.6 + 0.5 * ease(Math.min(1, g * 2)) - 0.1 * Math.max(0, g * 2 - 1)}) translate(-130 -60)`);
        glow.setAttribute("transform", `translate(130 112) scale(${0.6 + 0.4 * Math.sin(now / 120)}) translate(-130 -100)`);
      }
      if (p >= 1 && t > 1250) { showResult(); return; }
    } else {
      return;
    }

    const r = rodPath(ang, bend);
    rod.setAttribute("d", r.d);
    arm.setAttribute("d", `M 44 ${SURF - 62} L ${HAND.x} ${HAND.y}`);
    kid.setAttribute("transform", `rotate(${lean} 38 ${SURF - 18})`);
    // いと:さおの さき → うき(すいめん)→ しかけ / さかなの くち
    if (lineEnd) {
      lineA.setAttribute("d", `M ${r.tip.x} ${r.tip.y} L ${lineEnd.x} ${lineEnd.y}`);
      lineB.setAttribute("d", "");
    } else {
      const sag = state === "cast" ? 0 : 18;
      lineA.setAttribute("d", `M ${r.tip.x} ${r.tip.y} Q ${(r.tip.x + bx) / 2} ${(r.tip.y + by) / 2 + sag} ${bx} ${by}`);
      lineB.setAttribute("d", hookPos ? `M ${bx} ${by + 6} L ${hookPos.x} ${hookPos.y - 6}` : "");
    }
    hook.setAttribute("opacity", hookPos && state !== "jump" ? "1" : "0");
    if (hookPos) hook.setAttribute("transform", `translate(${hookPos.x} ${hookPos.y})`);
    bob.setAttribute("opacity", showBob ? "1" : "0");
    bob.setAttribute("transform", `translate(${bx} ${by})`);
    handle.setAttribute("transform", `rotate(${reelRot})`);
    scene.style.transform = shake > 0 ? `translate(${(Math.random() - 0.5) * 9 * shake}px, ${(Math.random() - 0.5) * 9 * shake}px)` : "";
    raf = requestAnimationFrame(frame);
  }

  function addRipple(x) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    e.setAttribute("cx", x); e.setAttribute("cy", SURF + 3);
    e.setAttribute("class", "ripple");
    ripples.appendChild(e);
    if (ripples.childNodes.length > 8) ripples.removeChild(ripples.firstChild);
  }
  function spawnSplash() {
    splash.innerHTML = drops.map((_, i) => `<circle r="${i % 3 ? 3.5 : 5}" fill="#e3f6ff"/>`).join("");
  }
  function updateSplash(p) {
    const cs = splash.querySelectorAll("circle");
    cs.forEach((c, i) => {
      const d = drops[i];
      const tt = Math.min(1, p * 1.4);
      c.setAttribute("cx", fishPos.x + Math.cos(d.a) * d.v * tt * (i % 2 ? 1 : -1));
      c.setAttribute("cy", SURF - Math.sin(d.a) * d.v * tt + 130 * tt * tt);
      c.setAttribute("opacity", String(1 - tt));
    });
  }
  function burstConfetti() {
    const colors = ["#ffd43b", "#ff6b6b", "#4dabf7", "#69db7c", "#f783ac", "#ffa94d"];
    const n = sp.tier >= 6 ? 110 : big ? 60 : 30;
    confetti.innerHTML = Array.from({ length: n }, (_, i) =>
      `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 0.4).toFixed(2)}s;animation-duration:${(1.6 + Math.random()).toFixed(2)}s;transform:rotate(${(Math.random() * 360) | 0}deg)"></i>`).join("");
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
      if (big) shake = Math.min(1, shake + 0.35);
      sfxTick();
    } else if (state === "cast" || state === "sink" || state === "come") {
      // まちきれない ときは すぐ 「!」へ
      warn.classList.add("hidden"); shadow.setAttribute("opacity", "0");
      fishU.setAttribute("opacity", "1");
      bob.setAttribute("opacity", "1");
      go("bite");
    } else if (state === "jump") {
      showResult();
    }
  }

  function showResult() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    ov.removeEventListener("pointerdown", tap);
    scene.style.transform = "";
    if (!played.got) sfxCatch(big, sp.tier >= 6);
    burstConfetti();
    const tier = FISH_TIERS[sp.tier];
    card.innerHTML = `
      <div class="cc-badges">
        ${isNew ? '<span class="cc-new">NEW!</span>' : ""}
        ${sp.tier >= 6 ? '<span class="cc-lucky">きせき!!</span>' : sp.tier >= 4 ? '<span class="cc-lucky">すごい!</span>' : ""}
        <span class="cc-tier" style="background:${tier.color}">${tier.ic} ${tier.name}</span>
      </div>
      <div class="cc-fish">${fishSVG(sp, false, "big")}</div>
      <div class="cc-title">${sp.name} が つれた!</div>
      <div class="cc-size"><b>${catchResult.size}</b> cm</div>
      <div class="cc-sub">きょう ${k}ひきめ${sp.tier >= 3 ? ` ・ ${tier.rate}% の おおあたり!` : ""}</div>
      <button class="cc-btn" id="ccNext">つぎへ ▶</button>`;
    card.classList.toggle("rare", sp.tier >= 6);
    card.classList.remove("hidden");
    $("ccNext").addEventListener("click", (e) => {
      e.stopPropagation();
      ov.classList.add("hidden");
      confetti.innerHTML = "";
      fishingBusy = false;
      onDone(catchResult);
    }, { once: true });
  }

  ov.addEventListener("pointerdown", tap);
  raf = requestAnimationFrame(frame);
  return catchResult;
}
