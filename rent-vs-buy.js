let comparisonChart;

document.addEventListener('DOMContentLoaded', () => {
    const compareBtn = document.getElementById('compareBtn');
    compareBtn.addEventListener('click', calculateRentVsBuy);
});

function calculateRentVsBuy() {
    // --- Get Input Values ---
    const currencySymbol = document.getElementById('currency').value;

    // Renting
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);

    // Buying
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);
    const propertyTaxRate = parseFloat(document.getElementById('propertyTax').value);
    const maintenanceRate = parseFloat(document.getElementById('maintenance').value);
    const appreciationRate = parseFloat(document.getElementById('appreciation').value);

    // --- Validation ---
    const allInputs = [monthlyRent, propertyPrice, downPayment, interestRate, loanTenure, propertyTaxRate, maintenanceRate, appreciationRate];
    if (allInputs.some(isNaN)) {
        alert('Please fill in all fields with valid numbers.');
        return;
    }

    // --- Calculations ---
    const numberOfMonths = loanTenure * 12;

    // Total Cost of Renting
    const totalRentCost = monthlyRent * numberOfMonths;

    // Total Cost of Buying
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / (12 * 100);
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    if (!isFinite(emi)) {
        alert('Could not calculate EMI for the loan. Please check buying details.');
        return;
    }

    const totalLoanPayments = emi * numberOfMonths;
    const totalPropertyTax = (propertyPrice * (propertyTaxRate / 100)) * loanTenure;
    const totalMaintenance = (propertyPrice * (maintenanceRate / 100)) * loanTenure;

    const totalBuyingCost_outflows = downPayment + totalLoanPayments + totalPropertyTax + totalMaintenance;

    // Future value of property (Asset Appreciation)
    const futurePropertyValue = propertyPrice * Math.pow(1 + (appreciationRate / 100), loanTenure);

    // Net cost of buying (outflows - equity/asset value)
    const netBuyingCost = totalBuyingCost_outflows - futurePropertyValue;

    // --- Display Results ---
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>Comparison Over ${loanTenure} Years</h3>
        <p><strong>Total Cost of Renting:</strong> ${currencySymbol}${totalRentCost.toFixed(2)}</p>
        <p><strong>Net Cost of Buying:</strong> ${currencySymbol}${netBuyingCost.toFixed(2)}</p>
        <h4>${netBuyingCost < totalRentCost ? 'Buying is cheaper!' : 'Renting is cheaper!'}</h4>
        <p>Buying becomes cheaper by ${currencySymbol}${Math.abs(totalRentCost - netBuyingCost).toFixed(2)} over the period.</p>
    `;

    // --- Generate Chart ---
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Cost of Renting', 'Net Cost of Buying'],
            datasets: [{
                label: 'Cost Comparison',
                data: [totalRentCost, netBuyingCost],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return currencySymbol + value.toLocaleString();
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Financial Comparison: Renting vs. Buying over ${loanTenure} years`
                }
            }
        }
    });
}
