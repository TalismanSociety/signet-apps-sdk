# Signet Apps SDK

By integrating the Signet Apps SDK, your dapps can support multisig operations when users use your dapp within Signet.

## Documentation

### Installation

```bash
npm install @talismn/signet-apps-sdk
# or
yarn add @talismn/signet-apps-sdk
# or
bun add @talismn/signet-apps-sdk
```

### Using the SDK

**init()**
The `init()` call allows you to check whether user is using your dapp within Signet.

```javascript
import { SignetSdk } from "@talismn/signet-apps-sdk"
const sdk = new SignetSdk()

const inSignet = await sdk.init()
// true or false
```

If you're using React, we have a hook that handles that for you:

```jsx
import { useSignetSdk } from "@talismn/signet-apps-sdk"

const App = () => {
  const { inSignet } = useSignetSdk()

  if (inSignet) return <p>{/* Inject and display signet vault*/}</p>
  return <button>Connect wallet</button>
}
```

**getAccount()**
Inject the selected signet account into your dapp! The `sdk` is also exposed from our hook:

```jsx
import { useSignetSdk, VaultAccount } from "@talismn/signet-apps-sdk"

const App = () => {
    const { inSignet, sdk } = useSignetSdk()
    const [injectedVault, setInjectedVault] = useState<VaultAccount>()

    const getVault = useCallback(async () => {
        const vault = await sdk.getAccount()
        setInjectedVault(vault)
    }, [])

    // depending on how your dapp is built, you may want to trigger this via a button click instead of useEffect
    useEffect(() => {
        if(inSignet) getVault()
    }, [inSignet, getVault])

    if (inSignet && injectedVault) return (
        <div>
            <p>{injectedVault.name}</p>
            <p>{injectedVault.address}</p>
        </div>
    )

    // handle normal EOA flow
    return <button>Connect wallet</button>
}
```

**send(calldataHex: string)**
To send a transaction, just use the `send` api:

```javascript
import { SendTxRespond } from '@talismn/signet-apps-sdk'

const App = () => {
    // ...

    const submitTx = () => {
        // ...build extrinsic
        const res = await sdk.send(extrinsic.method.toHex())
        console.log(res) // returns SendTxRespond
    }

    // ...
}
```
