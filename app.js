let currentIndex = 0;
let correctCount = 0;
let totalCount = 0;

const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextTask");
const checkBtn = document.getElementById("checkAnswer");
const accuracyEl = document.getElementById("accuracy");
const taskEl = document.getElementById("task");

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/œ/g, "oe")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rememberCandidate(prompt, input) {
  const key = "REVIEW_CANDIDATES_V1";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push({ prompt, input, time: Date.now() });
  localStorage.setItem(key, JSON.stringify(list));
}

function evaluateAnswer(userInput, item) {
  const user = normalize(userInput);
  const targets = (item.target || []).map(normalize);
  const accepted = (item.accepted || []).map(normalize);

  if (targets.includes(user)) {
    return { ok: true, note: null };
  }

  if (accepted.includes(user)) {
    return { ok: true, note: "Ziel: " + item.target[0] };
  }

  rememberCandidate(item.prompt, userInput);
  return { ok: false, expected: item.target[0] };
}

function loadTask() {
  const item = DATA[currentIndex];
  promptEl.textContent = item.prompt;
  inputEl.value = "";
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";
  nextBtn.disabled = true;
  taskEl.textContent = currentIndex + 1;
}

checkBtn.onclick = () => {
  const item = DATA[currentIndex];
  const result = evaluateAnswer(inputEl.value, item);
  totalCount++;

  if (result.ok) {
    correctCount++;
    feedbackEl.textContent =
      "✓ korrekt" + (result.note ? " (" + result.note + ")" : "");
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = "✗ falsch – erwartet: " + result.expected;
    feedbackEl.style.color = "darkred";
  }

  accuracyEl.textContent =
    Math.round((correctCount / totalCount) * 100) + "%";

  nextBtn.disabled = false;
};

nextBtn.onclick = () => {
  currentIndex++;

  if (currentIndex >= DATA.length) {
    promptEl.textContent = "Fertig.";
    inputEl.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  loadTask();
};

loadTask();
