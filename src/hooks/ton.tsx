'use client'

import client, { IStorage } from "@tonconnect/sdk"
import { useEffect } from "react"
import { toast } from "sonner"
import { env } from "~/env"

const serverProvider:IStorage = {
  async setItem(key, value){
    const account = JSON.parse(value)
    console.log(account)
    localStorage.setItem(key, value)
    return
  },
  async getItem(key) {
    console.log(key)
    return localStorage.getItem(key)
  },
  async removeItem(key) {
    localStorage.removeItem(key)
    return
  },
}

const manifestUrl = `${env.NEXT_PUBLIC_URL}/tonconnect-manifest.json`

export function useTonWallet(){

  const ton = new client({
    storage:serverProvider,
    manifestUrl
  })

  const unsubscribe =  ton.onStatusChange(
    async (wallet) => {
      if(!wallet){
        return toast.error("Кошелек не подключен")
      }

      await ton.restoreConnection()
      toast.success("Кошелек подключен")
    },
    (err) => {
      toast.error("Ошибка подключения кошелька", {
        description:err.message
      })
    }
  )
  // useEffect(() => {
  //   const unsubscribe =  ton.onStatusChange(
  //     async (wallet) => {
  //       if(!wallet){
  //         return toast.error("Кошелек не подключен")
  //       }
  //
  //       await ton.restoreConnection()
  //       toast.success("Кошелек подключен")
  //     },
  //     (err) => {
  //       toast.error("Ошибка подключения кошелька", {
  //         description:err.message
  //       })
  //     }
  //   )
  //   return unsubscribe
  // }, [])

  console.log(ton.account)
  useEffect(() => {
    ton.restoreConnection()
    // console.log("restore")
  }, [ton])

  return {
    ton
  }
}
