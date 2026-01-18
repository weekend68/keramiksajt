# Keramiksajt MVP

En enkel portfolio + e-handel sajt för hobbykeramiker.

## Funktioner

### Public (Besökare)
- **Galleri** (`/`) - Visa alla tillgängliga produkter
- **Produktsida** (`/product/[id]`) - Visa produktdetaljer och Swish-betalningsinformation

### Admin (`/admin`)
- Lösenordsskyddad admin-panel
- Skapa nya produkter (med bilduppladdning)
- Redigera befintliga produkter
- Ta bort produkter
- Se alla produkter och deras status

## Teknisk Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **JSON-fil databas** (`data/products.json`)
- **Server Actions** för mutations

## Installation

```bash
# Installera dependencies
npm install

# Starta development server
npm run dev
```

Sajten körs på: http://localhost:3000

## Konfiguration

Redigera `.env.local`:

```env
# Admin-lösenord för /admin
ADMIN_PASSWORD=keramik2024

# Swish-nummer för betalningar
SWISH_NUMBER=123 456 78 90
```

## Användning

### För keramikern (Admin)

1. Gå till `/admin`
2. Logga in med lösenordet (standard: `keramik2024`)
3. Skapa nya produkter genom att fylla i formuläret:
   - Namn
   - Beskrivning
   - Pris (kr)
   - Kategori
   - Ladda upp bild (från mobil/desktop)
4. Redigera eller ta bort produkter från listan

### För kunder (Public)

1. Besök sajten (/)
2. Klicka på en produkt för detaljer
3. Se Swish-information:
   - Swish-nummer (kopierbart)
   - Produktreferenskod (används som meddelande i Swish)
   - Belopp
4. Betala via Swish med referenskoden som meddelande
5. Keramikern kontaktar kunden efter betalning

## Produktreferenskoder

Varje produkt får automatiskt en unik referenskod (format: `KER-XXXX`). Kunder använder denna kod som meddelande i Swish-betalningen så att keramikern kan matcha betalningar med rätt produkt.

## Deployment

Sajten kan deployas gratis på Vercel:

```bash
# Installera Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Kom ihåg att sätta environment variables på Vercel:
- `ADMIN_PASSWORD`
- `SWISH_NUMBER`

## Projektstruktur

```
keramiksajt/
├── app/
│   ├── page.tsx                    # Public gallery
│   ├── product/[id]/page.tsx       # Product detail + buy
│   ├── admin/
│   │   ├── layout.tsx              # Admin auth wrapper
│   │   ├── page.tsx                # Admin panel
│   │   ├── actions.ts              # Server Actions
│   │   └── components/             # Admin UI components
│   └── api/admin/auth/route.ts     # Auth API
├── lib/
│   ├── types.ts                    # TypeScript types
│   └── products.ts                 # Data access layer
├── data/
│   └── products.json               # JSON database
├── public/
│   └── uploads/                    # Uploaded images
└── .env.local                      # Environment variables
```

## Tips

- Testa med mobil för att säkerställa att bilduppladdning fungerar
- Produktreferenskoder är unika och genereras automatiskt
- Bilder sparas i `public/uploads/` och kan raderas manuellt om nödvändigt
- JSON-databasen finns i `data/products.json` - backa upp denna fil regelbundet

## Support

Detta är en MVP-version. Framtida förbättringar kan inkludera:
- Riktig Swish-integration
- E-postnotifieringar
- Lagerstatus
- Kundregister
- Order-historik
