import Link from "next/link";
import { LogoIcon } from "../icons/logo";

export function Logo({
	className,
}: {
	className?: string;
}) {
	return (
		<Link href="/" className={className}>
			<LogoIcon />
		</Link>
	);
}
