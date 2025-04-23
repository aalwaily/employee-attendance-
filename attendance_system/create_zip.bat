@echo off
echo Creating ZIP archive of the Employee Attendance System...
powershell -Command "Compress-Archive -Path .\* -DestinationPath ..\employee_attendance_system.zip -Force"
echo ZIP archive created successfully: employee_attendance_system.zip
echo The archive is located in the parent directory.
pause
