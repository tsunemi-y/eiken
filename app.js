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
    mastery: d.mastery || {},   // wordId -> 0..2 (Aでの れんぞく せいかいすう)
    box: d.box || {},           // wordId -> weekday(0-6) そつぎょうずみ
    lastRange: d.lastRange || 1,
    practice: d.practice === "listen" ? "listen" : "read",   // よむ / きく
    today: freshDay(d.today),            // きょう やったぶんの きろく
    history: d.history || {},            // 日づけ -> {w: れんしゅうご数, g: そつぎょう数}
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
/* しぼる まえに おぼえた 語の きろくも P.box に のこっているので、
   キーの かずを そのまま かぞえると「300 / 155ご」のように なる。
   いまの 単語リストに ある 語だけを かぞえる。 */
function boxedCount() { return WORD_LIST.filter((w) => P.box[w.id] !== undefined).length; }

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
/* preferLocal=true の ときは、たんまつの なかに 入っている こえ
   (localService)を つよく えらぶ。
   ネットワークごえは きれいだが、しゃべる まえに とりに いくので
   出だしが おくれる。えいごの あとの 日本語やくが「まが あく」のは
   これが げんいん。やくは いみの かくにん なので、きれいさより
   すぐ 出る ことを ゆうせんする。 */
function voiceScore(v, langPrefix, preferLocal) {
  let s = 0;
  if (new RegExp("^" + langPrefix, "i").test(v.lang)) s += 10; else return -1;
  if (langPrefix === "en" && v.lang.toLowerCase() === "en-us") s += 20;
  if (/google/i.test(v.name)) s += 50;
  if (preferLocal) {
    if (v.localService) s += 60;      // すぐ しゃべれる こえを さいゆうせん
  } else if (v.localService === false) {
    s += 15;                          // えいごは きれいさ ゆうせん
  }
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

/* 日本語の やくは「まを あけない」ことを ゆうせんする */
const prefersLocal = (langPrefix) => langPrefix === "ja";

function bestVoice(list, langPrefix) {
  const candidates = list
    .map((v) => ({ v, s: voiceScore(v, langPrefix, prefersLocal(langPrefix)) }))
    .filter((x) => x.s >= 0);
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
  }, 120);

  // ほけん。onend が こない たんまつでも かならず ここで とく
  guard = setTimeout(finish, estimateSpeakMs(en, RATE_EN) + estimateSpeakMs(ja, RATE_JA) + 1200);
}

/* ---------- エフェクト ---------- */
function advancement(name, icon = "✓", head = "") {
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
["home", "ranges", "wordlist", "boxes", "learn", "quiz", "result", "wrong"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});
function show(name) {
  if (name !== "learn") { speakGen++; setLearnLock(false); }
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, ranges: renderRanges, boxes: renderBoxes }[name] || (() => {}))();
}

/* ---------- HUD ---------- */

