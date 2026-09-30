/* =========================================================
   FIORI DI ANNA — dati del negozio
   Qui si aggiorna tutto: prezzi, fiori, piante, vasi, orari.
   Mesi: 1 = gennaio ... 12 = dicembre
   ========================================================= */

const SHOP = {
  nome: "Fiori di Anna",
  telefono: "+39 366 548 8260",
  telLink: "+393665488260",
  whatsapp: "393665488260",
  email: "studiomenny.web@gmail.com",
  indirizzo: "Via P. Sterzi 41, 37054 Nogara (VR)",
  mappa: "https://www.google.com/maps?q=Via+P.+Sterzi+41,+Nogara+VR&output=embed",
  mappaLink: "https://www.google.com/maps/search/?api=1&query=Via+P.+Sterzi+41+Nogara+VR",
  // orari: [giorno 0=domenica ... 6=sabato] -> fasce [apertura, chiusura] in "HH:MM"
  orari: {
    0: [["08:30", "12:30"]],
    1: [],
    2: [["08:30", "12:30"], ["15:30", "19:30"]],
    3: [["08:30", "12:30"], ["15:30", "19:30"]],
    4: [["08:30", "12:30"], ["15:30", "19:30"]],
    5: [["08:30", "12:30"], ["15:30", "19:30"]],
    6: [["08:30", "19:30"]]
  },
  chiusureStraordinarie: [] // es. ["2026-12-26"]
};

/* shape: forma del disegno  ->  daisy | rose | tulip | cluster | spike | star
   colori: tinte disponibili (esadecimale)                                     */
