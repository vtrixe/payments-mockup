"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { getBankAccounts } from '@/actions/get-bank-accounts';
import { getTransactions } from '@/actions/get-transactions'; 
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BankAccount {
  id: string;
  accountId: string;
  bankName: string;
  balance: string;
  accountNumber: string;
  accountHolderName: string | null;
  createdAt: Date;
  updatedAt: Date;
  accountName: string;
}
interface TransactionSuccessResponse {
  id: string;
  senderBankAccountId: string;
  receiverBankAccountId: string;
  amount: string; // Use the appropriate type or import it if necessary
  currency: string;
  status: string;
  description: string; // Consider whether you want to allow null here
  createdAt: string;
  updatedAt: string;
}
const Navbar = () => {
  const pathname = usePathname();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [transactions, setTransactions] = useState<TransactionSuccessResponse[]>([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      const result = await getBankAccounts();
      if (result && 'error' in result) {
        console.error(result.error);
        setBankAccounts([]);
      } else {
        setBankAccounts(result || []);
        if (result && result.length > 0) {
          setSelectedAccount(result[0].id);
        }
      }
    };

    fetchBankAccounts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedAccount) return;
      const result = await getTransactions(selectedAccount);
      if (result && 'error' in result) {
        console.error(result.error);
        setTransactions([]);
      } else {
        // Convert Decimal amount to string and dates to ISO string
        const formattedTransactions = result.map(transaction => ({
          ...transaction,
          amount: transaction.amount.toString(), // Convert amount to string
          description: transaction.description ?? '', // Ensure description is always a string
          createdAt: transaction.createdAt.toISOString(), // Convert Date to ISO string
          updatedAt: transaction.updatedAt.toISOString(), // Convert Date to ISO string
        }));
        setTransactions(formattedTransactions);
      }
    };
  
    fetchTransactions();
  }, [selectedAccount]);
  
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-md sticky top-0 z-50">
    <div className="flex gap-x-2 items-center">
      <Button 
        asChild
        variant={pathname === "/profile" ? "default" : "outline"}
      >
        <Link href="/profile" >

          <Button>
        Profile 
        </Button>
        
        </Link>
      </Button>
      {bankAccounts.length > 0 && (
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="bg-white border border-gray-300 rounded-md p-2 text-gray-700"
        >
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {`${account.bankName} - ${account.accountNumber} - ${account.accountHolderName ?? 'N/A'} - ${account.accountName} - ${account.balance}`}
            </option>
          ))}
        </select>
      )}
    </div>
    <UserButton />
   
    <div className="absolute top-full mt-4 p-4 bg-white rounded-xl shadow-lg max-h-[calc(100vh-100px)] overflow-auto w-full">
  {transactions.map((transaction) => (
    <div key={transaction.id} className="p-4 bg-gray-100 rounded-md m-2 shadow">
      <Dialog>
        <DialogTrigger>
          <div className="flex flex-col">
            {/* Move transaction ID outside and above the Button */}
            <p className="mb-2">ID: {transaction.id}</p>
            <Button>
              Get Transaction Details
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="p-4 w-auto bg-black text-white border-spacing-2">
          <div>
            <p>ID: {transaction.id}</p>
            <p>Sender Account: {transaction.senderBankAccountId}</p>
            <p>Receiver Account: {transaction.receiverBankAccountId}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Currency: {transaction.currency}</p>
            <p>Status: {transaction.status}</p>
            <p>Description: {transaction.description}</p>
            <p>CreatedAt: {transaction.createdAt}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ))}
</div>

  </nav>
  
  );
};

export default Navbar;
