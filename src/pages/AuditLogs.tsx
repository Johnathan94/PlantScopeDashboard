import React, { useState } from 'react';
import { Search, RefreshCw, FileText, User, Calendar, Globe } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Badge } from '../components/ui';
import { useAuditLogs } from '../hooks/useAdmin';
import type { AuditLog, PaginationParams, DateRangeParams } from '../api/services/admin.service';

export const AuditLogs: React.FC = () => {
  const [params, setParams] = useState<PaginationParams & DateRangeParams>({
    page: 1,
    pageSize: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch } = useAuditLogs({ ...params, search: searchTerm });

  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;

  const getActionVariant = (action: string): 'success' | 'danger' | 'warning' | 'info' | 'default' => {
    if (action.includes('create') || action.includes('add')) return 'success';
    if (action.includes('delete') || action.includes('remove')) return 'danger';
    if (action.includes('update') || action.includes('edit')) return 'warning';
    if (action.includes('login') || action.includes('view')) return 'info';
    return 'default';
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <p className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</p>
          <p className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: 'admin',
      header: 'Admin',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm">{log.adminEmail}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => (
        <Badge variant={getActionVariant(log.action)}>
          {log.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <p className="font-medium">{log.entityType}</p>
          <p className="text-gray-500 text-xs">{log.entityId}</p>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (log: AuditLog) => (
        <p className="text-sm text-gray-600 max-w-xs truncate" title={log.details}>
          {log.details}
        </p>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Globe className="h-3 w-3" />
          {log.ipAddress}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Audit Logs" />
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique Admins</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(logs.map(l => l.adminId)).size}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Actions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {logs.filter(l => {
                    const today = new Date().toDateString();
                    return new Date(l.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique IPs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(logs.map(l => l.ipAddress)).size}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setParams({ ...params, startDate: e.target.value, page: 1 })}
              />
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setParams({ ...params, endDate: e.target.value, page: 1 })}
              />
            </div>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Table columns={columns} data={logs} loading={isLoading} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Page {params.page} of {totalPages} ({data?.totalCount || 0} total logs)
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
      </div>
    </div>
  );
};
