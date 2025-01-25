const pool = require('./dbConnect')

if (process.argv[2] == "users") {
    createUsersTable()
} else if (process.argv[2] == "todos") {
    createTodosTable()
}

async function createUsersTable() {
    const query = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );`

    try {
        await pool.query(query)
        console.log('Users table Created ✅ ✅ ✅');
    } catch (error) {
        console.error("Error creating users table: " + error)
    }
}

async function createTodosTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS todo_list (
        id SERIAL PRIMARY KEY NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) , 
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON todo_list
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at();`

    try {
        await pool.query(query)
        console.log('Todo_list table created ✅ ✅ ✅');
    } catch (error) {
        console.error('Error creating todo_list table: ' + error)
    }
}
