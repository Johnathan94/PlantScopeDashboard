import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type PaginationParams, type DateRangeParams, type UpdateUserRequest } from '../api/services/admin.service';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  dashboardStats: () => [...adminKeys.dashboard(), 'stats'] as const,
  systemHealth: () => [...adminKeys.dashboard(), 'health'] as const,
  users: (params?: PaginationParams) => [...adminKeys.all, 'users', params] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  subscriptions: (params?: PaginationParams) => [...adminKeys.all, 'subscriptions', params] as const,
  identifications: (params?: PaginationParams & DateRangeParams) => [...adminKeys.all, 'identifications', params] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
  userAnalytics: (params?: DateRangeParams) => [...adminKeys.analytics(), 'users', params] as const,
  identificationAnalytics: (params?: DateRangeParams) => [...adminKeys.analytics(), 'identifications', params] as const,
  revenueAnalytics: (params?: DateRangeParams) => [...adminKeys.analytics(), 'revenue', params] as const,
  planAnalytics: () => [...adminKeys.analytics(), 'plans'] as const,
  auditLogs: (params?: PaginationParams & DateRangeParams) => [...adminKeys.all, 'auditLogs', params] as const,
};

// Dashboard Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: adminKeys.dashboardStats(),
    queryFn: adminService.getDashboardStats,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: adminKeys.systemHealth(),
    queryFn: adminService.getSystemHealth,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// User Hooks
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 30000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      adminService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.assignRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.userId) });
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.removeRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.userId) });
    },
  });
}

// Subscription Hooks
export function useSubscriptions(params?: PaginationParams) {
  return useQuery({
    queryKey: adminKeys.subscriptions(params),
    queryFn: () => adminService.getSubscriptions(params),
    staleTime: 30000,
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { tier: string; status?: string } }) =>
      adminService.updateSubscription(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

// Identification Hooks
export function useIdentifications(params?: PaginationParams & DateRangeParams) {
  return useQuery({
    queryKey: adminKeys.identifications(params),
    queryFn: () => adminService.getIdentifications(params),
    staleTime: 30000,
  });
}

export function useDeleteIdentification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteIdentification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.identifications() });
    },
  });
}

// Analytics Hooks
export function useUserAnalytics(params?: DateRangeParams) {
  return useQuery({
    queryKey: adminKeys.userAnalytics(params),
    queryFn: () => adminService.getUserAnalytics(params),
    staleTime: 60000, // 1 minute
  });
}

export function useIdentificationAnalytics(params?: DateRangeParams) {
  return useQuery({
    queryKey: adminKeys.identificationAnalytics(params),
    queryFn: () => adminService.getIdentificationAnalytics(params),
    staleTime: 60000,
  });
}

export function useRevenueAnalytics(params?: DateRangeParams) {
  return useQuery({
    queryKey: adminKeys.revenueAnalytics(params),
    queryFn: () => adminService.getRevenueAnalytics(params),
    staleTime: 60000,
  });
}

export function usePlanAnalytics() {
  return useQuery({
    queryKey: adminKeys.planAnalytics(),
    queryFn: adminService.getPlanAnalytics,
    staleTime: 60000,
  });
}

// Audit Logs Hooks
export function useAuditLogs(params?: PaginationParams & DateRangeParams) {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => adminService.getAuditLogs(params),
    staleTime: 30000,
  });
}
