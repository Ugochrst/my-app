import type { Item, CreateItemDto, UpdateItemDto } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/items-api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

export const api = {
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    return response.json();
  },

  async createItem(data: CreateItemDto): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    return response.json();
  },

  async updateItem(id: string, data: UpdateItemDto): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    return response.json();
  },

  async deleteItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  },
};
