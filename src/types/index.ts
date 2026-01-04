// Re-export API types
export type {
  DashboardStats,
  SystemHealth,
  AdminUser,
  UsersResponse,
  UpdateUserRequest,
  AdminSubscription,
  SubscriptionsResponse,
  AdminIdentification,
  IdentificationsResponse,
  UserAnalytics,
  IdentificationAnalytics,
  RevenueAnalytics,
  PlanAnalytics,
  AuditLog,
  AuditLogsResponse,
  PaginationParams,
  DateRangeParams,
} from '../api/services/admin.service';

export type {
  LoginRequest,
  LoginResponse,
  UserProfile,
} from '../api/services/auth.service';

// Legacy types for backward compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface DataItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultRole: 'editor' | 'viewer';
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

// Subscription tier types
export type SubscriptionTier = 'Seedling' | 'Gardener' | 'Botanist';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  identificationsPerWeek: number;
  plantLimit: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'Seedling',
    name: 'Seedling (Free)',
    price: 0,
    identificationsPerWeek: 3,
    plantLimit: 5,
    features: ['3 plant identifications per week', 'Up to 5 plants', 'Basic care reminders'],
  },
  {
    tier: 'Gardener',
    name: 'Gardener',
    price: 4.99,
    identificationsPerWeek: 20,
    plantLimit: 25,
    features: ['20 plant identifications per week', 'Up to 25 plants', 'Advanced care schedules', 'Plant health diagnostics'],
  },
  {
    tier: 'Botanist',
    name: 'Botanist',
    price: 9.99,
    identificationsPerWeek: 80,
    plantLimit: 100,
    features: ['80 plant identifications per week', 'Up to 100 plants', 'Priority support', 'Export data', 'All features'],
  },
];
