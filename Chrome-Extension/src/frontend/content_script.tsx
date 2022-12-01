
import { IPC, IPCMessage } from "../ipc";
import { DOMInterfacer } from "./DOMInterfacer";

let IPCListener = new IPC();
let DOMInterface = new DOMInterfacer();

IPCListener.subscribeMessage('get-xray-path', (event: IPCMessage) => {
  let node : Nullable<Node> = clickedElement;
  let XRayNode : Nullable<Node> = null;
  while(XRayNode === null && node?.parentNode != undefined) {
    for(const child of node.parentNode.childNodes){
      if(child == node)
        break;

      if(child.nodeType !== 3 && child.nodeType !== 8)
        continue;

      if(!child.textContent?.includes("XRAY START"))
        continue;

        XRayNode = child;
    }
    node = node?.parentNode;
  }

  if(XRayNode == null) {
    DOMInterface.ErrorPopup("Could not find an XRAY comment node");
    return;
  }

  let tags : Array<string> = new Array<string>();

  tags.push(clickedElement?.nodeName as string);
  let children : Array<Node> = Array.from(clickedElement?.childNodes as any);
  let textNodes = children.filter(t => t.nodeType == 3);
  tags.push(textNodes.map(t => t.textContent).join(''));
  let attributes = (clickedElement as HTMLElement).attributes;
  let attributesArray = Array.prototype.slice.call(attributes);
  for(let attribute of attributesArray) {
    tags.push(attribute.value);
  }

  return { value: {el: XRayNode?.textContent, tags: tags} };
});

IPCListener.subscribeMessage('select-element-css', (event: IPCMessage) => {
  DOMInterface.SelectCSSRulePopup(clickedElement as HTMLElement);
  return true;
})

IPCListener.startListener();

let clickedElement: Node | null = null;

document.addEventListener("contextmenu", (e: MouseEvent) => {
  clickedElement = e.target as Node;
});