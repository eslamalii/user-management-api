# User Management API

A Node.js/Express API built with TypeScript featuring MySQL integration, request logging with Winston, and Docker support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [License](#license)

## Features

- REST API built with Express.js and TypeScript
- MySQL database integration
- Request logging middleware using Winston
- Docker containerization and Docker Compose support
- Environment configuration system
- Unit Test

## Installation

### Prerequisites

- Node.js
- Docker
- npm

### Clone & Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:eslamalii/user-management-api.git
   cd user-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

## Project Structure

```
src/
├── app.ts
├── config
│   ├── db.ts
│   ├── logger.ts
├── controllers
│   ├── authController.ts
│   ├── passwordResetController.ts
├── errors
│   ├── CustomErrors.ts
├── interfaces
│   ├── IAdminStatsRepository.ts
│   ├── IUserRepository.ts
├── models
│   ├── User.ts
├── repositories
│   ├── adminStatsRepository.ts
│   ├── userRepository.ts
├── services
│   ├── adminService.ts
│   ├── authService.ts
│   ├── passwordResetService.ts
├── tests/
    ├── config/
    │   └── db.test.ts      # Database connection tests
    ├── controllers/
    │   ├── adminController.test.ts
    │   ├── authController.test.ts
    │   └── passwordResetController.test.ts
    ├── dtos/
    │   └── dto.test.ts
    ├── errors/
    │   └── CustomErrors.test.ts
    ├── middlewares/
    │   └── validationMiddleware.test.ts
    ├── repositories/
    │   ├── adminRepository.test.ts
    │   └── userRepository.test.ts
    └── services/
        ├── adminService.test.ts
        ├── authService.test.ts
        ├── passwordResetService.test.ts
        └── userService.test.ts
```

## SQL Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastLogin TIMESTAMP NULL,
  loginCount INT DEFAULT 0,
  isAdmin BOOLEAN DEFAULT FALSE
);
```

## Running the Project

1. Start the MySQL server using Docker Compose:

   ```bash
   docker compose up -d
   ```

2. Start the server:

   ```bash
   npm run dev
   ```

3. Run the tests:

   ```bash
   npm run test
   ```

## Testing

- Unit tests are located in `src/tests/`.
- Use Jest for running tests.


