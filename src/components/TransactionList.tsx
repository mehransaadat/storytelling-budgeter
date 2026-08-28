"use client";

import { Transaction } from "@/lib/types";
import { Trash2, ArrowDownCircle, ArrowUpCircle, RefreshCcw } from "lucide-react";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const typeIcon = {
  income: <ArrowUpCircle size={18} className="text-emerald-500" />,
  recurring: <RefreshCcw size={18} className="text-amber-500" />,
  discretionary: <ArrowDownCircle size={18} className="text-rose-500" />,
};

export default function TransactionList({ transactions, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Recent activity
      </h2>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          No transactions yet — add your first one to start the story.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {sorted.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {typeIcon[t.type]}
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {t.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.category} · {t.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income" ? "text-emerald-600" : "text-slate-700"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-slate-300 hover:text-rose-500 transition"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
