/* =========================================================
   えいごクラフト 5きゅう - app.js
   Ⓐ れんしゅう(はんい・15ごずつ)→ 3かい せいかいで Ⓑへ そつぎょう
   Ⓑ ようびボックス(7こ)→ その ようびに ふくしゅう。まちがえたら Ⓐへ もどる
   ========================================================= */

const EXAM_DATE = new Date(2026, 9, 4);   // 2026/10/4
const KEY = "eigo_craft_v5";
const KEY_V4 = "eigo_craft_v4";           // id が はいれつの ばんめ だった ころ(420ご)
const KEY_V3 = "eigo_craft_v3";           // たんごを けす まえ(600ご)
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

/* ふるい きろくの ひっこし。

   v5から id は ばんごう(no)そのものなので、これから たんごを
   足したり けしたり しても id は ずれない。だが v3・v4では
   id が「はいれつの なんばんめか」だったので、そのままでは
   「おぼえた」きろくが べつの たんごに ついてしまう。
   そこで ふるい id を いったん ばんごうに もどしてから、
   いまの id へ つけかえる。

   v3: 600ご ぜんぶ あった ころ。ばんごう = id + 1
   v4: 316〜495ばんを けした あと。0〜314 → 1〜315ばん、
       315〜419 → 496〜600ばん
   どちらも いまは 存在しない たんごの きろくは すてる。 */
const V3_ID_TO_NO = (id) => id + 1;
const V4_ID_TO_NO = (id) => (id <= 314 ? id + 1 : id + 181);

let migratedFrom = null;
function migrateOld(d, idToNo) {
  const remap = (obj) => {
    const out = {};
    Object.keys(obj || {}).forEach((k) => {
      const w = WORD_BY_ID.get(idToNo(Number(k)));
      if (w) out[w.id] = obj[k];
    });
    return out;
  };
  d.mastery = remap(d.mastery);
  d.box = remap(d.box);
  // はんいの くぎりかたも かわるので、はんい がらみは まっさらに もどす
  d.lastRange = 1;
  d.today = null;
  return d;
}

function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
  // あたらしい ほうから じゅんに さがす
  if (!d) {
    [[KEY_V4, V4_ID_TO_NO], [KEY_V3, V3_ID_TO_NO]].some(([key, idToNo]) => {
      let old = null;
      try { old = JSON.parse(localStorage.getItem(key)); } catch (e) { old = null; }
      if (!old) return false;
      d = migrateOld(old, idToNo);
      migratedFrom = key;
      return true;
    });
  }
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
    answerMode: ["know", "choice", "type"].includes(d.answerMode) ? d.answerMode : "choice",
    packs: d.packs !== undefined ? d.packs : (d.bossDefeated || 0),   // あけた パックの かず
    today: freshDay(d.today),            // きょう やったぶんの きろく
    history: d.history || {},            // 日づけ -> {w: れんしゅうご数, g: そつぎょう数}
    bossDrops: d.bossDrops || [],        // (きゅうバージョン)てにいれた ドロップ
    items: d.items || {},                // itemId -> てにいれた こすう
  };
}

let P = load();
function save() { localStorage.setItem(KEY, JSON.stringify(P)); }
/* ひっこした ちょくごに 1かい ほぞんして v5を つくる。
   こうしないと なにか こたえるまで v5が できず、まいかい
   ひっこしなおす ことに なる。ふるい きろくは もしもの ときの
   ひかえとして けさずに のこしておく。 */
if (migratedFrom) save();

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
  const remain = TOTAL - boxedCount();
  if (remain <= 0) return 0;
  return Math.max(1, Math.ceil(remain / Math.max(1, days)));
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
/* こえは「なまえ(voiceURI)」だけ おぼえておき、つかう ときは
   いまの いちらんから ひきなおす。

   こえの オブジェクトそのものを ためこむと、たんまつが こえの いちらんを
   つくりなおした とき ふるい オブジェクトが むこうに なり、
   speak() が だまって しっぱいして おとが まったく 出なくなる。
   ひきなおしは さがすだけ なので、まいかい てんすうを つけて
   ならべかえる よりも ずっと かるい。 */
const voicePick = {};   // langPrefix -> voiceURI

function bestVoice(list, langPrefix) {
  const candidates = list.map((v) => ({ v, s: voiceScore(v, langPrefix) })).filter((x) => x.s >= 0);
  candidates.sort((a, b) => b.s - a.s);
  return candidates.length ? candidates[0].v : null;
}

function pickVoice(langPrefix = "en") {
  if (!window.speechSynthesis) return null;
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const saved = voicePick[langPrefix];
  if (saved) {
    const live = voices.find((v) => v.voiceURI === saved);
    if (live) return live;            // いまの いちらんの なかの いきている こえ
    delete voicePick[langPrefix];     // なくなっていたら えらびなおす
  }
  const best = bestVoice(voices, langPrefix);
  if (best) voicePick[langPrefix] = best.voiceURI;
  return best;
}

/* おとが 出せる じょうたいに しておく。
   Chrome は とまった(paused)まま に なる ことが あり、そうなると
   なにを speak しても だまったまま に なる。 */
function wakeSynth() {
  const synth = window.speechSynthesis;
  if (!synth) return null;
  try { if (synth.paused) synth.resume(); } catch (e) { /* きにしない */ }
  return synth;
}

if (window.speechSynthesis) {
  // こえの いちらんは あとから とどく ことが あるので、とどいたら えらびなおす
  window.speechSynthesis.onvoiceschanged = () => {
    delete voicePick.en;
    delete voicePick.ja;
    pickVoice("en");
    pickVoice("ja");
  };
  pickVoice("en");
  pickVoice("ja");
  // まえの ページの よみあげが のこって つまっている ことが あるので ながす
  try { window.speechSynthesis.cancel(); } catch (e) { /* きにしない */ }
}
/* よみあげの はやさ。えいごは おぼえる たいしょうなので ゆっくり、
   にほんごの やくは「いみの かくにん」だけなので はやめに する
   (ゆっくり よむと 子どもが まちきれなくて わずらわしいため)。 */
const RATE_EN = 0.85;
const RATE_JA = 1.35;

function makeUtterance(text, langPrefix, rate) {
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(langPrefix);
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = langPrefix === "ja" ? "ja-JP" : "en-US"; }
  u.rate = rate;
  u.pitch = 1.0;
  return u;
}
function speak(text, rate = RATE_EN) {
  const synth = wakeSynth();
  if (!synth) return;
  synth.cancel();
  synth.speak(makeUtterance(text, "en", rate));
}
/* えいご→にほんご の じゅんに つづけて よむ(れいぶんを セットで おぼえる) */
/* だいたいの よみあげ時間。
   Web Speech は たんまつに よっては onend が こない ことが あるので、
   「よみおわるまで すすめない」を つくる ときの ほけんに つかう。 */
function estimateSpeakMs(text, rate = 1) {
  return Math.max(1200, (String(text).length * 130) / rate);
}

/* えいご→にほんご を つづけて よむ。
   onDone は にほんごが よみおわった とき(または ほけんの 時間ぎれ)に よばれる。 */
