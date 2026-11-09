/* Generatore JSON-LD per strutture ricettive — logica pura, nessun dato inviato o salvato. */
(function (root) {
  var TYPES = {
    bnb: { type: "BedAndBreakfast", label: "B&B" },
    affittacamere: { type: "LodgingBusiness", label: "Affittacamere / guest house" },
    casa: { type: "VacationRental", label: "Casa vacanza" }
  };

  function clean(s) { return (s == null ? "" : String(s)).trim(); }

  function validate(d) {
    var errors = [];
    if (!TYPES[d.kind]) errors.push("Scegli il tipo di struttura.");
    if (!clean(d.name)) errors.push("Inserisci il nome della struttura.");
    if (!clean(d.street)) errors.push("Inserisci la via e il numero civico.");
    if (!clean(d.city)) errors.push("Inserisci il comune.");
    if (!clean(d.telephone)) errors.push("Inserisci il telefono.");
    else if (!/^\+?[0-9 ().\-]{6,20}$/.test(clean(d.telephone)) || clean(d.telephone).replace(/\D/g, "").length < 6)
      errors.push("Il telefono sembra non valido (usa cifre, spazi e un eventuale +39).");
    if (clean(d.url) && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(clean(d.url))) errors.push("L'indirizzo del sito deve iniziare con https://");
    if (clean(d.image) && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(clean(d.image))) errors.push("L'indirizzo della foto deve iniziare con https://");
    if (clean(d.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(d.email))) errors.push("L'email non sembra valida.");
    if (clean(d.postalCode) && !/^[0-9]{5}$/.test(clean(d.postalCode))) errors.push("Il CAP ha 5 cifre.");
    if (clean(d.region) && clean(d.region).length > 40) errors.push("Provincia/regione troppo lunga.");
    if (clean(d.checkin) && !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(clean(d.checkin))) errors.push("L'orario di check-in va scritto HH:MM.");
    if (clean(d.checkout) && !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(clean(d.checkout))) errors.push("L'orario di check-out va scritto HH:MM.");
    if (clean(d.priceRange) && clean(d.priceRange).length > 40) errors.push("La fascia di prezzo è troppo lunga (es. «€€» o «80-120 EUR»).");
    return errors;
  }

  function generate(d) {
    var errors = validate(d);
    if (errors.length) return { ok: false, errors: errors };
    var o = {
      "@context": "https://schema.org",
      "@type": TYPES[d.kind].type,
      "name": clean(d.name)
    };
    if (clean(d.description)) o.description = clean(d.description);
    if (clean(d.url)) o.url = clean(d.url);
    o.telephone = clean(d.telephone);
    if (clean(d.email)) o.email = clean(d.email);
    if (clean(d.image)) o.image = clean(d.image);
    var addr = { "@type": "PostalAddress", "streetAddress": clean(d.street), "addressLocality": clean(d.city) };
    if (clean(d.region)) addr.addressRegion = clean(d.region);
    if (clean(d.postalCode)) addr.postalCode = clean(d.postalCode);
    addr.addressCountry = "IT";
    o.address = addr;
    if (clean(d.priceRange)) o.priceRange = clean(d.priceRange);
    if (clean(d.checkin)) o.checkinTime = clean(d.checkin);
    if (clean(d.checkout)) o.checkoutTime = clean(d.checkout);
    return { ok: true, errors: [], data: o, json: JSON.stringify(o, null, 2) };
  }

  /* Il testo va dentro <script>: «<» diventa < (JSON equivalente) così il blocco non si chiude per errore. */
  function snippet(json) {
    return '<script type="application/ld+json">\n' + json.replace(/</g, "\\u003c") + "\n</script>";
  }

  var api = { TYPES: TYPES, validate: validate, generate: generate, snippet: snippet };
  if (typeof module === "object" && module.exports) module.exports = api; else root.JsonLdGen = api;
})(typeof window !== "undefined" ? window : this);
