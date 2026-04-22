# Calculadoras

Hub de calculadoras financeiras. Projetado para acomodar novas calculadoras de forma plugável.

## Disponíveis

- **Juros Compostos** (`juros-compostos`) — aportes mensais + correção opcional pela inflação.

## Adicionar uma nova calculadora

1. Crie `src/calculators/<id>/index.tsx` exportando um componente React.
2. Registre em `src/calculators/registry.ts`:
   ```ts
   {
     id: "meu-id",
     title: "Minha Calculadora",
     emoji: "🧾",
     accent: "#22d3ee",
     Component: MinhaCalculadora,
   }
   ```
3. Shared UI reutilizável em `src/shared/`.

## Dev

```bash
npm install
npm run dev        # porta 3090
npm run build
```

## Docker

```bash
docker compose up -d --build
```
