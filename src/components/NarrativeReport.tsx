"use client";

import { useState } from "react";
import { NarrativeTone, TONE_LABELS, Transaction } from "@/lib/types";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

export default function NarrativeReport({ transactions }: Props) {
  const [tone, setTone] = useState<NarrativeTone>("encouraging");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setReport(data.narrative);
      }
    } catch {
      setError("Network error while generating the report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        AI narrative report
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(TONE_LABELS) as NarrativeTone[]).map((key) => (
          <button
            key={key}
            onClick={() => setTone(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              tone === key
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {TONE_LABELS[key]}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading || transactions.length === 0}
        className="flex items-center gap-2 bg-indigo-600 disabled:bg-slate-300 text-white text-sm font-medium rounded-xl px-4 py-2.5 hover:bg-indigo-500 transition"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Writing your story..." : "Generate report"}
      </button>

      {transactions.length === 0 && (
        <p className="text-xs text-slate-400 mt-2">
          Add at least one transaction first.
        </p>
      )}

      {error && (
        <p className="text-sm text-rose-500 mt-4 bg-rose-50 border border-rose-100 rounded-lg p-3">
          {error}
        </p>
      )}

      {report && (
        <article className="mt-4 prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {report}
        </article>
      )}
    </div>
  );
}
