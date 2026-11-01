/* Checklist sito B&B in 5 minuti — logica pura, nessun dato inviato o salvato. */
(function (root) {
  var ITEMS = [
    { id: "https", area: "Sicurezza", q: "Se scrivo http:// davanti all'indirizzo, il sito passa da solo a https:// e il browser non mostra «Non sicuro»?",
      fix: "Chiedi a chi gestisce l'hosting di attivare il certificato (spesso gratuito, Let's Encrypt) e il reindirizzamento automatico.", guide: "controlli-sito-bnb" },
    { id: "google", area: "Google", q: "Cercando site:latuastruttura.it su Google, il titolo della home contiene nome, tipo di struttura e località (non «Home» o «Benvenuti»)?",
      fix: "Riscrivi il titolo, per esempio «B&B Il Glicine – Camere a Lecce centro», e la descrizione in una frase che dica perché prenotare da te.", guide: "controlli-sito-bnb" },
    { id: "mobile", area: "Telefono", q: "Dal telefono leggo il sito senza zoomare e il pulsante per prenotare o contattare si vede subito?",
      fix: "Usa un tema «responsive»: la maggior parte di chi cerca un alloggio usa il telefono.", guide: "controlli-sito-bnb" },
    { id: "speed", area: "Velocità", q: "Su PageSpeed Insights (gratuito, di Google) il risultato «Dispositivi mobili» non è nella fascia rossa?",
      fix: "Le cause più frequenti sono le foto a piena risoluzione: riducile (larghezza 1600 px, WebP o JPG compresso).", guide: "controlli-sito-bnb" },
    { id: "links", area: "Link", q: "Tutte le voci del menu e i link in fondo (privacy, contatti, mappa) portano a una pagina esistente?",
      fix: "Correggi il link o reindirizza la vecchia pagina a quella nuova.", guide: "controlli-sito-bnb" },
    { id: "robots", area: "Sitemap", q: "Il file /robots.txt non contiene un «Disallow: /» da solo e /sitemap.xml si apre?",
      fix: "Molti CMS (WordPress con plugin SEO, Wix, Squarespace) generano la sitemap da soli: va attivata e segnalata in Google Search Console.", guide: "controlli-sito-bnb" },
    { id: "booking", area: "Prenotazione diretta", q: "Dalla home servono al massimo due clic per verificare disponibilità e prezzo, anche da telefono?",
      fix: "Collega il booking engine del tuo gestionale o channel manager e metti «Verifica disponibilità» in alto.", guide: "controlli-sito-bnb" },
    { id: "nap", area: "Coerenza dei dati", q: "Nome, indirizzo e telefono sul sito sono identici a Google Maps e ai portali?",
      fix: "Dati diversi confondono ospiti e motori di ricerca: usa ovunque la stessa forma.", guide: "controlli-sito-bnb" },
    { id: "schema", area: "Dati strutturati", q: "Il Test dei risultati multimediali di Google riconosce dati strutturati di tipo LodgingBusiness sulla home?",
      fix: "Aggiungi i dati strutturati LodgingBusiness (nome, indirizzo, telefono, foto). È una raccomandazione, non un obbligo.", guide: "controlli-sito-bnb" },
    { id: "cin", area: "CIN", q: "Ho il CIN della struttura e lo vedo sul sito (piè di pagina o contatti) e in ogni annuncio sui portali?",
      fix: "Il CIN va indicato in ogni annuncio (art. 13-ter, c. 6, DL 145/2023); sul sito proprio la norma non è esplicita, ma indicarlo è la scelta prudente. Sanzioni fino a 8.000 euro: vedi la guida.", guide: "cin-annunci-sito-bnb" },
    { id: "privacy", area: "Privacy e cookie", q: "Il sito ha un'informativa privacy raggiungibile e, se usa cookie non tecnici o tracker di marketing, un banner con scelta di rifiuto?",
      fix: "Con soli cookie tecnici basta l'informativa; con profilazione o marketing serve il consenso preventivo (Garante privacy, linee guida 10/06/2021). Verifica con il tuo consulente.", guide: "controlli-sito-bnb" },
    { id: "contact", area: "Contatti", q: "Un ospite trova in pochi secondi un telefono o un'email di contatto funzionanti?",
      fix: "Metti telefono, email e pulsante WhatsApp (se lo usi) in alto e nel piè di pagina.", guide: "controlli-sito-bnb" }
  ];

  function score(answers) {
    var total = ITEMS.length, yes = 0, no = [], unsure = [];
    ITEMS.forEach(function (it) {
      var a = answers && answers[it.id];
      if (a === "yes") yes++;
      else if (a === "no") no.push(it);
      else unsure.push(it);
    });
    var pct = Math.round(100 * yes / total);
    var band = pct >= 85 ? "buono" : pct >= 60 ? "da migliorare" : "da sistemare";
    return { total: total, yes: yes, no: no, unsure: unsure, pct: pct, band: band };
  }

  function auditLink(base) { return (base || "../../audit/") + "?c=tool1#richiesta"; }

  var api = { ITEMS: ITEMS, score: score, auditLink: auditLink };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Checklist = api;
})(typeof window !== "undefined" ? window : this);
