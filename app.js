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
function voiceScore(v) {
  let s = 0;
  if (/^en/i.test(v.lang)) s += 10; else return -1;
  if (v.lang.toLowerCase() === "en-us") s += 20;
  if (/google/i.test(v.name)) s += 50;
  if (v.localService === false) s += 15;
  if (/us english/i.test(v.name)) s += 10;
  if (/compact|espeak|pico/i.test(v.name)) s -= 30;
  return s;
}
function pickVoice() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const candidates = voices.map((v) => ({ v, s: voiceScore(v) })).filter((x) => x.s >= 0);
  candidates.sort((a, b) => b.s - a.s);
  return candidates.length ? candidates[0].v : null;
}
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
  u.rate = rate;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
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
["home", "ranges", "wordlist", "boxes", "learn", "quiz", "result", "stats", "wrong"].forEach((n) => {
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
    const perWeek = Math.max(1, Math.ceil(coreRemain / Math.max(1, Math.ceil(days / 7))));
    pace.textContent = `🎯ごうかくラインまで のこり ${coreRemain}ご。1しゅうに ${perWeek}ごで まにあうよ!`;
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
  RANGES.forEach((r) => {
    const ws = wordsInRange(r.id);
    const done = ws.filter((w) => P.box[w.id] !== undefined).length;
    const pct = (done / ws.length) * 100;
    const el = document.createElement("div");
    el.className = "range-card" + (done === ws.length ? " done" : "") + (r.bonus ? " bonus" : "");
    el.innerHTML = `
      <div class="range-tag">${r.bonus ? "➕ ボーナス" : "🎯 ごうかく"}</div>
      <div class="range-title">${r.title}</div>
      <div class="range-sub">${ws[0].en} 〜 ${ws[ws.length - 1].en}</div>
      <div class="mc-bar"><div class="mc-bar-fill" style="width:${pct}%"></div></div>
      <div class="range-foot">${done}/${ws.length} ${done === ws.length ? "✅" : "📦"}</div>
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
  document.getElementById("cardEx").innerHTML = `${w.ex}<br>${w.exJa}`;

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

function renderQuiz() {
  const w = Q.words[Q.i];
  Q.locked = false;

  renderMasteryTag(w);
  renderDots(w);
  document.getElementById("quizPos").textContent = Q.i + 1;
  document.getElementById("quizBar").style.width = (Q.i / Q.words.length) * 100 + "%";
  document.getElementById("quizSlot").textContent = "❓";
  document.getElementById("quizEn").textContent = w.en;
  document.getElementById("feedback").classList.add("hidden");

  const cb = document.getElementById("combo");
  cb.classList.toggle("hidden", Q.combo < 2);
  document.getElementById("comboNum").textContent = Q.combo;

  const pool = WORD_LIST.filter((x) => x.id !== w.id && x.ja !== w.ja);
  const near = pool.filter((x) => Math.abs(x.no - w.no) <= 20);
  const wrongs = shuffle(near.length >= 3 ? near : pool).slice(0, 3);
  const choices = shuffle([w, ...wrongs]);

  const wrap = document.getElementById("choices");
  wrap.innerHTML = "";
  choices.forEach((c) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = c.ja;
    b.addEventListener("click", () => answer(b, c, w));
    wrap.appendChild(b);
  });

  speak(w.en);
}

document.getElementById("btnQuizSpeak").addEventListener("click", () => Q && speak(Q.words[Q.i].en));

function answer(btn, chosen, correct) {
  if (Q.locked) return;
  Q.locked = true;
  const ok = chosen.id === correct.id;

  document.querySelectorAll(".choice").forEach((b) => {
    if (b.textContent === correct.ja) b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

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
}

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnA").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.getElementById("btnB").addEventListener("click", () => { sfxClick(); show("boxes"); });
document.getElementById("btnStats").addEventListener("click", () => { sfxClick(); show("stats"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* ---------- スタート ---------- */
show("home");
