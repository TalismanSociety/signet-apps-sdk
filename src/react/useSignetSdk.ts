import { useCallback, useEffect, useRef, useState } from "react"
import { SignetSdk } from "../sdk"

export const useSignetSdk = () => {
  const [inSignet, setInSignet] = useState<boolean>()
  const sdkRef = useRef<SignetSdk>()

  const handleIsInSignet = useCallback(async () => {
    if (typeof window === "undefined") return // skip SSR
    const signetSdk = new SignetSdk()
    const isInSignet = await signetSdk.init()
    setInSignet(isInSignet)
    if (isInSignet) {
      sdkRef.current = signetSdk
    }
  }, [])

  useEffect(() => {
    handleIsInSignet()
  }, [handleIsInSignet])

  return { sdk: sdkRef.current, inSignet }
}
