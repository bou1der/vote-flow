'use client'

import TonConnector, { IStorage } from "@tonconnect/sdk"


const storage:IStorage = {
  async setItem(key, value){
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
  storage
})
ton.restoreConnection()
