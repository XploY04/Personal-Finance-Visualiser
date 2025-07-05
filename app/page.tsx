"use client";

import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { MonthlyChart } from "@/components/monthly-chart";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { TopCategories } from "@/components/top-categories";
import { BudgetForm } from "@/components/budget-form";
import { BudgetList } from "@/components/budget-list";
import { BudgetVsActualChart } from "@/components/budget-vs-actual-chart";
import { SpendingInsights } from "@/components/spending-insights";
import { useToast } from "@/hooks/use-toast";
import type { Budget } from "@/lib/mongodb";

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Load transactions and budgets on component mount
  useEffect(() => {
    loadTransactions();
    loadBudgets();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load budgets",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive",
      });
    }
  };

  const handleAddTransaction = async (
    transactionData: Omit<Transaction, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions((prev) => [newTransaction, ...prev]);
        setIsFormOpen(false);
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = async (
    id: string,
    transactionData: Omit<Transaction, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransactions((prev) =>
          prev.map((t) => (t._id === id ? updatedTransaction : t))
        );
        setEditingTransaction(null);
        setIsFormOpen(false);
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleAddBudget = async (
    budgetData: Omit<Budget, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setBudgets((prev) => {
          // Remove any existing budget for the same category and month
          const filtered = prev.filter(
            (b) =>
              !(
                b.category === budgetData.category &&
                b.month === budgetData.month
              )
          );
          return [newBudget, ...filtered];
        });
        setIsBudgetFormOpen(false);
        toast({
          title: "Success",
          description: "Budget set successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to set budget",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      });
    }
  };

  const handleEditBudget = async (
    budgetData: Omit<Budget, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        const updatedBudget = await response.json();
        setBudgets((prev) =>
          prev.map((b) =>
            b.category === budgetData.category && b.month === budgetData.month
              ? updatedBudget
              : b
          )
        );
        setEditingBudget(null);
        setIsBudgetFormOpen(false);
        toast({
          title: "Success",
          description: "Budget updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update budget",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBudgets((prev) => prev.filter((b) => b._id !== id));
        toast({
          title: "Success",
          description: "Budget deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete budget",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const openBudgetForm = () => {
    setIsBudgetFormOpen(true);
  };

  const openEditBudgetForm = (budget: Budget) => {
    setEditingBudget(budget);
    setIsBudgetFormOpen(true);
  };

  const closeBudgetForm = () => {
    setIsBudgetFormOpen(false);
    setEditingBudget(null);
  };

  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground">
            Track and visualize your expenses with budgeting
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={openBudgetForm}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Target className="mr-2 h-4 w-4" />
            Set Budget
          </Button>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {transactions
                .filter(
                  (t) => new Date(t.date).getMonth() === new Date().getMonth()
                )
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{currentMonthName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {budgets
                .filter((b) => b.month === currentMonth)
                .reduce((sum, b) => sum + b.budget, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{currentMonthName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(transactions.map((t) => t.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Dashboard Content with Recent Transactions, Top Categories, and Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <RecentTransactions transactions={transactions} />
            <TopCategories transactions={transactions} />
          </div>
          <SpendingInsights
            transactions={transactions}
            budgets={budgets}
            currentMonth={currentMonth}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionList
            transactions={transactions}
            onEdit={openEditForm}
            onDelete={handleDeleteTransaction}
          />
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <BudgetList
            budgets={budgets}
            transactions={transactions}
            onEdit={openEditBudgetForm}
            onDelete={handleDeleteBudget}
            currentMonth={currentMonth}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
                <CardDescription>
                  Compare your budgeted amounts with actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetVsActualChart
                  transactions={transactions}
                  budgets={budgets}
                  currentMonth={currentMonth}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>
                  Your spending patterns throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={
            editingTransaction
              ? (data) => handleEditTransaction(editingTransaction._id, data)
              : handleAddTransaction
          }
          onCancel={closeForm}
        />
      )}

      {/* Budget Form Modal */}
      {isBudgetFormOpen && (
        <BudgetForm
          budget={editingBudget}
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onCancel={closeBudgetForm}
          currentMonth={currentMonth}
        />
      )}
    </div>
  );
}
