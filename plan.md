# Piano di Implementazione: PWA Spese Casa

## Contesto

L'utente desidera creare una Progressive Web App (PWA) per tracciare spese domestiche usando principalmente l'input vocale in italiano. L'app deve permettere di dettare frasi come "Ho speso 45 euro per trasporti il giorno 16 gennaio 2026" e automaticamente estrarre importo, categoria, data e descrizione usando **parsing locale JavaScript** (nessuna API AI a pagamento richiesta).

L'app è destinata all'uso multi-utente (famiglia) con dati condivisi e visibili a tutti gli utenti autorizzati. I dati vengono salvati su un repository GitHub per garantire persistenza, sincronizzazione e accessibilità da qualsiasi dispositivo. Il progetto parte da zero (directory vuota) e sarà ospitato su GitHub Pages.

**Importante**: La soluzione utilizza pattern matching e regex JavaScript per parsing locale, evitando costi di API esterne e funzionando completamente offline.

### Vantaggi Parser Locale vs API AI

**✅ Vantaggi Parser JavaScript Locale**:
1. **100% Gratuito**: Nessun costo API, nessuna subscription richiesta
2. **Sempre Offline**: Funziona senza connessione internet
3. **Privacy Totale**: I dati non lasciano mai il dispositivo
4. **Latenza Zero**: Parsing istantaneo (< 10ms vs 2-5s API)
5. **Nessun Rate Limit**: Parsing illimitato
6. **Setup Semplificato**: Solo GitHub PAT necessario (no Claude API key)

**⚠️ Trade-offs**:
1. **Meno Flessibile**: Richiede frasi più strutturate con keywords chiare
2. **Manutenzione**: Potrebbe richiedere aggiornamento keywords per nuovi pattern
3. **Confidence Lower**: Parsing meno "intelligente" rispetto a LLM

**🎯 Soluzione Ottimale per Questo Use Case**:
- Le spese hanno struttura prevedibile (importo + categoria + data)
- 13 categorie fisse con keywords ben definite
- Input vocale produce frasi consistenti
- Edit modal permette sempre correzione manuale
- Trade-off convenienza/accuratezza favorevole per uso domestico/familiare

## Decisioni Architetturali Chiave

### Stack Tecnologico
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite con plugin PWA
- **Styling**: Tailwind CSS (mobile-first)
- **State Management**: Zustand (lightweight)
- **Persistenza**: GitHub API via Octokit + IndexedDB (offline)
- **Speech Recognition**: Web Speech API (italiano)
- **Parsing**: JavaScript locale con Regex e NLP pattern matching (100% gratuito, offline-first)
- **Export**: SheetJS (xlsx)
- **Date Handling**: date-fns con locale italiana
- **Deployment**: GitHub Actions → GitHub Pages

### Configurazioni Utente Scelte
1. **API Keys**: Solo GitHub PAT (nessuna API key AI necessaria - parsing locale)
2. **Offline Support**: Completo - IndexedDB per persistenza locale, sync automatico al ritorno online
3. **Storage GitHub**: File JSON singolo condiviso (`expenses.json`) con conflict resolution via optimistic locking
4. **Features Extra**: Grafici e statistiche per analisi spese (oltre alle funzionalità base)
5. **Parsing Method**: Parser locale JavaScript (gratuito, funziona sempre offline)

### Struttura Repository GitHub

**Repository dati**: `[username]/spese-casa-data` (privato)
- File: `expenses.json`
- Formato:
```json
{
  "expenses": [
    {
      "id": "uuid-v4",
      "amount": 45.00,
      "category": "Trasporti e viaggi",
      "date": "2026-01-16",
      "description": "Trasporti",
      "createdAt": "2026-01-16T10:30:00Z",
      "createdBy": "username",
      "updatedAt": "2026-01-16T10:30:00Z"
    }
  ],
  "version": 1
}
```

**Repository app**: `[username]/spese-casa` (pubblico)
- Deploy su GitHub Pages
- URL: `https://[username].github.io/spese-casa`

### Categorie di Spesa (13 totali)
Università, Vitto, Abbigliamento, Casa, Auto, Trasporti e viaggi, Bollette acqua, Bollette Luce, Bollette Maddalena, Tasse, Sanità, Varie, Pulizie

Ogni categoria avrà colore distintivo e icona emoji per facile identificazione visiva.

### Formati Frasi Consigliati per Parser Locale

Per migliori risultati con il parser locale, gli utenti dovrebbero usare frasi con questa struttura:

**Template base**: "Ho speso [IMPORTO] euro per [KEYWORD CATEGORIA] [TEMPO]"

**Esempi ottimali**:
- ✅ "Ho speso 45 euro per trasporti oggi"
- ✅ "Bolletta della luce 80 euro oggi"
- ✅ "Pagato 36.45 euro per supermercato ieri"
- ✅ "120 euro benzina il giorno 16 gennaio 2026"
- ✅ "€65,50 spesa alimentari ieri"

**Keywords per categoria** (esempi principali):
- Vitto: `spesa`, `supermercato`, `alimentari`, `ristorante`, `cibo`
- Trasporti: `trasporti`, `treno`, `bus`, `taxi`, `viaggio`, `biglietto`
- Bollette Luce: `bolletta luce`, `luce`, `elettricità`
- Auto: `benzina`, `auto`, `meccanico`, `parcheggio`
- Casa: `affitto`, `casa`, `mutuo`, `arredamento`

L'app includerà una guida in-app con lista completa keywords e esempi.

## Struttura del Progetto

