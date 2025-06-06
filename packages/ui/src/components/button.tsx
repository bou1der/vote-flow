import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import Loader from "./loader";

import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				transparent: "bg-transparent border-0 hover:bg-transparent",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-foreground underline-offset-4 hover:underline",
				input: "bg-input hover:bg-input/90 border-input border text-foreground",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	chevron?: boolean;
	loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, disabled, children, loading, chevron = false, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";

		function Shevron({ children }: { children: React.ReactNode }) {
			return (
				<span className="flex ui-text-zinc-700 items-center gap-1 justify-between w-full">
					{children}
					<ChevronDown className="size-5 text-white" />
				</span>
			);
		}

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={loading || disabled}
				{...props}
			>
				{loading ? <Loader size="sm" /> : chevron ? <Shevron>{children}</Shevron> : children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
