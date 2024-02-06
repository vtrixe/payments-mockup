"use server"
import { db } from "@/lib/db";
import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";

import { redirect } from "next/navigation";



export const addBankAccount = async () => {

    const user=await currentUser();

    function generateRandomAccountName(): string {
        // Add logic to generate random account names here
        const adjectives = ["Savings", "Checking", "Investment", "Personal", "Business"];
        const nouns = ["Account", "Fund", "Wallet", "Portfolio", "Vault"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective} ${randomNoun}`;
      }
      

    
  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  const existingUserId = dbUser.id;
  function generateRandomBalance(): number {
    return Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000; // Random balance between 10,000 and 100,000 INR
  }
  
  function generateRandomAccountNumber(): string {
    const accountNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    return accountNumber;
  }

  

  if (!existingUserId) {
    return redirect('/login');
  }

  try {
    const existingAccount = await getAccountByUserId(existingUserId); 
    const existingUser = await getUserById(existingUserId);
    
    if (existingAccount) {
      
      const newBankAccount = await db.bankAccount.create({
        data: {
            bankName: 'Payments bank',
            balance:  generateRandomBalance().toString(), 
            accountNumber:  generateRandomAccountNumber(),
            accountHolderName: existingUser?.name,
            accountName: generateRandomAccountName(),
            accountId: existingAccount.id
            
          },
      });

      return { success: true, bankAccount: newBankAccount }; // Return the created bank account data
  
    } else {
 
      console.error("existingAccount is null");
    }
  } catch (error) {
  
    console.error("Error:", error);
  }

 

  return { success: true }; // Return a proper JSON response
};