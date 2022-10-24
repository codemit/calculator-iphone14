window.addEventListener("DOMContentLoaded", function() {

    const result = document.querySelector('.js-result');
    const buttons = document.querySelectorAll('button');
  
    var action = ""; // store operators
    var prevVal = []; // store previous values
    var turn = 1;
    var firstTouch = true; // overwrite result text?
  
    // if reset button is pressed
    function reset() {
      result.textContent = 0;
      action = "";
      prevVal = [];
      firstTouch = true;
      turn = 1;
    }
  
    function negative() {
      let str = String(result.textContent); // store current value in a variable
  
      if (!action || !firstTouch) {
        str.includes('-') ? result.textContent = str.substr(1, str.length) : result.textContent = `-${str}`; // if includes "-" remove it, otherwise add "-"
      } else if (action && firstTouch) {
        str.includes('-') ? result.textContent = str.substr(1, str.length) : result.textContent = `-0`;
      }
    }
  
    function float() {
      let str = String(result.textContent); // store current value in a variable
  
      if (!action || !firstTouch) {
        if (!str.includes('.')) { // if doesn't include "." => add it
          result.textContent = `${str}.`
        }
      } else if (action && firstTouch){
        if (!str.includes('.')) {
          result.textContent = `${0}.`
        }
      }
    }
  
    function percentage() {
  
      let number = Number(result.textContent); // make sure it's a number
      result.textContent = number / 100;
  
    }
  
    // function for pressing a number
  
    function number(num) {
  
      let resultText = result.textContent;
  
      if (resultText === "-0") { // if current text is -0, replace 0
        result.textContent = `-${num}`;
        firstTouch = false;
      } else if (resultText === "0.") { // if current text is 0. append number
        result.textContent += num;
        firstTouch = false;
      } else if (resultText !== "0" && !firstTouch) {
        result.textContent += num;
      } else {
        result.textContent = num;
        firstTouch = false;
      }
      console.log(`clicked number: ${num}`);
    }
  
    function operation(target) {
  
      let operator = target.dataset.action;
      console.log(`clicked operator ${operator}`);
  
      // to allow chaining (has to be done before assigning a currentVal)
      if (turn > 1) {
        calculate();
      }
  
      let currentVal = Number(result.textContent);
  
      action = operator; //set global variable to data attribute of the button
  
  
  
      if (prevVal.length >= 2) { // if pressed operator after making prior calculations
        prevVal = [currentVal]; // replace the memory with current value on the screen
      } else {
        // To prevent storing values when pressing operator buttons
        !firstTouch ? prevVal.push(currentVal) : null; // TODO causes a bug if no numbers pressed
      }
  
  
      firstTouch = true;
      turn++;
  
      console.log(`memory: ${prevVal}`);
      console.log(`turn no.: ${turn}`);
  
    }
  
    function calculate() {
      let currentVal = Number(result.textContent);
  
      function values() {
  
        if (prevVal.length >= 2) {
          prevVal.shift();
          prevVal.unshift(currentVal);
        } else {
          prevVal.push(currentVal);
        }
      }
  
      switch(action) {
  
        case "add":
          values();
          result.textContent = prevVal.reduce((a, b) => a + b);
          break;
  
        case "substract":
          values();
          result.textContent = prevVal.reduce((a, b) => a - b);
          break;
  
        case "divide":
          values();
          result.textContent = prevVal.reduce((a, b) => a / b);
          break;
  
        case "multiply":
          values();
          result.textContent = prevVal.reduce((a, b) => a * b);
          break;
  
      }
  
      firstTouch = true;
      turn = 1;
      console.log(`========Calc========`);
      console.log(`memory: ${prevVal[0]} ${action} ${prevVal[1]}}`);
      console.log(`Turn no.: ${turn}`);
    }
  
    // add events to all buttons
    buttons.forEach(el => {
  
      switch(el.dataset.action) {
  
        case 'clear':
          el.addEventListener('click', reset);
          break;
  
        case 'number':
          el.addEventListener('click', e => {
            let target = e.target || e.srcElement;
            number(target.textContent);
          });
          break;
  
        case 'negative':
          el.addEventListener('click', negative);
          break;
  
        case 'percentage':
          el.addEventListener('click', percentage);
          break;
  
        case 'float':
          el.addEventListener('click', float);
          break;
  
        case 'divide':
        case 'multiply':
        case 'substract':
        case 'add':
          el.addEventListener('click', e => operation(e.target || e.srcElement));
          break;
  
        case 'result':
          el.addEventListener('click', calculate);
          break;
      }
    });
  
    // keyboard support
    window.addEventListener('keydown', e => {
      let keycode = e.keyCode;
      if (keycode >= 48 && keycode <= 57) {
        number(String.fromCharCode(keycode));
      }
    });
  
  });
  