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

    if(XRayNode == null)
      ErrorPopupHTML("<b>Peeky:</b> Could not find an XRAY comment node");
      return;

    sendResponse({ value: XRayNode?.textContent });
  }
});

const popupTimeout: number = 5000; // How long to show the popup in miliseconds
const popupFadeout: number = 300; // How long to hide the popup in miliseconds
const popupFadeoutString: string = `${popupFadeout / 1000}s`; // Do not modify

function ErrorPopup(text: string) {
  let elem: HTMLDivElement = document.createElement('div');
  elem.textContent = text;
  elem.setAttribute('style', `font-size: 1.8rem; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; position: absolute; padding: 1.25rem 1.75rem; right: 1rem; bottom: 1rem; border-radius: 0.25rem; box-sizing: border-box; display: block; transition: opacity ${popupFadeoutString};`);
  elem.addEventListener('click', () => {elem.remove()});
  document.body.appendChild(elem);
  setTimeout(() => { elem.style.setProperty('opacity', '0') }, popupTimeout); // Hide the popup
  setTimeout(() => { elem.remove() }, popupTimeout + popupFadeout + 100); // Delete the element once hidden
}

function ErrorPopupHTML(html: string) {
  let elem: HTMLDivElement = document.createElement('div');
  elem.innerHTML = html;
  elem.setAttribute('style', `font-size: 1.8rem; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; position: absolute; padding: 0.75rem 1.25rem; right: 1rem; bottom: 1rem; border-radius: 0.25rem; box-sizing: border-box; display: block; transition: opacity ${popupFadeoutString};`);
  elem.addEventListener('click', () => {elem.remove()});
  document.body.appendChild(elem);
  setTimeout(() => { elem.style.setProperty('opacity', '0') }, popupTimeout); // Hide the popup
  setTimeout(() => { elem.remove() }, popupTimeout + popupFadeout + 100); // Delete the element once hidden
}