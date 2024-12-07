import { type VariantProps, cva } from "class-variance-authority";
import NextLink  from "next/link";
import * as React from "react";
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from "~/lib/client/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-white hover:text-black",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-background",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost: "hover:bg-accent hover:text-accent-foreground",
        underline: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2",
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



interface ExtendedLinkProps extends ComponentPropsWithoutRef<typeof NextLink>, VariantProps<typeof linkVariants> {}

const Link = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(({ className, size, variant, ...props }: ExtendedLinkProps, ref) => {
	return (
    <NextLink
      {...props}
      ref={ref}
      className={cn(linkVariants({ className, size, variant }))}
      />
  );
});

Link.displayName = 'Link';

export default Link;
