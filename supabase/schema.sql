-- ============================================================
-- NEURAL QUEST — Database Schema
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
  metric_value numeric DEFAULT NULL,
  metric_unit text DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- 3. Goals table (custom real-world reward goals)
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

-- 4. Shop items table
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cost int NOT NULL,
  type text NOT NULL CHECK (type IN ('badge','frame','banner'))
);

-- 5. User inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  item_id uuid REFERENCES shop_items ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- 6. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
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

DROP POLICY IF EXISTS "goals_select" ON goals;
CREATE POLICY "goals_select" ON goals FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_insert" ON goals;
CREATE POLICY "goals_insert" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_update" ON goals;
CREATE POLICY "goals_update" ON goals FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_delete" ON goals;
CREATE POLICY "goals_delete" ON goals FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "shop_items_select" ON shop_items;
CREATE POLICY "shop_items_select" ON shop_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "inventory_select" ON user_inventory;
CREATE POLICY "inventory_select" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "inventory_insert" ON user_inventory;
CREATE POLICY "inventory_insert" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>''username'')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Block direct client writes to progression fields
CREATE OR REPLACE FUNCTION public.block_profile_progression_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.xp IS DISTINCT FROM OLD.xp OR NEW.gold IS DISTINCT FROM OLD.gold OR
      NEW.level IS DISTINCT FROM OLD.level OR NEW.streak_count IS DISTINCT FROM OLD.streak_count OR
      NEW.attributes IS DISTINCT FROM OLD.attributes OR NEW.last_active_date IS DISTINCT FROM OLD.last_active_date) THEN
    IF current_setting(''request.jwt.claims'', true)::jsonb->>''role'' IN (''anon'', ''authenticated'') THEN
      RAISE EXCEPTION ''Direct modification of progression fields is not allowed'';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_profile_progression ON profiles;
CREATE TRIGGER protect_profile_progression
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.block_profile_progression_update();

-- 9. complete_task RPC (atomic)
CREATE OR REPLACE FUNCTION public.complete_task(p_task_id uuid, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_task tasks%ROWTYPE;
  v_profile profiles%ROWTYPE;
  v_xp_gain int;
  v_gold_gain int;
  v_old_level int;
  v_today date := CURRENT_DATE;
  v_leveled_up bool := false;
  v_next_xp int;
BEGIN
  SELECT * INTO v_task FROM tasks WHERE id = p_task_id AND user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION ''Task not found''; END IF;
  IF v_task.status = ''completed'' THEN RAISE EXCEPTION ''Task already completed''; END IF;

  UPDATE tasks SET status = ''completed'', completed_at = now() WHERE id = p_task_id;

  v_xp_gain := v_task.difficulty * 15;
  v_gold_gain := v_task.difficulty * 5;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  v_old_level := v_profile.level;

  IF v_profile.last_active_date IS NULL OR v_profile.last_active_date < v_today - 1 THEN
    v_profile.streak_count := 1;
  ELSIF v_profile.last_active_date = v_today - 1 THEN
    v_profile.streak_count := v_profile.streak_count + 1;
  END IF;

  v_profile.xp := v_profile.xp + v_xp_gain;
  v_profile.gold := v_profile.gold + v_gold_gain;
  v_profile.last_active_date := v_today;

  v_profile.attributes := jsonb_set(
    v_profile.attributes,
    ARRAY[v_task.category],
    to_jsonb((COALESCE((v_profile.attributes->>v_task.category)::int, 0) + v_task.difficulty * 3))
  );

  LOOP
    v_next_xp := FLOOR(50 * POWER(v_profile.level::float, 1.5))::int;
    EXIT WHEN v_profile.xp < v_next_xp;
    v_profile.xp := v_profile.xp - v_next_xp;
    v_profile.level := v_profile.level + 1;
    v_leveled_up := true;
  END LOOP;

  UPDATE profiles SET xp = v_profile.xp, gold = v_profile.gold, level = v_profile.level,
    streak_count = v_profile.streak_count, last_active_date = v_profile.last_active_date,
    attributes = v_profile.attributes WHERE id = p_user_id;

  RETURN jsonb_build_object(
    ''profile'', row_to_json(v_profile),
    ''leveled_up'', v_leveled_up, ''new_level'', v_profile.level,
    ''xp_gained'', v_xp_gain, ''gold_gained'', v_gold_gain
  );
END;
$$;

-- 10. purchase_item RPC (atomic)
CREATE OR REPLACE FUNCTION public.purchase_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_item shop_items%ROWTYPE;
  v_profile profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_item FROM shop_items WHERE id = p_item_id;
  IF NOT FOUND THEN RAISE EXCEPTION ''Item not found''; END IF;
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_profile.gold < v_item.cost THEN RAISE EXCEPTION ''Insufficient credits''; END IF;
  IF EXISTS (SELECT 1 FROM user_inventory WHERE user_id = p_user_id AND item_id = p_item_id) THEN
    RAISE EXCEPTION ''Item already owned'';
  END IF;
  UPDATE profiles SET gold = gold - v_item.cost WHERE id = p_user_id;
  INSERT INTO user_inventory (user_id, item_id) VALUES (p_user_id, p_item_id);
  RETURN jsonb_build_object(''success'', true, ''item_id'', p_item_id, ''new_gold'', v_profile.gold - v_item.cost);
END;
$$;

-- 11. Seed shop items
INSERT INTO shop_items (name, description, cost, type) VALUES
  (''NEON REAPER'', ''A glowing skull badge that radiates pure neural energy.'', 150, ''badge''),
  (''GHOST PROTOCOL FRAME'', ''Semi-transparent profile frame with data-stream borders.'', 200, ''frame''),
  (''APEX BANNER'', ''Full-width banner showing your rank. For top-tier hackers only.'', 500, ''banner''),
  (''CHROME CIPHER BADGE'', ''Encrypted badge confirming your grid identity.'', 75, ''badge''),
  (''HOLOGRAPHIC GRID FRAME'', ''Holographic frame with animated matrix rain effect.'', 350, ''frame'')
ON CONFLICT DO NOTHING;