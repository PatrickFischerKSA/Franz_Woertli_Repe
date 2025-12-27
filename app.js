// app.js — KORREKTURLOGIK MIT KONTEXT
// - Autoplay-Fix
// - Ultra-kulante Orthografie
// - (e)-Formen akzeptiert mit explizitem Feedback
// - Präpositionen optional, wenn nicht verlangt
// - KEINE semantische Gleichsetzung bei Wetter-Ausdrücken (il fait ... ist zwingend)

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

/* AUDIO UNLOCK */
function unlockAudio(){
  if (audioUnlocked) return;
  audioUnlocked = true;
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);

/* UTIL */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stripDiacritics(s){
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function expandEVariants(s){
  if (!/\(e\)/.test(s)) return [s];
  return [s.replace(/\(e\)/g,""), s.replace(/\(e\)/g,"e")];
}

function splitSlashVariants(s){
  if (!s) return [];
  // split on / and also allow " / " variants
  return String(s).split("/").map(x=>x.trim()).filter(Boolean);
}

function collectExpectedCandidates(expected){
  const cands = [];
  for (const part of splitSlashVariants(expected)){
    for (const ev of expandEVariants(part)){
      cands.push(ev);
    }
  }
  return cands;
}


/* ---------- ARTIKEL-CHECK (GENUS MUSS STIMMEN) ----------
   Wenn der/die Lernende einen Artikel eingibt (le/la/un/une/l’ ...),
   dann MUSS er zum erwarteten Nomen passen.
   Ohne Artikel bleibt es (wie bisher) kulant.
*/
const _ARTS = ["le","la","l'","les","un","une","des"];

function _normApos(x){
  return (x || "").replace(/[’]/g,"'");
}

function extractLeadingArticle(s){
  let x = _normApos((s || "").trim().toLowerCase());
  if (x.startsWith("l'")) return "l'";
  for (const a of _ARTS){
    if (a === "l'") continue;
    if (x.startsWith(a + " ")) return a;
  }
  return null;
}

/* ULTRA NORMALIZE */
function ultraNormalize(s){
  let x = (s || "").toLowerCase().trim();
  x = stripDiacritics(x);
  x = x.replace(/[’']/g,"").replace(/-/g,"");
  x = x.replace(/oeu/g,"oe").replace(/oe/g,"o");
  x = x.replace(/\b(la|le|les|un|une|des|de|du|aux|au|a|à|en|sur|avec|sans|pour|chez)\b/g,"");
  x = x.replace(/[\s.,;:!?()]/g,"");
  return x;
}


/* ---------- MEHRERE FRANZÖSISCHE ENTSPRECHUNGEN ----------
   Deutsche Wörter mit mehreren zulässigen französischen Entsprechungen.
   Beispiel: lieben -> aimer / adorer
   Mechanismus:
   - global über SEMANTIC_FR_EQUIV (nach deutschem Prompt)
   - oder pro Item via item.frAlt = ["aimer","adorer"]
*/
const SEMANTIC_FR_EQUIV = {
  "zu früh": ["en avance","trop tôt"],
  "zu spät": ["en retard","trop tard"],

  "lieben": ["aimer","adorer"],
  "mögen": ["aimer","bien aimer"],
  "beginnen": ["commencer","débuter"],
  "aufhören": ["arrêter","cesser"],
  "denken": ["penser","croire"],
  "sagen": ["dire","raconter"],
  "schauen": ["regarder","voir"]

  // Mehrere zulässige Entsprechungen (DE → FR), auch ohne echte Synonymie
  "die fahrkarte": ["le billet","le ticket"],
  "zufrieden": ["content","satisfait","satisfaite"],
  "lustig": ["drôle","amusant","amusante"],
  "schön": ["beau","belle"],
  "ich gehe einkaufen.": ["je fais les courses","je vais acheter","je vais faire les courses"]
};



/* ---------- DE → FR HANDLUNGSMUSTER (gehen + Tätigkeit) ----------
   Wenn das deutsche Prompt ein "gehen + Verb" ausdrückt,
   sind folgende französische Formen korrekt:
   - idiomatische Form (Ziel)
   - aller + infinitif
*/
const DE_ACTION_EQUIV = {
  "ich gehe einkaufen.": [
    "je fais les courses",
    "je vais acheter",
    "je vais faire les courses"
  ]
};

function deActionMatch(u, dePrompt){
  const key = (dePrompt || "").toLowerCase().trim();
  if (!DE_ACTION_EQUIV[key]) return false;
  for (const alt of DE_ACTION_EQUIV[key]){
    if (u === ultraNormalize(alt)) return true;
  }
  return false;
}

/* ---------- IDIOMATISCHE ÄQUIVALENZEN ----------
   Feste Wendungen mit mehreren idiomatisch korrekten Formen.
   Beispiel:
     Wie geht's? -> "Ça va ?" (Ziel)
                   "Comment ça va ?" (auch korrekt)
*/
const SEMANTIC_IDIOMS = {
  "ça va ?": ["comment ça va ?"],
  "ca va ?": ["comment ca va ?"]
};

function idiomMatch(uNorm, expected){
  const key = ultraNormalize(expected + "?");
  if (!SEMANTIC_IDIOMS[key]) return false;
  for (const alt of SEMANTIC_IDIOMS[key]){
    if (uNorm === ultraNormalize(alt)) return true;
  }
  return false;
}

/* KORREKTUR */


function isCorrect(user, expected, promptDe){
  const userRaw = (user || "");
  const uArt = extractLeadingArticle(userRaw);
  const u = ultraNormalize(userRaw);

  // Kandidaten aus expected (slash + (e))
  let candidates = collectExpectedCandidates(expected);

  // DE-Map Alternativen
  const key = (promptDe || "").toLowerCase().trim();
  if (SEMANTIC_FR_EQUIV && SEMANTIC_FR_EQUIV[key]){
    candidates = candidates.concat(SEMANTIC_FR_EQUIV[key]);
  }

  // Item-spezifische Alternativen
  if (Array.isArray(this?.frAlt)){
    candidates = candidates.concat(this.frAlt);
  }

  // Idiome (falls Map existiert)
  if (typeof SEMANTIC_IDIOMS !== "undefined"){
    const expKey = ultraNormalize(expected);
    const list = SEMANTIC_IDIOMS[expKey] || SEMANTIC_IDIOMS[expected] || null;
    if (list) candidates = candidates.concat(list);
  }

  // Aktion-Pattern via DE_ACTION_EQUIV/deActionMatch (falls vorhanden)
  if (typeof deActionMatch === "function" && deActionMatch(u, promptDe)) return true;

  // Prüfen über Kandidaten
  for (const cand of candidates){
    if (!cand) continue;
    const cArt = extractLeadingArticle(cand);

    // Genus strikt, falls User Artikel schreibt und Kandidat Artikel hat
    if (uArt && cArt && uArt !== cArt) continue;

    if (u === ultraNormalize(cand)) return true;
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
  if (!toneOn || !audioUnlocked){ $("audioHint").textContent = ""; return; }
  if (answeredTotal < ROUND_SIZE) { $("audioHint").textContent = ""; return; }
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
    const a=$(chosen.id); a.volume = 0.8;
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
  shuffle(pool); rebuildCycleQueue();
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
  if (isCorrect.call(item, $("answer").value, item.fr, item.de)){
    correctTotal += 1;
    if (/\(e\)/.test(item.fr)){
      setFeedback("✓ korrekt <small>(Ziel: " + item.fr + ")</small>", "good");
    } else {
      setFeedback("✓ korrekt <small>(Ziel: " + item.fr + ")</small>", "good");
    }
  } else {
    let sol = item.fr;
    if (/\(e\)/.test(sol)){
      sol = expandEVariants(sol).join(" / ");
    }
    let sol = item.fr || "";
    if (sol.includes("/")) sol = splitSlashVariants(sol)[0] || sol;
    sol = sol.replace(/\(e\)/g,"");
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

document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll("div, p").forEach(el=>{
    if (el.textContent && el.textContent.includes("Level 1: alle Einträge")){
      el.remove();
    }
  });
});
