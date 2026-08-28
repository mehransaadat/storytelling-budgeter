import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { NarrativeTone, TONE_LABELS, Transaction } from "@/lib/types";

const TONE_INSTRUCTIONS: Record<NarrativeTone, string> = {
  encouraging:
    "Write as a warm, encouraging mentor. Celebrate small wins, be gentle about overspending, and end with one concrete, achievable suggestion.",
  analyst:
    "Write as a precise, data-driven analyst. Reference specific numbers and percentages, keep emotion out of it, and end with a ranked list of the top 3 optimization opportunities.",
  blunt:
    "Write as a blunt, no-nonsense friend. Be direct and a little witty about wasteful spending, but never mean-spirited. End with one hard truth the user needs to hear.",
  storyteller:
    "Write as a storyteller narrating the user's month as a short narrative arc with a beginning, tension, and resolution, using their spending as plot points. Keep it vivid but grounded in the real numbers.",
};

export async function POST(req: NextRequest) {
  try {
    const { transactions, tone } = (await req.json()) as {
      transactions: Transaction[];
      tone: NarrativeTone;
    };

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "No transactions provided." },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing DEEPSEEK_API_KEY on the server. Add it in your Vercel project's Environment Variables.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type !== "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type !== "income")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
      });

    const summaryForModel = {
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      net: (totalIncome - totalExpense).toFixed(2),
      spendingByCategory: byCategory,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(-15).map((t) => ({
        type: t.type,
        category: t.category,
        description: t.description,
        amount: t.amount,
        date: t.date,
      })),
    };

    const toneKey = TONE_INSTRUCTIONS[tone] ? tone : "encouraging";

    const systemInstruction =
      "You are the narrative engine inside a personal finance app called Storytelling Budgeter. " +
      "You turn a user's raw transaction data into a short, human, readable financial report (250-400 words). " +
      "Never invent numbers that aren't implied by the data given. Use markdown with a short title and 2-4 short paragraphs or bullet points.";

    const userPrompt = `Persona for this report: ${TONE_LABELS[toneKey as NarrativeTone]}.\nTone instructions: ${TONE_INSTRUCTIONS[toneKey as NarrativeTone]}\n\nHere is the user's financial data as JSON:\n${JSON.stringify(summaryForModel, null, 2)}\n\nWrite the report now.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 700,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
    });

    const narrative = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ narrative });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate narrative report." },
      { status: 500 }
    );
  }
}
