export interface User {
  id: string
  name: string
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  createdAt: string
  currency?: string
}

export interface Goal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: GoalCategory
  status: 'active' | 'completed' | 'paused'
  createdAt: string
}

export type GoalCategory = 'vehicle' | 'property' | 'travel' | 'gadget' | 'education' | 'emergency' | 'other'

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'income' | 'expense'
  category: TransactionCategory
  merchant: string
  note: string
  date: string
  source: 'manual' | 'promptpay_scan' | 'statement_upload'
  goalId?: string
}

export type TransactionCategory =
  | 'food' | 'transport' | 'shopping' | 'entertainment'
  | 'utilities' | 'health' | 'education' | 'savings' | 'income' | 'other'

export interface AffordabilityResult {
  score: number
  label: string
  verdict: string
  monthlyFree: number
  gap: number
  monthsNeeded: number
  pctOfIncome: number
  impacts: Impact[]
  timelineOptions: TimelineOption[]
  moneyTips: string[]
}

export interface Impact {
  icon: string
  color: 'success' | 'warning' | 'danger'
  title: string
  body: string
}

export interface TimelineOption {
  label: string
  months: number
  savingRate: number
}

export interface Vault {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  color: string
  locked: boolean
  reason: string
  createdAt: string
}

export interface RetirementPlan {
  currentAge: number
  retirementAge: number
  monthlyExpenseAtRetirement: number
  currentRetirementSavings: number
  expectedReturnRate: number
}

export interface PromptPaySlip {
  amount: number
  merchant: string
  date: string
  reference: string
  category: TransactionCategory
  confidence: number
}
