'use server';

import { moderateTextFlow } from '@/ai/flows/moderate-text';
import { db } from '@/lib/firebase-admin';

interface ModerateChatActionInput {
    userId: string;
    text: string;
}

export async function moderateChatAction(input: ModerateChatActionInput): Promise<{success: boolean, error?: string}> {
  try {
    // 1. Get moderation result from the AI flow
    const moderationResult = await moderateTextFlow({ text: input.text });

    // 2. If it's a violation, write to the database from the server action
    if (moderationResult && moderationResult.isViolation && moderationResult.ruleTitle) {
      const violationRef = db.collection('violations').doc();
      await violationRef.set({
        userId: input.userId,
        ruleTitle: moderationResult.ruleTitle,
        violationDate: new Date().toISOString(),
        reportingAdminId: 'system-moderator',
        notes: `Automated detection. Reason: ${moderationResult.reason || 'N/A'}. Original text: "${input.text}"`,
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to moderate chat:", error);
    // Return a more detailed error message to help debug.
    const errorMessage = error.message || JSON.stringify(error);
    return { success: false, error: `Server Error: ${errorMessage}` };
  }
}
