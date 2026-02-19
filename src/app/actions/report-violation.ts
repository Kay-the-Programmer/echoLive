'use server';

import { db } from '@/lib/firebase-admin';
import type { Violation } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';

interface ReportViolationPayload {
    userId: string;
    ruleTitle: string;
    notes?: string;
    reportingAdminId: string;
}

export async function reportViolation(payload: ReportViolationPayload): Promise<{success: boolean, error?: string, message?: string}> {
    const { userId, ruleTitle, notes, reportingAdminId } = payload;

    if (!userId || !ruleTitle || !reportingAdminId) {
        return { success: false, error: "Missing required violation information." };
    }

    const violationId = db.collection('violations').doc().id;

    const newViolation: Omit<Violation, 'id'> = {
        userId,
        ruleTitle,
        violationDate: Timestamp.now().toDate().toISOString(),
        reportingAdminId,
        notes: notes || '',
    };

    try {
        await db.collection('violations').doc(violationId).set(newViolation);
        return { success: true, message: "Violation reported successfully." };
    } catch (error: any) {
        console.error("Failed to report violation:", error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
}
