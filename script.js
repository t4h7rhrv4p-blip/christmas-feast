(() => {
  const K = window.KALENDER;
  // Testmodus speichert getrennt, damit Testklicks den echten Stand nicht beeinflussen
  const SPEICHER_KEY = `adventskalender-${K.jahr}-offen${K.testModus ? "-test" : ""}`;
  const FLAECHEN = "abcde";
  const params = new URLSearchParams(location.search);

  const kalender = document.getElementById("kalender");
  const toast = document.getElementById("toast");

  if (K.testModus && params.has("reset")) {
    try { localStorage.removeItem(SPEICHER_KEY); } catch {}
  }

  // ----- Datum -----
  function heute() {
    const p = K.testModus && params.get("datum");
    if (p) {
      const d = new Date(p + "T12:00:00");
      if (!isNaN(d)) return d;
    }
    return new Date();
  }

  // Welcher Dezembertag ist heute? 0 = vor Dezember, 99 = danach
  function dezemberTag() {
    const d = heute();
    if (d.getFullYear() < K.jahr) return 0;
    if (d.getFullYear() > K.jahr) return 99;
    return d.getMonth() === 11 ? d.getDate() : 0;
  }

  // ----- Speicher -----
  // null = in diesem Browser wurde noch nie etwas gespeichert
  function ladeOffen() {
    try {
      const roh = localStorage.getItem(SPEICHER_KEY);
      return roh === null ? null : new Set(JSON.parse(roh) || []);
    } catch { return null; }
  }
  function speichereOffen() {
    try { localStorage.setItem(SPEICHER_KEY, JSON.stringify([...offen])); } catch {}
  }
  // Erster Besuch in diesem Browser (neues Gerät, gelöschte Daten):
  // alle vergangenen Tage gelten als geöffnet, damit nichts als „Verpasst“ erscheint
  let offen = ladeOffen();
  if (offen === null) {
    offen = new Set();
    const bisGestern = Math.min(dezemberTag() - 1, 24);
    for (let tag = 1; tag <= bisGestern; tag++) offen.add(tag);
    speichereOffen();
  }

  function status(tag) {
    if (K.testModus && !params.get("datum")) return offen.has(tag) ? "offen" : "oeffenbar";
    const t = dezemberTag();
    if (tag > t) return "zu"; // Zukünftige Tage bleiben zu, auch wenn etwas anderes gespeichert ist
    if (offen.has(tag)) return "offen";
    if (tag === t) return "oeffenbar";
    return "verpasst"; // vergangen und noch nicht geöffnet: markiert, lässt sich nachholen
  }

  // ----- Darstellung -----
  const zweistellig = (n) => String(n).padStart(2, "0");

  function motiv(eintrag) {
    const el = document.createElement("div");
    el.className = "motiv";
    if (eintrag.bild) {
      const img = document.createElement("img");
      img.src = eintrag.bild;
      img.alt = "";
      el.append(img);
    }
    return el;
  }

  // Weiße Motive für die geschlossenen Türchen (viewBox 0 0 100 100)
  const rundum = (teil, n) =>
    Array.from({ length: n }, (_, k) => `<g transform="rotate(${(k * 360) / n} 50 50)">${teil}</g>`).join("");

  const STERN = "M50 6l12.9 26.2 28.9 4.2-20.9 20.4 4.9 28.8L50 72 24.2 85.6l4.9-28.8L8.2 36.4l28.9-4.2z";

  // Ein Motiv pro Türchen, in dieser Reihenfolge
  const MOTIVE = [
    // 1 Schneeflocke mit Ästen
    rundum(`<path d="M50 50V6M50 20l-9-9M50 20l9-9M50 33l-8-8M50 33l8-8"/>`, 6),
    // 2 Glocke
    `<path d="M30 70C30 40 34 22 50 22s20 18 20 48l8 8H22z"/><circle cx="50" cy="85" r="5"/>` +
      `<path d="M50 22v-6"/><circle cx="50" cy="12" r="4"/>`,
    // 3 Stern
    `<path d="${STERN}"/>` +
      `<path d="M50 30l5.9 12 13.2 1.9-9.5 9.3 2.2 13.1L50 60.1l-11.8 6.2 2.2-13.1-9.5-9.3 13.2-1.9z"/>`,
    // 4 Kerze
    `<rect x="36" y="42" width="28" height="50" rx="3"/><path d="M50 34c-8-8-4-18 0-26 4 8 8 18 0 26zM50 34v8"/>` +
      `<path d="M44 42v10a3 3 0 0 0 6 0"/>`,
    // 5 Zuckerstange
    `<path d="M56 94V36a10 10 0 0 0-20 0v6h-12v-6a22 22 0 0 1 44 0v58z"/>` +
      `<path d="M56 82l12-8M56 64l12-8M56 46l12-8M38 26l-12-4"/>`,
    // 6 Geschenk
    `<rect x="18" y="44" width="64" height="48" rx="2"/><rect x="12" y="32" width="76" height="12" rx="2"/>` +
      `<path d="M50 32v60M50 32c-8-16-26-14-18-2zM50 32c8-16 26-14 18-2z"/>`,
    // 7 Schneeflocke mit Rauten
    `<circle cx="50" cy="50" r="7"/>` +
      rundum(`<path d="M50 43V22M50 22l-6-8 6-8 6 8z M50 32l-8-6M50 32l8-6"/>`, 6),
    // 8 Mond mit Funkeln
    `<path d="M56 10A40 40 0 0 0 56 90A50 50 0 0 1 56 10z"/><path d="M78 24v12M72 30h12M86 54v8M82 58h8"/>`,
    // 9 Schneemann
    `<circle cx="50" cy="68" r="22"/><circle cx="50" cy="34" r="13"/>` +
      `<path d="M36 21h28M42 21V8h16v13M45 32h.1M55 32h.1M50 60h.1M50 72h.1"/>`,
    // 10 Lebkuchenmann
    `<circle cx="50" cy="22" r="12"/>` +
      `<path d="M38 36H26a6 6 0 0 0 0 12h12l-6 36a6 6 0 0 0 11 3l7-17 7 17a6 6 0 0 0 11-3l-6-36h12a6 6 0 0 0 0-12z"/>` +
      `<path d="M45 20h.1M55 20h.1M50 48h.1M50 58h.1"/>`,
    // 11 Fäustling
    `<rect x="32" y="78" width="40" height="14" rx="3"/>` +
      `<path d="M36 78C28 62 26 40 34 28c8-12 28-10 32 6v16c4-8 16-6 14 4l-10 24"/>`,
    // 12 Christbaumkugel
    `<circle cx="50" cy="58" r="34"/><path d="M42 24v-8h16v8M50 16c-6-10 6-10 0 0"/>` +
      `<path d="M18 50c10 8 22 8 32 0s22-8 32 0M18 68c10 8 22 8 32 0s22-8 32 0"/>`,
    // 13 Nikolausstiefel
    `<path d="M36 10h26v46l16 10c12 8 6 26-8 24l-30-6c-10-2-8-14-4-22z"/><path d="M36 24h26"/>`,
    // 14 Tasse mit Dampf
    `<path d="M20 44h52v26c0 14-10 22-26 22S20 84 20 70z"/><path d="M72 52c14 0 14 22 0 22"/>` +
      `<path d="M36 34c-6-8 6-12 0-20M52 34c-6-8 6-12 0-20"/>`,
    // 15 Stechpalme
    `<path d="M50 50C38 28 20 24 8 28c8 16 24 26 42 22zM50 50c12-22 30-26 42-22-8 16-24 26-42 22zM50 50L18 32M50 50l32-18"/>` +
      `<circle cx="50" cy="60" r="6"/><circle cx="40" cy="70" r="6"/><circle cx="60" cy="70" r="6"/>`,
    // 16 Tannenbaum
    `<path d="M50 6L30 32h10L22 56h12L14 82h72L66 56h12L60 32h10z M50 82v12"/>` +
      `<path d="M40 44h6M54 66h10M30 70h6"/>`,
    // 17 Schlitten
    `<path d="M22 40h50l6 24H28zM22 40l-4-14h10M36 64v12M68 64v12M8 76h76a8 8 0 0 0 0-16"/>`,
    // 18 Eiskristall
    `<path d="M50 30l17.3 10v20L50 70l-17.3-10V40z"/>` + rundum(`<path d="M50 30V6M50 18l-8-6M50 18l8-6"/>`, 6),
    // 19 Zipfelmütze
    `<path d="M18 74C30 40 50 16 78 22c-10 8-14 28-8 52z"/><rect x="12" y="74" width="66" height="14" rx="7"/>` +
      `<circle cx="85" cy="24" r="8"/>`,
    // 20 Tannenzapfen
    `<ellipse cx="50" cy="56" rx="24" ry="34"/>` +
      `<path d="M50 22V8M32 32l18 12 18-12M27 48l23 14 23-14M27 64l23 14 23-14M36 82l14 8 14-8"/>`,
    // 21 Sternschnuppe
    `<path transform="translate(40 4) scale(.55)" d="${STERN}"/><path d="M52 46L12 86M60 56L30 88M44 40L14 62"/>`,
    // 22 Schneeflocke mit Punkten
    rundum(`<path d="M50 50V14M50 28l-7-7M50 28l7-7"/><circle cx="50" cy="8" r="4"/>`, 8),
    // 23 Noten
    `<ellipse cx="30" cy="78" rx="12" ry="9"/><ellipse cx="72" cy="70" rx="12" ry="9"/>` +
      `<path d="M42 78V22l42-8v56M42 34l42-8"/>`,
    // 24 Rentier
    `<path d="M36 56q0 32 14 36 14-4 14-36-14-10-28 0z"/><circle cx="50" cy="84" r="5"/>` +
      `<path d="M40 52C34 40 30 26 22 12M33 34l-15-4M28 22l2-14M60 52c6-12 10-26 18-40M67 34l15-4M72 22l-2-14M44 66h.1M56 66h.1"/>`,
  ];

  // lage: 0–4, innerhalb eines Bildschirms nie doppelt (siehe render)
  function deko(index, lage) {
    const el = document.createElement("div");
    el.className = `deko deko-pos${lage}`;
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${MOTIVE[index % MOTIVE.length]}</svg>`;
    return el;
  }

  function baueTuer(eintrag, flaeche, index, lage) {
    const tuer = document.createElement("div");
    tuer.className = "tuer";
    tuer.style.gridArea = flaeche;
    tuer.style.setProperty("--farbe", eintrag.farbe || `var(--c${(index % 6) + 1})`);
    tuer.dataset.tag = eintrag.tag;

    const nummer = `<span class="nummer">${zweistellig(eintrag.tag)}</span>`;

    // Nur die Klappe ist ein Button, damit die offene Karte eigene Knöpfe enthalten darf
    const klappe = document.createElement("button");
    klappe.className = "klappe";
    klappe.setAttribute("aria-label", `Türchen ${eintrag.tag}`);
    klappe.innerHTML =
      `<div class="kopf"><div>${nummer}<span class="vermerk">Verpasst? Klick mich!</span></div><span class="pfeil">→</span></div>`;
    klappe.append(deko(index, lage));
    klappe.addEventListener("click", () => tippen(tuer, eintrag));

    // Offene Karte: oben 60 % Bild mit Nummer wie auf der Klappe, unten Titel und Text
    const innen = document.createElement("div");
    innen.className = "innen";
    const bildflaeche = document.createElement("div");
    bildflaeche.className = eintrag.bild ? "innen-bild mit-foto" : "innen-bild";
    bildflaeche.innerHTML = nummer;
    bildflaeche.append(motiv(eintrag));
    const unten = document.createElement("div");
    unten.className = "innen-unten";
    const titel = document.createElement("h2");
    titel.className = "innen-titel";
    titel.textContent = eintrag.titel || "";
    const text = document.createElement("p");
    text.className = "innen-text";
    text.textContent = eintrag.text || "";
    unten.append(titel, text);
    innen.append(bildflaeche, unten);

    if (K.testModus) {
      const zu = document.createElement("button");
      zu.className = "test-knopf";
      zu.textContent = "Wieder schließen (Test)";
      zu.addEventListener("click", () => {
        schliesseTuer(tuer);
        speichereOffen();
        aktualisiereStatus();
      });
      unten.append(zu);
    }

    tuer.append(innen, klappe);
    return tuer;
  }

  function render() {
    kalender.replaceChildren();
    const tuerchen = [...K.tuerchen].sort((a, b) => a.tag - b.tag);
    const zaehler = {};
    let i = 0;

    K.screens.forEach((anzahl, s) => {
      const screen = document.createElement("section");
      screen.className = "screen";

      if (s === 0) {
        const hero = document.createElement("header");
        hero.className = "hero";
        hero.innerHTML = `<h1></h1><p></p>`;
        hero.querySelector("h1").textContent = K.titel;
        hero.querySelector("p").textContent = K.untertitel;
        screen.append(hero);
      }

      // Gleiche Anzahl abwechselnd mit Variante a/b, damit sich Bildschirme unterscheiden
      zaehler[anzahl] = (zaehler[anzahl] || 0) + 1;
      const variante = zaehler[anzahl] % 2 ? "a" : "b";

      const grid = document.createElement("div");
      grid.className = `grid layout-${anzahl}${variante}`;
      for (let f = 0; f < anzahl && i < tuerchen.length; f++, i++) {
        // Jede Kachel eines Bildschirms bekommt eine andere Motiv-Lage
        grid.append(baueTuer(tuerchen[i], FLAECHEN[f], i, (f + s * 2) % 5));
      }
      screen.append(grid);
      kalender.append(screen);
    });

    aktualisiereStatus(true);
  }

  function aktualisiereStatus(ohneAnimation) {
    kalender.querySelectorAll(".tuer").forEach((tuer) => {
      const st = status(Number(tuer.dataset.tag));
      tuer.classList.remove("zu", "verpasst");
      // Geschlossene Karten nicht per Tastatur erreichbar, offene Klappen auch nicht
      tuer.querySelector(".innen").inert = st !== "offen";
      tuer.querySelector(".klappe").inert = st === "offen";
      if (st === "offen") {
        if (ohneAnimation) tuer.classList.add("ohne-animation");
        tuer.classList.add("offen");
      } else if (st !== "oeffenbar") {
        tuer.classList.add(st);
      }
    });
  }

  // ----- Interaktion -----
  function schliesseTuer(tuer) {
    offen.delete(Number(tuer.dataset.tag));
    tuer.classList.remove("offen", "ohne-animation");
  }

  function tippen(tuer, eintrag) {
    const st = status(eintrag.tag);

    if (st === "oeffenbar" || st === "verpasst") {
      offen.add(eintrag.tag);
      speichereOffen();
      aktualisiereStatus();
      return;
    }

    tuer.classList.remove("wackeln");
    void tuer.offsetWidth;
    tuer.classList.add("wackeln");

    const t = dezemberTag();
    if (t === 0) {
      zeigeToast(`Noch ein bisschen Geduld – Türchen ${eintrag.tag} öffnet sich am ${eintrag.tag}. Dezember.`);
    } else {
      const rest = eintrag.tag - t;
      zeigeToast(`Noch ${rest} ${rest === 1 ? "Tag" : "Tage"} – Türchen ${eintrag.tag} öffnet sich am ${eintrag.tag}. Dezember.`);
    }
  }

  let toastTimer;
  function zeigeToast(text) {
    toast.textContent = text;
    toast.classList.add("sichtbar");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("sichtbar"), 2800);
  }

  // Beim Start zum heutigen Türchen scrollen
  function scrolleZuHeute() {
    const t = dezemberTag();
    const tuer = kalender.querySelector(`.tuer[data-tag="${t}"]`);
    if (tuer) tuer.closest(".screen").scrollIntoView();
  }

  // Wenn die App über Mitternacht offen bleibt / wieder in den Vordergrund kommt
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) aktualisiereStatus(true);
  });

  // ----- Nur im Testmodus: Hinweis-Schild mit „Alle schließen“ -----
  if (K.testModus) {
    const badge = document.createElement("div");
    badge.className = "testmodus";
    badge.textContent = params.get("datum")
      ? `Testmodus: ${heute().toLocaleDateString("de-DE")}`
      : "Testmodus: Datumsprüfung aus";
    const alleZu = document.createElement("button");
    alleZu.textContent = "Alle schließen";
    alleZu.addEventListener("click", () => {
      kalender.querySelectorAll(".tuer.offen").forEach(schliesseTuer);
      speichereOffen();
      aktualisiereStatus();
    });
    badge.append(" · ", alleZu);
    document.body.append(badge);
  }

  render();
  scrolleZuHeute();
})();
