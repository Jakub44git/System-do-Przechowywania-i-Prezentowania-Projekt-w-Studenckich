# Style Guide i standardy kodowania

Ten dokument określa standardy kodowania dla projektu systemu zarządzania projektami studenckimi. Przestrzeganie tych standardów zapewni spójność kodu, ułatwi współpracę zespołową i zmniejszy liczbę błędów.

## 1. Standardy ogólne

### 1.1 Formatowanie kodu

- **Wcięcia**: 2 spacje zamiast tabulacji
- **Maksymalna długość linii**: 100 znaków
- **Końce linii**: LF (Unix)
- **Końcowy znak nowej linii**: wymagany na końcu każdego pliku
- **Usuwanie białych znaków**: brak spacji na końcu linii

### 1.2 Konwencje nazewnictwa

- **Zmienne i funkcje**: camelCase (np. `getUserData`)
- **Klasy i komponenty**: PascalCase (np. `UserProfile`)
- **Stałe**: UPPER_SNAKE_CASE (np. `MAX_FILE_SIZE`)
- **Pliki komponentów**: PascalCase (np. `UserProfile.vue`)
- **Pliki pomocnicze i usługi**: camelCase (np. `authService.ts`)
- **Foldery**: kebab-case (np. `user-profiles`)

### 1.3 Dokumentacja kodu

- Używaj JSDoc/TSDoc dla funkcji i klas
- Opisuj parametry, typy zwracane i wyjątki
- Dodawaj przykłady użycia dla skomplikowanych funkcji
- Komentarze powinny wyjaśniać "dlaczego", a nie "co" (kod powinien być samodokumentujący się)

### 1.4 Zarządzanie importami

- Grupuj importy w następującej kolejności:
  1. Biblioteki zewnętrzne
  2. Importy absolutne z projektu
  3. Importy względne
- Pozostaw pustą linię między każdą grupą importów
- Preferuj importy nazwane zamiast domyślnych

```typescript
// Dobrze
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { ApiService } from '@/services/api';
import { useAuth } from '@/composables/auth';

import { User } from '../types';
import UserAvatar from './UserAvatar.vue';

// Źle
import UserAvatar from './UserAvatar.vue';
import { useAuth } from '@/composables/auth';
import { ref, computed } from 'vue';
import { User } from '../types';
import { useRouter } from 'vue-router';
import { ApiService } from '@/services/api';
```

## 2. Frontend (Vue.js + TypeScript)

### 2.1 Struktura komponentów Vue

- Używaj komponentów Single-File (SFC)
- Stosuj Composition API
- Używaj `<script setup>` dla uproszczenia składni
- Stosuj typ w `<script setup lang="ts">`
- Kolejność sekcji: `<script>`, `<template>`, `<style>`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Typy props
interface Props {
  user: User;
  isAdmin?: boolean;
}

// Deklaracja props z wartościami domyślnymi
const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
});

// Emity
const emit = defineEmits<{
  (e: 'update', id: string): void;
  (e: 'delete', id: string): void;
}>();

// Logika komponentu
// ...
</script>

<template>
  <div class="user-card">
    <!-- Zawartość szablonu -->
  </div>
</template>

<style scoped>
.user-card {
  /* Style CSS */
}
</style>
```

### 2.2 Tailwind CSS

- Preferuj klasy Tailwind CSS zamiast niestandardowego CSS
- Używaj `@apply` w stylach komponentów dla powtarzających się kombinacji klas
- Organizuj klasy Tailwind logicznie:
  1. Układ (flex, grid)
  2. Wymiary (width, height)
  3. Spacing (margin, padding)
  4. Typography (text, font)
  5. Kolorystyka (bg, text)
  6. Pozostałe

```html
<!-- Dobrze -->
<div class="flex items-center p-4 mb-2 text-sm text-gray-800 bg-white rounded shadow">
```

### 2.3 Pinia (Zarządzanie stanem)

- Twórz oddzielne magazyny dla różnych domen (users, projects, categories)
- Używaj opcji `defineStore` z typowaniem TypeScript
- Grupuj powiązane akcje i gettery
- Unikaj mutacji stanu poza akcjami

```typescript
// stores/projects.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Project } from '@/types';

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const approvedProjects = computed(() => 
    projects.value.filter(p => p.status === 'APPROVED')
  );
  
  // Actions
  async function fetchProjects() {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Implementacja
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    // Exportujemy state, getters i actions
    projects,
    isLoading,
    error,
    approvedProjects,
    fetchProjects
  };
});
```

## 3. Backend (NestJS + TypeScript)

### 3.1 Struktura modułów NestJS

- Trzymaj się struktury folderów NestJS
- Każdy moduł powinien mieć własny katalog
- Stosuj podkatalogi dla DTO, encji i interfejsów
- Wszystkie usługi, kontrolery i moduły dekoruj adnotacjami

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### 3.2 Klasy DTO

- Używaj klas zamiast interfejsów dla DTO
- Stosuj walidatory class-validator
- Implementuj klasy DTO dla żądań i odpowiedzi
- Używaj dokumentacji dla Swagger

```typescript
// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email użytkownika',
    example: 'jan.kowalski@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Imię użytkownika',
    example: 'Jan',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Nazwisko użytkownika',
    example: 'Kowalski',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
