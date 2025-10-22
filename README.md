## byUTMB PWA

Next.js 15 + React 19 Progressive Web App for Paraty Brazil by UTMB, with Tailwind CSS, multilingual support, installable PWA features, and live content sourced from Google Sheets.

### 1. Running locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 2. Google Sheets integration

All dynamic content is fetched directly from a shared Google Spreadsheet through the Google Visualization API.  
Configure the base URL in `.env.local` (see `.env.local.example` for a reference):

```
NEXT_PUBLIC_SHEETS_BASE_URL=https://docs.google.com/spreadsheets/d/<spreadsheet-id>/gviz/tq
```

### 3. Deploy no Vercel

Para fazer deploy no Vercel:

1. **Acesse:** https://vercel.com
2. **Login** com sua conta GitHub
3. **"New Project"** → **"Import Git Repository"**
4. **Selecione:** `rafaelnmiranda/byUTMB_PWA`
5. **Configure Environment Variables:**
   - `NEXT_PUBLIC_SHEETS_BASE_URL`: `https://docs.google.com/spreadsheets/d/1tsRN2gHLSVr59h3YCTWAXQuVXN8Kc2wqRENCtPTeR_0/gviz/tq`
6. **Deploy!**

O arquivo `vercel.json` já está configurado com as variáveis necessárias.

> **Tip:** Use **File → Share → Publish to the web** in Google Sheets to make the data readable without authentication, or ensure the spreadsheet is shared publicly with view access.

Each page consumes a different sheet/tab:

| Sheet tab | Expected columns (case-insensitive) | Used in |
|-----------|--------------------------------------|---------|
| `dados` | `data`, `hora`, `titulo`, `descricao`, `local`, `tipo`, `imagem`, `hora_fim`, `link_maps` | Agenda |
| `parceiros` | `categoria`/`tipo`, `titulo`/`nome`, `parceiro`, `descricao`, `link`, `validade`, `imagem`, `link_maps` | Explore (coupons & locais) |
| `percursos` | `nome`, `distancia`, `elevacao`, `horario`, `largada`, `chegada`, `link_gpx`, `link_mapa_strava`, `imagem_altimetria` | Races |
| `videos` | `secao`, `titulo`, `descricao`, `video`/`link` (YouTube URL or ID) | Media |

The numeric `gid` for each tab is mapped in `src/app/assets/sheets.ts`. Update those constants if you move tabs or duplicate the spreadsheet.

The column names are normalized (spaces and accents removed, lowercased). Alternative aliases shown above are supported automatically. Any extra columns are ignored.

### 3. Assets & theming

Logos and static assets live under `public/images` and `public/icons`.  
Tailwind tokens in `src/app/globals.css` reflect the official palette (Night Blue, Tiffany, Yellow) and support light/dark/system modes controlled by the theme switcher in the header.

### 4. Directory overview

```
src/
  app/
    (routes)/        # App Router segments per screen
    components/      # Shared UI primitives (cards, filters, media, etc.)
    hooks/           # Language, theme, Sheets fetch, notifications
    globals.css      # Tailwind + design tokens
  public/
    images/          # Brand assets
    icons/           # PWA icons (manifest)
service-worker.js    # Push notifications scaffold
tailwind.config.ts   # Custom palette and tokens
```

### 5. Deployment

The project is ready for Vercel. Ensure `NEXT_PUBLIC_SHEETS_BASE_URL` is configured on the Vercel project and that any external image domains (e.g. Unsplash, Google Drive) are whitelisted in `next.config.ts`.
