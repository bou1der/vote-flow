"use client";

import TonConnector, { IStorage } from "@tonconnect/sdk";
// import { env } from "~/env";

const storage: IStorage = {
	async setItem(key, value) {
		localStorage.setItem(key, value);
		return;
	},
	async getItem(key) {
		return localStorage.getItem(key);
	},
	async removeItem(key) {
		localStorage.removeItem(key);
		return;
	},
};

// const serverStorage:IStorage = {
//   async getItem(key) {
//     const res = await fetch(`${window.origin}/api/ton/${key}`, {
//       method:"GET"
//     })
//     return  ((await res.json()) as {wallet:string | null}).wallet
//   },
//   async setItem(key, value){
//     console.log(JSON.parse(value))
//     await fetch(`${window.origin}/api/ton/${key}`, {
//       method:"POST",
//       body:JSON.stringify({
//         wallet:value
//       })
//     })
//   },
//   async removeItem(key) {
//     await fetch(`${window.origin}/api/ton/${key}`, {
//       method:"DELETE"
//     })
//   },
//
// }

console.log(window.origin);

export const ton = new TonConnector({
	manifestUrl: `${env.NEXT_PUBLIC_URL}/tonconnect-manifest.json`,
	storage,
});

ton.restoreConnection();
