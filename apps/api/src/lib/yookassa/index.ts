// import { YooCheckout } from "@a2seven/yoo-checkout";
// import { env } from "../env";
// import { logger } from "utils/logger";
//
// export interface PaymentNotification {
// 	event: "payment.succeeded" | "payment.canceled";
// 	object: {
// 		id: string;
// 		paid: boolean;
// 	};
// }
//
// export class Yookassa {
// 	private yookassa: YooCheckout;
//
// 	constructor() {
// 		this.yookassa = new YooCheckout({
// 			shopId: env.YOOKASSA_SHOP_ID,
// 			secretKey: env.YOOKASSA_SECRET_KEY,
// 		});
// 	}
//
// 	async createPayment({
// 		amount,
// 		redirectPath,
// 	}: {
// 		amount: number;
// 		redirectPath: string;
// 	}) {
// 		const idempotencyKey = Bun.randomUUIDv7();
// 		try {
// 			logger.info({
// 				message: "Creating payment",
// 				amount,
// 				redirectPath,
// 			});
// 			const yookassaPayment = await this.yookassa.createPayment(
// 				{
// 					amount: {
// 						value: amount.toFixed(0).toString(),
// 						currency: "RUB",
// 					},
// 					confirmation: {
// 						type: "redirect",
// 						return_url: `${env.AUTH_TRUST_HOST}${redirectPath}`,
// 					},
// 					capture: true,
// 				},
// 				idempotencyKey,
// 			);
// 			logger.info({
// 				message: "Payment created",
// 				id: yookassaPayment.id,
// 			});
// 			const confirmationUrl = yookassaPayment.confirmation.confirmation_url;
// 			if (!confirmationUrl) {
// 				throw new Error("Не удалось создать платеж");
// 			}
//
// 			return { yookassaPayment, idempotencyKey };
// 		} catch (error) {
// 			logger.error({
// 				message: "Payment failed",
// 				error,
// 			});
// 			throw new Error("Не удалось создать платеж");
// 		}
// 	}
// }
//
// const globalForYookassa = globalThis as unknown as {
// 	yookassa: Yookassa;
// };
//
// export const yookassa = globalForYookassa.yookassa ?? new Yookassa();
