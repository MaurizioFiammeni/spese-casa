# Testing Checklist - Spese Casa PWA

## ✅ Authentication Testing

- [ ] Login con GitHub PAT valido
- [ ] Login con PAT invalido (mostra errore)
- [ ] Logout e clear session
- [ ] Token persist tra page reload
- [ ] Auto-redirect to login se non autenticato

## ✅ Voice Input Testing

- [ ] Click microfono verde → inizia registrazione
- [ ] Microfono diventa rosso durante recording
- [ ] Stop automatico dopo pausa
- [ ] Transcript catturato correttamente
- [ ] Permesso microfono negato → mostra errore
- [ ] Browser non supportato → mostra warning

## ✅ Parser Testing

Test queste frasi:

- [ ] "Ho speso 45 euro per trasporti oggi"
- [ ] "Bolletta della luce 80 euro oggi"
- [ ] "Pagato 36.45 euro supermercato ieri"
- [ ] "120 euro benzina il giorno 16 marzo"
- [ ] "€65,50 università ieri"
- [ ] "50 euro" (categoria → Varie, data → oggi)

## ✅ Edit Modal Testing

- [ ] Modal si apre con dati parsati
- [ ] Tutti i campi modificabili
- [ ] Descrizione opzionale (può essere vuota)
- [ ] Quick actions "Oggi"/"Ieri" funzionano
- [ ] Validation: amount > 0
- [ ] ESC chiude modal
- [ ] Pulsanti Salva/Annulla sempre visibili
- [ ] Low confidence warning appare se < 50%

## ✅ Storage Testing

- [ ] Repository spese-casa-data creato automaticamente
- [ ] Expense salvata su GitHub
- [ ] File expenses.json visibile su GitHub
- [ ] UTF-8 encoding corretto (è, à, ò, ù, ì)
- [ ] Concurrent edits (due utenti simultanei)
- [ ] Conflict resolution funziona

## ✅ Lista Spese Testing

- [ ] Spese raggruppate per mese
- [ ] Ordine cronologico corretto (più recente prima)
- [ ] Badge colorati per categoria
- [ ] Totali mensili accurati
- [ ] Formattazione italiana corretta
- [ ] Empty state quando nessuna spesa
- [ ] Delete singola spesa con conferma
- [ ] Delete intero mese con conferma batch

## ✅ Export Excel Testing

- [ ] Click "Esporta Excel"
- [ ] Modal selezione mese appare
- [ ] Export "Tutte le spese" → scarica spese_tutte.xlsx
- [ ] Export singolo mese → scarica spese_[mese]_[anno].xlsx
- [ ] File Excel si apre correttamente
- [ ] Date in formato italiano (dd/MM/yyyy)
- [ ] Valute formattate
- [ ] Tutte le colonne presenti

## ✅ Grafici Testing

- [ ] Tab "Grafici" accessibile
- [ ] Pie chart mostra distribuzione categorie
- [ ] Percentuali corrette
- [ ] Line chart mostra trend mensile
- [ ] Mesi in ordine cronologico (gen → feb → mar)
- [ ] Tooltip mostra importi formattati
- [ ] Insight categoria top corretto
- [ ] Media mensile accurata
- [ ] Trend % calcolato correttamente

## ✅ Offline Mode Testing

- [ ] Badge "Sincronizzato" quando online
- [ ] DevTools → Offline
- [ ] Badge diventa "Offline" rosso
- [ ] Aggiungi spesa offline → salvata in IndexedDB
- [ ] Badge mostra "X in attesa"
- [ ] Torna online
- [ ] Auto-sync processacoding operations
- [ ] Badge torna "Sincronizzato"
- [ ] Spese appaiono su GitHub

## ✅ PWA Testing

- [ ] Install prompt appare (Chrome/Edge)
- [ ] Click "Installa" → app installata
- [ ] Icona app in home screen
- [ ] App funziona standalone
- [ ] Service worker attivo
- [ ] Offline mode funziona dopo install

## ✅ Multi-User Testing

- [ ] User A crea repository spese-casa-data
- [ ] User A aggiunge User B come collaboratore
- [ ] User B genera proprio PAT
- [ ] User B fa login
- [ ] Entrambi vedono stesse spese
- [ ] User A e User B aggiungono spese → entrambi vedono tutto
- [ ] Concurrent edit → conflict resolution funziona

## ✅ Mobile Testing (iPhone/Android)

- [ ] App accessibile tramite HTTPS IP
- [ ] Accetta certificato self-signed
- [ ] Login funziona
- [ ] Voice input funziona (o fallback manual)
- [ ] Touch interface responsive
- [ ] Grafici responsive
- [ ] Install PWA from browser
- [ ] App funziona da home screen

## ✅ Error Handling Testing

- [ ] GitHub PAT scaduto → errore chiaro
- [ ] Network error durante save → mostra errore
- [ ] Parsing fallito → mostra errore con esempio
- [ ] Delete failed → rollback UI
- [ ] React crash → ErrorBoundary cattura

## ✅ Performance Testing

- [ ] Load time < 3s
- [ ] Voice recognition response < 2s
- [ ] Parsing istantaneo (< 10ms)
- [ ] GitHub save < 5s
- [ ] Grafici render fluido
- [ ] Lista con 100+ spese performante

## 🎯 Acceptance Criteria

App è production-ready quando:
- ✅ Tutte le funzionalità core funzionano
- ✅ No errori TypeScript in build
- ✅ Build production < 2MB
- ✅ PWA installabile
- ✅ Offline mode funziona
- ✅ Multi-user testato
- ✅ Mobile responsive
- ✅ UTF-8 encoding corretto

---

**Test Status**: ⏳ In corso di testing da parte dell'utente
