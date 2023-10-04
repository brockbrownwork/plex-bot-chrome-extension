some_string = "it works!"
let box = document.getElementById("binForBinProductionSerialNo");
box.focus();
document.execCommand('insertText', false, some_string);
box.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
document.getElementsByClassName("record-production-actionbar-button")[0].click()