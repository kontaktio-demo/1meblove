# Meblove — meble na wymiar · Łódź

Statyczna strona wizerunkowa małej, rodzinnej pracowni **Meblove** z Łodzi.
Bez frameworków, bez bundlera — czysty HTML, CSS i JavaScript.

```
├── index.html                  — strona główna (hero + liczby + realizacje)
├── nasze-meble.html            — katalog mebli z filtrami i materiałami
├── realizacje.html             — portfolio
├── o-nas.html                  — o pracowni, wartości
├── kontakt.html                — dane, formularz, mapa, FAQ
├── polityka-prywatnosci.html   — polityka prywatności (RODO)
├── regulamin.html              — regulamin serwisu
├── style.css                   — pełny design system
├── main.js                     — nawigacja, animacje, cookies, galeria zdjęć
├── assets/
│   ├── logo.svg                — logo Meblove.com.pl (napisowe)
│   └── favicon.svg             — favicon
└── vercel.json                 — konfiguracja Vercel (nagłówki, cache)
```

## Uruchomienie lokalnie

Strona jest w pełni statyczna — wystarczy otworzyć `index.html`
w przeglądarce lub wystawić lokalny serwer:

```bash
python3 -m http.server 5173   # albo: npx serve .
```

Otwórz <http://localhost:5173>.

## Wdrożenie na Vercel

### Opcja A — przez GUI (najprostsza)
1. Zaloguj się na <https://vercel.com> i kliknij **Add New → Project**.
2. Zaimportuj to repozytorium.
3. W kroku *Configure Project*:
   - **Framework Preset:** `Other`
   - **Root Directory:** `.` *(katalog główny repozytorium)*
   - **Build Command:** *(pozostaw puste)*
   - **Output Directory:** *(pozostaw puste)*
4. Kliknij **Deploy**. Gotowe — po chwili zobaczysz publiczny URL.

### Opcja B — z linii poleceń

```bash
npm i -g vercel
vercel           # pierwsza konfiguracja (link / create)
vercel --prod    # wdrożenie produkcyjne
```

`vercel.json` w katalogu głównym repozytorium konfiguruje nagłówki bezpieczeństwa i cache — Vercel odczyta go automatycznie.

## Co zawiera strona

- **Rebranding:** Meblove — meble na wymiar, mała firma z Łodzi, ul. Piotrkowska 137.
- **Logo:** lokalny SVG (`assets/logo.svg`) w nawigacji i stopce, favicon.
- **Zdjęcia:** tłem dla kafli są obrazy z Unsplash, mapowane przez `main.js` na podstawie kolorystyki sekcji (fallback: oryginalne gradienty).
- **Animacje:** scroll-progress bar, fade-up w obserwatorze, hero reveal z rozmyciem, parallax (opt-in), licznik statystyk, micro-interakcje na kartach i portfolio.
- **Cookies:** baner z trzema opcjami (akceptuj wszystkie / tylko niezbędne / dostosuj) + modal z kategoriami (niezbędne, analityczne, marketingowe). Wybór trafia do `localStorage` i można go w każdej chwili zmienić klikając *Ustawienia cookies* w stopce.
- **Strony prawne:** pełna polityka prywatności (RODO) oraz regulamin serwisu.
- **RWD:** breakpointy 1024/768/600 px, mobilny drawer, siatki upraszczane na mniejszych ekranach.
- **Dostępność:** `aria-label`, redukcja animacji przy `prefers-reduced-motion`, focus states.
- **Stopka:** „Strona stworzona przez **[kontaktio.pl](https://kontaktio.pl)**", linki do polityki prywatności, regulaminu i ustawień cookies.

---

Strona stworzona przez [kontaktio.pl](https://kontaktio.pl).
