mariadb (opensource fork of mysql)
three tables - Users, Classes, AttendanceRecords

Users -
    UserID, Username, PasswordHash, Email, Role(student, teacher,admin), FirstName, LastName, DateOfBirth, CreatedAt, UpdatedAt

Classes -
    ClassID, ClassName, TeacherID, StartTime, EndTime, DaysOfWeek

AttendanceRecords -
    AttendanceID, UserID, ClassID, Date, Status, CreatedAt, UserID, ClassID

