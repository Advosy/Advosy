function displayData(roofingData, solarData, pointData, yearlyRoofingData, yearlySolarData, totalRoofingSalesPerMonth, totalSolarSalesPerMonth) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear any old data

  // Render the stacked bar chart for Total Roofing and Solar Sales Per Month
  renderStackedSalesChart(totalRoofingSalesPerMonth, totalSolarSalesPerMonth);

  // Display data as tiles instead of tables
  renderDataSectionAsTiles('Monthly Roofing Data', roofingData);
  renderDataSectionAsTiles('Monthly Solar Data', solarData);
  renderDataSectionAsTiles('Point Data', pointData);
  renderDataSectionAsTiles('Yearly Roofing Data', yearlyRoofingData);
  renderDataSectionAsTiles('Yearly Solar Data', yearlySolarData);
}

// Helper function to display each data section as tiles
function renderDataSectionAsTiles(title, data) {
  const sheetDataDiv = document.getElementById('sheetData');
  
  const section = document.createElement('section');
  section.innerHTML = `<h2>${title}</h2>`;

  const tileContainer = document.createElement('div');
  tileContainer.className = 'tile-container'; // Add styling for the tile layout

  // Display each header-value pair as a tile
  data[0].forEach((header, index) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
      <h3>${header}</h3>
      <p>${data[1][index] || 'N/A'}</p> <!-- Handle missing data -->
    `;
    tileContainer.appendChild(tile);
  });

  section.appendChild(tileContainer);
  sheetDataDiv.appendChild(section);
}

// Render the stacked bar chart for Total Roofing and Solar Sales Per Month (same as before)
function renderStackedSalesChart(totalRoofingSalesPerMonth, totalSolarSalesPerMonth) {
  const monthsRoofing = totalRoofingSalesPerMonth.slice(1).map(row => row[0]);
  const salesRoofing = totalRoofingSalesPerMonth.slice(1).map(row => parseInt(row[1], 10));
  const monthsSolar = totalSolarSalesPerMonth.slice(1).map(row => row[0]);
  const salesSolar = totalSolarSalesPerMonth.slice(1).map(row => parseInt(row[1], 10));
  const months = monthsRoofing; // Assuming months are the same in both datasets

  const chartCanvas = document.createElement('canvas');
  chartCanvas.id = 'stackedSalesChart';
  document.getElementById('sheetData').appendChild(chartCanvas);

  const ctx = document.getElementById('stackedSalesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Roofing Sales',
          data: salesRoofing,
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Solar Sales',
          data: salesSolar,
          backgroundColor: '#FFA500'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

// Load the API and set up the click event for the button
document.addEventListener("DOMContentLoaded", () => {
  gapi.load("client:auth2", () => {
    gapi.auth2.init({client_id: 'YOUR_CLIENT_ID'}); // Replace with your actual Client ID
  });

  document.getElementById('loadData').addEventListener('click', () => {
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
