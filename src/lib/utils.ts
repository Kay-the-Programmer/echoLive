import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViewerCount(count: number): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return millions.toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    const thousands = count / 1_000;
    return thousands.toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
}
