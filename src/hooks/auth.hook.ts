import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("The AuthContext should be initialized");
  }

  return context;
}
