/* =========================================================
   えいごクラフト 5きゅう - app.js
   Ⓐ れんしゅう(はんい・15ごずつ)→ 3かい せいかいで Ⓑへ そつぎょう
   Ⓑ ようびボックス(7こ)→ その ようびに ふくしゅう。まちがえたら Ⓐへ もどる
   ========================================================= */

const EXAM_DATE = new Date(2026, 9, 4);   // 2026/10/4
const KEY = "eigo_craft_v3";
const MASTER_COUNT = 3;                    // これだけ せいかいすると Ⓑへ そつぎょう

/* ---------- ほぞん ---------- */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
  if (!d) d = {};
  return {
    blocks: d.blocks || 0,
    chests: d.chests || 0,
    xp: d.xp || 0,
    level: d.level || 0,
    streak: d.streak || { n: 0, last: null },
    mastery: d.mastery || {},   // wordId -> 0..2 (Aでの れんぞく せいかいすう)
    box: d.box || {},           // wordId -> weekday(0-6) そつぎょうずみ
    lastRange: d.lastRange || 1,
    answerMode: d.answerMode === "type" ? "type" : "choice", // こたえかた
    bossDefeated: d.bossDefeated || 0,   // たおした ボスの かず
    bossDrops: d.bossDrops || [],        // てにいれた ドロップ(アイコン)
  };
}

let P = load();
function save() { localStorage.setItem(KEY, JSON.stringify(P)); }

const TOTAL = WORD_LIST.length;

function wordsStillLearning(ids) { return ids.filter((id) => P.box[id] === undefined); }
function wordsInBox(day) {
  return WORD_LIST.filter((w) => P.box[w.id] === day);
}
function boxedCount() { return Object.keys(P.box).length; }

function bumpStreak() {
  const t = today();
  if (P.streak.last === t) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const ys = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  P.streak.n = P.streak.last === ys ? P.streak.n + 1 : 1;
  P.streak.last = t;
  save();
}

/* ---------- おと(WebAudio) ---------- */
let actx = null;
function beep(freq, dur = 0.08, type = "square", vol = 0.06) {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + dur);
  } catch (e) { /* おとが 出せなくても すすめる */ }
}
const sfxClick = () => beep(600, 0.06);
const sfxOk = () => { beep(880, 0.08); setTimeout(() => beep(1320, 0.12), 70); };
const sfxNg = () => beep(160, 0.25, "sawtooth", 0.05);
const sfxLevel = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.14), i * 90)); };
const sfxChest = () => { beep(300, 0.1); setTimeout(() => beep(500, 0.1), 90); setTimeout(() => beep(700, 0.2), 180); };
const sfxGraduate = () => { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => beep(f, 0.1, "triangle"), i * 70)); };

/* ---------- はつおん ----------
   Androidは たんまつに はいっている おんせいエンジンしだいで
   ロボットっぽい こえに なりやすい。「Googleの ネットワークおんせい」を
   さいゆうせんで えらび、それが なければ ローカルの きこえを つかう。
------------------------------- */
let voices = [];
function voiceScore(v, langPrefix) {
  let s = 0;
  if (new RegExp("^" + langPrefix, "i").test(v.lang)) s += 10; else return -1;
  if (langPrefix === "en" && v.lang.toLowerCase() === "en-us") s += 20;
  if (/google/i.test(v.name)) s += 50;
  if (v.localService === false) s += 15;
  if (langPrefix === "en" && /us english/i.test(v.name)) s += 10;
  if (/compact|espeak|pico/i.test(v.name)) s -= 30;
  return s;
}
function pickVoice(langPrefix = "en") {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const candidates = voices.map((v) => ({ v, s: voiceScore(v, langPrefix) })).filter((x) => x.s >= 0);
  candidates.sort((a, b) => b.s - a.s);
  return candidates.length ? candidates[0].v : null;
}
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function makeUtterance(text, langPrefix, rate) {
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(langPrefix);
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = langPrefix === "ja" ? "ja-JP" : "en-US"; }
  u.rate = rate;
  u.pitch = 1.0;
  return u;
}
function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(makeUtterance(text, "en", rate));
}
/* えいご→にほんご の じゅんに つづけて よむ(れいぶんを セットで おぼえる) */
function speakPair(en, ja) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const uEn = makeUtterance(en, "en", 0.85);
  uEn.onend = () => {
    window.speechSynthesis.speak(makeUtterance(ja, "ja", 0.95));
  };
  window.speechSynthesis.speak(uEn);
}

/* ---------- エフェクト ---------- */
function orbs(n = 6, emoji = "🟢") {
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "orb";
    el.textContent = emoji;
    el.style.left = 20 + Math.random() * 60 + "vw";
    el.style.top = 40 + Math.random() * 30 + "vh";
    el.style.animationDelay = i * 0.06 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}
function blockBreak(x, y, color = "#5EA827") {
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.background = color;
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--dx", (Math.random() - 0.5) * 160 + "px");
    p.style.setProperty("--dy", (Math.random() - 0.5) * 160 + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}
function advancement(name, icon = "🏆", head = "しんちょくの たっせい!") {
  const el = document.getElementById("adv");
  document.getElementById("advIc").textContent = icon;
  document.getElementById("advHead").textContent = head;
  document.getElementById("advName").textContent = name;
  el.classList.remove("hidden");
  clearTimeout(advancement._t);
  advancement._t = setTimeout(() => el.classList.add("hidden"), 3200);
}

/* ---------- がめん きりかえ ---------- */
const S = {};
["home", "ranges", "wordlist", "boxes", "learn", "quiz", "result", "stats", "wrong", "typing", "boss"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});
function show(name) {
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, ranges: renderRanges, boxes: renderBoxes, stats: renderStats }[name] || (() => {}))();
}

