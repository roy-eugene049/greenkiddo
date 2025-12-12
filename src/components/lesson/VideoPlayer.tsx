import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Download,
  Bookmark,
  BookmarkCheck,
  SkipBack,
  SkipForward,
  Subtitles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  url: string;
  title?: string;
  onProgress?: (progress: { played: number; playedSeconds: number }) => void;
  onEnded?: () => void;
  bookmarks?: number[];
  onBookmarkAdd?: (time: number) => void;
  onBookmarkRemove?: (time: number) => void;
  subtitles?: Array<{
    lang: string;
    label: string;
    url: string;
  }>;
  resources?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  transcript?: string;
}

const VideoPlayer = ({
  url,
  title,
  onProgress,
  onEnded,
  bookmarks = [],
  onBookmarkAdd,
  onBookmarkRemove,
  subtitles = [],
  resources = [],
  transcript,
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [quality, setQuality] = useState<string>('auto');
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number>();

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (playing && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing, showControls]);

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      setPlayedSeconds(state.playedSeconds);
      if (onProgress) {
        onProgress({ played: state.played, playedSeconds: state.playedSeconds });
      }
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.currentTarget.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue);
    }
    setSeeking(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const togglePlay = () => {
    setPlaying(!playing);
    setShowControls(true);
  };

  const skipBackward = () => {
    if (playerRef.current) {
      const newTime = Math.max(0, playedSeconds - 10);
      playerRef.current.seekTo(newTime);
    }
  };

  const skipForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(duration, playedSeconds + 10);
      playerRef.current.seekTo(newTime);
    }
  };

  const handleBookmark = () => {
    const currentTime = Math.floor(playedSeconds);
    if (bookmarks.includes(currentTime)) {
      onBookmarkRemove?.(currentTime);
    } else {
      onBookmarkAdd?.(currentTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePictureInPicture = async () => {
    if (containerRef.current && 'requestPictureInPicture' in HTMLVideoElement.prototype) {
      try {
        const videoElement = containerRef.current.querySelector('video');
        if (videoElement) {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else {
            await videoElement.requestPictureInPicture();
          }
        }
      } catch (error) {
        console.error('Picture-in-picture not supported:', error);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden border border-gray-800"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (playing) {
          setTimeout(() => setShowControls(false), 2000);
        }
      }}
    >
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          width="100%"
          height="100%"
          onProgress={handleProgress as any}
          onDuration={setDuration}
          onEnded={onEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                ...(selectedSubtitle && {
                  crossOrigin: 'anonymous',
                }),
              },
              tracks: subtitles
                .filter(sub => sub.lang === selectedSubtitle)
                .map(sub => ({
                  kind: 'subtitles' as const,
                  srcLang: sub.lang,
                  src: sub.url,
                  label: sub.label,
                  default: false,
                })),
            },
          } as any}
        />

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
                {title && (
                  <h3 className="text-white font-semibold text-lg truncate max-w-md">
                    {title}
                  </h3>
                )}
                <div className="flex items-center gap-2">
                  {subtitles.length > 0 && (
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                      title="Subtitles"
                    >
                      <Subtitles className="w-5 h-5" />
                    </button>
                  )}
                  {resources.length > 0 && (
                    <button
                      onClick={() => setShowResources(!showResources)}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                      title="Resources"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  {transcript && (
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="px-3 py-1.5 text-white hover:bg-white/20 rounded transition-colors text-sm"
                    >
                      Transcript
                    </button>
                  )}
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <button
                  onClick={togglePlay}
                  className="p-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  {playing ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-auto">
                {/* Progress Bar */}
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  {/* Bookmarks on progress bar */}
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark}
                      className="absolute top-0 w-1 h-2 bg-green-ecco"
                      style={{ left: `${(bookmark / duration) * 100}%` }}
                      title={`Bookmark at ${formatTime(bookmark)}`}
                    />
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                    >
                      {playing ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={skipBackward}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                      title="Rewind 10s"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={skipForward}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                      title="Forward 10s"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                    >
                      {muted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="0.01"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white text-sm min-w-[60px]">
                      {formatTime(playedSeconds)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded transition-colors ${
                        bookmarks.includes(Math.floor(playedSeconds))
                          ? 'text-green-ecco hover:bg-white/20'
                          : 'text-white hover:bg-white/20'
                      }`}
                      title="Add bookmark"
                    >
                      {bookmarks.includes(Math.floor(playedSeconds)) ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handlePictureInPicture}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                      title="Picture-in-picture"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                    >
                      {fullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 min-w-[200px] shadow-xl"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Playback Speed
                  </label>
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}x
                      </option>
                    ))}
                  </select>
                </div>
                {subtitles.length > 0 && (
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Subtitles
                    </label>
                    <select
                      value={selectedSubtitle || ''}
                      onChange={(e) => setSelectedSubtitle(e.target.value || null)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="">Off</option>
                      {subtitles.map((sub) => (
                        <option key={sub.lang} value={sub.lang}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Panel */}
        <AnimatePresence>
          {showResources && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-16 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 min-w-[250px] max-h-[400px] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Resources</h4>
                <button
                  onClick={() => setShowResources(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    download
                    className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Download className="w-4 h-4 text-green-ecco" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {resource.name}
                      </p>
                      <p className="text-gray-400 text-xs">{resource.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript Panel */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-[200px] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">Transcript</h4>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #34f63a;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #34f63a;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;

