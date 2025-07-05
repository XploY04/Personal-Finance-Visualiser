"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Transaction } from "@/app/page";
import type { Budget } from "@/lib/mongodb";

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
}

export function BudgetVsActualChart({
  transactions,
  budgets,
  currentMonth,
}: BudgetVsActualChartProps) {
  const chartData = useMemo(() => {
    // Get current month transactions
    const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionMonth = new Date(transaction.date)
        .toISOString()
        .slice(0, 7);
      return transactionMonth === currentMonth;
    });

    // Calculate actual spending by category
    const actualSpending = currentMonthTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category || "Others";
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get budgets for current month
    const currentMonthBudgets = budgets.filter(
      (budget) => budget.month === currentMonth
    );

    // Combine all categories (from budgets and actual spending)
    const allCategories = new Set([
      ...currentMonthBudgets.map((b) => b.category),
      ...Object.keys(actualSpending),
    ]);

    const data = Array.from(allCategories)
      .map((category) => {
        const budgetAmount =
          currentMonthBudgets.find((b) => b.category === category)?.budget || 0;
        const actualAmount = actualSpending[category] || 0;
        const isOverBudget = actualAmount > budgetAmount && budgetAmount > 0;

        return {
          category,
          budgeted: budgetAmount,
          actual: actualAmount,
          isOverBudget,
          percentageUsed:
            budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0,
        };
      })
      .sort((a, b) => b.budgeted + b.actual - (a.budgeted + a.actual));

    return data;
  }, [transactions, budgets, currentMonth]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
              Budgeted:{" "}
              <span className="font-medium">${data.budgeted.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
              Actual:{" "}
              <span className="font-medium">${data.actual.toFixed(2)}</span>
            </p>
            {data.budgeted > 0 && (
              <p className="text-sm">
                Used:{" "}
                <span className="font-medium">
                  {data.percentageUsed.toFixed(1)}%
                </span>
                {data.isOverBudget && (
                  <span className="text-red-500 ml-1">(Over Budget)</span>
                )}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No budget or transaction data available</p>
          <p className="text-sm mt-2">
            Set budgets and add transactions to see the comparison
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="category"
            className="text-sm fill-muted-foreground"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            className="text-sm fill-muted-foreground"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="budgeted"
            fill="#3b82f6"
            name="Budgeted"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="actual"
            fill="#10b981"
            name="Actual"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
