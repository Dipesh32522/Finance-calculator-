let emiChart;

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateEmi);
});

function calculateEmi() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);
    const currencySymbol = document.getElementById('currency').value;

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure) || loanAmount <= 0 || interestRate <= 0 || loanTenure <= 0) {
        alert('Please enter valid positive numbers for all fields.');
        return;
    }

    const monthlyInterestRate = interestRate / (12 * 100);
    const numberOfMonths = loanTenure * 12;

    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    if (isFinite(emi)) {
        document.getElementById('currencySymbol').innerText = currencySymbol;
        document.getElementById('emi').innerText = emi.toFixed(2);

        const totalAmountPaid = emi * numberOfMonths;
        const totalInterest = totalAmountPaid - loanAmount;

        const ctx = document.getElementById('emiChart').getContext('2d');

        if (emiChart) {
            emiChart.destroy();
        }

        emiChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    label: 'Loan Breakdown',
                    data: [loanAmount, totalInterest],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Loan Principal vs. Total Interest'
                    }
                }
            }
        });

    } else {
        alert('Could not calculate EMI. Please check your inputs.');
        document.getElementById('currencySymbol').innerText = currencySymbol;
        document.getElementById('emi').innerText = '0';
        if (emiChart) {
            emiChart.destroy();
        }
    }
}
