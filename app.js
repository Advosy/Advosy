let tokenClient;
let accessToken = null;

// Initialize Google Identity Services for OAuth
function initOAuth() {
  console.log('Initializing OAuth...');

  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
    console.error('Google Identity Services script not loaded yet.');
    return;
  }

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com', // Your Client ID
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: (response) => {
      if (response.error) {
        console.error('Error during authentication:', response);
      } else {
        accessToken = response.access_token;
        console.log('Access token received:', accessToken);
        loadClient(); // Load Google Sheets API once authenticated
      }
    }
  });
}

// This function will wait for GIS to load before initializing OAuth
function ensureGISLoaded() {
  console.log('Ensuring Google Identity Services script is loaded...');

  // Wait until GIS is fully loaded before initializing
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
    setTimeout(ensureGISLoaded, 100); // Retry every 100ms until loaded
  } else {
    console.log('Google Identity Services loaded.');
    initOAuth(); // Initialize OAuth when GIS is loaded
  }
}

// Trigger authentication when the "Load Data" button is clicked
function authenticate() {
  if (!tokenClient) {
    console.error('tokenClient is not initialized yet.');
    return;
  }

  if (!accessToken) {
    console.log('Requesting new access token...');
    tokenClient.requestAccessToken();
  } else {
    console.log('Already authenticated, access token exists.');
    loadClient();
  }
}

// Load the Google Sheets API client
function loadClient() {
  console.log('Attempting to load Google Sheets API...');

  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Your API Key
  gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4").then(() => {
    console.log('Google Sheets API loaded successfully.');
    fetchSheetData(); // Proceed to fetch the data
  }, (err) => {
    console.error('Error loading Google Sheets API:', err);
    alert('Error loading Google Sheets API: ' + JSON.stringify(err));
  });
}

// Fetch data from Google Sheets
function fetchSheetData() {
  console.log('Attempting to fetch data from Google Sheets...');

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
    console.log('Data successfully fetched from Google Sheets:', response);

    const roofingData = response.result.valueRanges[0].values;
    const solarData = response.result.valueRanges[1].values;
    const pointData = response.result.valueRanges[2].values;
    const yearlyRoofingData = response.result.valueRanges[3].values;
    const yearlySolarData = response.result.valueRanges[4].values;
    const totalRoofingSalesPerMonth = response.result.valueRanges[5].values;
    const totalSolarSalesPerMonth = response.result.valueRanges[6].values;

    displayData(roofingData, solarData, pointData, yearlyRoofingData, yearlySolarData, totalRoofingSalesPerMonth, totalSolarSalesPerMonth);
  }, (err) => {
    console.error('Error fetching data from Google Sheets:', err);
    alert('Error fetching data from Google Sheets: ' + JSON.stringify(err));
  });
}

// Display data in tile format
function displayData(roofingData, solarData, pointData, yearlyRoofingData, yearlySolarData, totalRoofingSalesPerMonth, totalSolarSalesPerMonth) {
  console.log('Displaying data...');

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
  console.log('Rendering the stacked sales chart...');

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

// Initialize OAuth when the GIS script is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM fully loaded, ensuring GIS is loaded...');
  ensureGISLoaded(); // Ensure GIS is loaded first
  document.getElementById('loadData').addEventListener('click', () => {
    authenticate(); // Start authentication on button click
  });
});
