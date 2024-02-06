"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";
import { getAccountByUserId } from "@/data/account";
 
export const getBankAccounts = async () => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
  
    const existingUserId = dbUser.id;

    const existingAccount = await getAccountByUserId(existingUserId);
  
   
    if (!existingAccount) {
      return redirect('/login');
    }
  
    const accountId = existingAccount.id;
  
    
    try {
      const bankAccounts = await db.bankAccount.findMany({
        where: { accountId }
      });
  
      return bankAccounts;
    } catch {
      return null;
    }
  }
  