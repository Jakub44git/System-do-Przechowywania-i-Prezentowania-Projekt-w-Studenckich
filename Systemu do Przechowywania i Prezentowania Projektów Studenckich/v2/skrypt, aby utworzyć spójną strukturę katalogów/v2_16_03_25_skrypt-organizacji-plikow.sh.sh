#!/bin/bash
# skrypt-organizacji-plikow.sh
#
# JAK DZIAŁA SKRYPT:
# 1. Szuka komentarza ze ścieżką w pierwszych 3 liniach pliku
#    (np. "// frontend/src/components/Navbar.vue") i na tej podstawie
#    umieszcza plik we właściwym katalogu.
# 2. Jeśli nie znajdzie komentarza, sprawdza czy nazwa pliku zawiera ścieżkę
#    i wtedy używa tej informacji.
# 3. Tworzy automatycznie wszystkie potrzebne katalogi w strukturze projektu.
# 4. Generuje szczegółowy raport błędów gdy nie można określić lokalizacji pliku.
#
# PRZYGOTOWANIE:
# 1. Utwórz katalog "pobrane_pliki" i umieść w nim pliki do organizacji
# 2. Upewnij się, że każdy plik ma komentarz z pełną ścieżką w pierwszych 3 liniach
#    Poprawny format: "// frontend/src/components/Navbar.vue"
# 3. Nadaj uprawnienia do wykonania: chmod +x skrypt-organizacji-plikow.sh
#
# URUCHOMIENIE:
# ./skrypt-organizacji-plikow.sh
#
# Skrypt do organizacji plików projektu systemu zarządzania projektami studenckimi
# Automatyzuje proces przenoszenia plików do odpowiedniej struktury katalogów

# Katalog z pobranymi plikami (dostosuj ścieżkę do swoich potrzeb)
DOWNLOADS_DIR="./pobrane_pliki"

# Główny katalog projektu (dostosuj ścieżkę do swoich potrzeb)
PROJECT_DIR="./projekt-studencki"

# Funkcja do znajdowania ścieżki w komentarzach pliku
find_path_in_comments() {
    local file="$1"
    local line1 line2 line3
    
    # Odczytaj pierwsze 3 linie pliku
    line1=$(head -n 1 "$file" 2>/dev/null)
    line2=$(head -n 2 "$file" 2>/dev/null | tail -n 1)
    line3=$(head -n 3 "$file" 2>/dev/null | tail -n 1)
    
    # Funkcja pomocnicza do wyszukiwania ścieżki w linii
    extract_path() {
        local line="$1"
        local path=""
        
        # Sprawdź różne typy komentarzy
        
        # JavaScript/CSS komentarz (//)
        if [[ "$line" == *"//"* ]]; then
            path=$(echo "$line" | grep -o "//[[:space:]]*[[:alnum:]/._-]*" | sed 's/\/\/[[:space:]]*//')
        fi
        
        # Bash/Python komentarz (#)
        if [[ -z "$path" && "$line" == *"#"* ]]; then
            path=$(echo "$line" | grep -o "#[[:space:]]*[[:alnum:]/._-]*" | sed 's/#[[:space:]]*//')
        fi
        
        # HTML komentarz (<!-- -->)
        if [[ -z "$path" && "$line" == *"<!--"* ]]; then
            path=$(echo "$line" | grep -o "<!--[[:space:]]*[[:alnum:]/._-]*" | sed 's/<!--[[:space:]]*//')
        fi
        
        # Tylko zwróć jeśli ścieżka zawiera "/"
        if [[ "$path" == *"/"* ]]; then
            echo "$path"
        fi
    }
    
    # Sprawdź każdą linię
    local path=$(extract_path "$line1")
    if [[ -n "$path" ]]; then
        echo "$path"
        return
    fi
    
    path=$(extract_path "$line2")
    if [[ -n "$path" ]]; then
        echo "$path"
        return
    fi
    
    path=$(extract_path "$line3")
    if [[ -n "$path" ]]; then
        echo "$path"
        return
    fi
    
    # Nie znaleziono ścieżki
    echo ""
}

