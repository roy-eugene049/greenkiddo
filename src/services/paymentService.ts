import {
  CoursePricing,
  SubscriptionPlan,
  Payment,
  PaymentMethod,
  Invoice,
  Subscription,
  Coupon,
  Refund,
  PaymentIntent,
  PaymentHistory,
} from '../types/payment';

const STORAGE_KEY_PREFIX = 'greenkiddo_payment_';

/**
 * Payment Provider Interface
 * This allows switching between Stripe, PayPal, etc.
 */
export interface PaymentProvider {
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<Payment>;
  refundPayment(paymentId: string, amount?: number, reason?: string): Promise<Refund>;
  savePaymentMethod(userId: string, paymentMethodData: any): Promise<PaymentMethod>;
  deletePaymentMethod(paymentMethodId: string): Promise<void>;
}

/**
 * Mock Payment Provider (for development)
 * In production, this would be Stripe or PayPal
 */
class MockPaymentProvider implements PaymentProvider {
  async createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: metadata?.userId || '',
      amount,
      currency,
      type: metadata?.type || 'course',
      courseId: metadata?.courseId,
      subscriptionPlanId: metadata?.subscriptionPlanId,
      couponCode: metadata?.couponCode,
      status: 'requires_payment_method',
      clientSecret: `mock_secret_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const intent = await this.getPaymentIntent(paymentIntentId);
    if (!intent) throw new Error('Payment intent not found');

    const payment: Payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: intent.userId,
      type: intent.type,
      amount: intent.amount,
      currency: intent.currency,
      status: 'succeeded',
      paymentMethodId,
      courseId: intent.courseId,
      subscriptionId: intent.subscriptionPlanId,
      couponCode: intent.couponCode,
      totalAmount: intent.amount,
      description: intent.type === 'course' ? 'Course purchase' : 'Subscription',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Save payment
    const payments = await getPayments(intent.userId);
    payments.push(payment);
    const key = `${STORAGE_KEY_PREFIX}payments_${intent.userId}`;
    localStorage.setItem(key, JSON.stringify(payments));

    return payment;
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<Refund> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find payment
    const keys = Object.keys(localStorage);
    let payment: Payment | null = null;
    let userId = '';

    for (const key of keys) {
      if (key.startsWith(`${STORAGE_KEY_PREFIX}payments_`)) {
        const payments: Payment[] = JSON.parse(localStorage.getItem(key) || '[]');
        const found = payments.find(p => p.id === paymentId);
        if (found) {
          payment = found;
          userId = key.replace(`${STORAGE_KEY_PREFIX}payments_`, '');
          break;
        }
      }
    }

    if (!payment) throw new Error('Payment not found');

    const refund: Refund = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentId,
      userId,
      amount: amount || payment.totalAmount,
      currency: payment.currency,
      reason: reason || 'Customer request',
      status: 'completed',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };

    // Save refund
    const refunds = await getRefunds(userId);
    refunds.push(refund);
    const key = `${STORAGE_KEY_PREFIX}refunds_${userId}`;
    localStorage.setItem(key, JSON.stringify(refunds));

    // Update payment status
    payment.status = 'refunded';
    payment.refundedAt = new Date().toISOString();
    const payments = await getPayments(userId);
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex >= 0) {
      payments[paymentIndex] = payment;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}payments_${userId}`, JSON.stringify(payments));
    }

    return refund;
  }

  async savePaymentMethod(userId: string, paymentMethodData: any): Promise<PaymentMethod> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const method: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: paymentMethodData.type || 'card',
      provider: 'stripe',
      last4: paymentMethodData.last4,
      brand: paymentMethodData.brand,
      expiryMonth: paymentMethodData.expiryMonth,
      expiryYear: paymentMethodData.expiryYear,
      isDefault: false,
      billingDetails: paymentMethodData.billingDetails,
      createdAt: new Date().toISOString(),
    };

    const methods = await getPaymentMethods(userId);
    if (method.isDefault) {
      methods.forEach(m => m.isDefault = false);
    }
    methods.push(method);
    const key = `${STORAGE_KEY_PREFIX}methods_${userId}`;
    localStorage.setItem(key, JSON.stringify(methods));

    return method;
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(`${STORAGE_KEY_PREFIX}methods_`)) {
        const methods: PaymentMethod[] = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = methods.filter(m => m.id !== paymentMethodId);
        localStorage.setItem(key, JSON.stringify(filtered));
        break;
      }
    }
  }

  private async getPaymentIntent(id: string): Promise<PaymentIntent | null> {
    const key = `${STORAGE_KEY_PREFIX}intents`;
    const stored = localStorage.getItem(key);
    const intents: PaymentIntent[] = stored ? JSON.parse(stored) : [];
    return intents.find(i => i.id === id) || null;
  }
}

// Initialize payment provider (would be Stripe/PayPal in production)
let paymentProvider: PaymentProvider = new MockPaymentProvider();

export const setPaymentProvider = (provider: PaymentProvider) => {
  paymentProvider = provider;
};

/**
 * Get course pricing
 */
export const getCoursePricing = async (courseId: string): Promise<CoursePricing | null> => {
  const key = `${STORAGE_KEY_PREFIX}pricing_${courseId}`;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);

  // Default: free course
  return {
    courseId,
    courseTitle: 'Course',
    basePrice: 0,
    currency: 'USD',
    isFree: true,
  };
};

/**
 * Set course pricing
 */
export const setCoursePricing = async (pricing: CoursePricing): Promise<void> => {
  const key = `${STORAGE_KEY_PREFIX}pricing_${pricing.courseId}`;
  localStorage.setItem(key, JSON.stringify(pricing));
};

