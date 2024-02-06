"use client"
import { useEffect, useState } from "react";
import { getAllUsers } from "@/actions/get-all-users"; // Import the getAllUsers server action
import AccountsPage from "@/components/account-list";

// Define a type for User
type User = {
  id: string;
  name: string;
};

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();

      if ('error' in result) {
        // Handle error if any
        console.error(result.error);
        return;
      }

      // TypeScript assertion to ensure result is of type User[]
      setUsers(result as User[]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
    <AccountsPage />
    </div>
  );
};

export default Page;
