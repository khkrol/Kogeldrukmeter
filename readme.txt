======================================================
 PROJECT: Kogeldrukmeter - Wilk 490 UE (Versie 2)
======================================================

BESCHRIJVING
Dit is een Progressive Web App (PWA) speciaal gebouwd voor het berekenen 
en loggen van de kogeldruk voor een Wilk 490 UE caravan. De app berekent 
aan de hand van een hefboomformule de daadwerkelijke kogeldruk op basis 
van de afgelezen neuswieldruk onder het neuswiel. 

De app geeft direct visueel advies (veilig, te zwaar, te licht) en vertelt 
hoeveel gewicht er verplaatst moet worden voor de ideale balans (85 kg).

======================================================
 ONDERLIGGENDE FORMULES & LOGICA
======================================================

1. BEREKENING VAN DE KOGELDRUK (Hefboomwet)
Omdat de neuswieldrukmeter onder het neuswiel wordt geplaatst en niet direct 
onder de koppeling (de kogel), wijkt de afgelezen waarde af van de werkelijke 
kogeldruk. Met behulp van de hefboomwet wordt de echte kogeldruk berekend:

   K = N * (Dn / Dk)

   Waar:
   * K  = Daadwerkelijke kogeldruk (kg)
   * N  = Afgelezen neuswieldruk (kg)
   * Dn = Afstand van de as tot het neuswiel (3.73 meter voor de Wilk 490 UE)
   * Dk = Afstand van de as tot de koppeling/kogel (4.26 meter)

   Voorbeeld: Als je 105 kg afleest op het neuswiel, is de echte kogeldruk:
   K = 105 * (3.73 / 4.26) = 105 * 0.8756 = ~92 kg.

2. BEREKENING GEWICHTSVERPLAATSING
Als de kogeldruk buiten de veilige marge (75 - 100 kg) valt, berekent de app 
hoeveel kilo er verplaatst moet worden naar of van de as om de ideale 
kogeldruk van 85 kg te bereiken.

   Verschil_Kogeldruk = | K - 85 |
   Te_Verplaatsen_Gewicht = Rond_Af( Verschil_Kogeldruk * (Dk / Dd) )

   Waar:
   * Dk = Afstand van de as tot de koppeling (4.26 meter)
   * Dd = Geschatte afstand van de as tot het zwaartepunt van de bagage 
          in de disselbak of voorkant (gesteld op 4.00 meter)

   Deze formule zorgt ervoor dat de gebruiker exact weet hoeveel bagage (in kg)
   er van de voorkant naar het midden (of andersom) verplaatst moet worden.

======================================================
 BESTANDEN OVERZICHT
======================================================
* index.html    - De structuur van de webapp, inclusief de invoervelden.
* style.css     - De opmaak van de app met een automatische donkere modus en blauwe header.
* script.js     - De rekenkern en interactieve logica (inclusief haptische feedback).
* sw.js         - De Service Worker die offline werking mogelijk maakt.
* manifest.json - PWA-configuratiebestand voor installatie op apparaten.
* icon-192.png  - App-icoon voor startscherm (klein).
* icon-512.png  - App-icoon voor opstartscherm (groot).

======================================================
 HOE TE GEBRUIKEN (ONTWIKKELING)
======================================================
Draai de app via een lokale webserver (bijvoorbeeld de extensie "Live Server" 
in Visual Studio Code) om te zorgen dat de Service Worker correct functioneert. 
Dubbelklikken op index.html werkt niet voor PWA-functionaliteiten.

LOKALE DATA
Alle metingen in het logboek worden lokaal opgeslagen via 'localStorage'. 
Er is geen externe database vereist.

AUTEUR
Klaas-Harm Krol
======================================================