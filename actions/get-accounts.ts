"use server"


import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";
import { getAccountByUserId } from "@/data/account";
import { use } from "react";
export const getAllAccounts = async () => {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    const userId = dbUser.id;

    const existingAccount = await getAccountByUserId(userId);

    if (!existingAccount) {
        // Handle the case where no account is found
        return { error: "No account found, redirect to login." };
    }

    // Correctly using the existingAccountId in the not filter
    const existingAccountId = existingAccount.id;

    try {
        // Assuming you want to exclude users based on their associated account ID
        const users = await db.bankAccount.findMany({
            where: {
                accountId: {
                    not: existingAccountId // assuming 'accountId' is the correct field you want to match against
                }
            }
        });

        return users;
    } catch (error) {
        return { error: "Failed to fetch users" };
    }
};
