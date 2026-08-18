/* =========================================================
   えいごクラフト 5きゅう - app.js
   ========================================================= */

const EXAM_DATE = new Date(2026, 9, 4);   // 2026/10/4
const KEY = "eigo_craft_v2";
const HEARTS_MAX = 3;                      // 3かい まちがえたら しっぱい(=8/10で ごうかく)
const REVIEW_DAYS = 7;

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
    zones: d.zones || {},
    streak: d.streak || { n: 0, last: null },
    lastZone: d.lastZone || 1,
    advSeen: d.advSeen || {},
  };
}

let P = load();
function save() { localStorage.setItem(KEY, JSON.stringify(P)); }

function zoneState(z) {
  if (!P.zones[z]) P.zones[z] = { cleared: false, best: 0, nextReview: null, medal: null, reviews: 0 };
  return P.zones[z];
}
const wordsInZone = (z) => WORD_LIST.filter((w) => w.zone === z);
const isUnlocked = (z) => z === 1 || zoneState(z - 1).cleared;
const clearedCount = () => Object.values(P.zones).filter((z) => z.cleared).length;

function dueZones() {
  const now = Date.now();
  const out = [];
  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const s = zoneState(z);
    if (s.cleared && s.nextReview && s.nextReview <= now) out.push(z);
  }
  return out;
}

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

const MEDALS = { gold: "💎", silver: "🥈", bronze: "🥉" };
const medalRank = (m) => ({ bronze: 1, silver: 2, gold: 3 }[m] || 0);

/* ---------- おと(WebAudio:マイクラふうの ぷちっと おと) ---------- */
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

/* ---------- はつおん ---------- */
let voices = [];
function pickVoice() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const en = voices.filter((v) => /^en(-|_)?/i.test(v.lang));
  return (
    en.find((v) => /google.*us|samantha|alex|natural/i.test(v.name)) ||
    en.find((v) => /en-US/i.test(v.lang)) ||
    en[0] || null
  );
}
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speak(text, rate = 0.8) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = "en-US";
  u.rate = rate;
  u.pitch = 1.05;
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
["home", "chapters", "map", "learn", "quiz", "result", "review", "stats", "wrong"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});

function show(name) {
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, chapters: renderChapters, map: renderMap, review: renderReview, stats: renderStats }[name] || (() => {}))();
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
  return leveled;
}

/* ---------- ホーム ---------- */
function renderHome() {
  updateHUD();

  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.ceil((EXAM_DATE - t) / 86400000));
  document.getElementById("daysLeft").textContent = days;

  const done = clearedCount();
  const remain = TOTAL_ZONES - done;
  const pace = document.getElementById("paceMessage");
  if (remain <= 0) {
    pace.textContent = "🎉 ぜんぶ クリア!すごい!";
  } else if (days <= 0) {
    pace.textContent = "きょうが ほんばん!いままでの ちからを ぜんぶ 出そう!";
  } else {
    const perWeek = Math.max(1, Math.ceil(remain / Math.max(1, Math.ceil(days / 7))));
    pace.textContent = `のこり ${remain}ワールド。1しゅうに ${perWeek}ワールドで まにあうよ!`;
  }

  const nz = Math.min(P.lastZone, TOTAL_ZONES);
  const th = zoneTheme(nz);
  document.getElementById("continueLabel").textContent =
    done >= TOTAL_ZONES ? "ぜんぶ クリアずみ!" : `ワールド ${nz}・${th.name}`;

  const due = dueZones();
  const notif = document.getElementById("reviewNotif");
  notif.textContent = due.length;
  notif.classList.toggle("hidden", due.length === 0);

  document.getElementById("learnedWords").textContent = done * 10;
  document.getElementById("totalWords").textContent = WORD_LIST.length;
  document.getElementById("overallBar").style.width = (done / TOTAL_ZONES) * 100 + "%";
}

