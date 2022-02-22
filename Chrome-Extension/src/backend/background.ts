import { IPC, IPCMessage, IPCSubscription } from "../ipc"

let IPCListener = new IPC();

IPCListener.startListener();

async function ContextClicked(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  switch(info.menuItemId){
    case 'showElement':
      ShowElement(tab?.id!);
      break;
    case 'showStyle':
      ShowStyle(tab?.id!);
      break;
  }
}

async function ShowElement(tab: number) {
  let result = await IPCListener.sendMessage<any>(new IPCMessage('get-xray-path'), tab);

  let clickedElement: string = result.value.el;
  let filePath: string = clickedElement.trim().split(' ')[3];

  if(filePath == undefined)
    return;

  fetch(`http://localhost:6070/open?file=${filePath}&tags=${JSON.stringify(result.value.tags)}`)
    .catch(e => IPCListener.sendMessage(new IPCMessage('display-error', 'Failed to connect to VS Code!\nEnsure that Peeky has been activated!'), tab));
}

async function ShowStyle(tab: number) {
  let result = await IPCListener.sendMessage<any>(new IPCMessage('get-element-style'), tab);

}

chrome.contextMenus.create({
  title: "Peeky: Show Element",
  contexts: ["page", "selection", "image", "video", "audio", "link", "frame"],
  id: 'showElement'
});

chrome.contextMenus.create({
  title: "Peeky: Show Style",
  contexts: ["page", "selection", "image", "video", "audio", "link", "frame"],
  id: 'showStyle'
});

chrome.contextMenus.onClicked.addListener(ContextClicked);
