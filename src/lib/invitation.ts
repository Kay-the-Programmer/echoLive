
export function getInvitationLink(userId: string): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/signup?ref=${userId}`;
}

export function copyInvitationLink(userId: string): Promise<void> {
    const link = getInvitationLink(userId);
    return navigator.clipboard.writeText(link);
}
