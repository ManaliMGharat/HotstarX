import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  X, 
  Settings, 
  Subtitles, 
  Check, 
  Sparkles,
  SkipForward,
  AlertTriangle
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useHistory } from '../../context/HistoryContext';
import { useToast } from '../../context/ToastContext';
import { CATALOG } from '../../data/content';
import { getMediaCatalogEntry } from '../../data/mediaCatalog';

export const VideoPlayerModal: React.FC = () => {
  const { activeMedia, activeEpisode, isPlayerOpen, openPlayer, closePlayer } = usePlayer();
  const { getProgress, saveProgress } = useHistory();
  const { showToast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p Full HD');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState('English');
  const [activeAudioLang, setActiveAudioLang] = useState('Original (Dolby Atmos)');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const currentKey = activeEpisode?.id || activeMedia?.id || '';
  const catalogEntry = activeMedia ? getMediaCatalogEntry(currentKey) : undefined;
  const activeTitle = activeEpisode ? `${activeMedia?.title}: ${activeEpisode.title}` : activeMedia?.title;
  const rawVideoSrc = catalogEntry?.videoUrl || activeEpisode?.videoUrl || activeMedia?.videoUrl || '';
  const [videoSrc, setVideoSrc] = useState<string>(rawVideoSrc);

  // Sync video source on media change - complete reset of playback state
  useEffect(() => {
    if (activeMedia && isPlayerOpen) {
      const src = catalogEntry?.videoUrl || activeEpisode?.videoUrl || activeMedia?.videoUrl || '';
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setVideoSrc(src);
      setPlaybackError(null);
      setIsLoading(true);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBufferedPercent(0);
    }
  }, [activeMedia?.id, activeEpisode?.id, isPlayerOpen, catalogEntry?.videoUrl]);

  // Handle video playback errors - never silently play a different movie
  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    setPlaybackError(
      `Stream Unavailable: The selected media stream for "${activeTitle || 'this title'}" could not be loaded. Please check your network connection or select another title.`
    );
  }, [activeTitle]);

  // Initialize playback position from localStorage (strictly guarded by content & episode identity)
  useEffect(() => {
    if (activeMedia && isPlayerOpen) {
      // Do not resume stale progress for sports matches or demo streams
      const isSportsMatch = activeMedia.category === 'sports';
      if (isSportsMatch) return;

      const saved = getProgress(activeMedia.id);
      if (saved && videoRef.current) {
        const episodeMatches = !activeEpisode || saved.episodeId === activeEpisode.id;
        if (episodeMatches && saved.currentTime > 5 && saved.currentTime < (saved.duration - 15)) {
          videoRef.current.currentTime = saved.currentTime;
          setCurrentTime(saved.currentTime);
          showToast({
            title: 'Resuming Playback',
            description: `Resumed from ${Math.floor(saved.currentTime / 60)}m ${Math.floor(saved.currentTime % 60)}s`,
            type: 'info',
          });
        }
      }
    }
  }, [activeMedia?.id, activeEpisode?.id, isPlayerOpen, getProgress, showToast]);

  // Save progress periodically to localStorage (every 2.5 seconds, only if playing and no error)
  useEffect(() => {
    if (!activeMedia || !isPlayerOpen || duration <= 0 || playbackError) return;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && !playbackError) {
        saveProgress(activeMedia.id, videoRef.current.currentTime, videoRef.current.duration, activeEpisode?.id);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeMedia, activeEpisode, isPlayerOpen, duration, playbackError, saveProgress]);

  // Controls hide/show timer
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying && !showSettingsMenu && !showSubtitlesMenu) {
        setShowControls(false);
      }
    }, 3200);
  }, [isPlaying, showSettingsMenu, showSubtitlesMenu]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isPlayerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          closePlayer();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        seekBy(10);
      } else if (e.key === 'ArrowLeft') {
        seekBy(-10);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerOpen, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.duration || 0,
      Math.max(0, videoRef.current.currentTime + seconds)
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * (duration || 0));
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const playNextEpisode = () => {
    if (!activeMedia) return;

    if (activeMedia.episodes && activeMedia.episodes.length > 0) {
      const currentIndex = activeEpisode 
        ? activeMedia.episodes.findIndex(e => e.id === activeEpisode.id) 
        : 0;
      
      if (currentIndex < activeMedia.episodes.length - 1) {
        const nextEp = activeMedia.episodes[currentIndex + 1];
        openPlayer(activeMedia, nextEp);
        showToast({
          title: 'Playing Next Episode',
          description: `Episode ${nextEp.episodeNumber}: ${nextEp.title}`,
          type: 'info',
        });
        return;
      }
    }

    // Otherwise play next recommended title within same category or matching genre
    const relatedItem = CATALOG.find(
      item => item.id !== activeMedia.id && (item.category === activeMedia.category || item.genre.some(g => activeMedia.genre.includes(g)))
    );
    if (relatedItem) {
      openPlayer(relatedItem);
      showToast({
        title: 'Up Next',
        description: `Now playing "${relatedItem.title}"`,
        type: 'info',
      });
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isPlayerOpen || !activeMedia) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-300"
      role="dialog"
      aria-label="Video Player"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        key={`${activeMedia.id}-${activeEpisode?.id || 'main'}-${videoSrc}`}
        crossOrigin={videoSrc.startsWith('http') ? 'anonymous' : undefined}
        src={videoSrc || undefined}
        poster={activeMedia.backdrop}
        muted={isMuted}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onError={handleVideoError}
        onTimeUpdate={() => {
          if (videoRef.current && !playbackError) {
            setCurrentTime(videoRef.current.currentTime);
            if (videoRef.current.buffered.length > 0) {
              const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
              setBufferedPercent((bufferedEnd / (videoRef.current.duration || 1)) * 100);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
            setPlaybackError(null);
            videoRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
                }
              });
          }
        }}
        onWaiting={() => {
          if (!playbackError) setIsLoading(true);
        }}
        onPlaying={() => {
          setIsLoading(false);
          setPlaybackError(null);
        }}
        onEnded={playNextEpisode}
        playsInline
      />

      {/* Simulated Subtitles Banner */}
      {subtitlesEnabled && isPlaying && activeSubtitle !== 'Off' && !playbackError && (
        <div className="absolute bottom-24 inset-x-0 z-30 pointer-events-none flex justify-center px-4">
          <p className="px-4 py-1.5 rounded-lg bg-black/85 text-white font-medium text-sm sm:text-base md:text-lg tracking-wide shadow-2xl border border-white/10 backdrop-blur-md">
            [HotstarX Audio Description • {activeSubtitle}]
          </p>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && !playbackError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-16 h-16 rounded-full border-4 border-[#00C2FF]/20 border-t-[#00C2FF] animate-spin" />
        </div>
      )}

      {/* Useful Player Error State */}
      {playbackError && (
        <div className="absolute inset-0 z-35 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4 shadow-xl">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Stream Playback Error</h3>
          <p className="text-sm text-slate-400 max-w-md text-center mb-6 leading-relaxed">
            {playbackError}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPlaybackError(null);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white text-xs font-bold shadow-lg shadow-[#00C2FF]/20 hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Playback</span>
            </button>
            <button
              onClick={closePlayer}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar (Title & Close Button) */}
      <div
        className={`absolute top-0 inset-x-0 z-40 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeMedia && videoRef.current) {
                saveProgress(activeMedia.id, videoRef.current.currentTime, videoRef.current.duration);
              }
              closePlayer();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105"
            aria-label="Back to Browse"
          >
            <X className="w-6 h-6" />
          </button>

          <div>
            <h2 className="text-sm sm:text-lg font-bold text-white tracking-wide truncate max-w-md sm:max-w-xl">
              {activeTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
              <span className="text-[#00C2FF] font-semibold">{quality}</span>
              <span>•</span>
              <span>{activeMedia.ageRating}</span>
              <span>•</span>
              {catalogEntry?.streamType === 'simulated_live' ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30">
                  DEMO FOOTAGE • SIMULATED ARENA
                </span>
              ) : catalogEntry?.streamType === 'upcoming_preview' ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30">
                  PRE-MATCH BROADCAST PREVIEW
                </span>
              ) : catalogEntry?.streamType === 'recorded' ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-stone-300 bg-stone-500/15 border border-stone-500/30">
                  RECORDED ARCHIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30">
                  LICENSED PREVIEW
                </span>
              )}
              {catalogEntry?.verifiedCategory && (
                <span className="text-stone-400 font-mono text-[11px]">
                  [{catalogEntry.verifiedCategory}]
                </span>
              )}
              {catalogEntry?.scheduledStartTime && (
                <span className="text-amber-400 text-[11px]">
                  • Broadcast: {catalogEntry.scheduledStartTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Brand Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30 text-xs font-bold font-['Outfit']">
          <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
          <span>HotstarX Cinema</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline with Buffer Indicator & Hover Timestamp */}
        <div 
          className="relative mb-3 group/progress py-2 cursor-pointer"
          onMouseMove={handleProgressHover}
          onMouseLeave={handleProgressLeave}
        >
          {/* Hover Timestamp Tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-[#091526] text-white text-[11px] font-mono font-bold shadow-xl border border-white/20 pointer-events-none z-30"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Buffer Bar Background */}
          <div className="relative w-full h-1.5 sm:h-2 rounded-lg bg-white/20 overflow-hidden">
            {/* Buffer progress */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-white/30 transition-all duration-300"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Play progress */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3]"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-x-0 top-0 bottom-0 w-full opacity-0 cursor-pointer"
            aria-label="Seek Video Timeline"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls: Play, Rewind, Forward, Next Episode, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-full bg-white text-black hover:bg-[#FF5E3A] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-lg"
              aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => seekBy(-10)}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Rewind 10 seconds (Left Arrow)"
              title="Rewind 10s (Left)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => seekBy(10)}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Forward 10 seconds (Right Arrow)"
              title="Forward 10s (Right)"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Next Episode Button */}
            <button
              onClick={playNextEpisode}
              className="p-2 text-stone-300 hover:text-[#FF5E3A] hover:bg-white/10 rounded-full transition-colors"
              aria-label="Next Episode"
              title="Next Episode"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer bg-white/20 accent-[#FF5E3A] focus:outline-none"
                aria-label="Volume Level"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs sm:text-sm font-medium text-stone-300 font-mono tracking-wider ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-stone-500"> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Subtitles, Quality, Speed Settings, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Subtitles & Audio Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSubtitlesMenu(!showSubtitlesMenu);
                  setShowSettingsMenu(false);
                }}
                className={`p-2 rounded-xl transition-all ${
                  subtitlesEnabled && activeSubtitle !== 'Off'
                    ? 'text-[#FF5E3A] bg-[#FF5E3A]/20'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Subtitles & Audio"
                title="Audio & Subtitles"
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {showSubtitlesMenu && (
                <div className="absolute right-0 bottom-full mb-3 w-56 rounded-2xl bg-[#180b2a] border border-orange-500/20 p-3 shadow-2xl z-50 text-xs space-y-2">
                  <div>
                    <div className="font-bold text-white px-1 mb-1 text-[11px] uppercase tracking-wider text-stone-400">
                      Subtitles
                    </div>
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Off'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          if (lang === 'Off') {
                            setSubtitlesEnabled(false);
                            setActiveSubtitle('Off');
                          } else {
                            setSubtitlesEnabled(true);
                            setActiveSubtitle(lang);
                          }
                          setShowSubtitlesMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-stone-300 hover:bg-white/5 hover:text-white"
                      >
                        <span>{lang}</span>
                        {activeSubtitle === lang && (
                          <Check className="w-3.5 h-3.5 text-[#FF5E3A]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <div className="font-bold text-white px-1 mb-1 text-[11px] uppercase tracking-wider text-stone-400">
                      Audio Stream
                    </div>
                    {['Original (Dolby Atmos)', 'Hindi (Dolby 5.1)', 'Tamil (Stereo)'].map((aud) => (
                      <button
                        key={aud}
                        onClick={() => {
                          setActiveAudioLang(aud);
                          setShowSubtitlesMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-stone-300 hover:bg-white/5 hover:text-white text-[11px]"
                      >
                        <span>{aud}</span>
                        {activeAudioLang === aud && <Check className="w-3.5 h-3.5 text-[#FF5E3A]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality & Speed Settings Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  setShowSubtitlesMenu(false);
                }}
                className={`p-2 rounded-xl transition-all ${
                  showSettingsMenu ? 'text-[#FF5E3A] bg-[#FF5E3A]/20' : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Playback Settings"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 bottom-full mb-3 w-56 rounded-2xl bg-[#180b2a] border border-orange-500/20 p-3 shadow-2xl z-50 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-white px-1 block mb-1 text-[11px] uppercase tracking-wider text-stone-400">Video Quality</span>
                    {['Auto', '4K Ultra HD', '1080p Full HD', '720p HD'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-lg text-stone-300 hover:bg-white/5 hover:text-white"
                      >
                        <span>{q}</span>
                        {quality === q && <Check className="w-3.5 h-3.5 text-[#FF5E3A]" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <span className="font-bold text-white px-1 block mb-1 text-[11px] uppercase tracking-wider text-stone-400">Speed</span>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => changeSpeed(spd)}
                          className={`py-1 rounded text-center font-mono ${
                            playbackSpeed === spd
                              ? 'bg-[#FF5E3A]/20 text-[#FF5E3A] font-bold border border-[#FF5E3A]'
                              : 'bg-white/5 text-stone-300 hover:bg-white/10'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
