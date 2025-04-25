"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ton } from "./ton";
import { Wallet } from "@tonconnect/sdk";

export function useTonWallet() {
	const [wallet, setWallet] = useState<Wallet | null>(null);

	useEffect(() => {
		ton.restoreConnection();
		const unsubscribe = ton.onStatusChange(
			async wallet => {
				setWallet(wallet);
			},
			err => {
				toast.error("Ошибка подключения кошелька", {
					description: err.message,
				});
			},
		);
		return unsubscribe;
	}, []);

	return {
		ton,
		wallet,
	};
}
