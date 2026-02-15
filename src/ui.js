// src/ui.js

// UI event handlers and interactions

// Function to handle click events
function handleClick(event) {
    console.log('Button clicked!', event);
}

// Function to handle input changes
function handleInputChange(event) {
    console.log('Input changed:', event.target.value);
}

// Add event listeners
const button = document.getElementById('myButton');
const input = document.getElementById('myInput');

if (button) {
    button.addEventListener('click', handleClick);
}

if (input) {
    input.addEventListener('input', handleInputChange);
}