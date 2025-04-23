# Employee Attendance System

A GPS-based attendance system that validates employee check-ins based on their physical location.

## Overview

This system uses Google Forms, Google Sheets, and Google Apps Script to create a complete attendance tracking solution. The system:

1. Collects employee check-ins through a Google Form
2. Automatically captures the employee's GPS location
3. Validates if the employee is physically present at the designated work site
4. Records attendance status in a Google Sheet
5. Optionally sends notifications for invalid check-ins
6. Prevents duplicate check-ins on the same day

## System Components

- **HTML Wrapper**: A web page that captures the user's GPS coordinates and embeds the Google Form
- **Google Form**: Collects employee information and GPS coordinates
- **Google Sheet**: Stores all check-in data
- **Apps Script**: Validates the location and processes the attendance data

## Setup Instructions

### Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form
2. Add the following fields:
   - **Name** (Short answer): For the employee's name
   - **Email** (Email): To identify the employee (this can be pre-filled if using Google accounts)
   - **GPS Coordinates** (Short answer): This will be auto-filled by the HTML wrapper
3. Make the GPS Coordinates field required
4. (Optional) Add any additional fields you need for your organization
5. Click on "Settings" (gear icon) and:
   - Under "Responses" tab, ensure "Collect email addresses" is checked if you want to track by email
   - Under "Presentation" tab, you can customize the confirmation message
6. Save your form

### Step 2: Link the Form to a Google Sheet

1. In your Google Form, click on the "Responses" tab
2. Click on the Google Sheets icon (green rectangle)
3. Select "Create a new spreadsheet" or link to an existing one
4. Click "Create" or "Select"
5. The Google Sheet will open in a new tab

### Step 3: Add the Apps Script to the Google Sheet

1. In your Google Sheet, click on "Extensions" > "Apps Script"
2. Delete any code in the script editor
3. Copy and paste the entire content of the `AttendanceValidation.gs` file into the script editor
4. Update the column indices if necessary:
   ```javascript
   const TIMESTAMP_COL = 0;       // Column A (timestamp from form submission)
   const NAME_COL = 1;            // Column B (name field)
   const EMAIL_COL = 2;           // Column C (email field)
   const GPS_COORDINATES_COL = 3; // Column D (GPS coordinates field)
   const VALIDATION_RESULT_COL = 4; // Column E (will be created by the script)
   const DISTANCE_COL = 5;        // Column F (will be created by the script)
   ```
5. Update the site coordinates if needed:
   ```javascript
   const SITE_LATITUDE = 26.4334;
   const SITE_LONGITUDE = 50.1033;
   ```
6. Update the maximum allowed distance if needed:
   ```javascript
   const MAX_DISTANCE = 100; // in meters
   ```
7. Click "Save" (disk icon)
8. Run the `createFormSubmitTrigger` function:
   - Select "createFormSubmitTrigger" from the function dropdown (next to "Debug" and "Run")
   - Click "Run"
   - Grant the necessary permissions when prompted
9. The script is now set up to automatically validate new form submissions

### Step 4: Get the Form URL and Field ID

1. Go back to your Google Form
2. Click the "Send" button
3. Click the link icon to get the form URL
4. Copy this URL - you'll need it for the HTML wrapper
5. To get the field ID for the GPS coordinates:
   - Click on the GPS Coordinates field in your form
   - Right-click and select "Inspect" or "Inspect Element" (you may need to use keyboard shortcut Ctrl+Shift+I or Cmd+Option+I)
   - Look for an attribute like `name="entry.XXXXXXXXXX"` where XXXXXXXXXX is a number
   - Copy this number - this is your entry ID for the GPS field

### Step 5: Update the HTML Wrapper

1. Open the `index.html` file in a text editor
2. Find these lines:
   ```javascript
   // Google Form URL - REPLACE THIS WITH YOUR ACTUAL GOOGLE FORM URL
   const googleFormBaseUrl = "GOOGLE_FORM_URL_HERE";
   
   // GPS coordinates entry ID - REPLACE THIS WITH YOUR ACTUAL FORM FIELD ID
   const gpsEntryId = "ENTRY_ID_HERE";
   ```
