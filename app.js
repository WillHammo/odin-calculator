const calculator = document.querySelector('.container');
const calculatorDisplay = document.querySelector('.display');
const calculatorOperatorsDisplay = document.querySelector('.operator-display');

let state = {
    awaitingFirstOperand: true,
    firstOperand: '',
    secondOperand: '',
    operator: null
};

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    'x': (a, b) => a * b,
    '/': (a, b) => b !== 0 ? a / b : 'Cannot divide by zero',
    '%': (a, b) => a % b,
};

const operatorDisplayMap = {
    '+': 'ADD',
    '-': 'SUBTRACT',
    'x': 'MULTIPLY',
    '/': 'DIVIDE',
    '%': 'MODULO'
};

function updateDisplay(message) {
    calculatorDisplay.value = message;
}

function inputNumber(number){
    const { awaitingFirstOperand, firstOperand, secondOperand } = state;
    if(awaitingFirstOperand){
        if (number === '.' && firstOperand.includes('.')) return;
        state.firstOperand += number;
        updateDisplay(state.firstOperand);
    }else {
        if (number === '.' && secondOperand.includes('.')) return;
        state.secondOperand += number;
        updateDisplay(state.secondOperand);
    }
}

function inputOperator(op){
    const { firstOperand, secondOperand, operator } = state;
    if (!state.awaitingFirstOperand && secondOperand) {
        state.firstOperand = operate();
        state.secondOperand = '';
        updateDisplay(state.firstOperand);
    }
    state.awaitingFirstOperand = false;
    state.operator = op;
    calculatorOperatorsDisplay.textContent = operatorDisplayMap[op];
}

function operate() {
    const { firstOperand, secondOperand, operator } = state;
    const num1 = parseFloat(firstOperand) || 0;
    const num2 = parseFloat(secondOperand) || 0;
    const result = operations[operator](num1, num2);
    state.awaitingFirstOperand = true;
    return result.toString();
}

function removeCharacter() {
    if (state.awaitingFirstOperand) {
        state.firstOperand = state.firstOperand.slice(0, -1);
        updateDisplay(state.firstOperand || '0');
    } else {
        state.secondOperand = state.secondOperand.slice(0, -1);
        updateDisplay(state.secondOperand || '0');
    }
}

function handleEqualsClick() {
    if (state.operator) {
        const result = operate();
        state.firstOperand = result;
        state.secondOperand = '';
        state.operator = null;
        updateDisplay(result);
    }
}

function clear() {
    state.awaitingFirstOperand = true;
    state.firstOperand = '';
    state.secondOperand = '';
    state.operator = null;
    updateDisplay('0');
    calculatorOperatorsDisplay.textContent = '';
}

function clearEntry() {
    if (state.awaitingFirstOperand) {
        state.firstOperand = '';
    } else {
        state.secondOperand = '';
    }
    updateDisplay('0');
}

calculator.addEventListener('click',(e)=>{
    if(e.target.classList.contains('number')){
        inputNumber(e.target.textContent);
    }else if (e.target.classList.contains('operator')) {
        inputOperator(e.target.textContent);
    }else if(e.target.classList.contains('equals')){
        handleEqualsClick();
    }else if(e.target.classList.contains('backspace')){
        removeCharacter();
    }else if(e.target.classList.contains('clear')){
        clear();
    }else if(e.target.classList.contains('clear-entry')){
        clearEntry();
    }
});