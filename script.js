const educationSelect = document.getElementById('education');
const netWorthSelect = document.getElementById('netWorth');
const casteSelect = document.getElementById('caste');
const skillCheckboxes = document.querySelectorAll('input[name="skill"]');
const ageRadios = document.querySelectorAll('input[name="age"]');
const reputationCoeffCheckboxes = document.querySelectorAll('input[name="reputation-coeff"]');
const reputationSubtractCheckbox = document.getElementById('repGeneral'); 
const calculateButton = document.getElementById('calculateButton');
const finalPriceDisplay = document.getElementById('finalPrice');
const resultContainer = document.getElementById('resultContainer');

const startingBid = 100;

function calculatePrice() {
    calculateButton.disabled = true;
    calculateButton.textContent = 'Calculating...';
    
    setTimeout(() => {
        let price = startingBid;
        let coefficient = 1.0;
        let additions = 0;
        let subtractions = 0;

        coefficient *= parseFloat(educationSelect.value);
        coefficient *= parseFloat(netWorthSelect.value);

        let selectedAgeRadio = document.querySelector('input[name="age"]:checked');
        if (selectedAgeRadio) {
            coefficient *= parseFloat(selectedAgeRadio.value);
        }

        let repCoefficient = 1.0;
        reputationCoeffCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let value = parseFloat(checkbox.value);
                let diff = Math.abs(1 - value);
                let adjustedDiff = Math.sqrt(diff);
                
                if (value < 1) {
                    repCoefficient *= (1 - adjustedDiff);
                } else {
                    repCoefficient *= (1 + adjustedDiff);
                }
            }
        });
        
        coefficient *= repCoefficient;

        price *= coefficient;

        let casteValue = parseInt(casteSelect.value);
        if (casteValue > 0) {
            additions += Math.min(casteValue, 50);
        } else {
            subtractions += Math.min(Math.abs(casteValue), 30);
        }

        skillCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                additions += parseInt(checkbox.value);
            }
        });

        if (reputationSubtractCheckbox.checked) {
            subtractions += Math.min(Math.abs(parseInt(reputationSubtractCheckbox.value)), 25);
        }

        price += additions;
        price -= subtractions;

        if (price < 0) {
            price = 0;
        }

        price = Math.round(price);
        
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        finalPriceDisplay.textContent = `$${price.toFixed(2)}`;
        
        finalPriceDisplay.classList.add('calculated');
        
        setTimeout(() => {
            finalPriceDisplay.classList.remove('calculated');
        }, 2000);

        calculateButton.disabled = false;
        calculateButton.textContent = 'Recalculate Price';

        let messageElement = document.getElementById('calculation-message');
        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.id = 'calculation-message';
            resultContainer.appendChild(messageElement);
        }
        
        messageElement.textContent = 'Calculation complete!';

        console.log("--- Calculation Details ---");
        console.log("Starting Bid:", startingBid);
        console.log("Education Coeff:", educationSelect.value);
        console.log("Net Worth Coeff:", netWorthSelect.value);
        console.log("Age Coeff:", selectedAgeRadio ? selectedAgeRadio.value : 'N/A');
        console.log("Reputation Coeffs Applied:", Array.from(reputationCoeffCheckboxes).filter(cb => cb.checked).map(cb => cb.value));
        console.log("Combined Coefficient:", coefficient.toFixed(3));
        console.log("Price after Coefficients:", (startingBid * coefficient).toFixed(2));
        console.log("Caste Add/Subtract:", casteSelect.value);
        console.log("Skills Additions:", Array.from(skillCheckboxes).filter(cb => cb.checked).map(cb => cb.value).reduce((sum, val) => sum + parseInt(val), 0));
        console.log("Reputation Subtraction:", reputationSubtractCheckbox.checked ? reputationSubtractCheckbox.value : 0);
        console.log("Total Additions:", additions);
        console.log("Total Subtractions:", subtractions);
        console.log("Final Price:", price.toFixed(2));
        console.log("--------------------------");
    }, 500);
}

calculateButton.addEventListener('click', calculatePrice);

document.querySelectorAll('.formGroup').forEach(group => {
    const inputs = group.querySelectorAll('select, input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => group.classList.add('inputFocus'));
        input.addEventListener('blur', () => group.classList.remove('inputFocus'));
    });
});

// Add signature in console
console.log("Bride/Groom Price Calculator - Created by @dataeclipse");