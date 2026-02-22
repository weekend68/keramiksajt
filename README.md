# Keramiksajt

En portfolio och e-handelssajt för hobbykeramik. Besökare kan bläddra bland keramikprodukter och köpa via Swish. Ägaren hanterar sortimentet via en lösenordsskyddad adminpanel.

## Funktioner

**För besökare**
- Galleri med alla tillgängliga produkter, filtrering per kategori
- Produktsidor med bilder, beskrivning och pris
- Swish-köpflöde: unik referenskod per produkt, kopierbart Swish-nummer
- Reservationssystem – reservera en produkt i väntan på betalning

**Admin** (`/admin`)
- Lösenordsskyddad panel
- Skapa, redigera och ta bort produkter
- Uppladdning av flera bilder per produkt
- Hantera produktstatus (tillgänglig / reserverad / såld)

## Tech stack

| Del | Teknologi |
|-----|-----------|
| Frontend + Backend | Next.js 14 (App Router, Server Actions) |
| Språk | TypeScript |
| Styling | Tailwind CSS |
| Databas | Supabase (Postgres) |
| Bildlagring | Supabase Storage |
| Deployment | Vercel |

## Kom igång lokalt

**Förutsättningar:** Node.js 18+, ett Supabase-konto

```bash
# Klona repot
git clone https://github.com/ditt-användarnamn/keramiksajt.git
cd keramiksajt

# Installera dependencies
npm install
```

### Miljövariabler

Skapa `.env.local` i projektets rot:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ditt-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-nyckel-här

# Admin
ADMIN_PASSWORD=välj-ett-lösenord

# Swish
SWISH_NUMBER=ditt-swish-nummer
```

### Databas-setup

Se `SUPABASE_SETUP.md` för fullständiga instruktioner. Kortversion:

1. Skapa ett Supabase-projekt på [supabase.com](https://supabase.com)
2. Kör `supabase/schema.sql` i SQL Editor för att skapa tabeller
3. Kör `supabase/storage.sql` för att skapa bildlagring

### Starta

```bash
npm run dev
```

Sajten körs på [http://localhost:3000](http://localhost:3000)

## Deployment på Vercel

```bash
# Installera Vercel CLI (om du inte redan har den)
npm i -g vercel

# Deploya
vercel
```

Sätt följande miljövariabler i Vercel-dashboarden:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `SWISH_NUMBER`

## Projektstruktur

```
keramiksajt/
├── app/
│   ├── page.tsx                         # Galleri (startsida)
│   ├── product/[id]/
│   │   ├── page.tsx                     # Produktsida
│   │   └── components/                  # PurchaseModal, CopyButton m.m.
│   ├── admin/
│   │   ├── page.tsx                     # Adminpanel
│   │   ├── layout.tsx                   # Auth-wrapper
│   │   ├── actions.ts                   # Server Actions (CRUD, bilduppladdning)
│   │   └── components/                  # ProductForm, EditProductModal, ProductList
│   └── api/admin/auth/route.ts          # Autentisering
├── lib/
│   ├── supabase.ts                      # Supabase-klient
│   ├── products.ts                      # Dataåtkomst (produkter)
│   └── types.ts                         # TypeScript-typer
├── supabase/
│   ├── schema.sql                       # Databas-schema
│   ├── storage.sql                      # Storage-konfiguration
│   └── add-reservations.sql             # Migration: reservationssystem
└── SUPABASE_SETUP.md                    # Detaljerad setup-guide
```

## Om projektet

Projektet byggdes med [Claude Code](https://claude.ai/code) och dess agent-system (se `CLAUDE.md`). Agenter med olika specialiseringar samarbetade för att ta sajten från idé till färdig implementation – frontend, backend, databas och deployment.
