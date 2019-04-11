# Introduktion

I denna examinationsuppgift ska du skapa en konsolapplikation i C# vars syfte är att presentera beskrivande statistik över stora datamängder.
Beskrivande statistik (eller deskriptiv statistik; eng. "descriptive statistics") är ett sätt att reducera stora datamängder för att presentera en sammanfattning av datamängden.
 
## Uppgift

Din uppgift är att skriva en konsolapplikation som tar en JSON-fil med heltal som argument och sammanfattar datamängden i filen och ger lättöverskådlig vy av datamängden.

### Klassen Statistics

Applikationen ska innehålla en statisk klass, Statistics, vars statiska metoder reducera datamängden i form av en samling med heltal av typen int som skickas till metoderna i klassen.

Klassen ska ha statiska metoder för att bestämma maximum- och minimumvärden, variationsbredd ("range"), medelvärde ("mean"), median, standardavvikelse ("standard deviation") samt typvärde ("mode", som kan vara en samling med värden).

* De publika statiska metoderna ska implementeras enligt signaturerna i klassdiagrammet i figur 1.
* Medlemmar i klassen Statistics får inte ha några sidoeffekter. Metoder ska vara så kallade pure methods.
* Medlemmar i klassen klassen Statistics ska kasta undantag (men inte fånga några!).
	* Anropas någon av de statiska metoderna i klassen Statistics med argumentet nullska ett undantag av typen ArgumentNullException kastas.
	*Anropas någon av de statiska metoderna i klassen Statistics med ett argument som som refererar till en tom samling, ska ett undantag av typen InvalidOperationException kastas innehållande meddelandet "Sequence contains no elements".
* Du kan lägga till egna medlemmar om du tycker det behövs.

### Övriga klasser

Det står dig fritt att skapa egna statiska klasser för t.ex. applikation, hantering av persistent data, presentation av data, etc.

### Allmänna krav

* Applikationen får endast innehålla statiska klasser och medlemmar.
* Skriva inte all kod som krävs för att lösa problemet i en enda statisk klass och/eller metod. Se till att dela upp lösning av problemet i lämpliga statiska klasser och metoder du själv skapar ("separation of concern").
* Undvik att upprepa kod och bryt därför inte mot principen DRY ("don't repeat yourself").
* Presentationen av den beskrivande statistiken ska vara lättöverskådligt och lättförstålig. Flyttal ska presenteras med en decimals noggrannhet.

Exempel på presentation:

Maximum          : 378

Minimum          : -42

Medelvärde       : 167,3

Median           : 165

Typvärde         : 31, 87, 228

Variationsbredd  : 420

Standardavvikelse: 122,3

* Anropas applikation med JSON-filer innehållande data enligt nedan ska applikationen på lämpligt sätt presentera sammanfattningen:
	* [ 4, 8, 2, 4, 5 ] ska ge 
	{ Maximum: 8, Mean: 4.6, Median: 4, Minimum: 2, Mode: [ 4 ], Range: 6, StandardDeviation: 1,95959179422654 }
	* [ 4, 2, 6, 1, 3, 7, 5, 3, 7 ] ska ge 
	{ Maximum = 7, Mean = 4,22222222222222, Median = 4, Minimum = 1, Mode = [ 3, 7 ], Range = 6, StandardDeviation = 2,0427529234278 }
	* [ 5, 1, 1, 1, 3, -2, 2, 5, 7, 4, 5, 16 ] ska ge 
	{ Maximum = 16, Mean = 4, Median = 3,5, Minimum = -2, Mode = [ 1, 5 ], Range = 18, StandardDeviation = 4,32049379893857 }
	* Innehåller i data.json ska ge 
{ Maximum = 378, Mean = 167,3088, Median = 165, Minimum = -42, Mode = [ 31, 87, 228 ], Range = 420, StandardDeviation = 122,30587738355 }