/* ---------- HUD ---------- */
function updateHUD() {
  document.getElementById("blockCount").textContent = P.blocks;
  document.getElementById("chestCount").textContent = P.chests;
  document.getElementById("streakCount").textContent = P.streak.n;
  document.getElementById("xpLevel").textContent = P.level;
  const need = 10 + P.level * 2;
  document.getElementById("xpFill").style.width = Math.min(100, (P.xp / need) * 100) + "%";
}
function addXP(n) {
  P.xp += n;
  let leveled = false;
  while (P.xp >= 10 + P.level * 2) {
    P.xp -= 10 + P.level * 2;
    P.level++;
    leveled = true;
  }
  save();
  updateHUD();
  if (leveled) {
    sfxLevel();
    advancement(`レベル ${P.level} に なった!`, "⬆️", "レベルアップ!");
  }
}

/* ---------- ホーム ---------- */
function renderHome() {
  updateHUD();

  renderAnswerMode();
  const nextBoss = bossAt(P.bossDefeated);
  document.getElementById("bossHomeIcon").textContent = nextBoss.icon;
  document.getElementById("bossHomeSub").textContent =
    `${nextBoss.name}(HP ${nextBoss.hp})・たおした ボス ${P.bossDefeated}たい`;

  document.getElementById("typingModeSub").textContent =
    `ごうかくに ひつような たんごを ランダムで(${TYPING_BATCH_SIZE}ご)`;

  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.ceil((EXAM_DATE - t) / 86400000));
  document.getElementById("daysLeft").textContent = days;

  const boxed = boxedCount();
  const coreBoxed = WORD_LIST.filter((w) => CORE_WORD_IDS.has(w.id) && P.box[w.id] !== undefined).length;
  const coreRemain = CORE_WORD_IDS.size - coreBoxed;
  const bonusRemain = TOTAL - CORE_WORD_IDS.size - (boxed - coreBoxed);
  const pace = document.getElementById("paceMessage");
  if (coreRemain <= 0) {
    pace.textContent = bonusRemain <= 0
      ? "🎉 ぜんぶ ボックスに はいったよ!かんぺき!"
      : `🎯 ごうかくラインは クリア!のこり ➕ボーナス ${bonusRemain}ご、よゆうが あれば どうぞ。`;
  } else if (days <= 0) {
    pace.textContent = "きょうが ほんばん!いままでの ちからを ぜんぶ 出そう!";
  } else {
    const perDay = Math.max(1, Math.ceil(coreRemain / days));
    pace.textContent = `🎯ごうかくラインまで のこり ${coreRemain}ご。1日に ${perDay}ごで まにあうよ!`;
  }

  const wd = new Date().getDay();
  const todayInfo = WEEKDAYS.find((w) => w.day === wd);
  const todayCount = wordsInBox(wd).length;
  document.getElementById("todayBoxLabel").textContent = `${todayInfo.icon} きょう(${todayInfo.label})の ふくしゅう`;
  const notif = document.getElementById("boxNotif");
  notif.textContent = todayCount;
  notif.classList.toggle("hidden", todayCount === 0);

  const started = WORD_LIST.filter((w) => P.box[w.id] !== undefined || (P.mastery[w.id] || 0) > 0).length;
  renderRankBadge("a", started);
  renderRankBadge("b", boxed);
}

function renderRankBadge(prefix, count) {
  const info = tierInfo(count, TOTAL);
  document.getElementById(`${prefix}RankBadge`).textContent = info.tier.icon;
  document.getElementById(`${prefix}RankBadge`).style.background = info.tier.color;
  document.getElementById(`${prefix}RankName`).textContent = info.tier.name;
  document.getElementById(`${prefix}RankBar`).style.width = info.pct + "%";
  const foot = document.getElementById(`${prefix}RankFoot`);
  if (info.nextTier) {
    foot.textContent = `${count} / ${TOTAL}ご ・ あと${info.nextNeed - count}ごで ${info.nextTier.icon}${info.nextTier.name}!`;
  } else {
    foot.textContent = `${count} / ${TOTAL}ご ・ さいこう ランク!`;
  }
}

/* ---------- Ⓐ はんいえらび ---------- */
function renderRanges() {
  const wrap = document.getElementById("rangeGrid");
  wrap.innerHTML = "";
  const sorted = RANGES.slice().sort((a, b) => (a.bonus === b.bonus ? a.id - b.id : a.bonus ? 1 : -1));
  let dividerShown = false;
  sorted.forEach((r) => {
    if (r.bonus && !dividerShown) {
      dividerShown = true;
      const div = document.createElement("div");
      div.className = "range-divider";
      div.textContent = "── ここから ➕ボーナス(よゆうが あれば) ──";
      wrap.appendChild(div);
    }
    const ws = wordsInRange(r.id);
    const done = ws.filter((w) => P.box[w.id] !== undefined).length;
    const points = ws.reduce((sum, w) => sum + (P.box[w.id] !== undefined ? MASTER_COUNT : P.mastery[w.id] || 0), 0);
    const maxPoints = ws.length * MASTER_COUNT;
    const pct = (points / maxPoints) * 100;
    const untouched = points === 0;
    const finished = done === ws.length;
    const status = finished ? "✅ かんりょう" : untouched ? "🆕 みはじめ" : "✏️ とちゅう";
    const el = document.createElement("div");
    el.className =
      "range-card" + (finished ? " done" : "") + (r.bonus ? " bonus" : "") + (untouched ? " untouched" : "");
    el.innerHTML = `
      <div class="range-tag">${r.bonus ? "➕ ボーナス" : "🎯 ごうかく"}</div>
      <div class="range-status">${status}</div>
      <div class="range-title">${r.title}</div>
      <div class="range-sub">${ws[0].en} 〜 ${ws[ws.length - 1].en}</div>
      <div class="mc-bar"><div class="mc-bar-fill" style="width:${pct}%"></div></div>
      <div class="range-foot">${done}/${ws.length}ご ボックスへ</div>
    `;
    el.addEventListener("click", () => {
      sfxClick();
      renderWordlist(r.id);
    });
    wrap.appendChild(el);
  });
}

