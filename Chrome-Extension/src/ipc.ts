import { delay } from './Threading';

class IPC {
  private Subscriptions: IPCSubscription[] = [];
  private TabID : Nullable<number> = null;
  private isBackground: boolean;

  constructor(isBackground: boolean = false) {
    this.isBackground = isBackground;
  }

  startListener() : void {
    chrome.runtime.onMessage.addListener((message : IPCMessage, sender, sendResponse : Function) => {
      console.log(message);
      if(message.Name == undefined)
        return false;

      let result = this.Subscriptions.find(t => t.Name == message.Name)?.Method(message);
      sendResponse(result);
      return true;
    });
  }

  subscribeMessage(msg: string | IPCMessage, method: Function) {
    this.Subscriptions.push(new IPCSubscription(msg, method));
  }

  private async sendMessageToTab<ReturnType>(message: IPCMessage | string, data?: any) : Promise<ReturnType> {
    if(typeof message == 'string')
      message = new IPCMessage(message as string, data);

    let responseMessage: Nullable<ReturnType> = null;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, message, (res) => {
        responseMessage = res;
      });
    })

    let count: number = 0;
    while(responseMessage == null && count++ < 50) {
      await delay(100);
    }

    return responseMessage! as ReturnType;
  }

  async sendMessage<ReturnType>(message: IPCMessage | string, data?: any) : Promise<ReturnType> {
    if(this.isBackground)
      return await this.sendMessageToTab<ReturnType>(message, data);

    if(typeof message == 'string')
      message = new IPCMessage(message as string, data);

    let responseMessage: Nullable<ReturnType> = null;

    chrome.runtime.sendMessage(message, (res) => {
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
