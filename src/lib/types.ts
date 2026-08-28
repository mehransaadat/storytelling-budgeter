export type TransactionType = "income" | "recurring" | "discretionary";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number; // positive number; income is treated as +, expenses as spend amount
  date: string; // ISO date string (yyyy-mm-dd)
  createdAt: number;
}

export type NarrativeTone = "encouraging" | "analyst" | "blunt" | "storyteller";

export const TONE_LABELS: Record<NarrativeTone, string> = {
  encouraging: "The Encouraging Mentor",
  analyst: "The Data-Driven Analyst",
  blunt: "The Blunt Friend",
  storyteller: "The Storyteller",
};

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Utilities",
  "Groceries",
  "Transport",
  "Dining Out",
  "Entertainment",
  "Shopping",
  "Health",
  "Subscriptions",
  "Travel",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];
