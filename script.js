// Functie voor de plus en min knoppen
function pasWaardeAan(waarde) {
    let invoerVeld = document.getElementById("neuswieldruk");
    let huidigGeval = parseFloat(invoerVeld.value.replace(',', '.'));
    
    // Als het veld leeg is, starten we op 0
    if (isNaN(huidigGeval)) huidigGeval = 0;
    
    // Voeg de waarde toe (bijv. +1 of -1)
    let nieuweWaarde = huidigGeval + waarde;
    if (nieuweWaarde < 0) nieuweWaarde = 0; // Voorkom negatieve getallen
    
    invoerVeld.value = nieuweWaarde;
    
    // Voer de berekening direct opnieuw uit
    berekenKogeldruk();
}

// Houdt bij of we al getrild hebben om overmatig trillen te voorkomen
let vorigeStatusWasGevaar = false;

function berekenKogeldruk() {
    let invoerVeld = document.getElementById("neuswieldruk").value;
    let veiligeInvoer = invoerVeld.replace(',', '.');
    let N = parseFloat(veiligeInvoer);
    let belading = document.getElementById("belading").value;
    let resultaatBox = document.getElementById("resultaatBox");

    // Foutafhandeling: verberg de resultaatbox schoon via de CSS class
    if (isNaN(N) || N <= 0) {
        resultaatBox.classList.add("verborgen");
        // We halen de style block/none logica weg, CSS handelt het nu beter af
        resultaatBox.style.position = "absolute"; 
        return; 
    }

    // Laat het resultaatvak soepel verschijnen
    resultaatBox.style.position = "relative";
    resultaatBox.classList.remove("verborgen");

    // Berekening Kogeldruk
    let Dn = 3.73; 
    let Dk = 4.26;
    let K = N * (Dn / Dk);
    let afgerondeKogeldruk = Math.round(K);

    document.getElementById("uitvoerGetal").innerText = afgerondeKogeldruk;

    // Meter Animatie Berekenen (Max meter is 150kg)
    let percentage = (afgerondeKogeldruk / 150);
    if (percentage > 1) percentage = 1; 
    
    // De meter loopt van 0 tot 180 graden (halve cirkel)
    let graden = percentage * 180;
    let gaugeVulling = document.getElementById("gaugeVulling");
    gaugeVulling.style.transform = `rotate(${graden}deg)`;

    // --- Berekening voor het verplaatsen van gewicht ---
    let advies = "";
    let huidigeStatusIsGevaar = false;
    let idealeKogeldruk = 85; // We mikken op een perfecte 85 kg
    let afstandKogel = Dk; // 4.26m
    let afstandDissel = 4.0; // Geschatte afstand van de as tot de spullen voorin

    if (afgerondeKogeldruk > 100) {
        gaugeVulling.style.backgroundColor = "var(--gevaar-kleur)"; 
        
        // Bereken hoeveel er teveel is, en pas de hefboomformule toe
        let kgVerschil = afgerondeKogeldruk - idealeKogeldruk;
        let teVerplaatsen = Math.round(kgVerschil * (afstandKogel / afstandDissel));

        advies += `<span class='waarschuwing'>Te zwaar!</span> De kogeldruk is boven de toegestane 100 kg. <br><br>📦 <b>Actie:</b> Verplaats ongeveer <b>${teVerplaatsen} kg</b> vanuit de disselbak/voorkant naar de as (het midden) om op ~85 kg uit te komen.`;
        huidigeStatusIsGevaar = true;
        
    } else if (afgerondeKogeldruk < 75) {
        gaugeVulling.style.backgroundColor = "var(--waarschuwing-kleur)"; 
        
        // Bereken hoeveel we tekort komen
        let kgVerschil = idealeKogeldruk - afgerondeKogeldruk;
        let teVerplaatsen = Math.round(kgVerschil * (afstandKogel / afstandDissel));

        advies += `<span class='waarschuwing'>Te licht!</span> Dit zorgt voor slingergevaar. <br><br>📦 <b>Actie:</b> Verplaats ongeveer <b>${teVerplaatsen} kg</b> vanaf de as (het midden) naar de disselbak/voorkant om op ~85 kg uit te komen.`;
        huidigeStatusIsGevaar = true;
        
    } else {
        gaugeVulling.style.backgroundColor = "var(--succes-kleur)"; 
        advies += "<span class='succes'>Perfect in balans!</span> De kogeldruk valt mooi binnen de veilige marge van 75 tot 100 kg. Je hoeft niets te verplaatsen.";
    }

    // Trilfunctie (Haptic Feedback)
    if (huidigeStatusIsGevaar && !vorigeStatusWasGevaar) {
        if ("vibrate" in navigator) {
            navigator.vibrate([100, 50, 100]); 
        }
    }
    vorigeStatusWasGevaar = huidigeStatusIsGevaar;

    // Specifiek advies bij zware belading
    if (belading === "zwaar") {
        advies += "<br><br><small><em>Tip: Let extra op de bandenspanning van zowel auto als caravan, aangezien je nabij de maximale 1700 kg zit.</em></small>";
    }

    document.getElementById("adviesTekst").innerHTML = advies;
}

