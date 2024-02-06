"use client"
import { useEffect, useState } from "react";
// Adjust the import path to match the location of your getAllAccounts action
import { getAllAccounts } from "@/actions/get-accounts";
import { Button } from "./ui/button";

// Define a type for BankAccount
type BankAccount = {
  accountNumber: string;
  accountName: string;
  accountHolderName: string | null; // Assuming accountHolderName can be null
};

const BankAccountsPage = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    // Fetch bank accounts when the component mounts
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const result = await getAllAccounts();

      if ('error' in result) {
        // Handle error if any
        console.error(result.error);
        return;
      }

      // TypeScript assertion to ensure result is of type BankAccount[]
      setBankAccounts(result as BankAccount[]);
    } catch (error) {
      console.error("Failed to fetch bank accounts:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Bank Accounts List</h1>
    <div className="space-y-6">
      {bankAccounts.map((account) => (
        <div key={account.accountNumber} className="p-6 shadow-xl rounded-xl bg-blue-50 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">{account.accountName}</h2>
          <p className="text-md text-gray-600">Account Number: <span className="font-medium">{account.accountNumber}</span></p>
          <p className="text-md text-gray-600">Holder Name: <span className="font-medium">{account.accountHolderName || "No holder name"}</span></p>
          <Button
           
            onClick={() => window.location.href=`/transactions/new-transaction/send-money?accountNumber=${account.accountNumber}`}
          >
            Send Money
          </Button>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default BankAccountsPage;
