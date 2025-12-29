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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function evaluateAnswer(userInput, item) {
  const normInput = normalize(userInput);
  const normTarget = normalize(item.target[0]);

  if (normInput === normTarget) {
    return { ok: true };
  }

  if (item.accepted) {
    for (const a of item.accepted) {
      if (normalize(a) === normInput) {
        return { ok: true, note: "Ziel: " + item.target[0] };
      }
    }
  }

  return { ok: false, expected: item.target[0] };
}

function loadTask() {
  const item = DATA[currentIndex % DATA.length]; // 🔧 FIX: zyklischer Zugriff
  promptEl.textContent = item.prompt;
  inputEl.value = "";
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";
  nextBtn.disabled = true;
  taskEl.textContent = currentIndex + 1;
}

checkBtn.onclick = () => {
  const item = DATA[currentIndex % DATA.length]; // 🔧 FIX: zyklischer Zugriff
  const result = evaluateAnswer(inputEl.value, item);
  totalCount++;

  if (result.ok) {
    correctCount++;
    feedbackEl.textContent = result.note ? "✔️ " + result.note : "✔️ korrekt";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = "✖️ Ziel: " + result.expected;
    feedbackEl.style.color = "red";
  }

  accuracyEl.textContent =
    Math.round((correctCount / totalCount) * 100) + "%";

  nextBtn.disabled = false;
};

nextBtn.onclick = () => {
  currentIndex++;

  if (currentIndex >= 25) {
    return; // 🔧 FIX: KEIN Block, KEIN Text, KEIN Zustand
  }

  loadTask();
};

loadTask();
