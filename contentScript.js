// import { listenForScans } from "./scanner.js";

const isAlphanumeric = (key) => {
  // Check if the key is a single alphanumeric character
  return /^[a-zA-Z0-9]$/.test(key);
}

const listenForScans = () => {
  let buffer = [];
  let lastKeystrokeTime = 0;
  const rapidThreshold = 50; // milliseconds
  const printThreshold = 100; // milliseconds
  let timeout;
  console.log("listening for scans...");
  document.addEventListener('keydown', function(e) {
  if (e.repeat || (!isAlphanumeric(e.key))) {
    // ignore if the key is just held down, or if it's
    // not a letter or a number
    if (e.key != "Enter") {
      return;
    }
  }
  let currentTime = new Date().getTime();
  
  if (currentTime - lastKeystrokeTime < rapidThreshold) {
      buffer.push(e.key);
  } else {
      buffer = [e.key];
  }

  clearTimeout(timeout);
  timeout = setTimeout(function() {
      if (buffer.length > 4) { // Change this if you want to print single key strokes as well
          console.log(`Scan detected: ${buffer.join('')}`);
      }
      buffer = [];
  }, printThreshold);

  lastKeystrokeTime = currentTime;
});
};


(() => {

let currentURL = window.location.href;
console.log(`current url: ${currentURL}`);
if (currentURL.includes("plex.com")) {
  console.log("plex detected! foo I say, foo!");
  listenForScans();
}

})();
