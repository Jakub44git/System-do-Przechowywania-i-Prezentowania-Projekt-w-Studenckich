// organize-files.js
// Skrypt Node.js do organizacji plików projektu
// 
// JAK DZIAŁA SKRYPT:
// 1. Szuka komentarza ze ścieżką w pierwszych 3 liniach pliku
//    (np. "// frontend/src/components/Navbar.vue") i na tej podstawie
//    umieszcza plik we właściwym katalogu.
// 2. Jeśli nie znajdzie komentarza, sprawdza czy nazwa pliku zawiera ścieżkę
//    i wtedy używa tej informacji.
// 3. Tworzy automatycznie wszystkie potrzebne katalogi w strukturze projektu.
// 4. Generuje szczegółowy raport błędów gdy nie można określić lokalizacji pliku.
//
// PRZYGOTOWANIE:
// 1. Utwórz katalog "pobrane_pliki" i umieść w nim pliki do organizacji
// 2. Upewnij się, że każdy plik ma komentarz z pełną ścieżką w pierwszych 3 liniach
//    Poprawny format: "// frontend/src/components/Navbar.vue"
//
// URUCHOMIENIE:
// Można go uruchomić poleceniem: node organize-files.js

const fs = require('fs');
const path = require('path');

// Konfiguracja
const DOWNLOADS_DIR = './pobrane_pliki'; // Katalog z pobranymi plikami
const PROJECT_DIR = './projekt-studencki'; // Katalog docelowy projektu

// Upewnij się, że katalogi istnieją
try {
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.error(`❌ Katalog ${DOWNLOADS_DIR} nie istnieje!`);
    console.log('Utwórz ten katalog i umieść w nim pobrane pliki przed uruchomieniem skryptu.');
    process.exit(1);
  }
  
  if (!fs.existsSync(PROJECT_DIR)) {
    fs.mkdirSync(PROJECT_DIR, { recursive: true });
    console.log(`✓ Utworzono główny katalog projektu: ${PROJECT_DIR}`);
  }
} catch (err) {
  console.error('❌ Wystąpił błąd podczas sprawdzania katalogów:', err);
  process.exit(1);
}

// Funkcja do tworzenia katalogów
function createDirectories() {
  // Lista katalogów do utworzenia
  const directories = [
    // Frontend
    'frontend/public',
    'frontend/src/assets',
    'frontend/src/components/layout',
    'frontend/src/components/common',
    'frontend/src/components/projects',
    'frontend/src/components/users',
    'frontend/src/components/admin',
    'frontend/src/views',
    'frontend/src/router',
    'frontend/src/store/modules',
    'frontend/src/services',
    'frontend/src/utils',
    
    // Backend
    'backend/src/modules/users/dto',
    'backend/src/modules/users/entities',
    'backend/src/modules/projects/dto',
    'backend/src/modules/projects/entities',
    'backend/src/modules/categories/dto',
    'backend/src/modules/categories/entities',
    'backend/src/modules/reports/dto',
    'backend/src/modules/reports/entities',
    'backend/src/common/guards',
    'backend/src/common/decorators',
    'backend/src/common/filters',
    'backend/src/common/interceptors',
    'backend/src/common/dto',
    'backend/src/prisma',
    'backend/src/auth',
    'backend/prisma/migrations',
    
    // Docker
    'docker/frontend',
    'docker/backend',
    'docker/database',
    'docker/nginx/ssl',
    'docker/scripts',
    
    // Docs
    'docs/api',
    'docs/user-guide',
    'docs/dev-guide',
    'docs/deployment'
  ];
  
  // Utwórz każdy katalog
  let createdCount = 0;
  for (const dir of directories) {
    const fullPath = path.join(PROJECT_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      createdCount++;
    }
  }
  
  console.log(`✓ Utworzono ${createdCount} katalogów w strukturze projektu`);
}

// Funkcja do odczytania pierwszych linii pliku w poszukiwaniu ścieżki
function findPathInFileComments(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(0, 3); // Sprawdź pierwsze 3 linie
    
    // Funkcja pomocnicza do walidacji ścieżki
    function isValidPath(path) {
      // Sprawdź czy ścieżka zawiera separator ścieżki '/'
      if (!path.includes('/')) return false;
      // Sprawdź czy ścieżka ma poprawną strukturę (min. 2 segmenty)
      const segments = path.split('/');
      return segments.length >= 2 && segments.every(segment => segment.length > 0);
    }
    
    for (const line of lines) {
      // JavaScript/CSS komentarz (//)
      if (line.includes('//')) {
        const pathMatch = line.match(/\/\/\s*([\w\/\.\-]+)(?:\s|$)/);
        if (pathMatch && pathMatch[1] && isValidPath(pathMatch[1])) {
          return pathMatch[1];
        }
      }
      
      // HTML/XML komentarz (<!-- -->)
      if (line.includes('<!--')) {
        const pathMatch = line.match(/<!--\s*([\w\/\.\-]+)(?:\s|-->)/);
        if (pathMatch && pathMatch[1] && isValidPath(pathMatch[1])) {
          return pathMatch[1];
        }
      }
      
      // Python/Bash komentarz (#)
      if (line.includes('#')) {
        const pathMatch = line.match(/#\s*([\w\/\.\-]+)(?:\s|$)/);
        if (pathMatch && pathMatch[1] && isValidPath(pathMatch[1])) {
          return pathMatch[1];
        }
      }
      
      // JavaScript/CSS wieloliniowy komentarz (/* */)
      if (line.includes('/*')) {
        const pathMatch = line.match(/\/\*\s*([\w\/\.\-]+)(?:\s|\*\/)/);
        if (pathMatch && pathMatch[1] && isValidPath(pathMatch[1])) {
          return pathMatch[1];
        }
      }
    }
    
    return null;
  } catch (err) {
    console.error(`❌ Błąd odczytu pliku ${filePath}:`, err);
    return null;
  }
}

