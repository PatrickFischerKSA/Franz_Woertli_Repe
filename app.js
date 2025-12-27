
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
let cycleQueue = [];         // non-repeating queue for the current 5-round cycle
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
      $("audioHint").textContent = "🎵 " + chosen.label + " (" + tier + "%+) – Audio-Datei fehlt oder Browser blockiert Autoplay.";
    });
  }
}

function rebuildCycleQueue(){
  // Build a shuffled queue of all items so that within one 5-round cycle
  // we don't repeat unless the pool is smaller than 25*5.
  cycleQueue = shuffle(pool.slice());
}

function pickRoundSet(){
  if (cycleQueue.length === 0) rebuildCycleQueue();
  // If we don't have enough left for a full round, rebuild so we can continue
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
        if (LEVEL2.length === 0){
          $("prompt").textContent = "Level 1 abgeschlossen. Level 2 ist leer (Transferliste fehlt).";
          setFeedback("Bitte liefere die Transferliste für Level 2, dann baue ich sie ein.", "");
          $("btnNext").disabled = true;
          return;
        }
        startLevel(2);
        return;
      } else {
        // restart a new 5-round cycle
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


// === AUDIO FIX: reliable autoplay after first round ===
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  const audios = document.querySelectorAll("audio");
  audios.forEach(a => {
    try { a.muted = true; a.play().then(()=>{ a.pause(); a.currentTime = 0; a.muted = false; }); } catch(e){}
  });
  audioUnlocked = true;
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });

function playRoundMusic(hitRate){
  if (!audioUnlocked) return;
  let a = null;
  if (hitRate >= 90) a = document.getElementById("audio90");
  else if (hitRate >= 80) a = document.getElementById("audio80");
  else if (hitRate >= 70) a = document.getElementById("audio70");
  else if (hitRate >= 60) a = document.getElementById("audio60");
  else if (hitRate >= 50) a = document.getElementById("audio50");
  if (a) { try { a.currentTime = 0; a.play(); } catch(e){} }
}
// === END AUDIO FIX ===


// === FIX: déjeuner – Verb/Nomen akzeptieren ===
function matchDejeunerPrompt(user, promptDe){
  const u = ultraNormalize(user || "");
  const p = (promptDe || "").toLowerCase();
  if (p.includes("déjeuner") && p.includes("frühstück")){
    if (u === "dejeuner" || u === "le petit-dejeuner" || u === "petit-dejeuner") return true;
  }
  return false;
}
// === END FIX ===


// === FIXES 1–4: semantic acceptance by DE prompt ===
function semanticAccept(user, promptDe){
  const u = ultraNormalize(user || "");
  const p = (promptDe || "").toLowerCase();

  // 1) stilles Wasser
  if (p.includes("stilles wasser")){
    if (u === "leau plate" || u === "eau non gazeuse") return {ok:true, note:"Ziel: l’eau plate"};
  }

  // 2) ein Gericht auswählen
  if (p.includes("gericht") && p.includes("ausw")){
    if (u === "choisir un plat") return {ok:true};
    if (u === "choisir un repas") return {ok:true, note:"Üblicher: choisir un plat"};
  }

  // 3) die Fahrkarte (Nomen: falsches Genus bleibt falsch)
  if (p.includes("fahrkarte")){
    if (u === "le billet") return {ok:true};
    if (u === "le ticket") return {ok:true, note:"Auch gebräuchlich"};
  }

  // 4) es ist schön – Wetter vs. nicht Wetter
  if (p.trim() === "es ist schön"){
    // Wetterform bevorzugt/erwartet
    if (u === "il fait beau") return {ok:true};
    // Nicht-Wetter inhaltlich korrekt, aber Hinweis
    if (u === "cest beau") return {ok:true, note:"Nicht Wetter: korrekt. Wetter: il fait beau"};
  }

  return {ok:false};
}
// === END FIXES ===


// ================= REGELBASIERTE SEMANTIK =================
// Ziel: keine Einzelfall-Flickerei, sondern systematische Bewertung
// Bewertung erfolgt vom DE-Prompt aus


const SEMANTIC_RULES = [
  {
    matchDe: de => /stilles wasser|wasser ohne kohlensaeure/.test(de),
    target: ["l’eau plate"],
    accepted: ["eau non gazeuse","sans gaz"]
  },
  {
    matchDe: de => /wasser mit kohlensaeure|sprudel/.test(de),
    target: ["l’eau gazeuse"],
    accepted: ["eau pétillante","avec gaz"]
  },
  {
    matchDe: de => /gericht.*ausw|essen.*ausw/.test(de),
    target: ["choisir un plat"],
    accepted: ["choisir un repas"]
  },
  {
    matchDe: de => /fahrkarte|ticket|billet/.test(de),
    target: ["le billet"],
    accepted: ["le ticket"],
    strictGenus: true
  },
  {
    matchDe: de => /^es ist schön$/.test(de.trim()),
    target: ["il fait beau"],
    accepted: ["c’est beau"],
    note: "Nicht Wetter korrekt – Wetter: il fait beau"
  },
  {
    matchDe: de => /^es ist schlecht$/.test(de.trim()),
    target: ["il fait mauvais"],
    accepted: ["c’est mauvais"],
    note: "Nicht Wetter korrekt – Wetter: il fait mauvais"
  },
  {
    matchDe: de => /einkaufen/.test(de),
    target: ["je fais les courses"],
    accepted: ["je vais acheter","je vais faire les courses"]
  }
];


function evaluateByRules(user, promptDe){
  const u = ultraNormalize(user || "");
  const de = (promptDe || "").toLowerCase();

  for (const r of SEMANTIC_RULES){
    if (!r.matchDe(de)) continue;

    const all = [...(r.target||[]), ...(r.accepted||[])];
    for (const cand of all){
      if (u === ultraNormalize(cand)){
        return {
          ok: true,
          note: r.target && !r.target.some(t => ultraNormalize(t) === u)
                ? "Ziel: " + r.target[0]
                : null
        };
      }
    }
    return { ok:false };
  }
  return null;
}
// ================= END REGELBASIERTE SEMANTIK =================
