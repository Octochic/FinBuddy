import React from 'react'
// import { get } from 'react-hook-form';
import { notFound } from 'next/navigation';
import { getAccountWithTransactions } from '@/actions/accounts';
import TransactionTable from '../components/transaction-table';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import {AccountChart} from '../components/account-chart';



export default async function AccountsPage({ params }) {
    
    const accountData = await getAccountWithTransactions(params.id);
    if(!accountData){
        notFound();
    }
    const {transactions, ...account} = accountData;



  return (

    <div className="space-y-8 px-5  ">
        <div className='flex gap-4 items-end justify-between p-6'>
      <div>
        <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
            {account.name}
        </h1>
      <p className="text-muted-foreground">
        {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
      </p>
      </div>
      <div className='text-right'>
        <div className='text-3xl sm:text-2xl font-bold'> ${parseFloat(account.balance).toFixed(2)}</div>
        <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions</p>
      </div>
    </div>
{/* 
    // {Chart Section} */}

 <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

    {/* // {Transactions Table} */}

    <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable  transaction={Array.isArray(transactions) ? transactions : []} />
    </Suspense>
    </div>
   

  )
}




