# Project Name: Todo-list

## Description
This project is a modular application designed to efficiently manage authentication, to-do tasks, and user-related operations. It leverages tools like Redis for managing JWT refresh tokens and Winston for logging, ensuring high performance and scalability. The API endpoint is designed to be used by a frontend application to interact with the todo list data. [_](https://roadmap.sh/projects/todo-list-api)

## Features
- **Authentication**: Secure user authentication using Redis for JWT refresh tokens.
- **To-Do Management**: CRUD operations for managing to-do tasks.
- **User Management**: User registartion and login with crypted passwords.
- **Logging**: Integrated Winston logger for HTTP-level logging.

## Directory Structure
```
\ config
\ controller
  - authServer.js
  - todoController.js
  - usersController.js
\ helpers
  - helpers.js
  - logger.js
\ middlewares
  - auth.js
  - validationMiddleware.js
\ model
  - todoModel.js
  - usersModel.js
\ routes
  - routes.js
\ tests
\ validations
  - todoValidation.js
  - userValidation.js
\ node_modules
```

### Key Modules
1. **Config**: Configuration files for database and Redis connections.
2. **Controller**: Contains the logic for authentication, to-dos, and user operations.
3. **Helpers**: Utility functions and logging configurations.
4. **Middlewares**: Middleware for authentication and input validation.
5. **Model**: Database models for users and to-do tasks.
6. **Routes**: API routes for the application.
7. **Validations**: Input validation logic for to-dos and users.

## Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```bash
   cd [project-name]
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Add a `.env` file with the following keys:
     ```env
      DB_HOST=localhost
      DB_USER=<your-db-username>
      DB_PASSWORD=<your-password>
      DB_DATABASE=<your-db-name>
      PORT=<your-port-number> || 3000
      ACCESS_TOKEN_SECRET=<your-access-token> - generated from bcrypt
      REFRESH_TOKEN_SECRET=<<your-refresh-token> - generated from bcrypt>
      ACCESS_TOKEN_EXPIRES=7m
      REFRESH_TOKEN_EXPIRES=1d
      REDIS_URL=<your-remote/local-redis -url>
      LOGTAIL_TOKEN=<coppied-from-logtail-cloud> - create an account with betterstack

     ```
See [betterstack ](https://betterstack.com/telemetry) for more details.
## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. Access the API via `http://localhost:[PORT]`.

## Tech Stack
- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **Redis**: JWT refresh token management.
- **PostgreSQL**: Database for storing users and to-dos.
- **Winston**: Logging.

## API Endpoints
- `POST /login`: User login. 
`` 
NOTE: Once you login take the access token returned and send it in your 'GET /todos' request method headers this formatt (the token expire after 7 minutes as set in the .env file) ``

``
headers: {
'Content-Type': 'application/json','authorization': `Bearer ${token} },
``
- `POST /refresh`: Refresh JWT token. This is used to automatically refresh the accessTokens once they expire.

### To-Do Management
- `GET /todos`: Fetch all to-dos.
- `POST /todos`: Create a new to-do.
- `PUT /todos/:id`: Update a to-do.
- `DELETE /todos/:id`: Delete a to-do.

## Tests
Run tests using:
```bash
npm test
```

## Future Enhancements
- Implement role-based access control (RBAC).
- Add support for multiple database connections.
- Enhance logging with structured logs.

[Click here](https://todo-list-api-f7q3.onrender.com/) to view the deployed project.
