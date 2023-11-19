# mariadb (opensource fork of mysql)

### three tables - Users, Classes, AttendanceLog
### one view - Attendance

## Users (Table) -

<pre> UserID, Username, PasswordHash, Email, FirstName, LastName, CreatedAt, UpdatedAt </pre>

## Classes (Table) -

<pre> ClassID, ClassName, UserID, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage(auto calculated) </pre>

## AttendanceLog (Table) -

<pre> AttendanceID, UserID, ClassID, Date, Status, CreatedAt, SkipReason, totalClassAttended,totalClassTaken, Percentage </pre>

## Attendance (View) -

<pre> al.AttendanceID, u.UserID, CONCAT(u.FirstName, ' ', u.LastName) AS UserName, c.ClassName, al.Date, al.Status, al.CreatedAt, al.SkipReason,
 al.totalClassAttended, al.totalClassTaken, al.Percentage
 FROM AttendanceLog al
 JOIN Users u ON al.UserID = u.UserID
 JOIN Classes c ON al.ClassID = c.ClassID
 ORDER BY al.Date DESC; </pre>
