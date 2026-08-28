"use client";

import { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  Transaction,
  TransactionType,
} from "@/lib/types";
import { makeId } from "@/lib/storage";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (t: Transaction) => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("discretionary");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategory(next === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0 || !description.trim()) return;

    onAdd({
      id: makeId(),
      type,
      category,
      description: description.trim(),
      amount: parsed,
      date,
      createdAt: Date.now(),
    });

    setDescription("");
    setAmount("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"
    >
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Add a transaction
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {(["income", "recurring", "discretionary"] as TransactionType[]).map(
          (t) => (
            <button
              type="button"
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`py-2 rounded-xl text-sm font-medium capitalize transition ${
                type === t
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Coffee with friends"
          className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-slate-800 transition"
      >
        <Plus size={16} />
        Add transaction
      </button>
    </form>
  );
}
