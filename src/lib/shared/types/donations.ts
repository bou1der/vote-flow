import { z } from "zod";
import { donationsTypeEnum } from "~/server/db/schema";
import { SbpIcon } from "~/components/icons/sbp"
import { IconProps } from "~/components/icons/icon";
import { SberbankIcon } from "~/components/icons/sberbank";
import { TinkoffIcon } from "~/components/icons/tinkoff";
import { AlfabankIcon } from "~/components/icons/alfabank";



export const DonationTypeEnum = z.enum(donationsTypeEnum.enumValues)
export type DonationType = z.infer<typeof DonationTypeEnum>




export const YooPaymentEnum = z.enum([
  "sbp",
  "sberbank",
  "tinkoff_bank",
  "alfabank",
]);

export type PaymentType = z.infer<typeof YooPaymentEnum>

export const YooPaymentType:Record<PaymentType, (props:IconProps) => JSX.Element> = {
  "sbp":SbpIcon,
  "sberbank":SberbankIcon,
  "tinkoff_bank":TinkoffIcon,
  "alfabank":AlfabankIcon
}

export const YooPaymentSchema = z.object({
  votingId:z.string(),
  // type: YooPaymentEnum.default("sbp"),
  amount:z.coerce.number()
    .min(2)
    .max(500000),
  comment:z.string()
    .min(3)
    .max(160)
    .optional(),
})

