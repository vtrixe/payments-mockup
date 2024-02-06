"use client"
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { addBankAccount } from "@/actions/add-bank-account";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useRouter } from "next/navigation";

const Page = () => {
  const [error, setError] = useState<string | undefined>("");
  const router=useRouter();
  const [success, setSuccess] = useState<string | undefined>("");
  const [showAccountData, setShowAccountData] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [accountData, setAccountData] = useState<{ balance: string; accountNumber: string ; accountName : string;   accountHolderName : string | null; } | undefined>(
    undefined
  );

  const onSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await addBankAccount();

      if (response.error) {
        setError("Error");
      } else {

        setAccountData(response.bankAccount)
      
        setShowAccountData(true); // Show the account data
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const onConfirm = async () => {
    try {
      setIsCreating(true);
      const response = await addBankAccount(); // Call a function to create the account (you need to implement this)

      if (response.error) {
        setError("Error");
      } else if (response.success) {
        setSuccess("Successful");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <CardWrapper headerLabel="Bank Account" backButtonLabel="Back" backButtonHref="/profile" >
    <div className="p-4 space-y-4">
      {showAccountData ? (
        <div>
          <p className="text-lg font-semibold">Account Name: {accountData?.accountName}</p>
          <p className="text-lg">Account Balance: {accountData?.balance}</p>
          <p className="text-lg">Account Number: {accountData?.accountNumber}</p>
          <p className="text-lg">Account Number: {accountData?.accountHolderName}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onConfirm}
            disabled={isCreating}
          >
            Confirm
          </button>
        </div>
      ) : (
        <div>
          <Button
            className=""
            onClick={onSubmit}
          >
            Add Bank Account
          </Button>
          <Button
            className=""
            onClick={()=>{
                router.push('/transactions')
            }}
          >
           
         Transactions
          </Button>
        </div>
      )}
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">Success: {success}</p>}
    </div>
  </CardWrapper>
  );
};

export default Page;
