create table Classes (
    ClassID INT AUTO_INCREMENT PRIMARY KEY,
    ClassName VARCHAR(100) NOT NULL,
    UserID INT,
    TotalClassesAttended INT DEFAULT 0,
    TotalClassesTaken INT DEFAULT 0,
    StartDate DATE,
    Percentage DECIMAL(5,2) GENERATED ALWAYS AS (TotalClassesAttended / TotalClassesTaken * 100) STORED,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
