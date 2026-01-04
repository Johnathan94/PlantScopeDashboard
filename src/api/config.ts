// API Configuration for PlantScope Backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },

  // Admin Dashboard
  admin: {
    dashboardStats: '/admin/dashboard/stats',
    dashboardHealth: '/admin/dashboard/health',

    // User Management
    users: '/admin/users',
    userById: (id: string) => `/admin/users/${id}`,
    assignRole: (id: string) => `/admin/users/${id}/role`,
    removeRole: (id: string, role: string) => `/admin/users/${id}/role/${role}`,

    // Subscriptions
    subscriptions: '/admin/subscriptions',
    updateSubscription: (userId: string) => `/admin/subscriptions/${userId}`,

    // Identifications
    identifications: '/admin/identifications',
    deleteIdentification: (id: string) => `/admin/identifications/${id}`,

    // Analytics
    analyticsUsers: '/admin/analytics/users',
    analyticsIdentifications: '/admin/analytics/identifications',
    analyticsRevenue: '/admin/analytics/revenue',
    analyticsPlans: '/admin/analytics/plans',

    // Audit Logs
    auditLogs: '/admin/audit-logs',
  },

  // Subscription Plans
  subscription: {
    plans: '/subscription/plans',
    status: '/subscription/status',
  },

  // System
  system: {
    status: '/status',
    health: '/health',
  },

  // Contact
  contact: '/contact',
};
