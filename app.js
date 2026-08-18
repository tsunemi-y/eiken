/* ==========================================================
   えいけんチャレンジ 5きゅう - app.js
   ========================================================== */

const EXAM_DATE = new Date(2026, 9, 4); // 2026-10-04 (げつは0はじまり)
const STORAGE_KEY = "eiken5_progress_v1";
const PASS_RATE = 0.8; // 80%せいかいで ゾーンクリア
const REVIEW_INTERVAL_DAYS = 7;

/* ---------- じょうたい かんり ---------- */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadProgress() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    data = null;
  }
  if (!data) {
    data = {
      stars: 0,
      chests: 0,
      currentZone: 1,
      zones: {},
      streak: { count: 0, lastDate: null },
    };
  }
  if (!data.zones) data.zones = {};
  if (!data.streak) data.streak = { count: 0, lastDate: null };
  return data;
}

let PROGRESS = loadProgress();

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(PROGRESS));
}

function getZoneState(zoneId) {
  if (!PROGRESS.zones[zoneId]) {
    PROGRESS.zones[zoneId] = {
      cleared: false,
      bestScore: 0,
      clearedAt: null,
      nextReviewAt: null,
      reviewCount: 0,
      medal: null, // "bronze" | "silver" | "gold"
    };
  }
  return PROGRESS.zones[zoneId];
}

function wordsInZone(zoneId) {
  return WORD_LIST.filter((w) => w.zone === zoneId);
}

function isZoneUnlocked(zoneId) {
  if (zoneId === 1) return true;
  return !!getZoneState(zoneId - 1).cleared;
}

