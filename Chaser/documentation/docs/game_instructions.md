# <sub>Chaser spelinstruktioner</sub>

<sub>***Registrera användare***</sub><br>
<sub>Skriv in ditt användarnamn och lösenord. Klicka på ”Register”.</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC1_2-1.GIF)<br>
<sub>Om det lyckas kommer du också bli inloggad och tas till nästa bild där du kan anmäla dig för en spelomgång genom att trycka på ”Start new game”</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC1_1-2.GIF)<br>
<sub>Om användarnamnet är upptaget får du ett felmeddelande och kan försöka med ett nytt namn.</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC1_2-2.GIF)<br><br>
<sub>***Logga in användare***</sub><br>
<sub>Om du redan är registrerad skriver du in ditt användarnamn och lösenord. Klicka på ”Login”.
Om det lyckas kommer du också bli inloggad och tas till nästa bild där du kan anmäla dig för en spelomgång genom att trycka på ”Start new game”</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC2_1-2.GIF)<br>
<sub>Om användarnamnet eller lösenordet är fel får du ett felmeddelande och kan försöka igen</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC2_2-2.GIF)<br><br>
<sub>***Starta en spelomgång***</sub><br>
<sub>När du är inloggad klickar du på ”Start new game”. Du kommer du att anmälas till en spelomgång och får antingen rollen ”Chaser” eller ”Runaway”. Dit namn skrivs då in på antingen på Chaser eller Runaway.</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC3-3.GIF)<br>
<sub>Om du är Chaser väntar spelet på att en till användare ska anmäla sig som då blir Runaway.
Spelet börjar med att Chaser ska placera ut alla sina detektiver, markerade som ”D” i spelinformationsavdelningen, på spelbordet. Chaser har tillgång till tre typer av spelaktörer; detektiver (”D”), övervakningskameror(”C”) samt vägspärr(”B”). Övervakningskameror och vägspärr kan placeras ut vid valfri omgång, väl utplacerade kan de inte flyttas igen. Övervakningskameror markeras med gul färg på spelplanen och kan ses av Chaser men inte av Runaway. När runner (”R”) stannar på en ruta med övervakningskamera blir runner synlig för Chaser.</sub><br>
![Spelfall](https://github.com/1dv430/js223zs-project/blob/master/docs/images/TC13-1.GIF)<br>
<sub>Vid utplacering blir de också markerade med samma bokstav  på den ruta på spelbordet de placeras på utom CCTV som gulmarkeras.</sub><br>
![AllGamePieces](https://github.com/1dv430/js223zs-project/blob/master/docs/images/AllGamePieces.GIF)<br>
<sub>Alla detektiver måste placeras ut första spelomgången. När det är gjort klickar användaren på ”DONE” för att föra över spelturen till Runaway. </sub><br>
<sub>Runaway ser var Chaser placerat sina detektiver och eventuell vägspärr och ska då placera ut sin runner (”R”). 
Därefter klickar användaren på ”DONE” för att föra tillbaka spelturen till Chaser.</sub><br><br>
<sub>***Följande spelomgångar***</sub><br>
<sub>Chaser ser runners position efter första spelomgång och var tredje spelomgång med start omgång 3.
Chaser kan flytta detektiverna sammanlagt maximalt åtta steg varje omgång och varje detektiv maximalt två steg. 
Runaway kan flytta runner maximalt två steg.</sub><br>
<sub>Varje speltur avslutas med att användaren kickar ”DONE” för att flytta över spelturen till motståndaren. </sub><br><br>
<sub>***Spelet avslutas***</sub><br>
<sub>Spelet avslutas genom att Chaser flyttar en detektiv till den ruta som runner står på och förklaras då som vinnare. Om Chaser inte lyckats med på tio omgånga förklaras runner som vinnare. </sub><br><br>
<sub>***Ny spelomgång***</sub><br>
<sub>Efter ett avslutat spel visas åter möjligheten att klicka på ”Star new game” och spelaren kommer att registreras för en ny spelomgång på samma sätt som efter inloggning.</sub><br>
