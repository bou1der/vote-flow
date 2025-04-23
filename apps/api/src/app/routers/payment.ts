// import Elysia, { error, t } from "elysia";
// // import { payments, paymentStatuses } from "~/server/db/payment-schema";
// import { userService } from "./user";
// import { and, eq } from "drizzle-orm";
// // import { subscriptions } from "~/server/db/subscriptions-schema";
// import { user } from "~/lib/db/schema";
// import { addDays } from "date-fns";
// import { Session } from "~/lib/auth";
// import { yookassa } from "~/lib/yookassa";
// import { redis } from "~/lib/redis";
// import { env } from "~/lib/env";
// import { db } from "~/lib/db";
// import { logger } from "utils/logger";
//
// function ipToBinary(ip: string): string | null {
// 	if (ip.includes(".")) {
// 		// IPv4 обработка
// 		const parts = ip.split(".").map(Number);
// 		if (parts.length !== 4 || parts.some(n => n < 0 || n > 255)) return null;
// 		return parts.map(n => n.toString(2).padStart(8, "0")).join("");
// 	} else if (ip.includes(":")) {
// 		// IPv6 обработка
// 		let fullIp = ip;
// 		if (ip.includes("::")) {
// 			const parts = ip.split("::");
// 			const left = parts[0] ? parts[0].split(":") : [];
// 			const right = parts[1] ? parts[1].split(":") : [];
// 			const missing = 8 - (left.length + right.length);
// 			fullIp = [...left, ...Array(missing).fill("0"), ...right].join(":");
// 		}
// 		const parts = fullIp.split(":").map(part => parseInt(part || "0", 16));
// 		if (parts.length !== 8) return null;
// 		return parts.map(n => n.toString(2).padStart(16, "0")).join("");
// 	}
// 	return null;
// }
//
// function isIpInRange(ip: string, range: string): boolean {
// 	const [rangeIp, prefix] = range.split("/") as [string, string];
// 	const ipBin = ipToBinary(ip);
// 	const rangeBin = ipToBinary(rangeIp);
// 	if (!ipBin || !rangeBin) return false;
// 	return ipBin.substring(0, Number(prefix)) === rangeBin.substring(0, Number(prefix));
// }
//
// export const paymentIpValidatorService = new Elysia({
// 	name: "payment/ip-validator",
// })
// 	.derive({ as: "global" }, ({ headers }) => {
// 		if (!headers.get)
// 			return {
// 				ip: "",
// 			};
//
// 		return {
// 			ip:
// 				headers["x-real-ip"] ??
// 				headers["x-forwarded-for"] ??
// 				headers["x-forwarded"] ??
// 				headers["cf-connecting-ip"] ??
// 				headers["fastly-client-ip"] ??
// 				headers["true-client-ip"] ??
// 				headers["x-cluster-client-ip"] ??
// 				headers["x-cluster-client-ip"] ??
// 				"",
// 		};
// 	})
// 	.macro({
// 		validateIp: (enabled?: boolean) => {
// 			if (!enabled || env.NODE_ENV === "test") return;
//
// 			return {
// 				beforeHandle({ ip }) {
// 					const ALLOWED_IPV4_CIDRS = ["185.71.76.0/27", "185.71.77.0/27", "77.75.153.0/25", "77.75.154.128/25"];
// 					const ALLOWED_IPV4_SINGLES = ["77.75.156.11", "77.75.156.35"];
// 					const ALLOWED_IPV6_CIDRS = ["2a02:5180::/32"];
//
// 					logger.warn({
// 						message: "Payment notification IP rejected",
// 					});
//
// 					const err = () => {
// 						logger.warn({
// 							message: "Payment notification IP rejected",
// 						});
// 						error(400, { message: "Неверный IP" });
// 					};
//
// 					if (!ALLOWED_IPV4_SINGLES.includes(ip)) return err();
//
// 					for (const range of [...ALLOWED_IPV4_CIDRS, ...ALLOWED_IPV6_CIDRS]) {
// 						if (!isIpInRange(ip, range)) return err();
// 					}
// 				},
// 			};
// 		},
// 	});
//
// export const paymentRouter = new Elysia({ prefix: "/payments" })
// 	.use(userService)
// 	.use(paymentIpValidatorService)
// 	.get(
// 		"/:subscriptionId",
// 		async ({ session, params }) => {
// 			logger.info({
// 				message: "gettings subscription for payment",
// 				params,
// 			});
// 			const subscription = await db.query.subscriptions.findFirst({
// 				where: and(eq(subscriptions.id, params.subscriptionId), eq(subscriptions.active, true)),
// 			});
//
// 			if (!subscription) {
// 				logger.warn({
// 					message: "Subscription not found",
// 				});
// 				return error(404);
// 			}
//
// 			logger.info({
// 				message: "creating yookassa payment",
// 			});
// 			const { yookassaPayment, idempotencyKey } = await yookassa.createPayment({
// 				amount: subscription.priceRub,
// 				redirectPath: `/profile/subscription`,
// 			});
// 			logger.info({
// 				message: "yookassa payment created",
// 				id: yookassaPayment.id,
// 			});
//
// 			logger.info({
// 				message: "creating payment",
// 			});
//
// 			await db.insert(payments).values({
// 				yookassaId: yookassaPayment.id,
// 				confirmationUrl: yookassaPayment.confirmation.confirmation_url!,
// 				amount: subscription.priceRub,
// 				userId: session!.user.id,
// 				subscriptionId: subscription.id,
// 				idempotencyKey,
// 			});
//
// 			logger.info({
// 				message: "payment created",
// 				id: yookassaPayment.id,
// 			});
//
// 			return {
// 				url: yookassaPayment.confirmation.confirmation_url!,
// 			};
// 		},
// 		{
// 			isSignedIn: true,
// 			params: t.Object({
// 				subscriptionId: t.String(),
// 			}),
// 		},
// 	)
// 	.post(
// 		"/",
// 		async ({ body }) => {
// 			logger.info({
// 				message: "new payment notification",
// 				body,
// 			});
//
// 			logger.info({
// 				message: "getting payment",
// 				body,
// 			});
// 			const payment = await db.query.payments.findFirst({
// 				where: and(eq(payments.yookassaId, body.object.id)),
// 				columns: {
// 					id: true,
// 					subscriptionId: true,
// 					userId: true,
// 				},
// 			});
//
// 			if (!payment) {
// 				logger.error({
// 					message: "Payment not found",
// 					body,
// 				});
// 				return error(404);
// 			}
//
// 			logger.info({
// 				message: "got payment",
// 				body,
// 			});
//
// 			logger.info({
// 				message: "updating payment",
// 				body,
// 			});
//
// 			const [newPayment] = await db
// 				.update(payments)
// 				.set({
// 					status: body.object.status,
// 					incomeAmount: body.object.income_amount?.value
// 						? Math.floor(parseFloat(body.object.income_amount.value))
// 						: undefined,
// 					paid: body.object.paid,
// 				})
// 				.where(eq(payments.id, payment.id))
// 				.returning();
//
// 			logger.info({
// 				message: "updated payment",
// 				newPayment,
// 				body,
// 			});
//
// 			logger.info({
// 				message: "getting user",
// 				newPayment,
// 				body,
// 			});
//
// 			const paymentUser = await db.query.user.findFirst({
// 				where: eq(user.id, payment.userId),
// 				columns: {
// 					id: true,
// 					activeSubscriptionId: true,
// 					subscriptionEndsAt: true,
// 				},
// 			});
//
// 			if (!paymentUser) {
// 				logger.error({
// 					message: "User not found",
// 					body,
// 					newPayment,
// 				});
// 				return error(404);
// 			}
//
// 			logger.info({
// 				message: "got user",
// 				newPayment,
// 				body,
// 			});
//
// 			logger.info({
// 				message: "getting subscription",
// 				newPayment,
// 				body,
// 			});
//
// 			const subscription = await db.query.subscriptions.findFirst({
// 				where: eq(subscriptions.id, payment.subscriptionId),
// 				columns: {
// 					id: true,
// 					days: true,
// 				},
// 			});
//
// 			if (!subscription) {
// 				logger.error({
// 					message: "Subscription not found",
// 					newPayment,
// 					body,
// 				});
// 				return error(404);
// 			}
//
// 			logger.info({
// 				message: "got subscription",
// 				newPayment,
// 				body,
// 				subscription,
// 			});
//
// 			const subscriptionStart =
// 				paymentUser.subscriptionEndsAt.getTime() < new Date().getTime() ? new Date() : paymentUser.subscriptionEndsAt;
//
// 			logger.info({
// 				message: "updating user",
// 				body,
// 				newPayment,
// 				paymentUser,
// 			});
//
// 			const [newUser] = await db
// 				.update(user)
// 				.set({
// 					activeSubscriptionId: subscription.id,
// 					subscriptionEndsAt: addDays(subscriptionStart, subscription.days),
// 				})
// 				.returning();
//
// 			logger.info({
// 				message: "updated user",
// 				newPayment,
// 				body,
// 				newUser,
// 			});
//
// 			logger.info({
// 				message: "updating cached user session",
// 			});
//
// 			await redis.del(`activeSubscription:${paymentUser.id}`);
//
// 			const sess = await GetCachedSession(paymentUser.id);
// 			if (sess) {
// 				const { session, sessionToken } = sess;
// 				await redis.set(
// 					sessionToken,
// 					JSON.stringify({
// 						...session,
// 						user: {
// 							...session.user,
// 							activeSubscriptionId: subscription.id,
// 							subscriptionEndsAt: addDays(subscriptionStart, subscription.days),
// 						},
// 					} as Session),
// 				);
// 				logger.info({
// 					message: "updated cached user session",
// 				});
// 			} else {
// 				logger.warn({
// 					message: "unable to update cached user session",
// 				});
// 			}
//
// 			return "ok";
// 		},
// 		{
// 			validateIp: true,
// 			body: t.Object({
// 				type: t.Literal("notification"),
// 				event: t.UnionEnum(["payment.waiting_for_capture", "payment.succeeded", "payment.canceled"]),
// 				object: t.Object({
// 					id: t.String(),
// 					status: t.UnionEnum(paymentStatuses),
// 					amount: t.Object({
// 						value: t.String(),
// 						currency: t.Literal("RUB"),
// 					}),
// 					income_amount: t.Optional(
// 						t.Object({
// 							value: t.String(),
// 							currency: t.Literal("RUB"),
// 						}),
// 					),
// 					paid: t.Boolean(),
// 				}),
// 			}),
// 		},
// 	);
