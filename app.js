// Initialize Google Identity Services once the GIS script is fully loaded
let tokenClient;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // Ensure GIS script is loaded before using it
  window.onload = function () {
    console.log("Google Identity Services (GIS) script loaded");

    // Initialize GIS token client
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com', // Your Client ID
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      callback: handleTokenResponse // Define a callback to handle the response
    });

    // Set up the click event for the button
    document.getElementById('loadData').addEventListener('click', function() {
      console.log("Button clicked, starting authentication...");
      tokenClient.requestAccessToken(); // Request token for the user
    });
  };
});

// Function to handle the token response
function handleTokenResponse(response) {
  if (response.error) {
    console.error('Token response error:', response.error);
    return;
  }
  console.log('Access token received:', response.access_token);
  loadClient(); // Load the Google Sheets API after authentication
}

// Load the Google Sheets API
function loadClient() {
  console.log('Loading Google Sheets API...');
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Your API key
  gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(function() {
      console.log("GAPI client loaded for API");
      fetchSheetData(); // Fetch the data once the client is loaded
    }, function(err) {
      console.error("Error loading GAPI client:", err);
    });
}

// Fetch data from Google Sheets
function fetchSheetData() {
  console.log('Fetching data from Google Sheets...');
  gapi.client.sheets.spreadsheets.values.get({
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs",
    "range": "App!A1:I34" // Adjust the range as needed
  })
  .then(function(response) {
    console.log("Data fetched successfully:", response.result.values);
    if (!response.result.values || response.result.values.length === 0) {
      console.warn("No data returned from the sheet.");
    } else {
      displayData(response.result.values);
    }
  }, function(error) {
    console.error("Error fetching data from Google Sheets:", error);
  });
}

// Function to display the data
function displayData(data) {
  console.log("Displaying data:", data);
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  // Assuming the data is an array of rows
  data.forEach((row, index) => {
    const rowDiv = document.createElement('div');
    rowDiv.textContent = `Row ${index + 1}: ${row.join(', ')}`;
    sheetDataDiv.appendChild(rowDiv);
  });
}
