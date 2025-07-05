"use client";

import { useMemo } from "react";
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/app/page";
import type { Budget } from "@/lib/mongodb";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
}

interface CategoryInsight {
  category: string;
  budgeted: number;
  actual: number;
  percentageUsed: number;
  status: "over" | "warning" | "good" | "no-budget";
  message: string;
}

export function SpendingInsights({
  transactions,
  budgets,
  currentMonth,
}: SpendingInsightsProps) {
  const insights = useMemo(() => {
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

    // Combine all categories
    const allCategories = new Set([
      ...currentMonthBudgets.map((b) => b.category),
      ...Object.keys(actualSpending),
    ]);

    const categoryInsights: CategoryInsight[] = Array.from(allCategories)
      .map((category) => {
        const budgetAmount =
          currentMonthBudgets.find((b) => b.category === category)?.budget || 0;
        const actualAmount = actualSpending[category] || 0;
        const percentageUsed =
          budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;

        let status: CategoryInsight["status"];
        let message: string;

        if (budgetAmount === 0) {
          status = "no-budget";
          message = `No budget set for ${category}. Consider setting a budget to track spending.`;
        } else if (percentageUsed > 100) {
          const overage = actualAmount - budgetAmount;
          status = "over";
          message = `You've exceeded your ${category} budget by $${overage.toFixed(
            2
          )} this month.`;
        } else if (percentageUsed > 80) {
          status = "warning";
          message = `You've used ${percentageUsed.toFixed(
            0
          )}% of your ${category} budget.`;
        } else {
          status = "good";
          message = `Your ${category} budget is on track (${percentageUsed.toFixed(
            0
          )}% used).`;
        }

        return {
          category,
          budgeted: budgetAmount,
          actual: actualAmount,
          percentageUsed,
          status,
          message,
        };
      })
      .filter((insight) => insight.actual > 0 || insight.budgeted > 0)
      .sort((a, b) => {
        // Sort by priority: over budget first, then by percentage used
        if (a.status === "over" && b.status !== "over") return -1;
        if (b.status === "over" && a.status !== "over") return 1;
        return b.percentageUsed - a.percentageUsed;
      });

    return categoryInsights;
  }, [transactions, budgets, currentMonth]);

  const totalBudgeted = useMemo(() => {
    return budgets
      .filter((budget) => budget.month === currentMonth)
      .reduce((sum, budget) => sum + budget.budget, 0);
  }, [budgets, currentMonth]);

  const totalActual = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const transactionMonth = new Date(transaction.date)
          .toISOString()
          .slice(0, 7);
        return transactionMonth === currentMonth;
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions, currentMonth]);

  const totalSavings = totalBudgeted - totalActual;

  const getStatusIcon = (status: CategoryInsight["status"]) => {
    switch (status) {
      case "over":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "no-budget":
        return <TrendingDown className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: CategoryInsight["status"]) => {
    switch (status) {
      case "over":
        return <Badge variant="destructive">Over Budget</Badge>;
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        );
      case "good":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            On Track
          </Badge>
        );
      case "no-budget":
        return <Badge variant="outline">No Budget</Badge>;
      default:
        return null;
    }
  };

  const currentMonthName = new Date(currentMonth + "-01").toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Summary</CardTitle>
          <CardDescription>{currentMonthName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${totalBudgeted.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Budgeted
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalActual.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  totalSavings >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${Math.abs(totalSavings).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {totalSavings >= 0 ? "Remaining" : "Over Budget"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>
            {insights.length > 0
              ? `${insights.length} category insights for ${currentMonthName}`
              : `No insights available for ${currentMonthName}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No spending insights available</p>
              <p className="text-sm mt-2">
                Add transactions and set budgets to see insights
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg border"
                >
                  <div className="mt-0.5">{getStatusIcon(insight.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{insight.message}</p>
                      {getStatusBadge(insight.status)}
                    </div>
                    {insight.budgeted > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Budgeted: ${insight.budgeted.toFixed(2)} | Actual: $
                        {insight.actual.toFixed(2)} | Used:{" "}
                        {insight.percentageUsed.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