/* ---------- チャプターえらび ---------- */
function renderChapters() {
  const wrap = document.getElementById("chapterList");
  wrap.innerHTML = "";
  CHAPTERS.forEach((ch) => {
    const done = ch.zones.filter((z) => zoneState(z).cleared).length;
    const pct = (done / ch.zones.length) * 100;
    const first = wordsInChapter(ch.id)[0];
    const el = document.createElement("div");
    el.className = "chapter";
    el.innerHTML = `
      <div class="chapter-ic">${done === ch.zones.length ? "✅" : first.emoji}</div>
      <div class="chapter-body">
        <div class="chapter-title">${ch.title}</div>
        <div class="chapter-sub">${first.en} から ${ch.to - ch.from + 1}ご ・ ${done}/${ch.zones.length} ワールド</div>
        <div class="mc-bar"><div class="mc-bar-fill" style="width:${pct}%"></div></div>
      </div>
    `;
    el.addEventListener("click", () => {
      sfxClick();
      const next = ch.zones.find((z) => !zoneState(z).cleared) || ch.zones[0];
      P.lastZone = next;
      save();
      startLearn(next);
    });
    wrap.appendChild(el);
  });
}

/* ---------- マップ ---------- */
function renderMap() {
  const wrap = document.getElementById("mapList");
  wrap.innerHTML = "";
  const due = new Set(dueZones());

  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const s = zoneState(z);
    const open = isUnlocked(z);
    const th = zoneTheme(z);
    const ws = wordsInZone(z);
    const el = document.createElement("div");
    el.className = "map-node" + (open ? "" : " locked") + (due.has(z) ? " due" : "");
    el.innerHTML = `
      <div class="map-block" style="background:${th.color}">${open ? (s.cleared ? "✅" : th.icon) : "🔒"}</div>
      <div class="map-body">
        <div class="map-name">ワールド ${z}・${th.name}</div>
        <div class="map-sub">No.${ws[0].no}〜${ws[ws.length - 1].no} ・ ${ws[0].en} など${due.has(z) ? " ・🔁 ふくしゅう!" : ""}</div>
      </div>
      <div class="map-medal">${s.medal ? MEDALS[s.medal] : ""}</div>
    `;
    if (open) {
      el.addEventListener("click", () => {
        sfxClick();
        P.lastZone = z;
        save();
        startLearn(z);
      });
    }
    wrap.appendChild(el);
  }
}

/* ---------- おぼえる(カード) ---------- */
let L = { zone: 1, words: [], i: 0, flipped: false };

function startLearn(z) {
  L = { zone: z, words: wordsInZone(z), i: 0, flipped: false };
  const th = zoneTheme(z);
  document.getElementById("learnZoneTag").textContent = `ワールド ${z}・${th.name}`;
  show("learn");
  renderCard();
}

function visHTML(vis) {
  if (!vis) return "";
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
  if (w.vis) {
    vis.innerHTML = visHTML(w.vis);
    vis.classList.remove("hidden");
  } else {
    vis.classList.add("hidden");
  }

  document.getElementById("cardFront").classList.remove("hidden");
  document.getElementById("cardBack").classList.add("hidden");
  document.getElementById("learnPos").textContent = `${L.i + 1} / ${L.words.length}`;

  const last = L.i === L.words.length - 1;
  document.getElementById("btnGoQuiz").classList.toggle("hidden", !last);
  document.getElementById("btnNext").textContent = last ? "さいしょへ" : "つぎ ▶";

  speak(w.en);   // えいごを 出したら すぐ ネイティブはつおん
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
document.getElementById("btnGoQuiz").addEventListener("click", () => startQuiz(L.zone, "learn"));

/* ---------- クイズ ---------- */
let Q = null;

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function startQuiz(z, mode) {
  Q = {
    zone: z,
    mode,
    words: shuffle(wordsInZone(z)),
    i: 0,
    correct: 0,
    hearts: HEARTS_MAX,
    combo: 0,
    maxCombo: 0,
    wrong: [],
    locked: false,
  };
  document.getElementById("quizTotal").textContent = Q.words.length;
  show("quiz");
  renderQuiz();
}

function renderHearts() {
  const wrap = document.getElementById("hearts");
  wrap.innerHTML = "";
  for (let i = 0; i < HEARTS_MAX; i++) {
    const s = document.createElement("span");
    s.className = "heart" + (i < Q.hearts ? "" : " lost");
    s.textContent = "❤️";
    wrap.appendChild(s);
  }
}

function renderQuiz() {
  const w = Q.words[Q.i];
  Q.locked = false;

  renderHearts();
  document.getElementById("quizPos").textContent = Q.i + 1;
  document.getElementById("quizBar").style.width = (Q.i / Q.words.length) * 100 + "%";
  document.getElementById("quizSlot").textContent = "❓";
  document.getElementById("quizEn").textContent = w.en;
  document.getElementById("feedback").classList.add("hidden");

  const cb = document.getElementById("combo");
  cb.classList.toggle("hidden", Q.combo < 2);
  document.getElementById("comboNum").textContent = Q.combo;

  // まちがい せんたくしは おなじ ワールド + ちかい たんごから
  const pool = WORD_LIST.filter((x) => x.id !== w.id && x.ja !== w.ja);
  const near = pool.filter((x) => Math.abs(x.zone - w.zone) <= 2);
  const wrongs = shuffle(near.length >= 3 ? near : pool).slice(0, 3);
  const choices = shuffle([w, ...wrongs]);

  const wrap = document.getElementById("choices");
  wrap.innerHTML = "";
  choices.forEach((c) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = c.ja;
    b.addEventListener("click", (ev) => answer(b, c, w, ev));
    wrap.appendChild(b);
  });

  speak(w.en);
}

