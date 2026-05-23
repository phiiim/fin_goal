import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import Layout from '@/components/ui/Layout'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardPage from '@/pages/DashboardPage'
import GoalsPage from '@/pages/GoalsPage'
import AffordabilityPage from '@/pages/AffordabilityPage'
import TransactionsPage from '@/pages/TransactionsPage'
import VaultPage from '@/pages/VaultPage'
import RetirementPage from '@/pages/RetirementPage'
import GoalCalculatorPage from '@/pages/GoalCalculatorPage'

export default function App() {
  const user = useAppStore((s) => s.user)
  const location = useLocation()

  if (location.pathname === '/onboarding') return <OnboardingPage />

  if (!user) return <OnboardingPage />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/check" element={<AffordabilityPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/vault" element={<VaultPage />} />
        <Route path="/retirement" element={<RetirementPage />} />
        <Route path="/calculator" element={<GoalCalculatorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
