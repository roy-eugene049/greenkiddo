export interface CoursePricing {
  courseId: string;
  courseTitle: string;
  basePrice: number;
  currency: string;
  isFree: boolean;
  discountPrice?: number;
  discountPercentage?: number;
  discountExpiresAt?: string;
  subscriptionRequired?: boolean;
  subscriptionPlanId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  maxCourses?: number;
  maxStorage?: number; // in MB
  prioritySupport: boolean;
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_account';
  provider: 'stripe' | 'paypal';
  last4?: string; // For cards
  brand?: string; // Visa, Mastercard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingDetails?: {
    name: string;
    email: string;
    address?: Address;
  };
  createdAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Payment {
  id: string;
  userId: string;
  type: 'course' | 'subscription' | 'renewal';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethodId: string;
  courseId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  couponCode?: string;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  paymentId: string;
  type: 'course' | 'subscription' | 'renewal';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: string;
  paidAt?: string;
  billingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  courseId?: string;
  subscriptionId?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  trialEndsAt?: string;
  paymentMethodId: string;
  nextBillingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount';
  value: number; // Percentage (0-100) or fixed amount
  currency?: string; // For fixed amount
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableTo: 'all' | 'courses' | 'subscriptions' | 'specific';
  courseIds?: string[];
  subscriptionPlanIds?: string[];
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  processedBy?: {
    id: string;
    name: string;
  };
}

export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'course' | 'subscription';
  courseId?: string;
  subscriptionPlanId?: string;
  couponCode?: string;
  clientSecret?: string; // For Stripe
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

export interface PaymentHistory {
  payments: Payment[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  refunds: Refund[];
  totalSpent: number;
  totalRefunded: number;
  currency: string;
}