function speakPair(en, ja, onDone) {
  let done = false;
  let guard = null;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(guard);
    if (onDone) onDone();
  };
  const synth = wakeSynth();
  if (!synth) { finish(); return; }
  synth.cancel();
  const uEn = makeUtterance(en, "en", RATE_EN);
  const uJa = makeUtterance(ja, "ja", RATE_JA);

  // えいごが おわってから にほんごを つくると、こえの じゅんびに 時間が
  // かかって あいだが あいてしまう。さきに 2つとも ならべておくと、
  // えいごを よんでいる あいだに にほんごの じゅんびが すすむ。
  let jaStarted = false;
  uJa.onstart = () => { jaStarted = true; };
  uJa.onend = finish;
  uJa.onerror = finish;
  synth.speak(uEn);
  synth.speak(uJa);

  // ならべても にほんごが はじまらない たんまつ が あるので、その ときだけ よびだす
  uEn.onend = () => setTimeout(() => {
    if (!jaStarted && !synth.speaking && !synth.pending) {
      const retry = makeUtterance(ja, "ja", RATE_JA);
      retry.onend = finish;
      retry.onerror = finish;
      synth.speak(retry);
    }
  }, 300);

  // ほけん。onend が こない たんまつでも かならず ここで とく
  guard = setTimeout(finish, estimateSpeakMs(en, RATE_EN) + estimateSpeakMs(ja, RATE_JA) + 1200);
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
["home", "ranges", "wordlist", "boxes", "items", "learn", "quiz", "result", "wrong", "grammar", "wordorder", "daimon2", "listen1", "listen2"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});
function show(name) {
  if (name !== "learn") { speakGen++; setLearnLock(false); }
  if (name !== "listen1" && L1) { L1.gen++; }
  if (name !== "listen2" && L2) { L2.gen++; }
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, ranges: renderRanges, boxes: renderBoxes, items: renderItems }[name] || (() => {}))();
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

  const days = daysLeft();
  document.getElementById("daysLeft").textContent = days;

  const remain = TOTAL - boxedCount();
  const pace = document.getElementById("paceMessage");
  if (remain <= 0) {
    pace.textContent = "🎉 ぜんぶ ボックスに はいったよ!かんぺき!";
  } else if (days <= 0) {
    pace.textContent = "きょうが ほんばん!いままでの ちからを ぜんぶ 出そう!";
  } else {
    const perDay = Math.max(1, Math.ceil(remain / days));
    pace.textContent = `🎯ごうかくラインまで のこり ${remain}ご。1日に ${perDay}ごで まにあうよ!`;
  }

  renderToday();

  renderAnsMode();

  const got = collectedCount();
  document.getElementById("itemsSub").textContent = got === 0
    ? "パックで ひいた アイテムを 見る"
    : `${got} / ${ITEM_TOTAL} しゅるい あつめた`;

  const wd = new Date().getDay();
  const todayInfo = WEEKDAYS.find((w) => w.day === wd);
  const todayCount = wordsInBox(wd).length;
  document.getElementById("todayBoxLabel").textContent = `${todayInfo.icon} きょう(${todayInfo.label})の ふくしゅう`;
  const notif = document.getElementById("boxNotif");
  notif.textContent = todayCount;
  notif.classList.toggle("hidden", todayCount === 0);

}

/* ---------- 📅 きょう やったぶん ---------- */
/* まだ おわっていない はんい。
   きょう さわった はんいが あれば そこ、なければ つぎに やるべき はんい。 */
function nextRange() {
  const pool = RANGES.filter((r) => {
    const ws = wordsInRange(r.id);
    return ws.some((w) => P.box[w.id] === undefined);
  });
  if (!pool.length) return null;
  const touchedToday = pool.filter((r) => P.today.ranges.includes(r.id));
  if (touchedToday.length) return touchedToday[touchedToday.length - 1];
  const started = pool.filter((r) =>
    wordsInRange(r.id).some((w) => (P.mastery[w.id] || 0) > 0 || P.box[w.id] !== undefined));
  return (started.length ? started : pool)[0];
}

function renderToday() {
  rollDay();

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
      `${boxed}/${ws.length}ご ボックスへ`;
    btn.onclick = () => { sfxClick(); renderWordlist(nr.id); };
  }
}

