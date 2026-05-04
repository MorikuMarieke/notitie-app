export interface Checklist {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  body: string;
  checked: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ChecklistWithItems = Checklist & {
  items: ChecklistItem[];
};