```
spese-casa/
├── public/
│   ├── manifest.json              # PWA manifest (nome, icone, theme)
│   ├── icons/                     # App icons per PWA
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── maskable-icon-512.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── App.tsx                       # Root component con routing
│   │   ├── VoiceInput/
│   │   │   ├── VoiceInput.tsx            # Pulsante microfono verde
│   │   │   ├── ManualInput.tsx           # Fallback testo manuale
│   │   │   └── RecordingIndicator.tsx    # Animazione registrazione
│   │   ├── ExpenseForm/
│   │   │   ├── ExpenseEditModal.tsx      # Modal modifica pre-salvataggio
│   │   │   ├── CategorySelect.tsx        # Dropdown 13 categorie
│   │   │   ├── DatePicker.tsx            # Selezione data con quick actions
│   │   │   └── AmountInput.tsx           # Input importo con validazione
│   │   ├── ExpenseList/
│   │   │   ├── ExpenseList.tsx           # Vista lista principale
│   │   │   ├── ExpenseGroup.tsx          # Gruppo mensile
│   │   │   ├── ExpenseItem.tsx           # Singola spesa con badge
│   │   │   ├── CategoryBadge.tsx         # Badge colorato categoria
│   │   │   ├── MonthlyTotal.tsx          # Totale e conteggio mensile
│   │   │   └── DeleteButton.tsx          # Eliminazione con conferma
│   │   ├── Charts/
│   │   │   ├── SpendingChart.tsx         # Grafico a torta per categoria
│   │   │   ├── MonthlyTrend.tsx          # Grafico trend mensile
│   │   │   └── CategoryComparison.tsx    # Confronto tra mesi
│   │   ├── Export/
│   │   │   ├── ExportButton.tsx          # Export Excel
│   │   │   └── MonthSelector.tsx         # Filtro per mese
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx             # Input PAT e Claude API key
│   │   │   ├── AuthContext.tsx           # Context per auth state
│   │   │   └── ProtectedRoute.tsx        # Route guard
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── SyncStatus.tsx            # Indicatore sync offline
│   ├── hooks/
│   │   ├── useVoiceRecognition.ts        # Wrapper Web Speech API
│   │   ├── useExpenseParser.ts           # Parsing locale JavaScript
│   │   ├── useGitHubStorage.ts           # CRUD operations GitHub
│   │   ├── useExpenses.ts                # Gestione stato spese
│   │   └── useOfflineSync.ts             # Queue sincronizzazione offline
│   ├── services/
│   │   ├── expenseParser.ts              # Parser locale JavaScript (regex + NLP)
│   │   ├── githubStorage.ts              # Storage layer GitHub + Octokit
│   │   ├── speechRecognition.ts          # Riconoscimento vocale
│   │   ├── excelExport.ts                # Generazione file Excel
│   │   ├── categoryMapper.ts             # Logica categorie e fuzzy matching
│   │   └── offlineQueue.ts               # Gestione queue operazioni offline
│   ├── store/
│   │   ├── expenseStore.ts               # Zustand store spese
│   │   ├── authStore.ts                  # State autenticazione
│   │   └── uiStore.ts                    # State UI (loading, errori)
│   ├── types/
│   │   ├── expense.ts                    # Interface Expense
│   │   ├── category.ts                   # Enum 13 categorie
│   │   ├── claudeResponse.ts             # Type parsing response
│   │   └── github.ts                     # Types GitHub API
│   ├── utils/
│   │   ├── dateParser.ts                 # Parse "oggi", "ieri"
│   │   ├── formatters.ts                 # Format euro e date italiane
│   │   ├── validators.ts                 # Validazione input
│   │   ├── constants.ts                  # Categorie, colori, icone
│   │   └── tokenEncryption.ts            # Crittografia token localStorage
│   ├── styles/
│   │   └── globals.css                   # Import Tailwind
│   ├── sw.ts                             # Service Worker personalizzato
│   ├── main.tsx                          # Entry point React
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml                    # CI/CD GitHub Actions
├── .env.example                          # Template variabili ambiente
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                        # Config Vite + PWA plugin
├── tailwind.config.js
├── postcss.config.js
└── README.md                             # Guida setup e uso (italiano)
```

## Flusso Dati Principale

### Da Voce a Spesa Salvata

```
1. USER INPUT
   ↓
   [Pulsante microfono verde] → Web Speech API (lang: 'it-IT')
   ↓
   Transcript: "Ho speso 45 euro per trasporti il giorno 16 gennaio 2026"
   ↓ (oppure fallback input manuale se browser non supporta)

2. PARSING LOCALE
   ↓
   JavaScript expenseParser.parseExpenseText()
   - Regex per estrarre numeri (importi)
   - Pattern matching per categorie (keywords)
   - Date parsing: "oggi", "ieri", date specifiche
   - Fuzzy matching per categorie simili
   ↓
   Output: {amount: 45, category: "Trasporti e viaggi", date: "2026-01-16", description: "Trasporti", confidence: 0.9}

3. EDIT MODAL
   ↓
   Mostra dati parsed in form editabile:
   - Amount input (validazione > 0)
   - Category dropdown (13 opzioni)
   - Date picker (con quick actions: Oggi, Ieri)
   - Description textarea
   ↓
   User conferma o modifica

4. SAVE TO GITHUB
   ↓
   A. Se ONLINE:
      - Fetch current expenses.json + SHA
      - Append nuovo expense con UUID
      - Increment version
      - Commit changes (retry con exponential backoff se 409 conflict)
   ↓
   B. Se OFFLINE:
      - Salva in IndexedDB pending operations queue
      - Mostra indicatore "Pending sync"
   ↓

5. UPDATE LOCAL STATE
   ↓
   - Update Zustand expenseStore
   - Update IndexedDB cache
   - Trigger re-render ExpenseList

6. DISPLAY
   ↓
   ExpenseList component:
   - Group by month (date-fns)
   - Sort by date desc
   - Show colored badge categoria
   - Display monthly total
   - Delete button per expense
```

### Sync Offline → Online

```
OFFLINE MODE:
- User aggiunge spese → IndexedDB pending queue
- UI mostra badge "2 pending"

BACK ONLINE:
- useOfflineSync detecta connessione
- Loop pending operations:
  • Fetch latest expenses.json
  • Merge new expenses (UUID dedup)
  • Commit to GitHub
  • Remove from queue on success
- UI mostra "Synced ✓"
```

## File Critici per Implementazione

### 1. `src/services/githubStorage.ts` ⭐⭐⭐⭐⭐
**Responsabilità**: Core storage layer con GitHub API
- Inizializzazione repo `spese-casa-data`
- CRUD operations su `expenses.json`
- Conflict resolution con optimistic locking (SHA-based)
- Retry logic con exponential backoff
- Multi-user concurrent edit handling

**Tecnologie**: Octokit, TypeScript

### 2. `src/services/expenseParser.ts` ⭐⭐⭐⭐⭐
**Responsabilità**: Parsing locale intelligente frasi italiane
- Regex per estrazione importi (€, euro, decimali con punto/virgola)
- Pattern matching per 13 categorie con keywords/sinonimi
- Gestione espressioni temporali ("oggi", "ieri", date specifiche italiane)
- Fuzzy matching per categorie simili (es: "supermercato"→"Vitto")
- Confidence scoring basato su match quality
- Completamente offline, nessuna API esterna

**Tecnologie**: TypeScript, date-fns, Regex

### 3. `src/hooks/useVoiceRecognition.ts` ⭐⭐⭐⭐
**Responsabilità**: Riconoscimento vocale italiano
- Wrapper Web Speech API (`SpeechRecognition`)
- Configurazione lingua: `it-IT`
- Browser compatibility detection
- Recording state management (start, stop, abort)
- Error handling per browser non supportati

**Tecnologie**: Web Speech API, React hooks

### 4. `src/components/ExpenseForm/ExpenseEditModal.tsx` ⭐⭐⭐⭐⭐
**Responsabilità**: Orchestrazione flusso principale
- Modal modifica pre-salvataggio
- Form validation (amount > 0, valid date, etc.)
- Integration: voice → parse → edit → save
- User feedback (loading, success, errors)
- Trigger GitHub save e local state update

**Tecnologie**: React, Zustand, hooks custom

### 5. `vite.config.ts` ⭐⭐⭐⭐
**Responsabilità**: Configurazione PWA e deployment
- Vite PWA plugin setup
- Service worker generation
- Manifest generation (nome app, icone, theme color)
- Caching strategies (NetworkFirst per API, CacheFirst per assets)
- GitHub Pages base URL configuration

**Tecnologie**: Vite, vite-plugin-pwa

### 6. `src/hooks/useOfflineSync.ts` ⭐⭐⭐⭐
**Responsabilità**: Supporto offline completo
- IndexedDB per pending operations queue
- Detection stato online/offline (`navigator.onLine`)
- Auto-sync quando torna connessione
- Conflict resolution per offline changes
- UI status indicators

**Tecnologie**: IndexedDB, React hooks

### 7. `src/components/ExpenseList/ExpenseList.tsx` ⭐⭐⭐
**Responsabilità**: Vista principale spese
- Grouping per mese (date-fns `startOfMonth`)
- Sorting per data (desc)
- Rendering ExpenseGroup e ExpenseItem components
- Filter by category/date range
- Monthly totals calculation
- Integration con delete e export

**Tecnologie**: React, date-fns, Tailwind