// Funkcja do organizacji pliku na podstawie ścieżki docelowej
function organizeFile(sourcePath, targetPath) {
  try {
    // Upewnij się, że ścieżka nie zaczyna się od / (żeby uniknąć wyjścia poza katalog projektu)
    if (targetPath.startsWith('/')) {
      targetPath = targetPath.substring(1);
    }
    
    // Pełna ścieżka docelowa
    const fullTargetPath = path.join(PROJECT_DIR, targetPath);
    
    // Utwórz katalogi docelowe, jeśli nie istnieją
    const targetDir = path.dirname(fullTargetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Kopiuj plik
    fs.copyFileSync(sourcePath, fullTargetPath);
    
    console.log(`✓ Skopiowano: ${path.basename(sourcePath)} -> ${targetPath}`);
    return true;
  } catch (err) {
    console.error(`❌ Błąd podczas kopiowania pliku ${sourcePath}:`, err);
    return false;
  }
}

// Główna funkcja skryptu
function main() {
  console.log('=== Rozpoczynam organizację plików projektu ===');
  console.log(`Pobrane pliki: ${DOWNLOADS_DIR}`);
  console.log(`Katalog projektu: ${PROJECT_DIR}`);
  
  // Tworzenie struktury katalogów
  createDirectories();
  
  // Tablica problemów
  const problems = [];
  
  // Liczniki
  let successCount = 0;
  let pathNotFoundCount = 0;
  let errorCount = 0;
  
  // Pobierz listę plików z katalogu pobranych
  const files = fs.readdirSync(DOWNLOADS_DIR);
  
  // Przetwarzaj każdy plik
  for (const filename of files) {
    const filePath = path.join(DOWNLOADS_DIR, filename);
    
    // Sprawdź czy to plik (nie katalog)
    if (!fs.statSync(filePath).isFile()) {
      continue;
    }
    
    let targetPath = null;
    
    // Spróbuj znaleźć ścieżkę w komentarzach w pliku
    targetPath = findPathInFileComments(filePath);
    
    // Jeśli nie znaleziono w komentarzach, sprawdź czy nazwa pliku zawiera ścieżkę
    if (!targetPath && filename.includes('/')) {
      targetPath = filename;
    }
    
    // Jeśli znaleziono ścieżkę, przenieś plik
    if (targetPath) {
      if (organizeFile(filePath, targetPath)) {
        successCount++;
      } else {
        errorCount++;
        problems.push({
          file: filename,
          reason: 'Błąd podczas przenoszenia pliku'
        });
      }
    } else {
      // Nie znaleziono ścieżki
      pathNotFoundCount++;
      problems.push({
        file: filename,
        reason: 'Nie znaleziono ścieżki docelowej w komentarzach ani w nazwie pliku'
      });
    }
  }
  
  // Wyświetl podsumowanie
  console.log('\n=== Organizacja plików zakończona ===');
  console.log(`Pomyślnie przeniesiono: ${successCount} plików`);
  
  if (problems.length > 0) {
    console.log('\n=== PROBLEMY ===');
    console.log(`Pliki bez znalezionej ścieżki: ${pathNotFoundCount}`);
    console.log(`Pliki z błędami podczas przenoszenia: ${errorCount}`);
    
    console.log('\nLista plików z problemami:');
    problems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.file} - ${problem.reason}`);
    });
    
    console.log('\nWSKAZÓWKI DO ROZWIĄZANIA PROBLEMÓW:');
    console.log('1. Upewnij się, że każdy plik ma komentarz ze ścieżką w pierwszych 3 wierszach');
    console.log('   Poprawny format komentarza to np.: "// frontend/src/components/Navbar.vue"');
    console.log('2. Sprawdź, czy ścieżka w komentarzu zawiera znak "/"');
    console.log('3. Możesz zmienić nazwę pliku na pełną ścieżkę (np. "frontend/src/components/Navbar.vue")');
  }
  
  console.log('\nSprawdź katalog projektu: ' + PROJECT_DIR);
}

// Uruchom skrypt
main();
