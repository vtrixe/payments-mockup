import { currentUser } from "@/lib/auth";

import { getUserById } from "@/data/user";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {



  
  return ( 
    <div className="h-full w-full flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-200 to-blue-400">

  
    <div className="flex-grow flex flex-col items-center justify-center gap-y-10">
      {children}
    </div>
  </div>
  
   );
}
 
export default ProtectedLayout;