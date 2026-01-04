import React, { useState } from 'react';
import { Search, Edit2, CreditCard, RefreshCw, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Modal, Select, Badge } from '../components/ui';
import { useSubscriptions, useUpdateSubscription } from '../hooks/useAdmin';
import type { AdminSubscription, PaginationParams } from '../api/services/admin.service';

const tierOptions = [
  { value: 'Seedling', label: 'Seedling (Free)' },
  { value: 'Gardener', label: 'Gardener ($4.99/mo)' },
  { value: 'Botanist', label: 'Botanist ($9.99/mo)' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'past_due', label: 'Past Due' },
];

export const Subscriptions: React.FC = () => {
  const [params, setParams] = useState<PaginationParams>({ page: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<AdminSubscription | null>(null);
  const [formData, setFormData] = useState({ tier: 'Seedling', status: 'active' });

  const { data, isLoading, refetch } = useSubscriptions({ ...params, search: searchTerm });
  const updateSubscription = useUpdateSubscription();

  const subscriptions = data?.subscriptions || [];
  const totalPages = data?.totalPages || 1;

  const handleOpenModal = (sub: AdminSubscription) => {
    setEditingSub(sub);
    setFormData({ tier: sub.tier, status: sub.status });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSub(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    try {
      await updateSubscription.mutateAsync({
        userId: editingSub.userId,
        data: formData,
      });
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const getTierVariant = (tier: string): 'default' | 'success' | 'info' => {
    switch (tier) {
      case 'Botanist': return 'success';
      case 'Gardener': return 'info';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' => {
    switch (status) {
      case 'active': return 'success';
      case 'canceled': return 'danger';
      case 'past_due': return 'warning';
      default: return 'warning';
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (sub: AdminSubscription) => (
        <div>
          <p className="font-medium text-gray-900">{sub.userName}</p>
          <p className="text-sm text-gray-500">{sub.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Plan',
      render: (sub: AdminSubscription) => (
        <Badge variant={getTierVariant(sub.tier)}>{sub.tier}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (sub: AdminSubscription) => (
        <Badge variant={getStatusVariant(sub.status)}>
          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'monthlyAmount',
      header: 'Amount',
      render: (sub: AdminSubscription) => (
        <span className="font-medium">${sub.monthlyAmount.toFixed(2)}/mo</span>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (sub: AdminSubscription) => new Date(sub.startDate).toLocaleDateString(),
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (sub: AdminSubscription) => sub.endDate
        ? new Date(sub.endDate).toLocaleDateString()
        : sub.cancelAtPeriodEnd ? 'Canceling' : 'Active',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (sub: AdminSubscription) => (
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(sub)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Calculate stats
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.monthlyAmount, 0);

  return (
    <div>
      <Header title="Subscription Management" />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${totalMRR.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ARR</p>
                <p className="text-2xl font-bold text-orange-600">${(totalMRR * 12).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Table columns={columns} data={subscriptions} loading={isLoading} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Page {params.page} of {totalPages}</p>
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
          title="Edit Subscription"
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleSubmit} loading={updateSubscription.isPending}>Update</Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="font-medium">{editingSub?.userName}</p>
              <p className="text-sm text-gray-500">{editingSub?.userEmail}</p>
            </div>
            <Select
              label="Subscription Tier"
              options={tierOptions}
              value={formData.tier}
              onChange={(value) => setFormData({ ...formData, tier: value })}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />
          </form>
        </Modal>
      </div>
    </div>
  );
};
