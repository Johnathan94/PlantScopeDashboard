export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  recentActivity: number;
}
