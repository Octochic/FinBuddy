"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreHorizontal, RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import   Input  from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryColors } from '@/data/categories';
import { Chevron } from 'react-day-picker';
import { Trash } from 'lucide-react';
import { X } from 'lucide-react';
import { bulkDeleteTransactions } from '@/actions/accounts';
import { BarLoader } from 'react-spinners';
import { useEffect } from 'react';
import { toast } from 'sonner';
import useFetch from '@/hooks/usefetch';


const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transaction = [] }) => {
  const router = useRouter();


  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState(""); 

//   const filteredAndSortedTransactions = Array.isArray(transaction) ? transaction : []= useMemo(()=>{
//     let result = [...transaction];
//     //Apply search filter
//     if(searchTerm){
//         const searchLower = searchTerm.toLowerCase();
//         result = result.filter((transaction)=>
//             transaction.description?.toLowerCase().includes(searchLower));
//     }
//     return result;

//   },[
//     transaction,     
//     searchTerm,
//     typeFilter, 
//     recurringFilter,
//     sortConfig,

//   ]);

 // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transaction];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transaction, searchTerm, typeFilter, recurringFilter, sortConfig]);



  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  if (!Array.isArray(transaction) || transaction.length === 0) {
    return <div>No Transactions Found</div>;
  }

  const{
    loading: bulkDeleteLoading,
    fn: deleteFN,
    data: deleted,
  }= useFetch(bulkDeleteTransactions)
  
 const handleBulkDelete = async () => {
    if(!window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected transactions?`
    )){
        return;
    }

     await deleteFN({ids: selectedIds});
  }

  useEffect(()=>{
    if(deleted && !bulkDeleteLoading){
        toast.error("Transactions deleted successfully");
         setSelectedIds([]);
        router.refresh();
    }
  }, [deleted, bulkDeleteLoading, router]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

 
  return (
    <div className='space-y-4'>
        {bulkDeleteLoading && <BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* <div className="relative flex-1">
          <Search placeholder="Search transaction..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-full" />
        </div> */}
        
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className='rounded-md border'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                <div className='flex items-center'>
                  Date
                  <Chevron className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                <div className='flex items-center'>
                  Category
                  <Chevron className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                <div className='flex items-center justify-end'>
                  Amount
                  <Chevron className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => handleSelect(transaction.id)}
                    checked={selectedIds.includes(transaction.id)}
                  />
                </TableCell>
                <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className='capitalize'>
                  <span style={{
                    background: categoryColors[transaction.category] || '#888',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}>{transaction.category}</span>
                </TableCell>
                <TableCell className="text-right font-medium" style={{ color: transaction.type === "EXPENSE" ? "red" : "green" }}>
                  {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {transaction.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="gap-1 bg-purple-400 hover:bg-purple-200 text-white">
                            <RefreshCcw className="h-3 w-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className='font-medium'>Next Date:</div>
                            <div>{format(new Date(transaction.nextRecurringDate), 'PP')}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel onClick={() => router.push(`/transaction/${transaction.id}`)}>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => {
                        if (window.confirm("Are you sure you want to delete this transaction?")) {
                        deleteFN([transaction.id]);
                        }
                    }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