/* ---------- Ⓐ たんごいちらん(カウントの かくにん) ---------- */
let currentWordlistRange = 1;
function promoteToBox(id) {
  delete P.mastery[id];
  P.box[id] = new Date().getDay();
  save();
  updateHUD();
}

function renderWordlist(rangeId) {
  currentWordlistRange = rangeId;
  const r = RANGES[rangeId - 1];
  document.getElementById("wordlistTitle").textContent = `📋 ${r.title}`;

  const wrap = document.getElementById("wordList");
  wrap.innerHTML = "";
  let anyUnboxed = false;
  wordsInRange(rangeId).forEach((w) => {
    const boxed = P.box[w.id] !== undefined;
    const n = P.mastery[w.id] || 0;
    const el = document.createElement("div");
    el.className = "word-row" + (boxed ? " boxed" : "");
    let statusHTML;
    if (boxed) {
      const info = WEEKDAYS.find((d) => d.day === P.box[w.id]);
      statusHTML = `<span class="word-boxed-tag">${info.icon} ${info.label}よう Ⓑ</span>`;
    } else {
      anyUnboxed = true;
      let dots = "";
      for (let i = 0; i < MASTER_COUNT; i++) dots += `<span class="dot small${i < n ? " on" : ""}"></span>`;
      statusHTML = `<span class="word-dots">${dots}</span><button class="skip-btn" data-id="${w.id}">✅ しってる</button>`;
    }
    el.innerHTML = `
      <div class="word-ic">${w.emoji}</div>
      <div class="word-body">
        <div class="word-en">No.${w.no} ${w.en}</div>
        <div class="word-ja">${w.ja}</div>
      </div>
      ${statusHTML}
    `;
    wrap.appendChild(el);
  });

  wrap.querySelectorAll(".skip-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      sfxGraduate();
      promoteToBox(Number(b.dataset.id));
      renderWordlist(rangeId);
    });
  });

  document.getElementById("btnWordlistSkipAll").classList.toggle("hidden", !anyUnboxed);
  show("wordlist");
}
document.getElementById("btnWordlistBack").addEventListener("click", () => show("ranges"));
document.getElementById("btnWordlistSkipAll").addEventListener("click", () => {
  const ids = wordsStillLearning(wordsInRange(currentWordlistRange).map((w) => w.id));
  if (ids.length === 0) return;
  if (!confirm(`この${ids.length}ごを ぜんぶ「しってる」として Ⓑへ うつしますか?`)) return;
  ids.forEach((id) => promoteToBox(id));
  sfxGraduate();
  renderWordlist(currentWordlistRange);
});
document.getElementById("btnWordlistStart").addEventListener("click", () => {
  sfxClick();
  P.lastRange = currentWordlistRange;
  save();
  startLearn(currentWordlistRange);
});

/* ---------- Ⓑ ようびボックス ---------- */
function renderBoxes() {
  const wrap = document.getElementById("boxGrid");
  wrap.innerHTML = "";
  const wd = new Date().getDay();
  WEEKDAYS.forEach((info) => {
    const ws = wordsInBox(info.day);
    const isToday = info.day === wd;
    const el = document.createElement("div");
    el.className = "box-card" + (isToday ? " today" : "") + (ws.length === 0 ? " empty" : "");
    el.innerHTML = `
      <div class="box-ic">${info.icon}</div>
      <div class="box-label">${info.label}よう${isToday ? "<span class='box-today-tag'>きょう</span>" : ""}</div>
      <div class="box-count">${ws.length}ご</div>
    `;
    if (ws.length > 0) {
      el.addEventListener("click", () => { sfxClick(); startBoxQuiz(info.day); });
    }
    wrap.appendChild(el);
  });
}

/* ---------- おぼえる(カード) ---------- */
let L = { range: 1, words: [], i: 0, flipped: false };

function startLearn(rangeId) {
  const ws = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_LIST[id]);
  if (ws.length === 0) {
    advancement("この はんいは ぜんぶ ボックスに あるよ!", "🎉", "コンプリート!");
    show("ranges");
    return;
  }
  L = { range: rangeId, words: ws, i: 0, flipped: false };
  document.getElementById("learnZoneTag").textContent = `Ⓐ ${RANGES[rangeId - 1].title}`;
  show("learn");
  renderCard();
}

function visHTML(vis) {
  if (!vis) return "";
  if (vis.svg) {
    return `<div class="vis-svg-wrap">${vis.svg}</div><div class="vis-label">${vis.label}</div>`;
  }
  const cells = vis.icons
    .map((ic, i) => `<div class="vis-cell${vis.hi && vis.hi.includes(i) ? " hi" : ""}">${ic}</div>`)
    .join("");
  return `<div class="vis-row">${cells}</div><div class="vis-label">${vis.label}</div>`;
}

