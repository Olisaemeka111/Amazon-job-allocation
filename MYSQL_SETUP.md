# MySQL Database Setup

This application is configured to work with a MySQL database. Follow these steps to set up your MySQL database and connect it to the application.

## Prerequisites

1. **MySQL Installation**
   - Make sure you have MySQL installed on your machine or have access to a MySQL server.
   - You can download MySQL from [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/).

## Setup Instructions

1. **Create a MySQL Database**
   - You can create the database manually using MySQL commands:
     ```sql
     CREATE DATABASE amazon_job_allocation;
     ```
   - Alternatively, the application's setup script will create the database for you if it doesn't exist.

2. **Configure Environment Variables**
   - Create a `.env.local` file in the root of the project (if it doesn't already exist).
   - Add the following environment variables:
     ```
     MYSQL_HOST=localhost
     MYSQL_PORT=3306
     MYSQL_DATABASE=amazon_job_allocation
     MYSQL_USER=root
     MYSQL_PASSWORD=your_mysql_password
     ```
   - Replace `your_mysql_password` with your actual MySQL password.

3. **Run the Setup Script**
   - Run the following command to set up the database schema and seed initial data:
     ```
     pnpm setup-mysql
     ```
   - This script will:
     - Create the database if it doesn't exist
     - Create all necessary tables
     - Create a default admin user (email: admin@amazon-warehouse.com, password: admin123)

4. **Start the Application**
   - Start the development server:
     ```
     pnpm dev
     ```
   - The application will now connect to your MySQL database.

## Troubleshooting

- **Connection Issues**
  - Ensure your MySQL server is running
  - Verify your connection details in the `.env.local` file
  - Make sure your MySQL user has appropriate permissions

- **Fallback Mode**
  - If the application can't connect to MySQL, it will fall back to using an in-memory database
  - Check the console logs for error messages

- **Manual Database Reset**
  - To reset the database, you can drop it and recreate it:
    ```sql
    DROP DATABASE amazon_job_allocation;
    CREATE DATABASE amazon_job_allocation;
    ```
  - Then run the setup script again: `pnpm setup-mysql` 