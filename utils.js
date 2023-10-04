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

const foo = () => {
// Set up a MutationObserver to wait for the serialNoScanner element to appear
    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var scanner = document.getElementById("serialNoScanner");
                if (scanner) {
                    setScannerValue("S006941");
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