function slaMetingOp() {
    let invoerWaarde = document.getElementById("neuswieldruk").value;
    let afgerondeKogeldruk = document.getElementById("uitvoerGetal").innerText;
    let belading = document.getElementById("belading").value;
    
    // Voorkom opslaan als er geen geldige meting is
    if (!invoerWaarde || parseFloat(invoerWaarde) <= 0 || afgerondeKogeldruk == "0") return;

    // Haal de huidige datum op in een mooi jasje
    let opties = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' };
    let datum = new Date().toLocaleDateString('nl-NL', opties);

    // Maak een mooi tekstje voor de belading status
    let beladingTekst = "Normaal";
    if (belading === "licht") beladingTekst = "Licht";
    if (belading === "zwaar") beladingTekst = "Zwaar";

    let nieuweMeting = {
        druk: afgerondeKogeldruk,
        datum: datum,
        belading: beladingTekst
    };

    // Haal bestaande historie op of maak een lege lijst als er nog niets is
    let historie = JSON.parse(localStorage.getItem("kogeldrukHistorie")) || [];
    
    // Voeg de nieuwe meting vooraan toe aan de lijst
    historie.unshift(nieuweMeting);
    
    // NIEUW: Zorg dat de lijst maximaal 50 items lang is
    if (historie.length > 50) {
    historie.pop(); // Gooit de alleroudste meting onderaan de lijst weg
}

    // Sla het weer op in LocalStorage
    localStorage.setItem("kogeldrukHistorie", JSON.stringify(historie));

    // Update de weergave op het scherm
    laadHistorie();
    
    // Geef een korte trilling als bevestiging van opslaan
    if ("vibrate" in navigator) {
        navigator.vibrate(50);
    }
}

function laadHistorie() {
    let historieLijst = document.getElementById("historieLijst");
    let historie = JSON.parse(localStorage.getItem("kogeldrukHistorie")) || [];
    
    // Maak de lijst eerst leeg
    historieLijst.innerHTML = "";

    if (historie.length === 0) {
        historieLijst.innerHTML = "<li class='lege-lijst'>Nog geen metingen opgeslagen.</li>";
        return;
    }

    // Bouw voor elke meting een lijst-item (HTML)
    historie.forEach(item => {
        let li = document.createElement("li");
        li.className = "historie-item";
        li.innerHTML = `<strong>${item.druk} kg</strong> <span class="historie-meta">(${item.belading}) - ${item.datum}</span>`;
        historieLijst.appendChild(li);
    });
}

function wisHistorie() {
    if (confirm("Weet je zeker dat je alle opgeslagen metingen wilt wissen?")) {
        localStorage.removeItem("kogeldrukHistorie");
        laadHistorie();
    }
}

// --- HIER WORDEN DE COMPONENTEN GEKOPPELD ---
// Wacht tot de hele HTML pagina geladen is voordat we knoppen gaan zoeken
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Laad direct de opgeslagen historie
    laadHistorie();

    // 2. Koppel de acties aan de knoppen en invoervelden
    document.getElementById("knopMin").addEventListener("click", function() {
        pasWaardeAan(-1);
    });
    
    document.getElementById("knopPlus").addEventListener("click", function() {
        pasWaardeAan(1);
    });

    document.getElementById("neuswieldruk").addEventListener("input", berekenKogeldruk);
    document.getElementById("belading").addEventListener("change", berekenKogeldruk);
    document.getElementById("knopOpslaan").addEventListener("click", slaMetingOp);
    document.getElementById("knopWissen").addEventListener("click", wisHistorie);
});

// --- REGISTRATIE SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registratie) {
                console.log('Service Worker geregistreerd met scope:', registratie.scope);
            })
            .catch(function(fout) {
                console.log('Service Worker registratie mislukt:', fout);
            });
    });
}