const FLOWERS = [
  { id: "rosa", nome: "Rosa", shape: "rose", colori: ["#e0263f", "#ff7aa8", "#fff3e8", "#ffb347"], mesi: [1,2,3,4,5,6,7,8,9,10,11,12], prezzo: 3.5, significato: "Amore e passione (rossa), gratitudine (rosa), amicizia (gialla).", temi: ["amore", "grazie", "anniversario"] },
  { id: "tulipano", nome: "Tulipano", shape: "tulip", colori: ["#ff3b5c", "#ffcf33", "#c77dff", "#ff8fb8"], mesi: [1,2,3,4], prezzo: 2.2, significato: "Dichiarazione d'amore e allegria di primavera.", temi: ["amore", "allegria"] },
  { id: "ranuncolo", nome: "Ranuncolo", shape: "rose", colori: ["#ff9e57", "#ff6fa0", "#fff0d6", "#e8364f"], mesi: [1,2,3,4,5], prezzo: 2.8, significato: "Fascino e ammirazione: \"trovo che tu sia splendida\".", temi: ["amore", "auguri"] },
  { id: "anemone", nome: "Anemone", shape: "star", colori: ["#d6246e", "#5b3cc4", "#ffffff", "#ff4f6d"], mesi: [11,12,1,2,3,4], prezzo: 2.5, significato: "Attesa e speranza.", temi: ["auguri", "scuse"] },
  { id: "mimosa", nome: "Mimosa", shape: "cluster", colori: ["#ffd21f"], mesi: [2,3], prezzo: 4.0, significato: "Forza e sensibilità, simbolo dell'8 marzo.", temi: ["allegria", "auguri"] },
  { id: "giacinto", nome: "Giacinto", shape: "spike", colori: ["#7b61ff", "#ff8fc7", "#ffffff"], mesi: [1,2,3], prezzo: 3.0, significato: "Gioco e sincerità; il viola chiede perdono.", temi: ["scuse", "allegria"] },
  { id: "narciso", nome: "Narciso", shape: "star", colori: ["#ffe14d", "#fff6d0"], mesi: [1,2,3], prezzo: 1.5, significato: "Rinascita e nuovi inizi.", temi: ["auguri", "nascita"] },
  { id: "fresia", nome: "Fresia", shape: "tulip", colori: ["#ffe066", "#ff8fb1", "#ffffff", "#b388ff"], mesi: [1,2,3,4,5], prezzo: 2.0, significato: "Fiducia e amicizia sincera.", temi: ["grazie", "amicizia"] },
  { id: "lilla", nome: "Lillà", shape: "cluster", colori: ["#b98cff", "#ffffff"], mesi: [4,5], prezzo: 5.0, significato: "Primo amore.", temi: ["amore"] },
  { id: "mughetto", nome: "Mughetto", shape: "spike", colori: ["#ffffff"], mesi: [4,5], prezzo: 3.5, significato: "Ritorno della felicità; porta fortuna il 1° maggio.", temi: ["auguri", "nascita"] },
  { id: "iris", nome: "Iris", shape: "star", colori: ["#4b3bff", "#8f6bff", "#ffffff"], mesi: [3,4,5,6], prezzo: 2.5, significato: "Messaggio, fiducia e saggezza.", temi: ["grazie", "amicizia"] },
  { id: "peonia", nome: "Peonia", shape: "rose", colori: ["#ff8fb8", "#ffd6e5", "#e0265e", "#fff4ee"], mesi: [5,6], prezzo: 6.5, significato: "Prosperità e matrimonio felice.", temi: ["amore", "anniversario", "nascita"] },
  { id: "calla", nome: "Calla", shape: "tulip", colori: ["#ffffff", "#ffcc33", "#8e2a6b"], mesi: [4,5,6,7], prezzo: 4.5, significato: "Bellezza ed eleganza, amata dalle spose.", temi: ["anniversario", "cordoglio"] },
  { id: "fiordaliso", nome: "Fiordaliso", shape: "daisy", colori: ["#3e5bff", "#ff5fa2", "#ffffff"], mesi: [5,6,7], prezzo: 2.0, significato: "Delicatezza e riservatezza.", temi: ["amicizia", "allegria"] },
  { id: "lisianthus", nome: "Lisianthus", shape: "rose", colori: ["#b388ff", "#ffffff", "#ff9ec4", "#7a3fd1"], mesi: [5,6,7,8,9,10], prezzo: 3.2, significato: "Gratitudine per sempre.", temi: ["grazie", "anniversario"] },
  { id: "ortensia", nome: "Ortensia", shape: "cluster", colori: ["#6f8cff", "#ff9ed0", "#ffffff", "#9b6bff"], mesi: [5,6,7,8,9], prezzo: 6.0, significato: "Gratitudine sincera e comprensione.", temi: ["grazie", "scuse"] },
  { id: "lavanda", nome: "Lavanda", shape: "spike", colori: ["#8f6bff"], mesi: [6,7,8], prezzo: 1.5, significato: "Serenità, calma, devozione.", temi: ["amicizia", "cordoglio"] },
  { id: "girasole", nome: "Girasole", shape: "daisy", colori: ["#ffc300"], mesi: [6,7,8,9], prezzo: 3.0, significato: "Allegria, ammirazione, fedeltà.", temi: ["allegria", "grazie", "auguri"] },
  { id: "gladiolo", nome: "Gladiolo", shape: "spike", colori: ["#ff4f6d", "#ffffff", "#ff9e57", "#c7254e"], mesi: [6,7,8,9], prezzo: 2.5, significato: "Forza di carattere e integrità.", temi: ["auguri", "cordoglio"] },
  { id: "zinnia", nome: "Zinnia", shape: "daisy", colori: ["#ff5a36", "#ff3d8b", "#ffc53d", "#b3264c"], mesi: [7,8,9], prezzo: 1.8, significato: "Pensiero per un amico lontano.", temi: ["amicizia", "allegria"] },
  { id: "dalia", nome: "Dalia", shape: "daisy", colori: ["#c7254e", "#ff8a1f", "#ffb3c7", "#7a1238"], mesi: [7,8,9,10], prezzo: 4.0, significato: "Riconoscenza e impegno duraturo.", temi: ["grazie", "anniversario"] },
  { id: "settembrino", nome: "Settembrino (Aster)", shape: "daisy", colori: ["#8f6bff", "#ff8fc7", "#ffffff"], mesi: [8,9,10], prezzo: 1.6, significato: "Pazienza e affetto duraturo.", temi: ["amicizia", "scuse"] },
  { id: "iperico", nome: "Bacche di iperico", shape: "cluster", colori: ["#d9362b", "#ff8a1f", "#f4d35e"], mesi: [8,9,10,11], prezzo: 2.0, significato: "Protezione: il tocco d'autunno in ogni mazzo.", temi: ["auguri"] },
  { id: "crisantemo", nome: "Crisantemo", shape: "daisy", colori: ["#ffffff", "#ffc300", "#b3264c", "#ff8a1f"], mesi: [9,10,11], prezzo: 2.5, significato: "Ricordo e affetto; in Oriente è gioia e lunga vita.", temi: ["cordoglio"] },
  { id: "amaryllis", nome: "Amaryllis", shape: "star", colori: ["#e0263f", "#ffffff", "#ff7aa8"], mesi: [11,12,1], prezzo: 7.0, significato: "Fierezza e bellezza splendente.", temi: ["auguri", "amore"] },
  { id: "elleboro", nome: "Elleboro (rosa di Natale)", shape: "star", colori: ["#fff6ee", "#b3264c", "#e7d9ff"], mesi: [12,1,2], prezzo: 4.5, significato: "Serenità e conforto nei giorni freddi.", temi: ["cordoglio", "auguri"] },
  { id: "gerbera", nome: "Gerbera", shape: "daisy", colori: ["#ff4f6d", "#ffc300", "#ff8a1f", "#ff8fc7", "#ffffff"], mesi: [1,2,3,4,5,6,7,8,9,10,11,12], prezzo: 2.0, significato: "Allegria e innocenza.", temi: ["allegria", "auguri", "nascita"] },
  { id: "garofano", nome: "Garofano", shape: "rose", colori: ["#e0263f", "#ff9ec4", "#ffffff", "#ffe066"], mesi: [1,2,3,4,5,6,7,8,9,10,11,12], prezzo: 1.5, significato: "Amore di mamma (rosa), affetto profondo.", temi: ["amore", "grazie"] },
  { id: "orchidea", nome: "Orchidea", shape: "star", colori: ["#ffffff", "#d64bc6", "#ff9ed0"], mesi: [1,2,3,4,5,6,7,8,9,10,11,12], prezzo: 9.0, significato: "Raffinatezza e amore sincero.", temi: ["amore", "anniversario"] },
  { id: "gypsophila", nome: "Gypsophila (velo da sposa)", shape: "cluster", colori: ["#ffffff", "#ffd6e5"], mesi: [1,2,3,4,5,6,7,8,9,10,11,12], prezzo: 2.5, significato: "Purezza: la nuvola leggera che completa i mazzi.", temi: ["nascita", "cordoglio", "amore"] }
];

