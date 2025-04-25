"use client";

import { useQuery } from "@tanstack/react-query";
import { TreatyError } from "shared/types/utils";
import { api } from "~/lib/api";

export function useSession() {
	return useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await api.user.index.get();
			if (res.error) throw new TreatyError(res.error);
			return res.data;
		},
	});
}
