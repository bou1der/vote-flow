'use ton'
import { useSuspenseQuery } from "@tanstack/react-query";
import { isWalletInfoRemote, WalletInfo } from "@tonconnect/sdk";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "~/components/ui/button";
import { TabsContent } from "~/components/ui/tabs";
import { useTonWallet } from "~/hooks/ton";


export function CryptoTab(){
  const { ton } = useTonWallet()

  const [currentWallet, setCurrentWallet] = useState<WalletInfo | undefined>(undefined)

  const { data: wallets } = useSuspenseQuery({
    queryKey:["wallets"],
    queryFn: async () => {
      return await ton.getWallets()
    },
  })


  return (
    <TabsContent className="h-full mt-0 flex flex-row" value="crypto">
      {
        !currentWallet
          ? <h1 className="grow">Выберите кошелек</h1>
          : <ConnectWallet wallet={currentWallet} />
      }

      <div className="flex flex-col gap-1 justify-between items-stretch bg-white/15 rounded-2xl max-w-56 p-4 overflow-scroll no-scrollbar">
        {
          wallets.map((w) => (
            <Button 
              onClick={() => setCurrentWallet(w)}
              key={w.name}
              className="justify-start gap-2 rounded-2xl shrink-0"
            >
              <img
                className="size-9 rounded-xl"
                src={w.imageUrl}
                alt={w.name}
              />
              {w.name}
            </Button>
          ))
        }
      </div>
    </TabsContent>
  )
}


 function ConnectWallet({wallet}:
  {
    wallet:WalletInfo
  }
){
  const { ton } = useTonWallet()

  return (
    <div className="grow">
      {
        isWalletInfoRemote(wallet)
        && <div className="p-6 rounded-2xl bg-white w-min">
          <QRCode
            value={ton.connect({
              bridgeUrl: wallet.bridgeUrl,
              universalLink: wallet.universalLink,
            })}
          />
        </div>
      }
    </div>
  )
}


