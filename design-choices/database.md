mariadb (opensource fork of mysql)

three tables - Users, Classes, AttendanceRecords

Users -

<pre> UserID, Username, PasswordHash, Email, Role(student, teacher, admin), FirstName, LastName, DateOfBirth, CreatedAt, UpdatedAt </pre>

Classes -

<pre> ClassID, ClassName, TeacherID, StartTime, EndTime, DaysOfWeek </pre>

AttendanceRecords -

<pre> AttendanceID, UserID, ClassID, Date, Status, CreatedAt, UserID, ClassID </pre>
