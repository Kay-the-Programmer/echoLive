// This file is deprecated. Its logic has been moved to secure API routes:
// - /src/app/api/admin/revenue-withdrawal/route.ts
// - /src/app/api/admin/withdrawals/route.ts
//
// These server actions are no longer used and can be safely deleted.

export async function approveWithdrawalRequest(
  withdrawalId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    return { success: false, error: "This function is deprecated. Use the API route instead." };
}

export async function rejectWithdrawalRequest(
  withdrawalId: string
): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "This function is deprecated. Use the API route instead." };
}

export async function withdrawAppRevenue(
  walletAddress: string,
  amount: number,
  callerId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    return { success: false, error: "This function is deprecated. Use the API route instead." };
}

export async function deleteWithdrawalRequest(
  withdrawalId: string
): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "This function is deprecated. Use the API route instead." };
}
