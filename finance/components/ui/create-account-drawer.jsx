"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '../../app/lib/schema';
import Input from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import { toast } from 'sonner';
import useFetch from '@/hooks/usefetch';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'CURRENT',
      balance: '',
      isDefault: false,
    },
  });

  const { data: newAccount,
     error, 
     loading: createAccountLoading,
      fn: createAccountFn, 
      setData } = useFetch(createAccount);

    useEffect(()=>{
        console.log("Effect ran", { newAccount, createAccountLoading });
        //return()=>{};
        if(newAccount && !createAccountLoading){
            toast.success("Account created successfully");
            reset();
            setOpen(false);

        }
    }, [createAccountLoading, newAccount])

    useEffect(()=>{
        if(error){
            toast.error(error.message || "Failed to create account")
        }
    }, [error]);


const onSubmit = async (data) => {
  await createAccountFn(data);
};

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <form className="space-y-4 px-4 pb-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Account Name</label>
            <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          {/* Account Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">Account Type</label>
            <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
          {/* Initial Balance */}
          <div className="space-y-2">
            <label htmlFor="balance" className="text-sm font-medium">Initial Balance</label>
            <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("balance", { valueAsNumber: true })} />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
          </div>
          {/* Set as Default */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Set as default</label>
              <p className='text-sm text-muted-foreground'>This account will be selected by default for transactions</p>
            </div>
            <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)} checked={watch("isDefault")} />
          </div>
          {/* Buttons */}
          <div className='flex gap-4 pt-4'>
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1" disabled={createAccountLoading}>
                Cancel
              </Button>
            </DrawerClose>
            <Button type="submit" className="flex-1">{createAccountLoading ?<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Account"}</Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;