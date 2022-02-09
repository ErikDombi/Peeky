function openPartial(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  if (info.menuItemId != 'openPartial')
    return;

  chrome.tabs.sendMessage(tab?.id ?? 0, "getXRayPath", { frameId: info.frameId }, data => {
    let clickedElement: string = data.value;
    let filePath: string = clickedElement.trim().split(' ')[3];

    if(filePath == undefined)
      return;

    fetch("http://localhost:6070/open?file=" + filePath);
  });
}

chrome.contextMenus.create({
  title: "Show partial in VS Code",
  contexts: ["page", "selection"],
  id: 'openPartial'
});

chrome.contextMenus.onClicked.addListener(openPartial);