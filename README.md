# Calculators

Financial calculators hub. Built as a pluggable shell so new calculators can be added as drop-in modules.

## Available

- **Compound Interest** (`compound-interest`) — monthly contributions with optional inflation adjustment (present value).

## Features

- Fully i18n (English default, Portuguese available) with locale-aware currency and number formatting
- Pluggable calculator registry — add a new calculator without touching the shell
- Interactive SVG growth chart + month-by-month breakdown table
- Hash-based routing (`#/compound-interest`)
- Zero external UI dependencies — just React + Tailwind

## Add a new calculator

1. Create `src/calculators/<id>/index.tsx` exporting a React component.
2. Add translation keys to `src/shared/i18n/locales.ts`.
3. Register it in `src/calculators/registry.ts`:
   ```ts
   {
     id: "my-calc",
     emoji: "🧾",
     accent: "#22d3ee",
     labels: (t) => ({
       title: t.calc.myCalc.title,
       subtitle: t.calc.myCalc.subtitle,
       description: t.calc.myCalc.description,
     }),
     Component: MyCalculator,
   }
   ```
4. Reusable shared UI (`NumberInput`, `MoneyInput`, `Segmented`, i18n hook) lives in `src/shared/`.

## Development

```bash
npm install
npm run dev        # http://localhost:3090
npm run build
```

## Docker

```bash
docker compose up -d --build
```

The app is served by nginx on port 3090.

## Project structure

```
src/
├── App.tsx                        # Shell (sidebar + active calculator)
├── main.tsx
├── index.css
├── calculators/
│   ├── registry.ts                # Pluggable list of calculators
│   ├── types.ts
│   └── compound-interest/
│       ├── index.tsx              # Main component
│       ├── finance.ts             # Pure calculation logic
│       ├── GrowthChart.tsx
│       └── ResultCards.tsx
└── shared/
    ├── components/                # Reusable inputs, segmented control, switcher
    ├── hooks/                     # useHashRoute
    ├── i18n/                      # Provider, hook, locale bundles
    └── utils/                     # Number parsing helpers
```

## License

MIT
