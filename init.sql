-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE habit_tracker' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'habit_tracker')\gexec

-- Set timezone
ALTER DATABASE habit_tracker SET timezone TO 'UTC';

-- Create extensions
\c habit_tracker;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
