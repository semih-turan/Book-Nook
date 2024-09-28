# Book Nook Library Application

## Overview

The **Book Nook Library Application** is a comprehensive library management system that allows users to manage books, authors, publishers, and borrowing records efficiently. The application is built using React.js for the frontend and communicates with a backend API to perform CRUD operations.

## Features

- **Book Management:** Add, update, view, and delete books with detailed information, including authors, publishers, and categories.
- **Author Management:** Manage authors by adding, updating, viewing, and deleting author records.
- **Publisher Management:** Manage publishers, including adding, updating, viewing, and deleting records.
- **Category Management:** Add, update, view, and delete book categories.
- **Book Borrowing:** Record and manage the borrowing of books by users, including borrowing dates and return dates.
- **CRUD Operations:** Perform full CRUD operations for all entities with error handling and validation.

### 🚀 Live Demo

<div align="center">
  <img src="./frontend/book-nook/src/assets/library-hero-2.webp" alt="Landing Page Demo" width="900">
</div>

  <a href="https://book-nook-patika.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Click%20Here-brightgreen?style=for-the-badge&logo=github" alt="Live Demo" height="50">
  </a>
</div>

## Technologies Used

- **Frontend :**
  - React.js
  - Material-UI
  - Axios for HTTP requests
- **Backend:**
  - Java Spring Boot ([Backend Repository](https://github.com/semih-turan/LibraryAppSpringBoot))  
  - RESTful APIs

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14.x or later)
- npm (v6.x or later)
- Backend API running with the following endpoints:

| Endpoint                         | HTTP Method | Description                           |
|----------------------------------|-------------|---------------------------------------|
| /api/v1/books                    | GET         | Retrieve all books                    |
| /api/v1/books/{id}               | GET         | Retrieve a specific book by ID        |
| /api/v1/books                    | POST        | Add a new book                        |
| /api/v1/books/{id}               | PUT         | Update a book by ID                   |
| /api/v1/books/{id}               | DELETE      | Delete a book by ID                   |
| /api/v1/authors                  | GET         | Retrieve all authors                  |
| /api/v1/authors/{id}             | GET         | Retrieve a specific author by ID      |
| /api/v1/authors                  | POST        | Add a new author                      |
| /api/v1/authors/{id}             | PUT         | Update an author by ID                |
| /api/v1/authors/{id}             | DELETE      | Delete an author by ID                |
| /api/v1/publishers               | GET         | Retrieve all publishers               |
| /api/v1/publishers/{id}          | GET         | Retrieve a specific publisher by ID   |
| /api/v1/publishers               | POST        | Add a new publisher                   |
| /api/v1/publishers/{id}          | PUT         | Update a publisher by ID              |
| /api/v1/publishers/{id}          | DELETE      | Delete a publisher by ID              |
| /api/v1/categories               | GET         | Retrieve all categories               |
| /api/v1/categories/{id}          | GET         | Retrieve a specific category by ID    |
| /api/v1/categories               | POST        | Add a new category                    |
| /api/v1/categories/{id}          | PUT         | Update a category by ID               |
| /api/v1/categories/{id}          | DELETE      | Delete a category by ID               |
| /api/v1/borrows                  | GET         | Retrieve all borrowing records        |
| /api/v1/borrows/{id}             | GET         | Retrieve a specific borrowing by ID   |
| /api/v1/borrows                  | POST        | Add a new borrowing record            |
| /api/v1/borrows/{id}             | PUT         | Update a borrowing record by ID       |
| /api/v1/borrows/{id}             | DELETE      | Delete a borrowing record by ID       |

## Installation

1. **Clone the repository:**
   ```bash
    git clone https://github.com/semih-turan/Book-Nook.git
    cd Book-Nook/frontend/book-nook
 
2. **Install dependencies:**

    ```bash
    npm install

3. **Configure API Endpoints:**

- Make sure the backend API is running and accessible.
- Update the API base URL if necessary in your Axios configuration.

4. **Start the frontend development server:**

    ```bash
    npm start

The application should now be running on ``http://localhost:3000.``


## Usage
**Books**
View, add, update, and delete books.
Each book must have an author, publisher, and at least one category.

**Authors**
Manage author records by adding, updating, viewing, and deleting them.

**Publishers**
Manage publisher information including name, establishment year, and address.

**Categories**
Manage book categories with unique names and descriptions.

**Book Borrowing**
Record borrowing details including the borrower’s name, email, and borrowing/return dates.
Associate each borrowing record with a specific book.

## Error Handling
All forms include validation and error handling.
Errors are displayed in modals with detailed messages to guide the user.

## Contributing
If you would like to contribute to this project, please follow these steps:

## Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and ensure they are well-tested.
Submit a pull request with a description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.

## Contact
For any questions or feedback, please contact semituran@gmail.com.