'use client'

import TonConnector, { IStorage, isWalletInfoRemote } from "@tonconnect/sdk"
import { env } from "~/env"

const storage:IStorage = {
  async setItem(key, value){
    const account = JSON.parse(value)

    localStorage.setItem(key, value)
    return
  },
  async getItem(key) {
    return localStorage.getItem(key)
  },
  async removeItem(key) {
    localStorage.removeItem(key)
    return
  },
}

export const ton = new TonConnector({
  manifestUrl:`${env.NEXT_PUBLIC_URL}/tonconnect-manifest.json`,
  storage,
})

ton.restoreConnection()
