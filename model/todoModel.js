const pool = require('../config/dbConnect')
const { logger } = require('../logger/logger')

class Todo {
    static async all(userId, limit, offset) {
        try {
            const data = await pool.query('SELECT * FROM todo_list WHERE user_id=$1 ORDER BY id ASC LIMIT $2 OFFSET $3 ;', [userId, limit, offset])
            return data.rows
        } catch (error) {
            throw new Error(`Error querying data from the database, ${error}`)
        }
    }

    static async getCount(userId) {
        const count = await pool.query('SELECT COUNT(*) AS TOTAL FROM todo_list WHERE user_id=$1;', [userId])
        return count.rows[0].total
    }

    static async createTodo(title, description, userId) {
        try {
            const result = await pool.query('INSERT INTO todo_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;', [title, description, userId]);
            return result.rows;
        } catch (error) {
            logger.error(`Error inserting data; ${error.message}`);
            throw new Error(error.message)
        }
    }

    static async updateTodo( title, description, todoId, userId) {
        try {
            const result = await pool.query('UPDATE todo_list SET title=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING *;', [title, description, todoId, userId])
            if (result.rows.length === 0) {
                return null; // If no rows are updated, return null
            }
            return result.rows
        } catch (error) {
            logger.error(error);
            throw new Error(`Error Updating database, ${error.message}`)
        }
    }
}

module.exports = Todo;
