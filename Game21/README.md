# Introduktion till uppgiften

I denna examinationsuppgift ska du simulera kortspelet Tjugoett enligt givna regler.
Du kommer att ha stor frihet välja hur du vill lösa uppgiften; vilka konstruktioner att använda. Hur representeras lämpligen en kortlek om 52 kort? Behöver data kasplas in så att egenskaper behövs? Hur många klasser behöver skapas? Är arv lämpligt att använda i något sammanhang? Vilka metoder behövs? Ska metoderna vara statiska eller inte? Överskuggning?

## Regler

### Kort

En vanlig kortlek om 52 kort används. Esset är värt 1 eller 14 poäng (vilket nu som är mest fördelaktigt för den aktuella handen), en kung är värd 13, en dam 12, en knekt 11 och övriga kort sin valör.

### Spelet idé

I Tjugoett gäller det att komma till, eller så nära som möjligt, summan 21 på två eller flera kort.

### Exempel

Given ger alla spelare ett kort var från draghögen. Given tar inte själv något kort. Spelarna spelar nu mot given en i taget i turordning. När det är en spelares tur begär spelaren ett kort av given. Efter spelarens andra kort kan något av följande inträffa:

* Spelaren har fått 21 och vinner.
* Spelaren har spruckit, d.v.s. fått en summa större än 21, och förlorar.
* Spelaren begär ytterligare kort tills summan är 21, har fem kort på handen, större än 21 eller förklara sig nöjd.

Om en spelare inte vunnit eller förlorat direkt utan istället förklarat sig nöjd är det givens tur att försöka straffa spelaren. Given drar kort från draghögen, ett efter ett, och något av följande kan inträffa:
Given får 21 och vinner.

* Given spricker och spelaren vinner.
* Given förklarar sig nöjd. Spelaren och given jämför sina händers summor och den som har högst vinner. Om summorna är lika vinner given.
* Given fortsätter sedan att spela mot näste spelare på samma sätt.

Tar korten i draghögen slut, det understa kortet delas inte ut, tar given det återstående kortet i draghögen samt alla dittills avverka kort, blandar om dem och använder dem som en ny draghög.

## Uppgift
Du ska skriva en konsol- eller webbapplikation i C# som simulerar kortspelet Tjugoett enligt givna regler. Inget hasardmoment, d.v.s. ingen satsning av pengar, behöver förekomma. Det ska kunna vara en eller flera spelare utöver given. Ingen interaktion med användare ska finnas utan både spelare och giv drar kort från draghögen enligt en förutbestämd algoritm utformad enligt ditt eget tycke. Exempelvis kan du välja att en spelare är nöjd då summan uppgår till 15 (eller mer konservativt, och hållbarare i längden(?), 8). Giv och olika spelare ska kunna vara nöjda vid olika summor.
Din applikation måste innefatta minst tre egendefinierade klasser eller strukturer, som objekt instansieras av. Samtliga typer ska vara placerade i olika filer. Du väljer själv vad typerna ska representera. Kanske skapar du typer för spelbord, draghög, giv, spelare, hand, spelkort, färg, valör, ...?
Efter varje spelomgång ska resultatet presenteras. Det ska framgå vilka kort spelare och giv dragit, respektive hands summa och vem som vunnit. Nedan hittar du förslag på presentation av resultatet av olika spelomgångar.

### Exempel på utfall med en spelare vid bordet.

Spelaren och given förklarar sig nöjda och given vinner då given har den högsta summan.

Player #1: 6♣ 7♥ 2♣ (15)

Dealer   : 9♥ Kn♠ (20)

Dealer wins!

Spelaren får 21 och vinner direkt.

Player #1: A♥ 10♠ A♣ 9♠ (21)

Dealer   : -

Player wins!

Spelaren och given är nöjda och har samma summa på handen varför given vinner.

Player #1: 5♣ K♠ (18)

Dealer   : J♣ 7♥ (18)

Dealer wins!

Spelaren nöjd, given spricker varför spelaren vinner.

Player #1: 3♦ 7♠ 5♠ (15)

Dealer   : 8♥ 6♥ J♦ (25) BUSTED!

Player wins!

Spelaren spricker varför given vinner direkt.

Player #1: 4♣ 9♥ J♥ (24) BUSTED!

Dealer   : -

Dealer wins!

Spelaren drar fem kort och får en summa under 21 och vinner direkt.

Player #1: 4♠ 6♦ 2♦ 2♠ 2♥ (16)

Dealer   : -

Player wins!

Exempel på utfall med tre spelare vid bordet

Player #1: 2♣ 2♦ 6♥ 3♦ 6♦ (19)

Dealer: -

Player #1 wins! 

Player #2: 3♣ A♣ (17)

Dealer: Q♣ 2♥ 5♠ (19)

Dealer wins! 

Player #3: 4♣ A♠ (18)

Dealer: 10♦ Q♠ (22) BUSTED!

Player #3 wins!

 Exempel på utfall med fem spelare vid bordet.

Player #1: 2♣ 9♣ K♥ (24) BUSTED!

Dealer: -

Dealer wins! 

Player #2: 3♣ 7♣ 8♣ (18)

Dealer: 10♠ 8♦ (18)

Dealer wins! 

Player #3: 4♣ 10♣ A♦ (15)

Dealer: 6♠ 9♥ (15)

Dealer wins! 

Player #4: 5♣ 7♠ J♥ (23) BUSTED!

Dealer: -

Dealer wins! 

Player #5: 6♣ 4♦ A♠ 8♠ (19)

Dealer: 7♦ J♠ (18)

Player #5 wins!
