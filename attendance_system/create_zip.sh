#!/bin/bash
echo "Creating ZIP archive of the Employee Attendance System..."
cd "$(dirname "$0")"
zip -r ../employee_attendance_system.zip *
echo "ZIP archive created successfully: employee_attendance_system.zip"
echo "The archive is located in the parent directory."
read -p "Press Enter to continue..."
