# Genera Icone PWA

Per generare le icone reali, usa uno di questi metodi:

## Opzione 1: Online Tool (più facile)
1. Vai su https://realfavicongenerator.net/
2. Upload il file icon.svg
3. Scarica le icone generate
4. Sostituisci i file in questa cartella

## Opzione 2: CLI Tool
```bash
npm install -g pwa-asset-generator
pwa-asset-generator icon.svg ./public/icons --icon-only --padding "10%"
```

## Opzione 3: Photoshop/Figma
1. Esporta icon.svg come PNG 512x512
2. Ridimensiona per 192x192
3. Per maskable: aggiungi padding 20% (safe zone)

## File Necessari
- icon-192.png (192x192)
- icon-512.png (512x512)
- maskable-icon-512.png (512x512 con safe zone)
