// import { listenForScans } from "./scanner.js";

const isAlphanumeric = (key) => {
  // Check if the key is a single alphanumeric character
  return /^[a-zA-Z0-9]$/.test(key) && key.length == 1;
}

function iterateScanCount() {
    // Check if "scanCount" exists in localStorage
    if (localStorage.getItem("scanCount") === null) {
        // If it doesn't exist, set it to zero
        localStorage.setItem("scanCount", 1);
    } else {
        // If it does exist, get its current value, increment it by 1, and store it back
        let currentCount = localStorage.getItem("scanCount");
        localStorage.setItem("scanCount", (currentCount + 1).toString());
    }

    // Just for verification, you can log the updated count to the console
    console.log("Updated scanCount:", localStorage.getItem("scanCount"));
}

function listenForTest() {
    document.addEventListener('keydown', function(e) {
        // Check if Ctrl, Alt, and '1' are pressed together
        if (e.ctrlKey && e.altKey && e.key === '1') {
            test();
        }
    });
}

function test() {
    // Prompt the user for input and store in someTestScan
    var someTestScan = window.prompt("Please enter some text:");

    // If the user clicked "Cancel" or entered nothing, we won't proceed
    if (someTestScan !== null && someTestScan.trim() !== "") {
        localStorage.setItem("lastScanTime", Date.now());
        localStorage.setItem("lastScanCode", someTestScan);
        sendScan(someTestScan);
    }
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
              iterateScanCount();
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
        var inputJob = document.getElementsByName("scanner")[0];
        // Check if the element exists
        if (workcenterEntry) {
            workcenterEntry.disabled = true;
        }
        if (inputJob) {
            inputJob.disabled = true;
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

let waitForSetupWidgetChange = (someFunction = () => { console.log("yeah!") }) => {
    // Wait for the XHR response that contains the information for the job
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function() {
        var xhr = this;
        var originalOnreadystatechange = this.onreadystatechange;
        console.log("waiting for response...");
        this.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                // console.log('XHR Completed with status:', xhr.status, 'Response:', xhr.responseText);
                try {
                    let response = JSON.parse(xhr.responseText);
                    console.log(response);
                    if (response && response.Data && response.Data.OperationCode !== undefined) {
                        console.log('response.Data.OperationCode exists');
                        if (response.Data.OperationCode === "QC") {
                            alert("QC detected! Make sure not to double scan. :)");
                            location.reload();
                        } else {
                            console.log("Doesn't appear to be in QC.");
                            someFunction();
                        }
                    }
                } catch (e) {
                }
            }
            if (originalOnreadystatechange) {
                originalOnreadystatechange.apply(this, arguments);
            }
        };

        originalSend.apply(this, arguments);
    };
}



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
                document.execCommand('insertText', false, some_string); // do not change this line; it's needed to handle React
                scanner.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
                clickFirstOkButton();
                console.log("click!")
                // Click Record Production (on control panel) over and over again until the next page
                // pulls up (TODO: make this more graceful, maybe time it out)
                waitForSetupWidgetChange(() => {document.getElementsByClassName("control-panel-dashboard-actionbar-button")[1].click()});
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
  listenForTest();
  blurWorkcenterEntry();
} else if (currentURL.includes("/ControlPanel/Production")) {
    let lastScanTime = localStorage.getItem("lastScanTime");
    let lastScanCode = localStorage.getItem("lastScanCode");
    // If it's been more less than 60 seconds since the last scan
    if ( lastScanTime && ((Date.now() - lastScanTime) / 1000) < 60 && lastScanCode ) {
        console.log("Last scan time:", lastScanTime);
        console.log("Last scan code:", lastScanCode);
        let secondsSinceLastScan = (Date.now() - lastScanTime) / 1000;
        console.log("Seconds since last scan:", secondsSinceLastScan);
        let box = document.getElementById("binForBinProductionSerialNo");
        box.focus();
        document.execCommand('insertText', false, lastScanCode); // do not change this line; it's needed to handle React
        box.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
        // click record bin for bin
        document.getElementsByClassName("record-production-action-title")[0].click()
        var checkInterval = setInterval(function() {
            var sourceElement = document.getElementById("SourceLoaded");
            
            if (sourceElement && sourceElement.innerText === "0") {
                clearInterval(checkInterval); // Stop the interval once the condition is met
                
                var backButton = document.getElementsByClassName("back-actionbar-button")[0];
                if (backButton) {
                    backButton.click();
                }
            }
        }, 100); // Check every 0.1 seconds
    }
    
} else if (currentURL.includes("/Inventory/Container")) {
    // This is for grabbing skus from the inventory for testing, copies to the clipboard
    document.addEventListener('keydown', function(e) {
        // Check if Ctrl, Alt, and '1' are pressed together
        if (e.ctrlKey && e.altKey && e.key === '1') {
            // Find all anchor elements containing 'SerialNo=' in the href attribute
            const anchorElements = document.querySelectorAll('a[href*="SerialNo="]');

            // Extract serial numbers and put them in a list
            const serialNumbers = [];

            anchorElements.forEach(anchor => {
                const href = anchor.getAttribute('href');
                const match = href.match(/SerialNo=([^&]+)/);
                if (match && match[1]) {
                    serialNumbers.push(match[1]);
                }
            });
            navigator.clipboard.writeText(serialNumbers.join('\n'))
            .then(() => {
                alert('Text copied to clipboard successfully!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
            console.log(serialNumbers);
        }
    });
}

})();
