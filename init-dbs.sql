-- Create databases for both Brain services on first run.
-- The default POSTGRES_DB (lumitra) is created automatically by the postgres image.
-- This script runs as an init script to create the two service databases.

SELECT 'CREATE DATABASE storagebrain' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'storagebrain')\gexec
SELECT 'CREATE DATABASE databrain' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'databrain')\gexec
