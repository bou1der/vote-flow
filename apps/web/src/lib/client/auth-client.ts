import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "api";
import { env } from "~/env";

export const authClient = createAuthClient({
	baseURL: `${env.NEXT_PUBLIC_API_URL}`,
	plugins: [inferAdditionalFields<Auth>()],
});

export const authErrorCodes = {
	// [authClient.$ERROR_CODES.USER_ALREADY_EXISTS]: {
	//   ru: "Пользователь с таким email уже существует",
	// },
	// [authClient.$ERROR_CODES.EMAIL_NOT_VERIFIED]: {
	//   ru: "Подтвердите ваш email для входа в аккаунт",
	// },
	// [authClient.$ERROR_CODES.INVALID_PASSWORD]: {
	//   ru: "Неверный пароль",
	// },
	// [authClient.$ERROR_CODES.INVALID_EMAIL]: {
	//   ru: "Неверный email или пароль",
	// },
};
