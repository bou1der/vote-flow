import type { ValidationError } from "elysia";
import { logger } from "utils/logger";

export function ApiErrorLogger({
	request,
	path,
	error,
	code,
}: {
	request: Request;
	path: string;
	error?: Readonly<Error> | Readonly<ValidationError> | unknown;
	code?:
		| number
		| "UNKNOWN"
		| "VALIDATION"
		| "NOT_FOUND"
		| "PARSE"
		| "INTERNAL_SERVER_ERROR"
		| "INVALID_COOKIE_SIGNATURE";
}) {
	const { method, body } = request;

	if (!code) {
		logger.info({
			path,
			method,
		});
		return;
	}

	switch (code) {
		case "VALIDATION":
			logger.info({
				error,
			});
			return;
		case "UNKNOWN":
		case "INTERNAL_SERVER_ERROR":
			logger.error({
				path: `${method.toUpperCase()}:${path}`,
				error,
			});
			return;
	}
}
