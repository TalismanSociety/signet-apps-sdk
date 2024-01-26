import { Methods } from "./types"

// this only validates the format of message
const isValidMessage = (message: MessageEvent) => {
  const data = message.data
  if (typeof data !== "object") return false

  const { id, type, res } = data

  return id !== undefined && type !== undefined && res !== undefined
}

function makeRandomString(length: number = 16) {
  let result = ""
  while (result.length < length) {
    // convert to hex character
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

type Options = {
  debug?: boolean
}

export class MessageService {
  private callbacks = new Map<string, (payload: any) => void>()
  constructor(
    private readonly defaultWindow: Window,
    private readonly options: Options = {}
  ) {
    window.addEventListener("message", this.onMessage)
  }

  private onMessage = (message: MessageEvent) => {
    if (!isValidMessage(message)) return
    this.handleIncomingMessage(message.data)
  }

  private handleIncomingMessage = (data: any): void => {
    const { id } = data

    if (this.options.debug) console.log("MessageService received message", data)

    const cb = this.callbacks.get(id)
    if (cb) {
      cb(data.res)
      this.callbacks.delete(id)
    }
  }

  async send<T extends keyof Methods>(
    type: T,
    payload: Methods[T]["payload"],
    timeout = 1500,
    target: string = "*",
    overrideWindow?: Window | null
  ): Promise<Methods[T]["expects"]> {
    const id = makeRandomString(16)

    const targetWindow = overrideWindow || this.defaultWindow
    if (this.options.debug) console.log(`MessageService posted ${type} message`, payload)
    targetWindow.postMessage({ id, type, payload }, target)

    return new Promise((resolve, reject) => {
      let timeoutId: number | undefined

      if (timeout > 0) {
        timeoutId = window.setTimeout(() => {
          this.callbacks.delete(id)
          reject(new Error(`Message ${type} @ ${id} timed out`))
        }, timeout)
      }

      this.callbacks.set(id, (res) => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        this.callbacks.delete(id)
        resolve(res)
      })
    })
  }
}
