function openPartial(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) {
  if (info.menuItemId != 'openPartial')
    return;

  chrome.tabs.sendMessage(tab?.id ?? 0, {msg: "getXRayPath"}, { frameId: info.frameId }, data => {
    let clickedElement: string = data.value;
    let filePath: string = clickedElement.trim().split(' ')[3];

    if(filePath == undefined)
      return;

    fetch("http://localhost:6070/open?file=" + filePath)
      .catch(e => {
        chrome.tabs.sendMessage(tab?.id ?? 0, {msg: "displayErrorHTML", data: '<b>Peeky:</b> Failed to connect to VS Code!<br><br>Ensure that Peeky has been activated'}, {frameId: info.frameId}, () => {});
      });
  });
}

chrome.contextMenus.create({
  title: "Show partial in VS Code",
  contexts: ["page", "selection"],
  id: 'openPartial'
});

chrome.contextMenus.onClicked.addListener(openPartial);