document.getElementById("btnQuizSpeak").addEventListener("click", () => Q && speak(Q.words[Q.i].en));

function answer(btn, chosen, correct, ev) {
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

  if (ok) {
    Q.correct++;
    Q.combo++;
    Q.maxCombo = Math.max(Q.maxCombo, Q.combo);
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    const r = btn.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#5EA827");
    orbs(Q.combo >= 3 ? 6 : 3, "🟢");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ ブロック ゲット!${Q.combo >= 3 ? ` <span style="color:var(--gold)">${Q.combo}れんぞく!</span>` : ""}`;
    if (Q.combo === 5) advancement("5れんぞく せいかい!", "🔥", "コンボ たっせい!");
  } else {
    Q.combo = 0;
    Q.hearts--;
    Q.wrong.push(correct);
    renderHearts();
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">${correct.emoji} ${correct.en} = ${correct.ja}</span>`;
    speak(correct.en);
  }

  setTimeout(() => {
    if (Q.hearts <= 0) { finish(false); return; }
    Q.i++;
    if (Q.i >= Q.words.length) {
      document.getElementById("quizBar").style.width = "100%";
      finish(true);
    } else {
      renderQuiz();
    }
  }, ok ? 900 : 1900);
}

/* ---------- けっか ---------- */
function finish(finished) {
  bumpStreak();
  const total = Q.words.length;
  const score = Q.correct;
  const passed = finished && score / total >= 0.8;

  const s = zoneState(Q.zone);
  const rate = score / total;
  const medal = rate === 1 ? "gold" : rate >= 0.9 ? "silver" : passed ? "bronze" : null;

  const loot = [];
  let title, msg;

  if (passed) {
    if (medal && medalRank(medal) > medalRank(s.medal)) s.medal = medal;
    s.best = Math.max(s.best, score);
    s.nextReview = Date.now() + REVIEW_DAYS * 86400000;

    const first = !s.cleared;
    s.cleared = true;
    P.chests++;
    loot.push({ ic: "🧰", t: "チェスト ×1" });
    loot.push({ ic: "🟩", t: `ブロック ×${score}` });
    if (medal) loot.push({ ic: MEDALS[medal], t: "メダル" });

    if (first) {
      P.lastZone = Math.min(TOTAL_ZONES, Q.zone + 1);
      const th = zoneTheme(Q.zone);
      title = `⛏️ ワールド${Q.zone} クリア!`;
      msg = `${th.name}を せいはした!\n1しゅうかんごに ふくしゅうが 出るよ。`;
      advancement(`${th.name} を クリア!`, th.icon);
    } else {
      title = Q.mode === "review" ? "🔁 ふくしゅう せいこう!" : "⛏️ また クリア!";
      msg = "また 1しゅうかんごに ふくしゅうが 出るよ。";
    }
    save();
    addXP(score * 2);
    sfxChest();
    orbs(10, "💎");
  } else {
    title = Q.hearts <= 0 ? "💔 ハートが なくなった!" : "もうすこし!";
    msg = `${HEARTS_MAX}かいまで まちがえて OK。\nまちがえた たんごを みてから もういちど!`;
    loot.push({ ic: "🟩", t: `ブロック ×${score}` });
    save();
    addXP(score);
  }

  document.getElementById("resultChest").textContent = passed ? "🧰" : "💔";
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultScore").textContent = score;
  document.getElementById("resultTotal").textContent = total;
  document.getElementById("resultMsg").innerText = msg;

  const lootEl = document.getElementById("loot");
  lootEl.innerHTML = loot
    .map((l) => `<div class="loot-item"><span>${l.ic}</span><span>${l.t}</span></div>`)
    .join("");

  document.getElementById("btnNextZone").classList.toggle("hidden", !passed);
  document.getElementById("btnRetry").classList.toggle("hidden", passed);
  document.getElementById("btnReviewWrong").classList.toggle("hidden", Q.wrong.length === 0);

  show("result");
  updateHUD();
}

