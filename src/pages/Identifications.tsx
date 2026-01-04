import React, { useState } from 'react';
import { Search, Trash2, RefreshCw, Leaf, Clock, CheckCircle, Eye } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Table, Modal, Badge } from '../components/ui';
import { useIdentifications, useDeleteIdentification } from '../hooks/useAdmin';
import type { AdminIdentification, PaginationParams, DateRangeParams } from '../api/services/admin.service';

export const Identifications: React.FC = () => {
  const [params, setParams] = useState<PaginationParams & DateRangeParams>({ page: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<AdminIdentification | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, refetch } = useIdentifications({ ...params, search: searchTerm });
  const deleteIdentification = useDeleteIdentification();

  const identifications = data?.identifications || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this identification?')) {
      try {
        await deleteIdentification.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete identification:', error);
      }
    }
  };

  const handleView = (identification: AdminIdentification) => {
    setSelectedId(identification);
    setIsViewModalOpen(true);
  };

  const getConfidenceVariant = (confidence: number): 'success' | 'warning' | 'danger' => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.5) return 'warning';
    return 'danger';
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (id: AdminIdentification) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {id.imageUrl ? (
            <img src={id.imageUrl} alt={id.plantName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'plant',
      header: 'Plant',
      render: (id: AdminIdentification) => (
        <div>
          <p className="font-medium text-gray-900">{id.plantName}</p>
          <p className="text-sm text-gray-500 italic">{id.scientificName}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (id: AdminIdentification) => (
        <p className="text-sm text-gray-600">{id.userEmail}</p>
      ),
    },
    {
      key: 'confidence',
      header: 'Confidence',
      render: (id: AdminIdentification) => (
        <Badge variant={getConfidenceVariant(id.confidence)}>
          {(id.confidence * 100).toFixed(1)}%
        </Badge>
      ),
    },
    {
      key: 'processingTime',
      header: 'Processing',
      render: (id: AdminIdentification) => (
        <span className="text-sm text-gray-600">{id.processingTime}ms</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (id: AdminIdentification) => (
        <span className="text-sm text-gray-600">
          {new Date(id.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (id: AdminIdentification) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(id.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Plant Identifications" />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Identifications</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Processing Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {identifications.length > 0
                    ? Math.round(identifications.reduce((a, b) => a + b.processingTime, 0) / identifications.length)
                    : 0}ms
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">High Confidence</p>
                <p className="text-2xl font-bold text-purple-600">
                  {identifications.filter(i => i.confidence >= 0.8).length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Page</p>
                <p className="text-2xl font-bold text-orange-600">{identifications.length}</p>
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
                  placeholder="Search by plant or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setParams({ ...params, startDate: e.target.value })}
              />
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setParams({ ...params, endDate: e.target.value })}
              />
            </div>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Table columns={columns} data={identifications} loading={isLoading} />

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

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Identification Details"
        >
          {selectedId && (
            <div className="space-y-4">
              {selectedId.imageUrl && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedId.imageUrl}
                    alt={selectedId.plantName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plant Name</p>
                  <p className="font-medium">{selectedId.plantName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scientific Name</p>
                  <p className="font-medium italic">{selectedId.scientificName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Confidence</p>
                  <Badge variant={getConfidenceVariant(selectedId.confidence)}>
                    {(selectedId.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="font-medium">{selectedId.processingTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{selectedId.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedId.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
