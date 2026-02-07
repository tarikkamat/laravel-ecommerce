export interface DashboardKpis {
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    monthRevenue: number;
    avgOrderValue: number;
    customers: number;
}

export interface DashboardMonthlySales {
    month: string;
    orders: number;
    revenue: number;
}

export interface DashboardTopProduct {
    productId: number | null;
    title: string;
    qty: number;
    revenue: number;
}

export interface DashboardViewedProduct {
    id: number;
    title: string;
    views: number;
}

export interface DashboardOrdersByRegion {
    city: string;
    district: string | null;
    orders: number;
}

export interface DashboardOrdersByCustomer {
    userId: number | null;
    name: string;
    orders: number;
    revenue: number;
}

export interface DashboardData {
    kpis: DashboardKpis;
    monthlySales: DashboardMonthlySales[];
    topSellingProducts: DashboardTopProduct[];
    topViewedProducts: DashboardViewedProduct[];
    ordersByRegion: DashboardOrdersByRegion[];
    ordersByCustomer: DashboardOrdersByCustomer[];
}
