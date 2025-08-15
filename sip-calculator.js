let sipChart;

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateSip);
});

function calculateSip() {
    // --- Get Input Values ---
    const currencySymbol = document.getElementById('currency').value;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const annualReturnRate = parseFloat(document.getElementById('returnRate').value);
    const timePeriodYears = parseFloat(document.getElementById('timePeriod').value);

    // --- Validation ---
    if (isNaN(monthlyInvestment) || isNaN(annualReturnRate) || isNaN(timePeriodYears) || monthlyInvestment <= 0 || annualReturnRate <= 0 || timePeriodYears <= 0) {
        alert('Please fill in all fields with valid positive numbers.');
        return;
    }

    // --- Calculations ---
    const monthlyReturnRate = annualReturnRate / 12 / 100;
    const numberOfMonths = timePeriodYears * 12;

    const futureValue = monthlyInvestment * ( (Math.pow(1 + monthlyReturnRate, numberOfMonths) - 1) / monthlyReturnRate ) * (1 + monthlyReturnRate);
    const totalInvestment = monthlyInvestment * numberOfMonths;
    const wealthGained = futureValue - totalInvestment;

    // --- Display Results ---
    const resultDiv = document.getElementById('result');
    if (isFinite(futureValue)) {
        resultDiv.innerHTML = `
            <p><strong>Future Value:</strong> ${currencySymbol}${futureValue.toFixed(2)}</p>
            <p><strong>Total Invested:</strong> ${currencySymbol}${totalInvestment.toFixed(2)}</p>
            <p><strong>Wealth Gained:</strong> ${currencySymbol}${wealthGained.toFixed(2)}</p>
        `;

        // --- Generate Chart ---
        const ctx = document.getElementById('sipChart').getContext('2d');
        if (sipChart) {
            sipChart.destroy();
        }
        sipChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Total Investment', 'Wealth Gained'],
                datasets: [{
                    label: 'Investment Breakdown',
                    data: [totalInvestment, wealthGained],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
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
                        text: 'Investment vs. Wealth Gained'
                    }
                }
            }
        });

    } else {
        resultDiv.innerHTML = `<p>Could not calculate the future value. Please check your inputs.</p>`;
        if (sipChart) {
            sipChart.destroy();
        }
    }
}