```

### 3.3 Kontrolery

- Grupuj powiązane endpointy w jednym kontrolerze
- Używaj prefiksów tras i tagów Swagger 
- Zapewnij odpowiednie kody statusów HTTP
- Używaj strażników (Guards) do autoryzacji

```typescript
// projects.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT, Role.TEACHER)
  @ApiOperation({ summary: 'Utwórz nowy projekt' })
  @ApiResponse({ status: 201, description: 'Projekt utworzony', type: Project })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(createProjectDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobierz projekt po ID' })
  @ApiResponse({ status: 200, description: 'Projekt znaleziony', type: Project })
  @ApiResponse({ status: 404, description: 'Projekt nie znaleziony' })
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }
}
```

### 3.4 Usługi (Services)

- Implementuj logikę biznesową w usługach, nie w kontrolerach
- Obsługuj błędy i rzucaj odpowiednie wyjątki NestJS
- Używaj wstrzykiwania zależności (dependency injection)
- Implementuj interfejsy dla usług, gdy to możliwe

```typescript
// projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        status: 'NEW',
      },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }
}
```

## 4. Testowanie

### 4.1 Testy jednostkowe

- Testuj każdą funkcję i komponent
- Używaj Jest dla both frontend i backend
- Testuj happy path i przypadki brzegowe
- Mockuj zewnętrzne zależności

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### 4.2 Testy komponentów Vue

```typescript
// ProjectCard.spec.ts
import { mount } from '@vue/test-utils';
import ProjectCard from './ProjectCard.vue';

describe('ProjectCard.vue', () => {
  const mockProject = {
    id: '1',
    title: 'Test Project',
    description: 'This is a test',
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    author: {
      id: '1',
      firstName: 'Jan',
      lastName: 'Kowalski',
    },
  };

  it('renders project title and description', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject,
      },
    });

    expect(wrapper.text()).toContain('Test Project');
    expect(wrapper.text()).toContain('This is a test');
  });

  it('emits update event when edit button is clicked', async () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject,
        canEdit: true,
      },
    });

    await wrapper.find('[data-test="edit-button"]').trigger('click');
    
    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0]).toEqual(['1']);
  });
});
```

## 5. Git Workflow

### 5.1 Konwencje branch'y

- `main` - branch produkcyjny, zawsze stabilny
- `develop` - branch deweloperski, zawiera najnowsze zatwierdzone funkcje
- `feature/nazwa-funkcji` - branche dla nowych funkcji
- `bugfix/nazwa-błędu` - branche dla poprawek błędów
- `release/x.y.z` - branche dla wydań

### 5.2 Konwencja commitów

Używaj [Conventional Commits](https://www.conventionalcommits.org/):

```
<typ>[opcjonalny scope]: <opis>

[opcjonalne body]

[opcjonalny footer]
```

Typy:
- `feat:` - nowa funkcjonalność
- `fix:` - poprawka błędu
- `docs:` - dokumentacja
- `style:` - formatowanie, brakujące średniki itp.
- `refactor:` - refaktoryzacja kodu
- `test:` - dodanie lub poprawa testów
- `chore:` - inne zmiany (konfiguracja, narzędzia, itd.)

Przykłady:

```
feat(auth): dodanie logowania przez MS Teams
fix(projects): naprawienie błędu w filtracji projektów
docs: aktualizacja README
```

### 5.3 Code Review

- Każda zmiana powinna być przeglądana przed merge'm
- Wykorzystuj Pull Requesty
- Code review powinno koncentrować się na:
  - Poprawność funkcjonalna
  - Jakość kodu
  - Przestrzeganie standardów kodowania
  - Pokrycie testami

## 6. Zarządzanie wersjami

Używaj [Semantic Versioning](https://semver.org/):

- **X.y.z** - wersja główna (breaking changes)
- **x.Y.z** - wersja minor (nowe funkcje, kompatybilne wstecz)
- **x.y.Z** - wersja patch (poprawki błędów)

## 7. Dokumentacja

- Dokumentuj wszystkie API w Swagger
- Utrzymuj aktualne README projektu
- Dokumentuj wszystkie modele danych
- Zapisuj decyzje architektoniczne i ich uzasadnienia

## 8. Wydajność i optymalizacja

- Używaj lazy-loading dla komponentów Vue.js
- Optymalizuj zapytania do bazy danych
- Implementuj caching gdzie to możliwe
- Testuj wydajność ładowania strony

Te standardy kodowania powinny być stosowane konsekwentnie przez cały zespół. Mogą być aktualizowane w miarę rozwoju projektu i potrzeb zespołu.
