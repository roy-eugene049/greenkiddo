import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PlatformSettings } from '../../types/admin';
import { getPlatformSettings, updatePlatformSettings, resetPlatformSettings } from '../../services/settingsService';
import {
  ArrowLeft,
  Save,
  Loader2,
  Settings as SettingsIcon,
  Globe,
  Mail,
  Bell,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().optional(),
  supportEmail: z.string().email('Invalid email'),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }),
  features: z.object({
    enableForum: z.boolean(),
    enableBlog: z.boolean(),
    enableCertificates: z.boolean(),
    enableBadges: z.boolean(),
    enableReviews: z.boolean(),
    enableNotifications: z.boolean(),
  }),
  email: z.object({
    fromName: z.string().min(1, 'From name is required'),
    fromEmail: z.string().email('Invalid email'),
    smtpHost: z.string().optional(),
    smtpPort: z.number().optional(),
    smtpUser: z.string().optional(),
    smtpPassword: z.string().optional(),
  }),
  notifications: z.object({
    emailOnSignup: z.boolean(),
    emailOnEnrollment: z.boolean(),
    emailOnCompletion: z.boolean(),
    emailOnAchievement: z.boolean(),
    emailWeeklyDigest: z.boolean(),
  }),
  maintenance: z.object({
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string().optional(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'email' | 'notifications' | 'maintenance'>('general');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getPlatformSettings();
      reset(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      await updatePlatformSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    try {
      const defaults = await resetPlatformSettings();
      reset(defaults);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Failed to reset settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const watchedFeatures = watch('features');
  const watchedMaintenance = watch('maintenance');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Platform Settings</h1>
              <p className="text-gray-400 text-lg">
                Configure platform-wide settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 overflow-x-auto">
          {([
            { id: 'general', label: 'General', icon: Globe },
            { id: 'features', label: 'Features', icon: SettingsIcon },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'text-green-ecco'
                      : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-ecco"
                  />
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Site Name *
                  </label>
                  <input
                    {...register('siteName')}
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                  {errors.siteName && (
                    <p className="text-red-400 text-xs mt-1">{errors.siteName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Site Description *
                  </label>
                  <textarea
                    {...register('siteDescription')}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  />
                  {errors.siteDescription && (
                    <p className="text-red-400 text-xs mt-1">{errors.siteDescription.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Contact Email *
                    </label>
                    <input
                      {...register('contactEmail')}
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Support Email *
                    </label>
                    <input
                      {...register('supportEmail')}
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                    {errors.supportEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.supportEmail.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Contact Phone
                  </label>
                  <input
                    {...register('contactPhone')}
                    type="tel"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Social Media Links
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] as const).map((platform) => (
                      <div key={platform}>
                        <label className="block text-xs text-gray-400 mb-1 capitalize">
                          {platform}
                        </label>
                        <input
                          {...register(`socialLinks.${platform}`)}
                          type="url"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco text-sm"
                          placeholder={`https://${platform}.com/...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6">Feature Toggles</h2>
              
              <div className="space-y-4">
                {([
                  { key: 'enableForum', label: 'Community Forum', description: 'Enable the community forum feature' },
                  { key: 'enableBlog', label: 'Blog', description: 'Enable blog posts and articles' },
                  { key: 'enableCertificates', label: 'Certificates', description: 'Enable certificate generation' },
                  { key: 'enableBadges', label: 'Badges & Achievements', description: 'Enable badge and achievement system' },
                  { key: 'enableReviews', label: 'Course Reviews', description: 'Enable course reviews and ratings' },
                  { key: 'enableNotifications', label: 'Notifications', description: 'Enable in-app notifications' },
                ] as const).map((feature) => (
                  <label
                    key={feature.key}
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      {...register(`features.${feature.key}`)}
                      className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-900 text-green-ecco focus:ring-green-ecco"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{feature.label}</div>
                      <div className="text-sm text-gray-400">{feature.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6">Email Configuration</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      From Name *
                    </label>
                    <input
                      {...register('email.fromName')}
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                    {errors.email?.fromName && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.fromName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      From Email *
                    </label>
                    <input
                      {...register('email.fromEmail')}
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                    {errors.email?.fromEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.fromEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Host
                    </label>
                    <input
                      {...register('email.smtpHost')}
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Port
                    </label>
                    <input
                      {...register('email.smtpPort', { valueAsNumber: true })}
                      type="number"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Username
                    </label>
                    <input
                      {...register('email.smtpUser')}
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Password
                    </label>
                    <input
                      {...register('email.smtpPassword')}
                      type="password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6">Email Notifications</h2>
              
              <div className="space-y-4">
                {([
                  { key: 'emailOnSignup', label: 'Welcome Email', description: 'Send email when new users sign up' },
                  { key: 'emailOnEnrollment', label: 'Enrollment Confirmation', description: 'Send email when users enroll in courses' },
                  { key: 'emailOnCompletion', label: 'Course Completion', description: 'Send email when users complete courses' },
                  { key: 'emailOnAchievement', label: 'Achievement Unlocked', description: 'Send email when users earn achievements' },
                  { key: 'emailWeeklyDigest', label: 'Weekly Digest', description: 'Send weekly summary email to users' },
                ] as const).map((notification) => (
                  <label
                    key={notification.key}
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      {...register(`notifications.${notification.key}`)}
                      className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-900 text-green-ecco focus:ring-green-ecco"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{notification.label}</div>
                      <div className="text-sm text-gray-400">{notification.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Maintenance */}
          {activeTab === 'maintenance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6">Maintenance Mode</h2>
              
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    {...register('maintenance.maintenanceMode')}
                    className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-900 text-green-ecco focus:ring-green-ecco"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Enable Maintenance Mode</div>
                    <div className="text-sm text-gray-400">
                      When enabled, only admins can access the platform
                    </div>
                  </div>
                </label>

                {watchedMaintenance?.maintenanceMode && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      {...register('maintenance.maintenanceMessage')}
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                      placeholder="We're currently performing maintenance. Please check back soon!"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-green-ecco text-sm">Settings saved!</span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;