### 8. `src/services/excelExport.ts` ⭐⭐⭐
**Responsabilità**: Export Excel
- Generazione file .xlsx con SheetJS
- Formatting italiano (date dd/MM/yyyy, euro €)
- Export singolo mese o tutti i dati
- Custom headers e column widths
- File download trigger

**Tecnologie**: SheetJS (xlsx)

### 9. `.github/workflows/deploy.yml` ⭐⭐⭐
**Responsabilità**: CI/CD automatico
- Build Vite su push a main
- Deploy su GitHub Pages
- Environment variables configuration
- Artifact upload per debugging

**Tecnologie**: GitHub Actions

### 10. `src/components/Charts/SpendingChart.tsx` ⭐⭐⭐
**Responsabilità**: Visualizzazione grafici
- Chart.js o Recharts per grafici React
- Grafico a torta per spese per categoria
- Trend mensile (line chart)
- Responsive design per mobile
- Color-coded per categorie

**Tecnologie**: Chart.js o Recharts, React

## Piano di Implementazione per Fasi

### **Fase 1: Setup Progetto e Infrastruttura Base** (Giorni 1-2)

**Obiettivo**: Progetto Vite configurato con PWA, Tailwind, TypeScript

**Task**:
1. Initialize Vite React TypeScript project
   ```bash
   npm create vite@latest spese-casa -- --template react-ts
   cd spese-casa
   ```

2. Install dependencies
   ```bash
   npm install zustand octokit @anthropic-ai/sdk date-fns xlsx
   npm install -D tailwindcss postcss autoprefixer vite-plugin-pwa
   npm install -D @types/node
   ```

3. Configure Tailwind CSS
   ```bash
   npx tailwindcss init -p
   ```
   - Update `tailwind.config.js` with content paths
   - Create `src/styles/globals.css` with Tailwind imports

4. Setup PWA configuration in `vite.config.ts`
   - Import `vite-plugin-pwa`
   - Configure manifest (name, icons, theme color green)
   - Setup service worker with NetworkFirst strategy per API, CacheFirst per assets

5. Create app icons (192x192, 512x512) - green microphone theme

