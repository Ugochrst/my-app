export interface Item {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateItemDto {
  title: string;
  description?: string;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
}
