import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { getInstallPrompt, BeforeInstallPromptEvent, isInstalled } from '../../services/pwaService';

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled()) {
      return;
    }

    // Check if user has dismissed before
    const dismissedBefore = localStorage.getItem('pwa-install-dismissed');
    if (dismissedBefore) {
      const dismissedTime = parseInt(dismissedBefore);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Get install prompt
    getInstallPrompt().then((prompt) => {
      if (prompt) {
        setInstallPrompt(prompt);
        // Show prompt after a delay
        setTimeout(() => setShowPrompt(true), 3000);
      }
    });
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setShowPrompt(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || !installPrompt || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-gray-900 border border-green-ecco/50 rounded-lg p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Install GreenKiddo</h3>
              <p className="text-sm text-gray-400 mb-3">
                Install our app for a better experience and offline access
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-4 py-2 bg-green-ecco text-black font-semibold rounded-lg hover:bg-green-300 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;

