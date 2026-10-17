/* =========================================================
   えいご 5きゅう - app.js
   はんい(15ごずつ)を えらんで カードで おぼえる。
   「✅ おぼえた」を おした 語だけが おぼえたリストに 入る。
   ========================================================= */

const KEY_V5 = "eigo_craft_v5";           // Ⓐ・Ⓑの ボックス方式だった ころ

/* ---------- だれが やるか ----------
   ようた・なおや で きろくを わける。ようたは いままでの きろく
   (eigo_craft_v6)を そのまま つかい、なおやは べつの キーで
   さいしょから。v5からの ひっこしも ようただけ(なおやに ようたの
   むかしの きろくが はいらないように)。 */
const USERS = [
  { id: "youta", name: "ようた", key: "eigo_craft_v6",       fromV5: true,  order: "mix",  exam: new Date(2027, 0, 24) },  // 2027/1/24
  { id: "naoya", name: "なおや", key: "eigo_craft_v6_naoya", fromV5: false, order: "easy", exam: new Date(2027, 0, 24) },  // 2027/1/24
];
const USER_KEY = "eigo_user";
function loadUser() {
  let id = null;
  try { id = localStorage.getItem(USER_KEY); } catch (e) { id = null; }
  return USERS.find((u) => u.id === id) || USERS[0];
}
let U = loadUser();
useRangeSet(U.order);

/* カードと 一覧の ならびかた。
   ようた = まいかい まぜる(じゅんばんで おぼえて しまわないように)
   なおや = かんたんな 語から じゅんばんに */
function orderIds(ids) {
  if (U.order === "easy") return ids.slice().sort((a, b) => EASY_RANK.get(a) - EASY_RANK.get(b));
  return shuffle(ids);
}

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
  if (t && t.d === d) return { d, ranges: t.ranges || [], correct: t.correct || 0, reviewed: t.reviewed || [], best: t.best || null };
  // correct = きょう つった さかなの かず / best = きょうの いちばんの えもの
  // reviewed = きょう ふくしゅう ずみの 語
  return { d, ranges: [], correct: 0, reviewed: [], best: null };
}

/* v5(Ⓐ・Ⓑ ボックス方式)からの ひっこし。
   3かい せいかいして Ⓑボックスへ そつぎょうした 語は、
   すでに「おぼえた」と いって よい レベルなので、そのまま
   おぼえたリストへ うつす。とちゅうまで(1〜2かい せいかい)の
   きろくは、あたらしい 「✅ おぼえた ボタンを おした 語だけ」の
   ルールに あわせて、ひきつがない(のこす と ルールが ぶれるため)。 */
let migratedFromV5 = false;
function load() {
  migratedFromV5 = false;
  boxesMigrated = false;
  let d = null;
  try { d = JSON.parse(localStorage.getItem(U.key)); } catch (e) { d = null; }
  if (!d && U.fromV5) {
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
    learned: toBoxes(d.learned || {}),   // wordId -> { w: 曜日(0=日〜6=土), d: おぼえた 日 }
    fish: d.fish || {},                  // さかなid -> { n: つった かず, max: いちばん おおきい cm }
    today: freshDay(d.today),
  };
}

/* まえの きろくは「おぼえた = true」だけで、いつ おぼえたかが ない。
   ボックス(曜日)が きめられないので、7この ボックスに じゅんばんに
   くばって、ふくしゅうが 1つの 曜日に かたよらないように する。 */
let boxesMigrated = false;
function toBoxes(learned) {
  const out = {};
  let k = 0;
  Object.keys(learned).map(Number).sort((a, b) => a - b).forEach((id) => {
    const v = learned[id];
    if (v && typeof v === "object" && typeof v.w === "number") out[id] = v;
    else if (v) { out[id] = { w: k % 7, d: null }; k++; boxesMigrated = true; }
  });
  return out;
}

