"use client";

import { Transaction } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useMemo } from "react";

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#6366f1",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#64748b",
];

export default function SpendingCharts({ transactions }: Props) {
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type !== "income")
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; income: number; expense: number }>();
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // yyyy-mm
      if (!map.has(month)) map.set(month, { month, income: 0, expense: 0 });
      const entry = map.get(month)!;
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
    });
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const hasExpenseData = categoryData.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Spending by category
        </h2>
        {hasExpenseData ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState />
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Monthly income vs. expense
        </h2>
        {hasMonthlyData ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState />
        )}
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
      Add transactions to see charts here.
    </div>
  );
}
