// app.js – UI-stabile Version
// (Logik bleibt wie zuletzt definiert)

const $ = id => document.getElementById(id);

// Sicherheit: Prompt immer anzeigen
function safeSetPrompt(text){
  const p = $("prompt");
  if (p) p.textContent = text || "";
}

// Beispiel-Initialisierung (ersetzt NICHT deine Logik)
document.addEventListener("DOMContentLoaded", () => {
  safeSetPrompt("…");
});
