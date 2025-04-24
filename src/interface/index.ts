export interface Plan {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  icon: React.ReactNode;
  bgGradient: string;
  recommended: boolean;
  priceId: {
    monthly: string;
    annual: string;
  };
}

export interface ConnectionStatusProps {
  connected: boolean;
}

export interface Instance {
  id: string;
  instanceName: string;
  connectionStatus: "OPEN" | "CLOSED";
  profilePicUrl?: string;
  profileName?: string;
  phoneNumber?: string;
}

export interface Payment {
  dueDate: string;
  status: "pending" | "overdue" | "completed";
  amount: number;
}

export interface DashboardData {
  totalUsers: number;
  totalRevenue: number;
  revenueWithDiscount: number;
  overduePayments: number;
  completedPayments: number;
  pendingPaymentsTotal: number;
  usersWithDuePayments: Array<{
    userId: string;
    userName: string;
    dueAmount: number;
    dueDate: string;
  }>;
}

export interface DecodedToken {
  id: string;
  role?: string;
  profile?: string;
  iat: number;
  exp: number;
}

export interface AffiliateDashboardData {
  totalReferrals: number;
  totalEarnings: number;
  pendingPayments: number;
  referredUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    createdAt: string;
    payments: Array<{
      amount: number;
      status: string;
      dueDate: string;
    }>;
  }>;
}

export interface EditPaymentModalProps {
  payment: Payment;
  onClose: () => void;
  onSave: (paymentId: string, updatedData: Partial<Payment>) => Promise<void>;
}

export interface Affiliate {
  id: string;
  name: string;
}

export interface LeadStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number | null;
}

export interface UserPlan {
  maxLeads: number;
  maxCampaigns: number;
  features: string[];
  name: string;
  price: number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface User {
  affiliate: any;
  id: string;
  name: string;
  email: string;
  profile: string;
  plan: string;
  companyId?: string;
  payments: Payment[];
}

export interface LoginResponse {
  user: User;
  token: string;
  planStatus?: {
    plan: string;
    isTrialExpired: boolean;
    hasActiveSubscription: boolean;
    status: "active" | "expired" | "trial";
  };
}
