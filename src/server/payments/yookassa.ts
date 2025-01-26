import { YooCheckout } from "@a2seven/yoo-checkout"
import { env } from "~/env";



const globalForYookassa = globalThis as unknown as {
  api: string | undefined;
};

const conn = globalForYookassa.api ?? env.YOOKASSA_API;
if (env.NODE_ENV !== "production") globalForYookassa.api = conn;

export const yookassa = new YooCheckout({
  shopId:env.YOOKASSA_SHOP_ID,
  secretKey:env.YOOKASSA_API,
})
