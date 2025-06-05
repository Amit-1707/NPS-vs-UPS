
function calculate() {
  const basicPay = parseFloat(document.getElementById('basicPay').value);
  const daPercent = parseFloat(document.getElementById('daPercent').value);
  const increment = parseFloat(document.getElementById('increment').value) / 100;
  const years = parseInt(document.getElementById('yearsService').value);
  const npsCorpus = parseFloat(document.getElementById('npsCorpus').value);
  const roi = parseFloat(document.getElementById('roi').value) / 100;
  const annuityRate = parseFloat(document.getElementById('annuity').value) / 100;

  const finalBasic = basicPay * Math.pow(1 + increment, years);
  const avgBasic = finalBasic * (1 - 1 / Math.pow(1 + increment, years)) / (increment * years);
  const upsPension = 0.5 * avgBasic;
  const upsLump = 1344160;
  const upsTotal = upsLump + upsPension * 12 * 20;

  let totalCorpus = npsCorpus;
  for (let i = 0; i < years; i++) {
    const contribution = 0.10 * (basicPay * Math.pow(1 + increment, i)) * (1 + daPercent / 100);
    totalCorpus += contribution * Math.pow(1 + roi, years - i);
  }
  const npsLump = 0.6 * totalCorpus;
  const npsPension = 0.4 * totalCorpus * annuityRate / 12;
  const npsTotal = npsLump + npsPension * 12 * 20;

  document.getElementById('results').innerHTML = `
    <h2>Results</h2>
    <table border="1" cellpadding="10">
      <tr><th>Metric</th><th>UPS</th><th>NPS</th></tr>
      <tr><td>Monthly Pension (₹)</td><td>${Math.round(upsPension)}</td><td>${Math.round(npsPension)}</td></tr>
      <tr><td>Lump Sum (₹)</td><td>${upsLump}</td><td>${Math.round(npsLump)}</td></tr>
      <tr><td>Total Benefit (20 yrs)</td><td>${Math.round(upsTotal)}</td><td>${Math.round(npsTotal)}</td></tr>
    </table>
  `;

  const ctx = document.getElementById('chartCanvas').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Monthly Pension', 'Lump Sum', 'Total Benefit'],
      datasets: [
        {
          label: 'UPS',
          data: [Math.round(upsPension), upsLump, Math.round(upsTotal)],
          backgroundColor: '#3498db'
        },
        {
          label: 'NPS',
          data: [Math.round(npsPension), Math.round(npsLump), Math.round(npsTotal)],
          backgroundColor: '#2ecc71'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function exportPDF() {
  const element = document.querySelector('.result');
  html2pdf().from(element).save('UPS_vs_NPS_Result.pdf');
}
