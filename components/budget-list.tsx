"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Budget } from "@/lib/mongodb";
import type { Transaction } from "@/app/page";

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
  currentMonth: string;
}

export function BudgetList({
  budgets,
  transactions,
  onEdit,
  onDelete,
  currentMonth,
}: BudgetListProps) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Generate month options (current month and next 11 months)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      options.push({ value: monthKey, label: monthLabel });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  // Filter budgets by selected month
  const filteredBudgets = budgets.filter(
    (budget) => budget.month === selectedMonth
  );

  // Calculate actual spending for each budget
  const budgetsWithActual = filteredBudgets.map((budget) => {
    const actualSpending = transactions
      .filter((transaction) => {
        const transactionMonth = new Date(transaction.date)
          .toISOString()
          .slice(0, 7);
        return (
          transactionMonth === selectedMonth &&
          transaction.category === budget.category
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const percentageUsed =
      budget.budget > 0 ? (actualSpending / budget.budget) * 100 : 0;
    const isOverBudget = actualSpending > budget.budget;

    return {
      ...budget,
      actualSpending,
      percentageUsed,
      isOverBudget,
    };
  });

  const getStatusBadge = (percentageUsed: number, isOverBudget: boolean) => {
    if (isOverBudget) {
      return <Badge variant="destructive">Over Budget</Badge>;
    } else if (percentageUsed > 80) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Warning
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          On Track
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              {filteredBudgets.length > 0
                ? `${filteredBudgets.length} budget${
                    filteredBudgets.length !== 1 ? "s" : ""
                  } for selected month`
                : "No budgets set for selected month"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {budgetsWithActual.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No budgets set for this month
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Click "Set Budget" to create your first budget
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Budgeted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetsWithActual.map((budget) => (
                  <TableRow key={budget._id}>
                    <TableCell className="font-medium">
                      {budget.category}
                    </TableCell>
                    <TableCell className="text-right">
                      ${budget.budget.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${budget.actualSpending.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          budget.isOverBudget ? "text-red-600 font-medium" : ""
                        }
                      >
                        {budget.percentageUsed.toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        budget.percentageUsed,
                        budget.isOverBudget
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(budget)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit budget</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete budget</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the budget for{" "}
                                {budget.category} in{" "}
                                {new Date(
                                  budget.month + "-01"
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                                . This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(budget._id!)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
