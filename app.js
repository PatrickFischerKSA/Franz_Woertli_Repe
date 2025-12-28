/* =========================================================
   STATE
========================================================= */

let currentIndex = 0;
let correctCount = 0;
let totalCount = 0;
let round = 1;
let soundEnabled = false;
let audio = null;

/* =========================================================
   DOM
========================================================= */

const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextTask");
const checkBtn = document.getElementById("checkAnswer");

const accuracyEl = document.getElementById("accuracy");
const taskEl = document.getElementById("task");
const roundEl = document.getElementById("round");
const levelEl = document.getElementById("level");

const toggleSoundBtn = document.getElementById("toggleSound");
const resetBtn = document.getElementById("resetGame");
const musicStatusEl = document.getElementById("musicStatus");

/* =========================================================
   AUDIO (browser-konform)
========================================================= */

function initAudio() {
  if (audio !== null) return;
  audio = new Audio("music.mp3");
  audio.loop = true;
}

function startMusic() {
  if (!soundEnabled) {
    musicStatusEl.textContent = "🔇 Ton aus";
    return;
  }

  initAudio();

  audio.play()
    .then(() => {
      musicStatusEl.textContent = "🎵 Musik läuft";
    })
    .catch(() => {
      musicStatusEl.textContent = "🎵 Musik bereit – Start nach Interaktion";
    });
}

function stopMusic() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

/* =========================================================
   NORMALISIERUNG
========================================================= */

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/œ/g, "oe")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   BEWERTUNG
========================================================= */

function evaluateAnswer(userInput, item) {
  const user = normalize(userInput);

  const accepted = item.accepted.map(normalize);

  /* ---------- Wetter strikt ---------- */
  if (item.isWeather === true) {
    if (accepted.includes(user)) {
      return { ok: true };
    }
    return {
      ok: false,
      expected: item.expected
    };
  }

  /* ---------- Nomen: Genus strikt ---------- */
  if (item.strictGenus === true) {
    if (accepted.includes(user)) {
      return { ok: true };
    }
    return {
      ok: false,
      expected: item.expected
    };
  }

  /* ---------- Adjektive: m/f tolerant ---------- */
  if (item.genderFlexible === true) {
    if (accepted.includes(user)) {
      return {
        ok: true,
        note: "maskulin / feminin akzeptiert"
      };
    }
  }

  /* ---------- Allgemein akzeptiert ---------- */
  if (accepted.includes(user)) {
    return { ok: true };
  }

  return {
    ok: false,
    expected: item.expected
  };
}

/* =========================================================
   SPIELLOGIK
========================================================= */

function loadTask() {
  const item = DATA[currentIndex];

  promptEl.textContent = item.prompt;
  inputEl.value = "";
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";

  nextBtn.disabled = true;

  taskEl.textContent = (currentIndex % 25) + 1;
  roundEl.textContent = round;
  levelEl.textContent = item.level;
}

checkBtn.addEventListener("click", () => {
  const item = DATA[currentIndex];
  const result = evaluateAnswer(inputEl.value, item);

  totalCount++;

  if (result.ok) {
    correctCount++;
    feedbackEl.textContent =
      "✓ korrekt" + (result.note ? " (" + result.note + ")" : "");
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent =
      "✗ falsch – erwartet: " + item.expected;
    feedbackEl.style.color = "darkred";
  }

  accuracyEl.textContent =
    Math.round((correctCount / totalCount) * 100) + "%";

  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex % 25 === 0) {
    round++;
    stopMusic();
    startMusic();
  }

  if (currentIndex >= DATA.length) {
    promptEl.textContent = "Fertig!";
    inputEl.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = true;
    stopMusic();
    return;
  }

  loadTask();
});

/* =========================================================
   BUTTONS
========================================================= */

toggleSoundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleSoundBtn.textContent = soundEnabled ? "🔊 Ton an" : "🔇 Ton aus";
  startMusic();
});

resetBtn.addEventListener("click", () => {
  location.reload();
});

/* =========================================================
   START
========================================================= */

loadTask();