/* ---------- Ⓐ はんいえらび ---------- */
function renderRanges() {
  rollDay();
  // うえの おびは「きょう どれだけ やったか」だけ。
  // 「つぎは どこ」は カードの しるしで わかるので ここでは くりかえさない。
  const sum = document.getElementById("rangeToday");
  sum.innerHTML = P.today.ranges.length === 0
    ? "📅 きょうは まだ Ⓐを やってないよ"
    : `📅 きょう やったのは <b>${P.today.ranges.length}はんい</b> ・ <b>${P.today.words.length}ご</b>`;

  const nr = nextRange();
  const nextId = nr ? nr.id : null;
  const wrap = document.getElementById("rangeGrid");
  wrap.innerHTML = "";

  RANGES.forEach((r) => {
    const ws = wordsInRange(r.id);
    const done = ws.filter((w) => P.box[w.id] !== undefined).length;
    const points = ws.reduce((sum2, w) => sum2 + (P.box[w.id] !== undefined ? MASTER_COUNT : P.mastery[w.id] || 0), 0);
    const pct = (points / (ws.length * MASTER_COUNT)) * 100;
    const untouched = points === 0;
    const finished = done === ws.length;
    const doneToday = P.today.ranges.includes(r.id);
    const isNext = r.id === nextId;

    const el = document.createElement("div");
    el.className = "range-card" +
      (finished ? " done" : "") + (untouched ? " untouched" : "") +
      (doneToday ? " today" : "") + (isNext ? " next" : "");

    /* しるしは 2つの じくに わける。まぜると どれが なにか わからなく なる。
       ・わくの いろ = 「つぎ どこを やるか」(みずいろ 1まいだけ)
       ・📅きょう の チップ = 「きょう さわったか」(何まいでも つく)
       すすみぐあいは バー(せいかいカウントの つみあげ)と
       📦のかず(Ⓑへ そつぎょうした ご数)の 2つだけ。
       バーは 1もん あたるたび のびるので うごきが 見えるが、
       📦は そつぎょうしないと ふえないので、かならずしも 一致しない。
       たんに「0/15」だと どちらの ことか わからないので 📦を つける。 */
    el.innerHTML = `
      ${isNext ? `<div class="range-badge">👉 ${doneToday ? "つづきは ここ" : "つぎは ここ"}</div>` : ""}
      <div class="range-line">
        <span class="range-title">${r.title}</span>
        <span class="range-marks">${doneToday ? '<span class="rm-today">📅きょう</span>' : ""}${finished ? '<span class="rm-done">✅</span>' : ""}</span>
      </div>
      <div class="range-prog">
        <div class="mc-bar"><div class="mc-bar-fill" style="width:${pct}%"></div></div>
        <span class="range-count">📦${done}/${ws.length}</span>
      </div>
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

/* ---------- こたえかたの きりかえ ---------- */
const ANS_NOTES = {
  know:   "子どもが こえで こたえて、おやが ⭕❌ を つける。いちばん はやい",
  choice: "4つから えらぶ。ひとりでも できる",
  type:   "にほんごを キーボードで かく。いちばん あたまを つかう",
};
function renderAnsMode() {
  const m = answerMode();
  document.querySelectorAll("#ansSeg .ans-btn").forEach((b) => {
    b.classList.toggle("on", b.dataset.mode === m);
  });
  document.getElementById("ansNote").textContent = ANS_NOTES[m];
}
document.querySelectorAll("#ansSeg .ans-btn").forEach((b) => {
  b.addEventListener("click", () => {
    sfxClick();
    P.answerMode = b.dataset.mode;
    save();
    renderAnsMode();
  });
});

/* ---------- 🎒 もちもの ずかん ----------
   パックで ひいた アイテムを レアリティごとに ならべて 見せる。
   まだ 出ていない ものは ❔ で かくして、なにが のこっているかを
   わかるようにする(ずかんを うめたく なる しかけ)。 */
function collectedCount() { return ALL_ITEMS.filter((it) => P.items[it.id]).length; }

function renderItems() {
  const got = collectedCount();
  document.getElementById("itemGot").textContent = got;
  document.getElementById("itemTotal").textContent = ITEM_TOTAL;
  document.getElementById("itemBar").style.width = (got / ITEM_TOTAL) * 100 + "%";

  const wrap = document.getElementById("itemTiers");
  wrap.innerHTML = "";
  DROP_TIERS.forEach((t) => {
    const mine = t.items.filter((it) => P.items[it.id]).length;
    const sec = document.createElement("div");
    sec.className = "item-tier";
    sec.style.setProperty("--tc", t.color);
    const cells = t.items.map((it) => {
      const n = P.items[it.id] || 0;
      if (!n) return `<div class="item-cell"><div class="item-ic">❔</div><div class="item-n">???</div></div>`;
      return `<div class="item-cell got"><div class="item-ic">${it.ic}</div>` +
             `<div class="item-n">${it.n}</div>` +
             (n > 1 ? `<div class="item-dup">×${n}</div>` : "") + `</div>`;
    }).join("");
    sec.innerHTML =
      `<div class="item-tier-head">` +
        `<span class="item-tier-name">${t.name}<span class="item-tier-sub">${t.label}</span></span>` +
        `<span class="item-tier-count">${mine}/${t.items.length}</span>` +
      `</div>` +
      `<div class="item-grid">${cells}</div>`;
    wrap.appendChild(sec);
  });
}

document.getElementById("btnItems").addEventListener("click", () => { sfxClick(); show("items"); });

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
  const all = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_BY_ID.get(id));
  if (all.length === 0) {
    advancement("この はんいは ぜんぶ ボックスに あるよ!", "🎉", "コンプリート!");
    show("ranges");
    return;
  }
  // is/am/at のような きのうごは、たんご1つだけ カードに 出しても
  // おぼえようが ない(絵や 日本語訳が 1つに きまらないため)。
  // なので カードには 出さず、大もん1と おなじ「ぶんの あなうめ」クイズ
  // だけで 出題する(Ⓐ・Ⓑの きろくは そのまま つく)。
  const ws = all.filter((w) => !isTypeHard(w));
  if (ws.length === 0) {
    // この はんいが ぜんぶ きのうごの ときは、カードを とばして
    // いきなり クイズへ すすむ。
    advancement("この はんいは ぶんの あなうめだけ!カードは とばすよ", "📝", "クイズへ ちょくこう");
    startQuiz(rangeId, "A");
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
  speakGen++;          // まえの よみあげの あとしまつが とどいても むしする
  setLearnLock(false);

  document.getElementById("cardNo").textContent = `No.${w.no}`;
  document.getElementById("cardEn").textContent = w.en;
  document.getElementById("cardSlotQ").textContent = "❓";
  document.getElementById("cardEnBack").textContent = w.en;
  document.getElementById("cardEmoji").textContent = w.emoji;
  document.getElementById("cardJa").textContent = w.ja;
  document.getElementById("cardEx").innerHTML =
    `<span class="card-ex-en" id="cardExEn">🔊 ${escapeHtml(w.ex)}</span><br>${escapeHtml(w.exJa)}`;
  document.getElementById("cardExEn").addEventListener("click", (e) => {
    e.stopPropagation();
    playPairLocked(w.ex, w.exJa);
  });

  const vis = document.getElementById("cardVis");
  if (w.vis) { vis.innerHTML = visHTML(w.vis); vis.classList.remove("hidden"); }
  else { vis.classList.add("hidden"); }

  document.getElementById("cardFront").classList.remove("hidden");
  document.getElementById("cardBack").classList.add("hidden");
  document.getElementById("learnPos").textContent = `${L.i + 1} / ${L.words.length}`;

  const last = L.i === L.words.length - 1;
  document.getElementById("btnNext").textContent = last ? "さいしょへ" : "つぎ ▶";
  // クイズへ すすむ ボタンは さいごの カードまで 出さない。
  // 「つぎ」の すぐ下に ずっと 出ていると、めくって いる とちゅうで
  // まちがって おして しまい、おぼえる まえに クイズが はじまって しまう。
  document.getElementById("btnGoQuiz").classList.toggle("hidden", !last);

  speak(w.en);
}

/* =========================================================
   よみおわるまで つぎに すすめない しくみ

   子どもが めんどくさがって、にほんごの よみあげを きかずに
   「つぎ」を おして しまう ため、よみあげちゅうは ボタンを とめる。
   よみあげが こわれても かならず とけるように、speakPair 側の
   ほけんタイマーで さいごには onDone が よばれる。
   ========================================================= */
let speakGen = 0;

function setLearnLock(on) {
  ["btnPrev", "btnNext", "btnGoQuiz"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.disabled = on;
    el.classList.toggle("dim", on);
  });
  const note = document.getElementById("listenNote");
  if (note) note.classList.toggle("hidden", !on);
}

/* れいぶんを よみながら、おわるまで ボタンを とめる */
function playPairLocked(en, ja) {
  const gen = ++speakGen;
  setLearnLock(true);
  speakPair(en, ja, () => {
    // あたらしい よみあげが はじまって いたら、そちらに まかせる
    if (gen === speakGen) setLearnLock(false);
  });
}

function flipCard() {
  const w = L.words[L.i];
  L.flipped = !L.flipped;
  document.getElementById("cardFront").classList.toggle("hidden", L.flipped);
  document.getElementById("cardBack").classList.toggle("hidden", !L.flipped);
  if (L.flipped) {
    sfxClick();
    // うらは「いみ + れいぶん」。ここで れいぶんを えいご→にほんごで きかせ、
    // よみおわるまで「つぎ」を おせないように する
    playPairLocked(w.ex, w.exJa);
  }
}

document.getElementById("card").addEventListener("click", (e) => {
  if (e.target.closest(".sound-btn")) return;
  flipCard();
});
document.getElementById("btnSpeak").addEventListener("click", () => speak(L.words[L.i].en));
document.getElementById("btnSpeak2").addEventListener("click", () => speak(L.words[L.i].en));
document.getElementById("btnPrev").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  if (L.i > 0) { L.i--; sfxClick(); renderCard(); }
});
document.getElementById("btnNext").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  L.i = L.i < L.words.length - 1 ? L.i + 1 : 0;
  sfxClick();
  renderCard();
});
document.getElementById("btnGoQuiz").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  startQuiz(L.range, "A");
});

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

/* =========================================================
   🎁 パックゲージ(Ⓐの クイズに くみこみ)

   せいかいが ふえるほど もらえる パックの レアリティが 上がる。
   「あと なんもん せいかいすれば つぎの レアリティか」を
   クイズちゅう ずっと 見せて、さいごまで 手を ぬかないように する。
   ========================================================= */
function packGaugeState() {
  const total = Q.words.length;
  const remaining = total - Q.i;                 // まだ こたえていない かず
  const maxPossible = Q.correct + remaining;     // ぜんぶ せいかいした ときの かず
  return {
    total,
    now: tierForScore(Q.correct, total),                 // いま とどいている レアリティ
    best: tierForScore(maxPossible, total),              // これから とどきうる さいこう
    maxPossible,
  };
}

function renderPackGauge() {
  const gauge = document.getElementById("packGauge");
  if (Q.mode === "B") { gauge.classList.add("hidden"); return; }
  gauge.classList.remove("hidden");

  const st = packGaugeState();
  const total = st.total;

  // マスを ならべる。みぎに いくほど レアリティが 上がるのが 見た目で わかる
  const track = document.getElementById("pgTrack");
  track.innerHTML = "";
  for (let j = 1; j <= total; j++) {
    const tier = tierForScore(j, total);
    const cell = document.createElement("div");
    cell.className = "pg-cell" + (j <= Q.correct ? " on" : "") + (j > st.maxPossible ? " lost" : "");
    // レアリティに とどく まえの マスも、せいかいが つみあがるのが わかるよう みどりに
    cell.style.setProperty("--c", tier ? tier.color : "#5EA827");
    // レアリティが 切りかわる マスに しるしを つける
    const prev = tierForScore(j - 1, total);
    if (tier && (!prev || prev.key !== tier.key)) {
      cell.classList.add("mark");
      cell.dataset.tier = tier.name.slice(0, 1);
    }
    track.appendChild(cell);
  }

  const pack = document.getElementById("pgPack");
  pack.textContent = st.now ? "🎁" : "📦";
  pack.style.setProperty("--c", st.now ? st.now.color : "#6E6E6E");
  pack.className = "pg-pack" + (st.now ? " got t-" + st.now.key : "");

  const tierEl = document.getElementById("pgTier");
  tierEl.textContent = st.now ? `いま ${st.now.name} パック` : "まだ パックなし";
  tierEl.style.color = st.now ? st.now.color : "var(--text-dim)";

  // つぎの レアリティまで あと なんもん か
  const next = DROP_TIERS.slice().reverse()
    .find((t) => (!st.now || t.min > st.now.min) && st.maxPossible >= needForTier(t, total));
  const el = document.getElementById("pgNext");
  if (next) {
    const left = needForTier(next, total) - Q.correct;
    el.innerHTML = `あと <b style="color:${next.color}">${left}もん</b> せいかいで <b style="color:${next.color}">${next.name}</b>!`;
  } else if (st.now) {
    el.innerHTML = `<b style="color:${st.now.color}">さいこうランク かくてい!</b>`;
  } else {
    el.innerHTML = `のこり ぜんぶ せいかいしても パックは とどかない…<br>さいごまで やりきろう!`;
  }
}

/* せいかいした ときの えんしゅつ(パックが 1だん上がったら はでに しらせる) */
function bumpPackGauge(beforeTier) {
  const st = packGaugeState();
  const pack = document.getElementById("pgPack");
  pack.classList.remove("up");
  void pack.offsetWidth;
  pack.classList.add("up");
  if (st.now && (!beforeTier || st.now.key !== beforeTier.key)) {
    sfxGraduate();
    orbs(8, "🎁");
    advancement(`${st.now.name} パック かくとく けん!`, "🎁", "ランク アップ!");
    const r = pack.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, st.now.color);
  }
}

function startQuiz(rangeId, mode) {
  const pool = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_BY_ID.get(id));
  const words = shuffle(pool);
  Q = {
    mode, rangeId, words, i: 0, correct: 0, combo: 0, graduated: [], wrong: [], locked: false,
  };
  logRange(rangeId);
  logQuiz();
  document.getElementById("quizTotal").textContent = words.length;
  show("quiz");
  renderPackGauge();
  renderQuiz();
}

function startBoxQuiz(day) {
  const pool = wordsInBox(day);
  Q = { mode: "B", day, words: shuffle(pool), i: 0, correct: 0, combo: 0, demoted: [], wrong: [], locked: false };
  document.getElementById("quizTotal").textContent = Q.words.length;
  show("quiz");
  renderPackGauge();
  renderQuiz();
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

/* =========================================================
   🧩 ごじゅんれんしゅう(大もん3「語句整序」の ちからだめし)

   本番は 4つの あたえられた ごを ならべかえる もんだいだけど、
   ここでは 文まるごとを タイルに して、日本語の いみを 見ながら
   タップで じゅんばんに くみたてる れんしゅうに している
   (単語力が いらない ぶん、文の くみたて そのものに しゅうちゅう できる)。

   Ⓐ・Ⓑの きろくは かえない、ごじゅんかんかく だけの れんしゅう。
   ========================================================= */
const WORDORDER_BATCH_SIZE = 10;
let WO = null;

function buildWordOrderQuestions(n) {
  const pool = wordOrderPool();
  const targets = shuffle(pool).slice(0, n);
  return targets.map((w) => {
    const { tokens, end } = tokenizeEx(w.ex);
    let bank;
    do { bank = shuffle(tokens); } while (tokens.length > 1 && bank.join(" ") === tokens.join(" "));
    return { w, tokens, end, bank };
  });
}

function startWordOrder() {
  const qs = buildWordOrderQuestions(WORDORDER_BATCH_SIZE);
  if (qs.length === 0) return;
  WO = { qs, i: 0, correct: 0, locked: false, placed: [], bank: [] };
  document.getElementById("woTotal").textContent = qs.length;
  document.getElementById("woResult").classList.add("hidden");
  show("wordorder");
  renderWordOrder();
}

function renderWordOrder() {
  const q = WO.qs[WO.i];
  WO.locked = false;
  WO.placed = [];
  WO.bank = q.bank.map((t, idx) => ({ t, idx, used: false }));
  document.getElementById("woPos").textContent = WO.i + 1;
  document.getElementById("woBar").style.width = (WO.i / WO.qs.length) * 100 + "%";
  document.getElementById("woJa").textContent = q.w.exJa || q.w.ja;
  document.getElementById("woFeedback").classList.add("hidden");
  renderWoTiles();
}

/* いま くみたてている文(build)と のこりの タイル(bank)を かきなおす */
function renderWoTiles() {
  const q = WO.qs[WO.i];
  const build = document.getElementById("woBuild");
  const bank = document.getElementById("woBank");

  build.innerHTML = "";
  for (let j = 0; j < q.tokens.length; j++) {
    const item = WO.placed[j];
    const slot = document.createElement("button");
    slot.className = "wo-slot" + (item ? " filled" : "");
    slot.textContent = item ? item.t : "";
    if (item) {
      slot.addEventListener("click", () => {
        if (WO.locked) return;
        sfxClick();
        WO.bank.find((b) => b.idx === item.idx).used = false;
        WO.placed.splice(j, 1);
        renderWoTiles();
      });
    }
    build.appendChild(slot);
  }
  const endEl = document.createElement("span");
  endEl.className = "wo-end";
  endEl.textContent = q.end;
  build.appendChild(endEl);

  bank.innerHTML = "";
  WO.bank.forEach((b) => {
    if (b.used) return;
    const tile = document.createElement("button");
    tile.className = "wo-tile";
    tile.textContent = b.t;
    tile.addEventListener("click", () => {
      if (WO.locked || WO.placed.length >= q.tokens.length) return;
      sfxClick();
      b.used = true;
      WO.placed.push(b);
      renderWoTiles();
      if (WO.placed.length === q.tokens.length) checkWordOrder();
    });
    bank.appendChild(tile);
  });
}

function checkWordOrder() {
  if (!WO || WO.locked) return;
  WO.locked = true;
  const q = WO.qs[WO.i];
  const built = WO.placed.map((b) => b.t);
  const ok = built.every((t, j) => t.toLowerCase() === q.tokens[j].toLowerCase());

  // 1文字ずつ あっているか(あっていない ばしょは あかく する)
  const slots = document.querySelectorAll("#woBuild .wo-slot");
  slots.forEach((slot, j) => {
    slot.classList.add(built[j] && built[j].toLowerCase() === q.tokens[j].toLowerCase() ? "ok" : "ng");
  });

  const fb = document.getElementById("woFeedback");
  fb.classList.remove("hidden", "ok", "ng");
  const fullEn = q.tokens.join(" ") + q.end;

  if (ok) {
    WO.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    orbs(4, "🟢");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${fullEn}</span>`;
  } else {
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 おしい!<span class="fb-ja">せいかいは「${fullEn}」だよ</span>`;
  }
  speakPair(q.w.ex, q.w.exJa);

  setTimeout(() => {
    WO.i++;
    if (WO.i >= WO.qs.length) {
      document.getElementById("woBar").style.width = "100%";
      finishWordOrder();
    } else {
      renderWordOrder();
    }
  }, ok ? 2400 : 3000);
}

document.getElementById("btnWoReset").addEventListener("click", () => {
  if (!WO || WO.locked) return;
  sfxClick();
  WO.placed = [];
  WO.bank.forEach((b) => { b.used = false; });
  renderWoTiles();
});

function finishWordOrder() {
  bumpStreak();
  document.getElementById("woScore").textContent = WO.correct;
  document.getElementById("woResultTotal").textContent = WO.qs.length;
  document.getElementById("woResult").classList.remove("hidden");
  addXP(WO.correct);
  if (WO.correct === WO.qs.length) {
    sfxChest();
    orbs(10, "💎");
    advancement("ごじゅん ぜんもん せいかい!", "🧩", "すごい!");
  }
}

document.getElementById("btnWordOrderMode").addEventListener("click", () => { sfxClick(); startWordOrder(); });
document.getElementById("btnWoRetry").addEventListener("click", () => { sfxClick(); startWordOrder(); });
document.getElementById("btnWoHome").addEventListener("click", () => { sfxClick(); show("home"); });

/* =========================================================
   💬 大もん2 れんしゅう(会話文の文空所補充)

   Aの はつげんに つづく Bの こたえの ( ) を、4つの えいごの
   せんたくしから えらぶ。ほんばんと おなじ「よむ」もんだいなので、
   もじを かくさず 出す(🔊は はつおんの かくにん よう)。

   Ⓐ・Ⓑの きろくは かえない。
   ========================================================= */
const DAIMON2_BATCH_SIZE = 10;
let D2 = null;

function startDaimon2() {
  const items = shuffle(DAIMON2_POOL).slice(0, DAIMON2_BATCH_SIZE);
  if (items.length === 0) return;
  D2 = { items, i: 0, correct: 0, locked: false };
  document.getElementById("d2Total").textContent = items.length;
  document.getElementById("d2Result").classList.add("hidden");
  show("daimon2");
  renderDaimon2();
}

function d2FullB(it, useCorrect) {
  const head = useCorrect ? it.correct : "(　　　　　　　　　　)";
  return it.after ? `${head} ${it.after}` : head;
}

function renderDaimon2() {
  const it = D2.items[D2.i];
  D2.locked = false;
  document.getElementById("d2Pos").textContent = D2.i + 1;
  document.getElementById("d2Bar").style.width = (D2.i / D2.items.length) * 100 + "%";
  document.getElementById("d2Feedback").classList.add("hidden");

  document.getElementById("d2Dialogue").innerHTML =
    `<div class="d2-line"><b>A</b>: ${escapeHtml(it.a)}</div>` +
    `<div class="d2-line"><b>B</b>: <span class="cloze-blank">${escapeHtml(d2FullB(it, false))}</span></div>`;

  const wrap = document.getElementById("d2Choices");
  wrap.innerHTML = "";
  shuffle([it.correct, ...it.wrongs]).forEach((text) => {
    const b = document.createElement("button");
    b.className = "choice choice-en";
    b.textContent = text;
    if (text === it.correct) b.dataset.correct = "1";
    b.addEventListener("click", () => answerDaimon2(b, text === it.correct, it));
    wrap.appendChild(b);
  });

  speak(it.a);
}
document.getElementById("btnD2Speak").addEventListener("click", () => {
  if (!D2) return;
  const it = D2.items[D2.i];
  speak(D2.locked ? `${it.a} ${d2FullB(it, true)}` : it.a);
});

function answerDaimon2(btn, ok, it) {
  if (!D2 || D2.locked) return;
  D2.locked = true;

  document.querySelectorAll("#d2Choices .choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

  document.getElementById("d2Dialogue").innerHTML =
    `<div class="d2-line"><b>A</b>: ${escapeHtml(it.a)}</div>` +
    `<div class="d2-line"><b>B</b>: <span class="cloze-fill">${escapeHtml(d2FullB(it, true))}</span></div>`;

  const fb = document.getElementById("d2Feedback");
  fb.classList.remove("hidden", "ok", "ng");
  if (ok) {
    D2.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    orbs(4, "🟢");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${it.correctJa}</span>`;
  } else {
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 おしい!<span class="fb-ja">せいかいは「${escapeHtml(it.correct)}」<br>${it.correctJa}</span>`;
  }
  speak(`${it.a} ${d2FullB(it, true)}`);

  setTimeout(() => {
    D2.i++;
    if (D2.i >= D2.items.length) {
      document.getElementById("d2Bar").style.width = "100%";
      finishDaimon2();
    } else {
      renderDaimon2();
    }
  }, ok ? 2200 : 2800);
}

function finishDaimon2() {
  bumpStreak();
  document.getElementById("d2Score").textContent = D2.correct;
  document.getElementById("d2ResultTotal").textContent = D2.items.length;
  document.getElementById("d2Result").classList.remove("hidden");
  addXP(D2.correct);
  if (D2.correct === D2.items.length) {
    sfxChest();
    orbs(10, "💎");
    advancement("大もん2 ぜんもん せいかい!", "💬", "すごい!");
  }
}

document.getElementById("btnDaimon2Mode").addEventListener("click", () => { sfxClick(); startDaimon2(); });
document.getElementById("btnD2Retry").addEventListener("click", () => { sfxClick(); startDaimon2(); });
document.getElementById("btnD2Home").addEventListener("click", () => { sfxClick(); show("home"); });

/* =========================================================
   🎧 リスニング だい1ぶ れんしゅう(会話の応答文選択)

   1つの はつげんを きいて、いちばん あう うけこたえを 3つから
   えらぶ。もじは 出さない(きくだけで こたえる)。
   ========================================================= */
const LISTEN1_BATCH_SIZE = 10;
let L1 = null;

function startListen1() {
  const items = shuffle(LISTEN1_POOL).slice(0, LISTEN1_BATCH_SIZE);
  if (items.length === 0) return;
  L1 = { items, i: 0, correct: 0, locked: false, gen: 0, opts: null };
  document.getElementById("l1Total").textContent = items.length;
  document.getElementById("l1Result").classList.add("hidden");
  show("listen1");
  renderListen1();
}

function setL1Lock(on) {
  document.querySelectorAll("#l1Choices .ln-choice").forEach((b) => { b.disabled = on; });
}

/* まず はつげんを よみ、そのあと ①②③の うけこたえを ながす */
function playListen1Seq() {
  if (!L1) return;
  const gen = ++L1.gen;
  const it = L1.items[L1.i];
  setL1Lock(true);

  let t = 0;
  setTimeout(() => { if (L1 && L1.gen === gen) speak(it.prompt, 0.85); }, t);
  t += estimateSpeakMs(it.prompt) + 700;

  L1.opts.forEach((opt) => {
    setTimeout(() => { if (L1 && L1.gen === gen) beep(880, 0.1, "sine", 0.05); }, t);
    t += 260;
    setTimeout(() => { if (L1 && L1.gen === gen) speak(opt.text, 0.85); }, t);
    t += estimateSpeakMs(opt.text) + 500;
  });
  setTimeout(() => { if (L1 && L1.gen === gen) setL1Lock(false); }, t);
}
document.getElementById("btnL1Replay").addEventListener("click", () => { sfxClick(); if (L1) playListen1Seq(); });

function renderListen1() {
  const it = L1.items[L1.i];
  L1.locked = false;
  L1.opts = shuffle([{ text: it.correct, ok: true }, ...it.wrongs.map((w) => ({ text: w, ok: false }))]);
  document.getElementById("l1Pos").textContent = L1.i + 1;
  document.getElementById("l1Bar").style.width = (L1.i / L1.items.length) * 100 + "%";
  document.getElementById("l1Feedback").classList.add("hidden");

  const wrap = document.getElementById("l1Choices");
  wrap.innerHTML = "";
  L1.opts.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.className = "ln-choice";
    b.innerHTML = `<span class="ln-num">${idx + 1}</span>`;
    if (opt.ok) b.dataset.correct = "1";
    b.addEventListener("click", () => answerListen1(b, opt, it));
    wrap.appendChild(b);
  });

  playListen1Seq();
}

function answerListen1(btn, opt, it) {
  if (!L1 || L1.locked) return;
  L1.locked = true;
  L1.gen++;
  setL1Lock(true);

  document.querySelectorAll("#l1Choices .ln-choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!opt.ok) btn.classList.add("ng");

  const fb = document.getElementById("l1Feedback");
  fb.classList.remove("hidden", "ok", "ng");
  if (opt.ok) {
    L1.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    orbs(4, "🟢");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${it.prompt} = ${it.promptJa}<br>${it.correct} = ${it.correctJa}</span>`;
  } else {
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">${it.prompt} = ${it.promptJa}<br>せいかいは「${escapeHtml(it.correct)}」<br>${it.correctJa}</span>`;
  }
  speakPair(`${it.prompt} ${it.correct}`, `${it.promptJa} ${it.correctJa}`);

  setTimeout(() => {
    L1.i++;
    if (L1.i >= L1.items.length) {
      document.getElementById("l1Bar").style.width = "100%";
      finishListen1();
    } else {
      renderListen1();
    }
  }, opt.ok ? 2600 : 3200);
}

function finishListen1() {
  bumpStreak();
  document.getElementById("l1Score").textContent = L1.correct;
  document.getElementById("l1ResultTotal").textContent = L1.items.length;
  document.getElementById("l1Result").classList.remove("hidden");
  addXP(L1.correct);
  if (L1.correct === L1.items.length) {
    sfxChest();
    orbs(10, "💎");
    advancement("リスニング1部 ぜんもん せいかい!", "🎧", "すごい!");
  }
}

document.getElementById("btnListen1Mode").addEventListener("click", () => { sfxClick(); startListen1(); });
document.getElementById("btnL1Retry").addEventListener("click", () => { sfxClick(); startListen1(); });
document.getElementById("btnL1Home").addEventListener("click", () => { sfxClick(); show("home"); });

/* =========================================================
   🎧 リスニング だい2ぶ れんしゅう(会話の内容一致選択)

   2ぎょうの 会話と しつもんを きいて、ないように あう こたえを
   4つの もじの せんたくしから えらぶ(せんたくしだけは 見える、
   会話・しつもんの もじは 出さない)。
   ========================================================= */
const LISTEN2_BATCH_SIZE = 10;
let L2 = null;

function startListen2() {
  const items = shuffle(LISTEN2_POOL).slice(0, LISTEN2_BATCH_SIZE);
  if (items.length === 0) return;
  L2 = { items, i: 0, correct: 0, locked: false, gen: 0 };
  document.getElementById("l2Total").textContent = items.length;
  document.getElementById("l2Result").classList.add("hidden");
  show("listen2");
  renderListen2();
}

function setL2ChoicesLock(on) {
  document.querySelectorAll("#l2Choices .choice").forEach((b) => { b.disabled = on; });
}

/* A → B → しつもん の じゅんに よむ */
function playListen2Seq() {
  if (!L2) return;
  const gen = ++L2.gen;
  const it = L2.items[L2.i];
  setL2ChoicesLock(true);

  let t = 0;
  [it.a, it.b, it.q].forEach((line, idx) => {
    setTimeout(() => { if (L2 && L2.gen === gen) speak(line, 0.85); }, t);
    t += estimateSpeakMs(line) + (idx === 1 ? 700 : 500);
  });
  setTimeout(() => { if (L2 && L2.gen === gen) setL2ChoicesLock(false); }, t);
}
document.getElementById("btnL2Replay").addEventListener("click", () => { sfxClick(); if (L2) playListen2Seq(); });

function renderListen2() {
  const it = L2.items[L2.i];
  L2.locked = false;
  document.getElementById("l2Pos").textContent = L2.i + 1;
  document.getElementById("l2Bar").style.width = (L2.i / L2.items.length) * 100 + "%";
  document.getElementById("l2Feedback").classList.add("hidden");

  const wrap = document.getElementById("l2Choices");
  wrap.innerHTML = "";
  shuffle([it.correct, ...it.wrongs]).forEach((text) => {
    const b = document.createElement("button");
    b.className = "choice choice-en";
    b.textContent = text;
    if (text === it.correct) b.dataset.correct = "1";
    b.addEventListener("click", () => answerListen2(b, text === it.correct, it));
    wrap.appendChild(b);
  });

  playListen2Seq();
}

function answerListen2(btn, ok, it) {
  if (!L2 || L2.locked) return;
  L2.locked = true;
  L2.gen++;
  setL2ChoicesLock(true);

  document.querySelectorAll("#l2Choices .choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

  const fb = document.getElementById("l2Feedback");
  fb.classList.remove("hidden", "ok", "ng");
  const dialogueJa = `A: ${it.a}<br>B: ${it.b}<br>Q: ${it.q} = ${it.qJa}`;
  if (ok) {
    L2.correct++;
    P.blocks++;
    save();
    updateHUD();
    sfxOk();
    orbs(4, "🟢");
    fb.classList.add("ok");
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${dialogueJa}</span>`;
  } else {
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">せいかいは「${escapeHtml(it.correct)}」<br>${dialogueJa}</span>`;
  }
  speak(`${it.a} ${it.b} ${it.q}`);

  setTimeout(() => {
    L2.i++;
    if (L2.i >= L2.items.length) {
      document.getElementById("l2Bar").style.width = "100%";
      finishListen2();
    } else {
      renderListen2();
    }
  }, ok ? 3200 : 3800);
}

function finishListen2() {
  bumpStreak();
  document.getElementById("l2Score").textContent = L2.correct;
  document.getElementById("l2ResultTotal").textContent = L2.items.length;
  document.getElementById("l2Result").classList.remove("hidden");
  addXP(L2.correct);
  if (L2.correct === L2.items.length) {
    sfxChest();
    orbs(10, "💎");
    advancement("リスニング2部 ぜんもん せいかい!", "🎧", "すごい!");
  }
}

document.getElementById("btnListen2Mode").addEventListener("click", () => { sfxClick(); startListen2(); });
document.getElementById("btnL2Retry").addEventListener("click", () => { sfxClick(); startListen2(); });
document.getElementById("btnL2Home").addEventListener("click", () => { sfxClick(); show("home"); });




/* =========================================================
   📝 大もん1 れんしゅう(ぶんの あなうめ)

   えいけん5きゅうの 大もん1は「短文の語句空所補充」。会話や たん文の
   なかの ( ) に 入る ことばを 4つから えらぶ もんだいで、たんごの
   いみを しっているだけでは とけず、文の いみが わからないと こたえが
   きまらない。dialogue-data.js の DAIMON1_POOL(オリジナルの もんだい
   31もん)から 出題する。

   ・やさしい … にほんごの やくを 見せる(いみが わかった うえで えらぶ)
   ・ほんばん … にほんごを かくす(ほんとうの しけんと おなじ)
   まちがえても Ⓐ・Ⓑの きろくは かわらない。なんども やれる れんしゅう。
   ========================================================= */
const GRAMMAR_BATCH_SIZE = 15;
let G = null;

function startGrammar() {
  const pool = DAIMON1_POOL;
  if (pool.length === 0) return;
  const items = shuffle(pool).slice(0, Math.min(GRAMMAR_BATCH_SIZE, pool.length));
  G = { items, i: 0, correct: 0, wrong: [], locked: false };
  document.getElementById("gTotal").textContent = items.length;
  document.getElementById("gResult").classList.add("hidden");
  show("grammar");
  renderGrammar();
}

/* pre/blank/post を 1つの 文しょうに くみたてる。
   revealed=false なら あなの ところを ( ) の まま、
   revealed=true なら せいかいを うめて 見せる。 */
function grammarLines(it, revealed) {
  const blankText = revealed
    ? `<span class="cloze-fill">${escapeHtml(it.correct)}</span>`
    : `<span class="cloze-blank">(　　　　　)</span>`;
  const after = it.after && /^[.,!?]/.test(it.after) ? it.after : ` ${it.after}`;
  const blankLine =
    (it.blankSpeaker ? `<b>${it.blankSpeaker}</b>: ` : "") +
    `${escapeHtml(it.before)} ${blankText}${escapeHtml(after)}`;
  const lines = [
    ...it.pre.map((l) => `<b>${l.speaker}</b>: ${escapeHtml(l.text)}`),
    blankLine,
    ...it.post.map((l) => `<b>${l.speaker}</b>: ${escapeHtml(l.text)}`),
  ];
  return lines.map((l) => `<div class="d2-line">${l}</div>`).join("");
}

function renderGrammar() {
  const it = G.items[G.i];
  G.locked = false;
  document.getElementById("gPos").textContent = G.i + 1;
  document.getElementById("gBar").style.width = (G.i / G.items.length) * 100 + "%";
  document.getElementById("gFeedback").classList.add("hidden");

  document.getElementById("gEn").innerHTML = grammarLines(it, false);

  const wrap = document.getElementById("gChoices");
  wrap.innerHTML = "";
  shuffle([it.correct, ...it.wrongs]).forEach((text) => {
    const b = document.createElement("button");
    b.className = "choice choice-en";
    b.textContent = text;
    if (text === it.correct) b.dataset.correct = "1";
    b.addEventListener("click", () => answerGrammar(b, text === it.correct, it));
    wrap.appendChild(b);
  });

  speakGrammar(it, false);
}

/* あなの ところを とばして よむ(こたえが きこえないように)。
   revealed=true の ときは せいかいを 入れて ぜんぶ よむ。 */
function speakGrammar(it, revealed) {
  const synth = wakeSynth();
  if (!synth) return;
  synth.cancel();

  const texts = [...it.pre.map((l) => l.text)];
  if (revealed) {
    const after = it.after && /^[.,!?]/.test(it.after) ? it.after : ` ${it.after}`;
    texts.push(`${it.before} ${it.correct}${after}`.replace(/\s+/g, " ").trim());
  } else {
    if (it.before) texts.push(it.before);
    texts.push({ gap: true });
    if (it.after) texts.push(it.after);
  }
  texts.push(...it.post.map((l) => l.text));

  let i = 0;
  const next = () => {
    if (i >= texts.length) return;
    const step = texts[i++];
    if (step && step.gap) {
      beep(760, 0.14, "sine", 0.05);
      setTimeout(next, 620);
      return;
    }
    const u = makeUtterance(step, "en", RATE_EN);
    u.onend = () => setTimeout(next, 300);
    synth.speak(u);
  };
  next();
}

function answerGrammar(btn, ok, it) {
  if (G.locked) return;
  G.locked = true;

  document.querySelectorAll("#gChoices .choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

  // こたえを あなに 入れる
  document.getElementById("gEn").innerHTML = grammarLines(it, true);

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
    fb.innerHTML = `⛏️ せいかい!<span class="fb-ja">${it.correct} = ${it.correctJa}</span>`;
  } else {
    G.wrong.push(it);
    sfxNg();
    document.getElementById("app").classList.add("shake");
    setTimeout(() => document.getElementById("app").classList.remove("shake"), 320);
    fb.classList.add("ng");
    fb.innerHTML = `💔 ざんねん!<span class="fb-ja">こたえは <b>${escapeHtml(it.correct)}</b> ・ ${it.correctJa}</span>`;
  }

  speakGrammar(it, true);

  setTimeout(() => {
    G.i++;
    if (G.i >= G.items.length) {
      document.getElementById("gBar").style.width = "100%";
      finishGrammar();
    } else {
      renderGrammar();
    }
  }, ok ? 2800 : 3600);
}

function finishGrammar() {
  bumpStreak();
  const total = G.items.length;
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
    msg.textContent += `\n\nまちがえた ことば: ${G.wrong.map((it) => it.correct).join(", ")}`;
  }
  document.getElementById("gResult").classList.remove("hidden");
  addXP(G.correct);
}

document.getElementById("btnGrammar").addEventListener("click", () => { sfxClick(); startGrammar(); });
document.getElementById("btnGRetry").addEventListener("click", () => { sfxClick(); startGrammar(); });
document.getElementById("btnGHome").addEventListener("click", () => { sfxClick(); show("home"); });

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

/* Ⓐ・Ⓑの こたえかたは 3つから えらぶ。
   know   … 子どもが こえで こたえて、おやが ⭕❌ を つける
   choice … 4たくから えらぶ
   type   … にほんごを キーボードで かく */
const ANSWER_MODES = ["know", "choice", "type"];
const answerMode = () => (ANSWER_MODES.includes(P.answerMode) ? P.answerMode : "choice");
const isTypeMode = () => answerMode() === "type";
const isKnowMode = () => answerMode() === "know";
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
  const synth = wakeSynth();
  if (!synth) return;
  const c = clozeParts(w);
  if (full || !c) { speak(w.ex || w.en); return; }
  synth.cancel();

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
    const u = makeUtterance(step.text, "en", RATE_EN);
    u.onend = () => setTimeout(next, 140);
    synth.speak(u);
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
  const knowMode = isKnowMode();
  const typeMode = useTypeInput(w);
  const choicesWrap = document.getElementById("choices");
  const typeWrap = document.getElementById("quizTypeWrap");
  choicesWrap.classList.toggle("hidden", typeMode || knowMode);
  typeWrap.classList.toggle("hidden", !typeMode);
  // こえで こたえる モード: こたえは かくしておいて、見てから ⭕❌
  document.getElementById("quizKnowWrap").classList.toggle("hidden", !knowMode);
  document.getElementById("knowAnswer").classList.add("hidden");
  document.getElementById("knowBtns").classList.add("hidden");
  document.getElementById("btnKnowReveal").classList.remove("hidden");
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
    document.getElementById("quizLabel").textContent =
      knowMode ? "( ) に 入る たんごを こえで いおう" : "( ) に 入るのは どれ?";
    renderClozeSentence(w, "clozeEn", "clozeJa", true);
    if (!knowMode) {
      choicesWrap.innerHTML = "";
      clozeChoices(w, shuffle).forEach((en) => {
        const b = document.createElement("button");
        b.className = "choice choice-en";
        b.textContent = en;
        if (en.toLowerCase() === w.en.toLowerCase()) b.dataset.correct = "1";
        b.addEventListener("click", () => answer(b, en.toLowerCase() === w.en.toLowerCase(), w));
        choicesWrap.appendChild(b);
      });
    }
    speakCloze(w);
  } else if (knowMode) {
    // こえで こたえる: えいごを 見せて(えは かくして)、いみを 口で いう
    document.getElementById("quizLabel").textContent = "この たんごの いみを こえで いおう";
    document.getElementById("quizSlot").textContent = "❓";
    document.getElementById("quizEn").textContent = w.en;
    speak(w.en);
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

/* こえで こたえる モード。
   こたえを 先に 見せてしまうと 子どもが 見て しまうので、
   「こたえを 見る」を おすまで かくしておく。見せてから
   おやが ⭕❌ を つける。 */
document.getElementById("btnKnowReveal").addEventListener("click", () => {
  if (!Q || Q.locked) return;
  sfxClick();
  const w = Q.words[Q.i];
  const box = document.getElementById("knowAnswer");
  if (useCloze(w)) {
    renderClozeSentence(w, "clozeEn", "clozeJa", false);   // あなに こたえを 入れる
    box.innerHTML = `<div class="know-ja">${escapeHtml(w.en)} = ${escapeHtml(w.ja)}</div>`;
  } else {
    document.getElementById("quizSlot").textContent = w.emoji;
    box.innerHTML = `<div class="know-ja">${escapeHtml(w.ja)}</div>`;
  }
  box.classList.remove("hidden");
  document.getElementById("btnKnowReveal").classList.add("hidden");
  document.getElementById("knowBtns").classList.remove("hidden");
});
document.getElementById("btnKnowOk").addEventListener("click", (e) => {
  if (!Q || Q.locked) return;
  answer(e.currentTarget, true, Q.words[Q.i]);
});
document.getElementById("btnKnowNg").addEventListener("click", (e) => {
  if (!Q || Q.locked) return;
  answer(e.currentTarget, false, Q.words[Q.i]);
});

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

  if (!useTypeInput(correct) && !isKnowMode()) {
    document.querySelectorAll("#choices .choice").forEach((b) => {
      if (b.dataset.correct === "1") b.classList.add("ok");
      else b.classList.add("dim");
    });
    if (!ok) btn.classList.add("ng");
  }
  if (isKnowMode()) document.getElementById("knowBtns").classList.add("hidden");

  document.getElementById("quizSlot").textContent = correct.emoji;

  const fb = document.getElementById("feedback");
  fb.classList.remove("hidden", "ok", "ng");
  let graduatedNow = false;

  let packTierBefore = null;
  if (ok) {
    packTierBefore = tierForScore(Q.correct, Q.words.length);   // ふえる まえの ランク
    Q.correct++;
    Q.combo++;
    P.blocks++;
    sfxOk();
    const r = btn.getBoundingClientRect();
    blockBreak(r.left + r.width / 2, r.top + r.height / 2, "#5EA827");
    orbs(Q.combo >= 3 ? 6 : 3, "🟢");


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

  renderPackGauge();
  if (ok) bumpPackGauge(packTierBefore);

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
    pack = openPack(rate, P.items);

    if (pack) {
      P.packs++;
      P.chests++;
      pack.perfect = rate >= 1;
      pack.items.forEach((it) => {
        it.isNew = !P.items[it.id];
        P.items[it.id] = (P.items[it.id] || 0) + 1;
      });
      loot.push({ ic: "🧰", t: "チェスト ×1" });
      pack.items.forEach((it) => loot.push({ ic: it.ic, t: it.n }));
      title = `🎁 ${pack.tier.name} パック かくとく!`;
      const upper = DROP_TIERS.slice().reverse().find((t) => t.min > pack.tier.min);
      msg = `せいとうりつ ${pct}% → アイテム ${pack.items.length}こ\n` +
            (pack.perfect
              ? "パーフェクト!さいこうの パックだ!"
              : `あと ${needForTier(upper, total) - score}もん せいかいしていたら ${upper.name} だった!`);
      sfxChest();
      orbs(12, "💎");
    } else {
      const low = DROP_TIERS[DROP_TIERS.length - 1];
      title = "📦 パックは とどかなかった…";
      msg = `せいとうりつ ${pct}%\n` +
            `${needForTier(low, total)}もん せいかいすると ${low.name} パックが もらえるよ!`;
    }

    if (Q.graduated.length > 0) {
      P.chests += Q.graduated.length;
      loot.push({ ic: "🧰", t: `そつぎょう チェスト ×${Q.graduated.length}` });
      msg += `\n🎉 ${Q.graduated.length}ご Ⓑボックスへ そつぎょう!`;
      if (!pack) { sfxChest(); orbs(10, "💎"); }
    }
  }
  save();

  document.getElementById("resultChest").textContent =
    Q.mode === "B" ? "📦" : pack ? "🎁" : "📦";
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
/* 「もういちど」は クイズを もういちど やる。
   1つの はんいは 1日に 2〜3かい まわすので、そのたびに カードを
   15まい めくりなおすのは しんどい。カードから やりたい ときは
   はんいいちらんから 入りなおす。 */
document.getElementById("btnRetry").addEventListener("click", () => {
  sfxClick();
  if (Q.mode === "B") startBoxQuiz(Q.day);
  else startQuiz(Q.rangeId, "A");
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
  document.getElementById("packPerfect").classList.toggle("hidden", !pack.perfect);
  document.getElementById("packColl").classList.add("hidden");
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

/* 1パック 1まいなので、ちいさい タイルを ならべるのでは なく
   トレーディングカード 1まいとして 大きく 見せる。 */
function revealItems(pack, fx) {
  const wrap = document.getElementById("packItems");
  const it = pack.items[0];
  const have = P.items[it.id] || 1;
  const no = ALL_ITEMS.findIndex((x) => x.id === it.id) + 1;

  wrap.innerHTML = `
    <div class="pull-card">
      <div class="pull-card-head">
        <span class="pull-rarity">${pack.tier.name}</span>
        <span class="pull-no">No.${String(no).padStart(3, "0")}</span>
      </div>
      <div class="pull-card-art"><span class="pull-ic">${it.ic}</span></div>
      <div class="pull-card-name">${it.n}</div>
      ${it.isNew ? '<div class="pull-new">NEW!</div>' : `<div class="pull-dup">もってる かず ×${have}</div>`}
    </div>
  `;
  sfxGraduate();
  if (it.isNew) orbs(6, it.ic);

  setTimeout(() => {
    // レイを おとして アイテムの なまえを よみやすくする
    document.getElementById("packOverlay").classList.add("settled");
    // ずかんが どこまで うまったか を その場で 見せる
    const got = collectedCount();
    const coll = document.getElementById("packColl");
    coll.innerHTML =
      `<div class="pc-lb">コレクション <b>${got}</b> / ${ITEM_TOTAL} しゅるい</div>` +
      `<div class="mc-bar thin"><div class="mc-bar-fill" style="width:${(got / ITEM_TOTAL) * 100}%"></div></div>`;
    coll.classList.remove("hidden");
    document.getElementById("btnPackClose").classList.remove("hidden");
    if (it.isNew) {
      advancement(`${pack.tier.name} ・ ${it.n}`, it.ic, "はじめての アイテム!");
    }
    packBusy = false;
  }, 700);
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

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnA").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.getElementById("btnB").addEventListener("click", () => { sfxClick(); show("boxes"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* ---------- スタート ---------- */
show("home");
