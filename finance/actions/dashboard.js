"use server"
import { db } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized ={...obj};
    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }
    return serialized}
    // return {
    //     id: obj.id,
    //     amount: obj.amount,
    //     date: obj.date,
    //     description: obj.description
    // };


export async function createAccount(data){
    try{
         const {userId} = await auth();
         if(!userId){
            return {error: "Unauthorized"};
         }
         const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
         });
         if(!user){
            return {error: "User not found"};
         }
        // convert balance to float before saving
        const balancefloat = data.balance;
        if (typeof balancefloat !== "number" || isNaN(balancefloat)) {
            return {error: "Invalid balance"};
        }
        // check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            },
        });
        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

        if(shouldBeDefault){
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            });
        }
        console.log("Creating account with:", {
        name: data.name,
        type: data.type,
        balance: balancefloat,
        userId: user.id,
        isDefault: shouldBeDefault
        });

        const account = await db.account.create({
            data: {
                name: data.name,
                type: data.type,
                balance: balancefloat,
                userId: user.id,
                isDefault: shouldBeDefault
            },
            });
        console.log("Account created:", account);
        console.log(data);
        const plainAccount = {
        ...account,
        balance: Number(account.balance), // or account.balance.toString() if you want a string
        };
        console.log("Plain account:", plainAccount);

        // Return the created account's relevant fields
        revalidatePath("/dashboard");
        return {success: true, data: {
            id: plainAccount.id,
            name: plainAccount.name,
            type: plainAccount.type,
            balance: plainAccount.balance,
            isDefault: plainAccount.isDefault
        }};
    } catch(error){
        throw new Error(error.message);
    }
}

export async function getAccounts() {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }
    const user = await db.user.findUnique({
        where:{ clerkUserId: userId }
    });

    if(!user){
        throw new Error("User not found");
    }
    const accounts = await db.account.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        },
        
        include:{
            _count: {
                select: {
                    transactions: true
                }
            } 
        }
    });
    const serializedAccount = accounts.map(serializeTransaction);
    return serializedAccount;
}