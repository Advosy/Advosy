// Authenticate and load Google Sheets API
function authenticate() {
  console.log("Starting authentication...");
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(() => {
      console.log("Sign-in successful");
    }, (err) => {
      console.error("Error signing in", err);
    });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Your API Key
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(() => {
      console.log("GAPI client loaded for API");
    }, (err) => {
      console.error("Error loading GAPI client for API", err);
    });
}

function fetchSheetData() {
  gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Your Spreadsheet ID
    ranges: [
      "App!A1:G2",  // Monthly Roofing Data
      "App!A4:I5",  // Monthly Solar Data
      "App!A7:I7",  // Point Data
      "App!A10:G11", // Yearly Roofing Data
      "App!A13:I14", // Yearly Solar Data
      "App!A16:B28", // Total Roofing Sales Per Month
      "App!D16:E28"  // Total Solar Sales Per Month
    ]
  }).then((response) => {
    const roofingData = response.result.valueRanges[0].values;
    const solarData = response.result.valueRanges[1].values;
    const pointData = response.result.valueRanges[2].values;
    const yearlyRoofingData = response.result.valueRanges[3].values;
    const yearlySolarData = response.result.valueRanges[4].values;
    const totalRoofingSalesPerMonth = response.result.valueRanges[5].values;
    const totalSolarSalesPerMonth = response.result.valueRanges[6].values;

    displayData(roofingData, solarData, pointData, yearlyRoofingData, yearlySolarData, totalRoofingSalesPerMonth, totalSolarSalesPerMonth);
  }, (err) => {
    console.error("Error fetching data", err);
  });
}

function displayData(roofingData, solarData, pointData, yearlyRoofingData, yearlySolarData, totalRoofingSalesPerMonth, totalSolarSalesPerMonth) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear any old data

  // Render the stacked bar chart for Total Roofing and Solar Sales Per Month
  renderStackedSalesChart(totalRoofingSalesPerMonth, totalSolarSalesPerMonth);

  // Display data as tiles with correct styling and colors
  renderDataSectionAsTiles('Monthly Roofing Data', roofingData, 'roofing');
  renderDataSectionAsTiles('Monthly Solar Data', solarData, 'solar');
  renderDataSectionAsTiles('Point Data', pointData, 'points');
  renderDataSectionAsTiles('Yearly Roofing Data', yearlyRoofingData, 'roofing');
  renderDataSectionAsTiles('Yearly Solar Data', yearlySolarData, 'solar');
}

// Helper function to display each data section as tiles with color-coded headers
function renderDataSectionAsTiles(title, data, type) {
  const sheetDataDiv = document.getElementById('sheetData');
  
  const section = document.createElement('section');
  section.innerHTML = `<h2>${title}</h2>`;

  const tileContainer = document.createElement('div');
  tileContainer.className = 'tile-container';

  // Display each header-value pair as a tile, apply color coding for solar and roofing
  data[0].forEach((header, index) => {
    const tile = document.createElement('div');
    tile.className = `tile ${type}`; // Add type-specific class for color coding
    tile.innerHTML = `
      <p class="tile-value">${data[1][index] || 'N/A'}</p> <!-- Value -->
      <h3 class="tile-header">${header}</h3> <!-- Header -->
    `;
    tileContainer.appendChild(tile);
  });

  section.appendChild(tileContainer);
  sheetDataDiv.appendChild(section);
}

// Render the stacked bar chart for Total Roofing and Solar Sales Per Month
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
          backgroundColor: '#4678bc' // Navy blue for roofing sales
        },
        {
          label: 'Solar Sales',
          data: salesSolar,
          backgroundColor: '#e0bc67' // Gold for solar sales
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
    gapi.auth2.init({client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com'}); // Your Client ID
  });

  document.getElementById('loadData').addEventListener('click', () => {
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
