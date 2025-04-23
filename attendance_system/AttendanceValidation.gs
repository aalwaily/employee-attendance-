/**
 * Employee Attendance System - GPS Validation Script
 * 
 * This script validates employee check-ins based on GPS coordinates.
 * It checks if the employee is within a specified distance of the job site.
 */

// Site coordinates (can be customized)
const SITE_LATITUDE = 26.4334;
const SITE_LONGITUDE = 50.1033;

// Maximum allowed distance from site in meters
const MAX_DISTANCE = 100;

// Column indices (0-based) for the spreadsheet
// These will need to be adjusted based on your actual form fields
const TIMESTAMP_COL = 0;
const NAME_COL = 1;
const EMAIL_COL = 2;
const GPS_COORDINATES_COL = 3;
const VALIDATION_RESULT_COL = 4;
const DISTANCE_COL = 5;

/**
 * Triggers when form is submitted
 */
function onFormSubmit(e) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get the last row (the new submission)
    const lastRow = sheet.getLastRow();
    
    // Check if the validation column header exists, if not add it
    setupHeaders(sheet);
    
    // Get the GPS coordinates from the submission
    const gpsCell = sheet.getRange(lastRow, GPS_COORDINATES_COL + 1).getValue();
    
    // Extract coordinates from the cell value
    const coordinates = extractCoordinates(gpsCell);
    
    if (!coordinates) {
      // If coordinates couldn't be extracted, mark as invalid
      sheet.getRange(lastRow, VALIDATION_RESULT_COL + 1).setValue("❌ Invalid - No coordinates provided");
      sheet.getRange(lastRow, DISTANCE_COL + 1).setValue("N/A");
      return;
    }
    
    // Calculate distance from the site
    const distance = calculateDistance(
      coordinates.latitude, 
      coordinates.longitude, 
      SITE_LATITUDE, 
      SITE_LONGITUDE
    );
    
    // Record the distance
    sheet.getRange(lastRow, DISTANCE_COL + 1).setValue(distance.toFixed(2) + " meters");
    
    // Check if the distance is within the allowed range
    if (distance <= MAX_DISTANCE) {
      // Valid check-in
      sheet.getRange(lastRow, VALIDATION_RESULT_COL + 1).setValue("✅ Present at site");
    } else {
      // Invalid check-in
      sheet.getRange(lastRow, VALIDATION_RESULT_COL + 1).setValue("❌ Not at site – invalid location");
      
      // Optional: Send notification email
      sendNotificationEmail(sheet, lastRow, distance);
    }
    
    // Optional: Check for duplicate check-ins
    checkForDuplicates(sheet, lastRow);
    
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}

/**
 * Sets up the headers for validation columns if they don't exist
 */
function setupHeaders(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Check if validation result column exists
  if (headers.length <= VALIDATION_RESULT_COL || !headers[VALIDATION_RESULT_COL]) {
    sheet.getRange(1, VALIDATION_RESULT_COL + 1).setValue("Attendance Status");
  }
  
  // Check if distance column exists
  if (headers.length <= DISTANCE_COL || !headers[DISTANCE_COL]) {
    sheet.getRange(1, DISTANCE_COL + 1).setValue("Distance from Site");
  }
}

/**
 * Extracts latitude and longitude from a string
 * Expected format: "latitude,longitude" (e.g., "26.4334,50.1033")
 */
function extractCoordinates(coordString) {
  if (!coordString || typeof coordString !== 'string') {
    return null;
  }
  
  // Remove any whitespace and split by comma
  const parts = coordString.toString().trim().split(',');
  
  if (parts.length !== 2) {
    return null;
  }
  
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  
  return {
    latitude: latitude,
    longitude: longitude
  };
}

/**
 * Calculates the distance between two sets of coordinates using the Haversine formula
 * Returns distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

/**
 * Sends a notification email when an employee tries to check in from an invalid location
 */
