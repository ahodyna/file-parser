const express = require('express')
const { Pool } = require('pg');
const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const pool = new Pool({
    user: 'employee_app',
    host: 'localhost',
    database: 'employee_app',
    password: 'employee_app_password',
    port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Connected to PostgreSQL at', res.rows[0].now);
    }
});
