'use client';

import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { FacebookIcon, YouTubeIcon } from '@/components/icons';
import {
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  Backpack,
  Fingerprint,
  LogOut,
  Heart,
  ChevronRight,
} from 'lucide-react';

const SettingsItem = ({ href, icon: Icon, label, children }: { href: string, icon: React.ElementType, label: string, children?: React.ReactNode }) => (
    <Link href={href} className="flex items-center p-3 text-foreground">
        <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="flex-grow">{label}</span>
        <div className="flex items-center text-muted-foreground">
            {children}
            <ChevronRight className="h-5 w-5" />
        </div>
    </Link>
);

const LogoutItem = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: React.ElementType, label: string }) => (
    <button onClick={onClick} className="w-full flex items-center p-3 text-destructive">
        <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="flex-grow text-left">{label}</span>
        <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
    </button>
);

export function SettingsMenu() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
      <Card className="p-0 rounded-none md:rounded-lg">
         <div className="divide-y divide-border">
            <SettingsItem href="#" icon={BarChart3} label="Live data" />
            <SettingsItem href="/help" icon={HelpCircle} label="Help">
                <span className="text-xs mr-1">24h</span>
            </SettingsItem>
            <SettingsItem href="/agent" icon={Briefcase} label="Agent Panel" />
            <SettingsItem href="/levels" icon={Layers} label="Level" />
            <SettingsItem href="#" icon={Backpack} label="Backpack" />
            <SettingsItem href="#" icon={Fingerprint} label="Auth" />
            <LogoutItem onClick={handleLogout} icon={LogOut} label="Log Out" />
            <SettingsItem href="#" icon={Heart} label="Follow Us">
                <div className="flex items-center gap-2 mr-2">
                    <FacebookIcon className="h-5 w-5" />
                    <YouTubeIcon className="h-5 w-5" />
                </div>
            </SettingsItem>
         </div>
      </Card>
  );
}