function renderCard() {
  const w = L.words[L.i];
  L.flipped = false;

  document.getElementById("cardNo").textContent = `No.${w.no}`;
  document.getElementById("cardEn").textContent = w.en;
  document.getElementById("cardSlotQ").textContent = "❓";
  document.getElementById("cardEnBack").textContent = w.en;
  document.getElementById("cardEmoji").textContent = w.emoji;
  document.getElementById("cardJa").textContent = w.ja;
  document.getElementById("cardEx").innerHTML =
    `<span class="card-ex-en" id="cardExEn">🔊 ${w.ex}</span><br>${w.exJa}`;
  document.getElementById("cardExEn").addEventListener("click", (e) => {
    e.stopPropagation();
    speakPair(w.ex, w.exJa);
  });

  const vis = document.getElementById("cardVis");
  if (w.vis) { vis.innerHTML = visHTML(w.vis); vis.classList.remove("hidden"); }
  else { vis.classList.add("hidden"); }

  document.getElementById("cardFront").classList.remove("hidden");
  document.getElementById("cardBack").classList.add("hidden");
  document.getElementById("learnPos").textContent = `${L.i + 1} / ${L.words.length}`;

  const last = L.i === L.words.length - 1;
  document.getElementById("btnGoQuiz").classList.toggle("hidden", !last);
  document.getElementById("btnNext").textContent = last ? "さいしょへ" : "つぎ ▶";

  speak(w.en);
}

function flipCard() {
  const w = L.words[L.i];
  L.flipped = !L.flipped;
  document.getElementById("cardFront").classList.toggle("hidden", L.flipped);
  document.getElementById("cardBack").classList.toggle("hidden", !L.flipped);
  if (L.flipped) { sfxClick(); speak(w.en); }
}

document.getElementById("card").addEventListener("click", (e) => {
  if (e.target.closest(".sound-btn")) return;
  flipCard();
});
document.getElementById("btnSpeak").addEventListener("click", () => speak(L.words[L.i].en));
document.getElementById("btnSpeak2").addEventListener("click", () => speak(L.words[L.i].en));
document.getElementById("btnPrev").addEventListener("click", () => {
  if (L.i > 0) { L.i--; sfxClick(); renderCard(); }
});
document.getElementById("btnNext").addEventListener("click", () => {
  L.i = L.i < L.words.length - 1 ? L.i + 1 : 0;
  sfxClick();
  renderCard();
});
document.getElementById("btnGoQuiz").addEventListener("click", () => startQuiz(L.range, "A"));

/* ---------- クイズ(Ⓐ・Ⓑ きょうつう) ---------- */
let Q = null;

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function startQuiz(rangeId, mode) {
  const pool = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_LIST[id]);
  Q = { mode, rangeId, words: shuffle(pool), i: 0, correct: 0, combo: 0, graduated: [], wrong: [], locked: false };
  document.getElementById("quizTotal").textContent = Q.words.length;
  show("quiz");
  renderQuiz();
}

function startBoxQuiz(day) {
  const pool = wordsInBox(day);
  Q = { mode: "B", day, words: shuffle(pool), i: 0, correct: 0, combo: 0, demoted: [], wrong: [], locked: false };
  document.getElementById("quizTotal").textContent = Q.words.length;
  show("quiz");
  renderQuiz();
}

/* ---------- ⌨️ タイピングれんしゅう(Ⓑの単語だけ、Ⓑの状態は かえない) ---------- */
let TY = null;

const TYPING_BATCH_SIZE = 15;

function startTyping() {
  const pool = shuffle(WORD_LIST.filter((w) => CORE_WORD_IDS.has(w.id))).slice(0, TYPING_BATCH_SIZE);
  if (pool.length === 0) return;
  TY = { words: pool, i: 0, correct: 0, locked: false };
  document.getElementById("typingTotal").textContent = TY.words.length;
  document.getElementById("typingResult").classList.add("hidden");
  show("typing");
  renderTyping();
}

function normalizeTyped(s) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ---------- にほんごの こたえあわせ ----------
   カタカナ→ひらがな、ぜんかく→はんかく、スペース・くとうてん・
   「～」を むしして くらべる。「,」「/」で わかれた どの こたえでも OK。
   かっこ ( ) [ ] の 中は あっても なくても OK。
   かんじの こたえには words-data.js の kana(よみ)も つかう。
------------------------------------------------ */
function toHiragana(s) {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}
function normalizeJa(s) {
  return toHiragana(String(s))
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .toLowerCase()
    .replace(/[\s　]/g, "")
    .replace(/[～~ー－ｰ。、，・…]/g, "")
    .trim();
}
function jaAnswerSet(w) {
  const out = new Set();
  const add = (v) => { const n = normalizeJa(v); if (n) out.add(n); };
  String(w.ja).split(/[,、/／]/).forEach((part) => {
    const p = part.trim();
    if (!p) return;
    add(p);
    add(p.replace(/[（(\[][^）)\]]*[）)\]]/g, ""));  // かっこの 中を とる
    add(p.replace(/[（()）\[\]]/g, ""));             // かっこだけ とる
  });
  (w.kana || []).forEach(add);
  return out;
}
function isJaCorrect(typed, w) {
  const t = normalizeJa(typed);
  return t.length > 0 && jaAnswerSet(w).has(t);
}

function renderTyping() {
  const w = TY.words[TY.i];
  TY.locked = false;
  document.getElementById("typingPos").textContent = TY.i + 1;
  document.getElementById("typingBar").style.width = (TY.i / TY.words.length) * 100 + "%";
  document.getElementById("typingSlot").textContent = w.emoji;
  document.getElementById("typingJa").textContent = w.ja;
  const input = document.getElementById("typingInput");
  input.value = "";
  input.className = "typing-input";
  document.getElementById("typingFeedback").classList.add("hidden");
  setTimeout(() => input.focus(), 50);
}

