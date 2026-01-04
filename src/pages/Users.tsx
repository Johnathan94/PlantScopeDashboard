import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Shield, ShieldCheck, Eye } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import type { User } from '../types';

const initialUsers: User[] = [
  { id: '1', name: 'John Admin', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01', lastLogin: '2024-01-20' },
  { id: '2', name: 'Jane Editor', email: 'jane@example.com', role: 'editor', status: 'active', createdAt: '2024-01-05', lastLogin: '2024-01-19' },
  { id: '3', name: 'Bob Viewer', email: 'bob@example.com', role: 'viewer', status: 'inactive', createdAt: '2024-01-10', lastLogin: '2024-01-15' },
  { id: '4', name: 'Alice Editor', email: 'alice@example.com', role: 'editor', status: 'active', createdAt: '2024-01-08', lastLogin: '2024-01-18' },
  { id: '5', name: 'Charlie Viewer', email: 'charlie@example.com', role: 'viewer', status: 'active', createdAt: '2024-01-12', lastLogin: '2024-01-17' },
];

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as User['role'],
    status: 'active' as User['status'],
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        createdAt: now,
      };
      setUsers([newUser, ...users]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      case 'editor':
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return <Eye className="h-4 w-4 mr-1" />;
    }
  };

  const getRoleVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'editor':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <Badge variant={getRoleVariant(user.role)}>
          <span className="flex items-center">
            {getRoleIcon(user.role)}
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => (
        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    { key: 'createdAt', header: 'Created' },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user: User) => user.lastLogin || 'Never',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    admins: users.filter((u) => u.role === 'admin').length,
    editors: users.filter((u) => u.role === 'editor').length,
  };

  return (
    <div>
      <Header title="User Management" />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Editors</p>
            <p className="text-2xl font-bold text-blue-600">{stats.editors}</p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Table columns={columns} data={filteredUsers} />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? 'Edit User' : 'Add New User'}
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingUser ? 'Update' : 'Create'}
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
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Select
              label="Role"
              options={roleOptions}
              value={formData.role}
              onChange={(value) =>
                setFormData({ ...formData, role: value as User['role'] })
              }
            />
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) =>
                setFormData({ ...formData, status: value as User['status'] })
              }
            />
          </form>
        </Modal>
      </div>
    </div>
  );
};
