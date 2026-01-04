import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import type { DataItem } from '../types';

const initialData: DataItem[] = [
  { id: '1', name: 'Product A', description: 'Description for Product A', status: 'active', category: 'Electronics', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
  { id: '2', name: 'Product B', description: 'Description for Product B', status: 'inactive', category: 'Clothing', createdAt: '2024-01-10', updatedAt: '2024-01-18' },
  { id: '3', name: 'Product C', description: 'Description for Product C', status: 'pending', category: 'Electronics', createdAt: '2024-01-12', updatedAt: '2024-01-19' },
  { id: '4', name: 'Product D', description: 'Description for Product D', status: 'active', category: 'Home', createdAt: '2024-01-08', updatedAt: '2024-01-15' },
  { id: '5', name: 'Product E', description: 'Description for Product E', status: 'active', category: 'Sports', createdAt: '2024-01-05', updatedAt: '2024-01-12' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const categoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home', label: 'Home' },
  { value: 'Sports', label: 'Sports' },
];

export const DataManagement: React.FC = () => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as DataItem['status'],
    category: 'Electronics',
  });

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: DataItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        status: item.status,
        category: item.category,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        category: 'Electronics',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    if (editingItem) {
      setData(
        data.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, updatedAt: now }
            : item
        )
      );
    } else {
      const newItem: DataItem = {
        id: String(Date.now()),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setData([newItem, ...data]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const getStatusVariant = (status: DataItem['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (item: DataItem) => (
        <Badge variant={getStatusVariant(item.status)}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    { key: 'updatedAt', header: 'Last Updated' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: DataItem) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Data Management" />
      <div className="p-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <Table columns={columns} data={filteredData} />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingItem ? 'Edit Item' : 'Add New Item'}
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) =>
                setFormData({ ...formData, status: value as DataItem['status'] })
              }
            />
          </form>
        </Modal>
      </div>
    </div>
  );
};
