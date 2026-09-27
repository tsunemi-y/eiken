/* =========================================================
   えいご 5きゅう - app.js
   はんい(15ごずつ)を えらんで カードで おぼえる。
   「✅ おぼえた」を おした 語だけが おぼえたリストに 入る。
   ========================================================= */

const EXAM_DATE = new Date(2026, 9, 4);   // 2026/10/4
const KEY = "eigo_craft_v6";
const KEY_V5 = "eigo_craft_v5";           // Ⓐ・Ⓑの ボックス方式だった ころ

/* ---------- ほぞん ---------- */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* きょうの きろく。日づけが かわったら からっぽに もどす。
   おぼえておくのは「きょう どの はんいを ひらいたか」だけ
   (つづきから ボタンと、はんいカードの 📅きょう しるしに つかう)。 */
function freshDay(t) {
  const d = today();
  if (t && t.d === d) return { d, ranges: t.ranges || [] };
  return { d, ranges: [] };
}

/* v5(Ⓐ・Ⓑ ボックス方式)からの ひっこし。
   3かい せいかいして Ⓑボックスへ そつぎょうした 語は、
   すでに「おぼえた」と いって よい レベルなので、そのまま
   おぼえたリストへ うつす。とちゅうまで(1〜2かい せいかい)の
   きろくは、あたらしい 「✅ おぼえた ボタンを おした 語だけ」の
   ルールに あわせて、ひきつがない(のこす と ルールが ぶれるため)。 */
let migratedFromV5 = false;
function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
  if (!d) {
    let old = null;
    try { old = JSON.parse(localStorage.getItem(KEY_V5)); } catch (e) { old = null; }
    if (old) {
      const learned = {};
      Object.keys(old.box || {}).forEach((k) => {
        const id = Number(k);
        if (WORD_BY_ID.has(id)) learned[id] = true;
      });
      d = { learned, today: old.today || null };
      migratedFromV5 = true;
    }
  }
  if (!d) d = {};
  return {
    learned: d.learned || {},   // wordId -> true(✅ おぼえた を おした 語だけ)
    today: freshDay(d.today),
  };
}

let P = load();
function save() { localStorage.setItem(KEY, JSON.stringify(P)); }
/* ひっこした ちょくごに 1かい ほぞんして v6を つくる。
   こうしないと なにか おぼえるまで v6が できず、まいかい
   ひっこしなおす ことに なる。v5は もしもの ときの ひかえとして
   けさずに のこしておく。 */
if (migratedFromV5) save();

const TOTAL = WORD_LIST.length;

function wordsNotLearned(ids) { return ids.filter((id) => !P.learned[id]); }
function learnedCount() { return WORD_LIST.filter((w) => P.learned[w.id]).length; }
function markLearned(id) {
  P.learned[id] = true;
  save();
}

/* しけんまで あと なん日 */
function daysLeft() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((EXAM_DATE - t) / 86400000));
}

/* ---------- きょうの きろく ---------- */
function rollDay() {
  if (P.today.d !== today()) {
    P.today = freshDay(null);
    save();
  }
}
function logRange(id) {
  rollDay();
  if (!P.today.ranges.includes(id)) { P.today.ranges.push(id); save(); }
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
/* だいたいの よみあげ時間。
   Web Speech は たんまつに よっては onend が こない ことが あるので、
   「よみおわるまで すすめない」を つくる ときの ほけんに つかう。 */
function estimateSpeakMs(text, rate = 1) {
  return Math.max(1200, (String(text).length * 130) / rate);
}

/* えいご→にほんご を つづけて よむ(れいぶんを セットで おぼえる)。
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

/* あなうめの ぶんを よむ(きのうご よう)。
   ( ) の ところを よんでしまうと 見なくても こたえが わかるので、
   そこは よまずに 「ポン」と おとを 出して あける。 */
function speakCloze(w) {
  const synth = wakeSynth();
  if (!synth) return;
  const c = clozeParts(w);
  if (!c) { speak(w.ex || w.en); return; }
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

function escapeHtml(t) {
  return String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
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
["home", "ranges", "wordlist", "learn"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});
function show(name) {
  if (name !== "learn") { speakGen++; setLearnLock(false); }
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, ranges: renderRanges }[name] || (() => {}))();
}

/* ---------- ホーム ---------- */
function renderHome() {
  const days = daysLeft();
  document.getElementById("daysLeft").textContent = days;

  const learned = learnedCount();
  const pace = document.getElementById("paceMessage");
  pace.textContent = days <= 0
    ? "きょうが 本番。いままで やった ぶんを 出しきろう。"
    : `おぼえた 単語 ${learned} / ${TOTAL}ご`;

  renderToday();
}

/* ---------- つづきから ---------- */
/* まだ おわっていない はんい。
   きょう さわった はんいが あれば そこ、なければ つぎに やるべき はんい。 */
