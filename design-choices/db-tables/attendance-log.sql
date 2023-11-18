create table AttendanceLog (
		AttendanceID int auto_increment primary key,
		UserID int,
		ClassID int,
		Date timestamp default current_timestamp,
		Status enum('present', 'absent'),
		CreatedAt timestamp default current_timestamp,
		SkipReason varchar(255),
		foreign key(UserID) references Users(UserID),
		foreign key(ClassID) references Classes(ClassID)
);
