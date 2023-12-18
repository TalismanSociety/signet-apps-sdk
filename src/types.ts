export type VaultAccount = {
  vaultAddress: string
  name: string
  chain: {
    id: string
    name: string
    genesisHash: string
  }
}

export type SendTxRespond = {
  ok: boolean
  receipt?: {
    blockNumber?: number
    txIndex?: number
    txHash: string
  }
  error?: string
}

export type Methods = {
  "iframe(init)": {
    payload: []
    expects: boolean
  }
  "iframe(getAccount)": {
    payload: []
    expects: VaultAccount
  }
  "iframe(send)": {
    payload: [string]
    expects: SendTxRespond
  }
}