function submitTyping() {
  if (!TY || TY.locked) return;
  const w = TY.words[TY.i];
  const input = document.getElementById("typingInput");
  const typed = normalizeTyped(input.value);
  if (!typed) return;
  TY.locked = true;
  const ok = typed === normalizeTyped(w.en);

  const fb = document.getElementById("typingFeedback");
  fb.classList.remove("hidden", "ok", "ng");

  if (ok) {
    TY.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    input.className = "typing-input ok";
    const r = input.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#5EA827");
    fb.classList.add("ok");
    fb.innerHTML = "⛏️ せいかい!";
  } else {
    sfxNg();
    input.className = "typing-input ng";
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 おしい!<span class="fb-ja">せいかいは 「${w.en}」だよ</span>`;
  }
  speak(w.en);

  setTimeout(() => {
    TY.i++;
    if (TY.i >= TY.words.length) {
      document.getElementById("typingBar").style.width = "100%";
      finishTyping();
    } else {
      renderTyping();
    }
  }, ok ? 1000 : 2000);
}

function finishTyping() {
  bumpStreak();
  document.getElementById("typingScore").textContent = TY.correct;
  document.getElementById("typingResultTotal").textContent = TY.words.length;
  document.getElementById("typingResult").classList.remove("hidden");
  if (TY.correct === TY.words.length) {
    sfxChest();
    orbs(10, "💎");
    advancement("タイピング ぜんもん せいかい!", "⌨️", "すごい!");
  }
}

document.getElementById("btnTypingMode").addEventListener("click", () => { sfxClick(); startTyping(); });
document.getElementById("btnTypingSubmit").addEventListener("click", submitTyping);
document.getElementById("typingInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitTyping();
});
document.getElementById("btnTypingRetry").addEventListener("click", () => { sfxClick(); startTyping(); });
document.getElementById("btnTypingHome").addEventListener("click", () => { sfxClick(); show("home"); });

/* ---------- ⚔️ ボスバトル ----------
   せいかい = ボスに 1ダメージ / まちがい = じぶんが 1ダメージ。
   ボスの HPを 0に すると げきは!レアな ドロップが もらえる。
   Ⓐ・Ⓑの きろくは かわらない(いつでも あそべる ちょうせんモード)。
---------------------------------- */
const BOSS_HEARTS = 3;
let BS = null;

function startBoss() {
  const boss = bossAt(P.bossDefeated);
  const pool = shuffle(WORD_LIST.filter((w) => CORE_WORD_IDS.has(w.id)));
  BS = { boss, hp: boss.hp, hearts: BOSS_HEARTS, words: pool, i: 0, locked: false, hits: 0 };

  document.getElementById("bossIcon").textContent = boss.icon;
  document.getElementById("bossIcon").className = "boss-icon";
  document.getElementById("bossName").textContent =
    `${boss.name}${boss.loop > 0 ? ` (つよさ +${boss.loop})` : ""}`;
  document.getElementById("bossHpMax").textContent = boss.hp;
  document.getElementById("bossStage").style.background = "#1A1420";
  document.getElementById("bossResult").classList.add("hidden");
  document.getElementById("bossQuestion").classList.remove("hidden");
  show("boss");
  renderBossHp();
  renderBossQuestion();
}

function renderBossHp() {
  document.getElementById("bossHpNow").textContent = BS.hp;
  document.getElementById("bossHpFill").style.width = (BS.hp / BS.boss.hp) * 100 + "%";
  const wrap = document.getElementById("bossHearts");
  wrap.innerHTML = "";
  for (let i = 0; i < BOSS_HEARTS; i++) {
    const s = document.createElement("span");
    s.className = "heart" + (i < BS.hearts ? "" : " lost");
    s.textContent = "❤️";
    wrap.appendChild(s);
  }
}

function renderBossQuestion() {
  const w = BS.words[BS.i];
  BS.locked = false;
  document.getElementById("bossFeedback").classList.add("hidden");

  const typeMode = isTypeMode();
  const choicesWrap = document.getElementById("bossChoices");
  const typeWrap = document.getElementById("bossTypeWrap");
  choicesWrap.classList.toggle("hidden", typeMode);
  typeWrap.classList.toggle("hidden", !typeMode);
  document.getElementById("btnBossSpeak").classList.remove("hidden");

  if (typeMode) {
    document.getElementById("bossLabel").textContent = "えと はつおんを きいて、にほんごで かこう";
    document.getElementById("bossSlot").textContent = w.emoji;
    document.getElementById("bossEn").textContent = w.en;
    const input = document.getElementById("bossInput");
    input.value = "";
    input.className = "typing-input";
    setTimeout(() => input.focus(), 50);
    speak(w.en);
  } else {
    document.getElementById("bossLabel").textContent = "この たんごの いみは?";
    document.getElementById("bossSlot").textContent = "❓";
    document.getElementById("bossEn").textContent = w.en;
    choicesWrap.innerHTML = "";
    buildChoices(w).forEach((c) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = c.ja;
      b.addEventListener("click", () => bossAnswer(b, c.id === w.id, w));
      choicesWrap.appendChild(b);
    });
    speak(w.en);
  }
}

function bossAnswer(btn, ok, w) {
  if (BS.locked) return;
  BS.locked = true;

  if (!isTypeMode()) {
    document.querySelectorAll("#bossChoices .choice").forEach((b) => {
      if (b.textContent === w.ja) b.classList.add("ok");
      else b.classList.add("dim");
    });
    if (!ok) btn.classList.add("ng");
  }
  document.getElementById("bossSlot").textContent = w.emoji;

  const fb = document.getElementById("bossFeedback");
  fb.classList.remove("hidden", "ok", "ng");
  const icon = document.getElementById("bossIcon");

  if (ok) {
    BS.hp--;
    BS.hits++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    icon.classList.remove("hit");
    void icon.offsetWidth;
    icon.classList.add("hit");
    const r = icon.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#E03434");
    fb.classList.add("ok");
    fb.innerHTML = `⚔️ こうげき せいこう!<span class="fb-ja">${BS.boss.name}に 1ダメージ!</span>`;
  } else {
    BS.hearts--;
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💥 はんげきを うけた!<span class="fb-ja">${w.emoji} ${w.en} = ${w.ja}</span>`;
    speak(w.en);
  }
  renderBossHp();

  setTimeout(() => {
    if (BS.hp <= 0) { bossWin(); return; }
    if (BS.hearts <= 0) { bossLose(); return; }
    BS.i = (BS.i + 1) % BS.words.length;
    renderBossQuestion();
  }, ok ? 950 : 1900);
}

