import { URL } from "url";
import { Body, Container, Font, Head, Html, Tailwind, Link } from "@react-email/components";
import type { ReactNode } from "react";

export function EmailTemplate({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Tailwind>
			<Html>
				<Head>
					<Font
						webFont={{
							url: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
							format: "woff2",
						}}
						fontFamily="Inter"
						fallbackFontFamily="sans-serif"
					/>
				</Head>
				<Body>
					<Container className="max-w-[50ch]">{children}</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}

export function SignUpEmail() {
	return (
		<EmailTemplate>
			<h1 className="text-3xl">Спасибо за регистрацию!</h1>
		</EmailTemplate>
	);
}

export function ResetPasswordEmail({
	url,
}: {
	url: string;
}) {
	return (
		<EmailTemplate>
			<h1 className="text-3xl">Восстановление пароля</h1>
			<Link href={url}>Восстановить пароль</Link>
		</EmailTemplate>
	);
}

export function VerificationEmail({ token }: { token: string }) {
	const verificationUrl = new URL(
		"test",
		// env.NEXT_PUBLIC_URL
	);
	verificationUrl.pathname = "/auth/verification";
	verificationUrl.searchParams.append("token", token);
	return (
		<EmailTemplate>
			<h1 className="text-3xl">Подтвердите ваш адрес электронной почты</h1>
			<Link href={verificationUrl.href}>Подтвердить</Link>
		</EmailTemplate>
	);
}
