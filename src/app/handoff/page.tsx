
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';
import { handoffContent } from '@/lib/handoff-content';

export default function HandoffPage() {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(handoffContent);
    toast({
      title: 'Copied to Clipboard!',
      description: 'The complete project code is ready to be pasted.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button onClick={handleCopy} size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy All Code for Developer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Developer Handoff Document</CardTitle>
          <CardDescription>
            This file contains the full source code for the project. Copy and send this to your developer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none bg-card p-6 rounded-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {handoffContent}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
