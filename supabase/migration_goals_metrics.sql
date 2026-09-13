-- ============================================================
-- KAIZEN: Goals & Metrics Migration
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ============================================================

-- 1. Add metric columns to existing tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS metric_value numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS metric_unit text DEFAULT NULL;

-- 2. Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('strength','intellect','discipline','creativity')),
  target_value numeric NOT NULL,
  metric_unit text,
  period_start date NOT NULL,
  period_end date NOT NULL,
  reward_text text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','achieved','expired')),
  achieved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS on goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for goals
DROP POLICY IF EXISTS "goals_select" ON goals;
CREATE POLICY "goals_select" ON goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_insert" ON goals;
CREATE POLICY "goals_insert" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_update" ON goals;
CREATE POLICY "goals_update" ON goals FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_delete" ON goals;
CREATE POLICY "goals_delete" ON goals FOR DELETE USING (auth.uid() = user_id);

-- 5. Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
