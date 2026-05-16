import { useContext } from "react";
import { CMSContext } from "../context/CMSContext";

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used inside CMSProvider");
  }
  return context;
};
