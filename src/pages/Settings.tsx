import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  Settings as SettingsIcon,
  Bell,
  User,
  Shield,
  Mail,
  Moon,
  Globe,
  Save,
  Check
} from 'lucide-react';

const Settings = () => {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    weeklyDigest: false,
    quizReminders: true
  });

  // Learning Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'dark',
    autoPlay: false,
    playbackSpeed: 1.0,
    showSubtitles: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowMessages: true
  });

  const handleSave = async () => {
    setSaving(true);
    // In real app, this would save to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-green-ecco" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Manage your account preferences and settings
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky top-4 z-10 mb-6"
        >
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                transition-colors
                ${
                  saved
                    ? 'bg-green-ecco text-black'
                    : saving
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-green-ecco text-black hover:bg-green-300'
                }
              `}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Account Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-green-ecco" />
              <h2 className="text-2xl font-bold">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{user?.primaryEmailAddress?.emailAddress}</span>
                  {user?.hasVerifiedEmailAddress && (
                    <span className="text-xs bg-green-ecco/20 text-green-ecco px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Account Created</label>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Notification Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-green-ecco" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Course Updates</h3>
                  <p className="text-sm text-gray-400">Get notified about new lessons and content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.courseUpdates}
                    onChange={() => handleNotificationChange('courseUpdates')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Achievement Alerts</h3>
                  <p className="text-sm text-gray-400">Celebrate when you earn badges and certificates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.achievementAlerts}
                    onChange={() => handleNotificationChange('achievementAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Weekly Digest</h3>
                  <p className="text-sm text-gray-400">Receive a weekly summary of your progress</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={() => handleNotificationChange('weeklyDigest')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Quiz Reminders</h3>
                  <p className="text-sm text-gray-400">Reminders to complete pending quizzes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.quizReminders}
                    onChange={() => handleNotificationChange('quizReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Learning Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-green-ecco" />
              <h2 className="text-2xl font-bold">Learning Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Auto-play Next Lesson</h3>
                  <p className="text-sm text-gray-400">Automatically start the next lesson when current one ends</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoPlay}
                    onChange={() => handlePreferenceChange('autoPlay', !preferences.autoPlay)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Video Playback Speed: {preferences.playbackSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={preferences.playbackSpeed}
                  onChange={(e) => handlePreferenceChange('playbackSpeed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-ecco"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>1.5x</span>
                  <span>2x</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Show Subtitles</h3>
                  <p className="text-sm text-gray-400">Display subtitles for video lessons</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.showSubtitles}
                    onChange={() => handlePreferenceChange('showSubtitles', !preferences.showSubtitles)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Privacy Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-ecco" />
              <h2 className="text-2xl font-bold">Privacy</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Profile Visibility</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Control who can see your profile and achievements
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Show Progress</h3>
                  <p className="text-sm text-gray-400">Display your learning progress publicly</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showProgress}
                    onChange={() => handlePrivacyChange('showProgress', !privacy.showProgress)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Show Achievements</h3>
                  <p className="text-sm text-gray-400">Display your badges and certificates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showAchievements}
                    onChange={() => handlePrivacyChange('showAchievements', !privacy.showAchievements)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Allow Messages</h3>
                  <p className="text-sm text-gray-400">Let other users send you messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-ecco/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-ecco"></div>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-red-500">Danger Zone</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <h3 className="font-semibold mb-2">Delete Account</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

