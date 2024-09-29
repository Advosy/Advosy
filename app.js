// Authenticate and load Google Sheets API
function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(() => {
      console.log("Sign-in successful");
    }, (err) => {
      console.error("Error signing in", err);
    });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Replace with your actual API key
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(() => {
      console.log("GAPI client loaded for API");
    }, (err) => {
      console.error("Error loading GAPI client for API", err);
    });
}

function fetchSheetData() {
  gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Replace with your actual Spreadsheet ID
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

  // Display Monthly Roofing Data
  renderDataSection('Monthly Roofing Data', roofingData);

  // Display Monthly Solar Data
  renderDataSection('Monthly Solar Data', solarData);

  // Display Point Data
  renderDataSection('Point Data', pointData);

  // Display Yearly Roofing Data
  renderDataSection('Yearly Roofing Data', yearlyRoofingData);

  // Display Yearly Solar Data
  renderDataSection('Yearly Solar Data', yearlySolarData);
}

// Helper function to display each data section as a card or table
function renderDataSection(title, data) {
  const sheetDataDiv = document.getElementById('sheetData');
  
  const section = document.createElement('section');
  section.innerHTML = `<h2>${title}</h2>`;

  const table = document.createElement('table');
  table.className = 'styled-table';

  // Render the header row
  const headerRow = document.createElement('tr');
  data[0].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Render the data row
  const dataRow = document.createElement('tr');
  data[1].forEach(value => {
    const td = document.createElement('td');
    td.textContent = value || 'N/A'; // Handle missing data
    dataRow.appendChild(td);
  });
  table.appendChild(dataRow);

  section.appendChild(table);
  sheetDataDiv.appendChild(section);
}

// Render the stacked bar chart for Total Roofing and Solar Sales Per Month
function renderStackedSalesChart(totalRoofingSalesPerMonth, totalSolarSalesPerMonth) {
  const monthsRoofing = totalRoofingSalesPerMonth.slice(1).map(row => row[0]); // Months from A17:A28
  const salesRoofing = totalRoofingSalesPerMonth.slice(1).map(row => parseInt(row[1], 10)); // Roofing Sales from B17:B28

  const monthsSolar = totalSolarSalesPerMonth.slice(1).map(row => row[0]); // Months from D17:D28
  const salesSolar = totalSolarSalesPerMonth.slice(1).map(row => parseInt(row[1], 10)); // Solar Sales from E17:E28

  const months = monthsRoofing; // Both datasets should have the same months

  // Create the chart canvas
  const chartCanvas = document.createElement('canvas');
  chartCanvas.id = 'stackedSalesChart';
  document.getElementById('sheetData').appendChild(chartCanvas); // Append canvas to the sheet data div

  const ctx = document.getElementById('stackedSalesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months, // Use the months as the labels
      datasets: [
        {
          label: 'Roofing Sales',
          data: salesRoofing, // Data for roofing sales
          backgroundColor: '#4CAF50' // Green for roofing sales
        },
        {
          label: 'Solar Sales',
          data: salesSolar, // Data for solar sales
          backgroundColor: '#FFA500' // Orange for solar sales
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true
        }
      }
    }
  });
}

// Load the API and set up the click event for the button
document.addEventListener("DOMContentLoaded", () => {
  gapi.load("client:auth2", () => {
    gapi.auth2.init({client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com'}); // Initialize with your Client ID
  });

  document.getElementById('loadData').addEventListener('click', () => {
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
