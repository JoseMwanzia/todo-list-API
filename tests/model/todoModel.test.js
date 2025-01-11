const { Pool } = require('pg');
const Todo = require('../../model/todoModel');

// Mock the pg Pool
jest.mock('pg', () => {
    const mPool = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

describe('Todo Model', () => {
    let pool;

    beforeEach(() => {
        // clear all mock before running tests
        jest.clearAllMocks();
        // initialize the pg pool
        pool = new Pool();
        // Inject the mocked pool into the Todo model
        Todo.pool = pool;
    });

    describe('all()', () => {
        it('should fetch todos with pagination successfully', async () => {
            const mockTodos = [
                { id: 1, title: 'Todo 1', description: 'description 1', user_id: 1 },
                { id: 2, title: 'Todo 2', description: 'description 2', user_id: 1 }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockTodos });

            const userId = 1;
            const limit = 10;
            const offset = 0;

            const result = await Todo.all(userId, limit, offset);

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM todo_list WHERE user_id=$1 LIMIT $2 OFFSET $3 ;',
                [userId, limit, offset]
            );
            expect(result).toEqual(mockTodos);
        });

        it('should handle database errors in all()', async () => {
            const error = new Error('Database error');
            pool.query.mockRejectedValueOnce(error);

            await expect(Todo.all(1, 10, 0)).rejects.toThrow('Database error');
        });
    });

});
