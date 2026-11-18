window.KALENDER = {
  jahr: 2026,
  titel: "Adventskalender 2026",
  untertitel: "Los geht's mit 24 kleinen und großen Abenteuern!",

  // Anzahl Türchen pro Bildschirm (Summe = 24)
  screens: [4, 3, 5, 3, 5, 4],

  // Testmodus: Datumsprüfung aus, alle Türchen lassen sich sofort öffnen.
  // Mit ?datum=2026-12-05 in der URL wird stattdessen dieses Datum simuliert,
  // ?reset setzt die geöffneten Türchen zurück.
  // Vor dem 1. Dezember auf false stellen!
  testModus: true,

  tuerchen: [
    { tag: 1,  bild: "bilder/01_oyster.jpg", titel: "2 Austern", text: "Let's eat them while they're fresh!" },
    { tag: 2,  bild: "bilder/02_nuesse.jpg", titel: "Nussmix", text: "Energie für zwischendurch" },
    { tag: 3,  bild: "bilder/03_candle.jpg", titel: "Eine Kerze", text: "Für bissl Romantik"  },
    { tag: 4,  bild: "bilder/04_wald.jpg", titel: "Zuhause im Wald", text: "Badespaß und Entspannung pur" },
    { tag: 5,  bild: "bilder/05_orange.jpg", titel: "Ladung Vitamine", text: "Orangen für eine ordentliche Ladung Vitamine" },
    { tag: 6,  bild: "bilder/06_michelle.jpeg", titel: "Konzert Michelle Gurevich", text: "Freitag 26.02.2027, 19 Uhr im Huxleys Neue Welt und mir." },
    { tag: 7,  bild: "bilder/07_domino.jpg", titel: "Eine Packung Dominosteine", text: "Hm, lecker" },
    { tag: 8,  bild: "bilder/08_massage.jpg", titel: "Massage", text: "Entspannung durch meine magischen Hände" },
    { tag: 9,  bild: "bilder/09_buch.jpg", titel: "Buch", text: "Graphic novels are the best!" },
    { tag: 10, bild: "bilder/10_oyster.jpg", titel: "6 Austern", text: "Lecker lecker lecker" },
    { tag: 11, bild: "bilder/11_fichte.jpg", titel: "Waldwasser", text: "Ruhe und Kraft tanken" },
    { tag: 12, bild: "bilder/12_drink.jpg", titel: "Let's have a drink", text: "Wein, Bier oder Soda, alles kann nichts muss" },
    { tag: 13, bild: "bilder/13_coffee.jpg", titel: "Kaffeepause", text: "Coffee on me" },
    { tag: 14, bild: "bilder/14_dinner.jpg", titel: "Jemand kocht für uns", text: "Vielleicht wird es auch romantisch <3" },
    { tag: 15, bild: "bilder/15_wald.jpg", titel: "Sehnsucht nach Wald", text: "Tiefenentspannung und Ruhe in der Badewanne" },
    { tag: 16, bild: "bilder/16_nuesse.jpg", titel: "Kuss auf die Nuss", text: "Noch mehr Energie" },
    { tag: 17, bild: "bilder/17_keks.jpg", titel: "Ein Keks", text: "Für gute Laune" },
    { tag: 18, bild: "bilder/18_tea.jpg", titel: "Tea time", text: "Wärme von innen für die kalten Tage" },
    { tag: 19, titel: "gesichtspflege dm", text: "Platzhaltertext für Tag 19." },
    { tag: 20, bild: "bilder/20_sauna.jpg", titel: "Sauna mit mir", text: "Wir lieben die Hitze" },
    { tag: 21, bild: "bilder/21_schoki.jpg", titel: "Ein Stück Schoki", text: "Freude für die Seele" },
    { tag: 22, bild: "bilder/22_cake.jpg", titel: "Kuchen essen", text: "Ein Stück Schwarzwälder" },
    { tag: 23, bild: "bilder/23_foto.jpg", titel: "Urlaubsfoto", text: "Ein Bild aus La Palma" },
    { tag: 24, bild: "bilder/24_oyster.jpg", titel: "12 Austern", text: "Ein Dutzend nur für Dich!" },
  ],
};
