function authenticate() {
  console.log("Starting Google authentication..."); // Log when authentication starts
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(function() {
      console.log("Sign-in successful");
    },
    function(err) {
      console.error("Error signing in", err); // Log errors during authentication
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
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Your actual spreadsheet ID
    "range": "App!A1:I34" // Adjust the range as needed
  })
  .then(function(response) {
    console.log("Data fetched successfully:", response.result.values); // Log the data
    displayData(response.result.values); // Call displayData function
  },
  function(error) {
    console.error("Error fetching data", error); // Log any errors
  });
}


function displayData(data) {
  console.log("Displaying data:", data); // Log the data passed to the function
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data
  
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

  function displayData(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  // Code for grouping the first 5 tables with a header and data row

  // Code for Month and Sales data table and bar chart
  renderStackedBarChart(data[5]); // Call the bar chart function after the table
}

// Add the renderStackedBarChart function here, below the displayData function
function renderStackedBarChart(data) {
  // Code for creating the stacked bar chart
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

// Any other script logic, such as event listeners, should be after this


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

