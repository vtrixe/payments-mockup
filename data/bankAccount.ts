import { db } from "@/lib/db";

 
export const getBankAccounts = async ( accountId : string) => {
  
    
    try {
      const bankAccounts = await db.bankAccount.findMany({
        where: { accountId }
      });
  
      return bankAccounts;
    } catch {
      return null;
    }
  }
  