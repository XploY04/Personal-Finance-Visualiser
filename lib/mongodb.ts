// MongoDB connection utility
// This would be used in production with actual MongoDB

import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Transaction model interface
export interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

// Database operations
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
