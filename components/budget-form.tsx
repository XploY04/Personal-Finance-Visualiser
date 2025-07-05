"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Budget } from "@/lib/mongodb";

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Rent",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Others",
];

interface BudgetFormProps {
  budget?: Budget | null;
  onSubmit: (data: Omit<Budget, "_id" | "createdAt">) => void;
  onCancel: () => void;
  currentMonth: string;
}

export function BudgetForm({
  budget,
  onSubmit,
  onCancel,
  currentMonth,
}: BudgetFormProps) {
  const [category, setCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      // Use UTC to avoid timezone issues with month calculation
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based, so add 1
      const monthKey = `${year}-${month}`; // YYYY-MM format
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      options.push({ value: monthKey, label: monthLabel });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setBudgetAmount(budget.budget.toString());
      setMonth(budget.month);
    } else {
      setCategory("");
      setBudgetAmount("");
      setMonth(currentMonth);
    }
    setErrors({});
  }, [budget, currentMonth]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category.trim()) {
      newErrors.category = "Category is required";
    }

    if (
      !budgetAmount ||
      isNaN(Number(budgetAmount)) ||
      Number(budgetAmount) <= 0
    ) {
      newErrors.budgetAmount = "Budget must be a positive number";
    }

    if (!month.trim()) {
      newErrors.month = "Month is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        category: category.trim(),
        month: month.trim(),
        budget: Number(budgetAmount),
      });
    } catch (error) {
      console.error("Error submitting budget:", error);
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Edit Budget" : "Set Monthly Budget"}
          </DialogTitle>
          <DialogDescription>
            {budget
              ? "Update the budget details below."
              : "Set a monthly budget for a specific category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className={errors.month ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.month && (
              <p className="text-sm text-red-500">{errors.month}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className={errors.budgetAmount ? "border-red-500" : ""}
            />
            {errors.budgetAmount && (
              <p className="text-sm text-red-500">{errors.budgetAmount}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : budget ? "Update" : "Set"} Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
