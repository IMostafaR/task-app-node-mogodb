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

### root directory

- `index.js`: The main entry point of the application.

### database directory

Directory containing database-related files.

- `models/`: Directory containing Mongoose models for the application.
  - `blackList.model.js`: Mongoose model for blacklisted tokens.
  - `task.model.js`: Mongoose model for tasks.
  - `user.model.js`: Mongoose model for users.
- `connection.js`: File for establishing the connection to the MongoDB database.

### src directory

Directory containing the source code of the application.

- `middleware/`: Directory containing custom middleware functions.
  - `auth/`: Directory for authentication-related middleware.
    - `auth.js`: Middleware for user authentication using JWT tokens.
  - `error/`: Directory for error handling middleware.
    - `globalErrorHandler.js`: Middleware for handling global errors.
  - `validation/`: Directory for validation-related middleware.
    - `validation.js`: Middleware for validating request data using `Joi`.
  - `checkAssignTo.js`: Middleware to check if the assigned user exists when adding a task.
- `modules/`: Directory containing modules for different functionalities.
  - `user/`: Directory for user-related functionalities.
    - `user.controller.js`: Controller for handling user-related operations.
    - `user.routes.js`: Express routes for user endpoints.
    - `user.validator.js`: Joi validation schema for user-related operations.
  - `task/`: Directory for task-related functionalities.
    - `task.controller.js`: Controller for handling task-related operations.
    - `task.routes.js`: Express routes for task endpoints.
    - `task.validator.js`: Joi validation schema for task-related operations.
- `utils/`: Directory containing utility functions.
  - `email/`: Directory for email utility functions.
    - `nodemailer.js`: Utility for sending email using Nodemailer.
  - `error/`: Directory for error utility functions.
    - `appError.js`: Custom error class.
    - `catchAsyncError.js`: Utility for catching and handling async errors.
  - `password.js`: Utility functions for hashing and comparing passwords.
  - `pushTasks.js`: Utility functions for updating task lists of users.
- `view/`: Contains view-related files.
  - `verifyEmail.js`: HTML template for email verification.
  - `verifySuccess.html`: HTML file for success message after email verification.
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

In this section, I'll cover the middleware components used in the application. Middleware functions are used to perform various tasks such as authentication, validation, error handling, and more.

## Authentication Middleware

**File: auth.js**

**Description:** This middleware function verifies the validity of a JWT token passed in the request headers. It checks if the token is blacklisted or invalid and adds the decoded user ID to the request for authenticated routes. It is used to ensure that only authorized users can access certain endpoints.

## Check AssignTo Middleware

**File: checkAssignTo.js**

**Description:** This middleware function validates the existence of the `assignTo` user ID in the request body when creating or updating a task. It checks if the specified user ID corresponds to an existing user in the database. This helps ensure that tasks can only be assigned to valid users.

## Error Handling Middleware

**File: globalErrorHandler.js**

**Description:** This middleware function handles global errors that occur during the request-response cycle. It captures and processes errors, sending appropriate responses based on the error status code. This ensures consistent and user-friendly error handling across different parts of the application.

## Validation Middleware

**File: validation.js**

**Description:** This middleware function validates incoming request data and headers using Joi schemas. It checks the integrity of data provided in the request body, parameters, query parameters, and headers. This helps maintain data consistency and ensures that only valid data is processed by the application.

Feel free to explore these middleware components and their implementations in the source code to get a better understanding of how they contribute to the functionality and security of the application.

---

# Utilities

In this section, I'll explore the utility functions that enhance the functionality and maintainability of the application.

## Nodemailer Utility

**File: nodemailer.js**

**Description:** This utility module handles sending verification emails to users for email confirmation. It uses the Nodemailer module to create and send emails. The `verifyEmail` function takes an `option` object as input, which includes the user's email, protocol, host, and verification token. The function generates and sends an email with a verification link.

## Custom Error Class

**File: appError.js**

**Description:** This utility module defines a custom `AppError` class that extends the JavaScript `Error` class. It allows you to create custom error instances with an associated status code. This is useful for consistent and structured error handling throughout the application, providing detailed error messages and status codes.

## Catch Async Error Utility

**File: catchAsyncError.js**

**Description:** This utility module provides a higher-order function `catchAsyncError` that simplifies error handling in asynchronous route handlers. It wraps asynchronous functions, catching any errors and passing them to the global error handler middleware. This ensures that errors occurring in asynchronous functions are properly handled and don't crash the application.

## Password Hashing Utility

**File: password.js**

**Description:** This utility module contains functions for hashing and comparing passwords. The `hashPassword` function securely hashes a plain password using the `bcrypt` library with a specified number of salt rounds. The `comparePasswords` function compares a plain password with a hashed password, verifying the password's validity.

## Push and Update Tasks Utility

**File: pushTasks.js**

**Description:** This utility module provides functions for updating the task lists of users when tasks are created, updated, or deleted. The functions ensure that task IDs are appropriately added or removed from the `createdTasks` and `assignedTasks` arrays of users, maintaining task ownership and assignments.

These utility functions contribute to the overall efficiency, security, and reliability of the application's various features.

---

# Views

The "views" directory contains HTML templates for rendering different email templates in a visually appealing manner. These templates are used for various email communication purposes within the application.

## Email Verification Template

**File: verifyEmail.js**

**Description:** This HTML template is used for sending an email verification link to users during the registration process. The `verifyEmailHtml` function generates an HTML email that includes a verification link. The link leads the user to the email verification page in the application, where their email address can be verified.

## Email Verification Success Template

**File: verifySuccess.html**

**Description:** This HTML template is used to display a success message after a user's email address is successfully verified.

These view templates contribute to the overall user experience by providing visually appealing and informative email communications throughout the application.

---

## Author

- GitHub - [IMostafaR](https://github.com/IMostafaR)
- Linkedin - [@imostafarh](https://www.linkedin.com/in/imostafarh/)