function submitBossTyped() {
  if (!BS || BS.locked) return;
  const w = BS.words[BS.i];
  const input = document.getElementById("bossInput");
  if (!input.value.trim()) return;
  const ok = isJaCorrect(input.value, w);
  input.className = "typing-input " + (ok ? "ok" : "ng");
  bossAnswer(input, ok, w);
}

function bossEnd(title, icon, msg, loot, won) {
  document.getElementById("bossQuestion").classList.add("hidden");
  document.getElementById("bossChoices").classList.add("hidden");
  document.getElementById("bossTypeWrap").classList.add("hidden");
  document.getElementById("bossFeedback").classList.add("hidden");
  document.getElementById("bossResultIcon").textContent = icon;
  document.getElementById("bossResultTitle").textContent = title;
  document.getElementById("bossResultMsg").innerText = msg;
  document.getElementById("bossLoot").innerHTML = loot
    .map((l) => `<div class="loot-item"><span>${l.ic}</span><span>${l.t}</span></div>`)
    .join("");
  document.getElementById("btnBossNext").classList.toggle("hidden", !won);
  document.getElementById("bossResult").classList.remove("hidden");
}

function bossWin() {
  bumpStreak();
  const b = BS.boss;
  document.getElementById("bossIcon").classList.add("dead");
  P.bossDefeated++;
  P.chests++;
  P.bossDrops.push(b.drop);
  save();
  addXP(b.hp * 3);
  updateHUD();
  sfxChest();
  orbs(12, "💎");
  advancement(`${b.name} を たおした!`, b.icon, "ボス げきは!");

  const next = bossAt(P.bossDefeated);
  bossEnd(
    `🏆 ${b.name} を たおした!`,
    b.icon,
    `つぎは ${next.icon} ${next.name}(HP ${next.hp})が まってるぞ!`,
    [{ ic: b.drop, t: b.dropName }, { ic: "🧰", t: "チェスト ×1" }, { ic: "🟩", t: `ブロック ×${BS.hits}` }],
    true
  );
}

function bossLose() {
  bumpStreak();
  addXP(BS.hits);
  bossEnd(
    "💀 やられて しまった…",
    "💀",
    `${BS.boss.name}に あと ${BS.hp} ダメージ だったのに!\nもういちど ちょうせん しよう。`,
    [{ ic: "🟩", t: `ブロック ×${BS.hits}` }],
    false
  );
}

document.getElementById("btnBossSubmit").addEventListener("click", submitBossTyped);
document.getElementById("bossInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBossTyped();
});
document.getElementById("btnBossSpeak").addEventListener("click", () => BS && speak(BS.words[BS.i].en));
document.getElementById("btnBossNext").addEventListener("click", () => { sfxClick(); startBoss(); });
document.getElementById("btnBossRetry").addEventListener("click", () => { sfxClick(); startBoss(); });
document.getElementById("btnBossHome").addEventListener("click", () => { sfxClick(); show("home"); });
document.getElementById("btnBoss").addEventListener("click", () => { sfxClick(); startBoss(); });

/* ---------- こたえかたの きりかえ(4たく ⇄ にゅうりょく) ---------- */
function renderAnswerMode() {
  const typeMode = isTypeMode();
  document.getElementById("answerModeIcon").textContent = typeMode ? "⌨️" : "🔘";
  document.getElementById("answerModeName").textContent = typeMode ? " にゅうりょく" : " 4たく";
}
document.getElementById("btnAnswerMode").addEventListener("click", () => {
  sfxClick();
  P.answerMode = isTypeMode() ? "choice" : "type";
  save();
  renderAnswerMode();
  advancement(
    isTypeMode() ? "にほんごを じぶんで かく モード" : "4つから えらぶ モード",
    isTypeMode() ? "⌨️" : "🔘",
    "こたえかたを かえた!"
  );
});

function renderMasteryTag(w) {
  const tag = document.getElementById("masteryTag");
  if (Q.mode === "B") { tag.textContent = "📦 ボックスの ふくしゅう"; return; }
  const n = P.mastery[w.id] || 0;
  tag.textContent = `せいかい ${n}/${MASTER_COUNT}`;
}

function renderDots(w) {
  const wrap = document.getElementById("dots");
  wrap.innerHTML = "";
  if (Q.mode === "B") { wrap.classList.add("hidden"); return; }
  wrap.classList.remove("hidden");
  const n = P.mastery[w.id] || 0;
  for (let i = 0; i < MASTER_COUNT; i++) {
    const d = document.createElement("span");
    d.className = "dot" + (i < n ? " on" : "");
    wrap.appendChild(d);
  }
}

