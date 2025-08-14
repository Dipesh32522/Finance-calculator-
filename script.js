document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateEmi);
});

function calculateEmi() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure) || loanAmount <= 0 || interestRate <= 0 || loanTenure <= 0) {
        alert('Please enter valid positive numbers for all fields.');
        return;
    }

    const monthlyInterestRate = interestRate / (12 * 100);
    const numberOfMonths = loanTenure * 12;

    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    if (isFinite(emi)) {
        document.getElementById('emi').innerText = emi.toFixed(2);
    } else {
        alert('Could not calculate EMI. Please check your inputs.');
        document.getElementById('emi').innerText = '0';
    }
}
