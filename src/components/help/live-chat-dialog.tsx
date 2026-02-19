'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { answerFaqQuestion } from '@/ai/flows/faq-agent';

interface LiveChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'agent';
};

const agentNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley'];

export function LiveChatDialog({ isOpen, onOpenChange }: LiveChatDialogProps) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [agentName, setAgentName] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const randomName = agentNames[Math.floor(Math.random() * agentNames.length)];
            setAgentName(randomName);
            setMessages([{ id: 1, text: `Hello! My name is ${randomName}. How can I help you today?`, sender: 'agent' }]);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                 viewport.scrollTop = viewport.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
        };

        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await answerFaqQuestion({ question: currentInput, agentName: agentName });
            const newAgentMessage: Message = {
                id: Date.now() + 1,
                text: response.answer,
                sender: 'agent',
            };
            setMessages(prev => [...prev, newAgentMessage]);
        } catch (error) {
            console.error("FAQ Agent Error:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'agent',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[70vh] max-h-[600px]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Live Chat Support</DialogTitle>
          <DialogDescription>
            You are chatting with our support team.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
                {messages.map((message) => (
                    <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                         {message.sender === 'agent' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                         )}
                         <div className={cn(
                            "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                             message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                         )}>
                            {message.text}
                         </div>
                         {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL || undefined} />
                                <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                         )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-1">
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
            <Input 
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isTyping}>
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