const TEMI = {
  amore: "Ti amo",
  grazie: "Grazie",
  auguri: "Auguri",
  scuse: "Scusami",
  amicizia: "Ti voglio bene",
  allegria: "Tirati su",
  nascita: "Benvenuto al mondo",
  anniversario: "Anniversario",
  cordoglio: "Condoglianze"
};

/* Composizioni: prezzo "da / a" in euro */
const COMPOSIZIONI = [
  { id: "mazzolino", nome: "Mazzolino del giorno", img: "comp-mazzolino.jpg", da: 12, a: 20, desc: "Pochi steli di stagione legati a mano, carta kraft e rafia. Il pensiero veloce." },
  { id: "bouquet", nome: "Bouquet classico", img: "comp-bouquet.jpg", da: 30, a: 55, desc: "Il mazzo per compleanni e ringraziamenti, fiori e verde di stagione." },
  { id: "bouquet-grande", nome: "Bouquet importante", img: "comp-bouquet-grande.jpg", da: 60, a: 120, desc: "Tanti fiori, rose o peonie in evidenza, per le occasioni che contano." },
  { id: "box", nome: "Flower box", img: "comp-box.jpg", da: 35, a: 80, desc: "Scatola cappelliera con spugna idratata: niente vaso, pronta da appoggiare." },
  { id: "centrotavola", nome: "Centrotavola", img: "comp-centrotavola.jpg", da: 30, a: 65, desc: "Basso e largo, per pranzi di festa, comunioni e cene importanti." },
  { id: "vaso", nome: "Composizione in vaso", img: "comp-vaso.jpg", da: 40, a: 90, desc: "Fiori già sistemati in un vaso che resta a chi li riceve." },
  { id: "sposa", nome: "Bouquet da sposa", img: "comp-sposa.jpg", da: 90, a: 200, desc: "Studiato insieme alla sposa, con prova colori e boutonnière abbinata." },
  { id: "cordoglio", nome: "Omaggio funebre", img: "comp-cordoglio.jpg", da: 70, a: 300, desc: "Cuscini, corone e copricassa. Consegna diretta alla chiesa o alla camera ardente." },
  { id: "ufficio", nome: "Fiori in abbonamento", img: "comp-ufficio.jpg", da: 25, a: 60, desc: "Ogni settimana fiori freschi per negozi, uffici, studi e ristoranti. Prezzo a consegna." }
];

