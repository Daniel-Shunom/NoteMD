// dr-cloud/hooks/useAuth.tsx

import { useContext } from "react";
import { AuthContext, AuthContextProps } from "../context/Authcontext";

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
