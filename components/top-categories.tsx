"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Transaction } from "@/app/page"

interface TopCategoriesProps {
  transactions: Transaction[]
}

export function TopCategories({ transactions }: TopCategoriesProps) {
  const topCategories = useMemo(() => {
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
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Your highest spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
        <CardDescription>Your highest spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCategories.map((category, index) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    {category.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${category.amount.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {category.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