/* ---------- ホーム ---------- */
function renderHome() {

  const days = daysLeft();
  document.getElementById("daysLeft").textContent = days;

  /* のこり日数が すくない ときに「1日◯ご」を 出しても
     とどかない かずに なって やる気を そぐだけ なので、
     いまの すすみぐあいを そのまま 見せる。 */
  const boxed = boxedCount();
  const pace = document.getElementById("paceMessage");
  if (days <= 0) {
    pace.textContent = "きょうが 本番。いままで やった ぶんを 出しきろう。";
  } else {
    pace.textContent = `おぼえた 単語 ${boxed} / ${TOTAL}ご`;
  }

  renderToday();


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
  document.getElementById("rangesTitle").textContent =
    isListen() ? "🎧 リスニング" : "📖 リーディング";
  document.getElementById("rangesDesc").textContent = isListen()
    ? "英語を きいて、いみを えらぶ。こたえるまで 文字は 出ません。"
    : "英語を 読んで、いみを えらぶ。";
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
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
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
  document.querySelector("#btnNext .tile-title").textContent = last ? "さいしょへ" : "つぎ →";
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

function startQuiz(rangeId, mode) {
  const pool = wordsStillLearning(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_BY_ID.get(id));
  const words = shuffle(pool);
  Q = {
    mode, rangeId, words, i: 0, correct: 0, graduated: [], wrong: [], locked: false,
  };
  logRange(rangeId);
  logQuiz();
  document.getElementById("quizTotal").textContent = words.length;
  show("quiz");
  renderQuiz();
}

function startBoxQuiz(day) {
  const pool = wordsInBox(day);
  Q = { mode: "B", day, words: shuffle(pool), i: 0, correct: 0, demoted: [], wrong: [], locked: false };
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

/* 4たくの せんたくしを つくる(まちがいは ちかい ばんごうから) */
function buildChoices(w) {
  const pool = WORD_LIST.filter((x) => x.id !== w.id && x.ja !== w.ja);
  const near = pool.filter((x) => Math.abs(x.no - w.no) <= 20);
  const wrongs = shuffle(near.length >= 3 ? near : pool).slice(0, 3);
  return shuffle([w, ...wrongs]);
}

/* ---------- よむ / きく ----------
   おなじ 155ごを 2つの やりかたで れんしゅうする。
   read   … えいごを 見て いみを えらぶ(リーディング)
   listen … えいごを きいて いみを えらぶ(リスニング)。こたえるまで もじは 出さない
   こたえかたは 4たく だけ。 */
const isListen = () => P.practice === "listen";

/* きのうご(at / of / is / am など)は たんご 1つでは おぼえられないので、
   ぶんの あなうめ で 出す。 */
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

function addChoice(wrap, text, isEn, correct, w) {
  const b = document.createElement("button");
  b.className = isEn ? "choice choice-en" : "choice";
  b.textContent = text;
  if (correct) b.dataset.correct = "1";
  b.addEventListener("click", () => answer(b, correct, w));
  wrap.appendChild(b);
}

function renderQuiz() {
  const w = Q.words[Q.i];
  const listen = isListen();
  const cloze = useCloze(w);
  Q.locked = false;

  renderMasteryTag(w);
  renderDots(w);
  document.getElementById("quizPos").textContent = Q.i + 1;
  document.getElementById("quizBar").style.width = (Q.i / Q.words.length) * 100 + "%";
  document.getElementById("feedback").classList.add("hidden");

  // よむ ときは えいご(あなうめなら ぶん)を 出す。
  // きく ときは もじを ぜんぶ かくして おとだけに する。
  const slot = document.getElementById("quizSlot");
  slot.textContent = listen ? "🎧" : "?";
  slot.classList.toggle("hidden", cloze && !listen);
  document.getElementById("quizEn").classList.toggle("hidden", cloze || listen);
  document.getElementById("quizCloze").classList.toggle("hidden", !cloze || listen);

  const wrap = document.getElementById("choices");
  wrap.innerHTML = "";
  if (cloze) {
    document.getElementById("quizLabel").textContent =
      listen ? "きいて、( ) に 入る 語を えらぼう" : "( ) に 入るのは どれ?";
    renderClozeSentence(w, "clozeEn", "clozeJa", true);
    clozeChoices(w, shuffle).forEach((en) =>
      addChoice(wrap, en, true, en.toLowerCase() === w.en.toLowerCase(), w));
    speakCloze(w);
  } else {
    document.getElementById("quizLabel").textContent =
      listen ? "きいて、いみを えらぼう" : "この 英語の いみは?";
    document.getElementById("quizEn").textContent = w.en;
    buildChoices(w).forEach((c) => addChoice(wrap, c.ja, false, c.id === w.id, w));
    speak(w.en);
  }
}

document.getElementById("btnQuizSpeak").addEventListener("click", () => {
  if (!Q) return;
  const w = Q.words[Q.i];
  if (useCloze(w)) speakCloze(w, Q.locked); else speak(w.en);
});

function answer(btn, ok, correct) {
  if (Q.locked) return;
  Q.locked = true;

  document.querySelectorAll("#choices .choice").forEach((b) => {
    if (b.dataset.correct === "1") b.classList.add("ok");
    else b.classList.add("dim");
  });
  if (!ok) btn.classList.add("ng");

  // こたえたら もじを 出して、なんの 語だったか むすびつける
  // (きく モードでは ここで はじめて つづりが 見える)
  const slot = document.getElementById("quizSlot");
  slot.textContent = correct.emoji;
  slot.classList.remove("hidden");
  if (useCloze(correct)) {
    document.getElementById("quizCloze").classList.remove("hidden");
    renderClozeSentence(correct, "clozeEn", "clozeJa", false);
  } else {
    document.getElementById("quizEn").classList.remove("hidden");
  }

  const fb = document.getElementById("feedback");
  fb.classList.remove("hidden", "ok", "ng");
  const pair = `<span class="fb-ja">${escapeHtml(correct.en)} = ${escapeHtml(correct.ja)}</span>`;
  let graduatedNow = false;

  if (ok) {
    Q.correct++;
    sfxOk();
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
    fb.classList.add("ok");
    if (graduatedNow) {
      const info = WEEKDAYS.find((w2) => w2.day === P.box[correct.id]);
      fb.innerHTML = `おぼえた!<span class="fb-ja">${info.label}ようの ボックスへ</span>`;
    } else {
      fb.innerHTML = `せいかい${pair}`;
    }
  } else {
    Q.wrong.push(correct);
    sfxNg();
    if (Q.mode === "A") {
      P.mastery[correct.id] = 0;
    } else {
      delete P.box[correct.id];
      P.mastery[correct.id] = 0;
      Q.demoted.push(correct);
    }
    save();
    fb.classList.add("ng");
    const extra = Q.mode === "B" ? "<br>Ⓐに もどります" : "";
    fb.innerHTML = `ざんねん${pair.replace("</span>", extra + "</span>")}`;
  }

  // あなうめは ぶんまるごと、ふつうの 語は まちがえた ときだけ もういちど きかせる
  if (useCloze(correct)) speakPair(correct.ex, correct.exJa);
  else if (!ok) speak(correct.en);

  /* つぎの もんだいへ すすむ タイマー。こたえた すぐあとに「やめる」で
     べつの クイズを はじめると、この タイマーが あとから なって
     あたらしい クイズの 1もんめを かってに とばしてしまう
     (Q は つねに いまの クイズを さすため)。こたえた ときの
     クイズと ちがっていたら なにも しない。 */
  const quiz = Q;
  setTimeout(() => {
    if (Q !== quiz) return;
    Q.i++;
    if (Q.i >= Q.words.length) {
      document.getElementById("quizBar").style.width = "100%";
      finish();
    } else {
      renderQuiz();
    }
  }, useCloze(correct) ? (ok && !graduatedNow ? 2800 : 3400)
                       : (ok && !graduatedNow ? 1100 : 2000));
}

/* ---------- けっか ---------- */
function finish() {
  const total = Q.words.length;
  const score = Q.correct;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  let title, msg;

  if (Q.mode === "B") {
    const keep = total - Q.demoted.length;
    title = Q.demoted.length === 0 ? "ふくしゅう かんぺき" : "ふくしゅう かんりょう";
    msg = `${keep}ご ボックスに のこりました。` +
          (Q.demoted.length ? `\n${Q.demoted.length}ご はⒶに もどります。` : "");
  } else {
    title = pct >= 100 ? "ぜんもん せいかい" : pct >= 60 ? "ごうかくラインごえ" : "もういちど やってみよう";
    msg = `せいとうりつ ${pct}%`;
    if (Q.graduated.length > 0) msg += `\n${Q.graduated.length}ご がⒷボックスへ すすみました。`;
  }
  save();

  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultScore").textContent = score;
  document.getElementById("resultTotal").textContent = total;
  document.getElementById("resultMsg").innerText = msg;

  document.getElementById("btnBackRanges").classList.toggle("hidden", Q.mode !== "A");
  document.getElementById("btnBackBoxes").classList.toggle("hidden", Q.mode !== "B");
  const nothingLeft =
    Q.mode === "A"
      ? wordsStillLearning(wordsInRange(Q.rangeId).map((w) => w.id)).length === 0
      : wordsInBox(Q.day).length === 0;
  document.getElementById("btnRetry").classList.toggle("hidden", nothingLeft);
  document.getElementById("btnReviewWrong").classList.toggle("hidden", Q.wrong.length === 0 && (!Q.demoted || Q.demoted.length === 0));

  show("result");
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
/* よむ / きく の どちらで 入ったかを おぼえておく。
   はんいも カードも おなじ ものを つかい、クイズの 出しかただけが かわる。 */
function startPractice(mode) {
  sfxClick();
  P.practice = mode;
  save();
  show("ranges");
}
document.getElementById("btnRead").addEventListener("click", () => startPractice("read"));
document.getElementById("btnListen").addEventListener("click", () => startPractice("listen"));
document.getElementById("btnB").addEventListener("click", () => { sfxClick(); show("boxes"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* ---------- スタート ---------- */
show("home");
