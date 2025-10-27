import { useState, useEffect } from 'react';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { api } from './services/api';
import type { Item, CreateItemDto, UpdateItemDto } from './types';
import { Database } from 'lucide-react';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setError(null);
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (data: CreateItemDto) => {
    try {
      const newItem = await api.createItem(data);
      setItems([newItem, ...items]);
    } catch (err) {
      setError('Failed to create item');
      console.error(err);
    }
  };

  const handleUpdate = async (id: string, data: UpdateItemDto) => {
    try {
      const updatedItem = await api.updateItem(id, data);
      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Database size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Items Manager</h1>
          </div>
          <p className="text-gray-600">React + TypeScript + Node.js + PostgreSQL</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <ItemForm onSubmit={handleCreate} />

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading items...</p>
          </div>
        ) : (
          <ItemList items={items} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default App;
