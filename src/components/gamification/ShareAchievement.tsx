import { Share2, Twitter, Facebook, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Achievement } from '../../types/gamification';

interface ShareAchievementProps {
  achievement: Achievement;
  onClose?: () => void;
}

export const ShareAchievement = ({ achievement, onClose }: ShareAchievementProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareText = `🎉 I just unlocked the "${achievement.name}" achievement on GreenKiddo! ${achievement.description} #GreenKiddo #SustainabilityLearning`;
  const shareUrl = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Unlocked: ${achievement.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Share Your Achievement</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{achievement.icon}</span>
          <div>
            <div className="text-white font-semibold">{achievement.name}</div>
            <div className="text-sm text-gray-400">{achievement.description}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco hover:bg-green-ecco/80 text-black font-semibold rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white font-semibold rounded-lg transition-colors"
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </button>

          <button
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2]/80 text-white font-semibold rounded-lg transition-colors"
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

