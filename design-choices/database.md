# Database

- `mariadb` (opensource fork of MySQL)

## tables

- _three_ tables - `Users`, `Classes`, `AttendanceLog`
- _one_ view - `Attendance`

### Users (Table) -

```sql
UserID, Username, PasswordHash, Email, FirstName, LastName, CreatedAt, UpdatedAt
```

### Classes (Table) -

```sql
ClassID, ClassName, UserID, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage(auto calculated)
```

### AttendanceLog (Table) -

```sql
AttendanceID, UserID, ClassID, Date, Status, CreatedAt, SkipReason, totalClassAttended,totalClassTaken, Percentage
```

### Attendance (View) -

```sql
 al.AttendanceID, u.UserID, CONCAT(u.FirstName, ' ', u.LastName) AS UserName, c.ClassName, al.Date, al.Status,
 al.CreatedAt, al.SkipReason, al.totalClassAttended, al.totalClassTaken, al.Percentage
 FROM AttendanceLog al
 JOIN Users u ON al.UserID = u.UserID
 JOIN Classes c ON al.ClassID = c.ClassID
 ORDER BY al.Date DESC
```