6. Setup Git repository
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vite + React + TypeScript + PWA setup"
   ```

7. Create GitHub repository `spese-casa` (pubblico)

8. Setup initial folder structure (componenti vuoti, file di servizio stub)

**Deliverable**: `npm run dev` funziona, PWA manifest generato, progetto su GitHub

---

### **Fase 2: Sistema di Autenticazione** (Giorni 3-4)

**Obiettivo**: Login con GitHub PAT e Claude API key

**File da creare**:
- `src/store/authStore.ts`
- `src/components/Auth/LoginForm.tsx`
- `src/components/Auth/AuthContext.tsx`
- `src/components/Auth/ProtectedRoute.tsx`
- `src/utils/tokenEncryption.ts`
- `.env.example`

**Implementazione**:

1. **authStore (Zustand)**
   ```typescript
   interface AuthState {
     githubToken: string | null;
     githubUser: { username: string; email: string } | null;
     isAuthenticated: boolean;
     login: (githubToken: string) => Promise<void>;
     logout: () => void;
   }
   ```
   - Validazione token con GitHub API `/user`
   - Storage encrypted in localStorage
   - Auto-load token on app start

2. **LoginForm Component**
   - Single password input: GitHub PAT
   - Link a GitHub token generation page
   - Istruzioni in italiano su come generare token
   - Loading state durante validazione
   - Error messages in italiano

3. **Token Encryption**
   - Usa `crypto-js` per AES encryption
   - Master password (optional): user-provided o auto-generated
   - Clear from memory on logout

4. **ProtectedRoute**
   - Redirect a `/login` se non autenticato
   - Store redirect path per post-login navigation

5. **Validation Flow**
   - Test GitHub token: `GET /user`
   - Store username e email
   - On success: navigate to main app

**Deliverable**: Sistema login funzionante, token persistiti encrypted, route protette

---

### **Fase 3: GitHub Storage Layer** (Giorni 5-6)

**Obiettivo**: CRUD operations su GitHub con conflict resolution

**File da creare**:
- `src/services/githubStorage.ts`
- `src/hooks/useGitHubStorage.ts`
- `src/types/expense.ts`
- `src/types/github.ts`

**Implementazione**:

1. **GitHubStorage Class**
   ```typescript
   class GitHubStorage {
     private octokit: Octokit;
     private owner: string;
     private repo: string = 'spese-casa-data';
     private path: string = 'expenses.json';

     async initializeRepo(): Promise<void>
     async getExpenses(): Promise<{data: ExpensesData, sha: string}>
     async addExpense(expense: Expense): Promise<void>
     async deleteExpense(expenseId: string): Promise<void>
     async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void>
   }
   ```

2. **Initialize Repo Flow**
   - Check if `spese-casa-data` exists
   - Create if not exists (private repo)
   - Create initial `expenses.json` with empty array

3. **Conflict Resolution**
   - Optimistic locking: store SHA on fetch
   - On commit: verify SHA match
   - If 409 conflict:
     * Fetch latest expenses.json
     * Merge changes (append for add, filter for delete)
     * UUID deduplication
     * Retry commit with new SHA
   - Exponential backoff: 1s, 2s, 4s

4. **useGitHubStorage Hook**
   - React hook wrapper per GitHubStorage
   - Loading states
   - Error handling
   - Auto-initialize on mount

5. **Types**
   ```typescript
   interface Expense {
     id: string; // UUID v4
     amount: number;
     category: Category;
     date: string; // ISO format
     description: string;
     createdAt: string;
     createdBy: string;
     updatedAt: string;
   }

   type Category = 'Università' | 'Vitto' | ... // 13 totali
   ```

**Testing**:
- Manual testing: create repo, add expense, verify commit su GitHub
- Test concurrent edits: due tab, aggiungi spesa simultaneamente
- Test conflict resolution: verify merge corretto

**Deliverable**: Storage layer funzionante, test passati, spese persistite su GitHub

---

### **Fase 4: Riconoscimento Vocale** (Giorni 7-8)

**Obiettivo**: Input vocale italiano con fallback manuale

**File da creare**:
- `src/services/speechRecognition.ts`
- `src/hooks/useVoiceRecognition.ts`
- `src/components/VoiceInput/VoiceInput.tsx`
- `src/components/VoiceInput/RecordingIndicator.tsx`
- `src/components/VoiceInput/ManualInput.tsx`

**Implementazione**:

1. **speechRecognition.ts**
   ```typescript
   export class SpeechRecognitionService {
     private recognition: SpeechRecognition | null;

     constructor() {
       const SpeechRecognition = window.SpeechRecognition ||
                                  window.webkitSpeechRecognition;
       if (SpeechRecognition) {
         this.recognition = new SpeechRecognition();
         this.recognition.lang = 'it-IT';
         this.recognition.interimResults = false;
         this.recognition.maxAlternatives = 1;
       }
     }

     isSupported(): boolean
     start(onResult: (transcript: string) => void, onError: (error: string) => void): void
     stop(): void
   }
   ```

2. **useVoiceRecognition Hook**
   ```typescript
   interface UseVoiceRecognitionReturn {
     isSupported: boolean;
     isRecording: boolean;
     transcript: string | null;
     error: string | null;
     startRecording: () => void;
     stopRecording: () => void;
     resetTranscript: () => void;
   }
   ```
   - State management per recording
   - Error handling: not supported, permission denied, no speech detected
   - Cleanup on unmount

3. **VoiceInput Component**
   - Pulsante grande circolare verde con icona microfono
   - On click: toggle recording
   - Animazione durante registrazione (pulsating effect)
   - Transcript preview sotto il pulsante
   - Automatic trigger parse on stop

4. **RecordingIndicator**
   - Red recording dot animation
   - Waveform animation (optional)
   - Timer display

5. **ManualInput Component**
   - Textarea per input manuale
   - Mostra sempre come fallback
   - Stesso flow di parsing del voice input
   - Placeholder: "Scrivi la tua spesa (es: Ho speso 45 euro per trasporti oggi)"

6. **Browser Compatibility**
   - Detect support on component mount
   - Show warning banner for Firefox/unsupported browsers
   - Recommend Chrome/Edge
   - Manual input always available

**Testing**:
- Chrome/Edge desktop: full functionality
- Chrome Android: test su dispositivo reale
- Safari iOS: test limited support
- Firefox: verify fallback funziona

**Deliverable**: Voice input funzionante su browser supportati, fallback robusto

---

### **Fase 5: Parser Locale JavaScript** (Giorni 9-10)

**Obiettivo**: Extract structured data da frasi italiane usando pattern matching locale

**File da creare**:
- `src/services/expenseParser.ts`
- `src/hooks/useExpenseParser.ts`
- `src/utils/dateParser.ts`
- `src/utils/constants.ts` (categorie)
- `src/types/parsedExpense.ts`

**Implementazione**:

1. **expenseParser.ts** - Core parsing logic
   ```typescript
   interface ParsedExpense {
     amount: number;
     category: string;
     date: string; // ISO format
     description: string;
     confidence: number; // 0-1
   }

   export class ExpenseParser {
     private categoryKeywords = {
       'Università': ['università', 'uni', 'corso', 'libri universitari', 'tasse universitarie'],
       'Vitto': ['supermercato', 'spesa', 'alimentari', 'cibo', 'ristorante', 'pizzeria', 'pranzo', 'cena'],
       'Abbigliamento': ['vestiti', 'scarpe', 'abbigliamento', 'negozio', 'abbigliamento'],
       'Casa': ['affitto', 'casa', 'mutuo', 'arredamento', 'mobili', 'ikea'],
       'Auto': ['benzina', 'auto', 'macchina', 'parcheggio', 'meccanico', 'assicurazione auto', 'bollo'],
       'Trasporti e viaggi': ['trasporti', 'viaggio', 'treno', 'aereo', 'bus', 'taxi', 'biglietto', 'abbonamento'],
       'Bollette acqua': ['bolletta acqua', 'acqua', 'bolletta idrica'],
       'Bollette Luce': ['bolletta luce', 'luce', 'elettricità', 'enel', 'energia elettrica'],
       'Bollette Maddalena': ['bolletta maddalena', 'maddalena'],
       'Tasse': ['tasse', 'tassa', 'imu', 'tari', 'imposte'],
       'Sanità': ['medico', 'farmacia', 'medicine', 'dottore', 'ospedale', 'salute', 'analisi'],
       'Varie': ['varie', 'altro', 'vari'],
       'Pulizie': ['pulizie', 'detersivi', 'prodotti pulizia', 'detergenti']
     };

     parseExpenseText(text: string, currentDate: Date = new Date()): ParsedExpense {
       const normalized = text.toLowerCase().trim();

       // Extract amount
       const amount = this.extractAmount(normalized);

       // Extract category
       const category = this.extractCategory(normalized);

       // Extract date
       const date = this.extractDate(normalized, currentDate);

       // Generate description
       const description = this.generateDescription(text, category);

       // Calculate confidence
       const confidence = this.calculateConfidence(amount, category, date);

       return { amount, category, date, description, confidence };
     }

     private extractAmount(text: string): number {
       // Regex patterns per importi italiani
       const patterns = [
         /(\d+[.,]\d{1,2})\s*(?:euro|€)/i,  // "45.50 euro" o "45,50 €"
         /(?:euro|€)\s*(\d+[.,]\d{1,2})/i,  // "euro 45.50"
         /(\d+)\s*euro/i,                    // "45 euro"
         /(\d+[.,]\d{1,2})/                  // "45.50" (fallback)
       ];

       for (const pattern of patterns) {
         const match = text.match(pattern);
         if (match) {
           const numStr = match[1].replace(',', '.');
           return parseFloat(numStr);
         }
       }

       return 0; // Invalid
     }

     private extractCategory(text: string): string {
       let bestMatch = { category: 'Varie', score: 0 };

       for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
         for (const keyword of keywords) {
           if (text.includes(keyword)) {
             const score = keyword.length; // Longer keyword = more specific
             if (score > bestMatch.score) {
               bestMatch = { category, score };
             }
           }
         }
       }

       return bestMatch.category;
     }

     private extractDate(text: string, currentDate: Date): string {
       // Temporal expressions
       if (text.includes('oggi')) {
         return format(currentDate, 'yyyy-MM-dd');
       }
       if (text.includes('ieri')) {
         return format(subDays(currentDate, 1), 'yyyy-MM-dd');
       }
       if (text.includes("l'altro ieri") || text.includes('altro ieri')) {
         return format(subDays(currentDate, 2), 'yyyy-MM-dd');
       }

       // Specific dates: "16 gennaio 2026" or "16 gennaio"
       const datePattern = /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+(\d{4}))?/i;
       const match = text.match(datePattern);

       if (match) {
         const day = parseInt(match[1]);
         const monthNames = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
         const month = monthNames.indexOf(match[2].toLowerCase());
         const year = match[3] ? parseInt(match[3]) : currentDate.getFullYear();

         const date = new Date(year, month, day);
         return format(date, 'yyyy-MM-dd');
       }

       // Date format: "16/01/2026" or "16-01-2026"
       const numericDatePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
       const numMatch = text.match(numericDatePattern);

       if (numMatch) {
         const day = parseInt(numMatch[1]);
         const month = parseInt(numMatch[2]) - 1; // 0-indexed
         const year = parseInt(numMatch[3]);
         const date = new Date(year, month, day);
         return format(date, 'yyyy-MM-dd');
       }

       // Default: today
       return format(currentDate, 'yyyy-MM-dd');
     }

     private generateDescription(originalText: string, category: string): string {
       // Clean up text: remove amounts, common words
       let desc = originalText
         .replace(/(\d+[.,]\d{1,2})\s*(?:euro|€)/gi, '')
         .replace(/ho speso|ho pagato|pagato|speso/gi, '')
         .replace(/oggi|ieri|giorno|il/gi, '')
         .trim();

       // If too short, use category
       if (desc.length < 5) {
         desc = category;
       }

       // Capitalize first letter
       return desc.charAt(0).toUpperCase() + desc.slice(1);
     }

     private calculateConfidence(amount: number, category: string, date: string): number {
       let confidence = 0;

       // Amount confidence
       if (amount > 0) confidence += 0.4;
       else return 0; // Invalid expense

       // Category confidence
       if (category !== 'Varie') confidence += 0.3;
       else confidence += 0.1;

       // Date confidence
       if (date) confidence += 0.3;

       return Math.min(confidence, 1.0);
     }
   }

   export const expenseParser = new ExpenseParser();
   ```

2. **useExpenseParser Hook**
   ```typescript
   export function useExpenseParser() {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const parse = useCallback((text: string): ParsedExpense | null => {
       setIsLoading(true);
       setError(null);

       try {
         const result = expenseParser.parseExpenseText(text);

         // Validate result
         if (result.amount <= 0) {
           throw new Error('Importo non riconosciuto. Riprova specificando il valore in euro.');
         }

         if (result.confidence < 0.4) {
           setError('Parsing incerto. Verifica i dati prima di salvare.');
         }

         return result;
       } catch (err) {
         setError(err.message);
         return null;
       } finally {
         setIsLoading(false);
       }
     }, []);

     return { parse, isLoading, error };
   }
   ```

3. **dateParser.ts** (helper utilities)
   ```typescript
   import { format, parse, subDays } from 'date-fns';
   import { it } from 'date-fns/locale';

   export function parseItalianDate(dateStr: string, referenceDate: Date = new Date()): Date {
     const normalized = dateStr.toLowerCase().trim();

     // Temporal expressions
     const temporalMap: Record<string, Date> = {
       'oggi': referenceDate,
       'ieri': subDays(referenceDate, 1),
       "l'altro ieri": subDays(referenceDate, 2),
       'altro ieri': subDays(referenceDate, 2)
     };

     if (temporalMap[normalized]) {
       return temporalMap[normalized];
     }

     // Italian month names
     const monthNames = [
       'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
       'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
     ];

     // Try parsing Italian format
     for (const [index, month] of monthNames.entries()) {
       const pattern = new RegExp(`(\\d{1,2})\\s+${month}(?:\\s+(\\d{4}))?`, 'i');
       const match = dateStr.match(pattern);

       if (match) {
         const day = parseInt(match[1]);
         const year = match[2] ? parseInt(match[2]) : referenceDate.getFullYear();
         return new Date(year, index, day);
       }
     }

     // Fallback: return reference date
     return referenceDate;
   }

   export function formatItalianDate(date: Date): string {
     return format(date, 'dd MMMM yyyy', { locale: it });
   }
   ```

4. **constants.ts**
   ```typescript
   export const CATEGORIES = [
     'Università', 'Vitto', 'Abbigliamento', 'Casa', 'Auto',
     'Trasporti e viaggi', 'Bollette acqua', 'Bollette Luce',
     'Bollette Maddalena', 'Tasse', 'Sanità', 'Varie', 'Pulizie'
   ] as const;

   export const CATEGORY_COLORS: Record<string, string> = {
     'Università': 'bg-blue-500',
     'Vitto': 'bg-green-500',
     'Abbigliamento': 'bg-purple-500',
     'Casa': 'bg-yellow-500',
     'Auto': 'bg-red-500',
     'Trasporti e viaggi': 'bg-indigo-500',
     'Bollette acqua': 'bg-cyan-500',
     'Bollette Luce': 'bg-amber-500',
     'Bollette Maddalena': 'bg-pink-500',
     'Tasse': 'bg-gray-500',
     'Sanità': 'bg-rose-500',
     'Varie': 'bg-slate-500',
     'Pulizie': 'bg-teal-500'
   };

   export const CATEGORY_ICONS: Record<string, string> = {
     'Università': '🎓',
     'Vitto': '🍽️',
     'Abbigliamento': '👕',
     'Casa': '🏠',
     'Auto': '🚗',
     'Trasporti e viaggi': '✈️',
     'Bollette acqua': '💧',
     'Bollette Luce': '💡',
     'Bollette Maddalena': '📱',
     'Tasse': '🏛️',
     'Sanità': '⚕️',
     'Varie': '📦',
     'Pulizie': '🧹'
   };
   ```

5. **Validation & Fallbacks**
   - Verify amount > 0 (required)
   - Category fallback: 'Varie' se non riconosciuta
   - Date fallback: oggi se non specificata
   - Description fallback: use category name

6. **Confidence Scoring**
   - Amount found: +0.4
   - Category matched (non 'Varie'): +0.3
   - Date parsed: +0.3
   - If confidence < 0.5: warning in UI

**Testing**:
- **Test frasi esempio**:
  * ✅ "Ho speso 45 euro per trasporti il giorno 16 gennaio 2026"
  * ✅ "Bolletta della luce 80 euro oggi"
  * ✅ "ho pagato 36.45 euro per bolletta della luce ieri"
  * ✅ "Supermercato 65,50 euro oggi"
  * ✅ "€120 benzina ieri"

- **Edge cases**:
  * Decimali: "36,45" e "36.45" (entrambi supportati)
  * Date ambigue: "16 gennaio" (assume anno corrente)
  * Categorie simili: "supermercato" → Vitto
  * Multi-keyword: "bolletta luce" → Bollette Luce
  * Solo importo: "45 euro" → categoria 'Varie', data oggi

- **Phrase variations**:
  * "Ho speso X"
  * "Pagato X"
  * "X euro per Y"
  * "€X Y"

**Deliverable**: Parsing locale accurato, completamente offline, nessuna API esterna

---

### **Fase 6: Edit Modal e Flow Completo** (Giorni 11-12)

**Obiettivo**: Modal review + salvataggio spesa

**File da creare**:
- `src/components/ExpenseForm/ExpenseEditModal.tsx`
- `src/components/ExpenseForm/CategorySelect.tsx`
- `src/components/ExpenseForm/DatePicker.tsx`
- `src/components/ExpenseForm/AmountInput.tsx`
- `src/components/common/Modal.tsx`

**Implementazione**:

1. **ExpenseEditModal Component**
   ```typescript
   interface ExpenseEditModalProps {
     isOpen: boolean;
     parsedData: ParsedExpense | null;
     onSave: (expense: Expense) => Promise<void>;
     onCancel: () => void;
   }
   ```
   - Form con 4 campi: amount, category, date, description
   - Validation in tempo reale
   - Highlight low-confidence fields
   - Loading state durante save
   - Success/error feedback

2. **AmountInput**
   - Number input con 2 decimali
   - Formato euro: "45,00 €"
   - Validation: > 0
   - Min/max constraints (optional)

3. **CategorySelect**
   - Dropdown searchable con 13 categorie
   - Icone colorate per ogni categoria
   - Keyboard navigation
   - Filtro text search

4. **DatePicker**
   - Calendar popup (date-fns + React)
   - Italian locale
   - Quick actions buttons: "Oggi", "Ieri"
   - Manual input option
   - Validation: not future date

5. **Integration Flow**
   - Voice input → transcript
   - Claude parsing → parsed data
   - Open modal con parsed data
   - User edits (optional)
   - On confirm:
     * Validate all fields
     * Call GitHub storage addExpense
     * Show loading spinner
     * On success: close modal, show toast, refresh list
     * On error: show error message, keep modal open

6. **Keyboard Shortcuts**
   - `Enter` on form: submit (se valid)
   - `Escape`: cancel e close modal
   - `Tab`: navigate fields

**Testing**:
- End-to-end flow: voice → parse → edit → save → verify su GitHub
- Test validation: amount 0, future date, empty description
- Test error handling: GitHub API error, network failure
- Test keyboard navigation

**Deliverable**: Flow completo funzionante da input a spesa salvata

---

### **Fase 7: Lista Spese e Visualizzazione** (Giorni 13-15)

**Obiettivo**: Vista lista con grouping mensile e totali

**File da creare**:
- `src/components/ExpenseList/ExpenseList.tsx`
- `src/components/ExpenseList/ExpenseGroup.tsx`
- `src/components/ExpenseList/ExpenseItem.tsx`
- `src/components/ExpenseList/CategoryBadge.tsx`
- `src/components/ExpenseList/MonthlyTotal.tsx`
- `src/components/ExpenseList/DeleteButton.tsx`
- `src/store/expenseStore.ts`
- `src/hooks/useExpenses.ts`

**Implementazione**:

1. **expenseStore (Zustand)**
   ```typescript
   interface ExpenseState {
     expenses: Expense[];
     isLoading: boolean;
     error: string | null;
     fetchExpenses: () => Promise<void>;
     addExpense: (expense: Expense) => Promise<void>;
     deleteExpense: (id: string) => Promise<void>;
     updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
   }
   ```
   - Integration con GitHubStorage
   - Optimistic updates
   - Error handling

2. **ExpenseList Component**
   - Fetch expenses on mount
   - Group by month: `groupBy(expenses, e => startOfMonth(e.date))`
   - Sort groups by date desc (newest first)
   - Render ExpenseGroup per ogni mese

3. **ExpenseGroup Component**
   ```typescript
   interface ExpenseGroupProps {
     month: Date;
     expenses: Expense[];
   }
   ```
   - Header: "Gennaio 2026" (format con date-fns italiano)
   - MonthlyTotal component
   - List di ExpenseItem
   - Collapsible (optional)

4. **ExpenseItem Component**
   - Layout: [CategoryBadge] [Description] [Amount] [DeleteButton]
   - Date in formato: "16 Gen 2026"
   - Amount: "€ 45,00"
   - Hover effects
   - Mobile responsive (stack vertically)

5. **CategoryBadge Component**
   - Colored pill con icon e nome categoria
   - Colori da CATEGORY_COLORS
   - Icone da CATEGORY_ICONS
   - Tooltip con nome completo

6. **MonthlyTotal Component**
   - Totale spese del mese: "€ 1.234,56"
   - Conteggio spese: "15 spese"
   - Barra progresso budget (optional, per future)

7. **DeleteButton Component**
   - Icon button rosso
   - On click: mostra confirmation dialog
   - Confirmation: "Eliminare questa spesa?"
   - On confirm:
     * Optimistic UI update (rimuovi immediatamente)
     * Call deleteExpense
     * On error: rollback e mostra errore

8. **Filtering & Sorting (optional)**
   - Filter by category (multi-select)
   - Filter by date range
   - Sort: date desc (default), amount desc, category

**Testing**:
- Test con 0 spese (empty state)
- Test con 1 spesa
- Test con molte spese (100+)
- Test grouping corretto per mese
- Test totali mensili accuracy
- Test delete flow

**Deliverable**: Lista spese funzionante, delete working, UI responsive

---

### **Fase 8: Export Excel** (Giorni 16-17)

**Obiettivo**: Export spese in formato .xlsx

**File da creare**:
- `src/services/excelExport.ts`
- `src/components/Export/ExportButton.tsx`
- `src/components/Export/MonthSelector.tsx`

**Implementazione**:

1. **excelExport.ts**
   ```typescript
   import * as XLSX from 'xlsx';
   import { format } from 'date-fns';
   import { it } from 'date-fns/locale';

   export function exportToExcel(expenses: Expense[], filename: string) {
     // Transform data per Excel
     const data = expenses.map(e => ({
       Data: format(new Date(e.date), 'dd/MM/yyyy', {locale: it}),
       Categoria: e.category,
       Descrizione: e.description,
       Importo: e.amount,
       'Creato da': e.createdBy
     }));

     // Sort by date
     data.sort((a, b) => new Date(b.Data).getTime() - new Date(a.Data).getTime());

     // Create worksheet
     const worksheet = XLSX.utils.json_to_sheet(data);

     // Set column widths
     worksheet['!cols'] = [
       {wch: 12}, // Data
       {wch: 20}, // Categoria
       {wch: 30}, // Descrizione
       {wch: 10}, // Importo
       {wch: 15}  // Creato da
     ];

     // Create workbook
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Spese');

     // Download file
     XLSX.writeFile(workbook, filename);
   }
   ```

2. **ExportButton Component**
   - Button: "Esporta in Excel"
   - Icon: download
   - On click: mostra MonthSelector dialog (optional) o export all
   - Generate filename: `spese_${month}_${year}.xlsx` o `spese_tutte.xlsx`

3. **MonthSelector Component** (optional)
   - Modal o dropdown
   - Lista mesi disponibili (da expenses)
   - Option: "Tutti i mesi"
   - On select: trigger export

4. **Export Options**
   - Export all expenses
   - Export single month
   - Export date range (future)
   - Export filtered view (future)

5. **Formatting**
   - Italian date format: dd/MM/yyyy
   - Currency: number format (Excel auto-detect €)
   - Headers in Italian
   - Auto-fit column widths

**Testing**:
- Export con 0 spese (mostra messaggio o file vuoto)
- Export con 1 spesa
- Export con molte spese (verify performance)
- Open in Excel: verify formatting
- Test date formatting correct
- Test amount decimals correct (virgola vs punto)

**Deliverable**: Export Excel funzionante, file scaricabile, formato corretto

---

### **Fase 9: Supporto Offline Completo** (Giorni 18-20)

**Obiettivo**: App funzionante offline con sync automatico

**File da creare**:
- `src/services/offlineQueue.ts`
- `src/hooks/useOfflineSync.ts`
- `src/components/common/SyncStatus.tsx`
- `src/utils/indexedDBHelper.ts`

**Implementazione**:

1. **IndexedDB Setup**
   ```typescript
   import { openDB, DBSchema } from 'idb';

   interface SpesaCasaDB extends DBSchema {
     expenses: {
       key: string; // expense.id
       value: Expense;
     };
     pendingOps: {
       key: string; // operation.id
       value: PendingOperation;
     };
   }

   export const db = await openDB<SpesaCasaDB>('spesa-casa-db', 1, {
     upgrade(db) {
       db.createObjectStore('expenses', { keyPath: 'id' });
       db.createObjectStore('pendingOps', { keyPath: 'id' });
     }
   });
   ```

2. **PendingOperation Type**
   ```typescript
   interface PendingOperation {
     id: string;
     type: 'add' | 'delete' | 'update';
     data: Expense | { id: string } | { id: string, updates: Partial<Expense> };
     timestamp: number;
     retries: number;
   }
   ```

3. **offlineQueue.ts**
   ```typescript
   export class OfflineQueue {
     async addPendingOp(op: PendingOperation): Promise<void>
     async getPendingOps(): Promise<PendingOperation[]>
     async removePendingOp(opId: string): Promise<void>
     async processPendingOps(githubStorage: GitHubStorage): Promise<void>
   }
   ```
   - Add operations to IndexedDB quando offline
   - Process queue quando online
   - Retry failed operations
   - Remove successful operations

4. **useOfflineSync Hook**
   ```typescript
   interface UseOfflineSyncReturn {
     isOnline: boolean;
     pendingCount: number;
     isSyncing: boolean;
     syncNow: () => Promise<void>;
   }

   export function useOfflineSync() {
     const [isOnline, setIsOnline] = useState(navigator.onLine);
     const [pendingCount, setPendingCount] = useState(0);
     const [isSyncing, setIsSyncing] = useState(false);

     // Listen to online/offline events
     useEffect(() => {
       const handleOnline = () => {
         setIsOnline(true);
         syncNow(); // Auto-sync when back online
       };
       const handleOffline = () => setIsOnline(false);

       window.addEventListener('online', handleOnline);
       window.addEventListener('offline', handleOffline);

       return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
       };
     }, []);

     // ... sync logic
   }
   ```

5. **SyncStatus Component**
   - Badge in header app
   - States:
     * Online + synced: green checkmark "Sincronizzato"
     * Online + syncing: spinner "Sincronizzazione..."
     * Online + pending: orange badge "2 in attesa" + button "Sincronizza ora"
     * Offline: red dot "Offline" + count pending
   - Tooltip con dettagli

6. **Modified expenseStore**
   - Check `navigator.onLine` before operations
   - If offline:
     * Add to IndexedDB cache
     * Add to pending queue
     * Update local state
     * Show "Pending sync" indicator
   - If online:
     * Try GitHub operation
     * On success: update cache + state
     * On error: add to pending queue

7. **Conflict Resolution**
   - Fetch latest expenses on sync
   - Merge pending adds (UUID dedup)
   - Apply pending deletes (if expense still exists)
   - Apply pending updates (last-write-wins)

8. **Service Worker Enhancement** (vite.config.ts)
   - Cache GitHub API responses (short TTL: 5 min)
   - Cache Claude API responses (1 hour)
   - Runtime caching strategy: NetworkFirst fallback CacheOnly
   - Background sync API (optional, per future)

**Testing**:
- **Scenario 1**: Online → Offline → Add expense → Online (verify sync)
- **Scenario 2**: Offline → Add 3 expenses → Online (verify batch sync)
- **Scenario 3**: Offline → Delete expense → Online (verify delete syncs)
- **Scenario 4**: User A offline adds expense, User B online adds expense → User A online (verify merge)
- **Scenario 5**: Long offline period (hours) → Online (verify all ops sync)

**Deliverable**: App completamente funzionale offline, sync automatico robusto

---

### **Fase 10: Grafici e Statistiche** (Giorni 21-23)

**Obiettivo**: Visualizzazioni grafiche spese

**File da creare**:
- `src/components/Charts/SpendingChart.tsx`
- `src/components/Charts/MonthlyTrend.tsx`
- `src/components/Charts/CategoryComparison.tsx`
- `src/components/Charts/ChartsPage.tsx`
- `src/utils/chartHelpers.ts`

**Implementazione**:

1. **Install Charting Library**
   ```bash
   npm install recharts
   ```
   (Recharts: React-native, responsive, customizable)

2. **SpendingChart (Pie Chart)**
   ```typescript
   interface SpendingChartProps {
     expenses: Expense[];
     month?: Date; // Optional: filter per mese
   }
   ```
   - Pie chart per spese per categoria
   - Colori da CATEGORY_COLORS
   - Percentuali e importi su hover
   - Legend con categorie
   - Responsive design

3. **MonthlyTrend (Line Chart)**
   - X-axis: mesi
   - Y-axis: totale spese
   - Line per ogni categoria (toggle on/off)
   - Tooltip con breakdown
   - Zoom/pan (optional)

4. **CategoryComparison (Bar Chart)**
   - Confronto ultimi 3 mesi
   - Grouped bars per categoria
   - Evidenzia aumenti/diminuzioni
   - Sort by amount

5. **ChartsPage Component**
   - Tab o sections per ogni chart type
   - Filter: date range, categories
   - Export chart as PNG (optional)

6. **chartHelpers.ts**
   ```typescript
   export function aggregateByCategory(expenses: Expense[]): Record<Category, number>
   export function aggregateByMonth(expenses: Expense[]): Record<string, number>
   export function calculateMonthlyAverage(expenses: Expense[]): number
   export function detectSpendingTrends(expenses: Expense[]): Trend[]
   ```

7. **Integration**
   - Add "Statistiche" page/tab
   - Navigation: Home (Lista) | Statistiche | Impostazioni
   - Mobile responsive charts

**Testing**:
- Test con dati reali (import sample data)
- Test con 0 spese (show empty state)
- Test con 1 categoria vs tutte
- Test responsive: mobile, tablet, desktop

**Deliverable**: Grafici funzionanti, insights utili, UI responsive

---

### **Fase 11: PWA Features e Polish** (Giorni 24-25)

**Obiettivo**: Installable PWA, offline support tested, UX polish

**Tasks**:

1. **PWA Install Prompt**
   - Detect `beforeinstallprompt` event
   - Store deferredPrompt
   - Custom install button in UI
   - On click: trigger prompt
   - On install: hide button, show "Installata!"

2. **Platform-specific Instructions**
   - Detect platform: iOS, Android, Desktop
   - Show modal con istruzioni:
     * iOS: Share → "Aggiungi a Home"
     * Android: Menu → "Installa app"
     * Desktop: Icona in address bar

3. **First-time User Guide**
   - On first launch: show welcome modal
   - Steps:
     1. "Genera GitHub PAT e Claude API key"
     2. "Tocca il microfono verde per dettare spese"
     3. "Visualizza e gestisci le tue spese"
   - Dismiss: store in localStorage
   - "Non mostrare più" checkbox

4. **Loading States**
   - Skeleton screens per ExpenseList
   - Spinners per operations (save, delete, sync)
   - Progress bars per export

5. **Error Handling**
   - Toast notifications per errors (non-blocking)
   - Error boundary per crash recovery
   - Friendly error messages in italiano
   - Retry buttons

6. **Accessibility**
   - ARIA labels per buttons e inputs
   - Keyboard navigation (Tab, Enter, Escape)
   - Focus management in modals
   - Screen reader testing

7. **Performance**
   - Code splitting: lazy load Charts page
   - Image optimization: compress icons
   - Bundle size analysis: `npm run build -- --analyze`
   - Lighthouse audit: target 90+ score

8. **Offline Indicator**
   - Top banner quando offline: "Sei offline. Le modifiche saranno sincronizzate quando tornerai online."
   - Auto-hide quando online

**Testing**:
- PWA install: Chrome Android, iOS Safari, Desktop Chrome
- Test offline scenarios: add, delete, view
- Accessibility audit: axe DevTools
- Performance audit: Lighthouse
- Manual testing: tutte le features

**Deliverable**: PWA completo, installabile, performante, accessibile

---

### **Fase 12: CI/CD e Deployment** (Giorni 26-27)

**Obiettivo**: Deploy automatico su GitHub Pages

**File da creare**:
- `.github/workflows/deploy.yml`
- Update `vite.config.ts` con base URL

**Implementazione**:

1. **GitHub Actions Workflow**
   ```yaml
   name: Deploy PWA to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: true

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build
           env:
             NODE_ENV: production

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/spese-casa/', // Nome repository
     plugins: [react(), VitePWA({...})],
     build: {
       sourcemap: false, // Disabilita per production
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             charts: ['recharts']
           }
         }
       }
     }
   });
   ```

3. **GitHub Pages Setup**
   - Repository settings → Pages
   - Source: GitHub Actions
   - URL: `https://[username].github.io/spese-casa`

