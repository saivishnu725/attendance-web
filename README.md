# attendance-web

A website that will store the attendance information of my day to day college, and will display the percentage.

## Plan

- [ ] Take the week timetable.
- [ ] Take list of all the subjects.
- [x] Options to select the attendance information every day.
- [x] Show the percentage of individual subjects.
- [ ] Add classes outside the day's schedule.
- [x] Make it work for multiple users _(single user for easy development)_
- [x] Use some SQL database _(because it looks like this is a lot of data to be stored for months)_.
- [ ] Might use AWS // VPS for database and hosting.
- [ ] Dark mode
- [ ] Ability to delete attendance entries

## Pre-requisites

1. [NodeJS](https://nodejs.org/en)
2. [NPM](https://npmjs.com)
3. [Web Browser](https://www.mozilla.org/en-US/firefox/new/)

## How to run it locally

1. Install mariadb and make sure that a '`attendanceweb`' database is created with the appropriate tables. The SQL command to create the tables are located in the `./design-choices/db-tables` directory.

   Tables:

   - Users
   - Classes
   - AttendanceLog
   - Attendance (view)

2. Save your db configuration settings in the `.env` file (the requirements are also available in the `.env-vars` file).

   Requirements:

   - DB_USER
   - DB_PASSWORD
   - DB_HOST
   - DB_NAME
   - SESSION_SECRET
   - DEVELOPMENT

3. Install node dependencies

   ```bash
   npm install
   ```

4. a. Use nodemon to run the server

   ```bash
   nodemon
   ```

   b. Run the server manually

   ```bash
   node index.js
   ```

5. Site is live at `localhost:3000`. Open it in your preferred browser.

## Collaborators

Due to the very limited time and too high requirement, it is highly suggested to help me fulfill this challenge/dream task.

## License

[GNU General Public License v2.0](https://choosealicense.com/licenses/gpl-2.0/)
