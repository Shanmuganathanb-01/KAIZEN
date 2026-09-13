export interface Profile {
  id: string;
  username: string | null;
  level: number;
  xp: number;
  gold: number;
  streak_count: number;
  last_active_date: string | null;
  attributes: {
    strength: number;
    intellect: number;
    discipline: number;
    creativity: number;
  };
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category: "strength" | "intellect" | "discipline" | "creativity";
  difficulty: 1 | 2 | 3;
  status: "pending" | "completed";
  created_at: string;
  completed_at: string | null;
  metric_value?: number | null;
  metric_unit?: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  cost: number;
  type: "badge" | "frame" | "banner";
}

export interface UserInventoryItem {
  user_id: string;
  item_id: string;
  purchased_at: string;
}

export type GoalStatus = "active" | "achieved" | "expired";
export type GoalCategory = "strength" | "intellect" | "discipline" | "creativity";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  target_value: number;
  period_start: string; // date string
  period_end: string;   // date string
  reward_text: string;
  status: GoalStatus;
  achieved_at: string | null;
}

export interface GoalWithProgress extends Goal {
  progress: number;
  percentage: number; // 0–100, capped at 100
}

export interface CompleteTaskResponse {
  profile: Profile;
  leveled_up: boolean;
  new_level: number;
  xp_gained: number;
  gold_gained: number;
  achievedGoals?: GoalWithProgress[];
}