3. Replace `"GOOGLE_FORM_URL_HERE"` with your Google Form URL
4. Replace `"ENTRY_ID_HERE"` with `"entry.XXXXXXXXXX"` (where XXXXXXXXXX is the entry ID you found in Step 4)

### Step 6: Deploy the HTML Wrapper

You have several options for deploying the HTML wrapper:

#### Option 1: Host on GitHub Pages (Free)

1. Create a GitHub repository
2. Upload the `index.html` file
3. Go to repository Settings > Pages
4. Enable GitHub Pages and select the main branch
5. Your site will be available at `https://yourusername.github.io/repositoryname/`

#### Option 2: Host on Google Drive (Simple)

1. Upload the `index.html` file to Google Drive
2. Right-click the file and select "Share" > "Anyone with the link"
3. Share this link with your employees

#### Option 3: Host on your own web server

1. Upload the `index.html` file to your web server
2. Share the URL with your employees

## Using the System

1. Employees visit the HTML wrapper URL on their mobile device
2. They click "Get My Location" and allow location access
3. Once their location is detected, the Google Form appears pre-filled with their GPS coordinates
4. They complete the rest of the form and submit
5. The Apps Script automatically validates their location and records the result in the Google Sheet

## Troubleshooting

### Location Not Working

- Ensure the device has GPS enabled
- Make sure the browser has permission to access location
- Try using Chrome or Safari on mobile devices
- Check that the HTML wrapper is being served over HTTPS (required for geolocation API)

### Form Not Submitting

- Verify that all required fields are filled
- Check that the GPS coordinates are being properly passed to the form
- Ensure the entry ID in the HTML file matches the actual form field ID

### Validation Not Working

- Check the Apps Script logs for errors: In the Apps Script editor, click "View" > "Logs"
- Verify that the trigger is set up correctly
- Make sure the column indices in the script match your actual form fields

## Customization

### Setting the Site Location

The system includes an Admin Location Setter tool to help you determine and set the exact GPS coordinates for your work site.

#### Using the Admin Location Setter

1. Open the `admin_location_setter.html` file in your browser (or run `admin_location.bat`/`admin_location.sh`)
   - Note: The tool uses Google Maps without an API key for development purposes. For production use, you should [get a Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) and update the script tag in the HTML file.
2. Choose one of the three methods to set your site location:
   - **Interactive Map**: Search for your location, drag the marker to the exact position, or click anywhere on the map
   - **Manual Entry**: Enter the coordinates directly if you already know them
   - **Current Location**: Use your current location (useful if you're physically at the work site)
3. Once you've set the location, you'll see the exact coordinates and instructions for updating the script
4. You can test the location immediately by clicking the "Test This Location" button

#### Manually Changing the Site Location

If you prefer to update the coordinates directly:

1. Open the Apps Script editor
2. Update the site coordinates:
   ```javascript
   const SITE_LATITUDE = YOUR_NEW_LATITUDE;
   const SITE_LONGITUDE = YOUR_NEW_LONGITUDE;
   ```
3. Save the script

### Adjusting the Allowed Distance

1. Open the Apps Script editor
2. Update the maximum distance:
   ```javascript
   const MAX_DISTANCE = YOUR_NEW_DISTANCE; // in meters
   ```
3. Save the script

### Adding Multiple Site Locations

To support multiple work sites, you would need to modify the Apps Script:

1. Define an array of site locations:
   ```javascript
   const SITE_LOCATIONS = [
     { name: "Main Office", latitude: 26.4334, longitude: 50.1033 },
     { name: "Branch Office", latitude: 26.5000, longitude: 50.2000 },
     // Add more locations as needed
   ];
   ```

2. Modify the validation logic to check against all locations and use the closest one

## Security Considerations

- The system relies on the device's reported GPS location, which could potentially be spoofed
- For higher security, consider implementing additional verification methods
- All data is stored in Google's servers according to their privacy policy

## License

This project is provided as-is with no warranties. You are free to modify and use it for your organization.

