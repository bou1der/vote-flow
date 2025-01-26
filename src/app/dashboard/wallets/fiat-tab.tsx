'use client'
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { TabsContent } from "~/components/ui/tabs";
import { api } from "~/trpc/react";




export function FiatTab(){

  const paymentMutation = api.yookassa.payment.useMutation({
    onSuccess(){
      toast.success("Платеж создан")
    }
  })

  return (
    <TabsContent value="fiat">
      <Button
        onClick={() => paymentMutation.mutate()}
        disabled={paymentMutation.isPending}
      >Заплатить</Button>
    </TabsContent>
  )
}
