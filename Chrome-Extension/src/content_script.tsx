let clickedElement: Node | null = null;

document.addEventListener("contextmenu", (e: MouseEvent) => {
  clickedElement = e.target as Node;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == "getXRayPath") {
    let node : Node | null = clickedElement;

    let XRayNode : Node | null = null;
    while(XRayNode === null && node?.parentNode != undefined) {
      
      for(const child of node.parentNode.childNodes) {
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

    console.log(XRayNode);
    sendResponse({ value: XRayNode?.textContent });
  }
});