/**
 * Get subscription plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const key = `${STORAGE_KEY_PREFIX}subscription_plans`;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);

  // Default plans
  const defaultPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for getting started',
      price: 9.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: ['Access to free courses', 'Community forum', 'Basic support'],
      maxCourses: 5,
      prioritySupport: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Best for serious learners',
      price: 19.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: ['All courses', 'Priority support', 'Certificates', 'Advanced analytics'],
      prioritySupport: true,
      isPopular: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams and organizations',
      price: 49.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: ['Everything in Pro', 'Team management', 'Custom branding', 'Dedicated support'],
      prioritySupport: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(key, JSON.stringify(defaultPlans));
  return defaultPlans;
};

/**
 * Get user's subscriptions
 */
export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
  const key = `${STORAGE_KEY_PREFIX}subscriptions_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Create subscription
 */
export const createSubscription = async (
  userId: string,
  planId: string,
  paymentMethodId: string
): Promise<Subscription> => {
  const plans = await getSubscriptionPlans();
  const plan = plans.find(p => p.id === planId);
  if (!plan) throw new Error('Plan not found');

  const now = new Date();
  const periodEnd = new Date(now);
  if (plan.billingCycle === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else if (plan.billingCycle === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  const subscription: Subscription = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    planId,
    plan,
    status: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethodId,
    nextBillingDate: periodEnd.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const subscriptions = await getSubscriptions(userId);
  subscriptions.push(subscription);
  const key = `${STORAGE_KEY_PREFIX}subscriptions_${userId}`;
  localStorage.setItem(key, JSON.stringify(subscriptions));

  return subscription;
};

/**
 * Get payment methods
 */
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const key = `${STORAGE_KEY_PREFIX}methods_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get payments
 */
export const getPayments = async (userId: string): Promise<Payment[]> => {
  const key = `${STORAGE_KEY_PREFIX}payments_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get invoices
 */
export const getInvoices = async (userId: string): Promise<Invoice[]> => {
  const key = `${STORAGE_KEY_PREFIX}invoices_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get refunds
 */
export const getRefunds = async (userId: string): Promise<Refund[]> => {
  const key = `${STORAGE_KEY_PREFIX}refunds_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get coupons
 */
export const getCoupons = async (): Promise<Coupon[]> => {
  const key = `${STORAGE_KEY_PREFIX}coupons`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Validate coupon
 */
export const validateCoupon = async (code: string, amount: number, type: 'course' | 'subscription'): Promise<Coupon | null> => {
  const coupons = await getCoupons();
  const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
  
  if (!coupon) return null;
  
  const now = new Date();
  if (new Date(coupon.validFrom) > now) return null;
  if (coupon.validUntil && new Date(coupon.validUntil) < now) return null;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;
  if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) return null;
  
  if (coupon.applicableTo === 'courses' && type !== 'course') return null;
  if (coupon.applicableTo === 'subscriptions' && type !== 'subscription') return null;
  
  return coupon;
};

/**
 * Process payment
 */
export const processPayment = async (
  userId: string,
  amount: number,
  currency: string,
  paymentMethodId: string,
  type: 'course' | 'subscription',
  courseId?: string,
  subscriptionPlanId?: string,
  couponCode?: string
): Promise<Payment> => {
  // Validate coupon if provided
  let discountAmount = 0;
  let coupon: Coupon | null = null;
  
  if (couponCode) {
    coupon = await validateCoupon(couponCode, amount, type);
    if (coupon) {
      if (coupon.type === 'percentage') {
        discountAmount = (amount * coupon.value) / 100;
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      } else {
        discountAmount = coupon.value;
      }
    }
  }

  const finalAmount = amount - discountAmount;
  
  // Create payment intent
  const intent = await paymentProvider.createPaymentIntent(finalAmount, currency, {
    userId,
    type,
    courseId,
    subscriptionPlanId,
    couponCode,
  });

  // Confirm payment
  const payment = await paymentProvider.confirmPayment(intent.id, paymentMethodId);
  
  // Update coupon usage
  if (coupon) {
    coupon.usedCount += 1;
    const coupons = await getCoupons();
    const index = coupons.findIndex(c => c.id === coupon!.id);
    if (index >= 0) {
      coupons[index] = coupon;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}coupons`, JSON.stringify(coupons));
    }
  }

  // Generate invoice
  await generateInvoice(payment, discountAmount);

  return payment;
};

/**
 * Generate invoice
 */
export const generateInvoice = async (payment: Payment, discountAmount: number = 0): Promise<Invoice> => {
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const invoice: Invoice = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payment.userId,
    invoiceNumber,
    paymentId: payment.id,
    type: payment.type,
    items: [{
      description: payment.description,
      quantity: 1,
      unitPrice: payment.amount,
      total: payment.amount,
      courseId: payment.courseId,
      subscriptionId: payment.subscriptionId,
    }],
    subtotal: payment.amount,
    discount: discountAmount,
    tax: payment.taxAmount || 0,
    total: payment.totalAmount,
    currency: payment.currency,
    status: 'paid',
    paidAt: payment.completedAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const invoices = await getInvoices(payment.userId);
  invoices.push(invoice);
  const key = `${STORAGE_KEY_PREFIX}invoices_${payment.userId}`;
  localStorage.setItem(key, JSON.stringify(invoices));

  return invoice;
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (userId: string): Promise<PaymentHistory> => {
  const [payments, subscriptions, invoices, refunds] = await Promise.all([
    getPayments(userId),
    getSubscriptions(userId),
    getInvoices(userId),
    getRefunds(userId),
  ]);

  const totalSpent = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.totalAmount, 0);
  
  const totalRefunded = refunds
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    payments,
    subscriptions,
    invoices,
    refunds,
    totalSpent,
    totalRefunded,
    currency: 'USD',
  };
};

