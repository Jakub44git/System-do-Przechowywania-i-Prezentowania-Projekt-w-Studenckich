# Specyfikacja techniczna projektu

## 1. Technologie

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **CSS Framework**: Tailwind CSS
- **Zarządzanie stanem**: Pinia
- **Routing**: Vue Router

**Uzasadnienie**: Vue.js zapewnia lekkość, elastyczność oraz łatwą krzywą uczenia się. Composition API wprowadzone w Vue 3 umożliwia tworzenie bardziej modułowego i czytelnego kodu. Tailwind CSS pozwala na szybkie tworzenie spójnego i responsywnego interfejsu poprzez komponowanie klas CSS.

### Backend
- **Framework**: Node.js + NestJS
- **ORM**: Prisma
- **API**: RESTful

**Uzasadnienie**: NestJS dostarcza solidną strukturę do budowy skalowalnych aplikacji serwerowych w TypeScript. Wspiera modułową architekturę i dependency injection, co ułatwia organizację kodu. Prisma ORM zapewnia type-safe zapytania i ułatwia migracje bazy danych.

### Baza danych
- **System**: PostgreSQL

**Uzasadnienie**: PostgreSQL to solidna, relacyjna baza danych o otwartym kodzie, która doskonale sprawdza się w aplikacjach z kompleksowym modelem danych, oferując zaawansowane możliwości zapytań i integralność danych.

### Autoryzacja
- **Logowanie wyłącznie przez MS Teams i Active Directory uczelni**
- **Wielopoziomowy system dostępu** (Administrator, Nauczyciel, Student, Gość)
- **Synchronizacja uprawnień** z grupami w Active Directory

**Uzasadnienie**: Integracja z MS Teams i Active Directory uczelni eliminuje potrzebę tworzenia osobnego systemu rejestracji i logowania. Użytkownicy mogą korzystać z tych samych danych uwierzytelniających, których używają na co dzień, co upraszcza dostęp do aplikacji i zwiększa bezpieczeństwo.

### Infrastruktura
- **Hostowanie**: Konfiguracja umożliwiająca zarówno lokalny development jak i wdrożenie na docelowy serwer uczelniany
- **Konteneryzacja**: Docker
- **Zabezpieczenia**: HTTPS, certyfikat SSL
- **Dostępność**: Przez adres WWW

**Uzasadnienie**: Konteneryzacja z Docker zapewnia jednolite środowisko dla rozwoju, testowania i produkcji.