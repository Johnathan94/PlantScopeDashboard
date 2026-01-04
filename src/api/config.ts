// API Configuration for PlantScope Backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://leafy.geekbug.dev/api';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/Auth/login',
    signup: '/Auth/signup',
    refresh: '/Auth/refresh',
    logout: '/Auth/logout',
    me: '/Auth/me',
  },

  // Admin Dashboard
  admin: {
    dashboardStats: '/Admin/dashboard/stats',
    dashboardHealth: '/Admin/dashboard/health',

    // User Management
    users: '/Admin/users',
    userById: (id: string) => `/Admin/users/${id}`,
    assignRole: (id: string) => `/Admin/users/${id}/role`,
    removeRole: (id: string, role: string) => `/Admin/users/${id}/role/${role}`,

    // Subscriptions
    subscriptions: '/Admin/subscriptions',
    updateSubscription: (userId: string) => `/Admin/subscriptions/${userId}`,

    // Identifications
    identifications: '/Admin/identifications',
    deleteIdentification: (id: string) => `/Admin/identifications/${id}`,

    // Analytics
    analyticsUsers: '/Admin/analytics/users',
    analyticsIdentifications: '/Admin/analytics/identifications',
    analyticsRevenue: '/Admin/analytics/revenue',
    analyticsPlans: '/Admin/analytics/plans',

    // Audit Logs
    auditLogs: '/Admin/audit-logs',
  },

  // Subscription Plans
  subscription: {
    plans: '/Subscription/plans',
    status: '/Subscription/status',
    checkout: '/Subscription/checkout',
    verifySession: '/Subscription/verify-session',
    cancel: '/Subscription/cancel',
    reactivate: '/Subscription/reactivate',
    portal: '/Subscription/portal',
  },

  // Plant Identification
  plant: {
    identify: '/Plant/identify',
    usage: '/Plant/usage',
    history: '/Plant/history',
  },

  // User Plants (My Plants)
  myPlants: {
    list: '/MyPlants',
    add: '/MyPlants',
    getById: (id: string) => `/MyPlants/${id}`,
    update: (id: string) => `/MyPlants/${id}`,
    delete: (id: string) => `/MyPlants/${id}`,
    fromIdentification: (identificationId: string) => `/MyPlants/from-identification/${identificationId}`,
    logCare: (id: string) => `/MyPlants/${id}/care`,
    quickWater: (id: string) => `/MyPlants/${id}/water`,
    careHistory: (id: string) => `/MyPlants/${id}/care-history`,
    limit: '/MyPlants/limit',
  },

  // Collections
  collections: {
    list: '/Collections',
    create: '/Collections',
    getById: (id: string) => `/Collections/${id}`,
    update: (id: string) => `/Collections/${id}`,
    delete: (id: string) => `/Collections/${id}`,
    plants: '/Collections/plants',
    addPlant: '/Collections/plants',
    updatePlantNotes: (id: string) => `/Collections/plants/${id}`,
    removePlant: (id: string) => `/Collections/plants/${id}`,
    movePlant: (id: string) => `/Collections/plants/${id}/move`,
  },

  // Care Schedules
  care: {
    summary: '/care/summary',
    today: '/care/today',
    upcoming: '/care/upcoming',
    overdue: '/care/overdue',
    complete: (scheduleId: string) => `/care/${scheduleId}/complete`,
    snooze: (scheduleId: string) => `/care/${scheduleId}/snooze`,
    update: (scheduleId: string) => `/care/${scheduleId}`,
    delete: (scheduleId: string) => `/care/${scheduleId}`,
    byPlant: (plantId: string) => `/care/plant/${plantId}`,
    addSchedule: (plantId: string) => `/care/plant/${plantId}`,
  },

  // Diagnostic (Plant Health)
  diagnostic: {
    analyze: '/Diagnostic/analyze',
    history: (plantId: string) => `/Diagnostic/history/${plantId}`,
    trends: (plantId: string) => `/Diagnostic/trends/${plantId}`,
    snapshot: (snapshotId: string) => `/Diagnostic/snapshot/${snapshotId}`,
    compare: '/Diagnostic/compare',
    access: '/Diagnostic/access',
  },

  // Notifications
  notification: {
    register: '/Notification/register',
    unregister: '/Notification/unregister',
    devices: '/Notification/devices',
    preferences: '/Notification/preferences',
  },

  // Settings
  settings: {
    profile: '/Settings/profile',
    password: '/Settings/password',
    notifications: '/Settings/notifications',
    export: '/Settings/export',
    deleteAccount: '/Settings/account',
  },

  // Password Reset
  passwordReset: {
    requestOtp: '/PasswordReset/request-otp',
    verifyOtp: '/PasswordReset/verify-otp',
    resetPassword: '/PasswordReset/reset-password',
  },

  // Payment
  payment: {
    createCheckoutSession: '/Payment/create-checkout-session',
    webhook: '/Payment/webhook',
  },

  // Stripe Setup
  stripe: {
    config: '/stripe/config',
    setup: '/stripe/setup',
  },

  // Contact
  contact: '/Contact',

  // System Health & Status
  system: {
    status: '/Status',
    health: '/health',
  },
};
