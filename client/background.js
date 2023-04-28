const pwd = "**BaiDing**";
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
  if (req.type === "inputLabel") {
    await chrome.debugger.attach({ tabId: sender.tab.id }, "1.3");
    console.log(req.msg);
    for (let i = 0; i < req.msg.length; i++) {
      await chrome.debugger.sendCommand(
        { tabId: sender.tab.id },
        "Input.dispatchKeyEvent",
        {
          type: "keyDown",
          text: req.msg[i],
          isKeypad: true,
        }
      );
    }
    chrome.debugger.detach({ tabId: sender.tab.id });
  }
});

setInterval(() => {
  fetch(`http://127.0.0.1:3265/getVerifyUrl`)
    .then(async (res) => {
      const data = await res.json();
      if (data.verifyUrl) {
        chrome.tabs.create({ url: data.verifyUrl });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}, 1000);