4. **Environment Variables** (se necessario)
   - Settings → Secrets → Actions
   - Add secrets (se usi shared API keys)

5. **Test Deployment**
   - Push to main
   - Monitor Actions tab
   - Verify deployment URL
   - Test PWA install da production

6. **Custom Domain** (optional)
   - Add CNAME file: `spese.tuodominio.it`
   - Configure DNS records
   - Update base in vite.config.ts

**Testing**:
- Push to main → verify auto-deploy
- Test production build locally: `npm run build && npm run preview`
- Verify service worker works in production
- Test PWA install from GitHub Pages URL

**Deliverable**: CI/CD funzionante, PWA live su GitHub Pages

---

### **Fase 13: Testing e Documentazione** (Giorni 28-30)

**Obiettivo**: Testing completo, documentazione utente

**Tasks**:

1. **End-to-End Testing**
   - Manual test di tutte le features
   - Test su dispositivi reali:
     * Android Chrome (voice, install)
     * iOS Safari (limited voice, install)
     * Desktop Chrome, Edge, Firefox
   - Test concurrent users:
     * Due utenti aggiungono spese simultaneamente
     * Verify conflict resolution
     * Verify entrambi vedono tutte le spese

2. **Edge Cases Testing**
   - Voice recognition failures
   - Claude API rate limits
   - GitHub API errors (401, 403, 404, 409, 500)
   - Network interruptions durante operations
   - Offline per giorni → sync con molte pending ops

