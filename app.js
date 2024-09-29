document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  window.onload = function () {
    console.log("Google Identity Services (GIS) script loaded");

    // Test directly calling the Sheets API after page load
    gapi.load('client', function() {
      console.log("GAPI client library loaded");

      gapi.client.init({
        apiKey: "AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw", // Your API key
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
      }).then(function () {
        console.log("Google Sheets API loaded");

        // Now try fetching data
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: "1MQIuVmfrruCMyPk1Hc0iGGONHyahDOJ5p_Yd0FhCKQs", // Your spreadsheet ID
          range: "App!A1:I34" // Adjust the range as needed
        }).then(function(response) {
          console.log("Data fetched successfully:", response.result.values);
        }, function(error) {
          console.error("Error fetching data:", error);
        });
      }, function(error) {
        console.error("Error initializing Google Sheets API:", error);
      });
    });
  };
});
