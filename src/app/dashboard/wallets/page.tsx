'use client'
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { CryptoTab } from "./crypto-tab"
import { Button } from "~/components/ui/button"
import { ton } from "~/lib/client/ton"
import { FiatTab } from "./fiat-tab"

export default function WalletsPage(){


  return (
    <Tabs className="relative grow overflow-hidden" defaultValue="fiat">
      <Button variant={"destructive"} onClick={() => ton.disconnect()}>Отключить</Button>
      <CryptoTab />
      <FiatTab />

      <TabsList className="gap-2 absolute bottom-0 left-0">
        <TabsTrigger className="text-black" value="fiat">
          Фиат
        </TabsTrigger>
        <TabsTrigger className="text-black" value="crypto">
          Криптовалюты
        </TabsTrigger>
      </TabsList>

    </Tabs>
  )
}
