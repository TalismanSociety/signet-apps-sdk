import { useCallback, useEffect, useRef, useState } from "react"
import { SignetSdk } from "../sdk"

type Options = {
  debug?: boolean
}

export const useSignetSdk = (option?: Options) => {
  const [inSignet, setInSignet] = useState<boolean>()
  const sdkRef = useRef<SignetSdk>()

  const handleIsInSignet = useCallback(async () => {
    if (typeof window === "undefined") return // skip SSR
    const signetSdk = new SignetSdk(option)
    const isInSignet = await signetSdk.init()
    setInSignet(isInSignet)
    if (isInSignet) {
      sdkRef.current = signetSdk
    }
  }, [option])

  useEffect(() => {
    handleIsInSignet()
  }, [handleIsInSignet])

  return { sdk: sdkRef.current, inSignet }
}