/* Piante: tipo interno/esterno, luce 1-3, cura 1-3 (1 = facilissima), pet = sicura per cani e gatti */
const PIANTE = [
  { id: "monstera", nome: "Monstera deliciosa", img: "p-monstera.jpg", prezzo: 35, tipo: "interno", luce: 2, cura: 1, pet: false, nota: "Foglie enormi e bucate: fa subito giungla." },
  { id: "pothos", nome: "Pothos", img: "p-pothos.jpg", prezzo: 14, tipo: "interno", luce: 1, cura: 1, pet: false, nota: "Ricadente, perdona tutto: perfetta per iniziare." },
  { id: "sansevieria", nome: "Sansevieria", img: "p-sansevieria.jpg", prezzo: 22, tipo: "interno", luce: 1, cura: 1, pet: false, nota: "Un'annaffiatura al mese e sta benissimo." },
  { id: "zamioculcas", nome: "Zamioculcas", img: "p-zamioculcas.jpg", prezzo: 28, tipo: "interno", luce: 1, cura: 1, pet: false, nota: "Lucida e indistruttibile, ama anche gli angoli bui." },
  { id: "ficus-lyrata", nome: "Ficus lyrata", img: "p-ficus.jpg", prezzo: 45, tipo: "interno", luce: 3, cura: 3, pet: false, nota: "Scenografica vicino a una finestra luminosa." },
  { id: "calathea", nome: "Calathea", img: "p-calathea.jpg", prezzo: 24, tipo: "interno", luce: 2, cura: 2, pet: true, nota: "Foglie disegnate che la sera si chiudono." },
  { id: "spathiphyllum", nome: "Spatifillo", img: "p-spatifillo.jpg", prezzo: 18, tipo: "interno", luce: 1, cura: 1, pet: false, nota: "Fiori bianchi e ti avvisa lei quando ha sete." },
  { id: "phalaenopsis", nome: "Orchidea Phalaenopsis", img: "p-orchidea.jpg", prezzo: 25, tipo: "interno", luce: 2, cura: 2, pet: true, nota: "Fiorisce per mesi: il regalo che non sbaglia." },
  { id: "kentia", nome: "Palma Kentia", img: "p-kentia.jpg", prezzo: 55, tipo: "interno", luce: 2, cura: 1, pet: true, nota: "Elegante e alta, ideale per ingressi e uffici." },
  { id: "ciclamino", nome: "Ciclamino", img: "p-ciclamino.jpg", prezzo: 6, tipo: "esterno", luce: 2, cura: 1, pet: false, nota: "Il colore del balcone da ottobre a marzo." },
  { id: "erica", nome: "Erica", img: "p-erica.jpg", prezzo: 5, tipo: "esterno", luce: 3, cura: 1, pet: true, nota: "Fiorita in autunno, resiste al freddo." },
  { id: "olivo", nome: "Olivo in vaso", img: "p-olivo.jpg", prezzo: 40, tipo: "esterno", luce: 3, cura: 1, pet: true, nota: "Un pezzo di lago di Garda in terrazza." },
  { id: "limone", nome: "Limone", img: "p-limone.jpg", prezzo: 35, tipo: "esterno", luce: 3, cura: 2, pet: false, nota: "Profumo di zagara d'estate; d'inverno al riparo." },
  { id: "gelsomino", nome: "Gelsomino", img: "p-gelsomino.jpg", prezzo: 18, tipo: "esterno", luce: 3, cura: 1, pet: true, nota: "Rampicante profumatissimo per recinzioni e pergolati." }
];

const VASI = [
  { id: "vetro", nome: "Vaso in vetro cilindrico", img: "v-vetro.jpg", prezzo: 12, colore: "#bfe6ff" },
  { id: "ceramica", nome: "Vaso in ceramica colorata", img: "v-ceramica.jpg", prezzo: 22, colore: "#ff8a1f" },
  { id: "terracotta", nome: "Vaso in terracotta", img: "v-terracotta.jpg", prezzo: 8, colore: "#c8643b" },
  { id: "cesto", nome: "Cesto in vimini", img: "v-cesto.jpg", prezzo: 15, colore: "#d9b98c" },
  { id: "zinco", nome: "Coprivaso in zinco", img: "v-zinco.jpg", prezzo: 10, colore: "#9aa7b0" },
  { id: "terrario", nome: "Terrario in vetro", img: "v-terrario.jpg", prezzo: 30, colore: "#7fd6b0" },
  { id: "candela", nome: "Candela profumata", img: "v-candela.jpg", prezzo: 14, colore: "#ffd6e5" },
  { id: "terriccio", nome: "Terriccio universale 20 L", img: "v-terriccio.jpg", prezzo: 6, colore: "#6b4a2e" },
  { id: "concime", nome: "Concime liquido", img: "v-concime.jpg", prezzo: 7, colore: "#3fbf7f" },
  { id: "biglietto", nome: "Biglietto scritto a mano", img: "v-biglietto.jpg", prezzo: 2, colore: "#fff3c4" }
];

