export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyStats {
  month: string;
  totalBookings: number;
  totalRevenue: number;
  completedBookings: number;
  pendingBookings: number;
}

export interface DashboardData {
  monthlyStats: MonthlyStats[];
  recentBookings: Booking[];
  totalBookings: number;
  completedBookings: number;
} 