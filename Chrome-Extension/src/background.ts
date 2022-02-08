function openPartial(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  if (info.menuItemId != 'openPartial')
    return;

  chrome.tabs.sendMessage(tab?.id ?? 0, "getXRayPath", { frameId: info.frameId }, data => {
    let clickedElement: string = data.value;
    let filePath: string = clickedElement.split(' ')[4];
    console.log("FILE URI: " + filePath);
  });
}


chrome.contextMenus.create({
  title: "Show partial in VS Code",
  contexts: ["page"],
  id: 'openPartial'
});

chrome.contextMenus.onClicked.addListener(openPartial);