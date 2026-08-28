"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SpendingCharts from "@/components/SpendingCharts";
import NarrativeReport from "@/components/NarrativeReport";
import { BookOpenText } from "lucide-react";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTransactions(loadTransactions());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTransactions(transactions);
  }, [transactions, hydrated]);

  function addTransaction(t: Transaction) {
    setTransactions((prev) => [...prev, t]);
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type !== "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const net = totalIncome - totalExpense;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="bg-indigo-600 text-white rounded-xl p-2">
            <BookOpenText size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Storytelling Budgeter
            </h1>
            <p className="text-xs text-slate-400">
              Your money, narrated by AI.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="Total income" value={totalIncome} tone="emerald" />
          <SummaryCard label="Total expenses" value={totalExpense} tone="rose" />
          <SummaryCard label="Net" value={net} tone={net >= 0 ? "emerald" : "rose"} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <TransactionForm onAdd={addTransaction} />
          </div>
          <div className="md:col-span-2 space-y-6">
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            <SpendingCharts transactions={transactions} />
            <NarrativeReport transactions={transactions} />
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "rose";
}) {
  const color = tone === "emerald" ? "text-emerald-600" : "text-rose-600";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${color}`}>
        ${value.toFixed(2)}
      </p>
    </div>
  );
}
