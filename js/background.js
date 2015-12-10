
chrome.browserAction.onClicked.addListener(function (current_tab) { 
  chrome.tabs.executeScript(null, {file: 'js/lib/jquery.js'});
  chrome.tabs.executeScript(null, {file: 'js/lib/d3.js'});
  chrome.tabs.executeScript(null, {file: 'js/lib/d3.layout.cloud.js'});
  chrome.tabs.executeScript(null, {file: 'build/app.js' });
});
