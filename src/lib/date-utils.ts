
import { addHours, subHours, startOfDay, isAfter, isBefore, format } from 'date-fns';

/**
 * Returns the start of the "Zambian Day" based on 18:00 ZM (16:00 UTC) reset.
 * If the current time is before 18:00 ZM, the day started at 18:00 ZM yesterday.
 * If the current time is after 18:00 ZM, the day started at 18:00 ZM today.
 */
export function getZambianDayStart(date: Date = new Date()): Date {
    const utcDate = new Date(date.getTime());

    // 18:00 Zambian is 16:00 UTC
    const resetHourUTC = 16;

    const currentUTCHour = utcDate.getUTCHours();

    const resetDate = new Date(utcDate);
    resetDate.setUTCHours(resetHourUTC, 0, 0, 0);

    if (currentUTCHour < resetHourUTC) {
        // Before reset, day started yesterday at 16:00 UTC
        resetDate.setUTCDate(resetDate.getUTCDate() - 1);
    }

    return resetDate;
}

/**
 * Returns the next reset time (18:00 ZM).
 */
export function getNextZambianReset(date: Date = new Date()): Date {
    const start = getZambianDayStart(date);
    const next = new Date(start);
    next.setUTCDate(next.getUTCDate() + 1);
    return next;
}

export function formatZambianTime(date: Date): string {
    // Zambia is UTC+2
    const zambiaDate = addHours(date, 2);
    return format(zambiaDate, 'yyyy-MM-dd HH:mm:ss');
}