let P = load();
function save() { localStorage.setItem(U.key, JSON.stringify(P)); }
/* ひっこした ちょくごに 1かい ほぞんして v6を つくる。
   こうしないと なにか おぼえるまで v6が できず、まいかい
   ひっこしなおす ことに なる。v5は もしもの ときの ひかえとして
   けさずに のこしておく。 */
if (migratedFromV5 || boxesMigrated) save();

function switchUser(id) {
  const u = USERS.find((x) => x.id === id);
  if (!u || u.id === U.id) return;
  U = u;
  useRangeSet(U.order);
  try { localStorage.setItem(USER_KEY, U.id); } catch (e) {}
  P = load();
  if (migratedFromV5 || boxesMigrated) save();
  wordlistOrder = { range: null, ids: [] };
  show("home");
}

const TOTAL = WORD_LIST.length;

function wordsNotLearned(ids) { return ids.filter((id) => !P.learned[id]); }
function learnedCount() { return WORD_LIST.filter((w) => P.learned[w.id]).length; }
function markLearned(id) {
  P.learned[id] = { w: new Date().getDay(), d: today() };
  save();
}

/* ---------- 曜日の クーラーボックス ----------
   月曜に おぼえた 語は 月曜ボックスへ。まいしゅう その 曜日に ふくしゅう する。 */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];          // 月〜日 の じゅんに ならべる
const WD = ["日", "月", "火", "水", "木", "金", "土"];
function boxIds(w) {
  return WORD_LIST.filter((x) => P.learned[x.id] && P.learned[x.id].w === w).map((x) => x.id);
}
/* ふくしゅう する 語:その ボックスの うち、きょう おぼえた ばかりの 語と
   きょう もう ふくしゅう した 語を のぞいたもの */
function dueIds(w) {
  rollDay();
  const td = today();
  return boxIds(w).filter((id) => P.learned[id].d !== td && !P.today.reviewed.includes(id));
}

/* ---------- つり ----------
   せいかい(カードの「おぼえた」・ふくしゅうの「おぼえてた」)の たびに 1ぴき つる */
/* ⭕ の たびに 1ぴき つる。correct / n = この 回の ここまでの せいかいすう / こたえた かず */
function catchFish(correct, n, onDone) {
  rollDay();
  const r = playCatch(correct, n, P.fish, () => onDone && onDone());
  const f = P.fish[r.sp.id] || { n: 0, max: 0 };
  P.fish[r.sp.id] = { n: f.n + 1, max: Math.max(f.max, r.size) };
  P.today.correct += 1;          // きょう つった かず
  const b = P.today.best;
  if (!b || r.sp.tier > FISH_BY_ID.get(b.id).tier || (r.sp.tier === FISH_BY_ID.get(b.id).tier && r.size > b.size)) {
    P.today.best = { id: r.sp.id, size: r.size };
  }
  save();
}
function fishKinds() { return FISH.filter((f) => P.fish[f.id]).length; }

