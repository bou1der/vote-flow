import { headers as getNextHeaders } from "next/headers";

export async function headers(): Promise<Record<string, string | undefined>> {
	const h = await getNextHeaders();
	const headers: Record<string, string | undefined> = {};
	for (const [key, value] of h.entries()) {
		headers[key] = value;
	}
	return headers;
}
