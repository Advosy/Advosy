// Authenticate user
function authenticate() {
  console.log("Starting Google authentication...");
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(function() {
      console.log("Sign-in successful");
    },
    function(err) {
      console.error("Error signing in", err);
    });
}

// Load Google Sheets API client
function loadClient() {
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw");
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(function() {
      console.log("GAPI client loaded for API");
    },
    function(err) {
      console.error("Error loading GAPI client for API", err);
    });
}

// Fetch data from Google Sheets
function fetchSheetData() {
  return gapi.client.sheets.spreadsheets.values.get({
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Your spreadsheet ID
    "range": "App!A1:I34" // Adjust the range as needed
  })
  .then(function(response) {
    console.log("Data fetched successfully:", response.result.values);
    displayData(response.result.values);
  },
  function(error) {
    console.error("Error fetching data", error);
  });
}

// Display data and render tables
function displayData(data) {
  console.log("Displaying data:", data);
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  // Display the first 5 tables
  for (let i = 0; i < 5; i++) {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = `Table ${i + 1}`;
    section.appendChild(heading);

    const table = document.createElement('table');
    const headerRow = data[i][0];
    const dataRow = data[i][1];

    const headerTr = document.createElement('tr');
    headerRow.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerTr.appendChild(th);
    });
    table.appendChild(headerTr);

    const dataTr = document.createElement('tr');
    dataRow.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      dataTr.appendChild(td);
    });
    table.appendChild(dataTr);

    section.appendChild(table);
    sheetDataDiv.appendChild(section);
  }

  // Handle the Month and Sales data
  const monthSalesSection = document.createElement('section');
  const heading = document.createElement('h2');
  heading.textContent = 'Sales Data';
  monthSalesSection.appendChild(heading);

  const monthSalesTable = document.createElement('table');
  const monthHeaderRow = data[5][0];
  const monthSalesRows = data[5].slice(1);

  const headerTr = document.createElement('tr');
  monthHeaderRow.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerTr.appendChild(th);
  });
  monthSalesTable.appendChild(headerTr);

  monthSalesRows.forEach(row => {
    const dataTr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      dataTr.appendChild(td);
    });
    monthSalesTable.appendChild(dataTr);
  });

  monthSalesSection.appendChild(monthSalesTable);
  sheetDataDiv.appendChild(monthSalesSection);

  // Render the stacked bar chart for Sales
  renderStackedBarChart(data[5]);
}

// Render stacked bar chart
function renderStackedBarChart(data) {
  const months = data.slice(1).map(row => row[0]);
  const sales = data.slice(1).map(row => row[1]);

  const chartCanvas = document.createElement('canvas');
  document.getElementById('sheetData').appendChild(chartCanvas);

  new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Sales',
        data: sales,
        backgroundColor: '#4CAF50'
      }]
    },
    options: {
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

// Load the API and set up the click event for the button
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");

  gapi.load("client:auth2", function() {
    console.log("GAPI client and auth2 loaded");
    gapi.auth2.init({
      client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com'
    }).then(function() {
      console.log("Google Auth initialized");
    });
  });

  document.getElementById('loadData').addEventListener('click', function() {
    console.log("Button clicked, starting authentication...");
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
