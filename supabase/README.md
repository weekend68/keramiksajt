# Databas Setup

## Initial setup

Kör `schema.sql` först för att skapa tabellen och policies:

```bash
# I Supabase Dashboard: SQL Editor
# Kopiera innehållet från schema.sql och kör
```

## Lägg till reservations-funktionalitet

Efter att ha kört `schema.sql`, kör `add-reservations.sql` för att lägga till reservationskolumner:

```bash
# I Supabase Dashboard: SQL Editor
# Kopiera innehållet från add-reservations.sql och kör
```

Detta lägger till följande kolumner i `products`-tabellen:
- `reserved_by` (TEXT) - Mobilnummer för den som reserverat
- `reserved_at` (TIMESTAMPTZ) - När reservationen gjordes
- `delivery_address` (TEXT) - Leveransadress

Status-fältet stödjer nu tre värden:
- `available` - Produkten är tillgänglig för köp
- `reserved` - Produkten är reserverad (24h)
- `sold` - Produkten är såld
