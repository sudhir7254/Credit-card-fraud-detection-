document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // DOM elements
    const cardNumberInput = document.getElementById('card-number-input');
    const cardHolderInput = document.getElementById('card-holder-input');
    const expiryMonth = document.getElementById('expiry-month');
    const expiryYear = document.getElementById('expiry-year');
    const cvvInput = document.getElementById('cvv-input');
    const transactionAmount = document.getElementById('transaction-amount');
    const transactionLocation = document.getElementById('transaction-location');
    const checkFraudBtn = document.getElementById('check-fraud');
    const resultBody = document.getElementById('result-body');
    
    // Credit card display elements
    const cardNumberDisplay = document.getElementById('card-number');
    const cardHolderDisplay = document.getElementById('card-holder');
    const cardExpiryDisplay = document.getElementById('card-expiry');
    const cardCvvDisplay = document.getElementById('card-cvv');
    
    // Card flip toggle
    const flipCardToggle = document.getElementById('flip-card');
    const creditCard = document.querySelector('.credit-card');
    
    // Event listeners
    cardNumberInput.addEventListener('input', formatCardNumber);
    cardHolderInput.addEventListener('input', updateCardHolder);
    expiryMonth.addEventListener('change', updateExpiry);
    expiryYear.addEventListener('change', updateExpiry);
    cvvInput.addEventListener('input', updateCvv);
    flipCardToggle.addEventListener('change', toggleCardFlip);
    checkFraudBtn.addEventListener('click', checkForFraud);
    
    // Format card number with spaces
    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted.trim();
        cardNumberDisplay.textContent = formatted || '•••• •••• •••• ••••';
        
        // Show first 6 and last 4 digits only
        if (value.length >= 8) {
            const firstSix = value.substring(0, 6);
            const lastFour = value.substring(value.length - 4);
            const masked = firstSix + '••••••' + lastFour;
            let maskedFormatted = '';
            
            for (let i = 0; i < masked.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    maskedFormatted += ' ';
                }
                maskedFormatted += masked[i];
            }
            
            cardNumberDisplay.textContent = maskedFormatted.trim();
        }
    }
    
    // Update card holder name
    function updateCardHolder(e) {
        const value = e.target.value.toUpperCase();
        cardHolderDisplay.textContent = value || 'FULL NAME';
    }
    
    // Update expiry date
    function updateExpiry() {
        const month = expiryMonth.value || '••';
        const year = expiryYear.value || '••';
        cardExpiryDisplay.textContent = `${month}/${year}`;
    }
    
    // Update CVV
    function updateCvv(e) {
        const value = e.target.value.replace(/[^0-9]/gi, '');
        e.target.value = value;
        cardCvvDisplay.textContent = value || '•••';
    }
    
    // Toggle card flip
    function toggleCardFlip() {
        creditCard.classList.toggle('flipped', this.checked);
    }
    
    // Check for fraud
    function checkForFraud(e) {
        e.preventDefault();
        
        // Get all input values
        const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
        const cardHolder = cardHolderInput.value;
        const expiry = `${expiryMonth.value}/${expiryYear.value}`;
        const cvv = cvvInput.value;
        const amount = parseFloat(transactionAmount.value) || 0;
        const location = transactionLocation.value;
        
        // Validate inputs
        if (!cardNumber || !cardHolder || !expiryMonth.value || !expiryYear.value || !cvv || !amount || !location) {
            showResult('Please fill in all fields.', 'warning');
            return;
        }
        
        if (cardNumber.length < 16) {
            showResult('Invalid card number. Must be 16 digits.', 'warning');
            return;
        }
        
        if (cvv.length < 3) {
            showResult('Invalid CVV. Must be 3 digits.', 'warning');
            return;
        }
        
        // Simple Luhn algorithm check
        if (!isValidCardNumber(cardNumber)) {
            showResult('Invalid card number. Failed Luhn check.', 'fraud');
            return;
        }
        
        // Check for known fraudulent patterns
        const fraudProbability = detectFraud(cardNumber, amount, location);
        
        if (fraudProbability > 70) {
            showResult(`High probability of fraud detected (${fraudProbability}%).`, 'fraud');
        } else if (fraudProbability > 40) {
            showResult(`Suspicious activity detected (${fraudProbability}%). Verify transaction.`, 'warning');
        } else {
            showResult('No signs of fraudulent activity detected. Transaction appears safe.', 'safe');
        }
    }
    
    // Luhn algorithm for card number validation
    function isValidCardNumber(cardNumber) {
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.substring(i, i + 1));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 === 0;
    }
    
    // Simple fraud detection based on patterns
    function detectFraud(cardNumber, amount, location) {
        let fraudScore = 0;
        
        // Check for test card numbers
        const testNumbers = ['4242424242424242', '4012888888881881', '5555555555554444'];
        if (testNumbers.includes(cardNumber)) {
            fraudScore += 30;
        }
        
        // Check for high amount
        if (amount > 5000) {
            fraudScore += 20;
        } else if (amount > 1000) {
            fraudScore += 10;
        }
        
        // Check for unusual locations (simplified)
        const unusualLocations = ['Russia', 'Nigeria', 'Ukraine'];
        if (unusualLocations.some(loc => location.toLowerCase().includes(loc.toLowerCase()))) {
            fraudScore += 25;
        }
        
        // Check for repeated numbers (potential fake cards)
        const repeatedDigits = cardNumber.match(/(\d)\1{3,}/);
        if (repeatedDigits) {
            fraudScore += 15;
        }
        
        // Add some randomness to make it interesting
        fraudScore += Math.random() * 10;
        
        // Cap at 100%
        return Math.min(100, Math.round(fraudScore));
    }
    
    // Show result with appropriate styling
    function showResult(message, type) {
        resultBody.innerHTML = `<p class="${type}">${message}</p>`;
        
        // Add some additional checks if it's fraud or warning
        if (type === 'fraud') {
            resultBody.innerHTML += `
                <p><i class="fas fa-exclamation-triangle"></i> Recommendation: Decline transaction and notify card holder.</p>
                <p><i class="fas fa-shield-alt"></i> Security Tip: Contact your bank immediately if you didn't authorize this.</p>
            `;
        } else if (type === 'warning') {
            resultBody.innerHTML += `
                <p><i class="fas fa-info-circle"></i> Recommendation: Verify transaction with card holder.</p>
                <p><i class="fas fa-phone"></i> Security Tip: Call the number on the back of your card for assistance.</p>
            `;
        } else {
            resultBody.innerHTML += `
                <p><i class="fas fa-check-circle"></i> Recommendation: You may proceed with the transaction.</p>
                <p><i class="fas fa-lock"></i> Security Tip: Always monitor your account for unauthorized activity.</p>
            `;
        }
    }
});