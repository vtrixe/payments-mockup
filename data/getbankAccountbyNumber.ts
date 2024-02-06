"use server"
import { db } from "@/lib/db";

export const getbankAccountByNumber = async (accountNumber: string) => {
  try {
    const account = await db.bankAccount.findUnique({
      where: { accountNumber }
    });
    return account;
  } catch (error) {
    console.error("Failed to fetch bank account by number:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};
