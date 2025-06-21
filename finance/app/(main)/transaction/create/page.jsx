
import { getAccounts } from '@/actions/dashboard'
import { getAccountWithTransactions} from '@/actions/accounts'
import { defaultCategories } from '@/data/categories';
// import { getTransaction } from "@/actions/transaction";
import AddTransactionForm from "../_components/transaction-form"
import React from 'react'

// const AddTransactionPage = async () => {
//     const account = await getAccounts();
//   return (
//     <div className='max-w-3xl mx-auto px-5'>
//         <h1 className='text-5xl gradient-title mb-8'>
//             Add Transaction
//         </h1>


//         <AddTransactionForm 
//         account ={account}
//         categories ={defaultCategories}
//         />
      
//     </div>
//   )
// }

// export default AddTransactionPage



export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getAccountWithTransactions(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{editId? "Edit" :"Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
        editId={editId}
      />
    </div>
  );
}