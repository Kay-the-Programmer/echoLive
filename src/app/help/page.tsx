'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Mail, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LiveChatDialog } from '@/components/help/live-chat-dialog';
import { faqs } from '@/lib/data';

export default function HelpPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Help Center</h1>
        <div className="w-9" />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <p className="text-center text-muted-foreground mb-8">Find answers to common questions or contact our support team.</p>
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <MessageCircle />
                          Live Chat
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">
                          Chat with a support agent directly for immediate assistance.
                      </p>
                      <Button onClick={() => setIsChatOpen(true)}>Start Chat</Button>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Mail />
                          Email Support
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">
                          Get help via email for less urgent issues. We'll respond within 24 hours.
                      </p>
                      <Button asChild variant="secondary">
                          <a href="mailto:support@echolive.app">Contact Support</a>
                      </Button>
                  </CardContent>
              </Card>
            </div>
        </div>
      </main>
      <LiveChatDialog isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
