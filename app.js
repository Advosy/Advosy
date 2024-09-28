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
  sheetDataDiv.innerHTML = ''; // Clear any old data

  // Loop through the data and create cards
  data.forEach((row, index) => {
    if (index === 0) {
      return; // Skip the header row
    }

    // Create a card div for each row of data
    const card = document.createElement('div');
    card.classList.add('card');

    // Assuming the first column is the title, and the rest are details
    const title = document.createElement('h3');
    title.textContent = row[0]; // Use the first column as the title
    card.appendChild(title);

    // Loop through the rest of the columns and add them as details
    for (let i = 1; i < row.length; i++) {
      const detail = document.createElement('p');
      detail.textContent = row[i]; // Add other data as paragraphs
      card.appendChild(detail);
    }

    // Add the card to the sheetDataDiv
    sheetDataDiv.appendChild(card);
  });
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
