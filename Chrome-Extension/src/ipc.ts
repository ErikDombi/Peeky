import { delay } from './Threading';

class IPC {
  private Subscriptions: IPCSubscription[] = [];
  private TabID : Nullable<number> = null;

  constructor() {
    chrome.tabs?.query({currentWindow: true, active: true}, (tabs) => {
      this.TabID = tabs[0].id!;
    })
  }

  startListener() : void {
    chrome.runtime.onMessage.addListener((message : IPCMessage, sender, sendResponse : Function) => {
      console.log(message);
      if(message.Name == undefined || message.Data == undefined)
        return false;

      let result = this.Subscriptions.find(t => t.Name == message.Name)?.Method(message);
      sendResponse(result);
      return true;
    });
  }

  subscribeMessage(msg: string | IPCMessage, method: Function) {
    this.Subscriptions.push(new IPCSubscription(msg, method));
  }

  async sendMessage<ReturnType>(message: IPCMessage, tab: number) : Promise<ReturnType> {
    let responseMessage: Nullable<ReturnType> = null;

    chrome.tabs.sendMessage(tab, message, {}, (res) => {
      responseMessage = res;
    });

    let count: number = 0;
    while(responseMessage == null && count++ < 50) {
      await delay(100);
    }

    return responseMessage! as ReturnType;
  }
}

class IPCSubscription {
  Name: String;
  Method: Function;

  constructor(Name: String | IPCMessage, Method: Function) {
    if(Name instanceof IPCMessage)
      Name = Name.Data;

    this.Name = Name as String;
    this.Method = Method;
  }
}

class IPCMessage {
  Name: string;
  Data: any;

  constructor(Name: string, Data: any = null) {
    this.Name = Name;
    this.Data = Data;
  }
}

export { IPC, IPCSubscription, IPCMessage };