document.getElementById("btnNextZone").addEventListener("click", () => {
  sfxClick();
  if (Q.mode === "review") { show("review"); return; }
  const nz = Q.zone + 1;
  if (nz > TOTAL_ZONES) { show("home"); return; }
  P.lastZone = nz;
  save();
  startLearn(nz);
});
document.getElementById("btnRetry").addEventListener("click", () => {
  sfxClick();
  startLearn(Q.zone);
});
document.getElementById("btnResultHome").addEventListener("click", () => { sfxClick(); show("home"); });
document.getElementById("btnReviewWrong").addEventListener("click", () => { sfxClick(); renderWrong(); });
document.getElementById("btnWrongBack").addEventListener("click", () => show("result"));

/* ---------- まちがえた たんご ---------- */
function renderWrong() {
  const wrap = document.getElementById("wrongList");
  wrap.innerHTML = "";
  const seen = new Set();
  Q.wrong.forEach((w) => {
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

/* ---------- ふくしゅう ---------- */
function renderReview() {
  const due = dueZones();
  const wrap = document.getElementById("reviewList");
  wrap.innerHTML = "";
  if (!due.length) {
    wrap.innerHTML = `<div class="panel" style="text-align:center;color:var(--text-dim);font-size:13px;line-height:1.9">
      いま ふくしゅうする ワールドは ないよ。<br>あたらしい たんごを ほりに いこう!⛏️</div>`;
    return;
  }
  due.forEach((z) => {
    const th = zoneTheme(z);
    const ws = wordsInZone(z);
    const el = document.createElement("div");
    el.className = "map-node due";
    el.innerHTML = `
      <div class="map-block" style="background:${th.color}">🔁</div>
      <div class="map-body">
        <div class="map-name">ワールド ${z}・${th.name}</div>
        <div class="map-sub">No.${ws[0].no}〜${ws[ws.length - 1].no}</div>
      </div>
      <div class="map-medal">▶</div>
    `;
    el.addEventListener("click", () => { sfxClick(); startQuiz(z, "review"); });
    wrap.appendChild(el);
  });
}

/* ---------- せいせき ---------- */
function renderStats() {
  document.getElementById("sBlocks").textContent = P.blocks;
  document.getElementById("sChests").textContent = P.chests;
  document.getElementById("sWords").textContent = clearedCount() * 10;
  document.getElementById("sStreak").textContent = P.streak.n;

  const inv = document.getElementById("inventory");
  inv.innerHTML = "";
  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const s = zoneState(z);
    const th = zoneTheme(z);
    const el = document.createElement("div");
    el.className = "inv-slot" + (s.cleared ? "" : " empty");
    el.textContent = s.cleared ? th.icon : "🔒";
    el.title = `ワールド ${z}・${th.name}`;
    inv.appendChild(el);
  }
}

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnContinue").addEventListener("click", () => {
  sfxClick();
  startLearn(Math.min(P.lastZone, TOTAL_ZONES));
});
document.getElementById("btnChapters").addEventListener("click", () => { sfxClick(); show("chapters"); });
document.getElementById("btnMap").addEventListener("click", () => { sfxClick(); show("map"); });
document.getElementById("btnReview").addEventListener("click", () => { sfxClick(); show("review"); });
document.getElementById("btnStats").addEventListener("click", () => { sfxClick(); show("stats"); });
document.querySelectorAll("[data-back]").forEach((b) =>
  b.addEventListener("click", () => show(b.dataset.back))
);

/* ---------- スタート ---------- */
show("home");
