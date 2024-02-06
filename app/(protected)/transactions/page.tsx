"use client"
import { NextPage } from 'next';
import Head from 'next/head';
import { PlusCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Transactions: NextPage = () => {
    const router=useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>Transactions</title>
            </Head>
            <div className="text-xl font-bold mb-8">
                Transactions
            </div>
            <div className="flex flex-col space-y-4">
            
                <button className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                onClick={()=>{
                    router.push('/transactions/new-transaction')
                }}>
                    <PlusCircle size={24} />
                    <span>New Transaction</span>
                </button>
             
                <button className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-150 ease-in-out"
                  onClick={()=>{
                    router.push('/transaction-history')
                }}>
                    <Clock size={24} />
                    <span>Transaction History</span>
                </button>
            </div>
        </div>
    );
};

export default Transactions;
