'use client'

import { useSuspenseQuery } from "@tanstack/react-query";
import { isWalletInfoCurrentlyInjected, isWalletInfoRemote, toUserFriendlyAddress, WalletInfo } from "@tonconnect/sdk";
import { Copy, WalletMinimal } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { TabsContent } from "~/components/ui/tabs";
import { useTonWallet } from "~/hooks/wallet";


export function CryptoTab(){
  const {ton, wallet} = useTonWallet()

  return (
    <TabsContent className="h-full mt-0" value="crypto">
      <ConnectSection />
      {
        !ton.connected || !wallet
          ? null
          : (
            <div>
              <div  className="flex items-center gap-2 group"
                onClick={() =>{
                  navigator.clipboard.writeText(toUserFriendlyAddress(wallet.account.address))
                  toast.success("Скопировано")
                }}
              >
                <p className="opacity-100 cursor-pointer text-3xl max-w-[360px] truncate">{toUserFriendlyAddress(wallet?.account.address)}</p>
                <Copy className="size-5 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 opacity-0 transition-all" />
              </div>
              <Button
                variant={"destructive"}
                onClick={() => ton.disconnect()}
              >
                Отключить
              </Button>
            </div>
          )
          
      }
    </TabsContent>
  )
}


function ConnectSection(){
  const {ton, wallet} = useTonWallet()

  const [walletInfo, setWalletInfo] = useState<WalletInfo>()

  const { data: wallets } = useSuspenseQuery({
    queryKey:["wallets"],
    queryFn: async () => {
      return await ton.getWallets()
    },
  })


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto block" asChild>
          <Button className="group truncate max-w-60" disabled={ton.connected} chevron={!ton.connected}>
            {
              wallet
                ? toUserFriendlyAddress(wallet.account.address)
                : walletInfo
                  ? (
                    <>
                      <img 
                        className="size-8 rounded-2xl"
                        src={walletInfo.imageUrl}
                        alt={walletInfo.appName}
                      />
                      <p className="opacity-100 group-hover:invert transition-colors">{walletInfo.appName}</p>

                    </>
                  )
                  : "Подключить"
            }
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-primary backdrop-blur-lg space-y-2 min-w-32 max-h-96 overflow-scroll">
          {
            wallets.map((w, index) => (
              <DropdownMenuItem
                onSelect={() => setWalletInfo(w)}
                className="w-full py-2.5"
                key={index}
              >
                <img 
                  className="size-8 rounded-2xl"
                  src={w.imageUrl}
                  alt={w.appName}
                />
                <p className="opacity-100">{w.appName}</p>
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuContent>
      </DropdownMenu>

      {
        ton.connected
          ? null
          : !walletInfo
            ? (
              <div className="h-full sm:pb-12 flex gap-4 items-center justify-center">
                <WalletMinimal className="size-16" />
                <h1>Выберите кошелек</h1>
              </div>
            )
            : (
              <div className="w-min space-y-2">
                {
                  isWalletInfoRemote(walletInfo)
                    && <div className="p-6 rounded-2xl bg-white w-min">
                        <QRCode
                          value={ton.connect({
                            bridgeUrl: walletInfo.bridgeUrl,
                            universalLink: walletInfo.universalLink,
                          })}
                        />
                      </div>
                }
                <div className="flex">
                  {
                    isWalletInfoCurrentlyInjected(walletInfo)
                      && <Button
                        className="basis-1/2"
                        onClick={() => ton.connect({jsBridgeKey:walletInfo.jsBridgeKey}) }
                      >
                        Подключить
                      </Button>
                  }
                  <Button className="grow" onClick={() => window.open(walletInfo.aboutUrl, "_blank")}>
                    Создать кошелек
                  </Button>
                </div>
              </div>
            )
      }
    </>
  )
}
