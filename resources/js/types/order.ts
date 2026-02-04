export type OrderCustomer = {
    id: number;
    name: string;
    email: string;
};

export type OrderListItem = {
    id: number;
    status: string;
    currency: string;
    grandTotal: number;
    itemsCount: number;
    createdAt: string | null;
    customer: OrderCustomer | null;
    paymentStatus?: string | null;
    shipmentStatus?: string | null;
    trackingNumber?: string | null;
    shipmentId?: number | null;
    shipmentProvider?: string | null;
};

export type OrderItem = {
    id: number;
    title: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    product?: {
        id: number;
        title: string;
    } | null;
};

export type OrderAddress = {
    id: number;
    type: string;
    fullName: string;
    phone?: string | null;
    country: string;
    city: string;
    district?: string | null;
    line1: string;
    line2?: string | null;
    postalCode?: string | null;
};

export type OrderPayment = {
    id: number;
    provider: string;
    status: string;
    amount: number;
    currency: string;
    conversationId?: string | null;
    transactionId?: string | null;
    createdAt?: string | null;
};

export type OrderShipment = {
    id: number;
    provider: string;
    serviceName?: string | null;
    serviceCode?: string | null;
    status: string;
    trackingNumber?: string | null;
    shippingTotal: number;
};

export type OrderDetail = {
    id: number;
    status: string;
    currency: string;
    subtotal: number;
    taxTotal: number;
    shippingTotal: number;
    grandTotal: number;
    createdAt: string | null;
    cancelledAt?: string | null;
    refundedAt?: string | null;
    cancelReason?: string | null;
    refundReason?: string | null;
    customer: OrderCustomer | null;
    items: OrderItem[];
    addresses: OrderAddress[];
    payments: OrderPayment[];
    shipments: OrderShipment[];
};
