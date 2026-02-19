'use client';

import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

export function AgentCard() {
    const { user: authUser } = useUser();
    const userPath = useMemo(() => (authUser ? `users/${authUser.uid}` : null), [authUser]);
    const { data: user } = useDoc<User>(userPath);
    
    return (
        <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg">{user?.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-primary/20 text-primary">LV.{user?.level}</Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <span>ID: {user?.numericId}</span>
                                    <Button variant="ghost" size="icon" className="h-5 w-5">
                                        <Copy className="h-3 w-3"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                     <Link href="/profile">
                        <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
