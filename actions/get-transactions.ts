"use server"
import { db } from "@/lib/db";

export const getTransactions = async (id: string) => { 
    try {
      const transactions = await db.transaction.findMany({
        where: {
          OR: [
            { senderBankAccountId: id },
            { receiverBankAccountId: id }
          ],
        },
      
        orderBy: {
            createdAt: 'desc',
        },
      });

      if (transactions.length === 0) {
        return { error: "No transactions found for the given account ID." };
      }
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions by account ID:", error);
      return { error: "Failed to fetch transactions" };
    }
};
