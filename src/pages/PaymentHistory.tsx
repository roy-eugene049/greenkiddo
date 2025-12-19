import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { CreditCard, Download, Receipt, RefreshCw, Calendar, DollarSign } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PaymentHistory as PaymentHistoryType, Payment, Invoice, Refund, Subscription } from '../types/payment';
import { getPaymentHistory } from '../services/paymentService';
import { motion } from 'framer-motion';

const PaymentHistory = () => {
  const { user } = useUser();
  const [history, setHistory] = useState<PaymentHistoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions' | 'invoices' | 'refunds'>('payments');

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getPaymentHistory(user.id);
        setHistory(data);
      } catch (error) {
        console.error('Error loading payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Please sign in to view payment history</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading payment history...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!history) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Failed to load payment history</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-green-ecco" />
            Payment History
          </h1>
          <p className="text-gray-400 text-lg">View all your transactions, subscriptions, and invoices</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Total Spent</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(history.totalSpent, history.currency)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Total Refunded</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(history.totalRefunded, history.currency)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Invoices</span>
            </div>
            <p className="text-2xl font-bold">{history.invoices.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {[
            { id: 'payments', label: 'Payments', count: history.payments.length },
            { id: 'subscriptions', label: 'Subscriptions', count: history.subscriptions.length },
            { id: 'invoices', label: 'Invoices', count: history.invoices.length },
            { id: 'refunds', label: 'Refunds', count: history.refunds.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-green-ecco text-green-ecco'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-800 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {history.payments.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No payments yet</p>
              </div>
            ) : (
              history.payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} formatCurrency={formatCurrency} />
              ))
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {history.subscriptions.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active subscriptions</p>
              </div>
            ) : (
              history.subscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} formatCurrency={formatCurrency} />
              ))
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {history.invoices.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No invoices yet</p>
              </div>
            ) : (
              history.invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} formatCurrency={formatCurrency} />
              ))
            )}
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <div className="space-y-4">
            {history.refunds.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <RefreshCw className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No refunds yet</p>
              </div>
            ) : (
              history.refunds.map((refund) => (
                <RefundCard key={refund.id} refund={refund} formatCurrency={formatCurrency} />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const PaymentCard = ({ payment, formatCurrency }: { payment: Payment; formatCurrency: (amount: number, currency?: string) => string }) => {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'refunded':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{payment.description}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
            {payment.couponCode && <p>Coupon: {payment.couponCode}</p>}
            {payment.discountAmount && <p>Discount: {formatCurrency(payment.discountAmount, payment.currency)}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatCurrency(payment.totalAmount, payment.currency)}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>
    </motion.div>
  );
};

const SubscriptionCard = ({ subscription, formatCurrency }: { subscription: Subscription; formatCurrency: (amount: number, currency?: string) => string }) => {
  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'trialing':
        return 'bg-blue-500/20 text-blue-400';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
      case 'expired':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{subscription.plan.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-2">{subscription.plan.description}</p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Billing: {subscription.plan.billingCycle}</p>
            <p>Current period: {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
            {subscription.nextBillingDate && (
              <p>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatCurrency(subscription.plan.price, subscription.plan.currency)}</p>
          <p className="text-xs text-gray-400">per {subscription.plan.billingCycle}</p>
        </div>
      </div>
    </motion.div>
  );
};

const InvoiceCard = ({ invoice, formatCurrency }: { invoice: Invoice; formatCurrency: (amount: number, currency?: string) => string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">Invoice {invoice.invoiceNumber}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {invoice.status}
            </span>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            {invoice.paidAt && <p>Paid: {new Date(invoice.paidAt).toLocaleDateString()}</p>}
            {invoice.dueDate && <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>}
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={() => {
              // Download invoice
              alert('Invoice download coming soon!');
            }}
            className="mb-2 flex items-center gap-2 text-green-ecco hover:text-green-300 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <p className="text-2xl font-bold text-white">{formatCurrency(invoice.total, invoice.currency)}</p>
        </div>
      </div>
    </motion.div>
  );
};

const RefundCard = ({ refund, formatCurrency }: { refund: Refund; formatCurrency: (amount: number, currency?: string) => string }) => {
  const getStatusColor = (status: Refund['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">Refund #{refund.id.slice(-8)}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(refund.status)}`}>
              {refund.status}
            </span>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Reason: {refund.reason}</p>
            <p>Requested: {new Date(refund.requestedAt).toLocaleDateString()}</p>
            {refund.processedAt && <p>Processed: {new Date(refund.processedAt).toLocaleDateString()}</p>}
            {refund.rejectionReason && <p className="text-red-400">Rejected: {refund.rejectionReason}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatCurrency(refund.amount, refund.currency)}</p>
          <p className="text-xs text-gray-400">Refunded</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentHistory;