function bumpStreak() {
  const t = todayStr();
  if (PROGRESS.streak.lastDate === t) return; // すでに きょう きろく ずみ
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`;
  if (PROGRESS.streak.lastDate === yestStr) {
    PROGRESS.streak.count += 1;
  } else {
    PROGRESS.streak.count = 1;
  }
  PROGRESS.streak.lastDate = t;
  saveProgress();
}

function medalEmoji(medal) {
  if (medal === "gold") return "🥇";
  if (medal === "silver") return "🥈";
  if (medal === "bronze") return "🥉";
  return "❔";
}

/* ---------- がめん せんい ---------- */
const screens = {
  home: document.getElementById("screen-home"),
  map: document.getElementById("screen-map"),
  learn: document.getElementById("screen-learn"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
  review: document.getElementById("screen-review"),
  ranking: document.getElementById("screen-ranking"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  window.scrollTo(0, 0);
  if (name === "home") renderHome();
  if (name === "map") renderMap();
  if (name === "review") renderReview();
  if (name === "ranking") renderRanking();
}

/* ---------- おと ---------- */
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

/* ---------- トースト・かみふぶき ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.add("hidden"), 2200);
}

function confettiBurst() {
  const emojis = ["🎉", "⭐", "🎊", "✨", "🏆"];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 1.4 + Math.random() * 1.2 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

/* ---------- ヘッダー こうしん ---------- */
function updateHeader() {
  document.getElementById("starCount").textContent = PROGRESS.stars;
  document.getElementById("chestCount").textContent = PROGRESS.chests;
  const clearedCount = Object.values(PROGRESS.zones).filter((z) => z.cleared).length;
  document.getElementById("levelNum").textContent = clearedCount + 1;
}

/* ---------- ホーム がめん ---------- */
function renderHome() {
  updateHeader();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((EXAM_DATE - today) / (1000 * 60 * 60 * 24));
  document.getElementById("daysLeft").textContent = diffDays >= 0 ? diffDays : 0;

  const clearedCount = Object.values(PROGRESS.zones).filter((z) => z.cleared).length;
  const remainZones = TOTAL_ZONES - clearedCount;
  const paceEl = document.getElementById("paceMessage");
  if (remainZones <= 0) {
    paceEl.textContent = "🎉 ぜんぶの ゾーンを おぼえたよ!すごい!";
  } else if (diffDays <= 0) {
    paceEl.textContent = "きょうが ほんばん!じしんを もっていこう!";
  } else {
    const weeks = Math.max(1, Math.ceil(diffDays / 7));
    const perWeek = Math.max(1, Math.ceil(remainZones / weeks));
    paceEl.textContent = `のこり ${remainZones}ゾーン。1しゅうかんに ${perWeek}ゾーンずつ すすめよう!`;
  }

  const nextZone = PROGRESS.currentZone <= TOTAL_ZONES ? PROGRESS.currentZone : TOTAL_ZONES;
  document.getElementById("nextZoneLabel").textContent =
    clearedCount >= TOTAL_ZONES ? "ぜんぶ かんりょう!" : `ゾーン ${nextZone}`;

  const dueZones = getDueReviewZones();
  const reviewBadge = document.getElementById("reviewBadge");
  reviewBadge.textContent = dueZones.length > 0 ? `${dueZones.length}ゾーン ふくしゅうしよう!` : "いまは ありません";

  document.getElementById("clearedZoneCount").textContent = clearedCount;
  document.getElementById("totalZoneCount").textContent = TOTAL_ZONES;
  document.getElementById("overallBar").style.width = `${(clearedCount / TOTAL_ZONES) * 100}%`;
}

function getDueReviewZones() {
  const now = Date.now();
  const list = [];
  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const st = getZoneState(z);
    if (st.cleared && st.nextReviewAt && st.nextReviewAt <= now) {
      list.push(z);
    }
  }
  return list;
}

/* ---------- たんごマップ ---------- */
function renderMap() {
  const wrap = document.getElementById("mapPath");
  wrap.innerHTML = "";
  const dueZones = new Set(getDueReviewZones());

  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const st = getZoneState(z);
    const unlocked = isZoneUnlocked(z);
    const isCurrent = unlocked && !st.cleared;
    const node = document.createElement("div");
    node.className =
      "map-node " +
      (st.cleared ? "cleared " : unlocked ? "current " : "locked ") +
      (dueZones.has(z) ? "review-due" : "");

    const words = wordsInZone(z);
    const rangeLabel = `${words[0].en} など ${words.length}ご`;

    node.innerHTML = `
      <div class="map-node-icon">${st.cleared ? "✅" : unlocked ? z : "🔒"}</div>
      <div class="map-node-body">
        <div class="map-node-title">ゾーン ${z}</div>
        <div class="map-node-sub">${rangeLabel}${dueZones.has(z) ? " ・ ふくしゅう まちです!" : ""}</div>
      </div>
      <div class="map-node-badge">${st.medal ? medalEmoji(st.medal) : ""}</div>
    `;

    if (unlocked) {
      node.addEventListener("click", () => {
        PROGRESS.currentZone = z;
        saveProgress();
        startLearn(z);
      });
    }
    wrap.appendChild(node);
  }
}

/* ---------- おぼえる がめん(フラッシュカード) ---------- */
let learnState = { zone: 1, words: [], index: 0, revealed: false };

function startLearn(zoneId) {
  learnState = { zone: zoneId, words: wordsInZone(zoneId), index: 0, revealed: false };
  document.getElementById("learnZoneTitle").textContent = `ゾーン ${zoneId}`;
  renderFlashcard();
  showScreen("learn");
}

function renderFlashcard() {
  const w = learnState.words[learnState.index];
  document.getElementById("cardEmoji").textContent = w.emoji;
  document.getElementById("cardEn").textContent = w.en;
  document.getElementById("cardJa").textContent = w.ja;
  document.getElementById("cardEx").innerHTML = `${w.ex}<br>${w.exJa}`;
  document.getElementById("learnCardPos").textContent = `${learnState.index + 1} / ${learnState.words.length}`;

  learnState.revealed = false;
  document.getElementById("cardJa").classList.add("hidden");
  document.getElementById("cardEx").classList.add("hidden");
  document.getElementById("cardHint").classList.remove("hidden");

  document.getElementById("btnPrevCard").disabled = learnState.index === 0;
  const isLast = learnState.index === learnState.words.length - 1;
  document.getElementById("btnGoQuiz").classList.toggle("hidden", !isLast);
  document.getElementById("btnNextCard").textContent = isLast ? "さいしょから" : "つぎ →";

  speak(w.en);
}

document.getElementById("flashcard").addEventListener("click", (e) => {
  if (e.target.closest("#btnSpeak")) return;
  learnState.revealed = !learnState.revealed;
  document.getElementById("cardJa").classList.toggle("hidden", !learnState.revealed);
  document.getElementById("cardEx").classList.toggle("hidden", !learnState.revealed);
  document.getElementById("cardHint").classList.toggle("hidden", learnState.revealed);
});

document.getElementById("btnSpeak").addEventListener("click", () => {
  speak(learnState.words[learnState.index].en);
});

document.getElementById("btnPrevCard").addEventListener("click", () => {
  if (learnState.index > 0) {
    learnState.index -= 1;
    renderFlashcard();
  }
});

document.getElementById("btnNextCard").addEventListener("click", () => {
  if (learnState.index < learnState.words.length - 1) {
    learnState.index += 1;
    renderFlashcard();
  } else {
    learnState.index = 0;
    renderFlashcard();
  }
});

document.getElementById("btnGoQuiz").addEventListener("click", () => {
  startQuiz(learnState.zone, "learn");
});

/* ---------- クイズ がめん ---------- */
let quizState = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(correctWord) {
  const pool = WORD_LIST.filter((w) => w.id !== correctWord.id && w.ja !== correctWord.ja);
  const wrongs = shuffle(pool).slice(0, 3);
  return shuffle([correctWord, ...wrongs]);
}

function startQuiz(zoneId, mode) {
  const words = shuffle(wordsInZone(zoneId));
  quizState = {
    zone: zoneId,
    mode, // "learn" | "review"
    words,
    index: 0,
    correct: 0,
    locked: false,
  };
  document.getElementById("quizTotal").textContent = words.length;
  renderQuizQuestion();
  showScreen("quiz");
}

function renderQuizQuestion() {
  const q = quizState;
  const w = q.words[q.index];
  document.getElementById("quizPos").textContent = q.index + 1;
  document.getElementById("quizProgressBar").style.width = `${((q.index) / q.words.length) * 100}%`;
  document.getElementById("quizEmoji").textContent = w.emoji;
  document.getElementById("quizEn").textContent = w.en;
  document.getElementById("quizFeedback").classList.add("hidden");
  q.locked = false;

  const choices = buildChoices(w);
  const wrap = document.getElementById("quizChoices");
  wrap.innerHTML = "";
  choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = c.ja;
    btn.addEventListener("click", () => onChoiceClick(btn, c, w));
    wrap.appendChild(btn);
  });

  speak(w.en);
}

document.getElementById("btnQuizSpeak").addEventListener("click", () => {
  if (quizState) speak(quizState.words[quizState.index].en);
});

function onChoiceClick(btn, chosen, correctWord) {
  if (quizState.locked) return;
  quizState.locked = true;
  const isCorrect = chosen.id === correctWord.id;
  const allBtns = document.querySelectorAll(".choice-btn");
  allBtns.forEach((b) => {
    if (b.textContent === correctWord.ja) b.classList.add("correct");
    else b.classList.add("dim");
  });
  if (!isCorrect) btn.classList.add("wrong");

  const fb = document.getElementById("quizFeedback");
  fb.classList.remove("hidden", "ok", "ng");
  if (isCorrect) {
    quizState.correct += 1;
    fb.textContent = "🎉 せいかい!";
    fb.classList.add("ok");
  } else {
    fb.textContent = `❌ ざんねん! こたえは「${correctWord.ja}」`;
    fb.classList.add("ng");
  }

  setTimeout(() => {
    quizState.index += 1;
    if (quizState.index >= quizState.words.length) {
      document.getElementById("quizProgressBar").style.width = `100%`;
      finishQuiz();
    } else {
      renderQuizQuestion();
    }
  }, 1100);
}

/* ---------- けっか がめん ---------- */
function finishQuiz() {
  bumpStreak();
  const q = quizState;
  const total = q.words.length;
  const score = q.correct;
  const rate = score / total;
  const passed = rate >= PASS_RATE;

  const earnedStars = score;
  PROGRESS.stars += earnedStars;

  const zoneState = getZoneState(q.zone);
  let newMedal = null;
  if (rate === 1) newMedal = "gold";
  else if (rate >= 0.9) newMedal = "silver";
  else if (passed) newMedal = "bronze";

  let title, detail, chestGained = false;

  if (q.mode === "learn") {
    zoneState.bestScore = Math.max(zoneState.bestScore, score);
    if (passed) {
      const firstClear = !zoneState.cleared;
      zoneState.cleared = true;
      zoneState.clearedAt = Date.now();
      zoneState.nextReviewAt = Date.now() + REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
      if (!zoneState.medal || medalRank(newMedal) > medalRank(zoneState.medal)) zoneState.medal = newMedal;

      if (firstClear) {
        PROGRESS.chests += 1;
        chestGained = true;
        PROGRESS.currentZone = Math.max(PROGRESS.currentZone, q.zone + 1);
        title = `🎉 ゾーン${q.zone} クリア! レベルアップ!`;
        detail = `たからばこを ゲット! 1しゅうかんごに ふくしゅうテストが あります。`;
      } else {
        title = `もういちど クリア!`;
        detail = `きろく こうしん できたかな?`;
      }
    } else {
      title = "おしい! もういちど ちょうせんしよう";
      detail = `80%(10もんちゅう8もん)いじょう せいかいで クリアだよ。`;
    }
  } else {
    // review mode
    if (passed) {
      zoneState.nextReviewAt = Date.now() + REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
      zoneState.reviewCount = (zoneState.reviewCount || 0) + 1;
      PROGRESS.chests += 1;
      chestGained = true;
      if (!zoneState.medal || medalRank(newMedal) > medalRank(zoneState.medal)) zoneState.medal = newMedal;
      title = `✅ ふくしゅう せいこう!`;
      detail = `また 1しゅうかんご に ふくしゅうテストが あります。たからばこ ゲット!`;
    } else {
      title = "もういちど ふくしゅうしよう";
      detail = `わすれちゃった たんごを おぼえなおそう。`;
    }
  }

  saveProgress();
  updateHeader();

  document.getElementById("resultEmoji").textContent = passed ? (rate === 1 ? "🏆" : "🎉") : "💪";
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultScore").textContent = score;
  document.getElementById("resultTotalQ").textContent = total;
  document.getElementById("resultDetail").textContent = detail;
  document.getElementById("chestAnim").textContent = chestGained ? "🎁" : passed ? (newMedal ? medalEmoji(newMedal) : "⭐") : "📚";

  const continueBtn = document.getElementById("btnResultContinue");
  continueBtn.classList.toggle("hidden", !passed);
  continueBtn.textContent = q.mode === "review" ? "ふくしゅう いちらんへ" : "つぎの ゾーンへ";
  document.getElementById("btnResultRetry").classList.toggle("hidden", passed);

  if (passed) confettiBurst();
  showScreen("result");
}

function medalRank(m) {
  return { bronze: 1, silver: 2, gold: 3 }[m] || 0;
}

document.getElementById("btnResultContinue").addEventListener("click", () => {
  if (quizState.mode === "review") {
    showScreen("review");
  } else {
    showScreen("map");
  }
});
document.getElementById("btnResultRetry").addEventListener("click", () => {
  if (quizState.mode === "review") {
    startQuiz(quizState.zone, "review");
  } else {
    startLearn(quizState.zone);
  }
});
document.getElementById("btnResultHome").addEventListener("click", () => showScreen("home"));

/* ---------- ふくしゅう がめん ---------- */
function renderReview() {
  const dueZones = getDueReviewZones();
  const wrap = document.getElementById("reviewList");
  wrap.innerHTML = "";
  if (dueZones.length === 0) {
    wrap.innerHTML = `<div class="empty-msg">いま ふくしゅうする ゾーンは ないよ。<br>たんごを どんどん おぼえよう!📖</div>`;
    return;
  }
  dueZones.forEach((z) => {
    const words = wordsInZone(z);
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <div class="review-item-icon">🔁</div>
      <div class="review-item-body">
        <div class="review-item-title">ゾーン ${z}</div>
        <div class="review-item-sub">${words[0].en} など ${words.length}ご</div>
      </div>
      <button class="review-item-btn">テストする</button>
    `;
    item.querySelector(".review-item-btn").addEventListener("click", () => startQuiz(z, "review"));
    wrap.appendChild(item);
  });
}

