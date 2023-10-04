var foo;

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