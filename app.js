document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  window.onload = function () {
    console.log("Google Identity Services (GIS) script loaded");

    // Initialize GIS and load Google Sheets API directly
    gapi.load('client', function() {
      console.log("GAPI client library loaded");

      gapi.client.init({
        apiKey: "AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw", // Your API key
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
      }).then(function () {
        console.log("Google Sheets API initialized");

        // Now try fetching data
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Your spreadsheet ID
          range: "App!A1:I34" // Adjust the range as needed
        }).then(function(response) {
          console.log("Data fetched successfully:", response.result.values);
          if (!response.result.values || response.result.values.length === 0) {
            console.warn("No data returned from the sheet.");
          } else {
            displayData(response.result.values);
          }
        }, function(error) {
          console.error("Error fetching data:", error);
          if (error.result && error.result.error) {
            console.error("Detailed error:", error.result.error.message);
          }
        });
      }, function(error) {
        console.error("Error initializing Google Sheets API:", error);
      });
    });
  };
});

// Display data function (kept simple for now)
function displayData(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = ''; // Clear old data

  data.forEach((row, index) => {
    const rowDiv = document.createElement('div');
    rowDiv.textContent = `Row ${index + 1}: ${row.join(', ')}`;
    sheetDataDiv.appendChild(rowDiv);
  });
}
