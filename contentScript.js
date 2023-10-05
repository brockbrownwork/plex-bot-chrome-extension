// import { listenForScans } from "./scanner.js";

const isAlphanumeric = (key) => {
  // Check if the key is a single alphanumeric character
  return /^[a-zA-Z0-9]$/.test(key) && key.length == 1;
}

const listenForScans = () => {
  let buffer = [];
  let lastKeystrokeTime = 0;
  const rapidThreshold = 30; // milliseconds
  const printThreshold = 100; // milliseconds
  let timeout;
  console.log("listening for scans...");

  document.addEventListener('keydown', function(e) {
      if (e.repeat) {
          return; // ignore if the key is just held down
      }

      let currentTime = new Date().getTime();

      if (e.key === "Enter") {
          if (buffer.length > 0) {
              scanCode = buffer.join('');
              console.log(`Scan detected: ${scanCode}`);
              localStorage.setItem("lastScanTime", Date.now());
              localStorage.setItem("lastScanCode", scanCode);
              sendScan(scanCode);
              buffer = [];
              clearTimeout(timeout);
              return;
          }
      }

      if (!isAlphanumeric(e.key)) {
          return; // ignore if it's not a letter or a number
      }

      if (currentTime - lastKeystrokeTime < rapidThreshold) {
          buffer.push(e.key);
      } else {
          buffer = [e.key];
      }

      clearTimeout(timeout);
      timeout = setTimeout(function() {
          if (buffer.length > 4) {
              console.log(`Scan detected: ${buffer.slice(0, -1).join('')}`);
          }
          buffer = [];
      }, printThreshold);

      lastKeystrokeTime = currentTime;
  });
};

function blurWorkcenterEntry() {
    var intervalId = setInterval(function() {
        // Get the first element with the name "scannerWorkcenter"
        var workcenterEntry = document.getElementsByName('scannerWorkcenter')[0];
        
        // Check if the element exists
        if (workcenterEntry) {
            workcenterEntry.addEventListener('focus', function onFocused() {
                console.log('focused!');
                this.blur();
                this.removeEventListener('focus', onFocused);
            });

            // Clear the interval once the element is found and the listener is attached
            clearInterval(intervalId);
        }
    }, 100);
}


//Control panel main page stuff from utils.js
// Function to click the button
function clickSetup() {
    var buttons = document.getElementsByClassName("control-panel-dashboard-actionbar-button");
    if (buttons.length > 4) {
        buttons[4].click();
    } else {
        console.error("Button not found");
    }
}

let clickedFirstOk = false;
// Function to set the value of the serialNoScanner element
function setScannerValue(some_string) {
    clickedFirstOk = false;
    var scanner = document.getElementById("serialNoScanner");
    if (scanner) {
        scanner.value = some_string;
        // Set up an interval to check the value of the serialNoScanner element
        var checkInterval = setInterval(function() {
            if (scanner.value === "" && !clickedFirstOk) {
                clickedFirstOk = true;
                clearInterval(checkInterval);  // Clear the interval once the condition is met
                scanner.focus();
                document.execCommand('insertText', false, some_string);
                scanner.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
                clickFirstOkButton();
                console.log("click!")
                document.getElementsByClassName("control-panel-dashboard-actionbar-button")[1].click();
            }
        }, 100);  // Check every 100 milliseconds
    } else {
        console.error("serialNoScanner element not found");
    }
}


function clickFirstOkButton() {
    var buttons = document.querySelectorAll('button'); // Gets all button elements

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent.trim() === 'Ok') {
            buttons[i].click();
            return;
        }
    }

    console.log('No "Ok" button found.');
}

const sendScan = (someString) => {
// Set up a MutationObserver to wait for the serialNoScanner element to appear
    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var scanner = document.getElementById("serialNoScanner");
                if (scanner) {
                    setScannerValue(someString);
                    observer.disconnect();  // Stop observing once the element is found
                }
            }
        }
    });

    // Configuration for the observer
    var config = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document, config);

    // Click the button
    clickSetup();
}

// Main function
(() => {

let currentURL = window.location.href;
console.log(`current url: ${currentURL}`);
if (currentURL.includes("plex.com/ControlPanel/Dashboard")) {
  console.log("plex detected! foo I say, foo!");
  listenForScans();
  blurWorkcenterEntry();
} else if (currentURL.includes("/ControlPanel/Production")) {
    let lastScanTime = localStorage.getItem("lastScanTime");
    let lastScanCode = localStorage.getItem("lastScanCode");
    if (lastScanTime && lastScanCode) {
        console.log("Last scan time:", lastScanTime);
        console.log("Last scan code:", lastScanCode);
        let secondsSinceLastScan = (Date.now() - lastScanTime) / 1000;
        console.log("Seconds since last scan:", secondsSinceLastScan);
    }
    
}

})();
