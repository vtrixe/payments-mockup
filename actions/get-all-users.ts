"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";
import { getAccountByUserId } from "@/data/account";

export const getAllUsers = async () => {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    const userId = dbUser.id;

    try {
        // Use the 'not' operator to exclude the current user's ID
        const users = await db.user.findMany({
            where: {
                id: {
                    not: userId
                }
            }
        });

        return users;
    } catch {
        return { error: "Failed to fetch users" };
    }
};