3. **Browser Compatibility**
   - Chrome/Edge: full support ✅
   - Safari desktop: voice limited ⚠️
   - Safari iOS: voice limited ⚠️
   - Firefox: no voice, fallback manual ✅

4. **Performance Benchmarks**
   - Load time: < 3s
   - Time to Interactive: < 4s
   - Lighthouse PWA score: 90+
   - Voice recognition latency: < 2s
   - Claude parsing latency: < 5s

5. **README.md** (in italiano)
   ```markdown
   # Spese Casa - PWA per Gestione Spese

   ## Descrizione
   ...

   ## Setup Iniziale
   1. Genera GitHub Personal Access Token
   2. Login nell'app (solo PAT necessario)

   ## Uso
   - Dettare spese con microfono
   - Modifica e salva
   - Visualizza lista per mese
   - Export Excel

   ## Multi-utente
   - Aggiungi collaboratori al repo spese-casa-data
   - Ogni utente usa il proprio PAT

   ## Troubleshooting
   ...
   ```

6. **User Guide** (in app)
   - Help page con:
     * Come generare GitHub PAT (screenshots)
     * Esempi frasi vocali supportate
     * Lista completa 13 categorie con keywords
     * Tips per migliore riconoscimento
     * FAQ

7. **CHANGELOG.md**
   - Document version 1.0.0 features

