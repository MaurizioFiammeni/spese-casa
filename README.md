# 🏠 Spese Casa - PWA per Gestione Spese

Progressive Web App per tracciare spese domestiche con input vocale in italiano.

## ✨ Funzionalità

- 🎤 **Input Vocale**: Dettare spese usando il riconoscimento vocale italiano (Web Speech API)
- 🧠 **Parsing Intelligente**: Parser locale JavaScript che estrae automaticamente importo, categoria e data
- 📝 **Modifica Pre-Salvataggio**: Rivedere e correggere i dati estratti prima di salvare
- 📊 **Lista Organizzata**: Spese raggruppate per mese con totali e badge colorati
- 📈 **Grafici e Statistiche**: Visualizzazione spese per categoria e trend mensili
- 💾 **Storage GitHub**: Dati salvati su repository GitHub (multi-user, condivisi)
- 📴 **Supporto Offline**: Funziona completamente offline con sync automatico
- 📤 **Export Excel**: Esportazione spese in formato .xlsx
- 📱 **PWA Installabile**: Installabile su mobile e desktop

## 🚀 Setup Iniziale

### Prerequisiti

- Node.js 20+
- Account GitHub

### Installazione

```bash
# Installa dipendenze
npm install --legacy-peer-deps

# Avvia server di sviluppo
npm run dev
```

### Configurazione GitHub

1. **Genera GitHub Personal Access Token**:
   - Vai su https://github.com/settings/tokens/new
   - Nome: "Spese Casa"
   - Scopes: seleziona `repo` (full control of private repositories)
   - Genera e copia il token

2. **Login nell'App**:
   - Apri l'app
   - Inserisci il GitHub PAT
   - Il sistema creerà automaticamente il repository `spese-casa-data` privato

## 📖 Come Usare

### Input Vocale

Clicca il pulsante microfono verde e detta la spesa:

**Esempi di frasi supportate**:
- ✅ "Ho speso 45 euro per trasporti oggi"
- ✅ "Bolletta della luce 80 euro oggi"
- ✅ "Pagato 36.45 euro per supermercato ieri"
- ✅ "120 euro benzina il giorno 16 gennaio 2026"

### Categorie Disponibili (13)

Università, Vitto, Abbigliamento, Casa, Auto, Trasporti e viaggi, Bollette acqua, Bollette Luce, Bollette Maddalena, Tasse, Sanità, Varie, Pulizie

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Storage**: GitHub API (Octokit) + IndexedDB
- **Voice**: Web Speech API
- **Charts**: Recharts
- **Export**: SheetJS (xlsx)
- **PWA**: vite-plugin-pwa

## 🧪 Testing

### Browser Compatibility

| Browser | Voice Input | PWA Install | Offline | Charts |
|---------|-------------|-------------|---------|--------|
| Chrome (Desktop/Android) | ✅ Full | ✅ | ✅ | ✅ |
| Edge | ✅ Full | ✅ | ✅ | ✅ |
| Safari (iOS/macOS) | ⚠️ Limited | ✅ | ✅ | ✅ |
| Firefox | ❌ (use manual) | ⚠️ | ✅ | ✅ |

### Test Offline Mode
1. Open DevTools → Network → Offline
2. Add expenses (queued locally)
3. Go back online → auto-sync!

## 📝 Roadmap

Vedi [plan.md](./plan.md) per il piano completo di implementazione.

### Fasi Completate
- [x] Fase 1: Setup progetto base
- [x] Fase 2: Sistema autenticazione
- [x] Fase 3: GitHub storage layer
- [x] Fase 4: Riconoscimento vocale
- [x] Fase 5: Parser locale JavaScript
- [x] Fase 6: Edit modal e flow completo
- [x] Fase 7: Lista spese
- [x] Fase 8: Export Excel
- [x] Fase 9: Supporto offline
- [x] Fase 10: Grafici e statistiche
- [x] Fase 11: PWA features e polish

## 📄 Licenza

MIT

---

**Made with ❤️ for managing household expenses**
