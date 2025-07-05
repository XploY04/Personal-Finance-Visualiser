import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;

export interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  createdAt: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");
  const transactions = await db
    .collection("transactions")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return transactions.map((t) => ({
    _id: t._id.toString(),
    amount: t.amount,
    date: t.date,
    description: t.description,
    category: t.category || "Others", // Default category for existing transactions
    createdAt: t.createdAt,
  }));
}

export async function createTransaction(
  transaction: Omit<Transaction, "_id">
): Promise<Transaction> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  const result = await db.collection("transactions").insertOne({
    ...transaction,
    createdAt: new Date().toISOString(),
  });

  const newTransaction = await db
    .collection("transactions")
    .findOne({ _id: result.insertedId });

  if (!newTransaction) {
    throw new Error("Failed to create transaction");
  }

  return {
    _id: newTransaction._id.toString(),
    amount: newTransaction.amount,
    date: newTransaction.date,
    description: newTransaction.description,
    category: newTransaction.category,
    createdAt: newTransaction.createdAt,
  };
}

export async function updateTransaction(
  id: string,
  transaction: Omit<Transaction, "_id" | "createdAt">
): Promise<Transaction | null> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  const result = await db
    .collection("transactions")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: transaction },
      { returnDocument: "after" }
    );

  if (!result || !result.value) return null;

  return {
    _id: result.value._id.toString(),
    amount: result.value.amount,
    date: result.value.date,
    description: result.value.description,
    category: result.value.category,
    createdAt: result.value.createdAt,
  };
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  const result = await db
    .collection("transactions")
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

export interface Budget {
  _id?: string;
  category: string;
  month: string; // Format: "YYYY-MM"
  budget: number;
  createdAt: string;
}

export async function getBudgets(month?: string | null): Promise<Budget[]> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  let query = {};
  if (month) {
    query = { month };
  }

  const budgets = await db
    .collection("budgets")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return budgets.map((b) => ({
    _id: b._id.toString(),
    category: b.category,
    month: b.month,
    budget: b.budget,
    createdAt: b.createdAt,
  }));
}

export async function createBudget(
  budget: Omit<Budget, "_id">
): Promise<Budget> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  // Check if budget already exists for this category and month
  const existingBudget = await db
    .collection("budgets")
    .findOne({ category: budget.category, month: budget.month });

  if (existingBudget) {
    // Update existing budget
    const result = await db
      .collection("budgets")
      .findOneAndUpdate(
        { category: budget.category, month: budget.month },
        { $set: { budget: budget.budget, createdAt: budget.createdAt } },
        { returnDocument: "after" }
      );

    if (!result) {
      throw new Error("Failed to update budget");
    }

    return {
      _id: result._id.toString(),
      category: result.category,
      month: result.month,
      budget: result.budget,
      createdAt: result.createdAt,
    };
  }

  // Create new budget
  const result = await db.collection("budgets").insertOne(budget);

  const newBudget = await db
    .collection("budgets")
    .findOne({ _id: result.insertedId });

  if (!newBudget) {
    throw new Error("Failed to create budget");
  }

  return {
    _id: newBudget._id.toString(),
    category: newBudget.category,
    month: newBudget.month,
    budget: newBudget.budget,
    createdAt: newBudget.createdAt,
  };
}

export async function updateBudget(
  category: string,
  month: string,
  budgetData: Partial<Pick<Budget, "budget">>
): Promise<Budget | null> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  const result = await db
    .collection("budgets")
    .findOneAndUpdate(
      { category, month },
      { $set: budgetData },
      { returnDocument: "after" }
    );

  if (!result || !result.value) return null;

  return {
    _id: result.value._id.toString(),
    category: result.value.category,
    month: result.value.month,
    budget: result.value.budget,
    createdAt: result.value.createdAt,
  };
}

export async function deleteBudget(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("finance_tracker");

  const result = await db
    .collection("budgets")
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}
