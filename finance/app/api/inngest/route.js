import { inngest } from "@/app/lib/inngest/client";
import { generateMonthlyReports, helloWorld } from "@/app/lib/inngest/functions";
import { serve } from "inngest/next";
import { checkBudgetAlerts } from "@/app/lib/inngest/functions";
import {triggerRecurringTransactions, processRecurringTransaction} from "@/app/lib/inngest/functions"





// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
   checkBudgetAlerts, triggerRecurringTransactions, 
   processRecurringTransaction,
   generateMonthlyReports,
  ],
});
