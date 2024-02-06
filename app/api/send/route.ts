// pages/api/transactions/create.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse , NextRequest } from 'next/server';
import { db } from '@/lib/db'; // Adjust this import to match the actual path to your db instance
import { Prisma } from '@prisma/client';


export async function POST( req: Request) {
    if (req.method !== 'POST') {
        return new NextResponse("method not allowed", { status: 405 });
      }

  
    
      const { senderBankAccountId, receiverBankAccountId, amount, description, currency } = await req.json();

      console.log(receiverBankAccountId + senderBankAccountId);
    

      if (!senderBankAccountId || !receiverBankAccountId) {
        return new NextResponse("missing fields", { status: 400 });
    }
     
    
      try {
  
        const result = await db.$transaction(async () => {
   
          const senderAccount = await db.bankAccount.findUnique({
            where: { id: senderBankAccountId },
          });
          if (!senderAccount) {
            throw new Error('Sender account not found');
          }
    
       
          const receiverAccount = await db.bankAccount.findUnique({
            where: { id: receiverBankAccountId },
          });
          if (!receiverAccount) {
            throw new Error('Receiver account not found');
          }
    
          const senderCurrentBalance = parseFloat(senderAccount.balance);
          const transactionAmount = parseFloat(amount);
    
          if (senderCurrentBalance < transactionAmount) {
            throw new Error('Insufficient funds');
          }
    
          // Calculate new balances
          const updatedSenderBalance = (senderCurrentBalance - transactionAmount).toFixed(2); // Assuming two decimal places
          const receiverCurrentBalance = parseFloat(receiverAccount.balance);
          const updatedReceiverBalance = (receiverCurrentBalance + transactionAmount).toFixed(2);
    
          // Update sender's account
          await db.bankAccount.update({
            where: { id: senderBankAccountId },
            data: { balance: updatedSenderBalance },
          });
    
          // Update receiver's account
          await db.bankAccount.update({
            where: { id: receiverBankAccountId },
            data: { balance: updatedReceiverBalance },
          });
    
          // Create transaction record
          const transaction = await db.transaction.create({
            data: {
              senderBankAccountId,
              receiverBankAccountId,
              amount: new Prisma.Decimal(amount),
              currency,
              description: description || '',
              status: 'Completed', // or any initial status as per your application logic
            },
          });
    
          return transaction;
        });
    
        // Transaction successful
        return  NextResponse.json(result);
      } catch (error) {
        console.error('Transaction creation failed:', error);
        return new NextResponse("failed", { status: 500 });
  }

};
  

