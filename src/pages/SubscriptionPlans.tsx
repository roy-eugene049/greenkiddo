import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Check, Crown, Zap, Building2, CreditCard } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SubscriptionPlan, Subscription } from '../types/payment';
import { getSubscriptionPlans, getSubscriptions, createSubscription } from '../services/paymentService';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [plansData, subscriptions] = await Promise.all([
          getSubscriptionPlans(),
          getSubscriptions(user.id),
        ]);
        setPlans(plansData.filter(p => p.isActive));
        setUserSubscriptions(subscriptions);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    
    setSelectedPlan(planId);
    // In a real app, this would redirect to payment page
    // For now, we'll show an alert
    alert(`Redirecting to payment for ${plans.find(p => p.id === planId)?.name} plan...`);
    // navigate(`/dashboard/payment?plan=${planId}`);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getPlanIcon = (planId: string) => {
    if (planId.includes('basic')) return Zap;
    if (planId.includes('pro')) return Crown;
    if (planId.includes('enterprise')) return Building2;
    return CreditCard;
  };

  const isUserSubscribed = (planId: string) => {
    return userSubscriptions.some(s => s.planId === planId && s.status === 'active');
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Please sign in to view subscription plans</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading subscription plans...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the perfect subscription plan for your learning journey. All plans include access to our community and basic features.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.id);
            const isSubscribed = isUserSubscribed(plan.id);
            const isPopular = plan.isPopular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-900 border rounded-lg p-8 ${
                  isPopular
                    ? 'border-green-ecco scale-105'
                    : 'border-gray-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-ecco text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${
                    isPopular ? 'bg-green-ecco/20' : 'bg-gray-800'
                  }`}>
                    <Icon className={`w-6 h-6 ${isPopular ? 'text-green-ecco' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-400">/{plan.billingCycle}</span>
                  </div>
                  {plan.billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-400 mt-1">
                      Save {Math.round((1 - (plan.price / (plan.price * 12))) * 100)}% vs monthly
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-ecco flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.maxCourses && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-ecco flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Up to {plan.maxCourses} courses</span>
                    </li>
                  )}
                  {plan.prioritySupport && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-ecco flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Priority support</span>
                    </li>
                  )}
                </ul>

                {isSubscribed ? (
                  <button
                    disabled
                    className="w-full bg-gray-800 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                      isPopular
                        ? 'bg-green-ecco text-black hover:bg-green-300'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Current Subscriptions */}
        {userSubscriptions.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Active Subscriptions</h2>
            <div className="space-y-4">
              {userSubscriptions
                .filter(s => s.status === 'active')
                .map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-white">{subscription.plan.name}</h3>
                      <p className="text-sm text-gray-400">
                        Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(subscription.plan.price, subscription.plan.currency)}/{subscription.plan.billingCycle}
                      </p>
                      <button
                        onClick={() => {
                          // Cancel subscription
                          alert('Cancel subscription functionality coming soon!');
                        }}
                        className="text-sm text-red-400 hover:text-red-300 mt-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPlans;

