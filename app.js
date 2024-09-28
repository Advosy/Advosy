function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(function() {
      console.log("Sign-in successful");
    },
    function(err) {
      console.error("Error signing in", err);
    });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Replace with your actual API key
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(function() {
      console.log("GAPI client loaded for API");
    },
    function(err) {
      console.error("Error loading GAPI client for API", err);
    });
}

function fetchSheetData() {
  return gapi.client.sheets.spreadsheets.values.get({
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Replace with your actual Spreadsheet ID
    "range": "App!A1:I34"
  })
  .then(function(response) {
    console.log("Data fetched", response.result.values);
    displayData(response.result.values);
  },
  function(error) {
    console.error("Error fetching data", error);
  });
}

function displayData(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  // Assume the first 5 tables have 2 rows (1 header + 1 data)
  for (let i = 0; i < 5; i++) {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = `Table ${i + 1}`; // Replace with actual table title
    section.appendChild(heading);

    const table = document.createElement('table');
    const headerRow = data[i][0]; // Assume first row is header
    const dataRow = data[i][1]; // Assume second row is data

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

  // Handle the last 2 tables for Month and Sales data
  const monthSalesSection = document.createElement('section');
  const heading = document.createElement('h2');
  heading.textContent = 'Sales Data';
  monthSalesSection.appendChild(heading);

  const monthSalesTable = document.createElement('table');
  const monthHeaderRow = data[5][0]; // Month and Sales Header
  const monthSalesRows = data[5].slice(1); // Remaining rows for months and sales data

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

  // Now render the stacked bar chart for Sales
  renderStackedBarChart(data[5]);
}



// Load the API and set up the click event for the button
document.addEventListener("DOMContentLoaded", function() {
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com'}); // Initialize with your Client ID
  });

  document.getElementById('loadData').addEventListener('click', function() {
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