/* Consegne dai paesi vicini: costo in euro. gratisDa = ordine minimo per consegna gratuita */
const CONSEGNE = [
  { paese: "Nogara", costo: 3, gratisDa: 40 },
  { paese: "Gazzo Veronese", costo: 5, gratisDa: 60 },
  { paese: "Sorgà", costo: 5, gratisDa: 60 },
  { paese: "Salizzole", costo: 5, gratisDa: 60 },
  { paese: "Concamarise", costo: 6, gratisDa: 70 },
  { paese: "Sanguinetto", costo: 6, gratisDa: 70 },
  { paese: "Casaleone", costo: 6, gratisDa: 70 },
  { paese: "Erbè", costo: 6, gratisDa: 70 },
  { paese: "Isola della Scala", costo: 7, gratisDa: 80 },
  { paese: "Villimpenta", costo: 7, gratisDa: 80 },
  { paese: "Cerea", costo: 8, gratisDa: 90 },
  { paese: "Bovolone", costo: 8, gratisDa: 90 }
];

/* Dottore delle piante */
const SINTOMI = [
  { id: "gialle", nome: "Foglie gialle", causa: "Quasi sempre troppa acqua o sottovaso pieno. A volte poca luce.", rimedio: "Svuota il sottovaso, aspetta che i primi 2-3 cm di terra siano asciutti prima di annaffiare di nuovo e avvicinala a una finestra (senza sole diretto)." },
  { id: "punte", nome: "Punte marroni e secche", causa: "Aria secca (termosifoni) o acqua troppo calcarea.", rimedio: "Nebulizza le foglie, metti un sottovaso con argilla espansa bagnata e usa acqua lasciata riposare una notte." },
  { id: "molli", nome: "Foglie molli e cadenti", causa: "Sete vera oppure radici marce per ristagno.", rimedio: "Tocca la terra: se è secca annaffia a fondo; se è bagnata e c'è cattivo odore portacela, la rinvasiamo noi." },
  { id: "ragnatele", nome: "Puntini o ragnatele sotto le foglie", causa: "Ragnetto rosso o cocciniglia, frequenti con il caldo secco.", rimedio: "Lava le foglie con acqua e sapone di Marsiglia; per i casi ostinati abbiamo trattamenti naturali in negozio." },
  { id: "allungata", nome: "Cresce lunga e sottile", causa: "Cerca luce: è troppo lontana dalla finestra.", rimedio: "Spostala in un punto più luminoso e accorcia i rami lunghi: si rinfoltirà." },
  { id: "moscerini", nome: "Moscerini nel terriccio", causa: "Terra sempre umida: le larve vivono lì.", rimedio: "Lascia asciugare bene tra un'annaffiatura e l'altra e copri la superficie con sabbia o lapillo." }
];

/* Palette per il configuratore */
const PALETTE = [
  { id: "solare", nome: "Solare", colori: ["#ffc300", "#ff8a1f", "#ffe14d", "#ff5a36"] },
  { id: "romantica", nome: "Romantica", colori: ["#e0263f", "#ff7aa8", "#ffd6e5", "#b3264c"] },
  { id: "pastello", nome: "Pastello", colori: ["#ffd6e5", "#e7d9ff", "#fff0d6", "#bfe6ff"] },
  { id: "bianco", nome: "Bianco e verde", colori: ["#ffffff", "#fff6ee", "#e9f7ef", "#fffbe6"] },
  { id: "tramonto", nome: "Tramonto", colori: ["#ff5a36", "#ff3d8b", "#ffb347", "#c7254e"] },
  { id: "viola", nome: "Blu e viola", colori: ["#3e5bff", "#8f6bff", "#b98cff", "#ffffff"] },
  { id: "arcobaleno", nome: "Arcobaleno", colori: ["#e0263f", "#ffc300", "#3e5bff", "#ff8fc7", "#ff8a1f", "#8f6bff"] }
];

const RECENSIONI = [
  { nome: "Giulia R.", testo: "Ho chiesto un mazzo per la laurea di mia sorella scrivendo su WhatsApp alle 9: alle 11 era pronto ed era più bello della foto.", voto: 5 },
  { nome: "Marco T.", testo: "Mi hanno consigliato una pianta che non muore nemmeno con me. Dopo un anno è ancora lì, più grande.", voto: 5 },
  { nome: "Famiglia Bertolini", testo: "Per il funerale del papà si sono occupati di tutto con grande delicatezza, anche della consegna in chiesa.", voto: 5 },
  { nome: "Elena e Davide", testo: "Allestimento del matrimonio da sogno. Hanno ascoltato ogni idea e rispettato il budget.", voto: 5 }
];
