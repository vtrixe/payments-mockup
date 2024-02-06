"use server"
import { db } from "@/lib/db";

export const getBankAccountById = async (Id: string) => { // Notice the lowercase 's' in 'string'
  try {
    const account = await db.bankAccount.findUnique({
      where: { id: Id },
    });
    if (!account) {
      return { error: "Account not found" };
    }
    return account;
  } catch (error) {
    console.error("Error fetching bank account by ID:", error);
    return { error: "Failed to fetch account" };
  }
};
