För spelinstruktioner, test cases, regler, use cases, testplan och slutrapport se katalogen /documentation/docs

# Chaser
***Projektet kräver [Node](https://nodejs.org/en/) och [MongoDB](https://www.mongodb.com/lp/download/mongodb-enterprise?jmp=nav)***

### Instruktioner för MongoDB:
Följ [guiden](https://www.tutorialspoint.com/mongodb/mongodb_environment.htm) för att konfigruera projektet.

***Specificera din valda lagringsadress, direkt i mongo db miljön, till den katalog du valde vid installation.***
För windows:
1. Kör kommandotolken som administratör.
2. Navigera till bin katalogen för din installation.
3. Kör: mongod.exe --dbpath "disk:\path till datakatalogen\"
   * För att testa databasen, kör mongo.exe

### Instruktioner för applikationen
1. Kör scriptet start i root/CLIENT in en separat terminal
2. Kör scriptet start i root/SERVER in en separat terminal
3. Starta webbläsaren och navigera till localhost:3001

### Instruktioner för NGINX Windows Server 2008-2012

1. Ladda ner kompatibel version av [NGINX](http://nginx.org/download/nginx-1.13.12.zip)
2. Byt ut [nginx.conf](https://github.com/1dv430/js223zs-project/blob/master/conf/nginx.conf)
3. Lägg till NGINX till [tillåtna program](https://serverfault.com/questions/316514/windows-firewall-has-port-80-open-but-prevents-apache-from-making-connections) för trafik på port 80
4. Kör kommando 1 och 4 i CMD från listan nedan (som Admin)

#### Kommandon
Mer info på [NGINX för windows](//nginx.org/en/docs/windows.html).Viktiga kommandon:

| Kommando        |                                                                                      |
|-----------------|--------------------------------------------------------------------------------------|
| start nginx     | starts the process                                                                   |
| nginx -s stop   | fast shutdown                                                                        |
| nginx -s quit   | graceful shutdown                                                                    |
| nginx -s reload | config change, graceful shutdown of existing worker proc, starts new                 |
| nginx -s reopen | re-open log files                                                                    | 
