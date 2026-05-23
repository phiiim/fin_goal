# FinGoal — AI Personal Finance App

Thai Gen Z personal finance app with AI-powered affordability checking, goal tracking, and PromptPay slip scanning.

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React + TypeScript | Type-safe, component-based |
| Styling | Tailwind CSS | Fast, consistent UI |
| Routing | React Router v6 | SPA navigation |
| State | Zustand + persist | Simple, localStorage-backed |
| Charts | Recharts | Thai-friendly data viz |
| Build | Vite | Fast dev + build |

## Project Structure

```
src/
├── pages/
│   ├── OnboardingPage.tsx      # 3-step setup flow
│   ├── DashboardPage.tsx       # Overview + goal progress
│   ├── AffordabilityPage.tsx   # AI affordability checker ⭐
│   ├── GoalsPage.tsx           # Goal CRUD + progress
│   └── TransactionsPage.tsx    # Manual + scan transactions
├── components/
│   ├── ui/
│   │   ├── Layout.tsx          # Bottom nav shell
│   │   ├── Card.tsx            # Reusable card
│   │   └── Button.tsx          # Reusable button
│   └── features/               # (coming: SlipScanner, AICoach)
├── store/
│   └── useAppStore.ts          # Zustand global state
├── lib/
│   └── calculations.ts         # Affordability engine
└── types/
    └── index.ts                # All TypeScript types
```

## Getting Started

```bash
npm install
npm run dev
```

## Roadmap

- [x] Onboarding flow
- [x] Dashboard
- [x] Affordability checker
- [x] Goal tracker
- [x] Manual transactions
- [ ] PromptPay slip scanner (AI Vision)
- [ ] AI coach chat
- [ ] Bank statement PDF import
- [ ] Affiliate links integration
- [ ] Premium paywall (฿99/mo)

## Environment Variables (coming)

```
VITE_ANTHROPIC_API_KEY=   # For slip scanning + AI coach
```
