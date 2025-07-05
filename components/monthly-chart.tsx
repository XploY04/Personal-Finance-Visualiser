"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/app/page"

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Initialize data for all months
    const data = months.map((month, index) => ({
      month,
      expenses: 0,
      fullMonth: new Date(currentYear, index).toLocaleString("default", { month: "long" }),
    }))

    // Aggregate expenses by month
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)
      if (transactionDate.getFullYear() === currentYear) {
        const monthIndex = transactionDate.getMonth()
        data[monthIndex].expenses += transaction.amount
      }
    })

    return data
  }, [transactions])

  const maxExpense = Math.max(...monthlyData.map((d) => d.expenses))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.fullMonth}</p>
          <p className="text-sm text-muted-foreground">
            Total Expenses: <span className="font-medium text-foreground">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No transaction data available</p>
          <p className="text-sm mt-2">Add some transactions to see your monthly spending patterns</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-sm fill-muted-foreground" />
          <YAxis className="text-sm fill-muted-foreground" tickFormatter={(value) => `$${value}`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="expenses" className="fill-primary" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
