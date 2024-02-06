"use client";



import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  
};

export const RoleGate = ({
  children,
 
}: RoleGateProps) => {
  const role = useCurrentRole();


  return (
    <>
      {children}
    </>
  );
};
