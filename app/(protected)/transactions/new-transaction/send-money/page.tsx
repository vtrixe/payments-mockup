"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getbankAccountByNumber } from '@/data/getbankAccountbyNumber';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { getBankAccounts } from '@/actions/get-bank-accounts';
import { getBankAccountById } from '@/actions/get-current-account';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";

// Define types for account details and form inputs
type AccountDetails = {
  id: string;
  accountId: string;
  bankName: string;
  balance: string;
  accountNumber: string;
  accountHolderName: string | null;
  createdAt: Date;
  updatedAt: Date;
  accountName: string;
};

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
    amount: string;
    currency: string;
    status: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  


const SendMoneyPage: React.FC = () => {

    const sendMoney = async () => {
        if (!selectedAccount || !receiverAccount?.id || !amount) {
          alert('Please fill in all required fields.');
          return;
        }
    
        const payload = {
          senderBankAccountId: selectedAccount,
          receiverBankAccountId: receiverAccount.id,
          amount: parseFloat(amount),
          currency: 'INR',
          description: remarks,
        };
    
        try {
          const response = await fetch('https://payments-mockup.vercel.app/api/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) {
            throw new Error('Failed to send money');
          }
    
          const data = await response.json();
          setTransactionSuccess(data); // Store the transaction data in state
          alert('Transaction successful!');
        } catch (error) {
          console.error(error);
          alert('Transaction failed: ' + error);
        }
      };
    
      const searchParams = useSearchParams();
      const accountNumber = searchParams.get("accountNumber");
      const [receiverAccount, setReceiverAccount] = useState<AccountDetails | null>(null);
      const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
      const [selectedAccount, setSelectedAccount] = useState<string>('');
      const [amount, setAmount] = useState<string>('');
      const [remarks, setRemarks] = useState<string>('');
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>('');
      const [transactionSuccess, setTransactionSuccess] = useState<TransactionSuccessResponse | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      setLoading(true);
      if (!accountNumber) {
        setError('Account number is required');
        setLoading(false);
        return;
      }

      try {
        const accountData = await getbankAccountByNumber(accountNumber);
        setReceiverAccount(accountData);
        if (!accountData) {
          setError('No account found');
        }
      } catch (err) {
        setError('An error occurred while fetching the account details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    

    fetchAccountDetails();
    // fetchSenderAccounts();
  }, [accountNumber]);

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

  useEffect(() => {
    if (selectedAccount) {
      const fetchAccountDetails = async () => {
        const accountDetails = await getBankAccountById(selectedAccount);

        console.log(accountDetails)
      
      };
  
      fetchAccountDetails();
    }
  }, [selectedAccount]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!receiverAccount) {
    return <div>No account details available.</div>;
  }

  return (
    <div>
      <CardWrapper headerLabel="Send Money" backButtonLabel="Back" backButtonHref="/transactions/new-transaction">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Receiver Account Details</h2>
          <p>Bank Name: {receiverAccount.bankName}</p>
          <p>Account Number: {receiverAccount.accountNumber}</p>
          <p>Account Holder Name: {receiverAccount.accountHolderName ?? 'N/A'}</p>

          <h2 className="text-xl font-semibold mt-6">Transaction Details</h2>
          {bankAccounts.length > 0 && (
  <select
    value={selectedAccount}
    onChange={(e) => setSelectedAccount(e.target.value)}
    className="bg-white border border-gray-300 rounded-md p-2 overflow-hidden"
    style={{textOverflow: 'ellipsis', width: '100%'}}
  >
    {bankAccounts.map((account) => (
      <option key={account.id} value={account.id} style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
        {account.bankName} - {account.accountNumber} - {account.accountHolderName ?? 'N/A'} - {account.accountName}
      </option>
    ))}
  </select>
)}

          <input
            type="text"
            placeholder="Amount"
            className="block w-full p-2 border border-gray-300 rounded mt-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Remarks"
            className="block w-full p-2 border border-gray-300 rounded mt-4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
         <Button onClick={()=>{
            sendMoney()
         }} >
            Send
         </Button>

        </div>

        {transactionSuccess && (
         <Dialog>
         <DialogTrigger >
            <Button>

            Get Transaction details

            </Button>
        
         </DialogTrigger>
         <DialogContent className="p-4 w-auto bg-black text-white border-spacing-2 p">
         <div>
            <h3 className="text-lg font-semibold mt-6">Transaction Successful</h3>
            <p>ID: {transactionSuccess.id}</p>
            <p>Sender Account: {transactionSuccess.senderBankAccountId}</p>
            <p>Reciever Account {transactionSuccess.receiverBankAccountId}</p>
            <p>Amount: {transactionSuccess.amount}</p>
            <p>Currency: {transactionSuccess.currency}</p>
            <p>Status: {transactionSuccess.status}</p>
            <p>Description: {transactionSuccess.description}</p>
            <p>CreatedAt: {transactionSuccess.createdAt}</p>
          </div>
         </DialogContent>
       </Dialog>
        )}
      </CardWrapper>
    </div>
  );
};

export default SendMoneyPage;
