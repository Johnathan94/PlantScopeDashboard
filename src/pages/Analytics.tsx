import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Leaf, DollarSign, RefreshCw } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button } from '../components/ui';
import {
  useUserAnalytics, useIdentificationAnalytics, useRevenueAnalytics, usePlanAnalytics
} from '../hooks/useAdmin';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

type TabType = 'users' | 'identifications' | 'revenue' | 'plans';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const { data: userAnalytics, isLoading: userLoading, refetch: refetchUsers } = useUserAnalytics(dateRange);
  const { data: idAnalytics, isLoading: idLoading, refetch: refetchIds } = useIdentificationAnalytics(dateRange);
  const { data: revenueAnalytics, isLoading: revLoading, refetch: refetchRev } = useRevenueAnalytics(dateRange);
  const { data: planAnalytics, isLoading: planLoading, refetch: refetchPlans } = usePlanAnalytics();

  const isLoading = userLoading || idLoading || revLoading || planLoading;

  const handleRefresh = () => {
    refetchUsers();
    refetchIds();
    refetchRev();
    refetchPlans();
  };

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'identifications' as TabType, label: 'Identifications', icon: Leaf },
    { id: 'revenue' as TabType, label: 'Revenue', icon: DollarSign },
    { id: 'plans' as TabType, label: 'Plans', icon: TrendingUp },
  ];

  return (
    <div>
      <Header title="Analytics" />
      <div className="p-8">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <Button onClick={handleRefresh} variant="secondary">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* User Analytics Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-gray-500">Retention Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {userAnalytics?.retentionRate?.toFixed(1) || 0}%
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Churn Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {userAnalytics?.churnRate?.toFixed(1) || 0}%
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Daily Avg Signups</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userAnalytics?.dailySignups?.length
                    ? Math.round(userAnalytics.dailySignups.reduce((a, b) => a + b.count, 0) / userAnalytics.dailySignups.length)
                    : 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Total by Tier</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userAnalytics?.usersByTier?.reduce((a, b) => a + b.count, 0) || 0}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Daily Signups">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userAnalytics?.dailySignups || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                    <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#93C5FD" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Users by Tier">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userAnalytics?.usersByTier || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="tier"
                    >
                      {(userAnalytics?.usersByTier || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Identification Analytics Tab */}
        {activeTab === 'identifications' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-gray-500">Avg Processing Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {idAnalytics?.avgProcessingTime?.toFixed(0) || 0}ms
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((idAnalytics?.successRate || 0) * 100).toFixed(1)}%
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Daily Average</p>
                <p className="text-2xl font-bold text-purple-600">
                  {idAnalytics?.dailyIdentifications?.length
                    ? Math.round(idAnalytics.dailyIdentifications.reduce((a, b) => a + b.count, 0) / idAnalytics.dailyIdentifications.length)
                    : 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Top Plants Identified</p>
                <p className="text-2xl font-bold text-orange-600">
                  {idAnalytics?.topPlants?.length || 0}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Daily Identifications">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={idAnalytics?.dailyIdentifications || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { weekday: 'short' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Top Identified Plants">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={idAnalytics?.topPlants?.slice(0, 10) || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Revenue Analytics Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${revenueAnalytics?.totalRevenue?.toLocaleString() || 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">MRR</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${revenueAnalytics?.mrr?.toLocaleString() || 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">ARR</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${revenueAnalytics?.arr?.toLocaleString() || 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">ARPU</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${revenueAnalytics?.avgRevenuePerUser?.toFixed(2) || 0}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Monthly Revenue">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueAnalytics?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                    <Area type="monotone" dataKey="amount" stroke="#10B981" fill="#A7F3D0" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue by Tier">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueAnalytics?.revenueByTier || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      nameKey="tier"
                    >
                      {(revenueAnalytics?.revenueByTier || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Plan Analytics Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((planAnalytics?.conversionRate || 0) * 100).toFixed(1)}%
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Total Upgrades</p>
                <p className="text-2xl font-bold text-blue-600">
                  {planAnalytics?.upgrades?.reduce((a, b) => a + b.count, 0) || 0}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Total Downgrades</p>
                <p className="text-2xl font-bold text-red-600">
                  {planAnalytics?.downgrades?.reduce((a, b) => a + b.count, 0) || 0}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Plan Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planAnalytics?.planDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="tier"
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                    >
                      {(planAnalytics?.planDistribution || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Plan Changes">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Upgrades</h4>
                    {planAnalytics?.upgrades?.map((u, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm">{u.from} → {u.to}</span>
                        <span className="text-sm font-medium text-green-600">+{u.count}</span>
                      </div>
                    )) || <p className="text-sm text-gray-500">No data</p>}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Downgrades</h4>
                    {planAnalytics?.downgrades?.map((d, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm">{d.from} → {d.to}</span>
                        <span className="text-sm font-medium text-red-600">-{d.count}</span>
                      </div>
                    )) || <p className="text-sm text-gray-500">No data</p>}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
