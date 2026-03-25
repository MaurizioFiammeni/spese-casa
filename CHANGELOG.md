# Changelog - Spese Casa PWA

## [1.0.0] - 2026-03-25

### 🎉 Initial Release

Progressive Web App completa per la gestione spese domestiche con input vocale in italiano.

### ✨ Features

#### Core Functionality
- **🎤 Voice Input**: Riconoscimento vocale italiano (Web Speech API)
  - Microfono verde grande e intuitivo
  - Animazioni durante registrazione
  - Supporto HTTPS per device mobili
  - Fallback manuale sempre disponibile

- **🧠 Parser Intelligente**: Parsing locale JavaScript (100% gratuito, offline)
  - 150+ keywords per 13 categorie
  - Estrazione automatica: importo, categoria, data, descrizione
  - Supporto espressioni temporali: "oggi", "ieri", date specifiche
  - Confidence scoring (0-1)

- **📝 Edit Modal**: Revisione dati pre-salvataggio
  - Modifica importo, categoria, data, descrizione
  - Descrizione opzionale (default: nome categoria)
  - Validazione real-time
  - Quick actions: "Oggi", "Ieri"
  - Keyboard shortcuts (ESC, Enter, Tab)

#### Storage & Sync
- **💾 GitHub Storage**: Repository privato per dati
  - File JSON condiviso (expenses.json)
  - Multi-user support con collaboratori
  - Optimistic locking per concurrent edits
  - Retry logic con exponential backoff

- **📴 Offline Mode**: Supporto offline completo
  - IndexedDB per cache locale
  - Pending operations queue
  - Auto-sync al ritorno online
  - Badge stato sincronizzazione

#### Visualization
- **📊 Lista Spese**: Organizzata per mese
  - Grouping automatico
  - Badge colorati per 13 categorie
  - Totali mensili con conteggio
  - Formattazione italiana (date, valute)

- **📈 Grafici**: Statistiche visuali
  - Pie chart: distribuzione per categoria
  - Line chart: trend mensile
  - Insight: categoria top
  - Media mensile e trend %

#### Export & Delete
- **📤 Export Excel**: Export in formato .xlsx
  - Export tutti o singolo mese
  - Formattazione italiana
  - Headers in italiano
  - Auto-sized columns

- **🗑️ Delete**: Eliminazione flessibile
  - Delete singola spesa con conferma
  - Delete intero mese (batch)
  - Optimistic UI updates
  - Rollback su errore

#### PWA Features
- **📱 Installabile**: Su mobile e desktop
  - Custom install prompt
  - Manifest completo
  - Service worker attivo
  - Icons template (SVG)

- **🔒 Sicurezza**: Produzione-ready
  - HTTPS per voice API
  - Token encrypted in localStorage
  - ErrorBoundary per crash recovery
  - GitHub PAT validation

### 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 8 con PWA plugin
- **Styling**: Tailwind CSS 4.0
- **State**: Zustand con persist
- **Storage**: Octokit (GitHub API) + IndexedDB (idb)
- **Voice**: Web Speech API
- **Charts**: Recharts
- **Export**: SheetJS (xlsx)
- **Dates**: date-fns con locale italiana
- **Deploy**: GitHub Actions → GitHub Pages

### 📦 Categorie Spese (13)

1. Università
2. Vitto
3. Abbigliamento
4. Casa
5. Auto
6. Trasporti e viaggi
7. Bollette acqua
8. Bollette Luce
9. Bollette Maddalena
10. Tasse
11. Sanità
12. Varie
13. Pulizie

### 🌐 Browser Support

- ✅ Chrome/Edge: Full support (consigliato)
- ⚠️ Safari: Voice limited, altri features full
- ⚠️ Firefox: No voice, manual input available

### 🔧 Improvements & Fixes

- UTF-8 encoding corretto per caratteri italiani
- Descrizione campo opzionale (usa categoria di default)
- Infinite loop fix in expenses fetch
- Modal footer sticky per pulsanti sempre visibili
- Month sorting corretto in line chart
- Green microphone color fix (Tailwind 4.0 compatibility)

### 📊 Statistics

- **Total Lines of Code**: ~4,500+ lines
- **Components**: 30+
- **Hooks**: 5 custom hooks
- **Services**: 5 services
- **Types**: Complete TypeScript coverage
- **Commits**: 20+ commits con storia completa

### 🙏 Credits

Sviluppato con assistenza di **Claude Opus 4.6** (Anthropic).

### 📄 License

MIT

---

**Version 1.0.0 - Feature Complete** 🎉
