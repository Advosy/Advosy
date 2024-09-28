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
  data.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.textContent = row.join(', ');
    sheetDataDiv.appendChild(rowDiv);
  });
}

// Load the API and set up the click event for the button
document.addEventListener("DOMContentLoaded", function() {
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: 'YOUR_CLIENT_ID'}); // Initialize with your Client ID
  });

  document.getElementById('loadData').addEventListener('click', function() {
    authenticate().then(loadClient).then(fetchSheetData);
  });
});
