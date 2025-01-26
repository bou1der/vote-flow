'use client'

import { useSearchParams } from "next/navigation";
import { use } from "react";
import { api } from "~/trpc/react";

export default function PaymentVerification({searchParams}:
  {
    searchParams:Promise<{
      id: string;
    }>
  }){
  const params = use(searchParams)
  const { data:payment, isPending } = api.yookassa.checkPayment.useQuery({id:params.id})


  // return <h1>{params.id}</h1>
}
