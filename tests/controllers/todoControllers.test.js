const { fetchData } = require('../../controller/todoController');
const Todo = require('../../model/todoModel');
const { logger } = require('../../logger/logger')

// Mock Todo model methods
jest.mock('../../model/todoModel');
jest.mock('../../logger/logger')


describe('fetchData', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // jest.spyOn(console, 'error').mockImplementation(() => { });
    // jest.spyOn(console, 'log').mockImplementation(() => { });

    mockReq = {
      query: {}, // To simulate query params
      user: { id: 'testUserId' }, // Simulate authenticated user
    };

    mockRes = {
      status: jest.fn().mockReturnThis(), // Mock res.status to chain calls
      send: jest.fn(), // Mock res.send
      sendStatus: jest.fn(), // Mock res.sendStatus
    };

    jest.clearAllMocks(); // Clear mocks after each test
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return all todos with pagination if no search term is provided', async () => {
    const mockTodos = [
      { title: 'Todo 1', description: 'Description 1' },
      { title: 'Todo 2', description: 'Description 2' },
    ];
    const mockTotalCount = 20;

    // Mock database methods
    Todo.getCount = jest.fn().mockResolvedValue(mockTotalCount);
    Todo.all = jest.fn().mockResolvedValue(mockTodos);

    mockReq.query = { page: '2', limit: '5' }; // Simulate query parameters

    await fetchData(mockReq, mockRes);

    expect(Todo.getCount).toHaveBeenCalledWith('testUserId');
    expect(Todo.all).toHaveBeenCalledWith('testUserId', 5, 5); // page=2, limit=5 => offset=5
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      data: mockTodos,
      page: 2,
      limit: 5,
      total: mockTotalCount,
    });
  });

  it('should return filtered todos when search term is provided', async () => {
    const mockTodos = [
      { title: 'Todo 1', description: 'Search term present' },
      { title: 'Another Todo', description: 'No match' },
    ];
    const mockTotalCount = 10;

    Todo.getCount = jest.fn().mockResolvedValue(mockTotalCount);
    Todo.all = jest.fn().mockResolvedValue(mockTodos);

    mockReq.query = { term: 'Search', page: '1', limit: '10' };

    await fetchData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      filterdTodos: [{ title: 'Todo 1', description: 'Search term present' }],
      page: 1,
      limit: 10,
      total: mockTotalCount,
    });
  });

  it('should return 404 when no todos match the search term', async () => {
    const mockTodos = [
      { title: 'Todo 1', description: 'Description 1' },
      { title: 'Todo 2', description: 'Description 2' },
    ];
    const mockTotalCount = 10;

    Todo.getCount = jest.fn().mockResolvedValue(mockTotalCount);
    Todo.all = jest.fn().mockResolvedValue(mockTodos);

    mockReq.query = { term: 'nonexistent' };

    await fetchData(mockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should handle errors properly', async () => {
    // Arrange
    mockReq.query.page = 1;
    mockReq.query.limit = 10;
    const errorMessage = 'Database error';
    Todo.getCount.mockRejectedValue(new Error(errorMessage));

    // Act
    await fetchData(mockReq, mockRes);

    // Assert
    expect(logger.error).toHaveBeenCalledWith(`Error executing GET request, ${errorMessage}`);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith(`Error executing GET request, ${errorMessage}\n`);
  });

});
