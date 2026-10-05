import Link from 'next/link';
import { Lock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen bg-background">
      <div className="flex flex-col items-center max-w-md text-center p-8 border rounded-xl shadow-sm bg-card">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have access to this project, or it doesn&apos;t exist.
        </p>
        <Link href="/editor" className={cn(buttonVariants({ variant: 'default' }))}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
