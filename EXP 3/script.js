

function calculateTax() {
  var name = document.getElementById("name").value;
  var panNumber = document.getElementById("panNumber").value;
  var salary = parseFloat(document.getElementById("salary").value);
  var rent = parseFloat(document.getElementById("rent").value);
  var otherIncome = parseFloat(document.getElementById("otherIncome").value);
  var lifeInsurance = parseFloat(document.getElementById("lifeInsurance").value);
  var educationLoan = parseFloat(document.getElementById("educationLoan").value);
  var homeLoan = parseFloat(document.getElementById("homeLoan").value);

  if (!name || !panNumber || isNaN(salary) || isNaN(rent) || isNaN(otherIncome) || isNaN(lifeInsurance) || isNaN(educationLoan) || isNaN(homeLoan)) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  if (salary < 0 || rent < 0 || otherIncome < 0 || lifeInsurance < 0 || educationLoan < 0 || homeLoan < 0) {
    alert("Please enter positive values for income and expenses.");
    return;
  }

  var totalIncome = salary + rent + otherIncome;
  var totalExpenses = lifeInsurance + educationLoan + homeLoan;
  var taxableIncome = totalIncome - totalExpenses;

  var taxAmount = calculateTaxAmount(taxableIncome);

  var formattedTaxAmount = formatAsRupees(taxAmount);

  var resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = "<div class='result-summary'>" +
                            "<h2>Tax Summary</h2>" +
                            "<p><strong>Name:</strong> " + name + "</p>" +
                            "<p><strong>PAN Number:</strong> " + panNumber + "</p>" +
                            "<p><strong>Total Income:</strong> Rs. " + totalIncome.toFixed(2) + "</p>" +
                            "<p><strong>Taxable Income:</strong> Rs. " + taxableIncome.toFixed(2) + "</p>" +
                            "<p><strong>Tax:</strong> Rs. " + formattedTaxAmount + "</p>" +
                         "</div>";
}

function calculateTaxAmount(income) {
  var tax = 0;
  if (income <= 25000) {
    tax = 0;
  } else if (income <= 50000) {
    tax = (income - 25000) * 0.05;
  } else if (income <= 100000) {
    tax = (25000 * 0.05) + ((income - 50000) * 0.1);
  } else {
    tax = (25000 * 0.05) + (50000 * 0.1) + ((income - 100000) * 0.15);
  }
  return tax;
}

function formatAsRupees(amount) {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}