**Deliverable**: App testata, documentata, pronta per uso

---

## Verifica Finale

### Checklist Funzionalità

**Core Features**:
- ✅ Riconoscimento vocale italiano (Web Speech API)
- ✅ Fallback input manuale
- ✅ Parsing intelligente con Claude (13 categorie)
- ✅ Gestione "oggi", "ieri", date specifiche
- ✅ Modal modifica prima salvataggio
- ✅ Salvataggio su GitHub (multi-user)
- ✅ Lista spese raggruppata per mese
- ✅ Badge colorati per categoria
- ✅ Totali mensili e conteggio
- ✅ Eliminazione spese con conferma
- ✅ Export Excel (singolo mese o tutti)
- ✅ Persistenza tra sessioni

**Advanced Features**:
- ✅ Grafici e statistiche (pie chart, line chart, bar chart)
- ✅ Analisi trend spese

**PWA Features**:
- ✅ Installabile su mobile e desktop
- ✅ Supporto offline completo (IndexedDB)
- ✅ Sync automatico quando online
- ✅ Service worker con caching
- ✅ Manifest con icone e theme

**Multi-user**:
- ✅ Autenticazione con GitHub PAT individuali
- ✅ Claude API key individuale
- ✅ Repository condiviso per dati
- ✅ Conflict resolution per concurrent edits
- ✅ Visibilità spese per tutti gli utenti

