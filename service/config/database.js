const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '45.56.87.77',
    user: 'todo-list',
    password: 'IqGxXhHEWr5sM9UApL',
    database: 'todolist'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
});

module.exports = db; 