// Function to select a random option from a dropdown menu, excluding the first option
function selectRandomOption(selectElement) {
  // Get the total number of options
  let numOptions = selectElement.options.length;

  // If there are two or more options, proceed to select a random one excluding the first option
  if (numOptions >= 2) {
    // Generate a random index from 1 to numOptions - 1 (inclusive)
    let randomIndex = Math.floor(Math.random() * (numOptions - 1)) + 1;
    // Select the random option
    selectElement.selectedIndex = randomIndex;
  }
}

// Get all the dropdown menus on the page
let selects = document.querySelectorAll('select');

// Iterate through each dropdown menu and select a random option
selects.forEach(select => {
  // If the name of the dropdown is not 'lang', proceed to select a random option
  if (select.name !== 'lang') {
    selectRandomOption(select);
  }
});

