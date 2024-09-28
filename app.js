function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/spreadsheets.readonly"})
    .then(function() { console.log("Sign-in successful"); },
          function(err) { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw");
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(function() { console.log("GAPI client loaded for API"); },
          function(err) { console.error("Error loading GAPI client for API", err); });
}

function fetchSheetData() {
  return gapi.client.sheets.spreadsheets.values.get({
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs",
    "range": "Sheet1!A1:E10"
  })
  .then(function(response) {
    console.log("Data fetched", response.result.values);
    displayData(response.result.values);
  }, function(error) {
    console.error("Error fetching data", error);
  });
}

function displayData(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = '';  // Clear any old data
  data.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.textContent = row.join(', ');
    sheetDataDiv.appendChild(rowDiv);
  });
}

// Load the API and make the fetch call when button is clicked
document.getElementById('loadData').addEventListener('click', function() {
  authenticate().then(loadClient).then(fetchSheetData);
});
