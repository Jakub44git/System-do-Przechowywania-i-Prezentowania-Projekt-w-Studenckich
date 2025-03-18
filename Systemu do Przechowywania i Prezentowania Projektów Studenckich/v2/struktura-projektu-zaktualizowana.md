# Struktura projektu

## Struktura katalogów
```
projekt-studencki/
│
├── frontend/                     # Aplikacja Vue.js
│   ├── public/                   # Statyczne pliki
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/                      # Kod źródłowy frontendu
│   │   ├── assets/               # Zasoby statyczne (obrazy, fonty)
│   │   ├── components/           # Komponenty Vue
│   │   │   ├── common/           # Wspólne komponenty UI
│   │   │   ├── projects/         # Komponenty związane z projektami
│   │   │   ├── users/            # Komponenty związane z użytkownikami
│   │   │   └── admin/            # Komponenty panelu administracyjnego
│   │   │
│   │   ├── views/                # Widoki stron
│   │   ├── router/               # Konfiguracja routingu
│   │   ├── store/                # Store Pinia (zarządzanie stanem)
│   │   ├── services/             # Serwisy komunikacji z API
│   │   ├── utils/                # Funkcje pomocnicze
│   │   ├── App.vue               # Główny komponent
│   │   └── main.js               # Punkt wejścia
│   │
│   ├── .env                      # Zmienne środowiskowe
│   ├── package.json              # Zależności npm
│   ├── vite.config.js            # Konfiguracja Vite
│   └── tailwind.config.js        # Konfiguracja Tailwind CSS
│
├── backend/                      # API NestJS
│   ├── src/                      # Kod źródłowy backendu
│   │   ├── main.ts               # Punkt wejścia
│   │   ├── app.module.ts         # Główny moduł aplikacji
│   │   │
│   │   ├── modules/              # Moduły funkcjonalne
│   │   │   ├── users/            # Moduł użytkowników
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   └── entities/     # Encje bazy danych
│   │   │   │
│   │   │   ├── projects/         # Moduł projektów
│   │   │   │   ├── projects.module.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   └── entities/     # Encje bazy danych
│   │   │   │
│   │   │   ├── categories/       # Moduł kategorii
│   │   │   │   ├── categories.module.ts
│   │   │   │   ├── categories.controller.ts
│   │   │   │   ├── categories.service.ts
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   └── entities/     # Encje bazy danych
│   │   │   │
│   │   │   └── reports/          # Moduł raportów i administracji
│   │   │       ├── reports.module.ts
│   │   │       ├── reports.controller.ts
│   │   │       ├── reports.service.ts
│   │   │       ├── dto/          # Data Transfer Objects
│   │   │       └── entities/     # Encje bazy danych
│   │   │
│   │   ├── common/               # Wspólne elementy
│   │   │   ├── filters/          # Filtry wyjątków HTTP
│   │   │   ├── guards/           # Guardy autoryzacji i ról
│   │   │   ├── interceptors/     # Interceptory transformacji
│   │   │   └── decorators/       # Dekoratory niestandardowe (np. role)
│   │   │
│   │   ├── auth/                 # Moduł autoryzacji MS Teams/AD
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── ms-teams.strategy.ts
│   │   │
│   │   ├── prisma/               # Konfiguracja Prisma
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   │
│   │   └── config/               # Konfiguracje
│   │
│   ├── prisma/                   # Konfiguracja Prisma ORM
│   │   ├── schema.prisma         # Schema bazy danych
│   │   └── migrations/           # Migracje bazy danych
│   │
│   ├── test/                     # Testy
│   │   ├── unit/                 # Testy jednostkowe
│   │   └── integration/          # Testy integracyjne
│   │
│   ├── .env                      # Zmienne środowiskowe
│   └── package.json              # Zależności npm
│
├── docker/                       # Konfiguracja Docker
│   ├── docker-compose.yml        # Główny plik compose
│   ├── docker-compose.dev.yml    # Konfiguracja dla środowiska dev
│   ├── docker-compose.prod.yml   # Konfiguracja dla środowiska produkcyjnego
│   │
│   ├── frontend/                 # Konfiguracja dla frontendu
│   │   ├── Dockerfile            # Definicja obrazu dla Vue.js
│   │   └── nginx.conf            # Konfiguracja Nginx dla frontendu
│   │
│   ├── backend/                  # Konfiguracja dla backendu
│   │   └── Dockerfile            # Definicja obrazu dla NestJS
│   │
│   ├── database/                 # Konfiguracja dla bazy danych
│   │   ├── Dockerfile            # Definicja obrazu dla PostgreSQL
│   │   └── init.sql              # Skrypt inicjalizacyjny dla bazy
│   │
│   ├── nginx/                    # Konfiguracja dla reverse proxy
│   │   ├── Dockerfile            # Definicja obrazu dla Nginx
│   │   ├── nginx.conf            # Konfiguracja główna Nginx
│   │   └── ssl/                  # Certyfikaty SSL
│   │       └── ssl-setup.md      # Instrukcja konfiguracji SSL
│   │
│   └── scripts/                  # Skrypty pomocnicze
│       ├── backup.sh             # Skrypt do tworzenia kopii zapasowych
│       ├── deploy.sh             # Skrypt wdrożeniowy
│       └── setup-dev.sh          # Skrypt konfiguracji środowiska deweloperskiego
│
├── docs/                         # Dokumentacja
│   ├── README.md                 # Główny plik dokumentacji
│   ├── architecture.md           # Opis architektury systemu
│   ├── security.md               # Dokumentacja bezpieczeństwa
│   │
│   ├── api/                      # Dokumentacja API
│   │   ├── README.md             # Wprowadzenie do API
│   │   ├── users.md              # Dokumentacja API użytkowników
│   │   ├── projects.md           # Dokumentacja API projektów
│   │   └── categories.md         # Dokumentacja API kategorii
│   │
│   ├── user-guide/               # Instrukcja użytkownika
│   │   ├── README.md             # Wprowadzenie dla użytkowników
│   │   ├── student.md            # Instrukcja dla studentów
│   │   ├── teacher.md            # Instrukcja dla nauczycieli
│   │   └── admin.md              # Instrukcja dla administratorów
│   │
│   ├── dev-guide/                # Instrukcja dla developera
│   │   ├── setup.md              # Konfiguracja środowiska
│   │   ├── coding-standards.md   # Standardy kodowania
│   │   └── git-workflow.md       # Workflow Git
│   │
│   └── deployment/               # Instrukcja wdrożenia
│       ├── local.md              # Wdrożenie lokalne
│       ├── production.md         # Wdrożenie produkcyjne
│       └── ssl-setup.md          # Konfiguracja SSL
│
├── scripts/                      # Skrypty globalne projektu
│   ├── setup.sh                  # Konfiguracja początkowa projektu
│   └── seed-data.js              # Inicjalizacja danych testowych
│
└── README.md                     # Główny plik README projektu