import ReactDOMServer from 'react-dom/server'
import React from 'react';

let clickedElement: Node | null = null;

document.addEventListener("contextmenu", (e: MouseEvent) => {
  clickedElement = e.target as Node;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "getXRayPath") {
    let node: Node | null = clickedElement;

    let XRayNode: Node | null = null;
    while (XRayNode === null && node?.parentNode != undefined) {

      for (const child of node.parentNode.childNodes) {
        if (child == node)
          break;

        if (child.nodeType !== 3 && child.nodeType !== 8)
          continue;

        if (!child.textContent?.includes("XRAY START"))
          continue;

        XRayNode = child;
      }
      node = node?.parentNode;
    }

    if (XRayNode == null) {
      ErrorPopup("Could not find an XRAY comment node");
      return;
    }

    let tags: Array<string> = new Array<string>();

    tags.push(clickedElement?.nodeName as string);
    let children: Array<Node> = Array.from(clickedElement?.childNodes as any);
    let textNodes = children.filter(t => t.nodeType == 3);
    tags.push(textNodes.map(t => t.textContent).join(''));
    let attributes = (clickedElement as HTMLElement).attributes;
    let attributesArray = Array.prototype.slice.call(attributes);
    for (let attribute of attributesArray) {
      tags.push(attribute.value);
    }

    sendResponse({ value: { el: XRayNode?.textContent, tags: tags } });
  }

  if (request.msg == "displayError") {
    if (request.data == null)
      return;

    ErrorPopup(request.data as string);
  }

  if (request.msg == "displayErrorHTML") {
    if (request.data == null)
      return;

    ErrorPopup(request.data as string);
  }
});

const popupTimeout: number = 5000; // How long to show the popup in miliseconds
const popupFadeout: number = 300; // How long to hide the popup in miliseconds
const popupFadeoutString: string = `${popupFadeout / 1000}s`; // Do not modify

function ErrorPopup(msg: string) {
  let elem = document.createElement('div');
  document.body.appendChild(elem);
  elem.innerHTML = ReactDOMServer.renderToString(
    <div style={{ background: '#3A3335', display: 'inline-block', position: 'fixed', right: '25px', bottom: '25px', color: 'white', borderRadius: '6px', overflow: 'hidden', fontFamily: 'Roboto', minWidth: '350px', transition: `opacity ${popupFadeoutString}`, zIndex: 9999999 }}>
      <div style={{ padding: '4px 8px', background: '#D81E5B', fontWeight: 400, fontSize: '16pt', letterSpacing: '1px', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}>
        <span>Peeky</span>
      </div>
      <div style={{ padding: '8px' }}>
        <pre style={{ padding: 'unset', fontSize: 'unset', lineHeight: 'unset', color: 'unset', background: 'inherit', backgroundColor: 'unset', borderRadius: 'unset', margin: 'unset', border: 'unset', outline: 'unset' }}>{msg}</pre>
      </div>
    </div>
  );
  elem.addEventListener('click', () => { elem.remove() });
  let child: HTMLElement = elem.children[0] as HTMLElement;
  setTimeout(() => { child.style.setProperty('opacity', '0') }, popupTimeout); // Hide the popup
  setTimeout(() => { elem.remove() }, popupTimeout + popupFadeout + 100); // Delete the element once hidden
}
