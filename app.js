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

/* きょうの きろく。日づけが かわったら からっぽに もどす */
function freshDay(t) {
  const d = today();
  if (t && t.d === d) {
    return { d, ranges: t.ranges || [], words: t.words || [], grad: t.grad || [],
             bWords: t.bWords || [], q: t.q || 0 };
  }
  return { d, ranges: [], words: [], grad: [], bWords: [], q: 0 };
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
    gHard: !!d.gHard,                    // 大もん1を にほんごなし(ほんばん)で やるか
    bossDefeated: d.bossDefeated || 0,   // たおした ボスの かず
    today: freshDay(d.today),            // きょう やったぶんの きろく
    history: d.history || {},            // 日づけ -> {w: れんしゅうご数, g: そつぎょう数}
    bossDrops: d.bossDrops || [],        // (きゅうバージョン)てにいれた ドロップ
    items: d.items || {},                // itemId -> てにいれた こすう
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

/* しけんまで あと なん日 */
function daysLeft() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((EXAM_DATE - t) / 86400000));
}

/* ---------- きょうの きろく ---------- */
/* あそんでいる とちゅうで 日づけが かわっても つじつまを あわせる */
function rollDay() {
  if (P.today.d !== today()) {
    const t = P.today;
    if (t.words.length || t.grad.length) {
      P.history[t.d] = { w: t.words.length, g: t.grad.length };
      // ふるい きろくは 30日ぶんだけ のこす
      const keys = Object.keys(P.history).sort();
      while (keys.length > 30) delete P.history[keys.shift()];
    }
    P.today = freshDay(null);
    save();
  }
}
function logRange(id) {
  rollDay();
  if (!P.today.ranges.includes(id)) { P.today.ranges.push(id); save(); }
}
function logQuiz() { rollDay(); P.today.q++; save(); }
function logWord(id, mode) {
  rollDay();
  const list = mode === "B" ? P.today.bWords : P.today.words;
  if (!list.includes(id)) list.push(id);
}
function logGraduate(id) {
  rollDay();
  if (!P.today.grad.includes(id)) P.today.grad.push(id);
}
/* きょう ふくめて さかのぼって n日ぶんの きろく(グラフよう) */
function recentDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const rec = key === P.today.d
      ? { w: P.today.words.length, g: P.today.grad.length }
      : P.history[key] || { w: 0, g: 0 };
    out.push({ key, day: d.getDay(), date: d.getDate(), ...rec, isToday: i === 0 });
  }
  return out;
}
/* 1日に なんご やれば まにあうか */
function dailyGoal() {
  const days = daysLeft();
  const coreBoxed = WORD_LIST.filter((w) => CORE_WORD_IDS.has(w.id) && P.box[w.id] !== undefined).length;
  const coreRemain = CORE_WORD_IDS.size - coreBoxed;
  if (coreRemain <= 0) return 0;
  return Math.max(1, Math.ceil(coreRemain / Math.max(1, days)));
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
/* こえの えらびなおしは おもい(getVoices を まいかい なめて ならべかえる)。
   よみあげの たびに やると えいご→にほんごの あいだが あいてしまうので、
   いちど えらんだ こえは おぼえておく。 */
const voiceCache = {};
function pickVoice(langPrefix = "en") {
  if (voiceCache[langPrefix]) return voiceCache[langPrefix];
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!voices.length) return null;
  const candidates = voices.map((v) => ({ v, s: voiceScore(v, langPrefix) })).filter((x) => x.s >= 0);
  candidates.sort((a, b) => b.s - a.s);
  const best = candidates.length ? candidates[0].v : null;
  if (best) voiceCache[langPrefix] = best;
  return best;
}
if (window.speechSynthesis) {
  // こえの いちらんは あとから とどく ことが あるので、とどいたら えらびなおす
  window.speechSynthesis.onvoiceschanged = () => {
    delete voiceCache.en;
    delete voiceCache.ja;
    pickVoice("en");
    pickVoice("ja");
  };
  pickVoice("en");
  pickVoice("ja");
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
  const synth = window.speechSynthesis;
  synth.cancel();
  const uEn = makeUtterance(en, "en", 0.85);
  const uJa = makeUtterance(ja, "ja", 0.95);

  // えいごが おわってから にほんごを つくると、こえの じゅんびに 時間が
  // かかって あいだが あいてしまう。さきに 2つとも ならべておくと、
  // えいごを よんでいる あいだに にほんごの じゅんびが すすむ。
  let jaStarted = false;
  uJa.onstart = () => { jaStarted = true; };
  synth.speak(uEn);
  synth.speak(uJa);

  // ならべても にほんごが はじまらない たんまつ が あるので、その ときだけ よびだす
  uEn.onend = () => setTimeout(() => {
    if (!jaStarted && !synth.speaking && !synth.pending) {
      synth.speak(makeUtterance(ja, "ja", 0.95));
    }
  }, 300);
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
["home", "ranges", "wordlist", "boxes", "learn", "quiz", "result", "stats", "wrong", "typing", "grammar"].forEach((n) => {
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
  renderGrammarMode();

  document.getElementById("typingModeSub").textContent =
    `ごうかくに ひつような たんごを ランダムで(${TYPING_BATCH_SIZE}ご)`;

  const days = daysLeft();
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

  renderToday();

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

/* ---------- 📅 きょう やったぶん ---------- */
/* まだ おわっていない ごうかくラインの はんい。
   きょう さわった はんいが あれば そこ、なければ つぎに やるべき はんい。 */
function nextRange() {
  const unfinished = RANGES.filter((r) => {
    const ws = wordsInRange(r.id);
    return ws.some((w) => P.box[w.id] === undefined);
  });
  const core = unfinished.filter((r) => !r.bonus);
  const pool = core.length ? core : unfinished;
  if (!pool.length) return null;
  const touchedToday = pool.filter((r) => P.today.ranges.includes(r.id));
  if (touchedToday.length) return touchedToday[touchedToday.length - 1];
  const started = pool.filter((r) =>
    wordsInRange(r.id).some((w) => (P.mastery[w.id] || 0) > 0 || P.box[w.id] !== undefined));
  return (started.length ? started : pool)[0];
}

function renderToday() {
  rollDay();
  const done = P.today.words.length;
  const goal = dailyGoal();

  document.getElementById("todayWords").textContent = done;
  document.getElementById("todayGoal").textContent = goal;
  document.getElementById("todayBar").style.width =
    (goal > 0 ? Math.min(100, (done / goal) * 100) : 100) + "%";
  document.getElementById("todayGrad").textContent = P.today.grad.length;
  document.getElementById("todayQuiz").textContent = P.today.q;
  document.getElementById("todayB").textContent = P.today.bWords.length;

  const note = document.getElementById("todayNote");
  if (goal === 0) note.textContent = "🎉 ごうかくラインは クリアずみ!";
  else if (done === 0) note.textContent = "まだ きょうは やってないよ。はじめよう!";
  else if (done >= goal) note.textContent = `✅ きょうの ぶんは かんりょう!(+${done - goal}ご おまけ)`;
  else note.textContent = `あと ${goal - done}ご で きょうの ぶんは かんりょう!`;

  // きょう さわった Ⓐの はんい
  const rw = document.getElementById("todayRanges");
  rw.innerHTML = "";
  if (P.today.ranges.length === 0) {
    rw.innerHTML = '<div class="today-chip none">まだ なし</div>';
  } else {
    P.today.ranges.slice().sort((a, b) => a - b).forEach((id) => {
      const r = RANGES.find((x) => x.id === id);
      if (!r) return;
      const ws = wordsInRange(id);
      const boxed = ws.filter((w) => P.box[w.id] !== undefined).length;
      const fin = boxed === ws.length;
      const el = document.createElement("div");
      el.className = "today-chip" + (fin ? " done" : "");
      el.innerHTML = `${fin ? "✅" : "✏️"} ${r.title}<span class="chip-n">${boxed}/${ws.length}</span>`;
      el.addEventListener("click", () => { sfxClick(); renderWordlist(id); });
      rw.appendChild(el);
    });
  }

  // この 7日かんの ぼうグラフ
  const days = recentDays(7);
  const max = Math.max(goal || 1, ...days.map((d) => d.w));
  const chart = document.getElementById("weekChart");
  chart.innerHTML = "";
  days.forEach((d) => {
    const info = WEEKDAYS.find((w) => w.day === d.day);
    const col = document.createElement("div");
    col.className = "wc-col" + (d.isToday ? " today" : "") + (d.w === 0 ? " zero" : "");
    col.innerHTML = `
      <div class="wc-n">${d.w || ""}</div>
      <div class="wc-bar"><div class="wc-fill" style="height:${max ? (d.w / max) * 100 : 0}%"></div></div>
      <div class="wc-lb">${info ? info.label : d.date}</div>
    `;
    chart.appendChild(col);
  });

  // つづきから ボタン
  const nr = nextRange();
  const btn = document.getElementById("btnContinue");
  if (!nr) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
    const ws = wordsInRange(nr.id);
    const boxed = ws.filter((w) => P.box[w.id] !== undefined).length;
    const touched = P.today.ranges.includes(nr.id);
    document.getElementById("continueTitle").textContent =
      touched ? `つづきから ${nr.title}` : `つぎは ${nr.title}`;
    document.getElementById("continueSub").textContent =
      `${nr.bonus ? "➕ボーナス" : "🎯ごうかく"} ・ ${boxed}/${ws.length}ご ボックスへ`;
    btn.onclick = () => { sfxClick(); renderWordlist(nr.id); };
  }
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
  rollDay();
  // がめんの うえに 「きょう どこまで やったか」を 出す
  const sum = document.getElementById("rangeToday");
  const nr = nextRange();
  sum.innerHTML = P.today.ranges.length === 0
    ? `📅 きょうは まだ Ⓐを やってないよ${nr ? ` ・ つぎは <b>${nr.title}</b>` : ""}`
    : `📅 きょうは <b>${P.today.ranges.length}はんい</b> / <b>${P.today.words.length}ご</b> れんしゅうした` +
      `${nr ? ` ・ つづきは <b>${nr.title}</b>` : ""}`;

  const wrap = document.getElementById("rangeGrid");
  wrap.innerHTML = "";
  const nextId = nr ? nr.id : null;
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
    const doneToday = P.today.ranges.includes(r.id);
    const isNext = r.id === nextId;
    const el = document.createElement("div");
    el.className =
      "range-card" + (finished ? " done" : "") + (r.bonus ? " bonus" : "") + (untouched ? " untouched" : "") +
      (doneToday ? " today" : "") + (isNext ? " next" : "");
    const mark = doneToday && isNext ? '<div class="range-mark today">📅 きょう やった ・ つづきは ここ</div>'
      : doneToday ? '<div class="range-mark today">📅 きょう やった</div>'
      : isNext ? '<div class="range-mark next">👉 つぎは ここ</div>' : "";
    el.innerHTML = `
      ${mark}
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
  logGraduate(id);
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
document.getElementById("btnWordlistQuiz").addEventListener("click", () => {
  sfxClick();
  P.lastRange = currentWordlistRange;
  save();
  startQuiz(currentWordlistRange, "A");   // カードを とばして いきなり ボスバトル
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
  // きのうご(at / of / is など)は、たんごより「ぶんの どこに 入るか」が
  // だいじ なので、例文の なかの その たんごを 目だたせる
  const c = useCloze(w) ? clozeParts(w) : null;
  const exEn = c
    ? `${escapeHtml(c.before)}<span class="ex-mark">${escapeHtml(c.answer)}</span>${escapeHtml(c.after)}`
    : escapeHtml(w.ex);
  document.getElementById("cardEx").innerHTML =
    `<span class="card-ex-en" id="cardExEn">🔊 ${exEn}</span><br>${escapeHtml(w.exJa)}`;
  document.getElementById("cardExEn").addEventListener("click", (e) => {
    e.stopPropagation();
    speakPair(w.ex, w.exJa);
  });

  document.getElementById("cardClozeNote").classList.toggle("hidden", !c);

  const vis = document.getElementById("cardVis");
  if (w.vis) { vis.innerHTML = visHTML(w.vis); vis.classList.remove("hidden"); }
  else { vis.classList.add("hidden"); }

  document.getElementById("cardFront").classList.remove("hidden");
  document.getElementById("cardBack").classList.add("hidden");
  document.getElementById("learnPos").textContent = `${L.i + 1} / ${L.words.length}`;

  const last = L.i === L.words.length - 1;
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

const BOSS_WIN_RATE = 0.7;   // このわりあい せいかいすると ボスを たおせる

function startQuiz(rangeId, mode) {
  const pool = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_LIST[id]);
  const words = shuffle(pool);
  const boss = bossAt(P.bossDefeated);
  const bossHp = Math.max(1, Math.ceil(words.length * BOSS_WIN_RATE));
  Q = {
    mode, rangeId, words, i: 0, correct: 0, combo: 0, graduated: [], wrong: [], locked: false,
    boss, bossHp, bossHpMax: bossHp, bossDown: false,
  };
  logRange(rangeId);
  logQuiz();
  document.getElementById("quizTotal").textContent = words.length;
  show("quiz");
  renderBossStage();
  renderQuiz();
}

/* ---------- ⚔️ ボス(Ⓐの クイズに くみこみ) ----------
   15もんちゅう 7わり(11もん)せいかいで ボスを たおせる。
   せいとうりつが たかいほど レアな ドロップが 出る。
--------------------------------------------------------- */
function renderBossStage() {
  const stage = document.getElementById("bossStage");
  if (!Q.boss) { stage.classList.add("hidden"); return; }
  stage.classList.remove("hidden");
  const icon = document.getElementById("bossIcon");
  icon.textContent = Q.boss.icon;
  icon.className = "boss-icon" + (Q.bossDown ? " dead" : "");
  document.getElementById("bossName").textContent =
    `${Q.boss.name}${Q.boss.loop > 0 ? ` (つよさ +${Q.boss.loop})` : ""}`;
  document.getElementById("bossHpNow").textContent = Math.max(0, Q.bossHp);
  document.getElementById("bossHpMax").textContent = Q.bossHpMax;
  document.getElementById("bossHpFill").style.width =
    Math.max(0, (Q.bossHp / Q.bossHpMax) * 100) + "%";
}

function damageBoss() {
  if (!Q.boss || Q.bossDown) return;
  Q.bossHp--;
  const icon = document.getElementById("bossIcon");
  icon.classList.remove("hit");
  void icon.offsetWidth;
  icon.classList.add("hit");
  const r = icon.getBoundingClientRect();
  blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#E03434");
  if (Q.bossHp <= 0) {
    Q.bossDown = true;
    sfxGraduate();
    orbs(10, "💥");
    advancement(`${Q.boss.name} を たおした!`, Q.boss.icon, "ボス げきは!");
  }
  renderBossStage();
}

function startBoxQuiz(day) {
  const pool = wordsInBox(day);
  Q = { mode: "B", day, words: shuffle(pool), i: 0, correct: 0, combo: 0, demoted: [], wrong: [], locked: false, boss: null };
  document.getElementById("quizTotal").textContent = Q.words.length;
  show("quiz");
  renderBossStage();
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
    .replace(/[～〜~ー－ｰ〜。、，・…!！?？]/g, "")
    .trim();
}

/* もっと ゆるく くらべる ための キー。
   ・だくてん / はんだくてん を とる  (ぼん = ほん)
   ・ちいさい かな を おおきく する  (しゃ = しや)
   ・おくりがな っぽい おしりの ことばを とる
     (「する」「な」「の」「い」「もの」「こと」「ぼん」など) */
const TAIL_WORDS = [
  "すること", "するひと", "する", "される", "した", "して",
  "のもの", "もの", "こと", "ひと", "とき",
  "ぼん", "ほん", "ようび", "です", "ます",
  "な", "の", "い",
];
const bigKana = (s) => s.replace(/[ぁぃぅぇぉっゃゅょゎ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
const noMarks = (s) => s.normalize("NFD").replace(/[゙゚]/g, "").normalize("NFC");
const TAILS = TAIL_WORDS.map(bigKana);

function looseKey(s) {
  let k = bigKana(normalizeJa(s));
  k = k.replace(/^を/, "");   // 「を」は ことばの あたまには こないので とっても あんぜん
  for (let n = 0; n < 3; n++) {
    const before = k;
    for (const t of TAILS) {
      if (k.length > t.length + 1 && k.endsWith(t)) { k = k.slice(0, -t.length); break; }
    }
    if (k === before) break;
  }
  return k;
}

/* だくてんの つけわすれ は 1もじ ぶんだけ ゆるす。
   (まんがほん = まんがぼん は OK。でも ペット と ベッド は べつもの) */
function dakutenClose(a, b) {
  if (a.length !== b.length || noMarks(a) !== noMarks(b)) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff <= 1;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
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
  (JA_ALT[w.en] || []).forEach(add);   // 子どもの いいかえ も せいかいに する
  return out;
}

/* ゆるい こたえあわせ。
   こどもが うつ ことを かんがえて、つぎの どれかに あてはまれば せいかい。
     1. そのまま おなじ
     2. だくてん・ちいさいかな・おくりがな の ちがいだけ
     3. こたえの あたまの ぶぶんを うった (まんが → まんがぼん)
     4. こたえを ふくむ ながい こたえを うった (をかう → かう)
     5. 1もじ ていどの うちまちがい */
function isJaCorrect(typed, w) {
  const t = normalizeJa(typed);
  if (!t) return false;
  const answers = [...jaAnswerSet(w)];
  if (answers.includes(t)) return true;

  const tk = looseKey(typed);
  if (!tk) return false;

  for (const a of answers) {
    const ak = looseKey(a);
    if (!ak) continue;
    if (tk === ak) return true;                                   // 2
    if (dakutenClose(tk, ak)) return true;                        // 2b
    const short = tk.length <= ak.length ? tk : ak;
    const long = tk.length <= ak.length ? ak : tk;
    // 「うえ / うえへ」「ここ / ここに」のように 2もじの こたえも おおい ので
    // 2もじから みとめる。そのかわり ながさの わりあいを きびしくする。
    const minRatio = short.length >= 3 ? 0.5 : 0.6;
    if (short.length >= 2 && long.startsWith(short) &&
        short.length / long.length >= minRatio) return true;      // 3
    if (short.length >= 3 && long.includes(short) &&
        short.length / long.length >= 0.6) return true;           // 4
    const maxLen = Math.max(tk.length, ak.length);
    if (maxLen >= 4 && levenshtein(tk, ak) <= 1) return true;     // 5
    if (maxLen >= 7 && levenshtein(tk, ak) <= 2) return true;
  }
  return false;
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

/* =========================================================
   📝 大もん1 れんしゅう(ぶんの あなうめ)

   えいけん5きゅうの 大もん1は「短文の語句空所補充」。
   ここでは 合格ラインの たんごから 15もん つくって、
   ほんばんと おなじ かたちで れんしゅうする。

   ・やさしい … にほんごの やくを 見せる(いみが わかった うえで えらぶ)
   ・ほんばん … にほんごを かくす(ほんとうの しけんと おなじ)
   まちがえても Ⓐ・Ⓑの きろくは かわらない。なんども やれる れんしゅう。
   ========================================================= */
const GRAMMAR_BATCH_SIZE = 15;
let G = null;

/* あなうめに つかえる ごうかくラインの たんご */
function grammarPool() {
  return WORD_LIST.filter((w) => CORE_WORD_IDS.has(w.id) && clozeParts(w));
}

function startGrammar() {
  const pool = grammarPool();
  if (pool.length === 0) return;
  // きのうご(at / of / is など)を おおめに 入れる。ほんばんの 大もん1も
  // ぜんちし・be動詞・じょどうしが 中心 なので そこを あつく する。
  const hard = shuffle(pool.filter((w) => isTypeHard(w)));
  const rest = shuffle(pool.filter((w) => !isTypeHard(w)));
  const nHard = Math.min(hard.length, Math.round(GRAMMAR_BATCH_SIZE * 0.6));
  const words = shuffle([...hard.slice(0, nHard), ...rest.slice(0, GRAMMAR_BATCH_SIZE - nHard)]);

  G = { words, i: 0, correct: 0, wrong: [], locked: false };
  document.getElementById("gTotal").textContent = words.length;
  document.getElementById("gResult").classList.add("hidden");
  show("grammar");
  renderGrammar();
}

function renderGrammar() {
  const w = G.words[G.i];
  G.locked = false;
  document.getElementById("gPos").textContent = G.i + 1;
  document.getElementById("gBar").style.width = (G.i / G.words.length) * 100 + "%";
  document.getElementById("gFeedback").classList.add("hidden");

  renderClozeSentence(w, "gEn", "gJa", true, !P.gHard);

  const wrap = document.getElementById("gChoices");
  wrap.innerHTML = "";
  clozeChoices(w, shuffle).forEach((en) => {
    const b = document.createElement("button");
    b.className = "choice choice-en";
    b.textContent = en;
    const ok = en.toLowerCase() === w.en.toLowerCase();
    if (ok) b.dataset.correct = "1";
    b.addEventListener("click", () => answerGrammar(b, ok, w));
    wrap.appendChild(b);
  });
  speakCloze(w);
}

function answerGrammar(btn, ok, w) {
  if (G.locked) return;
  G.locked = true;

  document.querySelectorAll("#gChoices .choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

  // こたえを あなに 入れて、にほんごも かならず 見せる
  renderClozeSentence(w, "gEn", "gJa", false, true);

  const fb = document.getElementById("gFeedback");
  fb.classList.remove("hidden", "ok", "ng");
  if (ok) {
    G.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    const r = btn.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#5EA827");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${w.en} = ${w.ja}</span>`;
  } else {
    G.wrong.push(w);
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">こたえは <b>${escapeHtml(w.en)}</b> ・ ${w.en} = ${w.ja}</span>`;
  }

  speakPair(w.ex, w.exJa);

  setTimeout(() => {
    G.i++;
    if (G.i >= G.words.length) {
      document.getElementById("gBar").style.width = "100%";
      finishGrammar();
    } else {
      renderGrammar();
    }
  }, ok ? 2800 : 3400);
}

function finishGrammar() {
  bumpStreak();
  const total = G.words.length;
  document.getElementById("gScore").textContent = G.correct;
  document.getElementById("gResultTotal").textContent = total;
  const pct = Math.round((G.correct / total) * 100);
  const msg = document.getElementById("gMsg");
  // えいけん5きゅうの ごうかくラインは だいたい 6わり
  if (pct >= 100) {
    msg.textContent = "パーフェクト!ほんばんでも だいじょうぶ!";
    sfxChest(); orbs(12, "💎");
  } else if (pct >= 60) {
    msg.textContent = `せいとうりつ ${pct}%。ごうかくラインを こえてるよ!この ちょうしで!`;
    sfxChest(); orbs(8, "🟢");
  } else {
    msg.textContent = `せいとうりつ ${pct}%。ぶんを こえに 出して よむと おぼえやすいよ。もういちど!`;
  }
  if (G.wrong.length) {
    msg.textContent += `\n\nまちがえた たんご: ${G.wrong.map((w) => w.en).join(", ")}`;
  }
  document.getElementById("gResult").classList.remove("hidden");
  addXP(G.correct);
}

function renderGrammarMode() {
  document.getElementById("gModeTag").textContent = P.gHard ? "ほんばん" : "やさしい";
  document.getElementById("gModeTag").classList.toggle("hard", P.gHard);
}

document.getElementById("btnGrammar").addEventListener("click", () => { sfxClick(); startGrammar(); });
document.getElementById("btnGSpeak").addEventListener("click", () => G && speakCloze(G.words[G.i], G.locked));
document.getElementById("btnGRetry").addEventListener("click", () => { sfxClick(); startGrammar(); });
document.getElementById("btnGHome").addEventListener("click", () => { sfxClick(); show("home"); });
/* むずかしさの きりかえは タグを おす(ボタン本体は れんしゅう かいし) */
document.getElementById("gModeTag").addEventListener("click", (e) => {
  e.stopPropagation();
  sfxClick();
  P.gHard = !P.gHard;
  save();
  renderGrammarMode();
  advancement(
    P.gHard ? "にほんごなし。ほんばんと おなじ!" : "にほんごの やくを 見ながら",
    "📝",
    P.gHard ? "ほんばんモード" : "やさしいモード"
  );
});

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
/* その もんだいを にゅうりょくで こたえさせるか。
   ぜんちし・be動詞などは かけないので 4たくに おとす。 */
const useTypeInput = (w) => isTypeMode() && !isTypeHard(w) && !useCloze(w);
/* きのうご(at / of / is / am など)は たんご 1つでは おぼえられないので、
   えいけん5きゅう 大問1 と おなじ「ぶんの あなうめ」で 出す。 */
const useCloze = (w) => isTypeHard(w) && !!clozeParts(w);

/* ぶんを ( ) つきで えがく。こたえたあとは あなに こたえを 入れて 見せる */
function renderClozeSentence(w, enId, jaId, blank, showJa = true) {
  const c = clozeParts(w);
  const en = document.getElementById(enId);
  const ja = document.getElementById(jaId);
  if (!c) { en.textContent = w.ex || ""; ja.textContent = w.exJa || ""; return; }
  en.innerHTML = blank
    ? `${escapeHtml(c.before)}<span class="cloze-blank">(&nbsp;&nbsp;&nbsp;)</span>${escapeHtml(c.after)}`
    : `${escapeHtml(c.before)}<span class="cloze-fill">${escapeHtml(c.answer)}</span>${escapeHtml(c.after)}`;
  ja.textContent = showJa ? (w.exJa || "") : "";
  ja.classList.toggle("hidden", !showJa);
}
function escapeHtml(t) {
  return String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
/* あなうめの ぶんを よむ。
   ( ) の ところを よんでしまうと きいただけで こたえが わかるので、
   そこは よまずに 「ポン」と おとを 出して あける。
   あなが ぶんの あたまに ある ときも ちゃんと あたまで あける。
   こたえた あとは full=true で ぶんぜんぶを よむ。 */
function speakCloze(w, full = false) {
  if (!window.speechSynthesis) return;
  const c = clozeParts(w);
  if (full || !c) { speak(w.ex || w.en); return; }
  window.speechSynthesis.cancel();

  const clean = (t) => t.replace(/\s+/g, " ").trim();
  const before = clean(c.before);
  const after = clean(c.after);
  const seq = [];
  if (/[A-Za-z]/.test(before)) seq.push({ text: before });
  seq.push({ gap: true });                       // ここが ( )
  if (/[A-Za-z]/.test(after)) seq.push({ text: after });

  let i = 0;
  const next = () => {
    if (i >= seq.length) return;
    const step = seq[i++];
    if (step.gap) {
      beep(760, 0.14, "sine", 0.05);             // あなの しるしの おと
      setTimeout(next, 620);
      return;
    }
    const u = makeUtterance(step.text, "en", 0.85);
    u.onend = () => setTimeout(next, 140);
    window.speechSynthesis.speak(u);
  };
  next();
}

/* ヒントの もとに する こたえ(いちばん みじかい ひらがなの こたえ) */
function hintAnswer(w) {
  const list = [...jaAnswerSet(w)].filter((a) => a.length >= 2 && !/[一-鿿]/.test(a));
  if (!list.length) return null;
  return list.sort((a, b) => a.length - b.length)[0];
}

/* 「と ○ ○」のように あたまの もじだけ 見せる。
   2かいめの ヒントは あたま2もじ。 */
function showHint(level) {
  const w = Q.words[Q.i];
  const a = hintAnswer(w);
  const box = document.getElementById("quizHint");
  if (!a) { box.classList.add("hidden"); return; }
  const open = Math.min(level, a.length - 1);
  const chars = a.split("").map((c, i) => (i < open ? c : "○")).join(" ");
  box.innerHTML =
    `<div class="hint-chars">${chars}</div>` +
    `<div class="hint-note">${a.length}もじ。あたまは「${a.slice(0, open || 1)}」</div>`;
  box.classList.remove("hidden");
  Q.hint = level;
  // ヒントは がめんの したの ほうに 出るので、見えるところまで うごかす
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

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

  const cloze = useCloze(w);
  const typeMode = useTypeInput(w);
  const choicesWrap = document.getElementById("choices");
  const typeWrap = document.getElementById("quizTypeWrap");
  choicesWrap.classList.toggle("hidden", typeMode);
  typeWrap.classList.toggle("hidden", !typeMode);
  // あなうめのときは 「えいご→いみ」の 見ためを かくす
  document.getElementById("quizCloze").classList.toggle("hidden", !cloze);
  document.getElementById("quizSlot").classList.toggle("hidden", cloze);
  document.getElementById("quizEn").classList.toggle("hidden", cloze);
  // にゅうりょくモードなのに 4たくで 出る たんごは、そのわけを 見せる
  document.getElementById("typeFallback").classList.toggle("hidden", !(isTypeMode() && !typeMode) || cloze);
  document.getElementById("quizHint").classList.add("hidden");
  Q.tries = 0;
  Q.hint = 0;
  document.getElementById("btnQuizSpeak").classList.remove("hidden");

  if (cloze) {
    // あなうめ: ぶんの ( ) に 入る たんごを えらぶ(えいけん5きゅう 大問1 と おなじ)
    document.getElementById("quizLabel").textContent = "( ) に 入るのは どれ?";
    renderClozeSentence(w, "clozeEn", "clozeJa", true);
    choicesWrap.innerHTML = "";
    clozeChoices(w, shuffle).forEach((en) => {
      const b = document.createElement("button");
      b.className = "choice choice-en";
      b.textContent = en;
      if (en.toLowerCase() === w.en.toLowerCase()) b.dataset.correct = "1";
      b.addEventListener("click", () => answer(b, en.toLowerCase() === w.en.toLowerCase(), w));
      choicesWrap.appendChild(b);
    });
    speakCloze(w);
  } else if (typeMode) {
    // にゅうりょくモード: はつおんを きいて にほんごを かく(えは ヒントに なるので かくす)
    document.getElementById("quizLabel").textContent = "たんごを きいて、にほんごで かこう";
    document.getElementById("quizSlot").textContent = "❓";
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
      if (c.id === w.id) b.dataset.correct = "1";
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

  // 1かいめの まちがいは 不せいかいに しない。
  // ヒントを 出して もういちど かかせる(手が とまらないように)
  if (!ok && Q.tries === 0 && hintAnswer(w)) {
    Q.tries = 1;
    sfxNg();
    input.className = "typing-input ng";
    showHint(1);
    const fb = document.getElementById("feedback");
    fb.classList.remove("hidden", "ok");
    fb.classList.add("ng");
    fb.innerHTML = `おしい! ヒントを みて もういちど<span class="fb-ja">つぎ まちがえたら ふせいかいだよ</span>`;
    setTimeout(() => {
      input.value = "";
      input.className = "typing-input";
      input.focus();
      speak(w.en);
    }, 700);
    return;
  }

  input.className = "typing-input " + (ok ? "ok" : "ng");
  answer(input, ok, w);
}

document.getElementById("btnQuizSubmit").addEventListener("click", submitQuizTyped);
document.getElementById("btnQuizHint").addEventListener("click", () => {
  if (!Q || Q.locked) return;
  sfxClick();
  showHint((Q.hint || 0) + 1);
  document.getElementById("quizInput").focus();
});
document.getElementById("quizInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitQuizTyped();
});
document.getElementById("btnQuizSpeak").addEventListener("click", () => {
  if (!Q) return;
  const w = Q.words[Q.i];
  if (useCloze(w)) speakCloze(w, Q.locked); else speak(w.en);
});

function answer(btn, ok, correct) {
  if (Q.locked) return;
  Q.locked = true;

  if (!useTypeInput(correct)) {
    document.querySelectorAll("#choices .choice").forEach((b) => {
      if (b.dataset.correct === "1") b.classList.add("ok");
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
    damageBoss();

    logWord(correct.id, Q.mode);
    if (Q.mode === "A") {
      const n = (P.mastery[correct.id] || 0) + 1;
      if (n >= MASTER_COUNT) {
        delete P.mastery[correct.id];
        P.box[correct.id] = new Date().getDay();
        Q.graduated.push(correct);
        graduatedNow = true;
        logGraduate(correct.id);
        sfxGraduate();
      } else {
        P.mastery[correct.id] = n;
      }
    }
    save();
    updateHUD();

    if (useCloze(correct)) renderClozeSentence(correct, "clozeEn", "clozeJa", false);
    fb.classList.add("ok");
    if (graduatedNow) {
      const info = WEEKDAYS.find((w2) => w2.day === P.box[correct.id]);
      fb.innerHTML = `🎉 そつぎょう!<span class="fb-ja">${info.icon} ${info.label}ようボックスへ うつったよ!</span>`;
    } else {
      const combo = Q.combo >= 3 ? ` <span style="color:var(--gold)">${Q.combo}れんぞく!</span>` : "";
      // にゅうりょくモードは ゆるく はんていするので、せいしきな こたえも 見せる
      const full = useTypeInput(correct) ? `<span class="fb-ja">${correct.en} = ${correct.ja}</span>` : "";
      fb.innerHTML = `⛏️ ブロック ゲット!${combo}${full}`;
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
    if (useCloze(correct)) renderClozeSentence(correct, "clozeEn", "clozeJa", false);
    else speak(correct.en);
  }

  // あなうめは ぶんまるごとを えいご→にほんご で きかせる(リスニングの れんしゅう)
  if (useCloze(correct)) speakPair(correct.ex, correct.exJa);

  setTimeout(() => {
    Q.i++;
    if (Q.i >= Q.words.length) {
      document.getElementById("quizBar").style.width = "100%";
      finish();
    } else {
      renderQuiz();
    }
  }, useCloze(correct) ? (ok && !graduatedNow ? 2800 : 3400)
                       : (ok && !graduatedNow ? 900 : 1900));
}

/* ---------- けっか ---------- */
function finish() {
  bumpStreak();
  const total = Q.words.length;
  const score = Q.correct;

  addXP(score * 2);

  const loot = [{ ic: "🟩", t: `ブロック ×${score}` }];
  let title, msg;
  let pack = null;

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
    const rate = total > 0 ? score / total : 0;
    const pct = Math.round(rate * 100);
    const won = Q.boss && Q.bossHp <= 0;

    if (won) {
      P.bossDefeated++;
      P.chests++;
      pack = openPack(rate);
      if (pack) {
        pack.items.forEach((it) => {
          it.isNew = !P.items[it.id];
          P.items[it.id] = (P.items[it.id] || 0) + 1;
        });
      }
      loot.push({ ic: "🧰", t: "チェスト ×1" });
      if (pack) pack.items.forEach((it) => loot.push({ ic: it.ic, t: it.n }));
      title = `🏆 ${Q.boss.name} を たおした!`;
      msg = `せいとうりつ ${pct}%${pack ? ` → ${pack.tier.name} パック!` : ""}\n` +
            (rate >= 1 ? "パーフェクト!さいこうの アイテムだ!" : "もっと せいかいすると もっと レアな アイテムが 出るぞ!");
      sfxChest();
      orbs(12, "💎");
    } else if (Q.boss) {
      title = `💀 ${Q.boss.name} を たおせなかった…`;
      msg = `せいとうりつ ${pct}%(あと ${Q.bossHp}ダメージ)\n` +
            `${Math.round(BOSS_WIN_RATE * 100)}%いじょう せいかいすると たおせるよ!`;
    } else {
      title = "⛏️ れんしゅう かんりょう!";
      msg = `${score}/${total} せいかい。`;
    }

    if (Q.graduated.length > 0) {
      P.chests += Q.graduated.length;
      loot.push({ ic: "🧰", t: `そつぎょう チェスト ×${Q.graduated.length}` });
      msg += `\n🎉 ${Q.graduated.length}ご Ⓑボックスへ そつぎょう!`;
      if (!won) { sfxChest(); orbs(10, "💎"); }
    }
  }
  save();

  const wonBoss = Q.mode !== "B" && Q.boss && Q.bossHp <= 0;
  document.getElementById("resultChest").textContent =
    Q.mode === "B" ? "📦" : wonBoss ? Q.boss.icon : Q.boss ? "💀" : "⛏️";
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

  if (pack) setTimeout(() => runPack(pack), 350);
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

/* =========================================================
   パック かいふう(ボスを たおしたときの ごうかな えんしゅつ)
   レアリティが たかいほど ためが ながく、ひかり・おと・かみふぶきが ふえる
   ========================================================= */
const PACK_FX = {
  common:    { charge:  800, rays:  0, spin: "",          flash: false, confetti:  0, shake: 0, stagger: 260, notes: [420, 560] },
  rare:      { charge: 1300, rays: 14, spin: "spin",      flash: false, confetti: 20, shake: 0, stagger: 300, notes: [420, 560, 700, 840] },
  epic:      { charge: 1900, rays: 24, spin: "spin",      flash: true,  confetti: 45, shake: 1, stagger: 340, notes: [392, 494, 587, 698, 880, 1047] },
  legendary: { charge: 2600, rays: 40, spin: "spin-fast", flash: true,  confetti: 110, shake: 2, stagger: 420, notes: [330, 392, 494, 587, 698, 880, 1047, 1319, 1568] },
};
const CONFETTI_COLORS = ["#FCEE4B", "#4AEDD9", "#B96BFF", "#17DD62", "#E03434", "#FFFFFF"];

let packBusy = false;

function confettiRain(n, colors) {
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.9 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

function packFlash() {
  const f = document.getElementById("packFlash");
  f.classList.remove("hidden");
  f.style.animation = "none";
  void f.offsetWidth;
  f.style.animation = "";
  setTimeout(() => f.classList.add("hidden"), 600);
}

function screenShake(level) {
  if (!level) return;
  const app = document.getElementById("app");
  app.classList.add("screen-shake");
  setTimeout(() => app.classList.remove("screen-shake"), 500 * level);
}

/* かいふう スタート。カードを タップすると あく */
function runPack(pack) {
  const ov = document.getElementById("packOverlay");
  const fx = PACK_FX[pack.tier.key];

  packBusy = true;
  ov.className = "pack-overlay t-" + pack.tier.key;
  ov.style.setProperty("--rc", pack.tier.color);
  ov.style.setProperty("--rg", pack.tier.glow);

  document.getElementById("packTier").textContent = pack.tier.name + " PACK";
  document.getElementById("packItems").innerHTML = "";
  document.getElementById("packTap").classList.remove("hidden");
  document.getElementById("btnPackClose").classList.add("hidden");

  const card = document.getElementById("packCard");
  card.classList.remove("burst");
  card.style.display = "";

  // ほうしゃじょうの ひかりを レアリティのぶんだけ ならべる
  const rays = document.getElementById("packRays");
  rays.className = "pack-rays " + fx.spin;
  rays.innerHTML = "";
  for (let i = 0; i < fx.rays; i++) {
    const r = document.createElement("div");
    r.className = "pack-ray";
    r.style.transform = `rotate(${(360 / fx.rays) * i}deg)`;
    if (pack.tier.key === "legendary") {
      r.style.background = `linear-gradient(to bottom, ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}, transparent 70%)`;
    }
    rays.appendChild(r);
  }

  card.onclick = () => openPackNow(pack, fx);
}

function openPackNow(pack, fx) {
  const ov = document.getElementById("packOverlay");
  const card = document.getElementById("packCard");
  if (ov.classList.contains("charging") || ov.classList.contains("opened")) return;

  card.onclick = null;
  document.getElementById("packTap").classList.add("hidden");
  ov.classList.add("charging");

  // ための あいだ、だんだん たかい おとに なる
  const step = fx.charge / fx.notes.length;
  fx.notes.forEach((f, i) => setTimeout(() => beep(f, 0.1, "square", 0.05), i * step));

  setTimeout(() => {
    ov.classList.remove("charging");
    ov.classList.add("opened");
    card.classList.add("burst");
    setTimeout(() => { card.style.display = "none"; }, 400);

    if (fx.flash) packFlash();
    screenShake(fx.shake);
    sfxChest();
    if (fx.confetti) {
      confettiRain(fx.confetti, pack.tier.key === "legendary" ? CONFETTI_COLORS : [pack.tier.color, pack.tier.glow]);
    }

    setTimeout(() => revealItems(pack, fx), 380);
  }, fx.charge);
}

function revealItems(pack, fx) {
  const wrap = document.getElementById("packItems");
  wrap.innerHTML = "";

  pack.items.forEach((it, i) => {
    const el = document.createElement("div");
    el.className = "pack-item";
    el.style.setProperty("--ic", pack.tier.color);
    el.style.animationDelay = i * fx.stagger + "ms";
    const have = P.items[it.id] || 1;
    el.innerHTML = `
      <div class="pack-item-ic">${it.ic}</div>
      <div class="pack-item-n">${it.n}</div>
      ${it.isNew ? '<div class="pack-item-tag">NEW!</div>' : ""}
      ${have > 1 ? `<div class="pack-item-dup">×${have}</div>` : ""}
    `;
    wrap.appendChild(el);
    setTimeout(() => {
      sfxGraduate();
      if (it.isNew) orbs(4, it.ic);
    }, i * fx.stagger);
  });

  setTimeout(() => {
    // レイを おとして アイテムの なまえを よみやすくする
    document.getElementById("packOverlay").classList.add("settled");
    document.getElementById("btnPackClose").classList.remove("hidden");
    const gotNew = pack.items.filter((it) => it.isNew).length;
    if (gotNew > 0) {
      advancement(
        `${pack.tier.name} ×${pack.items.length}(はじめて ${gotNew}こ)`,
        pack.items[0].ic,
        "アイテムを てにいれた!"
      );
    }
    packBusy = false;
  }, pack.items.length * fx.stagger + 400);
}

document.getElementById("btnPackClose").addEventListener("click", () => {
  sfxClick();
  const ov = document.getElementById("packOverlay");
  ov.className = "pack-overlay hidden";
  packBusy = false;
  updateHUD();
});

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

  // ドロップ コレクション(100しゅるい)
  const got = ALL_ITEMS.filter((it) => P.items[it.id]).length;
  document.getElementById("collHead").textContent = `${got} / ${ITEM_TOTAL} しゅるい あつめた!`;
  const trophy = document.getElementById("bossTrophies");
  trophy.innerHTML = "";
  DROP_TIERS.forEach((tier) => {
    const n = tier.items.filter((it) => P.items[it.id]).length;
    const head = document.createElement("div");
    head.className = "coll-tier";
    head.style.color = tier.color;
    head.textContent = `${tier.name} ${n}/${tier.items.length}`;
    trophy.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "coll-grid";
    tier.items.forEach((it) => {
      const c = P.items[it.id] || 0;
      const el = document.createElement("div");
      el.className = "coll-slot" + (c === 0 ? " locked" : "");
      el.title = c === 0 ? "?" : `${it.n} ×${c}`;
      el.innerHTML = c === 0 ? "🔒" : `${it.ic}${c > 1 ? `<span class="coll-n">${c}</span>` : ""}`;
      if (c > 0) el.style.boxShadow = `inset 2px 2px 0 var(--slot-dk), inset -2px -2px 0 #FFF, 0 0 0 2px ${tier.color}`;
      grid.appendChild(el);
    });
    trophy.appendChild(grid);
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
