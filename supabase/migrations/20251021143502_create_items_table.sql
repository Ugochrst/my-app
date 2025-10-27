/*
  # Create Items Management System

  This migration sets up a simple items management system for demonstration purposes.

  ## New Tables
  
  ### `items`
  - `id` (uuid, primary key) - Unique identifier for each item
  - `title` (text, required) - The title/name of the item
  - `description` (text, optional) - Detailed description of the item
  - `created_at` (timestamptz) - Timestamp when the item was created
  - `updated_at` (timestamptz) - Timestamp when the item was last updated

  ## Security
  
  - Enable Row Level Security (RLS) on `items` table
  - Add policy to allow anyone to read all items (public read access)
  - Add policy to allow authenticated users to insert items
  - Add policy to allow authenticated users to update items
  - Add policy to allow authenticated users to delete items

  ## Notes
  
  This is a simple demonstration schema. In production, you might want to:
  1. Add user ownership to items (user_id column)
  2. Restrict updates/deletes to item owners only
  3. Add additional fields as needed for your application
*/

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all items
CREATE POLICY "Anyone can view items"
  ON items
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert items
CREATE POLICY "Authenticated users can insert items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update items
CREATE POLICY "Authenticated users can update items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete items
CREATE POLICY "Authenticated users can delete items"
  ON items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();