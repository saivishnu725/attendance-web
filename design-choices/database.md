# mariadb (opensource fork of mysql)

### three tables - Users, Classes, AttendanceRecords

## Users -

<pre> UserID, Username, PasswordHash, Email, FirstName, LastName, CreatedAt, UpdatedAt </pre>

## Classes -

<pre> ClassID, ClassName, UserID, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage(auto calculated) </pre>

## AttendanceRecords -

<pre> AttendanceID, UserID, ClassID, Date, Status, CreatedAt, SkipReason, totalClassAttended,totalClassTaken, Percentage </pre>
