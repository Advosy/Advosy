// Initialize Google Identity Services
let tokenClient;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

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
  gapi.client.setApiKey("AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw"); // Your API key
  gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4").then(function() {
    console.log("GAPI client loaded for API");
    fetchSheetData(); // Fetch the data once the client is loaded
  });
}

// Fetch data from Google Sheets
function fetchSheetData() {
  gapi.client.sheets.spreadsheets.values.get({
    "spreadsheetId": "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs",
    "range": "App!A1:I34"
  }).then(function(response) {
    console.log("Data fetched successfully:", response.result.values);
    displayData(response.result.values);
  }, function(error) {
    console.error("Error fetching data:", error);
  });
}

// Function to display the data
function displayData(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  // Process and display data here (as per your earlier logic)
  // You can add your own logic to display the data in cards or tables
}
