export interface Reminder {
  id: string;
  memory_id: string;
  title: string;
  due_date: string; // ISO 8601 format
  description: string;
  is_done: boolean;
}
