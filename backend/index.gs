function doGet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var jsonData = JSON.stringify(data);

  return ContentService.createTextOutput(jsonData).setMimeType(
    ContentService.MimeType.JSON
  );
}

function fetchAndUpdateDiningCapacity() {
  var now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  var day = now.getDay();
  var currentTime = now.getHours() + now.getMinutes() / 60;

  var isWeekday = day >= 1 && day <= 5;
  var isWeekend = day === 0 || day === 6;

  if (
    (isWeekday && (currentTime < 7 || currentTime >= 21)) ||
    (isWeekend && (currentTime < 8 || currentTime >= 20))
  ) {
    Logger.log("Outside of operational hours. Function will not run.");
    return;
  }

  // Get the API URL from script properties
  var scriptProperties = PropertiesService.getScriptProperties();
  var apiUrl = scriptProperties.getProperty("API_URL");

  // If the API URL is not set, log an error and return
  if (!apiUrl) {
    Logger.log(
      "API URL is not set in script properties. Please set it using setApiUrl() function."
    );
    return;
  }

  var response = UrlFetchApp.fetch(apiUrl);
  var data = JSON.parse(response.getContentText());

  var validEntries = data.capacity.filter(function (location) {
    return location.capacity_count && location.capacity_count.trim() !== "";
  });

  if (validEntries.length === 0) {
    Logger.log("No valid entries found. No row added.");
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Values") || ss.insertSheet("Values");

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  if (headers.length === 0) {
    headers = ["Timestamp"];
    sheet.getRange(1, 1).setValue("Timestamp");
  }

  var rowData = new Array(headers.length).fill("");
  rowData[0] = now;

  validEntries.forEach(function (location) {
    var columnIndex = headers.indexOf(location.name);
    if (columnIndex === -1) {
      headers.push(location.name);
      columnIndex = headers.length - 1;
      sheet.getRange(1, columnIndex + 1).setValue(location.name);
    }
    rowData[columnIndex] = location.capacity_count;
  });

  sheet.appendRow(rowData);
  sheet.autoResizeColumns(1, headers.length);

  Logger.log(
    "New row added successfully with " + validEntries.length + " valid entries."
  );
}

// Function to set the API URL in script properties
function setApiUrl(url) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("API_URL", url);
  Logger.log("API URL has been set successfully.");
}
