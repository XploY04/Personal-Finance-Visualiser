"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Transaction } from "@/app/page"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

const COLORS = [
  "#8884d8", // Food
  "#82ca9d", // Transport
  "#ffc658", // Utilities
  "#ff7c7c", // Rent
  "#8dd1e1", // Entertainment
  "#d084d0", // Shopping
  "#ffb347", // Healthcare
  "#87ceeb", // Others
]

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const categoryData = useMemo(() => {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.category || "Others"
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-medium text-foreground">${data.amount.toFixed(2)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">{data.percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No transaction data available</p>
          <p className="text-sm mt-2">Add some transactions to see your category breakdown</p>
        </div>
      </div>
    )
  }

  if (categoryData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No category data available</p>
          <p className="text-sm mt-2">Categories will appear here as you add transactions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ category, percentage }) => `${category} (${percentage}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="amount"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
