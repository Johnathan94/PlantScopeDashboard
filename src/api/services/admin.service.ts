import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalIdentifications: number;
  identificationsToday: number;
  identificationsThisWeek: number;
  totalPlants: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: {
    status: string;
    responseTime: number;
  };
  geminiApi: {
    status: string;
    responseTime: number;
  };
  stripe: {
    status: string;
  };
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

// User Types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  subscriptionTier: string;
  subscriptionStatus: string;
  weeklyIdentificationLimit: number;
  identificationsUsedThisWeek: number;
  plantLimit: number;
  plantsOwned: number;
  isEmailConfirmed: boolean;
  createdAt: string;
  lastLoginAt?: string;
  stripeCustomerId?: string;
}

export interface UsersResponse {
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  subscriptionTier?: string;
  isEmailConfirmed?: boolean;
}

// Subscription Types
export interface AdminSubscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  tier: string;
  status: string;
  startDate: string;
  endDate?: string;
  stripeSubscriptionId?: string;
  monthlyAmount: number;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionsResponse {
  subscriptions: AdminSubscription[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Identification Types
export interface AdminIdentification {
  id: string;
  userId: string;
  userEmail: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  imageUrl: string;
  createdAt: string;
  processingTime: number;
}

export interface IdentificationsResponse {
  identifications: AdminIdentification[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Analytics Types
export interface UserAnalytics {
  dailySignups: { date: string; count: number }[];
  weeklyActiveUsers: { week: string; count: number }[];
  monthlyActiveUsers: { month: string; count: number }[];
  usersByTier: { tier: string; count: number }[];
  retentionRate: number;
  churnRate: number;
}

export interface IdentificationAnalytics {
  dailyIdentifications: { date: string; count: number }[];
  weeklyIdentifications: { week: string; count: number }[];
  avgProcessingTime: number;
  successRate: number;
  topPlants: { name: string; count: number }[];
  identificationsByHour: { hour: number; count: number }[];
}

export interface RevenueAnalytics {
  dailyRevenue: { date: string; amount: number }[];
  monthlyRevenue: { month: string; amount: number }[];
  totalRevenue: number;
  mrr: number;
  arr: number;
  avgRevenuePerUser: number;
  revenueByTier: { tier: string; amount: number }[];
}

export interface PlanAnalytics {
  planDistribution: { tier: string; count: number; percentage: number }[];
  upgrades: { from: string; to: string; count: number }[];
  downgrades: { from: string; to: string; count: number }[];
  conversionRate: number;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Admin Service
export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.admin.dashboardStats);
    return response.data;
  },

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get<SystemHealth>(API_ENDPOINTS.admin.dashboardHealth);
    return response.data;
  },

  // Users
  async getUsers(params?: PaginationParams): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>(API_ENDPOINTS.admin.users, { params });
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(API_ENDPOINTS.admin.userById(id));
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(API_ENDPOINTS.admin.userById(id), data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.userById(id));
  },

  async assignRole(userId: string, role: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.admin.assignRole(userId), { role });
  },

  async removeRole(userId: string, role: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.removeRole(userId, role));
  },

  // Subscriptions
  async getSubscriptions(params?: PaginationParams): Promise<SubscriptionsResponse> {
    const response = await apiClient.get<SubscriptionsResponse>(API_ENDPOINTS.admin.subscriptions, { params });
    return response.data;
  },

  async updateSubscription(userId: string, data: { tier: string; status?: string }): Promise<void> {
    await apiClient.put(API_ENDPOINTS.admin.updateSubscription(userId), data);
  },

  // Identifications
  async getIdentifications(params?: PaginationParams & DateRangeParams): Promise<IdentificationsResponse> {
    const response = await apiClient.get<IdentificationsResponse>(API_ENDPOINTS.admin.identifications, { params });
    return response.data;
  },

  async deleteIdentification(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.deleteIdentification(id));
  },

  // Analytics
  async getUserAnalytics(params?: DateRangeParams): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>(API_ENDPOINTS.admin.analyticsUsers, { params });
    return response.data;
  },

  async getIdentificationAnalytics(params?: DateRangeParams): Promise<IdentificationAnalytics> {
    const response = await apiClient.get<IdentificationAnalytics>(API_ENDPOINTS.admin.analyticsIdentifications, { params });
    return response.data;
  },

  async getRevenueAnalytics(params?: DateRangeParams): Promise<RevenueAnalytics> {
    const response = await apiClient.get<RevenueAnalytics>(API_ENDPOINTS.admin.analyticsRevenue, { params });
    return response.data;
  },

  async getPlanAnalytics(): Promise<PlanAnalytics> {
    const response = await apiClient.get<PlanAnalytics>(API_ENDPOINTS.admin.analyticsPlans);
    return response.data;
  },

  // Audit Logs
  async getAuditLogs(params?: PaginationParams & DateRangeParams): Promise<AuditLogsResponse> {
    const response = await apiClient.get<AuditLogsResponse>(API_ENDPOINTS.admin.auditLogs, { params });
    return response.data;
  },
};
