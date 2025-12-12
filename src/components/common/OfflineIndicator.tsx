import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { isOnline, onOnlineStatusChange } from '../../services/pwaService';
import { getOfflineStatus } from '../../services/offlineService';

const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(getOfflineStatus());

  useEffect(() => {
    const cleanup = onOnlineStatusChange(
      () => {
        setOnline(true);
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
      },
      () => {
        setOnline(false);
        setShowStatus(true);
      }
    );

    // Update status periodically
    const interval = setInterval(() => {
      setStatus(getOfflineStatus());
    }, 5000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  if (!showStatus && online) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 p-4 ${
          online ? 'bg-green-ecco/90' : 'bg-red-500/90'
        } text-white`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {online ? (
              <>
                <Wifi className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Back Online</p>
                  <p className="text-sm opacity-90">
                    {status.pendingSync > 0
                      ? `Syncing ${status.pendingSync} pending actions...`
                      : 'All changes synced'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <div>
                  <p className="font-semibold">You're Offline</p>
                  <p className="text-sm opacity-90">
                    {status.cachedCourses > 0
                      ? `${status.cachedCourses} courses available offline`
                      : 'Limited functionality available'}
                  </p>
                </div>
              </>
            )}
          </div>
          {online && status.pendingSync > 0 && (
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Syncing...</span>
            </div>
          )}
          {!online && (
            <div className="flex items-center gap-2">
              <CloudOff className="w-4 h-4" />
              <span className="text-sm">
                {Math.round(status.cacheSize / 1024)}KB cached
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator;

