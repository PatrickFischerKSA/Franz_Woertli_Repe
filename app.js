// app.js — AUTOPLAY-FIX INKLUSIVE
// Änderung: Audio startet erst nach erster User-Interaktion

const ROUND_SIZE = 25;
const NEED_ROUNDS = 5;
const NEED_RATE = 0.80;

const $ = (id) => document.getElementById(id);

let toneOn = false;
let audioUnlocked = false;
let level = 1;
let roundIndex = 0;
let goodRounds = 0;
let pool = [];
let cycleQueue = [];
let roundSet = [];
let qIndex = 0;
let answeredTotal = 0;
let correctTotal = 0;
let lastMusicTier = 0;

function unlockAudio(){
  if (audioUnlocked) return;
  audioUnlocked = true;
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalize(s){
  return (s || "")
    .trim()
    .replace(/\s+/g," ")
    .replace(/[’]/g,"'");
}

function setFeedback(html, cls){
  const el = $("feedback");
  el.className = "feedback " + (cls || "");
  el.innerHTML = html;
}

function updateUI(){
  $("levelLabel").textContent = String(level);
  $("roundLabel").textContent = String(Math.min(roundIndex+1, NEED_ROUNDS));
  $("qLabel").textContent = String(Math.min(qIndex+1, ROUND_SIZE));
  const rate = answeredTotal ? Math.round((correctTotal/answeredTotal)*100) : 0;
  $("rateLabel").textContent = rate + "%";
  $("progressBar").style.width = (answeredTotal ? (correctTotal/answeredTotal)*100 : 0) + "%";
  updateMusic(rate);
}

function updateMusic(ratePercent){
  if (!toneOn || !audioUnlocked){
    $("audioHint").textContent = "";
    return;
  }

  const tiers = [
    {t:90, id:"audio90", label:"La Marseillaise"},
    {t:80, id:"audio80", label:"Mon mec à moi"},
    {t:70, id:"audio70", label:"Je ne regrette rien"},
    {t:60, id:"audio60", label:"Di Wäg – Ton Chemin"},
    {t:50, id:"audio50", label:"Sur le pont d'Avignon"},
  ];
  let tier = 0;
  for (const x of tiers){
    if (ratePercent >= x.t){ tier = x.t; break; }
  }

  if (tier !== lastMusicTier){
    ["audio50","audio60","audio70","audio80","audio90"].forEach(id=>{
      const a=$(id);
      try{ a.pause(); a.currentTime=0; }catch(e){}
    });
    lastMusicTier = tier;
    const chosen = tiers.find(x=>x.t===tier);
    if (!chosen) return;

    const a = $(chosen.id);
    a.volume = 0.8;
    a.play().then(()=>{
      $("audioHint").textContent = "🎵 " + chosen.label + " (" + tier + "%+)";
    }).catch(()=>{
      $("audioHint").textContent = "";
    });
  }
}

function rebuildCycleQueue(){
  cycleQueue = shuffle(pool.slice());
}

function pickRoundSet(){
  if (cycleQueue.length === 0) rebuildCycleQueue();
  if (cycleQueue.length < Math.min(ROUND_SIZE, pool.length)) rebuildCycleQueue();
  return cycleQueue.splice(0, Math.min(ROUND_SIZE, pool.length));
}

function startLevel(lvl){
  level = lvl;
  pool = (level === 1) ? LEVEL1.slice() : LEVEL2.slice();
  shuffle(pool);
  rebuildCycleQueue();

  roundIndex = 0;
  goodRounds = 0;
  qIndex = 0;
  answeredTotal = 0;
  correctTotal = 0;
  lastMusicTier = 0;
  startRound();
}

function startRound(){
  roundSet = pickRoundSet();
  qIndex = 0;
  showQuestion();
}

function showQuestion(){
  const item = roundSet[qIndex];
  $("prompt").textContent = item.de;
  $("answer").value = "";
  $("answer").disabled = false;
  $("btnCheck").disabled = false;
  $("btnNext").disabled = true;
  setFeedback("", "");
  $("answer").focus();
  updateUI();
}

function checkAnswer(){
  const item = roundSet[qIndex];
  const user = normalize($("answer").value);
  const expected = normalize(item.fr);
  answeredTotal += 1;

  if (user === expected){
    correctTotal += 1;
    setFeedback("✓ korrekt", "good");
  } else {
    setFeedback("✗ falsch<br><small>Erwartet: <b>" + item.fr + "</b></small>", "bad");
  }

  $("answer").disabled = true;
  $("btnCheck").disabled = true;
  $("btnNext").disabled = false;
  updateUI();
}

function next(){
  qIndex += 1;
  if (qIndex < roundSet.length){
    showQuestion();
    return;
  }

  const roundAnswered = roundSet.length;
  const roundCorrect = correctTotal - (answeredTotal - roundAnswered);
  const roundRate = roundAnswered ? (roundCorrect / roundAnswered) : 0;

  if (level === 1){
    if (roundRate >= NEED_RATE) goodRounds += 1;
    roundIndex += 1;

    if (roundIndex >= NEED_ROUNDS){
      if (goodRounds >= NEED_ROUNDS){
        startLevel(2);
        return;
      } else {
        roundIndex = 0;
        goodRounds = 0;
        rebuildCycleQueue();
      }
    }
    startRound();
  } else {
    startRound();
  }
}

function resetAll(){
  startLevel(1);
}

$("btnCheck").addEventListener("click", checkAnswer);
$("btnNext").addEventListener("click", next);
$("answer").addEventListener("keydown", (e)=>{
  if (e.key === "Enter"){
    if (!$("btnCheck").disabled) checkAnswer();
    else if (!$("btnNext").disabled) next();
  }
});

$("btnReset").addEventListener("click", resetAll);
$("btnTone").addEventListener("click", ()=>{
  toneOn = !toneOn;
  $("btnTone").textContent = toneOn ? "🔊 Ton an" : "🔇 Ton aus";
  if (!toneOn){
    ["audio50","audio60","audio70","audio80","audio90"].forEach(id=>{
      const a=$(id);
      try{ a.pause(); a.currentTime=0; }catch(e){}
    });
    lastMusicTier = 0;
    $("audioHint").textContent = "";
  } else {
    updateUI();
  }
});

startLevel(1);
