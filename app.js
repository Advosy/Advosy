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
    "range": "Dashboard!A1:O31"
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
  sheetDataDiv.innerHTML = ''; // Clear any old data

  // Create a table element
  const table = document.createElement('table');
  table.classList.add('styled-table'); // Add a CSS class for styling

  // Loop through the data and populate the table
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    
    // Use the first row for table headers
    if (index === 0) {
      row.forEach(cell => {
        const th = document.createElement('th');
        th.textContent = cell;
        tr.appendChild(th);
      });
    } else {
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
    }
    
    table.appendChild(tr);
  });

  sheetDataDiv.appendChild(table); // Append the table to the div
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
