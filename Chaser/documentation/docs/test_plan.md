# Testplan
***Chaser V1.0***
## Mål
***Målet är att testa applikationen ur ett funktionellt och användarvänligt perspektiv.***

_Tester av prestanda, tillgänglighet och säkerhet kommer inte att utföras i version 1 av applikationen._ 

#### Funktionalitet
* Registrera användare
* Logga in användare
* Matcha två användare i speluppstartsfas
* Placera ut pjäser på spelbordet
* Förflyttning av pjäser enligt regelverk
* Spelrollerna "chaser" och "runaway" uppdateras med korrekt visuell information
* Avgöra vinnare och avsluta spel

### Integrationstester
* Systemresurser
   * Registrera - manuellt
   * Logga in - manuellt
   * Starta nytt spel - manuellt
   * Avsluta spelomgång - manuellt
   * Förflytta spelbricka - manuellt

### Enhetstester server
Testverktyg för enhetstester är Mocha och Chai.
***Samtliga publika metoder på servern ska testas.***
* Moduler - database handler
   * connect()
   * getOne()
   * getAll()
   * add()
   * removeOne()
* moduler - database connection
   * connect()
* moduler - database models
   * new User()
* Moduler - server handler
   * handleRegister()
   * handleLogin()
   * handlePlay()
   * handleBoardUpdate()
   * handleGameOver()
* moduler - client manager
* moduler - game manager
   * addGame()
   * gamePending()
   * getGamePendingId()
   * getGame()
* moduler - game
   * addPlayer()
   * getPlayerRole()
   * getNoOfPlayers()
   * getGameId()
   * getPlayers()
   * updateGameRound()
   * onGameOver()


#### Regressions testplan
Enhetstesterna ligger i testsviter som körs löpande vid koduppdateringar. 

#### Strategi
Statiska tester:
* Utvärdera att användarfall och testfall stämmer överrens med kravspecifikation.
* Har extrafunktionalitet lagts till
* Kan all kod nås
Dynamiska tester:
* Applikationen ska testas manuellt från ett användarfallsperspektiv med metod "black box", genom att använda klienten.
* Testfall med inputdata validers mot motsvarande användarfalls huvudflöde.
* Kontrolldata genererar möjliga alternativa flöden.
* Enhetstester ska testa gränsvärden för parametrar, samt olämplig indata (negativ testning).