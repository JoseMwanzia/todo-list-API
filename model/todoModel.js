const pool = require('../config/dbConnect')

class Todo {
    static async all(userId, limit, offset) {
        try {
            const data = await pool.query('SELECT * FROM todo_list WHERE user_id=$1 LIMIT $2 OFFSET $3 ;', [userId, limit, offset])
            return data.rows
        } catch (error) {
            throw new Error(`Error querying data from the database, ${error}`)
        }
    }

    static async getCount() {
        const count = await pool.query('SELECT COUNT(*) AS TOTAL FROM todo_list;')
        return count.rows[0].total
    }

    static async createTodo(title, description, userId) {
        try {
            const result = await pool.query('INSERT INTO todo_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;', [title, description, userId]);
            return result.rows;
        } catch (error) {
            console.error(`Error inserting data; ${error.message}`);
            throw new Error(error.message)
        }
    }
}

module.exports = Todo;
