# Supabase Setup Guide

Detta projekt använder Supabase för databas (Postgres) och bildlagring (Storage).

## Steg 1: Sätt upp miljövariabler

Skapa en `.env.local`-fil i projektets rot med följande innehåll:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://pdhphdlynzcytdpnixpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZpiPnSckDxtgRN8XxOX0Pg_isnJeEYF
```

## Steg 2: Skapa databas-schema

1. Gå till Supabase Dashboard: https://supabase.com/dashboard/project/pdhphdlynzcytdpnixpu
2. Navigera till **SQL Editor**
3. Kopiera innehållet från `supabase/schema.sql`
4. Klistra in i SQL Editor och kör scriptet

Detta skapar:
- `products`-tabellen med alla nödvändiga kolumner
- Index på `status` för snabbare queries
- Row Level Security (RLS) policies för att tillåta publika läsningar

## Steg 3: Skapa Storage Bucket

1. Gå till Supabase Dashboard: https://supabase.com/dashboard/project/pdhphdlynzcytdpnixpu
2. Navigera till **SQL Editor**
3. Kopiera innehållet från `supabase/storage.sql`
4. Klistra in i SQL Editor och kör scriptet

Detta skapar:
- `product-images` bucket för bildlagring
- Policies för publika läsningar och autentiserad uppladdning

**OBS:** Om du inte har auth uppsatt i Supabase, kan du behöva justera policies för att tillåta anonym uppladdning. I så fall, ändra storage.sql:

```sql
-- Allow anyone to upload (USE ONLY FOR DEVELOPMENT)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');
```

## Steg 4: Installera dependencies

```bash
npm install
```

## Steg 5: Kör projektet

```bash
npm run dev
```

## Vad har migrerats

### Från Vercel KV till Supabase Postgres
- `lib/kv.ts` → `lib/supabase.ts`
- `lib/products.ts` - Uppdaterad för att använda Supabase Postgres queries
- Data lagras nu i en relationsdatabas istället för key-value store

### Från Vercel Blob till Supabase Storage
- `app/admin/actions.ts` - Uppdaterad för att använda Supabase Storage
- Bilder lagras i `product-images` bucket
- Publika URLs genereras automatiskt

### Konfiguration
- `next.config.js` - Uppdaterad för att tillåta bilder från Supabase domäner

## Troubleshooting

### RLS (Row Level Security) problem
Om du får permission errors:
1. Kontrollera att RLS policies är korrekt uppsatta
2. För utveckling, kan du temporärt stänga av RLS:
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```

### Storage uppladdning fungerar inte
1. Verifiera att `product-images` bucket finns
2. Kontrollera att bucket är satt till `public`
3. Verifiera storage policies i Supabase Dashboard

### Environment variables laddas inte
1. Starta om dev-servern efter att ha ändrat `.env.local`
2. Verifiera att filnamnet är exakt `.env.local` (inte `.env` eller `.env.development`)

## Alternativ: Använda Service Role Key

För admin-operationer (create, update, delete), kan du också använda service role key:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Uppdatera sedan `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// För server-side admin operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;
```

Detta ger dig full access till databasen utan RLS restrictions.
