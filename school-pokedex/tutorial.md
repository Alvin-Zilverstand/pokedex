# Pokémon Website Setup Tutorial

Deze tutorial begeleidt je bij het opzetten en uitvoeren van de Pokémon-website en database.

## Stap 1: Stel de MySQL-database in

1. **Installeer XAMPP:**
   - Download en installeer XAMPP van de officiële website: https://www.apachefriends.org/index.html
   - Volg de installatie-instructies.

2. **Start MySQL:**
   - Open het XAMPP Configuratiescherm.
   - Start de MySQL-module door op de knop "Start" naast MySQL te klikken.

3. **Maak de database en tabellen aan:**
   - Open phpMyAdmin door op de knop "Admin" naast MySQL in het XAMPP Configuratiescherm te klikken.
   - Klik in phpMyAdmin op het tabblad "SQL".
   - Voer het SQL-script uit om de database en tabellen aan te maken.

## Stap 2: Stel de PHP-backend in

1. **Installeer PHP (indien niet al geïnstalleerd met XAMPP):**
   - PHP is inbegrepen bij XAMPP, dus je hoeft het niet apart te installeren.

2. **Maak het PHP API-bestand:**
   - Maak een bestand genaamd `api.php` in de map `/c:/xampp/htdocs/school-pokedex/school-pokedex`.
   - Voeg de benodigde code toe om de API te maken die communiceert met de MySQL-database.

## Stap 3: Stel de frontend in

1. **Maak de HTML-bestanden:**
   - Maak `index.html` en `admin.html` in de map `/c:/xampp/htdocs/school-pokedex/school-pokedex`.
   - Voeg de benodigde HTML-code toe om de hoofdpagina en de beheerderspagina te maken.

2. **Maak het CSS-bestand:**
   - Maak een bestand genaamd `styles.css` in de map `/c:/xampp/htdocs/school-pokedex/school-pokedex`.
   - Voeg de benodigde CSS-code toe om de pagina's op te maken.

3. **Maak de JavaScript-bestanden:**
   - Maak `script.js` en `admin-script.js` in de map `/c:/xampp/htdocs/school-pokedex/school-pokedex`.
   - Voeg de benodigde JavaScript-code toe om de frontend te verbinden met de backend API.

## Stap 4: Start de PHP-server

1. **Start de ingebouwde PHP-server:**
   - Open een terminal of opdrachtprompt.
   - Navigeer naar de map `/c:/xampp/htdocs/school-pokedex/school-pokedex`.
   - Voer het volgende commando uit om de ingebouwde PHP-server te starten:
     ```sh
     php -S localhost:8000
     ```

## Stap 5: Open de website

1. **Open de hoofdpagina:**
   - Open een webbrowser en ga naar `http://localhost:8000/index.html` om de hoofdpagina van de Pokédex te bekijken.

2. **Open de beheerderspagina:**
   - Open een webbrowser en ga naar `http://localhost:8000/admin.html` om de Pokémon te beheren.

Je kunt nu Pokémon bekijken en beheren met de opgegeven frontend- en backend-setup.