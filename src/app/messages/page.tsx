
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bot, UserCheck } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Messages"
        description="Stay connected with system updates, friends, and new people."
      />

      <Tabs defaultValue="system" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">
            <Bot className="mr-2 h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="friends">
             <UserCheck className="mr-2 h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="strangers">
             <Users className="mr-2 h-4 w-4" />
            Strangers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-6 text-center text-muted-foreground">
          <p>No system messages yet.</p>
        </TabsContent>
        <TabsContent value="friends" className="mt-6 text-center text-muted-foreground">
          <p>You haven't received any messages from friends.</p>
        </TabsContent>
        <TabsContent value="strangers" className="mt-6 text-center text-muted-foreground">
          <p>No messages from strangers.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
