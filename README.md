# Task Flow - Menedżer Zadań

Aplikacja webowa do zarządzania zadaniami i użytkownikami. Projekt zrealizowany w technologii Node.js (Express) z bazą danych MySQL oraz statycznym frontendem (HTML, CSS, JavaScript).

## Funkcjonalności

- Zarządzanie zadaniami:
  - Przeglądanie listy wszystkich zadań
  - Dodawanie nowych zadań z przypisaniem do użytkownika
  - Zmiana statusu zadania (Do zrobienia → W trakcie → Zrobione)
  - Usuwanie zadań

- Zarządzanie użytkownikami:
  - Przeglądanie listy wszystkich użytkowników
  - Dodawanie nowych użytkowników
  - Podgląd zadań przypisanych do konkretnego użytkownika
  - Usuwanie użytkowników (wraz z ich zadaniami)

## Technologie

- Backend: Node.js, Express.js
- Baza danych: MySQL (XAMPP)
- Frontend: HTML5, CSS3, JavaScript (fetch API)
- Narzędzia: Nodemon, Dotenv, CORS

## Struktura projektu

task-flow/
│
├── server/
│   ├── db/
│   │   └── init.sql
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── tasks.js
│   │   └── users.js
│   └── server.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── tasks.js
│   │   └── users.js
│   ├── index.html
│   └── users.html
│
├── .env
├── .gitignore
├── package.json
└── README.md

## Instrukcja uruchomienia

### Wymagania wstępne
- Node.js (v14 lub nowszy)
- XAMPP (z MySQL)
- Przeglądarka internetowa

### Krok 1: Uruchomienie bazy danych

1. Otwórz XAMPP Control Panel
2. Kliknij Start przy MySQL
3. Otwórz terminal i połącz się z MySQL:
   cd C:\xampp\mysql\bin
   mysql -u root
4. Utwórz bazę danych:
   CREATE DATABASE task_flow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE task_flow_db;
5. Zaimportuj strukturę bazy:
   - Otwórz plik server/db/init.sql
   - Skopiuj całą zawartość
   - Wklej do terminala MySQL i naciśnij Enter
   - Wyjdź komendą EXIT;

### Krok 2: Konfiguracja środowiska

W głównym katalogu projektu znajduje się plik .env z następującą konfiguracją:

PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=task_flow_db

Uwaga: Jeśli Twoje hasło do MySQL jest inne, zmień DB_PASS.

### Krok 3: Instalacja zależności

W terminalu w głównym katalogu projektu wykonaj:

npm install

### Krok 4: Uruchomienie serwera

npm run dev

Serwer będzie dostępny pod adresem: http://localhost:3001

## Jak korzystać z aplikacji

1. Otwórz przeglądarkę i wejdź na http://localhost:3001
2. Strona główna (Zadania):
   - Zobaczysz listę wszystkich zadań
   - Kliknij "Dodaj Nowe Zadanie" aby utworzyć zadanie
   - Użyj przycisków przy zadaniu aby zmienić jego status
   - Kliknij "Usuń" aby usunąć zadanie
3. Strona Użytkownicy:
   - Kliknij link "Użytkownicy" w nawigacji
   - Zobaczysz listę wszystkich użytkowników
   - Kliknij "Dodaj Nowego Użytkownika" aby dodać osobę
   - Kliknij "Usuń" przy użytkowniku aby go usunąć

## Endpointy API

GET /api/tasks - Pobiera wszystkie zadania
POST /api/tasks - Dodaje nowe zadanie
PATCH /api/tasks/:id - Aktualizuje status zadania
DELETE /api/tasks/:id - Usuwa zadanie
GET /api/users - Pobiera wszystkich użytkowników
GET /api/users/:id - Pobiera konkretnego użytkownika z jego zadaniami
POST /api/users - Dodaje nowego użytkownika
DELETE /api/users/:id - Usuwa użytkownika

## Dane testowe

Po zaimportowaniu bazy danych dostępni są:
- Jan Kowalski (jan@example.com)
- Anna Nowak (anna@example.com)

Oraz zadania:
- Kupić mleko (przypisane do Jana)
- Napisać raport (przypisane do Anny)

## Rozwiązywanie problemów

Błąd połączenia z bazą danych:
- Sprawdź czy MySQL jest uruchomiony w XAMPP
- Sprawdź dane w pliku .env

Strona nie ładuje się:
- Sprawdź czy serwer działa (npm run dev)
- Sprawdź czy port 3001 nie jest zajęty

Błąd przy dodawaniu zadania:
- Upewnij się że w formularzu wybrałeś użytkownika

## Spełnione wymagania

Frontend: HTML, CSS, JavaScript (fetch API)
Minimum 3 widoki: zadania, użytkownicy, popupy
Formularze do dodawania danych
Wyświetlanie danych z bazy
Responsywny design
Backend: Node.js + Express
API RESTful (GET, POST, PATCH, DELETE)
Baza danych MySQL z relacją (users → tasks)
Walidacja danych wejściowych
Obsługa błędów (try-catch, middleware)
Struktura projektu z podziałem na foldery
Plik package.json z zależnościami
Plik .env dla konfiguracji
Plik README.md z instrukcją

---

Autor: Mateusz Kubit
GitHub: https://github.com/Qbitek/task-flow