/* 4たくの せんたくしを つくる(まちがいは ちかい ばんごうから) */
function buildChoices(w) {
  const pool = WORD_LIST.filter((x) => x.id !== w.id && x.ja !== w.ja);
  const near = pool.filter((x) => Math.abs(x.no - w.no) <= 20);
  const wrongs = shuffle(near.length >= 3 ? near : pool).slice(0, 3);
  return shuffle([w, ...wrongs]);
}

const isTypeMode = () => P.answerMode === "type";

function renderQuiz() {
  const w = Q.words[Q.i];
  Q.locked = false;

  renderMasteryTag(w);
  renderDots(w);
  document.getElementById("quizPos").textContent = Q.i + 1;
  document.getElementById("quizBar").style.width = (Q.i / Q.words.length) * 100 + "%";
  document.getElementById("feedback").classList.add("hidden");

  const cb = document.getElementById("combo");
  cb.classList.toggle("hidden", Q.combo < 2);
  document.getElementById("comboNum").textContent = Q.combo;

  const typeMode = isTypeMode();
  const choicesWrap = document.getElementById("choices");
  const typeWrap = document.getElementById("quizTypeWrap");
  choicesWrap.classList.toggle("hidden", typeMode);
  typeWrap.classList.toggle("hidden", !typeMode);
  document.getElementById("btnQuizSpeak").classList.remove("hidden");

  if (typeMode) {
    // にゅうりょくモード: え と はつおんを きいて にほんごを かく
    document.getElementById("quizLabel").textContent = "えと はつおんを きいて、にほんごで かこう";
    document.getElementById("quizSlot").textContent = w.emoji;
    document.getElementById("quizEn").textContent = w.en;
    const input = document.getElementById("quizInput");
    input.value = "";
    input.className = "typing-input";
    setTimeout(() => input.focus(), 50);
    speak(w.en);
  } else {
    // 4たくモード: えいごを きいて いみを えらぶ
    document.getElementById("quizLabel").textContent = "この たんごの いみは?";
    document.getElementById("quizSlot").textContent = "❓";
    document.getElementById("quizEn").textContent = w.en;
    choicesWrap.innerHTML = "";
    buildChoices(w).forEach((c) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = c.ja;
      b.addEventListener("click", () => answer(b, c.id === w.id, w));
      choicesWrap.appendChild(b);
    });
    speak(w.en);
  }
}

function submitQuizTyped() {
  if (!Q || Q.locked) return;
  const w = Q.words[Q.i];
  const input = document.getElementById("quizInput");
  if (!input.value.trim()) return;
  const ok = isJaCorrect(input.value, w);
  input.className = "typing-input " + (ok ? "ok" : "ng");
  answer(input, ok, w);
}

document.getElementById("btnQuizSubmit").addEventListener("click", submitQuizTyped);
document.getElementById("quizInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitQuizTyped();
});
document.getElementById("btnQuizSpeak").addEventListener("click", () => Q && speak(Q.words[Q.i].en));

function answer(btn, ok, correct) {
  if (Q.locked) return;
  Q.locked = true;

  if (!isTypeMode()) {
    document.querySelectorAll("#choices .choice").forEach((b) => {
      if (b.textContent === correct.ja) b.classList.add("ok");
      else b.classList.add("dim");
    });
    if (!ok) btn.classList.add("ng");
  }

  document.getElementById("quizSlot").textContent = correct.emoji;

  const fb = document.getElementById("feedback");
  fb.classList.remove("hidden", "ok", "ng");
  let graduatedNow = false;

  if (ok) {
    Q.correct++;
    Q.combo++;
    P.blocks++;
    sfxOk();
    const r = btn.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#5EA827");
    orbs(Q.combo >= 3 ? 6 : 3, "🟢");

    if (Q.mode === "A") {
      const n = (P.mastery[correct.id] || 0) + 1;
      if (n >= MASTER_COUNT) {
        delete P.mastery[correct.id];
        P.box[correct.id] = new Date().getDay();
        Q.graduated.push(correct);
        graduatedNow = true;
        sfxGraduate();
      } else {
        P.mastery[correct.id] = n;
      }
    }
    save();
    updateHUD();

    fb.classList.add("ok");
    if (graduatedNow) {
      const info = WEEKDAYS.find((w2) => w2.day === P.box[correct.id]);
      fb.innerHTML = `🎉 そつぎょう!<span class="fb-ja">${info.icon} ${info.label}ようボックスへ うつったよ!</span>`;
    } else {
      fb.innerHTML = `⛏️ ブロック ゲット!${Q.combo >= 3 ? ` <span style="color:var(--gold)">${Q.combo}れんぞく!</span>` : ""}`;
    }
  } else {
    Q.combo = 0;
    Q.wrong.push(correct);
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);

    if (Q.mode === "A") {
      P.mastery[correct.id] = 0;
    } else {
      delete P.box[correct.id];
      P.mastery[correct.id] = 0;
      Q.demoted.push(correct);
    }
    save();

    fb.classList.add("ng");
    const extra = Q.mode === "B" ? "<br>Ⓐの れんしゅうに もどったよ" : "";
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">${correct.emoji} ${correct.en} = ${correct.ja}${extra}</span>`;
    speak(correct.en);
  }

  setTimeout(() => {
    Q.i++;
    if (Q.i >= Q.words.length) {
      document.getElementById("quizBar").style.width = "100%";
      finish();
    } else {
      renderQuiz();
    }
  }, ok && !graduatedNow ? 900 : 1900);
}

