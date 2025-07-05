import { type NextRequest, NextResponse } from "next/server";
import { getBudgets, createBudget, updateBudget } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    const budgets = await getBudgets(month);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, month, budget } = body;

    // Validation
    if (!category || !category.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!month || !month.trim()) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    if (!budget || budget <= 0) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    const newBudget = await createBudget({
      category: category.trim(),
      month: month.trim(),
      budget: Number(budget),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, month, budget } = body;

    // Validation
    if (!category || !category.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!month || !month.trim()) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    if (!budget || budget <= 0) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    const updatedBudget = await updateBudget(category.trim(), month.trim(), {
      budget: Number(budget),
    });

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}
