const tempInput = document.getElementById('tempInput');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const resultValue = document.getElementById('resultValue');
const resultUnitDisplay = document.getElementById('resultUnit');
const formulaText = document.getElementById('formulaText');
const swapBtn = document.getElementById('swapUnits');

const unitNames = {
    'C': 'Celsius',
    'F': 'Fahrenheit',
    'K': 'Kelvin'
};

const unitSymbols = {
    'C': '°C',
    'F': '°F',
    'K': 'K'
};

function convert() {
    const val = parseFloat(tempInput.value);
    const from = fromUnit.value;
    const to = toUnit.value;

    if (isNaN(val)) {
        resultValue.textContent = '--';
        resultUnitDisplay.textContent = '';
        formulaText.textContent = 'Enter a value to see formula';
        return;
    }

    let celsius;
    // Normalize to Celsius
    if (from === 'C') celsius = val;
    else if (from === 'F') celsius = (val - 32) * 5/9;
    else if (from === 'K') celsius = val - 273.15;

    let result;
    let formula;

    // Convert from Celsius to target
    if (to === 'C') {
        result = celsius;
        formula = `${val}${unitSymbols[from]} = ${result.toFixed(2)}°C`;
    } else if (to === 'F') {
        result = (celsius * 9/5) + 32;
        formula = `(${val}${unitSymbols[from]} → Celsius) × 9/5 + 32 = ${result.toFixed(2)}°F`;
    } else if (to === 'K') {
        result = celsius + 273.15;
        formula = `(${val}${unitSymbols[from]} → Celsius) + 273.15 = ${result.toFixed(2)}K`;
    }

    // Display Result with animation
    resultValue.style.opacity = '0';
    setTimeout(() => {
        resultValue.textContent = result.toFixed(2);
        resultUnitDisplay.textContent = unitSymbols[to];
        formulaText.textContent = formula;
        resultValue.style.opacity = '1';
    }, 50);
}

// Real-time conversion
tempInput.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

// Swap units
swapBtn.addEventListener('click', () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    convert();
});

// Initial conversion
convertBtn.addEventListener('click', convert);

// Validation: prevent non-numeric input
tempInput.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E') e.preventDefault();
});
