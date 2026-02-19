import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("pb-4 border-b border-border/50", className)}>
      <div className={cn(
        "flex items-center",
        children ? "justify-between" : "justify-center"
      )}>
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground text-glow">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
