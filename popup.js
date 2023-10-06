var foo;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var currentTab = tabs[0]; 
  var currentURL = currentTab.url;
  console.log(currentURL);

  if (currentURL.includes("plex.com/ControlPanel/Dashboard")) {
      document.getElementById("message").textContent = "You're on the dashboard";
  } else if (currentURL.includes("/ControlPanel/Production")) {
      document.getElementById("message").textContent = "You're on the Production page";
  } else if (currentURL.includes("/Platform/LaunchPage")) {
      document.getElementById("message").textContent = "You're on the Platform Launch Page";
  }
});



chrome.storage.local.get("count", (result) => {
  if (result.count === undefined) {
    chrome.storage.local.set({"count": 0});
    document.getElementById("count").innerHTML = `count: ${0}`;
  }
  else {
    console.log(result.count);
    document.getElementById("count").innerHTML = `<u>page views</u>: ${result.count + 1}`;
    chrome.storage.local.set({"count":result.count + 1});
  }
});