### Testing End-to-End

**Scenario 1: First-time User**
1. Naviga a app URL
2. Vede login screen
3. Genera GitHub PAT e Claude API key
4. Login
5. Vede empty state lista
6. Click microfono verde
7. Dice: "Ho speso 45 euro per trasporti oggi"
8. Claude parsea → modal con dati
9. Conferma → spesa salvata su GitHub
10. Vede spesa nella lista

**Scenario 2: Offline Use**
1. User disconnette internet
2. Aggiunge 2 spese (salvate in IndexedDB)
3. Vede badge "2 pending"
4. Riconnette internet
5. Auto-sync → spese salvate su GitHub
6. Badge diventa "Sincronizzato ✓"

**Scenario 3: Multi-user Concurrent**
1. User A e User B online
2. Entrambi aggiungono spesa allo stesso tempo
3. Conflict 409 su uno dei commit
4. Retry con merge
5. Entrambi vedono entrambe le spese

**Scenario 4: Export Excel**
1. User ha 20 spese in 3 mesi
2. Click "Esporta"
3. Seleziona mese Gennaio
4. Download spese_gennaio_2026.xlsx
5. Apre in Excel: formattazione corretta

## Sfide Tecniche Previste e Soluzioni

### Sfida 1: Web Speech API Limited Support
**Problema**: Safari e Firefox hanno supporto limitato/assente

**Soluzione**:
- Feature detection: `'SpeechRecognition' in window`
- Fallback prominent: manual input sempre visibile
- Warning banner per browser non supportati
- Raccomandazione Chrome/Edge

### Sfida 2: Concurrent GitHub Edits
**Problema**: Due utenti modificano `expenses.json` simultaneamente → 409 conflict

**Soluzione**:
- Optimistic locking con SHA
- Exponential backoff retry (1s, 2s, 4s)
- Merge strategy: append arrays, UUID dedup
- User feedback: "Sincronizzazione..." indicator

### Sfida 3: Parsing Accuracy Locale
**Problema**: Parser JavaScript potrebbe non riconoscere frasi complesse o ambigue

**Soluzione**:
- Ampio set di keywords per ogni categoria (sinonimi)
- Fuzzy matching per tollerare variazioni
- Confidence scoring: se < 0.5 → warning per user
- Edit modal sempre disponibile per correzioni
- Pattern matching robusto per date italiane
- Supporto decimali sia con punto che virgola

### Sfida 4: Offline Sync Conflicts
**Problema**: Offline edits possono confliggere con online changes

**Soluzione**:
- IndexedDB pending queue con timestamps
- Conflict resolution: server wins per updates, merge per additions
- UUID garantisce no duplicates
- Visual indicators per pending operations

### Sfida 5: Date Parsing Ambiguity
**Problema**: "16 gennaio" → quale anno? "ieri" → quale data?

**Soluzione**:
- Claude riceve context: current date
- Explicit rules nel system prompt
- Edit modal permette correzione manuale
- Highlight low-confidence dates

### Sfida 6: Mobile PWA Install UX
**Problema**: Users non sanno come installare PWA

**Soluzione**:
- Custom install prompt con `beforeinstallprompt`
- Platform-specific instructions modal
- First-time user guide
- Persistent "Installa" button in header

## Stima Effort Totale

**Timeline**: 30 giorni lavorativi (6 settimane)

**Breakdown**:
- Setup e infra: 2 giorni
- Auth: 2 giorni
- GitHub storage: 2 giorni
- Voice input: 2 giorni
- Claude parsing: 2 giorni
- Edit modal: 2 giorni
- Lista spese: 3 giorni
- Export Excel: 2 giorni
- Offline support: 3 giorni
- Grafici: 3 giorni
- PWA polish: 2 giorni
- CI/CD: 2 giorni
- Testing e docs: 3 giorni

**Rischi**:
- Voice recognition testing su dispositivi reali potrebbe rivelare issues
- Claude API parsing accuracy potrebbe richiedere prompt tuning
- GitHub conflict resolution potrebbe essere più complesso del previsto

## Next Steps

Una volta approvato il piano, procederemo con l'implementazione fase per fase, creando tutti i file necessari e implementando le funzionalità descritte.

**Prima fase da iniziare**: Setup progetto (giorni 1-2)
- Initialize Vite project
- Install dependencies
- Configure PWA
- Create folder structure
- Setup GitHub repository

Ready to start! 🚀