/* しけんまで あと なん日 */
function daysLeft() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.ceil((U.exam - t) / 86400000);   // すぎたら マイナス
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
["home", "ranges", "wordlist", "learn", "box", "zukan"].forEach((n) => {
  S[n] = document.getElementById("screen-" + n);
});
function show(name) {
  if (name !== "learn") { speakGen++; setLearnLock(false); }
  Object.values(S).forEach((s) => s.classList.add("hidden"));
  S[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  ({ home: renderHome, ranges: renderRanges, zukan: renderZukan }[name] || (() => {}))();
}

/* ---------- ホーム ---------- */
function renderHome() {
  const days = daysLeft();
  document.getElementById("daysLeft").textContent = days;
  /* 本番の日が すぎたら「本番まで ◯日」は だまって かくす
     (0日の まま「きょうが 本番」と でつづけないように) */
  document.querySelector(".countdown-chip").classList.toggle("hidden", days < 0);

  document.querySelectorAll(".user-btn").forEach((b) => {
    b.classList.toggle("on", b.dataset.user === U.id);
    b.setAttribute("aria-pressed", b.dataset.user === U.id ? "true" : "false");
  });
  document.getElementById("userName").textContent = U.name;

  const learned = learnedCount();
  const pace = document.getElementById("paceMessage");
  pace.textContent = days === 0
    ? "きょうが 本番。いままで やった ぶんを 出しきろう。"
    : `${U.name}の おぼえた 単語 ${learned} / ${TOTAL}ご`;

  renderCatchPanel();
  renderWeekBoxes();
  renderToday();
  document.getElementById("zukanSub").textContent =
    `つった さかな ${fishKinds()} / ${FISH.length}しゅるい`;
}

function renderCatchPanel() {
  rollDay();
  const k = P.today.correct;
  const b = P.today.best && FISH_BY_ID.get(P.today.best.id);
  const el = document.getElementById("catchPanel");
  el.innerHTML = `
    <div class="cp-left">
      <div class="cp-label">きょうの ちょうか</div>
      <div class="cp-num"><b>${k}</b> ひき</div>
    </div>
    <div class="cp-right">
      <div class="cp-now">${b ? `いちばんは <span style="color:${FISH_TIERS[b.tier].color}">${FISH_TIERS[b.tier].ic} ${b.name} ${P.today.best.size}cm</span>` : "まだ つれてないよ"}</div>
      <div class="cp-next">⭕ で 1ぴき! 1かい(10もん)の なかで <b>まちがえずに つづける</b>ほど おおものが つれる(10もん ぜんぶ ⭕ で 👑)</div>
    </div>`;
}

function renderWeekBoxes() {
  const todayW = new Date().getDay();
  const wrap = document.getElementById("weekBoxes");
  wrap.innerHTML = "";
  WEEK_ORDER.forEach((w) => {
    const n = boxIds(w).length;
    const due = w === todayW ? dueIds(w).length : 0;
    const el = document.createElement("button");
    el.className = "wbox" + (w === todayW ? " today" : "") + (n === 0 ? " empty" : "");
    el.innerHTML = `<span class="wb-day">${WD[w]}</span><span class="wb-n">${n}</span>${due ? `<span class="wb-due">${due}</span>` : ""}`;
    el.addEventListener("click", () => { sfxClick(); renderBox(w); });
    wrap.appendChild(el);
  });
  const due = dueIds(todayW).length;
  const btn = document.getElementById("btnReview");
  btn.classList.toggle("hidden", due === 0);
  document.getElementById("reviewTitle").textContent = `🔁 ${WD[todayW]}ようボックスを ふくしゅう`;
  document.getElementById("reviewSub").textContent = `${due}ご まってるよ(おぼえてたら また つれる!)`;
  btn.onclick = () => { sfxClick(); startReview(todayW); };
}

/* ---------- ボックスの なかみ ---------- */
function renderBox(w) {
  const ids = boxIds(w);
  const due = dueIds(w);
  const isToday = w === new Date().getDay();
  document.getElementById("boxTitle").textContent = `🧊 ${WD[w]}ようボックス(${ids.length}ご)`;
  document.getElementById("boxDesc").textContent = isToday
    ? `${WD[w]}ように おぼえた 語。きょうが ふくしゅうの 日!`
    : `${WD[w]}ように おぼえた 語。まいしゅう ${WD[w]}ように ふくしゅう するよ。`;
  const rb = document.getElementById("btnBoxReview");
  rb.classList.toggle("hidden", due.length === 0);
  document.getElementById("boxReviewTitle").textContent =
    isToday ? `🔁 ふくしゅう する(${due.length}ご)` : `🔁 いま ふくしゅう する(${due.length}ご)`;
  rb.onclick = () => { sfxClick(); startReview(w); };
  const list = document.getElementById("boxList");
  list.innerHTML = ids.length ? "" : `<p class="scr-desc">まだ からっぽ。${WD[w]}ように おぼえた 語が ここに 入るよ。</p>`;
  ids.map((id) => WORD_BY_ID.get(id)).forEach((x) => {
    const el = document.createElement("div");
    const done = P.today.reviewed.includes(x.id);
    el.className = "word-row" + (done ? " learned" : "");
    el.innerHTML = `
      <div class="word-ic">${x.emoji}</div>
      <div class="word-body"><div class="word-en">${x.en}</div><div class="word-ja">${x.ja}</div></div>
      ${done ? '<span class="word-boxed-tag">✅ きょう ふくしゅう ずみ</span>' : ""}`;
    list.appendChild(el);
  });
  show("box");
}

/* ---------- ずかん ---------- */
function renderZukan() {
  document.getElementById("zukanDesc").textContent =
    `${fishKinds()} / ${FISH.length}しゅるい つったよ。⭕ で 1ぴき。1かいの なかで まちがえずに つづけるほど すごい さかなが でる!`;
  const body = document.getElementById("zukanBody");
  body.innerHTML = FISH_TIERS.map((t, ti) => {
    const cards = FISH.filter((f) => f.tier === ti).map((f) => {
      const c = P.fish[f.id];
      return `<div class="zk-card${c ? "" : " locked"}">
        ${fishSVG(f, !c)}
        <div class="zk-name">${c ? f.name : "？？？"}</div>
        <div class="zk-rec">${c ? `${c.n}ひき ・ さいだい ${c.max}cm` : "まだ つれてない"}</div>
      </div>`;
    }).join("");
    return `<div class="zk-tier">
      <div class="zk-tier-head"><span style="background:${t.color}">${t.ic} ${t.name}</span><small>${ti === 0 ? "⭕ で つれる" : `1かいの なかで ${t.minN}もん いじょう こたえて せいかいりつ ${Math.round(t.acc * 100)}% いじょう`}</small></div>
      <div class="zk-grid">${cards}</div></div>`;
  }).join("");
}
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
    btn.onclick = () => { sfxClick(); renderWordlist(nr.id, true); };
  }
}

