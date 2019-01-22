'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ patterns: [] }, function () {
    console.log('Empty patterns installed');
  });
});

chrome.runtime.onStartup.addListener(function () {
  console.log('getting patterns');
  chrome.storage.sync.get(['patterns'], function (result) {
    console.log('Patterns loaded:', result.patterns);
    registerOnBeforeRequestListener(result.patterns);
  });
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.patterns && request.patterns.length !== 0) {
      registerOnBeforeRequestListener(request.patterns);
    }
  });

function onBeforeRequestListener(details) {
  console.log("details:", details);
  return {
    cancel: true
  };
}

function registerOnBeforeRequestListener(patterns) {
  console.log('registerOnBeforeRequestListener patterns:', patterns);
  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
  if (patterns.length !== 0) {
    chrome.webRequest.onBeforeRequest.addListener(
      onBeforeRequestListener,
      { urls: patterns },
      ["blocking"]
    );
  }
}
