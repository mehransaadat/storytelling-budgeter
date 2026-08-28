"use client";

import { Transaction } from "./types";

const STORAGE_KEY = "storytelling-budgeter:transactions:v1";

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
