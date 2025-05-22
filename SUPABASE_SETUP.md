# Supabase Database Setup

This application is configured to work with a PostgreSQL database through Supabase. The application is now pre-configured with your Supabase credentials.

## Current Configuration

The application is currently configured with the following Supabase details:

- **Supabase URL**: `https://xghxfeojrwpvdpazova.supabase.co`
- **Service Role Key**: Your service role key is configured in `.env.local`
- **Anon Key**: Your anon key is configured in `.env.local`
- **Password**: `om0zKmxzkPXhR2vA`

## Environment Variables

The following environment variables are configured in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://xghxfeojrwpvdpazova.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[Your service role key]
SUPABASE_ANON_KEY=[Your anon key]
SUPABASE_PASSWORD=om0zKmxzkPXhR2vA
```

## Database Setup

The application will automatically set up the database schema on startup. It creates the following tables:

- **users**: For application users and authentication
- **employees**: For employee data management
- **tasks**: For task tracking and management
- **alerts**: For system alerts
- **shifts**: For shift scheduling
- **zones**: For warehouse zone management

## Default Admin User

On first startup, a default admin user will be created with:

- **Email**: `admin@amazon-warehouse.com`
- **Password**: `admin123`

## Testing Database Connection

To test if your Supabase database connection is working:

1. Start the application with `pnpm dev`
2. Navigate to the application in your browser
3. Check the console logs for database connection status
4. The message "Database initialized successfully, using fallback: false" indicates a successful connection

## Running the Database Setup Script Manually

You can also manually run the database setup script:

```
pnpm setup-db
```

This will create all necessary tables and seed initial data.

## Setup Instructions

1. **Create a Supabase Account**
   - Go to [https://supabase.com/](https://supabase.com/) and sign up for an account if you don't already have one.

2. **Create a New Project**
   - Once logged in, create a new project.
   - Choose a name for your project and set a secure database password.
   - Select a region closest to your users.

3. **Get Your API Keys**
   - After your project is created, go to the project dashboard.
   - In the left sidebar, click on "Project Settings" and then "API".
   - You'll see two types of API keys:
     - **anon/public**: For client-side code
     - **service_role**: For server-side code and administrative tasks (this is what we need)

4. **Update Environment Variables**
   - Create a `.env.local` file in the root of your project with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xghxfeojrwpvdpazova.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=[Your service role key]
   SUPABASE_ANON_KEY=[Your anon key]
   SUPABASE_PASSWORD=om0zKmxzkPXhR2vA
   ```
   - Replace `[Your service role key]` with your actual service role key.
   - Replace `[Your anon key]` with your actual anon key.

5. **Initialize the Database**
   - Run the database setup script to create all required tables:
   ```
   pnpm setup-db
   ```

6. **Restart the Application**
   - Restart your development server to apply the changes:
   ```
   pnpm dev
   ```

## Troubleshooting

If you see "Invalid API key" errors:
1. Check that you're using the **service_role** key, not the anon/public key.
2. Verify that the key hasn't been rotated or expired in your Supabase dashboard.
3. Make sure your `.env.local` file is being loaded correctly.

If you continue to have issues, the application will automatically fall back to using an in-memory database, but your data will not be persisted between server restarts.

## Database Schema

The setup script creates the following tables:

- **users**: Application users with authentication
- **employees**: Warehouse employees
- **tasks**: Work tasks to be assigned
- **alerts**: System alerts and notifications
- **shifts**: Work shift schedules
- **zones**: Warehouse zones

## Manual Setup

If you prefer to set up the database manually, you can use the SQL scripts in the `scripts/setup-database.js` file as a reference for creating the tables directly in the Supabase SQL editor. 