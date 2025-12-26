
// No modules. Offline.
const ROUND_SIZE = 25;
const NEED_ROUNDS = 5;
const NEED_RATE = 0.80;

const $ = (id) => document.getElementById(id);

let toneOn = false;
let level = 1;
let roundIndex = 0;          // 0..4 (Level 1)
let goodRounds = 0;          // rounds with >=80%
let pool = [];               // full pool for current level
let roundSet = [];           // 25 selected items for the round
let qIndex = 0;
let answeredTotal = 0;
let correctTotal = 0;
let lastMusicTier = 0;

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
    .replace(/[’]/g,"'"); // normalize apostrophe
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
  // thresholds 50/60/70/80/90
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
  if (!toneOn){
    $("audioHint").textContent = "";
    return;
  }
  if (tier !== lastMusicTier){
    // stop all first
    ["audio50","audio60","audio70","audio80","audio90"].forEach(id=>{
      const a=$(id);
      try{ a.pause(); a.currentTime=0; }catch(e){}
    });
    lastMusicTier = tier;
    const chosen = tiers.find(x=>x.t===tier);
    if (!chosen){
      $("audioHint").textContent = "";
      return;
    }
    const a = $(chosen.id);
    a.volume = 0.8;
    a.play().then(()=>{
      $("audioHint").textContent = "🎵 " + chosen.label + " (" + tier + "%+)";
    }).catch(()=>{
      // audio file missing or blocked
      $("audioHint").textContent = "🎵 " + chosen.label + " (" + tier + "%+) – Audio-Datei fehlt oder Browser blockiert Autoplay.";
    });
  }
}

function pickRoundSet(){
  // pick 25 unique from pool; if pool smaller, use all
  const cloned = shuffle(pool.slice());
  return cloned.slice(0, Math.min(ROUND_SIZE, cloned.length));
}

function startLevel(lvl){
  level = lvl;
  if (level === 1){
    pool = LEVEL1.slice();
  } else {
    pool = LEVEL2.slice();
  }
  shuffle(pool);
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
  // round finished
  const roundAnswered = roundSet.length;
  const roundCorrect = correctTotal - (answeredTotal - roundAnswered); // correct in this round
  const roundRate = roundAnswered ? (roundCorrect / roundAnswered) : 0;

  if (level === 1){
    if (roundRate >= NEED_RATE) goodRounds += 1;
    roundIndex += 1;

    if (roundIndex >= NEED_ROUNDS){
      // Level 1 cycle finished
      if (goodRounds >= NEED_ROUNDS){
        // go level 2 only if data exists
        if (LEVEL2.length === 0){
          $("prompt").textContent = "Level 1 abgeschlossen. Level 2 ist leer (Transferliste fehlt).";
          setFeedback("Bitte liefere die Transferliste für Level 2, dann baue ich sie ein.", "");
          $("btnNext").disabled = true;
          return;
        }
        startLevel(2);
        return;
      } else {
        // restart Level 1 cycles
        roundIndex = 0;
        goodRounds = 0;
      }
    }
    startRound();
  } else {
    // level 2: just loop rounds
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
  // stop if turning off
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

// boot
startLevel(1);