function nextRange() {
  const pool = RANGES.filter((r) => wordsInRange(r.id).some((w) => !P.learned[w.id]));
  if (!pool.length) return null;
  const touchedToday = pool.filter((r) => P.today.ranges.includes(r.id));
  if (touchedToday.length) return touchedToday[touchedToday.length - 1];
  const started = pool.filter((r) => wordsInRange(r.id).some((w) => P.learned[w.id]));
  return (started.length ? started : pool)[0];
}

function renderToday() {
  rollDay();
  const nr = nextRange();
  const btn = document.getElementById("btnContinue");
  if (!nr) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
    const ws = wordsInRange(nr.id);
    const done = ws.filter((w) => P.learned[w.id]).length;
    const touched = P.today.ranges.includes(nr.id);
    document.getElementById("continueTitle").textContent =
      touched ? `つづきから ${nr.title}` : `つぎは ${nr.title}`;
    document.getElementById("continueSub").textContent = `${done}/${ws.length}ご おぼえた`;
    btn.onclick = () => { sfxClick(); renderWordlist(nr.id); };
  }
}

/* ---------- はんいえらび ---------- */
function renderRanges() {
  rollDay();
  const sum = document.getElementById("rangeToday");
  sum.innerHTML = P.today.ranges.length === 0
    ? "📅 きょうは まだ やってないよ"
    : `📅 きょう ひらいたのは <b>${P.today.ranges.length}はんい</b>`;

  const nr = nextRange();
  const nextId = nr ? nr.id : null;
  const wrap = document.getElementById("rangeGrid");
  wrap.innerHTML = "";

  RANGES.forEach((r) => {
    const ws = wordsInRange(r.id);
    const done = ws.filter((w) => P.learned[w.id]).length;
    const pct = (done / ws.length) * 100;
    const untouched = done === 0;
    const finished = done === ws.length;
    const doneToday = P.today.ranges.includes(r.id);
    const isNext = r.id === nextId;

    const el = document.createElement("div");
    el.className = "range-card" +
      (finished ? " done" : "") + (untouched ? " untouched" : "") +
      (doneToday ? " today" : "") + (isNext ? " next" : "");

    /* しるしは 2つの じくに わける。まぜると どれが なにか わからなく なる。
       ・わくの いろ = 「つぎ どこを やるか」(みずいろ 1まいだけ)
       ・📅きょう の チップ = 「きょう ひらいたか」(何まいでも つく) */
    el.innerHTML = `
      ${isNext ? `<div class="range-badge">👉 ${doneToday ? "つづきは ここ" : "つぎは ここ"}</div>` : ""}
      <div class="range-line">
        <span class="range-title">${r.title}</span>
        <span class="range-marks">${doneToday ? '<span class="rm-today">📅きょう</span>' : ""}${finished ? '<span class="rm-done">✅</span>' : ""}</span>
      </div>
      <div class="range-prog">
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="range-count">${done}/${ws.length}</span>
      </div>
    `;
    el.addEventListener("click", () => {
      sfxClick();
      renderWordlist(r.id);
    });
    wrap.appendChild(el);
  });
}

/* ---------- たんごいちらん ---------- */
let currentWordlistRange = 1;

function renderWordlist(rangeId) {
  currentWordlistRange = rangeId;
  const r = RANGES[rangeId - 1];
  document.getElementById("wordlistTitle").textContent = `📋 ${r.title}`;

  const wrap = document.getElementById("wordList");
  wrap.innerHTML = "";
  let anyLeft = false;
  wordsInRange(rangeId).forEach((w) => {
    const learned = !!P.learned[w.id];
    if (!learned) anyLeft = true;
    const el = document.createElement("div");
    el.className = "word-row" + (learned ? " learned" : "");
    const statusHTML = learned
      ? `<span class="word-boxed-tag">✅ おぼえた</span>`
      : `<button class="skip-btn" data-id="${w.id}">覚えた</button>`;
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
      markLearned(Number(b.dataset.id));
      renderWordlist(rangeId);
    });
  });

  document.getElementById("btnWordlistSkipAll").classList.toggle("hidden", !anyLeft);
  show("wordlist");
}
document.getElementById("btnWordlistBack").addEventListener("click", () => show("ranges"));
document.getElementById("btnWordlistSkipAll").addEventListener("click", () => {
  const ids = wordsNotLearned(wordsInRange(currentWordlistRange).map((w) => w.id));
  if (ids.length === 0) return;
  if (!confirm(`この${ids.length}ごを ぜんぶ「おぼえた」に しますか?`)) return;
  ids.forEach((id) => markLearned(id));
  sfxGraduate();
  renderWordlist(currentWordlistRange);
});
document.getElementById("btnWordlistStart").addEventListener("click", () => {
  sfxClick();
  startLearn(currentWordlistRange);
});

/* ---------- おぼえる(カード) ----------
   よむ(見る)も きく(🔊)も、この 1まいの カードで りょうほう できる。
   まえは リーディング/リスニングを べつの がめんに わけていたが、
   えいごを 見せた うえで 音声ボタンを 出せば、それだけで りょうほう
   まかなえる。 */
let L = { range: 1, words: [], i: 0, flipped: false };

/* きのうご(at / of / is / am など)は たんご 1つでは おぼえられないので、
   ぶんの あなうめ で しめす。 */
