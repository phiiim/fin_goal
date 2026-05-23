import type { AffordabilityResult } from '@/types'

export function calculateAffordability(
  income: number,
  expenses: number,
  savings: number,
  itemPrice: number,
  itemName: string
): AffordabilityResult {
  const monthlyFree = income - expenses
  const gap = Math.max(0, itemPrice - savings)
  const monthsNeeded = gap > 0 ? Math.ceil(gap / Math.max(monthlyFree * 0.5, 1)) : 0
  const pctOfIncome = (itemPrice / income) * 100
  const pctOfSavings = savings > 0 ? (itemPrice / savings) * 100 : 999
  const monthsOfExpenses = itemPrice / Math.max(expenses, 1)

  let score: number, label: string, verdict: string
  if (gap <= 0) {
    score = 95; label = 'Ready now'; verdict = 'You can afford this today from your savings.'
  } else if (monthsNeeded <= 3) {
    score = 82; label = 'Almost there'; verdict = 'A short save sprint and this is yours.'
  } else if (monthsNeeded <= 9) {
    score = 65; label = 'Doable'; verdict = 'Achievable with some discipline on spending.'
  } else if (monthsNeeded <= 24) {
    score = 42; label = 'Stretch goal'; verdict = "You'll need a solid plan — but it's realistic."
  } else {
    score = 20; label = 'Not yet'; verdict = 'This needs a bigger income or longer timeline.'
  }

  const impacts = []
  if (pctOfSavings > 80) {
    impacts.push({
      icon: 'warning',
      color: 'danger' as const,
      title: 'Wipes out most of your savings',
      body: `This costs ${Math.round(pctOfSavings)}% of your current savings. Keep at least ฿${(expenses * 3).toLocaleString()} as an emergency fund.`
    })
  }
  if (monthlyFree < 0) {
    impacts.push({
      icon: 'trending-down',
      color: 'danger' as const,
      title: "You're spending more than you earn",
      body: `Your expenses (฿${expenses.toLocaleString()}) exceed income (฿${income.toLocaleString()}). Fix this first.`
    })
  } else if (monthlyFree < income * 0.2) {
    impacts.push({
      icon: 'alert',
      color: 'warning' as const,
      title: 'Very thin monthly margin',
      body: `You're only saving ${Math.round((monthlyFree / income) * 100)}% of income. Aim for 20%+.`
    })
  }
  if (monthsOfExpenses > 6) {
    impacts.push({
      icon: 'clock',
      color: 'warning' as const,
      title: 'Big commitment relative to lifestyle',
      body: `This item costs ${monthsOfExpenses.toFixed(1)} months of your total expenses. Make sure it's worth it.`
    })
  }
  if (impacts.length === 0) {
    impacts.push({
      icon: 'check',
      color: 'success' as const,
      title: 'Finances look healthy',
      body: 'Your income-to-expense ratio is solid. This purchase fits a reasonable plan.'
    })
  }

  const timelineOptions = [
    { label: 'Save 30% of free cash', months: gap > 0 ? Math.ceil(gap / (monthlyFree * 0.3)) : 0, savingRate: 0.3 },
    { label: 'Save 50% of free cash', months: gap > 0 ? Math.ceil(gap / (monthlyFree * 0.5)) : 0, savingRate: 0.5 },
    { label: 'Save 70% of free cash', months: gap > 0 ? Math.ceil(gap / (monthlyFree * 0.7)) : 0, savingRate: 0.7 },
  ]

  const moneyTips = [
    'Freelance or side gig — even ฿5,000/mo extra cuts your timeline significantly',
    'Sell unused items on Kaidee or Facebook Marketplace',
    'Park savings in a fixed deposit or money market fund for 1.5–2.5% interest',
    `Cut one spending category — ฿2,000/mo less saves ฿${(2000 * monthsNeeded).toLocaleString()} over your timeline`,
    'Split costs — some goals like trips can be shared with friends',
  ]

  return { score, label, verdict, monthlyFree, gap, monthsNeeded, pctOfIncome, impacts, timelineOptions, moneyTips }
}

export function formatThaiCurrency(amount: number): string {
  return formatCurrency(amount, 'THB')
}

export function formatCurrency(amount: number, currency = 'THB'): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch (e) {
    const map: Record<string, string> = { THB: '฿', USD: '$', EUR: '€', JPY: '¥' }
    const sym = map[currency] ?? currency + ' '
    return sym + Math.round(amount).toLocaleString()
  }
}

export function monthsToReadable(months: number): string {
  if (months <= 0) return 'Now'
  if (months < 12) return `${months} months`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}m` : `${years} year${years > 1 ? 's' : ''}`
}
