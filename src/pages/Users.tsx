import React, { useState } from 'react';
import { Edit2, Trash2, Search, ShieldCheck, Eye, UserCog, RefreshCw } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import { useUsers, useUpdateUser, useDeleteUser, useAssignRole, useRemoveRole } from '../hooks/useAdmin';
import type { AdminUser, PaginationParams } from '../api/services/admin.service';

const tierOptions = [
  { value: 'Seedling', label: 'Seedling (Free)' },
  { value: 'Gardener', label: 'Gardener ($4.99)' },
  { value: 'Botanist', label: 'Botanist ($9.99)' },
];

export const Users: React.FC = () => {
  const [params, setParams] = useState<PaginationParams>({ page: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subscriptionTier: 'Seedling',
  });

  const { data, isLoading, refetch } = useUsers({ ...params, search: searchTerm });
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ ...params, page: 1 });
    refetch();
  };

  const handleOpenModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data: formData,
      });
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleAdmin = async (user: AdminUser) => {
    const isAdmin = user.roles.includes('Admin');
    try {
      if (isAdmin) {
        await removeRole.mutateAsync({ userId: user.id, role: 'Admin' });
      } else {
        await assignRole.mutateAsync({ userId: user.id, role: 'Admin' });
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('Admin')) return <ShieldCheck className="h-4 w-4 mr-1" />;
    return <Eye className="h-4 w-4 mr-1" />;
  };

  const getRoleVariant = (roles: string[]): 'danger' | 'info' | 'default' => {
    if (roles.includes('Admin')) return 'danger';
    return 'default';
  };

  const getTierVariant = (tier: string): 'default' | 'success' | 'warning' | 'info' => {
    switch (tier) {
      case 'Botanist': return 'success';
      case 'Gardener': return 'info';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Role',
      render: (user: AdminUser) => (
        <Badge variant={getRoleVariant(user.roles)}>
          <span className="flex items-center">
            {getRoleIcon(user.roles)}
            {user.roles.includes('Admin') ? 'Admin' : 'User'}
          </span>
        </Badge>
      ),
    },
    {
      key: 'subscriptionTier',
      header: 'Plan',
      render: (user: AdminUser) => (
        <Badge variant={getTierVariant(user.subscriptionTier)}>
          {user.subscriptionTier}
        </Badge>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (user: AdminUser) => (
        <div className="text-sm">
          <p>{user.identificationsUsedThisWeek}/{user.weeklyIdentificationLimit} IDs</p>
          <p className="text-gray-500">{user.plantsOwned}/{user.plantLimit} plants</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: AdminUser) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: 'lastLoginAt',
      header: 'Last Login',
      render: (user: AdminUser) => user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString()
        : 'Never',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: AdminUser) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleAdmin(user)}
            title={user.roles.includes('Admin') ? 'Remove Admin' : 'Make Admin'}
          >
            <UserCog className="h-4 w-4" />
          </Button>
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
    total: data?.totalCount || 0,
    admins: users.filter((u) => u.roles.includes('Admin')).length,
    gardeners: users.filter((u) => u.subscriptionTier === 'Gardener').length,
    botanists: users.filter((u) => u.subscriptionTier === 'Botanist').length,
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
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Gardener Plan</p>
            <p className="text-2xl font-bold text-blue-600">{stats.gardeners}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Botanist Plan</p>
            <p className="text-2xl font-bold text-green-600">{stats.botanists}</p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
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
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Table columns={columns} data={users} loading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Page {params.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={params.page === 1}
                  onClick={() => setParams({ ...params, page: (params.page || 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={params.page === totalPages}
                  onClick={() => setParams({ ...params, page: (params.page || 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Edit User"
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={updateUser.isPending}>
                Update
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Select
              label="Subscription Tier"
              options={tierOptions}
              value={formData.subscriptionTier}
              onChange={(value) => setFormData({ ...formData, subscriptionTier: value })}
            />
          </form>
        </Modal>
      </div>
    </div>
  );
};
