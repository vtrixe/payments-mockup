"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBankAccountById } from '@/actions/get-current-account';
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { getBankAccounts } from '@/actions/get-bank-accounts';; // Ensure this import path is correct

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

const Navbar = () => {
  const pathname = usePathname();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    const fetchBankAccounts = async () => {
      const result = await getBankAccounts();

      // Check if the result has an 'error' property
      if (result && 'error' in result) {
        // Handle the error state here, e.g., showing an error message or logging out
        console.error(result.error);
        // Ensure the state is not updated with incompatible types
        setBankAccounts([]);
        console.log(bankAccounts);
      } else {
        // Assuming result is BankAccount[] | null, directly use it to update state
        setBankAccounts(result || []);
        if (result && result.length > 0) {
          setSelectedAccount(result[0].id);
        }
      }
    };

    fetchBankAccounts();
  }, []); 

  // useEffect(() => {
  //   if (selectedAccount) {
  //     const fetchAccountDetails = async () => {
  //       const accountDetails = await getBankAccountById(selectedAccount);

  //       console.log(accountDetails)
      
  //     };
  
  //     fetchAccountDetails();
  //   }
  // }, [selectedAccount]);

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
    <div className="flex gap-x-2">
      <Button 
        asChild
        variant={pathname === "/profile" ? "default" : "outline"}
      >
        <Link href="/profile">Profile</Link>
      </Button>
      {bankAccounts.length > 0 && (
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="bg-white border border-gray-300 rounded-md p-2"
        >
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.bankName} - {account.accountNumber} -  {account.accountHolderName} -  {account.accountName} -  { account.balance}
              : 
            </option>
          ))}
        </select>
      )}
    </div>
    <UserButton />
  </nav>
  
  );
};

export default Navbar;
