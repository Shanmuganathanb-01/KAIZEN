-- ============================================================
-- NEURAL QUEST -- Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text,
  level int DEFAULT 1,
  xp int DEFAULT 0,
  gold int DEFAULT 0,
  streak_count int DEFAULT 0,
  last_active_date date,
  attributes jsonb DEFAULT '{"strength":0,"intellect":0,"discipline":0,"creativity":0}',
  created_at timestamptz DEFAULT now()
);

-- 2. Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'discipline',
  difficulty smallint NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- 3. Shop items table
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cost int NOT NULL,
  type text NOT NULL CHECK (type IN ('badge','frame','banner'))
);

-- 4. User inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  item_id uuid REFERENCES shop_items ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- 5. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "tasks_select" ON tasks;
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "tasks_insert" ON tasks;
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "tasks_update" ON tasks;
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "tasks_delete" ON tasks;
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "shop_items_select" ON shop_items;
CREATE POLICY "shop_items_select" ON shop_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "inventory_select" ON user_inventory;
CREATE POLICY "inventory_select" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "inventory_insert" ON user_inventory;
CREATE POLICY "inventory_insert" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
