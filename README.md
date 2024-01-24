
# Voorgeinstalleerde modules:
- Node
- Een MYDQL Database met phpmyadmin

# Database setup:
- in phpmyadmin van de database import de ".sql" file en dit zal de benodige database aanmaken
- daarna in de code gaat u naar de folder /src/server/ en opent u de .env file hierin zit alle configuratie van de  database connectie.
- zodra u in de .env file zit veranderd u het ip-adres(DB_HOST) van de database en de gebruikersAccount en Wachtwoord van dat account.(DB_USER en DB_PASSWORD), de rest moet hetzelfde blijven.

# Installation Guide:
Stap 1;
- Open het project in VSCODE.

Stap 2;
- Open een Terminal

Stap 3;
- doe de command: "npm install" dit gaat alle benodigde items installeren.

stap 4;
- doe de command: "npm fund" dit geeft alle items de benodigde bronnen.

stap 5;
- volg database setup;

stap 6;
- doe de command: "npm start /src/server/index.js" dit gaat de applicatie starten. (De applicatie wilt crashen als de database niet aanstaat.)
