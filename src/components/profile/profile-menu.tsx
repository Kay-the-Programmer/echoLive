'use client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Award, Trophy, Store, UserPlus, Heart, Medal, Star, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IconLinkItem = ({ href, onClick, icon: Icon, label, color, children }: { href?: string; onClick?: () => void; icon: React.ElementType; label: string; color: string; children?: React.ReactNode; }) => {
    const content = (
        <>
            <Icon className="h-8 w-8" style={{ color: color }} />
            <span className="text-xs text-muted-foreground">{label}</span>
            {children}
        </>
    );

    const className = "relative flex flex-col items-center justify-center gap-2 text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md";

    if (href && !onClick) {
        return <Link href={href} className={className}>{content}</Link>;
    }

    return <button onClick={onClick} className={className}>{content}</button>;
};

export function ProfileMenu() {
    const { toast } = useToast();

    const handleInvite = async () => {
        const shareUrl = window.location.origin + '/signup';
        const shareData = {
            title: 'Join me on EchoLive!',
            text: `Come hang out on EchoLive! It's the best place for live streams and parties.`,
            url: shareUrl
        };

        // Check if the Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast({
                    title: "Invite Sent!",
                    description: "Thanks for sharing EchoLive.",
                });
            } catch (err) {
                console.error("Share failed:", err);
                // This can happen if the user cancels the share sheet
                // No toast needed for cancellation.
            }
        } else {
            // Fallback for desktop browsers or unsupported mobile browsers
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast({
                    title: "Invite Link Copied!",
                    description: "The signup link has been copied to your clipboard.",
                });
            } catch (err) {
                console.error('Failed to copy: ', err);
                toast({
                    variant: "destructive",
                    title: "Could not copy link",
                    description: "Please copy the link manually.",
                });
            }
        }
    };
    
    return (
        <Card className="rounded-t-2xl rounded-b-lg bg-muted p-4">
            <div className="grid grid-cols-4 gap-y-4">
                <IconLinkItem href="#" icon={Gift} label="Reward" color="#ef4444" />
                <IconLinkItem href="/leaderboards" icon={Trophy} label="Rank" color="#f97316" />
                <IconLinkItem href="/shop" icon={Store} label="Store" color="#f59e0b" />
                <IconLinkItem onClick={handleInvite} icon={UserPlus} label="Invite" color="#3b82f6">
                    <div className="absolute -top-1 right-2 bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        active invitee
                    </div>
                </IconLinkItem>
                <IconLinkItem href="/levels" icon={Award} label="Honor Level" color="#8b5cf6" />
                <IconLinkItem href="#" icon={Heart} label="Fan Club" color="#ec4899" />
                <IconLinkItem href="/admin" icon={Medal} label="Medal Wall" color="#ef4444" />
                <IconLinkItem href="/missions" icon={Star} label="Missions" color="#22c55e" />
            </div>
        </Card>
    );
}
