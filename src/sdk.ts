import { MessageService } from "./MessageService"

export class SignetSdk {
  private messageService: MessageService
  constructor(public option: { debug?: boolean } = {}) {
    if (typeof window === "undefined")
      throw new Error("SignetSdk can only be used in an iframe of Signet")

    this.messageService = new MessageService(window.parent, this.option)
  }

  async init() {
    try {
      return await this.messageService.send("iframe(init)", [], 500)
    } catch (e) {
      // send expects a response, but init will not respond anything. This is fine
      return false
    }
  }

  async getAccount() {
    try {
      return await this.messageService.send("iframe(getAccount)", [])
    } catch (e) {
      console.error("Failed to get account", e)
      return null
    }
  }

  async send(calldataHex: string) {
    try {
      return await this.messageService.send("iframe(send)", [calldataHex], 0)
    } catch (e) {
      console.error("Failed to send transaction", e)
      return null
    }
  }
}