# Funkcja organizująca pojedynczy plik
organize_file() {
    local source_file="$1"
    local target_path="$2"
    
    # Upewnij się, że ścieżka nie zaczyna się od / (żeby uniknąć wyjścia poza katalog projektu)
    if [[ "$target_path" == /* ]]; then
        target_path="${target_path:1}"
    fi
    
    # Utwórz katalogi docelowe
    local target_dir=$(dirname "${PROJECT_DIR}/${target_path}")
    mkdir -p "$target_dir"
    
    # Kopiuj plik
    cp "$source_file" "${PROJECT_DIR}/${target_path}"
    
    # Sprawdź czy kopiowanie się powiodło
    if [ $? -eq 0 ]; then
        echo "✓ Skopiowano: $(basename "$source_file") -> $target_path"
        return 0
    else
        echo "❌ Błąd podczas kopiowania: $source_file -> $target_path"
        return 1
    fi
}

echo "=== Rozpoczynam organizację plików projektu ==="
echo "Pobrane pliki: $DOWNLOADS_DIR"
echo "Katalog projektu: $PROJECT_DIR"
echo ""

# Upewnij się, że główny katalog projektu istnieje
mkdir -p "$PROJECT_DIR"

# Najpierw utwórz główną strukturę katalogów
mkdir -p "$PROJECT_DIR/frontend/src/components/layout"
mkdir -p "$PROJECT_DIR/frontend/src/components/common"
mkdir -p "$PROJECT_DIR/frontend/src/components/projects"
mkdir -p "$PROJECT_DIR/frontend/src/components/users"
mkdir -p "$PROJECT_DIR/frontend/src/components/admin"
mkdir -p "$PROJECT_DIR/frontend/src/views"
mkdir -p "$PROJECT_DIR/frontend/src/router"
mkdir -p "$PROJECT_DIR/frontend/src/store/modules"
mkdir -p "$PROJECT_DIR/frontend/src/services"
mkdir -p "$PROJECT_DIR/frontend/src/utils"
mkdir -p "$PROJECT_DIR/frontend/public"

mkdir -p "$PROJECT_DIR/backend/src/modules/users/dto"
mkdir -p "$PROJECT_DIR/backend/src/modules/users/entities"
mkdir -p "$PROJECT_DIR/backend/src/modules/projects/dto" 
mkdir -p "$PROJECT_DIR/backend/src/modules/projects/entities"
mkdir -p "$PROJECT_DIR/backend/src/modules/categories/dto"
mkdir -p "$PROJECT_DIR/backend/src/modules/categories/entities"
mkdir -p "$PROJECT_DIR/backend/src/modules/reports/dto"
mkdir -p "$PROJECT_DIR/backend/src/modules/reports/entities"
mkdir -p "$PROJECT_DIR/backend/src/common/guards"
mkdir -p "$PROJECT_DIR/backend/src/common/decorators"
mkdir -p "$PROJECT_DIR/backend/src/common/filters"
mkdir -p "$PROJECT_DIR/backend/src/common/interceptors"
mkdir -p "$PROJECT_DIR/backend/src/common/dto"
mkdir -p "$PROJECT_DIR/backend/src/prisma"
mkdir -p "$PROJECT_DIR/backend/src/auth"
mkdir -p "$PROJECT_DIR/backend/prisma/migrations"

mkdir -p "$PROJECT_DIR/docker/frontend"
mkdir -p "$PROJECT_DIR/docker/backend"
mkdir -p "$PROJECT_DIR/docker/database"
mkdir -p "$PROJECT_DIR/docker/nginx/ssl"
mkdir -p "$PROJECT_DIR/docker/scripts"

mkdir -p "$PROJECT_DIR/docs/api"
mkdir -p "$PROJECT_DIR/docs/user-guide"
mkdir -p "$PROJECT_DIR/docs/dev-guide"
mkdir -p "$PROJECT_DIR/docs/deployment"

echo "✓ Utworzono strukturę katalogów"
echo ""

# Sprawdź, czy katalog z pobranymi plikami istnieje
if [ ! -d "$DOWNLOADS_DIR" ]; then
    echo "⚠ Katalog $DOWNLOADS_DIR nie istnieje!"
    echo "Utwórz ten katalog i umieść w nim pobrane pliki przed uruchomieniem skryptu."
    exit 1
fi

# Przejdź przez każdy plik w katalogu pobranych
echo "Organizowanie plików..."

success_count=0
path_not_found_count=0
file_error_count=0
declare -a problem_files=()
declare -a problem_reasons=()

for file in "$DOWNLOADS_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        
        # Sprawdź, czy nazwa pliku zawiera ścieżkę
        if [[ "$filename" == *"/"* ]]; then
            # Plik ma ścieżkę w nazwie, użyj jej
            organize_file "$file" "$filename"
            if [ $? -eq 0 ]; then
                ((success_count++))
            else
                ((file_error_count++))
                problem_files+=("$filename")
                problem_reasons+=("Błąd podczas przenoszenia pliku")
            fi
        else
            # Sprawdź pierwsze 3 linie pliku w poszukiwaniu komentarza ze ścieżką
            path_from_comment=$(find_path_in_comments "$file")
            
            if [ -n "$path_from_comment" ]; then
                organize_file "$file" "$path_from_comment"
                if [ $? -eq 0 ]; then
                    ((success_count++))
                else
                    ((file_error_count++))
                    problem_files+=("$filename")
                    problem_reasons+=("Błąd podczas przenoszenia pliku")
                fi
            else
                echo "⚠ Nie można określić lokalizacji dla: $filename"
                echo "  Brak komentarza ze ścieżką w pierwszych 3 wierszach pliku"
                ((path_not_found_count++))
                problem_files+=("$filename")
                problem_reasons+=("Brak informacji o ścieżce")
            fi
        fi
    fi
done

echo ""
echo "=== Organizacja plików zakończona ==="
echo "Pomyślnie przeniesiono: $success_count plików"

if [ $path_not_found_count -gt 0 ] || [ $file_error_count -gt 0 ]; then
    echo ""
    echo "=== PODSUMOWANIE PROBLEMÓW ==="
    if [ $path_not_found_count -gt 0 ]; then
        echo "❌ Nie znaleziono ścieżki dla $path_not_found_count plików"
    fi
    if [ $file_error_count -gt 0 ]; then
        echo "❌ Wystąpiły błędy podczas przenoszenia $file_error_count plików"
    fi
    
    echo ""
    echo "Lista plików z problemami:"
    for i in "${!problem_files[@]}"; do
        echo "$((i+1)). ${problem_files[$i]} - ${problem_reasons[$i]}"
    done
    
    echo ""
    echo "WSKAZÓWKI DO ROZWIĄZANIA PROBLEMÓW:"
    echo "1. Upewnij się, że każdy plik ma komentarz ze ścieżką w pierwszych 3 wierszach"
    echo "   Poprawny format komentarza to np.: \"// frontend/src/components/Navbar.vue\""
    echo "2. Sprawdź, czy ścieżka w komentarzu zawiera znak \"/\""
    echo "3. Ręcznie przenieś pliki z problemami zgodnie z listą referencyjną"
fi

echo ""
echo "Sprawdź katalog $PROJECT_DIR, aby zobaczyć strukturę projektu."
echo ""
