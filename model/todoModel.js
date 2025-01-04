const pool = require('../config/dbConnect')

class Todo {
    static async all() {
        try {
            const data = await pool.query('SELECT * FROM students;')
            return data.rows
        } catch (error) {
            throw new Error("Error querying data from the database", error.message)
        }
    }
}

module.exports = Todo;
