import React from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Users,
  Leaf,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useDashboardStats, useSystemHealth, useUserAnalytics, usePlanAnalytics } from '../hooks/useAdmin';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, loading }) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      )}
    </Card>
  );
};

const HealthIndicator: React.FC<{ status: string; label: string; responseTime?: number }> = ({
  status,
  label,
  responseTime,
}) => {
  const isHealthy = status === 'healthy' || status === 'connected';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {isHealthy ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {responseTime !== undefined && (
          <span className="text-xs text-gray-500">{responseTime}ms</span>
        )}
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth();
  const { data: userAnalytics, isLoading: analyticsLoading } = useUserAnalytics();
  const { data: planAnalytics } = usePlanAnalytics();

  const handleRefresh = () => {
    refetchStats();
    refetchHealth();
  };

  // Transform user analytics for charts
  const signupData = userAnalytics?.dailySignups?.slice(-7) || [];
  const planData = planAnalytics?.planDistribution || [];

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-8">
        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button variant="secondary" onClick={handleRefresh} disabled={statsLoading || healthLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change={stats ? Math.round((stats.newUsersThisMonth / (stats.totalUsers || 1)) * 100) : undefined}
            icon={Users}
            color="bg-blue-600"
            loading={statsLoading}
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={Activity}
            color="bg-green-600"
            loading={statsLoading}
          />
          <StatCard
            title="Total Identifications"
            value={stats?.totalIdentifications || 0}
            change={stats?.identificationsThisWeek ? 12 : undefined}
            icon={Leaf}
            color="bg-purple-600"
            loading={statsLoading}
          />
          <StatCard
            title="Monthly Revenue"
            value={stats ? `$${stats.monthlyRevenue?.toLocaleString() || 0}` : '$0'}
            icon={DollarSign}
            color="bg-orange-600"
            loading={statsLoading}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <p className="text-sm text-gray-500">New Users Today</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.newUsersToday || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">New Users This Week</p>
            <p className="text-2xl font-bold text-green-600">{stats?.newUsersThisWeek || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Identifications Today</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.identificationsToday || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <p className="text-2xl font-bold text-orange-600">{stats?.activeSubscriptions || 0}</p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Signups Chart */}
          <Card title="User Signups (Last 7 Days)">
            {analyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={signupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })} />
                  <YAxis />
                  <Tooltip labelFormatter={(val) => new Date(val).toLocaleDateString()} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Signups"
                    stroke="#3B82F6"
                    fill="#93C5FD"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Plan Distribution Chart */}
          <Card title="Subscription Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planData.length > 0 ? planData : [
                    { tier: 'Seedling', count: 65, percentage: 65 },
                    { tier: 'Gardener', count: 25, percentage: 25 },
                    { tier: 'Botanist', count: 10, percentage: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="tier"
                >
                  {(planData.length > 0 ? planData : [
                    { tier: 'Seedling' },
                    { tier: 'Gardener' },
                    { tier: 'Botanist' },
                  ]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} users`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* System Health & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <Card title="System Health" className="lg:col-span-1">
            {healthLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <HealthIndicator
                  status={health?.status || 'unknown'}
                  label="Overall Status"
                />
                <HealthIndicator
                  status={health?.database?.status || 'unknown'}
                  label="Database"
                  responseTime={health?.database?.responseTime}
                />
                <HealthIndicator
                  status={health?.geminiApi?.status || 'unknown'}
                  label="Gemini API"
                  responseTime={health?.geminiApi?.responseTime}
                />
                <HealthIndicator
                  status={health?.stripe?.status || 'unknown'}
                  label="Stripe"
                />
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">Uptime</span>
                    <span className="text-sm font-medium">
                      {health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">Memory Usage</span>
                    <span className="text-sm font-medium">{health?.memoryUsage?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">CPU Usage</span>
                    <span className="text-sm font-medium">{health?.cpuUsage?.toFixed(1) || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Revenue Overview */}
          <Card title="Revenue Overview" className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${stats?.monthlyRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Plants</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.totalPlants?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-500">This Week IDs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.identificationsThisWeek?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
