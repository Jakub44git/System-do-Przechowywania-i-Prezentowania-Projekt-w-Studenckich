# Konfiguracja lokalnego środowiska deweloperskiego

Ten dokument zawiera szczegółowe instrukcje dotyczące konfiguracji lokalnego środowiska deweloperskiego dla projektu systemu zarządzania projektami studenckimi.

## Wymagania wstępne

Przed rozpoczęciem konfiguracji upewnij się, że masz zainstalowane następujące narzędzia:

- **Node.js** - wersja 16.x lub nowsza
- **npm** - wersja 8.x lub nowsza
- **Docker** - wersja 20.x lub nowsza
- **Docker Compose** - wersja 2.x lub nowsza
- **Git** - wersja 2.30.x lub nowsza
- **Visual Studio Code** (zalecane) lub inny edytor kodu

## Krok 1: Klonowanie repozytorium

```bash
# Sklonuj repozytorium projektu
git clone https://github.com/twoja-organizacja/system-zarzadzania-projektami.git

# Przejdź do katalogu projektu
cd system-zarzadzania-projektami
```

## Krok 2: Konfiguracja frontendu (Vue.js)

```bash
# Przejdź do katalogu frontendu
cd frontend

# Zainstaluj zależności
npm install

# Skopiuj plik z przykładowymi zmiennymi środowiskowymi
cp .env.example .env

# Uruchom serwer deweloperski
npm run dev
```

Po wykonaniu tych kroków, frontend będzie dostępny pod adresem: `http://localhost:5173`

### Konfiguracja Tailwind CSS

Tailwind CSS jest już skonfigurowany w projekcie. Jeśli chcesz dostosować jego ustawienia, możesz edytować plik `tailwind.config.js`.

## Krok 3: Konfiguracja backendu (NestJS)

```bash
# Przejdź do katalogu backendu
cd ../backend

# Zainstaluj zależności
npm install

# Skopiuj plik z przykładowymi zmiennymi środowiskowymi
cp .env.example .env

# Uruchom serwer deweloperski
npm run start:dev
```

Po wykonaniu tych kroków, API backendu będzie dostępne pod adresem: `http://localhost:3000`

### Konfiguracja Prisma ORM

```bash
# Zainstaluj narzędzie Prisma CLI globalnie (jeśli jeszcze nie masz)
npm install -g prisma

# Wygeneruj klienta Prisma na podstawie schematu
npx prisma generate

# Uruchom migracje bazy danych
npx prisma migrate dev
```

## Krok 4: Konfiguracja bazy danych (PostgreSQL)

Baza danych PostgreSQL jest uruchamiana w kontenerze Docker. Nie musisz instalować PostgreSQL lokalnie.

```bash
# Przejdź do głównego katalogu projektu
cd ..

# Uruchom kontener z bazą danych PostgreSQL
docker-compose up -d postgres
```

### Dostęp do bazy danych

- **Host**: localhost
- **Port**: 5432
- **Użytkownik**: postgres
- **Hasło**: postgres (w środowisku deweloperskim)
- **Baza danych**: student_projects

Możesz zarządzać bazą danych za pomocą narzędzia pgAdmin lub Prisma Studio:

```bash
# Uruchom Prisma Studio aby zarządzać bazą danych
cd backend
npx prisma studio
```

Prisma Studio będzie dostępne pod adresem: `http://localhost:5555`

## Krok 5: Konfiguracja Docker dla całego projektu

Aby uruchomić cały projekt w kontenerach Docker:

```bash
# Uruchom wszystkie kontenery (frontend, backend, baza danych)
docker-compose up -d

# Sprawdź status kontenerów
docker-compose ps
```

Po wykonaniu tych kroków:
- Frontend będzie dostępny pod adresem: `http://localhost:8080`
- Backend API będzie dostępne pod adresem: `http://localhost:3000`
- Baza danych PostgreSQL będzie działać na porcie 5432

## Krok 6: Konfiguracja autoryzacji MS Teams i Active Directory

W środowisku deweloperskim używamy mocku autoryzacji MS Teams, który nie wymaga prawdziwego konta MS Teams i Active Directory.

1. Otwórz plik `.env` w katalogu `backend`
2. Ustaw zmienną `AUTH_MODE=mock`
3. Zrestartuj serwer backendu

Dzięki temu będziesz mógł logować się do aplikacji używając następujących kont:

| Email | Hasło | Rola |
|-------|-------|------|
| admin@example.com | admin123 | Administrator |
| teacher@example.com | teacher123 | Nauczyciel |
| student@example.com | student123 | Student |
| guest@example.com | guest123 | Gość |

## Krok 7: Testowe dane (seed)

Aby załadować testowe dane do bazy danych:

```bash
# Przejdź do katalogu backendu
cd backend

# Uruchom skrypt inicjalizacji danych
npm run seed
```

## Rozwiązywanie problemów

### Problem: Nie można połączyć się z bazą danych

1. Sprawdź, czy kontener PostgreSQL jest uruchomiony: `docker-compose ps`
2. Sprawdź logi kontenera: `docker-compose logs postgres`
3. Upewnij się, że dane dostępowe w pliku `.env` są poprawne

### Problem: Błędy kompilacji frontendu

1. Upewnij się, że masz odpowiednią wersję Node.js: `node -v`
2. Usuń katalog node_modules i zainstaluj zależności ponownie: `rm -rf node_modules && npm install`
3. Wyczyść cache npm: `npm cache clean --force`

### Problem: Błędy generowania Prisma Client

1. Usuń wygenerowany klient i wygeneruj go ponownie: `npx prisma generate`
2. Sprawdź, czy schemat Prisma jest poprawny: `npx prisma validate`

## Dalsza pomoc

Jeśli potrzebujesz dodatkowej pomocy, skontaktuj się z zespołem deweloperskim lub zapoznaj się z dokumentacją w katalogu `docs/dev-guide/`.
