<h1 align="center">READLY</h1>

Readly Library Management API is a RESTful service designed to streamline the management of library operations. This API enables efficient handling of users, books, and transactions, making it an ideal solution for modern library systems. Built with TypeScript and Node.js, the API ensures high performance and reliability, leveraging PostgreSQL for data persistence and TypeORM for seamless database interactions.

## Key Features
### User Management
- Add new users.
- List detailed user informations.
- List users.

### Book Management
- Add new books.
- List detailed book informations.
- List books.

### Transaction Management
- Enable users to borrow books.
- Manage book returns and allow users to provide ratings.

### Validation and Error Handling
- Comprehensive input validation to ensure data integrity.
- Clear and descriptive error messages for smooth debugging.

## API Documentation

More information on the exposed web services with example test cases can be found in the below API documentation:
* [**API Documentation**](https://documenter.getpostman.com/view/27146547/2sAYBYeq25)

## Getting Started

You can run the application either locally or using Docker Compose. Choose the method that works best for you.

### Option 1: Running with Docker Compose

1. **Clone the Repository:**

```bash
    git clone https://github.com/berkarslann/readly-library-management-api.git
```

2. **Set up environment variables: Copy the .env.example file to .env in folders and make the necessary adjustments:**

```bash
    cp .env.example .env
```
  Ensure you update the .env files with your own configuration.

3. **Run the application**
   
```bash
    docker-compose up --build
```

### Option 2

1. **Clone the Repository:**

```bash
    git clone https://github.com/berkarslann/readly-library-management-api.git
```

2. **To make necessary downloads:**

```bash
    npm install
```
3. **Set up environment variables: Copy the .env.example file to .env in folders and make the necessary adjustments:**

```bash
    cp .env.example .env
```
  Ensure you update the .env files with your own configuration.

4. **Start the server:**

```bash
   npm start
```


