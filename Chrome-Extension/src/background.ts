function openPartial(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  if (info.menuItemId != 'openPartial')
    return;

  chrome.tabs.sendMessage(tab?.id ?? 0, {msg: "getXRayPath"}, { frameId: info.frameId }, data => {
    let clickedElement: string = data.value.el;
    let filePath: string = clickedElement.trim().split(' ')[3];

    if(filePath == undefined)
      return;

    console.log(data.value.tags);
    
    fetch(`http://localhost:6070/open?file=${filePath}&tags=${JSON.stringify(data.value.tags)}`)
      .catch(e => {
        chrome.tabs.sendMessage(tab?.id ?? 0, {msg: "displayErrorHTML", data: 'Failed to connect to VS Code!\nEnsure that Peeky has been activated'}, {frameId: info.frameId}, () => {});
      });
  });
}

chrome.contextMenus.create({
  title: "Show partial in VS Code",
  contexts: ["page", "selection", "image", "video", "audio", "link", "frame"],
  id: 'openPartial'
});

chrome.contextMenus.onClicked.addListener(openPartial);
