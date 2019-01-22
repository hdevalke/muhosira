'use strict';

let button = document.getElementById('submit');
button.addEventListener('click', function() {
  button.disabled = true;
  const textArea = document.getElementById('patterns');
  const patterns = textArea.value.split(/\r?\n/);
  chrome.storage.sync.set({patterns: patterns}, function() {
    button.disabled = false;
    sendPatterns(patterns);
  });
});

function sendPatterns(patterns) {
  chrome.runtime.sendMessage({patterns: patterns})
}

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.storage.sync.get(['patterns'], function (result) {
    const textArea = document.getElementById('patterns');
    textArea.value = result.patterns.join('\r\n')
  });
});