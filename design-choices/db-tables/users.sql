Create table Users( UserID int primary key auto_increment, Username varchar(255) unqiue not null, PasswordHash varchar(255) not null, Email varchar(255) unique not null, FirstName varchar(100), LastName varchar(100), CreatedAt Timestamp default current_timestamp, UpdatedAt timestamp default current_timestamp on update Current_timestamp