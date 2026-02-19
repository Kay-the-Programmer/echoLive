'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { platformRules } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';
import { reportViolation } from '@/app/actions/report-violation';

interface ReportViolationDialogProps {
  allUsers: User[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportViolationDialog({ allUsers, isOpen, onOpenChange }: ReportViolationDialogProps) {
  const { toast } = useToast();
  const { user: adminUser } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedUserId('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const userId = formData.get('userId') as string;
    const ruleTitle = formData.get('ruleTitle') as string;
    const notes = formData.get('notes') as string;

    const result = await reportViolation({
      userId,
      ruleTitle,
      notes,
      reportingAdminId: adminUser.uid,
    });

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      onOpenChange(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a Rules Violation</DialogTitle>
          <DialogDescription>
            Select a user, the rule they broke, and provide any relevant details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Violator</Label>
            <Select name="userId" value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger id="user-select">
                 <SelectValue placeholder="Select a user to report" />
              </SelectTrigger>
              <SelectContent>
                {allUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name} ({user.numericId})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-select">Rule Broken</Label>
            <Select name="ruleTitle" required>
              <SelectTrigger id="rule-select">
                <SelectValue placeholder="Select the rule that was broken" />
              </SelectTrigger>
              <SelectContent>
                {platformRules.map((rule, index) => (
                  <SelectItem key={index} value={rule.title}>
                    {rule.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Provide details about the violation (optional)" />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Report Violation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
