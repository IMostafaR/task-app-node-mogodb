# Task App with Express.js, Mongoose, and MongoDB

# Table of Contents

1. [Introduction](#introduction)
2. [File Structure](#file-structure)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
4. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Task Endpoints](#task-endpoints)
5. [Middleware](#middleware)
6. [Utilities](#utilities)
7. [Author](#author)

# Introduction

This is my work assigned by [Route-Academy](https://www.linkedin.com/company/routeacademy/mycompany/) during learning backend web development.

This is a Node.js application built with Express.js, Mongoose, and MongoDB, following the MVC (Model-View-Controller) design pattern. The application allows users to sign up, log in, manage tasks, and perform various operations on them.

---

# File Structure

The project is structured as follows:

- `index.js`: The main entry point of the application.
- `.env`: Configuration file to store environment variables.
- `database/`: Directory containing database-related files.
  - `models/`: Directory containing Mongoose models for the application.
    - `blackList.model.js`: Mongoose model for blacklisted tokens.
    - `task.model.js`: Mongoose model for tasks.
    - `user.model.js`: Mongoose model for users.
  - `connection.js`: File for establishing the connection to the MongoDB database.
- `src/`: Directory containing the source code of the application.
  - `middleware/`: Directory containing custom middleware functions.
    - `auth.js`: Middleware for user authentication using JWT tokens.
    - `checkAssignTo.js`: Middleware to check if the assigned user exists when adding a task.
  - `modules/`: Directory containing modules for different functionalities.
    - `user/`: Directory for user-related functionalities.
      - `user.controller.js`: Controller for handling user-related operations.
      - `user.routes.js`: Express routes for user endpoints.
    - `task/`: Directory for task-related functionalities.
      - `task.controller.js`: Controller for handling task-related operations.
      - `task.routes.js`: Express routes for task endpoints.
  - `utils/`: Directory containing utility functions.
    - `authToken.js`: Utility function to generate JWT tokens for user authentication.
    - `password.js`: Utility functions for hashing and comparing passwords.
    - `pushTasks.js`: Utility functions for updating task lists of users.
  - `router.js`: File containing the main Express router and connecting all the routes.

---

# Getting Started

## Prerequisites

Before you proceed, make sure you have the following installed on your machine:

- Node.js and npm
- MongoDB

## Installation

Follow these steps to get the project up and running:

Install dependencies:

```shell
npm install
```

To run the server:

```shell
node index.js
```

The server will start running on `http://localhost:3000`.

---

# API Endpoints

## User Endpoints

1. **Sign Up**

- URL: `/api/v1/user/signup`
- Method: `POST`

- Request Body (JSON):

```json
{
  "firstName": "user FirstName",
  "lastName": "user LastName",
  "email": "user@user.co",
  "password": "123",
  "age": 30,
  "gender": "male",
  "phone": "01xxxxxxxxx"
}
```

2. **Log In**

- URL: `/api/v1/user/login`
- Method: `POST`

- Request Body (JSON):

```json
{
  "email": "user@user.co",
  "password": "123"
}
```

3. **Change Password** (User must be logged in)

- URL: `/api/v1/user/ch-password`
- Method: `PUT`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

- Request Body (JSON):

```json
{
  "oldPassword": "123",
  "newPassword": "new_password"
}
```

4. **Update User** (Age, FirstName, LastName) (User must be logged in)

- URL: `/api/v1/user/update`
- Method: `PUT`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

- Request Body (JSON):

```json
{
  "firstName": "New FirstName",
  "lastName": "New LastName",
  "age": 30
}
```

5. **Delete User** (User must be logged in)

- URL: `/api/v1/user/delete`
- Method: `DELETE`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

6. **Soft User** (User must be logged in)

- URL: `/api/v1/user/deactivate`
- Method: `PUT`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

7. **Logout** (User must be logged in)

- URL: `/api/v1/user/logout`
- Method: `POST`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

## Task Endpoints

1. **Add Task** (User must be logged in)

- URL: `/api/v1/task/add`
- Method: `POST`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

- Request Body (JSON):

```json
{
  "assignTo": "64c901b5a2430ee175b9236f",
  "title": "Task 1",
  "description": "This is a test",
  "deadlineInDays": 2
}
```

2. **Update Task** (User must be logged in) (task creator only)

- URL: `/api/v1/task/update`
- Method: `PUT`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

- Request Body (JSON):

```json
{
  "taskId": "64c90e9425831d8e9ecd247d",
  "title": "Task update",
  "description": "New updates...",
  "status": "doing"
}
```

3. **Delete Task** (User must be logged in) (task creator only)

- URL: `/api/v1/task/delete`
- Method: `DELETE`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

- Request Body (JSON):

```json
{
  "taskId": "64c90e9a25831d8e9ecd2485"
}
```

4. **Get All Tasks**

- URL: `/api/v1/task/all-tasks`
- Method: `GET`

5. **Get Tasks of One User** (User must be logged in) (task creator only)

- URL: `/api/v1/task/user-tasks`
- Method: `GET`

- Request Headers:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwMTgyYTI0MzBlZTE3NWI5MjM2MyIsIm5hbWUiOiJ1c2VyRmlyc3ROYW1lIHVzZXJMYXN0TmFtZSIsImlhdCI6MTY5MDkxMTczNn0.JFIUNmo_m-TxW3H0Hv9j9IKrKPKFN1Fhno3xxlqdhbw"
}
```

6. **Get Tasks Not Done After Deadline**

- URL: `/api/v1/task/deadline`
- Method: `GET`

---

# Middleware

## Authentication Middleware

**File: auth.js**

**Description:** Verifies the validity of a JWT token passed in the request headers. It checks if the token is blacklisted or invalid and adds the decoded user ID to the request for authenticated routes.

## Check AssignTo Middleware

**File: checkAssignTo.js**

**Description:** Validates if the provided `assignTo` user ID exists in the database when creating or updating a task.

---

# Utilities

## Authentication Token Utility

**File: authToken.js**

**Description:** Provides function to generate JWT tokens using the `jsonwebtoken` library. JWT tokens are used for user authentication and authorization in the application. The utility includes the following function:

- `generateAuthToken(payload)`: This function takes a `payload` as input, which typically includes the user ID and any additional data to be stored in the token. It generates a new JWT token with the provided payload and returns the token as a string.

## Password Hashing Utility

**File: password.js**

**Description:** Provides functions to hash and verify user passwords using the `bcryptjs` library. Hashing passwords is essential for securely storing user credentials in the database. The utility includes the following functions:

- `hashPassword(plainPassword)`: This function takes a `plainPassword` as input and generates a salted hash of the password using bcrypt. The resulting hash can be safely stored in the database.

- `comparePasswords(plainPassword, hashedPassword)`: This function takes a `plainPassword` and a `hashedPassword` as inputs. It compares the `plainPassword` with the `hashedPassword` by performing a hash operation on the `plainPassword` and checking if it matches the `hashedPassword`. It returns `true` if the passwords match, indicating a successful verification.

## Push and Update Tasks Utility

**File: pushTasks.js**

**Description:**

**pushTaskOwner(taskId, createdBy)**

Pushes a new task to the `createdTasks` array of the owner.

- `taskId`: ID of the new task to add.
- `createdBy`: ID of the user who created the task.

**pushTaskAssigned(taskId, assignTo)**

Pushes a new task to the `assignedTasks` array of the assigned user.

- `taskId`: ID of the new task to add.
- `assignTo`: ID of the user to whom the task is assigned.

**updateOwnerTasksList(loggedInUser)**

Updates the `createdTasks` list of the owner after task updates or deletions.

- `loggedInUser`: ID of the owner user whose `createdTasks` list needs to be updated.

**updateAssignedTasksList(assignedTo)**

Updates the `assignedTasks` list of the assigned user after task updates or deletions.

- `assignedTo`: ID of the user whose `assignedTasks` list needs to be updated.

---

## Author

- GitHub - [IMostafaR](https://github.com/IMostafaR)
- Linkedin - [@imostafarh](https://www.linkedin.com/in/imostafarh/)