function sendNotificationEmail(sheet, rowIndex, distance) {
  try {
    // Get employee information
    const employeeName = sheet.getRange(rowIndex, NAME_COL + 1).getValue();
    const employeeEmail = sheet.getRange(rowIndex, EMAIL_COL + 1).getValue();
    const timestamp = sheet.getRange(rowIndex, TIMESTAMP_COL + 1).getValue();
    
    // Format timestamp
    const formattedDate = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "MMM dd, yyyy 'at' hh:mm a");
    
    // Email subject
    const subject = "Invalid Check-in Location Alert";
    
    // Email body
    const body = `
      <html>
        <body>
          <h2>Invalid Check-in Location Alert</h2>
          <p>An employee has attempted to check in from outside the designated work area.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Employee:</strong> ${employeeName}</li>
            <li><strong>Email:</strong> ${employeeEmail}</li>
            <li><strong>Time:</strong> ${formattedDate}</li>
            <li><strong>Distance from site:</strong> ${distance.toFixed(2)} meters (Maximum allowed: ${MAX_DISTANCE} meters)</li>
          </ul>
          <p>This is an automated notification from the Employee Attendance System.</p>
        </body>
      </html>
    `;
    
    // Get the admin email (you can customize this)
    const adminEmail = Session.getEffectiveUser().getEmail();
    
    // Send the email
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: body
    });
    
  } catch (error) {
    Logger.log("Error sending notification email: " + error.toString());
  }
}

/**
 * Checks for duplicate check-ins from the same email on the same day
 */
function checkForDuplicates(sheet, currentRow) {
  try {
    // Get the email and timestamp from the current submission
    const email = sheet.getRange(currentRow, EMAIL_COL + 1).getValue();
    const timestamp = sheet.getRange(currentRow, TIMESTAMP_COL + 1).getValue();
    
    // If no email is provided, skip duplicate checking
    if (!email) return;
    
    // Get the date part of the timestamp
    const currentDate = new Date(timestamp);
    const currentDateString = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip the header row and the current row
    let isDuplicate = false;
    let previousRow = -1;
    
    for (let i = 1; i < data.length; i++) {
      // Skip the current row
      if (i + 1 === currentRow) continue;
      
      const rowEmail = data[i][EMAIL_COL];
      const rowTimestamp = data[i][TIMESTAMP_COL];
      
      // Skip if email doesn't match or timestamp is not valid
      if (rowEmail !== email || !rowTimestamp) continue;
      
      // Check if the date matches
      const rowDate = new Date(rowTimestamp);
      const rowDateString = Utilities.formatDate(rowDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
      
      if (rowDateString === currentDateString) {
        isDuplicate = true;
        previousRow = i + 1; // +1 because array is 0-based but sheet is 1-based
        break;
      }
    }
    
    // If it's a duplicate, mark it
    if (isDuplicate) {
      const currentStatus = sheet.getRange(currentRow, VALIDATION_RESULT_COL + 1).getValue();
      sheet.getRange(currentRow, VALIDATION_RESULT_COL + 1).setValue(currentStatus + " (Duplicate check-in)");
      
      // Optionally, you can add a note to the cell
      sheet.getRange(currentRow, VALIDATION_RESULT_COL + 1).setNote(
        `Previous check-in found at row ${previousRow} on the same day.`
      );
    }
    
  } catch (error) {
    Logger.log("Error checking for duplicates: " + error.toString());
  }
}

/**
 * Creates a trigger to run the script automatically when the form is submitted
 * Run this function manually once to set up the trigger
 */
function createFormSubmitTrigger() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(sheet)
    .onFormSubmit()
    .create();
  
  Logger.log("Form submit trigger created successfully");
}

/**
 * Manually validate all existing entries
 * Run this function manually if you need to validate all entries in the sheet
 */
function validateAllEntries() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  // Setup headers
  setupHeaders(sheet);
  
  // Start from row 2 (skip headers)
  for (let row = 2; row <= lastRow; row++) {
    // Create a fake event object
    const e = { range: sheet.getRange(row, 1, 1, sheet.getLastColumn()) };
    
    // Process the row
    onFormSubmit(e);
  }
  
  Logger.log("All entries validated");
}
