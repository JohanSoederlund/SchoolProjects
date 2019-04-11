# Uppgift

Du ska skriva en applikation som med hjälp av klasser grupperar beräkningarna för plangeometriska (2D) figurers area och omkrets. För rymdgeometriska (3D) figurer ska volym, mantelarea och begränsningsarea beräknas.

Användaren ska på lämpligt sätt kunna välja att slumpa 2D- eller 3D-figurer där referenser till objektet ska lagras i en samling. Samlingen ska sedan sorteras varefter figurernas detaljer presenteras i form av en enkel tabell. 2D-figurer ska sorteras med avseende på typ och därefter area, 3D-figurer med avseende på typ och därefter på volym.

Du väljer själv om du vill skriva en konsol- eller webbapplikation (ASP.NET MVC), och hur data ska presenteras. Typerna ska implementeras enligt klassdiagrammen i figur 2 - figur 10. Eventuella fel som inträffar i applikationen ska tas om hand och relevanta felmeddelanden ska visas.

## Klasshierarki

Figurerna har flera gemensamma egenskaper. 2D-figurer har t.ex. en längd, bredd, area och en omkrets. Istället för att dessa egenskaper hanteras i respektive klass kan dessa placeras i en generell klass, en abstrakt basklass som det inte går att instansiera objekt av.

Den abstrakta klassen Shape2D ärver från Shape och innehåller medlemmar som är gemensamma för de konkreta klasserna Ellipse och Rectangle. Klassen Shape3D, även den abstrakt, innehåller medlemmar som är gemensamma för de konkreta klasserna Cuboid, Cylinder och Sphere, som var och en baseras på en 2D-figur varför det är en assocciation mellan Shape3D och Shape2D. Den abstrakta basklassen Shape innehåller medlemmar gemensamma för klasserna Shape2D och Shape3D.

## Klassen Shape

Den abstrakta klassen Shape innehåller medlemmar gemensamma för klasserna Shape2D och Shape3D.

## Is3D
 
Publik ”read-only”-egenskap som ska returnera true om figuren är av någon av typerna Cubiod, Cylinder eller Sphere, annars false.

ShapeType
 
Autoimplementerad egenskap av typen ShapeType där get-metoden är publik och set-metoden är privat. Används för att definiera vilken typ av figur det är. ShapeType är en uppräkningsbar typ (enum), och som lämpligen deklareras i en egen fil.

Shape

Konstruktorn, som ska vara ”protected”, ansvara för att objektet initieras med det värde konstruktorns parameter har.

ToString

Publik abstrakt metod som ska returnera en textbeskrivning av objektet.

## Klassen Shape2D

Den abstrakta klassen Shape2D innehåller såväl konkreta som abstrakta medlemmar gemensamma för figurer som ellips och rektangel. I figur 3 visas de abstrakta medlemmarna med kursiv text.

_length

Privat fält av typen double representerande en figurs längd.

_width

Privat fält av typen double representerande en figurs bredd.

Area

 Publik abstrakt egenskap av typen double representerande en figurs area.

Length

 Publik egenskap av typen `double` som kapslar in fältet _length. set-metoden ska validera värdet som tilldelas egenskapen. Är värdet inte större än 0 ska ett undantag av typen ArgumentOutOfRangeException kastas.

Perimeter

 Publik abstrakt egenskap av typen double representerande en figurs omkrets.

Width

 Publik egenskap av typen double som kapslar in fältet _width. set-metoden ska validera värdet som tilldelas egenskapen. Är värdet inte större än 0 ska ett undantag av typen ArgumentOutOfRangeException kastas.

Shape2D

 Konstruktorn, som ska vara ”protected”, ansvara för att fälten, via egenskaperna, tilldelas de värden konstruktorns parametrar har.

ToString

 ToString() ska överlagras, d.v.s. det ska finnas två metoder med samma namn men med olika parameterlistor. Den publika metoden ToString(string format) har som uppgift att returnera en sträng representerande värdet av en instans. Formatsträngen ska bestämma hur textbeskrivningen av instansen ska formateras. Är formatsträngen "G", en tomsträng eller null, ska strängen formateras så separata rader innehåller ledtext och värden för figurens läng, bredd, omkrets och area.Längd : 5,7Bredd : 34,5Omkrets: 77,7Area : 154,4 Är formatsträngen "R" ska strängen formateras så en rad innehåller ledtext och värden för figurens längd, bredd, omkrets och area.Ellipse 5,7 34,5 77,7 154,4 Alla övriga värden på formatsträngen ska leda till att ett undantag av typen FormatException kastas. Metoden ToString() ska returnera en sträng formaterad enligt kraven för formatsträngen "G".

## Klassen Ellipse

Klassen Ellipse ärver från den abstrakta basklassen Shape2D. I och med att det ska gå att instansiera objekt av klassen, d.v.s. den ska vara konkret, måste den implementera de abstrakta egenskaperna Area och Perimeter i basklassen.

