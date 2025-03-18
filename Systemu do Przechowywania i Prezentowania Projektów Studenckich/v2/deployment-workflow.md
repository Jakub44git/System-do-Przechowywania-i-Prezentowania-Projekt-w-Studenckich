# Proces wdrożenia - od rozwoju lokalnego do produkcji

Ten dokument opisuje proces przejścia aplikacji zarządzania projektami studenckimi od lokalnego środowiska deweloperskiego do pełnego wdrożenia produkcyjnego na serwerze uczelnianym.

## Fazy wdrożenia

### 1. Rozwój lokalny
- Programiści pracują na swoich lokalnych maszynach
- Środowisko wykorzystuje mock autoryzacji zamiast rzeczywistej integracji z MS Teams
- Baza danych działa lokalnie w kontenerze Docker

### 2. Testowanie (Staging)
- Aplikacja wdrażana na testowym serwerze
- Pierwsze próby integracji z MS Teams i Active Directory
- Dane testowe, ale struktura identyczna jak w produkcji

### 3. Produkcja
- Pełne wdrożenie na serwerze uczelnianym
- Pełna integracja z MS Teams i Active Directory
- Rzeczywiste dane użytkowników i projektów

## Wymagania dla każdego środowiska

### Środowisko deweloperskie (Lokalnie)
- Docker Desktop
- Node.js 16+
- npm 8+
- Dostęp do repozytorium Git
- Plik `.env.development` z konfiguracją deweloperską

### Środowisko testowe (Staging)
- Dostęp SSH do serwera testowego
- Docker i Docker Compose na serwerze
- Dostęp do testowego AD uczelni (lub mocka)
- Certyfikat SSL (może być self-signed)
- Plik `.env.staging` z konfiguracją dla środowiska testowego

### Środowisko produkcyjne
- Dostęp SSH do serwera produkcyjnego (maszyna wirtualna w akademii)
- Docker i Docker Compose na serwerze
- Dostęp do produkcyjnego AD uczelni
- Certyfikat SSL podpisany przez zaufany CA
- Domena lub subdomena uczelni
- Plik `.env.production` z konfiguracją produkcyjną

## Proces wdrożenia krok po kroku

### 1. Przygotowanie plików konfiguracyjnych

#### Zmienne środowiskowe (frontend)
Utwórz trzy pliki konfiguracyjne:
- `.env.development` - dla środowiska lokalnego
- `.env.staging` - dla środowiska testowego
- `.env.production` - dla środowiska produkcyjnego

Przykład dla frontendu (`.env.production`):
```
NODE_ENV=production
VITE_API_URL=https://api.projekty.uczelnia.pl
VITE_MS_TEAMS_CLIENT_ID=real-client-id
```

#### Zmienne środowiskowe (backend)
Przykład dla backendu (`.env.production`):
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@postgres:5432/student_projects
JWT_SECRET=strong-secret-key
JWT_EXPIRATION=1d
AUTH_MODE=ms-teams
MS_TEAMS_TENANT_ID=real-tenant-id
MS_TEAMS_CLIENT_ID=real-client-id
MS_TEAMS_CLIENT_SECRET=real-client-secret
```

#### Docker Compose
Utwórz trzy pliki Docker Compose:
- `docker-compose.yml` - plik bazowy
- `docker-compose.override.yml` - dla lokalnego środowiska (domyślnie)
- `docker-compose.prod.yml` - dla środowiska produkcyjnego

### 2. Proces budowania aplikacji do wdrożenia

#### Frontend (Vue.js)
```bash
# Przejdź do katalogu frontend
cd frontend

# Zainstaluj zależności
npm install

# Zbuduj aplikację w wersji produkcyjnej
npm run build
```

Rezultat: Zoptymalizowane statyczne pliki w katalogu `dist`

#### Backend (NestJS)
```bash
# Przejdź do katalogu backend
cd backend

# Zainstaluj zależności
npm install

# Zbuduj aplikację w wersji produkcyjnej
npm run build
```

Rezultat: Skompilowane pliki JavaScript w katalogu `dist`

### 3. Wdrożenie na serwer testowy/produkcyjny

#### Przygotowanie serwera
```bash
# Zaloguj się na serwer
ssh user@server

# Utwórz katalog dla aplikacji
mkdir -p /var/www/student-projects

# Zainstaluj Docker i Docker Compose (jeśli jeszcze nie zainstalowano)
apt update
apt install docker.io docker-compose
```

#### Konfiguracja certyfikatu SSL
```bash
# Utwórz katalog na certyfikaty
mkdir -p /etc/ssl/student-projects

