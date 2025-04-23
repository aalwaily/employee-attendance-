# Employee Attendance System - File List

This document provides an overview of all files included in the Employee Attendance System package.

## Core Files

| File | Description |
|------|-------------|
| `index.html` | The main HTML wrapper that captures GPS coordinates and embeds the Google Form. This is the file employees will access to check in. |
| `AttendanceValidation.gs` | Google Apps Script code that validates GPS coordinates and marks attendance in the Google Sheet. |
| `README.md` | Comprehensive documentation with setup instructions and usage guidelines. |

## Utility Files

| File | Description |
|------|-------------|
| `admin_location_setter.html` | An interactive tool for administrators to determine and set the exact GPS coordinates for the work site location. |
| `admin_location.bat` | Windows batch file to quickly open the Admin Location Setter in your default browser. |
| `admin_location.sh` | Shell script for macOS/Linux to quickly open the Admin Location Setter in your default browser. |
| `gps_test.html` | A standalone page to test GPS functionality on your device before deploying the full system. |
| `sample_form_config.json` | A sample configuration showing the recommended structure for your Google Form. |
| `test_gps.bat` | Windows batch file to quickly open the GPS test page in your default browser. |
| `test_gps.sh` | Shell script for macOS/Linux to quickly open the GPS test page in your default browser. |
| `create_zip.bat` | Windows batch file to create a ZIP archive of all files for easy distribution. |
| `create_zip.sh` | Shell script for macOS/Linux to create a ZIP archive of all files for easy distribution. |
| `FILE_LIST.md` | This file, providing an overview of all included files. |

## Setup Process

1. Test GPS functionality using `gps_test.html` (or run `test_gps.bat`/`test_gps.sh`)
2. Use `admin_location_setter.html` to determine the exact GPS coordinates for your work site
3. Create a Google Form following the structure in `sample_form_config.json`
4. Link the form to a Google Sheet
5. Add the `AttendanceValidation.gs` script to the Google Sheet and update it with your site coordinates
6. Update the form URL and entry ID in `index.html`
7. Deploy the `index.html` file to a web server or hosting service
8. Share the URL with employees

For detailed instructions, please refer to the `README.md` file.
