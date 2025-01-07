const pool = require('../config/dbConnect');

class User {
    static async register(data) {
        try {
            const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;'
            const values = [data.name, data.email, data.password]
            const result = await pool.query(query, values)
            return result.rows[0]
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUserByEmail(email) {
        try {
            const result = await pool.query(`SELECT * FROM users WHERE email=$1;`, [email]);
            return result.rows.length === 0 ? 404 : result.rows[0]
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = User;
