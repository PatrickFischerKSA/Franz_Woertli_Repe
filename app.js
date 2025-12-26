// app.js — AUTOPLAY-FIX + ULTRA-KULANTE KORREKTUR
// Akzeptiert:
/*
 - fehlende Abstände / Bindestriche / Apostrophe
 - fehlende Akzente
 - oe / oeu / oe / o / e Varianten (z.B. soeur / soeuer / soer)
 - optionale Artikel bei Nomen (la soeur = soeur)
 - kontextuell äquivalente Formen (Singular mit/ohne Artikel)
*/

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

/* ---------- AUDIO UNLOCK ---------- */
function unlockAudio(){
  if (audioUnlocked) return;
  audioUnlocked = true;
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);

/* ---------- UTIL ---------- */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stripDiacritics(s){
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");
}


// optionale Präpositionen (werden ignoriert, wenn nicht angegeben)
const OPTIONAL_PREPS = ["a","à","au","aux","de","du","des","en","sur","avec","sans","pour","chez"];

function stripOptionalPreps(x){
  let y = x;
  OPTIONAL_PREPS.forEach(p=>{
    y = y.replace(new RegExp("^"+p, "g"), "");
  });
  return y;
}

/* ---------- ULTRA-NORMALISIERUNG ---------- */
function ultraNormalize(s){
  let x = (s || "").toLowerCase().trim();

  // vereinheitliche Apostrophe & Bindestriche
  x = x.replace(/[’']/g,"");
  x = x.replace(/-/g,"");

  // Akzente entfernen
  x = stripDiacritics(x);

  // oe/oeu/o/e Varianten
  x = x.replace(/oeu/g,"oe");
  x = x.replace(/oe/g,"o");

  // Artikel optional (la/le/les/un/une/des)
  x = x.replace(/\b(la|le|les|un|une|des)\b/g,"");

  // Leerzeichen & Satzzeichen entfernen
  x = x.replace(/[\s.,;:!?()]/g,"");

  x = stripOptionalPreps(x);
  return x;
}


/* ---------- (e)-VARIANTEN ----------
   Akzeptiert fatigué / fatiguée, content / contente etc.
*/
function expandEVariants(s){
  if (!s) return [];
  const base = s;
  const variants = new Set();
  variants.add(base);
  // fatigué(e) -> fatigué, fatiguée
  if (/\(e\)/.test(base)){
    variants.add(base.replace(/\(e\)/g,""));
    variants.add(base.replace(/\(e\)/g,"e"));
  }
  return Array.from(variants);
}

/* ---------- KORREKTUR ---------- */
function isCorrect(user, expected){
  const expVars = expandEVariants(expected);

  if (!user) return false;

  const u = ultraNormalize(user);
  for (const ev of expVars){
    const e = ultraNormalize(ev);
    if (u === e) return true;
  }
  return false;
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
  for (const x of tiers){ if (ratePercent >= x.t){ tier = x.t; break; } }
  if (tier !== lastMusicTier){
    ["audio50","audio60","audio70","audio80","audio90"].forEach(id=>{
      const a=$(id); try{ a.pause(); a.currentTime=0; }catch(e){}
    });
    lastMusicTier = tier;
    const chosen = tiers.find(x=>x.t===tier);
    if (!chosen) return;
    const a=$(chosen.id);
    a.volume = 0.8;
    a.play().then(()=>{
      $("audioHint").textContent = "🎵 " + chosen.label + " (" + tier + "%+)";
    }).catch(()=>{ $("audioHint").textContent = ""; });
  }
}

function rebuildCycleQueue(){ cycleQueue = shuffle(pool.slice()); }
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
  roundIndex = 0; goodRounds = 0; qIndex = 0;
  answeredTotal = 0; correctTotal = 0; lastMusicTier = 0;
  startRound();
}

function startRound(){ roundSet = pickRoundSet(); qIndex = 0; showQuestion(); }

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
  answeredTotal += 1;
  if (isCorrect($("answer").value, item.fr)){
    correctTotal += 1;
    if (/\(e\)/.test(item.fr)) {
      setFeedback("✓ korrekt <small>(maskulin / feminin akzeptiert)</small>", "good");
    } else {
      setFeedback("✓ korrekt", "good");
    }
  } else {
    let sol = item.fr;
  if (/\(e\)/.test(sol)){
    const vs = expandEVariants(sol).filter(v=>!v.includes("(e)"));
    sol = vs.join(" / ");
  }
  setFeedback("✗ falsch<br><small>Erwartet: <b>"+sol+"</b></small>", "bad");
  }
  $("answer").disabled = true;
  $("btnCheck").disabled = true;
  $("btnNext").disabled = false;
  updateUI();
}

function next(){
  qIndex += 1;
  if (qIndex < roundSet.length){ showQuestion(); return; }
  const roundAnswered = roundSet.length;
  const roundCorrect = correctTotal - (answeredTotal - roundAnswered);
  const roundRate = roundAnswered ? (roundCorrect / roundAnswered) : 0;
  if (level === 1){
    if (roundRate >= NEED_RATE) goodRounds += 1;
    roundIndex += 1;
    if (roundIndex >= NEED_ROUNDS){
      if (goodRounds >= NEED_ROUNDS){ startLevel(2); return; }
      roundIndex = 0; goodRounds = 0; rebuildCycleQueue();
    }
    startRound();
  } else startRound();
}

function resetAll(){ startLevel(1); }

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
      const a=$(id); try{ a.pause(); a.currentTime=0; }catch(e){}
    });
    lastMusicTier = 0; $("audioHint").textContent = "";
  } else updateUI();
});

startLevel(1);