/* ---------- けっか ---------- */
function finish() {
  bumpStreak();
  const total = Q.words.length;
  const score = Q.correct;

  addXP(score * 2);

  const loot = [{ ic: "🟩", t: `ブロック ×${score}` }];
  let title, msg;

  if (Q.mode === "B") {
    const keep = total - Q.demoted.length;
    title = "📦 ふくしゅう かんりょう!";
    msg = `${keep}ご ボックスに のこった。\n${Q.demoted.length}ご Ⓐに もどった。`;
    if (Q.demoted.length === 0 && total > 0) {
      P.chests++;
      loot.push({ ic: "🧰", t: "チェスト ×1" });
      sfxChest();
      orbs(10, "💎");
    }
  } else {
    title = Q.graduated.length > 0 ? `🎉 ${Q.graduated.length}ご そつぎょう!` : "⛏️ れんしゅう かんりょう!";
    msg = `${score}/${total} せいかい。\nのこりも がんばろう!`;
    if (Q.graduated.length > 0) {
      P.chests += Q.graduated.length;
      loot.push({ ic: "🧰", t: `チェスト ×${Q.graduated.length}` });
      sfxChest();
      orbs(10, "💎");
    }
  }
  save();

  document.getElementById("resultChest").textContent = Q.mode === "A" && Q.graduated.length > 0 ? "🧰" : "⛏️";
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultScore").textContent = score;
  document.getElementById("resultTotal").textContent = total;
  document.getElementById("resultMsg").innerText = msg;

  document.getElementById("loot").innerHTML = loot
    .map((l) => `<div class="loot-item"><span>${l.ic}</span><span>${l.t}</span></div>`)
    .join("");

  document.getElementById("btnBackRanges").classList.toggle("hidden", Q.mode !== "A");
  document.getElementById("btnBackBoxes").classList.toggle("hidden", Q.mode !== "B");
  const nothingLeft =
    Q.mode === "A"
      ? wordsStillLearning(wordsInRange(Q.rangeId).map((w) => w.id)).length === 0
      : wordsInBox(Q.day).length === 0;
  document.getElementById("btnRetry").classList.toggle("hidden", nothingLeft);
  document.getElementById("btnReviewWrong").classList.toggle("hidden", Q.wrong.length === 0 && (!Q.demoted || Q.demoted.length === 0));

  show("result");
  updateHUD();
}

document.getElementById("btnBackRanges").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.getElementById("btnBackBoxes").addEventListener("click", () => { sfxClick(); show("boxes"); });
document.getElementById("btnRetry").addEventListener("click", () => {
  sfxClick();
  if (Q.mode === "B") startBoxQuiz(Q.day);
  else startLearn(Q.rangeId);
});
document.getElementById("btnResultHome").addEventListener("click", () => { sfxClick(); show("home"); });
document.getElementById("btnReviewWrong").addEventListener("click", () => { sfxClick(); renderWrong(); });
document.getElementById("btnWrongBack").addEventListener("click", () => show("result"));

/* ---------- まちがえた たんご ---------- */
function renderWrong() {
  const wrap = document.getElementById("wrongList");
  wrap.innerHTML = "";
  const list = (Q.demoted && Q.demoted.length ? Q.demoted : Q.wrong);
  const seen = new Set();
  list.forEach((w) => {
    if (seen.has(w.id)) return;
    seen.add(w.id);
    const el = document.createElement("div");
    el.className = "wrong-item";
    el.innerHTML = `
      <div class="wrong-ic">${w.emoji}</div>
      <div style="flex:1">
        <div class="wrong-en">${w.en}</div>
        <div class="wrong-ja">${w.ja}</div>
      </div>
      <button class="sound-btn">🔊</button>
    `;
    el.querySelector("button").addEventListener("click", () => speak(w.en));
    wrap.appendChild(el);
  });
  show("wrong");
}

/* ---------- せいせき ---------- */
function renderStats() {
  document.getElementById("sBlocks").textContent = P.blocks;
  document.getElementById("sChests").textContent = P.chests;
  document.getElementById("sWords").textContent = boxedCount();
  document.getElementById("sStreak").textContent = P.streak.n;

  const wd = new Date().getDay();
  const inv = document.getElementById("inventory");
  inv.innerHTML = "";
  WEEKDAYS.forEach((info) => {
    const n = wordsInBox(info.day).length;
    const el = document.createElement("div");
    el.className = "inv-slot" + (n === 0 ? " empty" : "") + (info.day === wd ? " today" : "");
    el.innerHTML = `
      <div class="inv-ic">${n === 0 ? "・" : info.icon}</div>
      <div class="inv-label">${info.label}よう</div>
      <div class="inv-count">${n}ご</div>
    `;
    inv.appendChild(el);
  });

  document.getElementById("sBosses").textContent = P.bossDefeated;
  const trophy = document.getElementById("bossTrophies");
  trophy.innerHTML = "";
  BOSSES.forEach((b, i) => {
    const beaten = P.bossDefeated > i;
    const el = document.createElement("div");
    el.className = "inv-slot" + (beaten ? "" : " empty");
    el.innerHTML = `
      <div class="inv-ic">${beaten ? b.icon : "🔒"}</div>
      <div class="inv-label">${beaten ? b.name : "???"}</div>
      <div class="inv-count">${beaten ? b.drop : "-"}</div>
    `;
    trophy.appendChild(el);
  });
}

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnA").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.getElementById("btnB").addEventListener("click", () => { sfxClick(); show("boxes"); });
document.getElementById("btnStats").addEventListener("click", () => { sfxClick(); show("stats"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* ---------- スタート ---------- */
show("home");
