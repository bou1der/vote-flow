import { type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { buttonVariants } from "./button";
import { cn } from "../lib/utils";

interface ExtendedLinkProps extends ComponentPropsWithoutRef<typeof NextLink>, VariantProps<typeof buttonVariants> {}

const Link = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(
	({ className, size, variant, ...props }: ExtendedLinkProps, ref) => {
		return <NextLink {...props} ref={ref} className={cn(buttonVariants({ className, size, variant }))} />;
	},
);

Link.displayName = "Link";

export default Link;
