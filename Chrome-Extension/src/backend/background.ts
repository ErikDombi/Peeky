import { IPC, IPCMessage, IPCSubscription } from "../ipc"
import { Minimap } from "./minimap"

let IPCListener = new IPC(true);

IPCListener.startListener();

IPCListener.subscribeMessage('style-selected', async (event: IPCMessage) => {
  let rule: string = " */\n" + event.Data.content.split('{')[0].replace(/\n/gi, '').trim() + " {\n  ";
  let url: string = event.Data.url;

  let ruleSheetContent = await (await (await fetch(url)).text());
  let ruleSheetArray = ruleSheetContent.substring(0, ruleSheetContent.indexOf(rule)).split('\n');
  let ruleLocation = ruleSheetArray.reverse()[0]
  let ruleLine: number = parseInt(ruleLocation.split(', ')[0].split(' ').reverse()[0]);
  let ruleFile: string = ruleLocation.split(', ').reverse()[0]

  fetch(`http://localhost:6070/open?file=${ruleFile}&line=${ruleLine}`)
    .catch(e => IPCListener.sendMessage(new IPCMessage('display-error', 'Failed to connect to VS Code!\nEnsure that Peeky has been activated!')));
});

async function ContextClicked(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  switch(info.menuItemId){
    case 'showElement':
      ShowElement();
      break;
    case 'showStyle':
      ShowStyle();
      break;
  }
}

async function ShowElement() {
  let result = await IPCListener.sendMessage<any>('get-xray-path');

  let clickedElement: string = result.value.el;
  let filePath: string = clickedElement.trim().split(' ')[3];

  if(filePath == undefined)
    return;

  fetch(`http://localhost:6070/open?file=${filePath}&tags=${JSON.stringify(result.value.tags)}`)
    .catch(e => IPCListener.sendMessage(new IPCMessage('display-error', 'Failed to connect to VS Code!\nEnsure that Peeky has been activated!')));
}

async function ShowStyle() {
  let result = await IPCListener.sendMessage<any>('select-element-css');
}

chrome.contextMenus.create({
  title: "Show Element",
  contexts: ["page", "selection", "image", "video", "audio", "link", "frame"],
  id: 'showElement'
});

chrome.contextMenus.create({
  title: "Show Style",
  contexts: ["page", "selection", "image", "video", "audio", "link", "frame"],
  id: 'showStyle'
});

chrome.contextMenus.onClicked.addListener(ContextClicked);