/* ---------- はんいえらび ---------- */
function renderRanges() {
  rollDay();
  const sum = document.getElementById("rangeToday");
  sum.innerHTML = P.today.ranges.length === 0
    ? "📅 きょうは まだ やってないよ"
    : `📅 きょう ひらいたのは <b>${P.today.ranges.length}かしょ</b>`;

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
      renderWordlist(r.id, true);
    });
    wrap.appendChild(el);
  });
}

/* ---------- たんごいちらん ---------- */
let currentWordlistRange = 1;
// 一覧の ならびも シャッフルする(曜日・月などが 番号じゅんに つづくと よそうで こたえられるため)。
// 「覚えた」を おすたびに ならびが かわると さがしにくいので、ひらいた ときに 1かいだけ まぜて つかいまわす
let wordlistOrder = { range: null, ids: [] };

function renderWordlist(rangeId, reshuffle = false) {
  currentWordlistRange = rangeId;
  if (reshuffle || wordlistOrder.range !== rangeId) {
    wordlistOrder = { range: rangeId, ids: orderIds(wordsInRange(rangeId).map((w) => w.id)) };
  }
  const r = RANGES[rangeId - 1];
  document.getElementById("wordlistTitle").textContent = `📋 ${r.title}`;

  const wrap = document.getElementById("wordList");
  wrap.innerHTML = "";
  let anyLeft = false;
  wordlistOrder.ids.map((id) => WORD_BY_ID.get(id)).forEach((w) => {
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
let L = { mode: "learn", range: 1, box: null, words: [], i: 0, flipped: false };


/* パス単の じゅんばんの まま カードを めくると、「father の つぎは
   かならず mother」のように となりあう 語の ならびで おぼえて しまい、
   たんごを 見ずに あてられて しまう。カードと 一覧の じゅんばんは
   ひらく たびに まぜる(ゾーンの なかみ・ばんごうの ひょうじは かえない)。 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startLearn(rangeId) {
  const ws = orderIds(wordsNotLearned(wordsInRange(rangeId).map((w) => w.id))).map((id) => WORD_BY_ID.get(id));
  if (ws.length === 0) {
    advancement("この つりばは ぜんぶ おぼえたよ!", "🎉", "コンプリート!");
    show("ranges");
    return;
  }
  logRange(rangeId);
  L = { mode: "learn", range: rangeId, box: null, words: ws.slice(0, ROUND_MAX), i: 0, flipped: false, results: [] };
  document.getElementById("learnZoneTag").textContent = RANGES[rangeId - 1].title;
  setLearnButtons();
  show("learn");
  renderCard();
}

/* 曜日ボックスの ふくしゅう。おぼえてたら また 1ぴき つれる。
   わすれてたら「まだ」に もどし、また おぼえた 日の ボックスに 入りなおす。 */
function startReview(w) {
  const ws = orderIds(dueIds(w)).map((id) => WORD_BY_ID.get(id));
  if (ws.length === 0) { advancement("この ボックスは きょう ぜんぶ ふくしゅう したよ!", "🧊", "ばっちり"); show("home"); return; }
  L = { mode: "review", range: null, box: w, words: ws.slice(0, ROUND_MAX), i: 0, flipped: false, results: [] };
  document.getElementById("learnZoneTag").textContent = `🧊 ${WD[w]}ようボックス ふくしゅう`;
  setLearnButtons();
  show("learn");
  renderCard();
}
function setLearnButtons() {
  const rv = L.mode === "review";
  document.getElementById("learnedTitle").textContent = rv ? "⭕ おぼえてた!" : "⭕ おぼえた!";
  document.getElementById("forgotTitle").textContent = rv ? "❌ わすれてた" : "❌ まだ";
}

/* この 回の せいかいの ようす(○×の ならび と いまの せいかいりつ) */
function renderRoundBar() {
  const n = L.words.length;
  const dots = L.words.map((_, i) => {
    const r = L.results[i];
    return `<span class="rd ${r === true ? "ok" : r === false ? "ng" : i === L.i ? "now" : ""}">${r === true ? "○" : r === false ? "×" : ""}</span>`;
  }).join("");
  const done = L.results.length;
  const ok = L.results.filter(Boolean).length;
  const nx = FISH_TIERS[tierFor(ok + 1, done + 1)];          // つぎ ⭕ なら つれる ランク
  const best = FISH_TIERS[tierFor(ok + (n - done), n)];     // のこり ぜんぶ ⭕ なら
  document.getElementById("roundBar").innerHTML =
    `<div class="rd-dots">${dots}</div>
     <div class="rd-aim">${done >= n ? "" : `つぎ ⭕ なら ${nx.ic} ${nx.name}${best !== nx ? ` ・ さいごまで ぜんぶ ⭕ なら ${best.ic} ${best.name}` : ""}`}</div>`;
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

  // まえめん: どの 語も 英単語だけ(あなうめ は やめた)
  document.getElementById("cardEn").textContent = w.en;
  document.getElementById("cardSlotQ").textContent = "?";

  document.getElementById("cardEnBack").textContent = w.en;
  document.getElementById("cardEmoji").textContent = w.emoji;
  document.getElementById("cardJa").textContent = w.ja;

  // うらめん の れいぶん。その 語の ところを みどりで きわだたせる
  document.getElementById("cardEx").innerHTML =
    `<span class="card-ex-en" id="cardExEn">🔊 ${highlightWord(w.ex || "", w.en)}</span><br>${escapeHtml(w.exJa || "")}`;
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
  renderRoundBar();

  // じどうで よみあげない。えいごを 見て 子どもが じぶんで よむのが
  //「リーディング」の れんしゅうなので、こえは 🔊ボタンを おした ときだけ 出す。
}

/* れいぶんの なかの その 語を みどりに する(大文字・小文字は とわない) */
function highlightWord(ex, en) {
  const safe = escapeHtml(ex);
  const re = new RegExp(`\\b(${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "i");
  return safe.replace(re, '<span class="ex-hl">$1</span>');
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
  ["btnLearned", "btnForgot"].forEach((id) => {
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
document.getElementById("btnSpeak").addEventListener("click", () => speak(L.words[L.i].en));
document.getElementById("btnSpeak2").addEventListener("click", () => speak(L.words[L.i].en));

/* 1まいずつ ○(おぼえた) か ×(まだ) を きめて つぎへ。
   10もん(のこりが すくなければ その かず) おわったら、せいかいりつで 1ぴき つる。
   ・おぼえる: ○ → その 曜日の ボックスへ / × → まだの まま(また つぎの 回で でる)
   ・ふくしゅう: ○ → ボックスに のこる / × → 「まだ」に もどる */
function answerCard(ok) {
  if (fishingBusy) return;
  const w = L.words[L.i];
  speakGen++;
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (err) {}
  if (L.mode === "review") {
    if (!P.today.reviewed.includes(w.id)) P.today.reviewed.push(w.id);
    if (!ok) delete P.learned[w.id];
    save();
  } else if (ok) {
    markLearned(w.id);
  }
  L.results[L.i] = ok;
  renderRoundBar();
  const next = () => {
    if (L.i < L.words.length - 1) { L.i++; renderCard(); return; }
    const c = L.results.filter(Boolean).length;
    advancement(`${L.words.length}もん ちゅう ${c}もん ⭕`, "🎣", "この 回 おわり!");
    afterRound();
  };
  if (!ok) { sfxClick(); next(); return; }
  // ⭕ の たびに 1ぴき。ランクは この 回の ここまでの せいかいりつ で きまる
  const answered = L.results.filter((r) => r !== undefined).length;
  const correct = L.results.filter(Boolean).length;
  catchFish(correct, answered, next);
}
document.getElementById("btnLearned").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  answerCard(true);
});
document.getElementById("btnForgot").addEventListener("click", (e) => {
  if (e.currentTarget.disabled) return;
  answerCard(false);
});
function afterRound() {
  if (L.mode === "review") {
    const left = dueIds(L.box).length;
    if (left) { startReview(L.box); return; }       // まだ のこって いれば つぎの 回へ
    advancement(`${WD[L.box]}ようボックスの ふくしゅう おわり!`, "🧊", "おつかれさま");
    show("home");
    return;
  }
  const left = wordsNotLearned(wordsInRange(L.range).map((w) => w.id)).length;
  if (!left) advancement("この つりばは ぜんぶ おぼえたよ!", "🎉", "コンプリート!");
  renderWordlist(L.range, true);
}

/* ---------- ナビ ---------- */
document.getElementById("btnHome").addEventListener("click", () => show("home"));
document.getElementById("btnStart").addEventListener("click", () => { sfxClick(); show("ranges"); });
document.getElementById("btnZukan").addEventListener("click", () => { sfxClick(); show("zukan"); });
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back)));

/* きろくの リセット。「おぼえた」の きろくが ぜんぶ きえるので、
   まちがって おしても もとに もどせないように 2かい たしかめる。 */
document.getElementById("btnResetAll").addEventListener("click", () => {
  if (!confirm(`${U.name}の「おぼえた」${learnedCount()}ごと、つった さかな ${fishKinds()}しゅるいの きろくを ぜんぶ けします(ほかの 人の きろくは けしません)。もとに もどせません。`)) return;
  if (!confirm("ほんとうに よろしいですか?")) return;
  P.learned = {};
  P.fish = {};
  P.today = freshDay(null);
  save();
  sfxClick();
  show("home");
});

document.querySelectorAll(".user-btn").forEach((b) => {
  b.addEventListener("click", () => { sfxClick(); switchUser(b.dataset.user); });
});

/* ---------- スタート ---------- */
show("home");