const useCloze = (w) => isTypeHard(w) && !!clozeParts(w);

/* パス単の じゅんばんの まま カードを めくると、「father の つぎは
   かならず mother」のように となりあう 語の ならびで おぼえて しまい、
   たんごを 見ずに あてられて しまう。カードの じゅんばんだけ
   まぜる(はんいの わけかた・ばんごうの ひょうじは かえない)。 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startLearn(rangeId) {
  const ws = shuffle(wordsNotLearned(wordsInRange(rangeId).map((w) => w.id)).map((id) => WORD_BY_ID.get(id)));
  if (ws.length === 0) {
    advancement("この はんいは ぜんぶ おぼえたよ!", "🎉", "コンプリート!");
    show("ranges");
    return;
  }
  logRange(rangeId);
  L = { range: rangeId, words: ws, i: 0, flipped: false };
  document.getElementById("learnZoneTag").textContent = RANGES[rangeId - 1].title;
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
  const cloze = useCloze(w);
  L.flipped = false;
  speakGen++;          // まえの よみあげの あとしまつが とどいても むしする
  setLearnLock(false);

  document.getElementById("cardNo").textContent = `No.${w.no}`;

  // まえめん: ふつうの 語は 英単語だけ。きのうごは 文まるごとを ( ) つきで 見せる
  // (1語だけ 見せても いみが きまらないため)。
  const cEn = document.getElementById("cardEn");
  const slotQ = document.getElementById("cardSlotQ");
  if (cloze) {
    const c = clozeParts(w);
    cEn.innerHTML = c
      ? `${escapeHtml(c.before)}<span class="cloze-blank">(&nbsp;&nbsp;&nbsp;)</span>${escapeHtml(c.after)}`
      : escapeHtml(w.ex || w.en);
    cEn.classList.add("cloze-en");
    slotQ.classList.add("hidden");
  } else {
    cEn.textContent = w.en;
    cEn.classList.remove("cloze-en");
    slotQ.classList.remove("hidden");
    slotQ.textContent = "?";
  }

  document.getElementById("cardEnBack").textContent = w.en;
  document.getElementById("cardEmoji").textContent = w.emoji;
  document.getElementById("cardJa").textContent = w.ja;

  // うらめん の れいぶん。きのうごは 答えの 語を みどりで きわだたせる
  const c = cloze ? clozeParts(w) : null;
  const exHtml = c
    ? `${escapeHtml(c.before)}<span class="cloze-fill">${escapeHtml(c.answer)}</span>${escapeHtml(c.after)}`
    : escapeHtml(w.ex || "");
  document.getElementById("cardEx").innerHTML =
    `<span class="card-ex-en" id="cardExEn">🔊 ${exHtml}</span><br>${escapeHtml(w.exJa || "")}`;
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

  // じどうで よみあげない。えいごを 見て 子どもが じぶんで よむのが
  //「リーディング」の れんしゅうなので、こえは 🔊ボタンを おした ときだけ 出す。
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
  ["btnPrev", "btnNext", "btnLearned"].forEach((id) => {
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
  L.flipped = !L.flipped;
  document.getElementById("cardFront").classList.toggle("hidden", L.flipped);
  document.getElementById("cardBack").classList.toggle("hidden", !L.flipped);
  if (L.flipped) sfxClick();
  // うらでも じどうでは よみあげない。れいぶんを ききたい ときは
  // したせんの えいぶんを タップすれば、えいご→にほんごの じゅんに きける。
}

document.getElementById("card").addEventListener("click", (e) => {
  if (e.target.closest(".sound-btn")) return;
  flipCard();
});
document.getElementById("btnSpeak").addEventListener("click", () => {
  const w = L.words[L.i];
  if (useCloze(w)) speakCloze(w); else speak(w.en);
});
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
/* 「✅ おぼえた」を おした 語だけが おぼえたリストに 入る。
   おした 語は そのはんいの カードの れつから すぐに ぬける
   (なんども おなじ カードを めくらなくて すむように)。 */
document.getElementById("btnLearned").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  const w = L.words[L.i];
  sfxGraduate();
  markLearned(w.id);
  L.words.splice(L.i, 1);
  if (L.words.length === 0) {
    advancement("この はんいは ぜんぶ おぼえたよ!", "🎉", "コンプリート!");
    renderWordlist(L.range);
    return;
  }
  if (L.i >= L.words.length) L.i = 0;
  renderCard();
});

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnStart").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* きろくの リセット。「おぼえた」の きろくが ぜんぶ きえるので、
   まちがって おしても もとに もどせないように 2かい たしかめる。 */
document.getElementById("btnResetAll").addEventListener("click", () => {
  if (!confirm(`いま「おぼえた」に なっている ${learnedCount()}ごの きろくを ぜんぶ けします。もとに もどせません。`)) return;
  if (!confirm("ほんとうに よろしいですか?")) return;
  P.learned = {};
  P.today = freshDay(null);
  save();
  sfxClick();
  show("home");
});

/* ---------- スタート ---------- */
show("home");
