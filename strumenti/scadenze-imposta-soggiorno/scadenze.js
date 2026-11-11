/* Scadenze imposta di soggiorno per comune — dati statici verificati su fonti ufficiali, logica pura, nessun dato inviato o salvato. */
(function (root) {
  var VERIFIED = "2026-11-11";
  var COMUNI = {
    roma: {
      nome: "Roma", tributo: "Contributo di soggiorno", periodicita: "trimestrale",
      mesi: [1, 4, 7, 10], giorno: 16,
      cosa: "comunicazione trimestrale (piattaforma GECOS) e pagamento tramite PagoPA, entrambi alla stessa data",
      portale: "GECOS", url: "https://www.comune.roma.it/web/it/informazioni-di-servizio.page?tem=contributo_di_soggiorno",
      fonte: "Roma Capitale, Ragioneria Generale, avvisi «Scadenze per il contributo di soggiorno» (16 ottobre, 16 luglio, 16 aprile, 16 gennaio 2026)"
    },
    milano: {
      nome: "Milano", tributo: "Imposta di soggiorno", periodicita: "trimestrale",
      mesi: [1, 4, 7, 10], giorno: 15,
      cosa: "riepilogo trimestrale su SoggiorniAmo e versamento con avviso PagoPA generato dalla piattaforma",
      portale: "SoggiorniAmo", url: "https://www.comune.milano.it/servizi/tributi/imposta-di-soggiorno",
      fonte: "Comune di Milano, pagina «Imposta di soggiorno», sezione Scadenze, versamenti e dichiarazioni",
      extra: [{ mese: 1, giorno: 30, testo: "Milano: conto di gestione / modello 21 per l'anno d'imposta precedente (dal 2024, secondo la pagina del Comune)" }]
    },
    firenze: {
      nome: "Firenze", tributo: "Imposta di soggiorno", periodicita: "mensile",
      mesi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], giorno: 15,
      cosa: "dichiarazione mensile online e pagamento tramite PagoPA entro il 15 del mese successivo",
      portale: "portale dell'imposta di soggiorno (SPID, CIE o credenziali del Comune)",
      url: "https://www.comune.firenze.it/servizi/imprese-e-commercio-tributi-finanze-e-contravvenzioni/imposta-di-soggiorno-pagamento-con",
      fonte: "Comune di Firenze, servizio «Imposta di soggiorno - Pagamento con PagoPA»"
    }
  };
  var ANNUALE = { mese: 6, giorno: 30, testo: "Dichiarazione annuale all'Agenzia delle Entrate (non al Comune), per i soggiorni dell'anno precedente" };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + pad(m) + "-" + pad(d); }

  var MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  /* periodo a cui si riferisce la scadenza: il mese o il trimestre appena concluso */
  function periodo(c, y, m) {
    if (c.periodicita === "mensile") { var pm = m === 1 ? 12 : m - 1; return MESI[pm - 1] + " " + (m === 1 ? y - 1 : y); }
    var q = (m - 1) / 3; /* m = 1,4,7,10 -> trimestre precedente */
    return (q === 0 ? 4 : q) + "° trimestre " + (q === 0 ? y - 1 : y);
  }

  /* today: stringa YYYY-MM-DD. Restituisce le prossime scadenze (max n) in ordine di data. */
  function prossime(codice, today, n) {
    var c = COMUNI[codice];
    if (!c || !/^\d{4}-\d{2}-\d{2}$/.test(String(today))) return [];
    var y0 = parseInt(today.slice(0, 4), 10), out = [], y, i;
    for (y = y0; y <= y0 + 1; y++) {
      c.mesi.forEach(function (m) { out.push({ data: iso(y, m, c.giorno), tipo: "periodica", periodo: periodo(c, y, m), testo: c.cosa }); });
      out.push({ data: iso(y, ANNUALE.mese, ANNUALE.giorno), tipo: "annuale", testo: ANNUALE.testo });
      (c.extra || []).forEach(function (e) { out.push({ data: iso(y, e.mese, e.giorno), tipo: "extra", testo: e.testo }); });
    }
    out = out.filter(function (x) { return x.data >= today; }).sort(function (a, b) { return a.data < b.data ? -1 : a.data > b.data ? 1 : 0; });
    return out.slice(0, n || 4);
  }

  var api = { VERIFIED: VERIFIED, COMUNI: COMUNI, ANNUALE: ANNUALE, prossime: prossime };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.ScadenzeIS = api;
})(typeof window !== "undefined" ? window : this);
