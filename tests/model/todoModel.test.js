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

    afterAll(() => {
        // clear all mock after running tests
        jest.clearAllMocks();
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

    describe('getCount()', () => {
        it('should get total count of todos for a user', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ total: 5 }] });
    
            const userId = 1;
            const count = await Todo.getCount(userId);
    
            expect(pool.query).toHaveBeenCalledWith(
            'SELECT COUNT(*) AS TOTAL FROM todo_list WHERE user_id=$1;',
            [userId]
            );
            expect(count).toBe(5);
        });
    });

    describe('createTodo()', () => {
        let originalConsoleError;

        beforeAll(() => {
            // save the original console.error
            originalConsoleError = console.error;

            // Mock the 'console.error' to surpress it durng tests
            console.error = jest.fn();
        })

        afterAll(() => {
            // Restore the original console.error after all tests
            console.error = originalConsoleError;
        })

        it('should create a new todo successfully', async () => {

            const mockResult = { rows: [
                {
                    title: 'New Todo',
                    description: 'My description',
                    user_id: 1,
                }
            ]};
    
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await Todo.createTodo(mockResult.rows[0].title, mockResult.rows[0].description, mockResult.rows[0].user_id);
    
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO todo_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;',
                [mockResult.rows[0].title, mockResult.rows[0].description, mockResult.rows[0].user_id]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should handle database errors in createTodo()', async () => {
              const error = new Error('Database error');
              pool.query.mockRejectedValueOnce(error);
        
              const todoData = {
                title: 'New Todo',
                user_id: 1
              };
        
              await expect(Todo.createTodo(todoData)).rejects.toThrow('Database error');
        });
    });

    describe('updateTodo()', () => {
        it('should update a todo successfully', async () => {
            const mockUpdatedTodo = {
                id: 1,
                title: 'Updated Todo',
                description: 'description',
                user_id: 1
            };
    
            pool.query.mockResolvedValueOnce({ rows: [mockUpdatedTodo] });
    
            const todoId = 1;
    
            const result = await Todo.updateTodo(mockUpdatedTodo.title, mockUpdatedTodo.description, todoId, mockUpdatedTodo.user_id);
    
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE todo_list SET title=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING *;',
                [mockUpdatedTodo.title, mockUpdatedTodo.description, todoId, mockUpdatedTodo.user_id]
            );
            expect(result).toEqual([mockUpdatedTodo]);
        });
    
        it('should return null when todo not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });
            const mockUpdatedTodo = {
                id: 1,
                title: 'Updated Todo',
                description: 'description',
                user_id: 1
            };
            const todoId = null;
            const result = await Todo.updateTodo(mockUpdatedTodo.title, mockUpdatedTodo.description, todoId, mockUpdatedTodo.user_id);
    
            expect(result).toBeNull();
        });
    
        it('should handle database errors in updateTodo()', async () => {
            const error = new Error('Database error');
            pool.query.mockRejectedValueOnce(error);
            const mockUpdatedTodo = {
                id: 1,
                title: 'Updated Todo',
                description: 'description',
                user_id: 1
            };
    
            const todoId = 1;
            await expect(Todo.updateTodo(mockUpdatedTodo.title, mockUpdatedTodo.description, todoId, mockUpdatedTodo.user_id))
            .rejects.toThrow('Database error');
        });
    });
});

