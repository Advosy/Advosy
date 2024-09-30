let tokenClient;
let accessToken = null;
let gisLoadedFlag = false;
let gapiLoadedFlag = false;

// Handle gapi client load
function handleClientLoad() {
  console.log('gapi client loading...');
  gapi.load('client', initializeGapiClient); // Load gapi client
}

// Initialize Google API client (gapi)
function initializeGapiClient() {
  console.log('Initializing gapi client...');
  gapi.client.init({
    apiKey: 'AIzaSyAOnBct76Z-dCtn3GtQBvPIaSriGgA8ohw', // Your API Key
  }).then(() => {
    console.log('gapi client initialized successfully.');
    gapiLoadedFlag = true;
  }, (error) => {
    console.error('Error initializing gapi client:', error);
    alert('Error initializing Google API client: ' + JSON.stringify(error));
  });
}

// Initialize Google Identity Services for OAuth
function initOAuth() {
  console.log('Initializing OAuth...');
  
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
    console.error('Google Identity Services script not loaded yet. Retrying...');
    setTimeout(initOAuth, 500); // Retry after 500ms if GIS is not loaded yet
    return;
  }

  console.log('Google Identity Services loaded, setting up token client...');
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: '365324237288-6gc4iopjfudka628e8qv70muus8qp4mg.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: (response) => {
      if (response.error) {
        console.error('Error during authentication:', response);
      } else {
        accessToken = response.access_token;
        console.log('Access token received:', accessToken);
        loadSheetsClient(); // Load Google Sheets API once authenticated
      }
    }
  });

  gisLoadedFlag = true;
}

// Ensure GIS script is fully loaded before initializing OAuth
function ensureGISLoaded() {
  console.log('Checking if Google Identity Services is loaded...');

  // Wait until GIS is fully loaded before initializing
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
    setTimeout(ensureGISLoaded, 100); // Retry every 100ms until GIS is available
  } else {
    console.log('Google Identity Services script loaded.');
    initOAuth(); // Initialize OAuth when GIS is loaded
  }
}

// Trigger authentication when the "Load Data" button is clicked
function authenticate() {
  if (!gisLoadedFlag) {
    console.error('GIS script is not fully loaded yet.');
    alert('Please wait for the Google Identity Services to load before proceeding.');
    return;
  }

  if (!tokenClient) {
    console.error('tokenClient is not initialized yet.');
    alert('OAuth client is not ready. Please try again in a moment.');
    return;
  }

  if (!accessToken) {
    console.log('Requesting new access token...');
    tokenClient.requestAccessToken();
  } else {
    console.log('Already authenticated, access token exists.');
    loadSheetsClient(); // Load Google Sheets API
  }
}

// Load the Google Sheets API client
function loadSheetsClient() {
  if (!gapiLoadedFlag) {
    console.error('gapi client is not fully loaded yet.');
    setTimeout(loadSheetsClient, 100); // Retry every 100ms until gapi is loaded
    return;
  }

  console.log('Attempting to load Google Sheets API...');
  
  try {
    gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4").then(() => {
      console.log('Google Sheets API loaded successfully.');
      fetchSheetData(); // Proceed to fetch the data
    }, (err) => {
      console.error('Error loading Google Sheets API:', err);
      alert('Error loading Google Sheets API: ' + JSON.stringify(err));
    });
  } catch (error) {
    console.error('Unexpected error when loading Google Sheets API:', error);
    alert('Unexpected error: ' + error.message);
  }
}

// Fetch data from Google Sheets
function fetchSheetData() {
  console.log('Attempting to fetch data from Google Sheets...');
  // The rest of your fetchSheetData function remains unchanged
}