# Dla środowiska produkcyjnego:
# 1. Umieść zakupiony certyfikat w katalogu
# 2. Ustaw odpowiednie uprawnienia
```

#### Wdrożenie aplikacji

Metoda 1: Przy użyciu systemu CI/CD (np. GitHub Actions)
- Utwórz plik `.github/workflows/deploy.yml` w repozytorium
- Skonfiguruj automatyczne wdrażanie po złączeniu zmian do gałęzi `main`

Metoda 2: Ręczne wdrożenie
```bash
# Na serwerze, w katalogu aplikacji
cd /var/www/student-projects

# Sklonuj repozytorium
git clone https://github.com/twoja-organizacja/system-zarzadzania-projektami.git .

# Przełącz na odpowiednią gałąź
git checkout main

# Umieść pliki konfiguracyjne produkcyjne
cp path/to/configs/.env.production frontend/.env
cp path/to/configs/.env.production backend/.env

# Uruchom aplikację w trybie produkcyjnym
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Integracja z MS Teams i Active Directory

#### Rejestracja aplikacji w Azure AD
1. Zaloguj się do [Azure Portal](https://portal.azure.com)
2. Przejdź do "Azure Active Directory" > "App registrations"
3. Kliknij "New registration" i wypełnij formularz:
   - Name: Student Projects Management
   - Supported account types: Accounts in this organizational directory only
   - Redirect URI: https://projekty.uczelnia.pl/auth/callback
4. Zapisz Client ID, Tenant ID i wygeneruj Client Secret
5. Skonfiguruj odpowiednie uprawnienia API (Microsoft Graph, Teams API)

#### Konfiguracja backendu do komunikacji z AD
1. Uzupełnij dane konfiguracyjne w pliku `.env.production`:
   ```
   MS_TEAMS_TENANT_ID=tenant-id-from-azure
   MS_TEAMS_CLIENT_ID=client-id-from-azure
   MS_TEAMS_CLIENT_SECRET=client-secret-from-azure
   ```
2. Zrestartuj kontener backendu, aby zastosować zmiany:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart backend
   ```

### 5. Konfiguracja bazy danych produkcyjnej

#### Utworzenie bazy danych
Baza danych tworzona jest automatycznie przez Docker Compose i inicjalizowana przez Prisma.

#### Migracja danych
```bash
# Wejdź do kontenera backendu
docker-compose exec backend bash

# Wykonaj migracje Prisma
npx prisma migrate deploy

# Opcjonalnie: Wykonaj seed tylko dla podstawowych danych (np. kategorii)
NODE_ENV=production npm run seed:categories
```

### 6. Monitoring i utrzymanie

#### Konfiguracja logowania
1. Skonfiguruj zapisywanie logów do plików:
   ```yaml
   # W docker-compose.prod.yml
   services:
     backend:
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"
   ```

#### Kopie zapasowe
1. Skonfiguruj automatyczne kopie zapasowe bazy danych:
   ```bash
   # Dodaj skrypt do crontab
   echo "0 2 * * * docker exec student-projects-postgres pg_dump -U postgres student_projects > /backups/student_projects_\$(date +\%Y\%m\%d).sql" | crontab -
   ```

#### Monitoring
1. Skonfiguruj podstawowy monitoring przy użyciu Prometheus i Grafana (opcjonalnie)
2. Ustaw powiadomienia email w przypadku awarii

## Lista kontrolna wdrożenia produkcyjnego

- [ ] Kod jest w stabilnej wersji (wszystkie testy przechodzą)
- [ ] Baza danych jest skonfigurowana z silnymi hasłami
- [ ] Środowisko produkcyjne jest izolowane i zabezpieczone
- [ ] Certyfikaty SSL są zaktualizowane i poprawnie skonfigurowane
- [ ] Kopie zapasowe działają i są weryfikowane
- [ ] Monitoring jest skonfigurowany i działa poprawnie
- [ ] Integracja z MS Teams i Active Directory jest przetestowana
- [ ] Zabezpieczenia przeciwko atakom (CSRF, XSS, itp.) są włączone
- [ ] Dokumentacja wdrożeniowa jest zaktualizowana
- [ ] Plan odzyskiwania po awarii jest opracowany i przetestowany

## Dodatek: Przydatne komendy

### Docker
```bash
# Sprawdź status kontenerów
docker-compose ps

# Wyświetl logi backend
docker-compose logs -f backend

# Restart pojedynczego kontenera
docker-compose restart backend

# Zatrzymaj wszystkie kontenery
docker-compose down

# Uruchom w trybie produkcyjnym
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Baza danych
```bash
# Podłącz się do kontenera bazy danych
docker-compose exec postgres psql -U postgres -d student_projects

# Wykonaj kopię zapasową bazy danych
docker-compose exec postgres pg_dump -U postgres student_projects > backup.sql

# Przywróć bazę danych z kopii
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d student_projects
```