Area

Publik egenskapen av typen double som ska ge en ellips area.

Perimeter

Publik egenskapen av typen double som ska ge en ellips omkrets.

Ellipse

 Publika konstruktorer som genom anrop av basklassens konstruktor ser till att det nya objektets längd och bredd sätts. Konstruktorn som har en parameter används då en figur av typen cirkel ska skapas.

## Klassen Rectangle

Klassen Rectangle ärver från den abstrakta basklassen Shape2D. I och med att det ska gå att instansiera objekt av klassen, d.v.s. den ska vara konkret, måste den implementera de abstrakta egenskaperna Area och Perimeter i basklassen.

Area

Publik egenskap av typen double som ska ge en rektangels area.

Perimeter

Publik egenskap av typen double som ska ge en rektangels omkrets.

Rectangle

Publik konstruktor som genom anrop av basklassens konstruktor ser till att det nya objektets längd och bredd sätts.

## Klassen Shape3D

Den abstrakta klassen Shape3D innehåller såväl konkreta som abstrakta medlemmar gemensamma för figurer som rätblock, cylinder och sfär. I figur 6 visas de abstraktafmedlemmarna med kursiv text.

_baseShape

Skyddat (”protected”) fält av typen Shape2D representerande en 3D-figurs basfigur (ellips eller rektangel).

_height

Privat fält av typen double representerande en figurs höjd.

Height

 Publik egenskap av typen double som kapslar in fältet _height. set-metoden ska validera värdet som tilldelas egenskapen. Är värdet inte större än 0 ska ett undantag av typen ArgumentOutOfRangeException kastas.

MantelArea

 Publik virtuell egenskap av typen double som ska ge en figurs mantelarea (baserad på basfigurens omkrets).

TotalSurfaceArea

 Publik virtuell egenskap av typen double som ska ge en figurs begränsningsarea (baserad på basfigurens area).

Volume

 Publik virtuell egenskap av typen double som ska ge en figurs volym (baserad på basfigurens area).

Shape3D

 Konstruktorn, som ska vara ”protected”, ansvara för att fälten, via egenskaper då sådana finns, tilldelas de värden konstruktorns parametrar har.

ToString

 ToString() ska överlagras, d.v.s. det ska finnas två metoder med samma namn men med olika parameterlistor. Den publika metoden ToString(string format) har som uppgift att returnera en sträng representerande värdet av en instans. Formatsträngen ska bestämma hur textbeskrivningen av instansen ska formateras. Är formatsträngen "G", en tomsträng eller null, ska strängen formateras så separata rader innehåller ledtext och värden för figurens läng, bredd, höjd, mantelarea, begränsningsarea och volym.Längd : 29,6Bredd : 29,6Höjd : 29,6Mantelarea : 2752,5Begränsningsarea: 2752,5Volym : 13579,2 Är formatsträngen "R" ska strängen formateras så en rad innehåller ledtext och värden för figurens längd, bredd, höjd, mantelarea, begränsningsara och volym.Sphere 29,6 29,6 29,6 2752,5 2752,5 13579,2 Alla övriga värden på formatsträngen ska leda till att ett undantag av typen FormatException kastas. Metoden ToString() ska returnera en sträng formaterad enligt kraven för formatsträngen "G".

## Klassen Cuboid

Klassen Cuboid ärver från den abstrakta basklassen Shape3D. Det ska gå att instansiera objekt av klassen, d.v.s. den ska vara konkret.

Cuboid

 Publik konstruktor som genom anrop av basklassens konstruktor ser till att det nya objektets längd, bredd och höjd sätts.

## Klassen Cylinder

Klassen Cylinder ärver från den abstrakta basklassen Shape3D. Det ska gå att instansiera objekt av klassen, d.v.s. den ska vara konkret.

Cylinder

 Publik konstruktor som genom anrop av basklassens konstruktor ser till att det nya objektets horisontella och vertikala diameter sätts.

##Klassen Sphere

Klassen Sphere ärver från den abstrakta basklassen Shape3D. I och med att det ska gå att instansiera objekt av klassen, d.v.s. den ska vara konkret, måste den överskugga de virtuella egenskaperna MantelArea, TotalSurfaceArea och Volume i basklassen för att beräkningarna ska bli korrekta.

Diameter

 Publik egenskap av typen double som ska sätta och ge en sfärs diameter. (Kapslar in lämpliga egenskaper i basklassen.)

MantelArea

 Publik överskuggad egenskap av typen double som ska ge en sfärs mantelarea.

TotalSurfacelArea

 Publik överskuggad egenskap av typen double som ska ge en sfärs begränsningsarea.

Volume

 Publik överskuggad egenskap av typen double som ska ge en sfärs volym.

Sphere

 Publik konstruktor som genom anrop av basklassens konstruktor ser till att det nya objektets diameter.
