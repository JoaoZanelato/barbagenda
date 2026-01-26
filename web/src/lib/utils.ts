import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Essa função permite usar: cn("bg-red-500", condicao && "text-white")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