/* ---------- きろく がめん ---------- */
function renderRanking() {
  document.getElementById("rankStars").textContent = PROGRESS.stars;
  document.getElementById("rankChests").textContent = PROGRESS.chests;
  const clearedCount = Object.values(PROGRESS.zones).filter((z) => z.cleared).length;
  document.getElementById("rankWords").textContent = clearedCount * 10;
  document.getElementById("rankStreak").textContent = PROGRESS.streak.count;

  const grid = document.getElementById("badgeGrid");
  grid.innerHTML = "";
  for (let z = 1; z <= TOTAL_ZONES; z++) {
    const st = getZoneState(z);
    const el = document.createElement("div");
    el.className = "badge-item" + (st.medal ? "" : " locked");
    el.textContent = st.medal ? medalEmoji(st.medal) : "🔒";
    el.title = `ゾーン ${z}`;
    grid.appendChild(el);
  }
}

/* ---------- ナビゲーション ---------- */
document.getElementById("btnHome").addEventListener("click", () => showScreen("home"));
document.getElementById("btnStartLearn").addEventListener("click", () => {
  const clearedCount = Object.values(PROGRESS.zones).filter((z) => z.cleared).length;
  const zoneId = clearedCount >= TOTAL_ZONES ? TOTAL_ZONES : Math.min(PROGRESS.currentZone, TOTAL_ZONES);
  startLearn(zoneId);
});
document.getElementById("btnMap").addEventListener("click", () => showScreen("map"));
document.getElementById("btnReview").addEventListener("click", () => showScreen("review"));
document.getElementById("btnRanking").addEventListener("click", () => showScreen("ranking"));

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.back));
});

/* ---------- しょきひょうじ ---------- */
showScreen("home");
