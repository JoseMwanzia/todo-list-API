const pool = require('../config/dbConnect')

class Todo {
    static async all(userId, limit, offset) {
        try {
            const data = await pool.query('SELECT * FROM todo_list WHERE user_id=$1 LIMIT $2 OFFSET $3 ;', [userId, limit, offset])
            return data.rows
        } catch (error) {
            throw new Error("Error querying data from the database", error.message)
        }
    }
}

module.exports = Todo;
