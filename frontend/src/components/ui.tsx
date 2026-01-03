import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'destructive' | 'secondary';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        const variants = {
            primary: "bg-primary text-primary-foreground shadow-lg shadow-indigo-500/20 hover:bg-primary/90 active:scale-95",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
            outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-95",
            ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
        } as const;
        const sizes = {
            sm: "h-8 px-3 text-xs rounded-md",
            md: "h-10 px-6 py-2 rounded-lg",
            lg: "h-12 px-10 text-base rounded-xl",
            icon: "h-9 w-9 rounded-md",
        } as const;
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-lg border-2 border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("glass rounded-2xl p-1", className)} {...props} />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 p-8", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-slate-50", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-8 pt-0", className)} {...props} />
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'success';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
    const variants = {
        default: "bg-primary/10 text-primary border-transparent",
        outline: "border-border text-foreground",
        success: "bg-emerald-500/10 text-emerald-600 border-transparent dark:text-emerald-400",
    } as const;
    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} />
    );
};
